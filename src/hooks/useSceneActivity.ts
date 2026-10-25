import { useEffect, type RefObject } from "react";

// Let the browser tell us which scenes need decorative animation work.
export default function useSceneActivity(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const page = root.current;
    if (!page) return;
    const updateVisibility = () => page.classList.toggle("page-hidden", document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    const sections = Array.from(page.querySelectorAll("main > section"));
    const observer = typeof IntersectionObserver === "function"
      ? new IntersectionObserver(entries => {
          for (const entry of entries) {
            entry.target.classList.toggle("scene-inactive", !entry.isIntersecting);
          }
        }, { rootMargin: "120px 0px" })
      : undefined;
    sections.forEach(section => observer?.observe(section));
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
      page.classList.remove("page-hidden");
      sections.forEach(section => section.classList.remove("scene-inactive"));
    };
  }, [root]);
}
