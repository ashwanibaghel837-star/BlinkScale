"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Context exposes raw spring motion values so child components can
// read the cursor position for context-aware lighting effects.
const LightContext = createContext({ x: null, y: null });

export function useLightPosition() {
  return useContext(LightContext);
}

/**
 * Global cursor-driven soft light source.
 * - Outer blob: large (600px), very slow spring (stiffness 55), low opacity → ambient layer
 * - Inner core: small (120px), faster spring (stiffness 220) → precise cursor glow
 * - Both use only transform+opacity — zero layout work, GPU composited
 * - Light is context-aware: intensity guided by element hover states via CSS
 */
export default function LightSystem({ children }) {
  const [mounted, setMounted] = useState(false);
  const [hasPointer, setHasPointer] = useState(false);

  // Raw cursor position
  const rawX = useMotionValue(-400);
  const rawY = useMotionValue(-400);

  // Outer blob: very loose spring → feels like ambient light shifting
  const outerX = useSpring(rawX, { stiffness: 55,  damping: 22, mass: 1.4 });
  const outerY = useSpring(rawY, { stiffness: 55,  damping: 22, mass: 1.4 });

  // Inner spark: tighter spring → feels responsive
  const innerX = useSpring(rawX, { stiffness: 220, damping: 24, mass: 0.5 });
  const innerY = useSpring(rawY, { stiffness: 220, damping: 24, mass: 0.5 });

  useEffect(() => {
    setMounted(true);
    setHasPointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!mounted || !hasPointer) return;

    function onMove(e) {
      rawX.set(e.clientX - 300);
      rawY.set(e.clientY - 300);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mounted, hasPointer, rawX, rawY]);

  const showLight = mounted && hasPointer;

  return (
    <LightContext.Provider value={{ x: innerX, y: innerY }}>
      {children}

      {showLight && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
        >
          {/* Outer ambient blob — very slow, large, low opacity */}
          <motion.div
            className="absolute h-[600px] w-[600px] rounded-full"
            style={{
              x: outerX,
              y: outerY,
              background:
                "radial-gradient(circle, rgba(65,110,255,0.11) 0%, rgba(110,80,255,0.05) 45%, transparent 72%)",
              filter: "blur(48px)",
            }}
          />
          {/* Inner responsive spark */}
          <motion.div
            className="absolute h-[120px] w-[120px] rounded-full"
            style={{
              x: innerX,
              y: innerY,
              // re-offset so the 120px div centers on cursor
              translateX: "180px",
              translateY: "180px",
              background:
                "radial-gradient(circle, rgba(120,160,255,0.26) 0%, transparent 70%)",
              filter: "blur(12px)",
            }}
          />
        </div>
      )}
    </LightContext.Provider>
  );
}
