"use client";

/**
 * PREMIUM TECH SOLAR SYSTEM
 * ─────────────────────────
 * Physics:
 *   • Kepler's 1st Law — Elliptical orbits with Sun at focus
 *   • Kepler's 2nd Law — Variable speeds (fast at perihelion, slow at aphelion)
 *   • All orbital math & lerping runs inside requestAnimationFrame
 *
 * Visuals:
 *   • 3-Layer Sun System: Core (solid), Mid Glow (shifts to hovered planet), Halo (pulsing)
 *   • Tech Labels: Visible pill on hover, clean typography
 *   • Sizes/Depths: Accurate size contrasts (Jupiter = biggest, Mercury = smallest)
 *   • Smooth JS lerping for hover states (scale, light shifts)
 */

import { useEffect, useRef, useState } from "react";

// Overall container size
export const SOLAR_SIZE = 960;

const PLANETS = [
  {
    name: "Frontend",
    a: 47,  ecc: 0.35, size: 6,   speed: 0.96, tilt: 10,
    gradient: "radial-gradient(circle at 34% 32%, #e2e8f0, #94a3b8 52%, #334155)",
    glow: "148,163,184",
  },
  {
    name: "UI / UX",
    a: 64,  ecc: 0.08, size: 9,  speed: 0.70, tilt: -4,
    gradient: "radial-gradient(circle at 34% 32%, #fed7aa, #fb923c 50%, #9a3412)",
    glow: "251,146,60",
  },
  {
    name: "App Dev",
    a: 75,  ecc: 0.12, size: 10,  speed: 0.56, tilt: 2,
    gradient: "radial-gradient(circle at 34% 32%, #bfdbfe, #3b82f6 46%, #1e3a8a 80%, #14532d 100%)",
    glow: "96,165,250",
  },
  {
    name: "Backend",
    a: 92,  ecc: 0.22, size: 8,   speed: 0.44, tilt: -7,
    gradient: "radial-gradient(circle at 38% 30%, #fee2e2, #f87171 46%, #7f1d1d)",
    glow: "248,113,113",
  },
  {
    name: "Cloud",
    a: 171, ecc: 0.22, size: 24,  speed: 0.32, tilt: 4,
    gradient: "radial-gradient(circle at 34% 32%, #fef3c7, #fbbf24 26%, #b45309 55%, #78350f)",
    glow: "217,119,6",
  },
  {
    name: "DevOps",
    a: 232, ecc: 0.24, size: 18,  speed: 0.26, tilt: -3,
    gradient: "radial-gradient(circle at 34% 32%, #fefce8, #fde047 38%, #854d0e)",
    glow: "234,179,8",
    hasRing: true,
    ringColor: "rgba(253,224,71,0.6)",
  },
  {
    name: "R & D",
    a: 329, ecc: 0.16, size: 14,  speed: 0.22, tilt: 5,
    gradient: "radial-gradient(circle at 34% 32%, #cffafe, #22d3ee 46%, #164e63)",
    glow: "34,211,238",
  },
  {
    name: "Data",
    a: 411, ecc: 0.10, size: 13,  speed: 0.18, tilt: -2,
    gradient: "radial-gradient(circle at 34% 32%, #e0e7ff, #818cf8 46%, #1e1b4b)",
    glow: "129,140,248",
  },
];

