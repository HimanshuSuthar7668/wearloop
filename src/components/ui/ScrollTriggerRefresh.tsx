"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Section animations use ScrollTrigger start/end positions computed at mount.
 * Our custom @font-face fonts load with font-display:swap, so the fallback
 * font renders first and the real font swaps in afterward, reflowing every
 * section below the fold. That invalidates already-computed trigger
 * positions, which is why sections further down the page (e.g. "Fashion in
 * three steps") can get stuck at their pre-animation opacity:0 state.
 * Refreshing after fonts/images settle recalculates those positions.
 */
export default function ScrollTriggerRefresh() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh);
    const fallback = setTimeout(refresh, 1000);

    return () => {
      window.removeEventListener("load", refresh);
      clearTimeout(fallback);
    };
  }, []);

  return null;
}
