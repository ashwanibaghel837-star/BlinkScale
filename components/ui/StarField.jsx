"use client";

/**
 * STARFIELD — 3-Layer Depth System
 * ─────────────────────────────────
 * Far   layer: tiny (1px), very slow parallax (0.3%), ~40% twinkle
 * Mid   layer: small (1.5px), medium parallax (0.6%), ~60% twinkle
 * Near  layer: larger (2px), faster parallax (1.2%), ~80% twinkle
 *
 * Shooting stars: 5 elements, CSS animation, appear every 6-10s
 * Parallax: smooth lerp on mousemove — very subtle, never distracting
 */

import { useEffect, useRef } from "react";

// Pre-generate static star data (runs once at module load — stable across renders)
function genStars(count, layer) {
  const sizeRange   = { far: [0.9, 1.4],  mid: [1.3, 2.0],  near: [1.8, 2.8]  };
  const opacRange   = { far: [0.22, 0.42], mid: [0.42, 0.65], near: [0.58, 0.85] };
  const twinklePct  = { far: 0.38, mid: 0.58, near: 0.78 };
  const [sMin, sMax] = sizeRange[layer];
  const [oMin, oMax] = opacRange[layer];

  // Use a simple seed-based PRNG so values are stable across SSR/client
  let seed = layer === "far" ? 1 : layer === "mid" ? 2 : 3;
  const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };

  return Array.from({ length: count }, (_, i) => {
    const twinkle = rand() < twinklePct[layer];
    return {
      id:           `${layer}-${i}`,
      top:          rand() * 100,
      left:         rand() * 100,
      size:         sMin + rand() * (sMax - sMin),
      opacity:      oMin + rand() * (oMax - oMin),
      twinkle,
      twinkleDur:   twinkle ? 2 + rand() * 5 : 0,    // 2–7s
      twinkleDelay: twinkle ? rand() * 8 : 0,         // 0–8s offset
    };
  });
}

const FAR_STARS  = genStars(50, "far");
const MID_STARS  = genStars(55, "mid");
const NEAR_STARS = genStars(28, "near");

// 5 shooting stars — CSS-only, different delays for rare appearance
const SHOOTING = [
  { top: "8%",  left: "15%", angle: 22,  len: 120, delay: "1.2s",  dur: "6s"  },
  { top: "18%", left: "60%", angle: 30,  len: 90,  delay: "8.4s",  dur: "8s"  },
  { top: "5%",  left: "40%", angle: 18,  len: 150, delay: "15s",   dur: "7s"  },
  { top: "28%", left: "78%", angle: 28,  len: 100, delay: "22.5s", dur: "9s"  },
  { top: "12%", left: "28%", angle: 25,  len: 80,  delay: "31s",   dur: "6.5s"},
];

function StarLayer({ stars, layerRef }) {
  return (
    <div ref={layerRef} className="pointer-events-none absolute inset-[-5%]" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          style={{
            position:         "absolute",
            top:              `${s.top}%`,
            left:             `${s.left}%`,
            width:            s.size,
            height:           s.size,
            borderRadius:     "50%",
            background:       "white",
            opacity:          s.opacity,
            willChange:       s.twinkle ? "opacity, transform" : "auto",
            animationName:    s.twinkle ? "starTwinkle" : "none",
            animationDuration:`${s.twinkleDur}s`,
            animationDelay:   `${s.twinkleDelay}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDirection:      "alternate",
          }}
        />
      ))}
    </div>
  );
}

export default function StarField() {
  const farRef  = useRef(null);
  const midRef  = useRef(null);
  const nearRef = useRef(null);
  const rafRef  = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {

    const onMouse = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    // Smooth lerp targets
    let tx = 0.5, ty = 0.5;

    const tick = () => {
      tx += (mouseRef.current.x - tx) * 0.04;
      ty += (mouseRef.current.y - ty) * 0.04;

      // Offset from center (normalized -0.5 to +0.5), scaled to px
      const ox = (tx - 0.5) * 80;
      const oy = (ty - 0.5) * 80;

      // 3 layers move at different speeds — creates depth illusion
      if (farRef.current)  farRef.current.style.transform  = `translate(${ox * 0.3}px, ${oy * 0.3}px)`;
      if (midRef.current)  midRef.current.style.transform  = `translate(${ox * 0.65}px, ${oy * 0.65}px)`;
      if (nearRef.current) nearRef.current.style.transform = `translate(${ox * 1.2}px, ${oy * 1.2}px)`;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMouse);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      role="presentation"
    >
      {/* 3 star layers — parallax applied via RAF */}
      <StarLayer stars={FAR_STARS}  layerRef={farRef}  />
      <StarLayer stars={MID_STARS}  layerRef={midRef}  />
      <StarLayer stars={NEAR_STARS} layerRef={nearRef} />

      {/* Shooting stars — pure CSS, appear rarely */}
      {SHOOTING.map((s, i) => (
        <span
          key={i}
          className="shooting-star"
          style={{
            top:              s.top,
            left:             s.left,
            "--ss-angle":     `${s.angle}deg`,
            "--ss-len":       `${s.len}px`,
            animationDelay:   s.delay,
            animationDuration: s.dur,
          }}
        />
      ))}
    </div>
  );
}
