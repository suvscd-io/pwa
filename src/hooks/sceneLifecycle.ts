/** Refresh scroll measurements after intrinsic layout changes, never transforms. */
export function observeSceneLayout(page: HTMLElement, refresh: () => void) {
  const doc = page.ownerDocument;
  let active = true;
  let frame: number | undefined;
  let forceRefresh = false;
  let measuredWidth = -1;
  let measuredHeight = -1;
  let observedWidth = -1;
  let observedHeight = -1;

  const schedule = (force = false) => {
    if (!active) return;
    forceRefresh ||= force;
    if (frame !== undefined || doc.hidden) return;
    frame = window.requestAnimationFrame(() => {
      frame = undefined;
      if (!active || !page.isConnected || doc.hidden) return;
      const width = page.offsetWidth;
      const height = page.offsetHeight;
      const changed = width !== measuredWidth || height !== measuredHeight;
      measuredWidth = width;
      measuredHeight = height;
      const forced = forceRefresh;
      forceRefresh = false;
      if (changed || forced) refresh();
    });
  };
  const queue = () => schedule();
  const afterFonts = () => schedule(true);
  const onVisibility = () => { if (!doc.hidden) schedule(); };

  let resizeObserver: ResizeObserver | undefined;
  let mutationObserver: MutationObserver | undefined;
  if (typeof ResizeObserver === "function") {
    resizeObserver = new ResizeObserver((entries) => {
      const entry = entries.find((item) => item.target === page);
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width === observedWidth && height === observedHeight) return;
      observedWidth = width;
      observedHeight = height;
      schedule();
    });
    resizeObserver.observe(page);
  } else {
    // Older browsers still refresh after FAQ/interest changes. Exclude style:
    // GSAP writes transforms there every frame, without changing layout.
    if (typeof MutationObserver === "function") {
      mutationObserver = new MutationObserver(queue);
      mutationObserver.observe(page, {
        subtree: true, childList: true, characterData: true,
        attributes: true, attributeFilter: ["hidden", "open", "class"],
      });
    }
    page.addEventListener("click", queue);
    page.addEventListener("toggle", queue, true);
  }
  page.addEventListener("load", queue, true);
  window.addEventListener("resize", queue, { passive: true });
  doc.addEventListener("visibilitychange", onVisibility);
  const fontsReady = doc.fonts?.ready;
  if (fontsReady) void fontsReady.then(afterFonts, () => {});
  schedule();

  return () => {
    active = false;
    resizeObserver?.disconnect();
    mutationObserver?.disconnect();
    page.removeEventListener("click", queue);
    page.removeEventListener("toggle", queue, true);
    page.removeEventListener("load", queue, true);
    window.removeEventListener("resize", queue);
    doc.removeEventListener("visibilitychange", onVisibility);
    if (frame !== undefined) window.cancelAnimationFrame(frame);
  };
}

/** Coalesce pointer input and cache geometry until scrolling/layout invalidates it. */
export function bindScenePointer(
  hero: HTMLElement,
  move: (x: number, y: number) => void,
  settle: () => void,
) {
  const doc = hero.ownerDocument;
  let active = true;
  let frame: number | undefined;
  let bounds: DOMRect | undefined;
  let clientX = 0;
  let clientY = 0;
  let engaged = false;
  const invalidate = () => { bounds = undefined; };
  const cancel = () => {
    if (frame !== undefined) window.cancelAnimationFrame(frame);
    frame = undefined;
  };
  const pointer = (event: PointerEvent) => {
    if (!active || doc.hidden || event.pointerType === "touch") return;
    clientX = event.clientX;
    clientY = event.clientY;
    if (frame !== undefined) return;
    frame = window.requestAnimationFrame(() => {
      frame = undefined;
      if (!active || doc.hidden || !hero.isConnected) return;
      bounds ??= hero.getBoundingClientRect();
      if (!bounds.width || !bounds.height || bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
      const clamp = (value: number) => Math.max(-0.5, Math.min(0.5, value));
      engaged = true;
      move(clamp((clientX - bounds.left) / bounds.width - 0.5), clamp((clientY - bounds.top) / bounds.height - 0.5));
    });
  };
  const leave = () => {
    cancel();
    invalidate();
    if (engaged) settle();
    engaged = false;
  };
  const visibility = () => {
    cancel();
    invalidate();
  };
  hero.addEventListener("pointerenter", invalidate);
  hero.addEventListener("pointermove", pointer, { passive: true });
  hero.addEventListener("pointerleave", leave);
  hero.addEventListener("pointercancel", leave);
  window.addEventListener("scroll", invalidate, { passive: true, capture: true });
  window.addEventListener("resize", invalidate, { passive: true });
  doc.addEventListener("visibilitychange", visibility);

  return {
    invalidate,
    dispose: () => {
      active = false;
      cancel();
      hero.removeEventListener("pointerenter", invalidate);
      hero.removeEventListener("pointermove", pointer);
      hero.removeEventListener("pointerleave", leave);
      hero.removeEventListener("pointercancel", leave);
      window.removeEventListener("scroll", invalidate, true);
      window.removeEventListener("resize", invalidate);
      doc.removeEventListener("visibilitychange", visibility);
    },
  };
}
