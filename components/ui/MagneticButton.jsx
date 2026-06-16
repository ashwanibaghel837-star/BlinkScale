"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import useSafeReducedMotion from "@/components/ui/useSafeReducedMotion";

const variants = {
  primary:
    "bg-gradient-to-r from-[#0057ff] to-[#2d7dff] text-white shadow-[0_18px_40px_rgba(0,87,255,0.35)] hover:shadow-[0_22px_55px_rgba(0,87,255,0.45)]",
  secondary:
    "border border-white/[0.12] bg-white/[0.06] text-white hover:border-cyan-500/30 hover:bg-cyan-500/10",
  ghost:
    "border border-white/[0.12] bg-transparent text-white hover:border-cyan-500/30 hover:bg-white/[0.05]",
};

/**
 * True magnetic cursor attraction via spring-physics motion values.
 * Button physically moves toward cursor and slightly rotates based on
 * horizontal offset — snaps back on leave with inertia.
 */
export default function MagneticButton({
  children,
  href,
  variant = "primary",
  className = "",
}) {
  const reduceMotion = useSafeReducedMotion();
  const ref = useRef(null);

  const springConfig = { stiffness: 200, damping: 20, mass: 0.6 };

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawRotate = useMotionValue(0);

  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);
  const rotate = useSpring(rawRotate, { stiffness: 200, damping: 24 });

  const rectRef = useRef(null);

  function handleMouseMove(e) {
    if (reduceMotion) return;
    if (!rectRef.current && ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
    const rect = rectRef.current;
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.38;
    const dy = (e.clientY - cy) * 0.38;
    rawX.set(dx);
    rawY.set(dy);
    // Slight rotation proportional to horizontal offset
    rawRotate.set(dx * 0.07);
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
    rawRotate.set(0);
    rectRef.current = null;
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      style={reduceMotion ? {} : { x, y, rotate }}
      className={`focus-ring group relative inline-flex min-h-12 items-center justify-center overflow-hidden rounded-full px-6 py-3 text-sm font-semibold transition duration-300 ${variants[variant]} ${className}`}
    >
      {/* Shimmer sweep */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-10 w-8 rotate-[18deg] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition duration-700 group-hover:translate-x-[240px] group-hover:opacity-80"
      />
      <span className="relative z-10">{children}</span>
    </motion.a>
  );
}
