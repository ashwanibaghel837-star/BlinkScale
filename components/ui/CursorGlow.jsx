"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Dual-ring cursor glow.
 * Outer ring: large, slow spring → ambient trail
 * Inner ring: tight spring → sharp responsive dot
 * Both are fixed overlays, pointer-events-none, GPU composited.
 */
export default function CursorGlow() {
  const [mounted, setMounted] = useState(false);
  const [hasPointer, setHasPointer] = useState(false);

  const rawX = useMotionValue(-300);
  const rawY = useMotionValue(-300);

  // Outer: looser, slower — follows with a heavy lag
  const outerX = useSpring(rawX, { stiffness: 90, damping: 22, mass: 1 });
  const outerY = useSpring(rawY, { stiffness: 90, damping: 22, mass: 1 });

  // Inner: tighter — nearly instant
  const innerX = useSpring(rawX, { stiffness: 300, damping: 28 });
  const innerY = useSpring(rawY, { stiffness: 300, damping: 28 });

  useEffect(() => {
    setMounted(true);
    setHasPointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!mounted || !hasPointer) return undefined;

    function onMove(e) {
      rawX.set(e.clientX - 200);
      rawY.set(e.clientY - 200);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mounted, hasPointer, rawX, rawY]);

  if (!mounted || !hasPointer) return null;

  return (
    <>
      {/* Outer ambient ring */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-20 hidden h-[400px] w-[400px] rounded-full md:block"
        style={{
          x: outerX,
          y: outerY,
          background:
            "radial-gradient(circle, rgba(0, 87, 255, 0.16) 0%, rgba(226, 232, 240, 0.05) 42%, transparent 68%)",
          filter: "blur(36px)",
        }}
      />
      {/* Inner sharp dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-20 hidden h-[120px] w-[120px] rounded-full md:block"
        style={{
          x: innerX,
          y: innerY,
          translateX: "80px",
          translateY: "80px",
          background:
            "radial-gradient(circle, rgba(0, 87, 255, 0.35) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />
    </>
  );
}
