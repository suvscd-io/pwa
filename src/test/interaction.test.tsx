import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import Interests from "../components/Interests";

// jsdom cannot measure or render GSAP's scene; retain the real application
// state and accessible controls while excluding that rendering dependency.
vi.mock("../hooks/useSceneMotion", () => ({ default: () => undefined }));

const originalClipboard = Object.getOwnPropertyDescriptor(
  navigator,
  "clipboard",
);

function installMotionPreference(legacy = false, initial = false) {
  let matches = initial;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const add = (listener: (event: MediaQueryListEvent) => void) =>
    listeners.add(listener);
  const remove = (listener: (event: MediaQueryListEvent) => void) =>
    listeners.delete(listener);
  const query = {
    media: "(prefers-reduced-motion: reduce)",
    get matches() {
      return matches;
    },
    onchange: null,
    addListener: add,
    removeListener: remove,
    ...(!legacy && {
      addEventListener: (
        _type: string,
        listener: (event: MediaQueryListEvent) => void,
      ) => add(listener),
      removeEventListener: (
        _type: string,
        listener: (event: MediaQueryListEvent) => void,
      ) => remove(listener),
    }),
    dispatchEvent: () => true,
  };
  vi.stubGlobal("matchMedia", () => query);
  return {
    change(value: boolean) {
      matches = value;
      const event = { matches: value, media: query.media } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
    listenerCount: () => listeners.size,
  };
}

function setClipboard(clipboard: Pick<Clipboard, "writeText"> | undefined) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: clipboard,
  });
}

beforeEach(() => {
  installMotionPreference();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  if (originalClipboard) {
    Object.defineProperty(navigator, "clipboard", originalClipboard);
  } else {
    Reflect.deleteProperty(navigator, "clipboard");
  }
});