export default function SolarSystem() {
  const wrapperRefs = useRef([]); 
  const rafRef      = useRef(null);
  const startRef    = useRef(null);
  
  // Non-renders state for RAF
  const hoveredRef   = useRef(-1);
  const posRef       = useRef(PLANETS.map(() => ({ x: 0, y: 0 })));
  const scalesRef    = useRef(PLANETS.map(() => 1));
  const sunLightRef  = useRef({ x: 0, y: 0, op: 0.3 }); // Light shift towards hovered planet

  // React state just for rings & JSX rendering flags
  const [hovered, setHovered] = useState(-1);

  useEffect(() => {
    const sunMidGlowEl = document.getElementById("sun-mid-glow");

    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const t = (ts - startRef.current) / 1000;

      const h = hoveredRef.current;
      let targetSunX = 0;
      let targetSunY = 0;
      let targetSunOp = 0.3; // Default sun mid glow opacity

      PLANETS.forEach((p, i) => {
        const el = wrapperRefs.current[i];
        if (!el) return;

        const { a, ecc, speed, tilt, size } = p;
        const b = a * Math.sqrt(1 - ecc * ecc);

        // Kepler's 2nd Law (Variable speed)
        const M = t * speed;
        const theta = M + 2 * ecc * Math.sin(M) + 1.25 * ecc * ecc * Math.sin(2 * M);

        // Orbit math
        const rawX = a * (Math.cos(theta) - ecc);
        const rawY = b * Math.sin(theta) + Math.sin(t * speed * 4) * 1.5; // Wobble

        const tRad = (tilt * Math.PI) / 180;
        const x = rawX * Math.cos(tRad) - rawY * Math.sin(tRad);
        const y = rawX * Math.sin(tRad) + rawY * Math.cos(tRad);
        
        posRef.current[i] = { x, y };

        // Scale lerping for deep, smooth hover
        const targetScale = (h === i) ? 1.15 : 1;
        scalesRef.current[i] += (targetScale - scalesRef.current[i]) * 0.15; // smooth easing

        el.style.transform = `translate(${x}px, ${y}px) scale(${scalesRef.current[i]})`;

        // Brightness / opacity
        const baseBrightness = 1 - (i / PLANETS.length) * 0.28;
        if (h === -1) {
          el.style.opacity = "1";
          el.style.filter  = `brightness(${baseBrightness})`;
          el.style.zIndex  = "10";
        } else if (h === i) {
          el.style.opacity = "1";
          // Massive radiant glow on hover
          el.style.filter  = `brightness(1.8) drop-shadow(0 0 ${size * 3}px rgba(${p.glow}, 0.9))`;
          el.style.zIndex  = "30";
          
          // Sun focuses its mid-glow towards the hovered planet
          const dist = Math.sqrt(x*x + y*y);
          if (dist > 0) {
            const shiftMag = 18; // Max px shift of sun light
            targetSunX = (x / dist) * shiftMag;
            targetSunY = (y / dist) * shiftMag;
            targetSunOp = 0.55; 
          }
        } else {
          el.style.opacity = "0.22"; // Dim other planets
          el.style.filter  = `brightness(${baseBrightness * 0.4})`;
          el.style.zIndex  = "5";
        }
      });

      // Smooth lerp Sun Light Shift
      if (sunMidGlowEl) {
        sunLightRef.current.x  += (targetSunX - sunLightRef.current.x) * 0.08;
        sunLightRef.current.y  += (targetSunY - sunLightRef.current.y) * 0.08;
        sunLightRef.current.op += (targetSunOp - sunLightRef.current.op) * 0.08;
        
        sunMidGlowEl.style.transform = `translate(calc(-50% + ${sunLightRef.current.x}px), calc(-50% + ${sunLightRef.current.y}px))`;
        sunMidGlowEl.style.opacity = sunLightRef.current.op;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <div
      style={{
        position:   "relative",
        width:      SOLAR_SIZE,
        height:     SOLAR_SIZE,
        flexShrink: 0,
        overflow:   "visible",
      }}
    >
      {/* ── Elliptical Rings ─────────────────────────────────────── */}
      {PLANETS.map((p, i) => {
        const { a, ecc, tilt } = p;
        const b = a * Math.sqrt(1 - ecc * ecc);
        const isHov = hovered === i;
        const isAnyHovered = hovered !== -1;
        
        // Depth gradient: inner rings visually stronger (0.4), outer fainter (0.08)
        const baseRingOp = 0.4 - (i * 0.045); 

        let ringOpacity = baseRingOp;
        if (isHov) ringOpacity = Math.max(0.5, baseRingOp + 0.2);
        else if (isAnyHovered) ringOpacity = baseRingOp * 0.25;

        return (
          <div
            key={p.name + "-ring-wrap"}
            aria-hidden="true"
            style={{
              position:        "absolute",
              top:             "50%",
              left:            "50%",
              width:           0,
              height:          0,
              transform:       `rotate(${tilt}deg)`,
              pointerEvents:   "none",
            }}
          >
            <div
              style={{
                position:      "absolute",
                left:          -a * (1 + ecc),
                top:           -b,
                width:         2 * a,
                height:        2 * b,
                borderRadius:  "50%",
                border:        `1.5px solid rgba(160,185,255,${ringOpacity})`,
                boxShadow:     isHov ? "0 0 16px rgba(120,150,255,0.2)" : "none",
                transition:    "border-color 0.4s ease, box-shadow 0.4s ease",
              }}
            />
          </div>
        );
      })}

      {/* ── 3-Layer Cinematic Sun ─────────────────────────────────── */}
      <div style={{ position: "absolute", top: "50%", left: "50%", zIndex: 6, pointerEvents: "none" }}>
        
        {/* Layer 3: Giant Outer Halo (Slightly asymmetrical, slow pulse via CSS) */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(234,179,8,0.18) 0%, rgba(217,119,6,0.08) 40%, transparent 70%)",
            animation: "sunHalo 6s ease-in-out infinite alternate",
          }}
        />

        {/* Layer 2: Mid Glow (Shifts towards hovered planet dynamically via JS) */}
        <div
          id="sun-mid-glow"
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251,191,36,0.7) 0%, rgba(253,224,71,0.2) 45%, transparent 75%)",
            filter: "blur(18px)",
            // Dynamic opacity + transform handled inside RAF
          }}
        />

        {/* Layer 1: Central Core (Solid glowing star) */}
        <div
          aria-hidden="true"
          className="sun-orb"
          style={{
            position: "absolute",
            width: 58,  // 30% larger than old 44px
            height: 58,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #ffffff 0%, #fef08a 12%, #f59e0b 45%, #b45309 75%, #451a03 100%)",
            boxShadow: "inset -6px -6px 12px rgba(0,0,0,0.5)", // Spherical depth
          }}
        />
      </div>

      {/* ── Planets (Tech Nodes) ─────────────────────────────────── */}
      {PLANETS.map((p, i) => {
        const isHov = hovered === i;
        const isAnyHovered = hovered !== -1;
        
        let labelOp = 0.55;
        if (isHov) labelOp = 1;
        else if (isAnyHovered) labelOp = 0.1;

        return (
          <div
            key={p.name}
            ref={(el) => (wrapperRefs.current[i] = el)}
            onMouseEnter={() => { hoveredRef.current = i; setHovered(i); }}
            onMouseLeave={() => { hoveredRef.current = -1; setHovered(-1); }}
            style={{
              position:   "absolute",
              top:        "50%",
              left:       "50%",
              width:      p.size * 2,
              height:     p.size * 2,
              marginTop:  -p.size,
              marginLeft: -p.size,
              cursor:     "pointer",
              zIndex:     10,
              // Transform handled by RAF
            }}
          >
            {/* Sphere & Shading */}
            <div
              style={{
                width:        "100%",
                height:       "100%",
                borderRadius: "50%",
                background:   p.gradient,
                boxShadow:    `0 0 ${p.size * 2}px rgba(${p.glow},0.55), inset -3px -3px 8px rgba(0,0,0,0.6)`,
                position:     "relative",
                overflow:     "visible",
              }}
            >
              {/* Saturn Rings */}
              {p.hasRing && (
                <div
                  aria-hidden="true"
                  style={{
                    position:      "absolute",
                    top:           "50%",
                    left:          "50%",
                    width:         p.size * 4.6,
                    height:        p.size * 1.5,
                    transform:     "translate(-50%, -50%) rotateX(72deg) rotate(16deg)",
                    borderRadius:  "50%",
                    border:        `2px solid ${p.ringColor}`,
                    borderBottomWidth: "3px",
                    borderTopColor: "rgba(0,0,0,0.3)", // Fake 3D eclipse
                    boxShadow:     `0 6px 12px rgba(0,0,0,0.4), 0 0 10px ${p.ringColor}`,
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>

            {/* Premium Pill Label */}
            <div
              style={{
                position:      "absolute",
                top:           p.size * 2 + 12,
                left:          "50%",
                transform:     "translateX(-50%)",
                whiteSpace:    "nowrap",
                fontSize:      11,
                fontWeight:    600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color:         isHov ? "#ffffff" : `rgb(${p.glow})`,
                opacity:       labelOp,
                transition:    "all 0.3s ease",
                padding:       "4px 10px",
                borderRadius:  "10px",
                border:        isHov ? `1px solid rgba(${p.glow},0.4)` : "1px solid transparent",
                background:    isHov ? `rgba(10,14,35,0.85)` : "transparent",
                backdropFilter: isHov ? "blur(6px)" : "none",
                willChange:    "opacity, color",
                pointerEvents: "none", // Ensures mouse doesn't stutter on label
              }}
            >
              {p.name}
            </div>
          </div>
        )
      })}
    </div>
  );
}
