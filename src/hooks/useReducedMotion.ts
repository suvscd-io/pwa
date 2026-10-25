import { useEffect, useState } from "react";

const preference = "(prefers-reduced-motion: reduce)";

export default function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window.matchMedia === "function"
      ? window.matchMedia(preference).matches
      : true,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia(preference);
    const update = () => setReduced(query.matches);
    update();
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", update);
      return () => query.removeEventListener("change", update);
    }
    // Older WebKit exposes the original MediaQueryList listener API.
    if (typeof query.addListener === "function") {
      query.addListener(update);
      return () => query.removeListener(update);
    }
  }, []);

  return reduced;
}