describe("system reduced motion", () => {
  it.each([
    { api: "modern", legacy: false },
    { api: "legacy", legacy: true },
  ])(
    "follows runtime preference changes with $api MediaQueryList listeners",
    ({ legacy }) => {
      const preference = installMotionPreference(legacy);
      const { container, unmount } = render(<App />);
      const site = container.querySelector(".site")!;

      expect(site.classList.contains("motion-paused")).toBe(false);
      act(() => preference.change(true));
      expect(site.classList.contains("motion-paused")).toBe(true);
      act(() => preference.change(false));
      expect(site.classList.contains("motion-paused")).toBe(false);

      unmount();
      expect(preference.listenerCount()).toBe(0);
    },
  );

  it("honors an initially reduced system preference without a manual pause control", () => {
    installMotionPreference(false, true);
    const { container } = render(<App />);

    expect(container.querySelector(".site")!.classList.contains("motion-paused")).toBe(true);
    expect(screen.queryByRole("button", { name: /pause|resume/i })).toBeNull();
  });

  it("keeps the page usable when matchMedia is unavailable", () => {
    vi.stubGlobal("matchMedia", undefined);
    render(<App />);

    expect(screen.getByRole("heading", { name: "Saad Chahid" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Copy email address" })).toBeDefined();
  });
});

describe("interest tabs", () => {
  function expectSelected(index: number) {
    const tabs = screen.getAllByRole("tab");
    const selected = tabs[index];
    expect(screen.getAllByRole("tab", { selected: true })).toEqual([selected]);
    expect(document.activeElement).toBe(selected);
    tabs.forEach((tab, tabIndex) => {
      expect(tab.tabIndex).toBe(tabIndex === index ? 0 : -1);
    });

    const panels = screen.getAllByRole("tabpanel");
    expect(panels).toHaveLength(1);
    expect(panels[0].id).toBe(selected.getAttribute("aria-controls"));
    expect(panels[0].getAttribute("aria-labelledby")).toBe(selected.id);
    expect(panels[0].hidden).toBe(false);
  }

  it("wraps arrow navigation while moving focus and exposing only the selected panel", async () => {
    const user = userEvent.setup();
    render(<Interests />);
    screen.getAllByRole("tab")[0].focus();
    expectSelected(0);

    await user.keyboard("{ArrowUp}");
    expectSelected(3);
    await user.keyboard("{ArrowDown}");
    expectSelected(0);
    await user.keyboard("{ArrowLeft}");
    expectSelected(3);
    await user.keyboard("{ArrowRight}");
    expectSelected(0);
    await user.keyboard("{ArrowDown}");
    expectSelected(1);
  });

  it("uses Home and End to select and focus the first and last tabs", async () => {
    const user = userEvent.setup();
    render(<Interests />);
    await user.click(screen.getByRole("tab", { name: "Software engineering" }));
    expectSelected(1);

    await user.keyboard("{End}");
    expectSelected(3);
    await user.keyboard("{Home}");
    expectSelected(0);
  });
});

describe("FAQ disclosure", () => {
  it("links every answer to its question and opens, switches, and closes answers", async () => {
    const user = userEvent.setup();
    render(<App />);
    const questions = [
      screen.getByRole("button", { name: "What am I studying?" }),
      screen.getByRole("button", { name: "What do I enjoy beyond software?" }),
      screen.getByRole("button", { name: "What could we talk about?" }),
    ];
    const answers = questions.map((question) => {
      const answer = document.getElementById(question.getAttribute("aria-controls")!);
      expect(answer).not.toBeNull();
      expect(answer!.getAttribute("role")).toBe("region");
      expect(answer!.getAttribute("aria-labelledby")).toBe(question.id);
      return answer!;
    });

    expect(questions[0].getAttribute("aria-expanded")).toBe("true");
    expect(answers.map((answer) => answer.hidden)).toEqual([false, true, true]);
    await user.click(questions[1]);
    expect(questions.map((question) => question.getAttribute("aria-expanded"))).toEqual([
      "false", "true", "false",
    ]);
    expect(answers.map((answer) => answer.hidden)).toEqual([true, false, true]);
    await user.click(questions[1]);
    expect(questions[1].getAttribute("aria-expanded")).toBe("false");
    expect(answers.map((answer) => answer.hidden)).toEqual([true, true, true]);
  });
});

describe("copy email feedback", () => {
  it("announces success only after the requested email has actually been written", async () => {
    const user = userEvent.setup();
    let finishWrite!: () => void;
    const writeText = vi.fn(() => new Promise<void>((resolve) => {
      finishWrite = resolve;
    }));
    setClipboard({ writeText });
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Copy email address" }));
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith("suvscd@gmail.com");
    expect(screen.getByRole("status").textContent).not.toMatch(/copied/i);
    await act(async () => finishWrite());
    expect(screen.getByRole("status").textContent).toMatch(/copied/i);
  });

  it("reports a rejected clipboard request without claiming success", async () => {
    const user = userEvent.setup();
    setClipboard({
      writeText: vi.fn().mockRejectedValue(new DOMException("Permission denied", "NotAllowedError")),
    });
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Copy email address" }));
    await waitFor(() => expect(screen.getByRole("status").textContent).toMatch(/unavailable/i));
    expect(screen.getByRole("status").textContent).not.toMatch(/copied/i);
    expect(screen.getByText("suvscd@gmail.com").textContent).toBe("suvscd@gmail.com");
    expect(screen.getByRole("link", { name: "Email" }).getAttribute("href")).toBe("mailto:suvscd@gmail.com");
  });

  it("provides the visible email address when the clipboard API is unavailable", async () => {
    const user = userEvent.setup();
    setClipboard(undefined);
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Copy email address" }));
    await waitFor(() => expect(screen.getByRole("status").textContent).toMatch(/unavailable/i));
    expect(screen.getByRole("status").textContent).not.toMatch(/copied/i);
    expect(screen.getByText("suvscd@gmail.com").textContent).toBe("suvscd@gmail.com");
  });
});
