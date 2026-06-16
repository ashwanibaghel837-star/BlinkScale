"use client";

/**
 * GOD-LEVEL TECH SOLAR SYSTEM
 * ────────────────────────────
 * Features:
 *   • Keplerian physics (elliptical orbits, variable speed)
 *   • Per-planet depth parallax (inner = more movement, outer = less)
 *   • Fake 3D: depth-based Y-scale (planet appears bigger front, smaller back)
 *   • Rim lighting via multi-layer box-shadow insets
 *   • Atmosphere glow layer per planet (larger blurred div)
 *   • Asteroid belt (20 tiny dots in rotating ring)
 *   • Click-to-focus: centers planet, dims others, shows service card
 *   • Sun corona rays (CSS conic-gradient)
 *   • All RAF-driven — 60fps, zero WebGL
 */

import { useEffect, useRef, useState, useCallback } from "react";

export const SOLAR_SIZE = 960;
const MAX_A = 420;

const PLANETS = [
  // Inner cluster — tight, fast
  { name: "Frontend", a: 82,  ecc: 0.38, size: 6,  speed: 0.96, tilt: 12,
    gradient: "radial-gradient(circle at 34% 32%, #e2e8f0, #94a3b8 52%, #334155)",
    glow: "148,163,184", highlight: "rgba(255,255,255,0.35)" },
  // perihelion = 82*0.62 = 50.8px  ↑ sun(35)+planet(6)+gap(8) = 49 ✓

  { name: "UI / UX",  a: 110, ecc: 0.22, size: 9,  speed: 0.72, tilt: -8,
    gradient: "radial-gradient(circle at 34% 32%, #fed7aa, #fb923c 50%, #9a3412)",
    glow: "251,146,60", highlight: "rgba(255,220,170,0.4)" },
  // perihelion = 110*0.78 = 85.8px ✓

  { name: "App Dev",  a: 140, ecc: 0.28, size: 10, speed: 0.53, tilt: 5,
    gradient: "radial-gradient(circle at 34% 32%, #bfdbfe, #3b82f6 46%, #1e3a8a 80%, #14532d 100%)",
    glow: "96,165,250", highlight: "rgba(191,219,254,0.45)" },
  // perihelion = 140*0.72 = 100.8px ✓

  { name: "Backend",  a: 172, ecc: 0.30, size: 8,  speed: 0.38, tilt: -14,
    gradient: "radial-gradient(circle at 38% 30%, #fee2e2, #f87171 46%, #7f1d1d)",
    glow: "248,113,113", highlight: "rgba(254,226,226,0.4)" },
  // perihelion = 172*0.70 = 120.4px ✓  aphelion = 172*1.30 = 223.6px

  // ── Asteroid belt: 226–250px ────────────────────────────────────────────

  // Outer system — large, slow
  { name: "Cloud",    a: 278, ecc: 0.25, size: 24, speed: 0.18, tilt: 6,
    gradient: "radial-gradient(circle at 34% 32%, #fef3c7, #fbbf24 26%, #b45309 55%, #78350f)",
    glow: "217,119,6", highlight: "rgba(254,243,199,0.35)" },
  // perihelion = 278*0.75 = 208.5px ✓  aphelion = 278*1.25 = 347.5px

  { name: "DevOps",   a: 348, ecc: 0.26, size: 18, speed: 0.13, tilt: -6,
    gradient: "radial-gradient(circle at 34% 32%, #fefce8, #fde047 38%, #854d0e)",
    glow: "234,179,8", highlight: "rgba(254,252,232,0.35)",
    hasRing: true, ringColor: "rgba(253,224,71,0.6)" },
  // perihelion = 348*0.74 = 257.5px ✓  aphelion = 348*1.26 = 438.5px < 480 ✓

  { name: "R & D",    a: 390, ecc: 0.20, size: 14, speed: 0.11, tilt: 9,
    gradient: "radial-gradient(circle at 34% 32%, #e6f0ff, #0057ff 46%, #001a4d)",
    glow: "0,87,255", highlight: "rgba(230,240,255,0.35)" },
  // perihelion = 390*0.80 = 312px ✓  aphelion = 390*1.20 = 468px < 480 ✓

  { name: "Data",     a: 420, ecc: 0.12, size: 13, speed: 0.10, tilt: -4,
    gradient: "radial-gradient(circle at 34% 32%, #e0e7ff, #818cf8 46%, #1e1b4b)",
    glow: "129,140,248", highlight: "rgba(224,231,255,0.35)" },
  // perihelion = 420*0.88 = 369.6px ✓  aphelion = 420*1.12 = 470.4px < 480 ✓
];

// Asteroid belt: 24 rocks in the 226–252px gap (between Backend aphelion & Cloud perihelion)
const ASTEROIDS = Array.from({ length: 24 }, (_, i) => {
  let seed = i * 9301 + 49297;
  const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };
  return {
    angle:   rand() * 360,
    radius:  226 + rand() * 26,
    size:    0.8 + rand() * 1.5,
    opacity: 0.20 + rand() * 0.30,
  };
});


// Service info mapped to each planet
const PLANET_INFO = {
  "Frontend":  { service: "Website Development",    icon: "🌐", desc: "Modern, fast digital front doors that convert.", color: "94,163,184" },
  "UI / UX":   { service: "UI / UX Design",         icon: "🎨", desc: "Experiences that feel premium and intuitive.", color: "251,146,60" },
  "App Dev":   { service: "App Development",        icon: "📱", desc: "Scalable cross-platform mobile & web apps.", color: "96,165,250" },
  "Backend":   { service: "Backend Systems",        icon: "⚙️", desc: "Robust APIs, databases, and server logic.", color: "248,113,113" },
  "Cloud":     { service: "Cloud Infrastructure",  icon: "☁️", desc: "Scalable cloud-native deployment pipelines.", color: "217,119,6" },
  "DevOps":    { service: "DevOps & Automation",   icon: "🔄", desc: "CI/CD, monitoring and smooth deployments.", color: "234,179,8" },
  "R & D":     { service: "Research & Development", icon: "🔬", desc: "Experimental tech that becomes your edge.", color: "0,87,255" },
  "Data":      { service: "Data & Analytics",      icon: "📊", desc: "Insights and intelligence from your data.", color: "129,140,248" },
};

export default function SolarSystem() {
  const containerRef = useRef(null);
  const wrapperRefs  = useRef([]);
  const atmRefs      = useRef([]);   // atmosphere divs
  const rafRef       = useRef(null);
  const startRef     = useRef(null);

  // RAF state (no re-renders)
  const hoveredRef   = useRef(-1);
  const focusedRef   = useRef(-1);
  const posRef       = useRef(PLANETS.map(() => ({ x: 0, y: 0 })));
  const scalesRef    = useRef(PLANETS.map(() => 1));
  const mouseRef     = useRef({ x: 0, y: 0 }); // normalized -0.5 to 0.5
  const sunLightRef  = useRef({ x: 0, y: 0, op: 0.3 });
  const hasPointerRef = useRef(true);
  const prevStyles = useRef(PLANETS.map(() => ({ transform: "", zIndex: "", opacity: "", filter: "" })));
  const prevAtmStyles = useRef(PLANETS.map(() => ({ transform: "", zIndex: "", opacity: "" })));
  const prevSun = useRef({ transform: "", opacity: "" });

  // React state for card + hover rings
  const [hovered,  setHovered]  = useState(-1);
  const [focused,  setFocused]  = useState(-1); // click-selected planet index
  const [sunFocused, setSunFocused] = useState(false);
  const [hasPointer, setHasPointer] = useState(true);

  const closeSun  = useCallback(() => setSunFocused(false), []);

  const rectRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!rectRef.current) {
      rectRef.current = e.currentTarget.getBoundingClientRect();
    }
    const rect = rectRef.current;
    mouseRef.current = {
      x: (e.clientX - rect.left - rect.width  / 2) / rect.width,
      y: (e.clientY - rect.top  - rect.height / 2) / rect.height,
    };
  }, []);

  const closeFocus = useCallback(() => {
    focusedRef.current = -1;
    setFocused(-1);
    setSunFocused(false);
  }, []);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    hasPointerRef.current = finePointer;
    setHasPointer(finePointer);

    const sunMidEl = document.getElementById("sun-mid-glow");
    // Smoothed mouse position (lerped each frame for buttery movement)
    let smoothMx = 0, smoothMy = 0;
    let isVisible = true;

    const tick = (ts) => {
      if (!isVisible || document.hidden) {
        rafRef.current = null;
        return;
      }
      if (!startRef.current) startRef.current = ts;
      const t = (ts - startRef.current) / 1000;

      // Lerp mouse for smooth, lag-free parallax
      smoothMx += (mouseRef.current.x - smoothMx) * 0.05;
      smoothMy += (mouseRef.current.y - smoothMy) * 0.05;

      const h  = hoveredRef.current;
      const fc = focusedRef.current;

      let targetSunX = 0, targetSunY = 0, targetSunOp = 0.3;

      PLANETS.forEach((p, i) => {
        const el  = wrapperRefs.current[i];
        const atm = atmRefs.current[i];
        if (!el) return;

        const { a, ecc, speed, tilt, size } = p;
        const b = a * Math.sqrt(1 - ecc * ecc);

        // ── Kepler orbit ──
        const M     = t * speed;
        const theta = M + 2 * ecc * Math.sin(M) + 1.25 * ecc * ecc * Math.sin(2 * M);
        const rawX  = a * (Math.cos(theta) - ecc);
        const rawY  = b * Math.sin(theta) + Math.sin(t * speed * 4) * 1.2;

        const tRad = (tilt * Math.PI) / 180;
        const ox = rawX * Math.cos(tRad) - rawY * Math.sin(tRad);
        const oy = rawX * Math.sin(tRad) + rawY * Math.cos(tRad);

        // ── Per-planet parallax (inner moves MORE = feels closer) ──
        const parallaxFactor = 1 - (a / MAX_A) * 0.72; // 1.0 (inner) → 0.28 (outer)
        const px = smoothMx * 22 * parallaxFactor;  // Max ±11px innermost, ±3px outermost
        const py = smoothMy * 14 * parallaxFactor;  // Max ±7px innermost, ±2px outermost

        const x = ox + px;
        const y = oy + py;
        posRef.current[i] = { x, y };

        // ── Fake 3D: depth-based scale from orbital Y ──
        const depthFactor = 1 + (rawY / (b + 0.001)) * 0.055; // ±5.5% scale

        // ── Hover / focus scale lerp ──
        const isFocused = fc === i;
        const targetScale = isFocused ? 1.4 : (h === i && fc === -1) ? 1.18 : 1.0;
        scalesRef.current[i] += (targetScale - scalesRef.current[i]) * 0.12;
        const finalScale = scalesRef.current[i] * depthFactor;

        // ── Z-index: front planets (rawY > 0) on top ──
        const zBase = rawY > 0 ? 12 : 8;

        const transformStr = `translate(${x}px, ${y}px) scale(${finalScale})`;
        const zIndexStrStr = isFocused ? "40" : h === i ? "30" : `${zBase}`;

        // ── Brightness / opacity ──
        const baseBright = 1 - (i / PLANETS.length) * 0.28;
        const isFocusMode = fc !== -1;
        const isFine = hasPointerRef.current;

        let opacityStrStr = "1";
        let filterStrStr = "none";

        if (isFocusMode) {
          if (isFocused) {
            opacityStrStr = "1";
            if (isFine) {
              filterStrStr = `brightness(2) drop-shadow(0 0 ${size * 4}px rgba(${p.glow},1))`;
            }
          } else {
            opacityStrStr = "0.12";
            if (isFine) {
              filterStrStr = `brightness(0.3)`;
            }
          }
        } else if (h === -1) {
          opacityStrStr = "1";
          if (isFine) {
            filterStrStr = `brightness(${baseBright})`;
          }
        } else if (h === i) {
          opacityStrStr = "1";
          if (isFine) {
            filterStrStr = `brightness(1.9) drop-shadow(0 0 ${size * 3}px rgba(${p.glow},0.95))`;
          }
          // Sun shifts toward hovered
          const dist = Math.sqrt(ox * ox + oy * oy);
          if (dist > 0) { targetSunX = (ox / dist) * 20; targetSunY = (oy / dist) * 20; targetSunOp = 0.6; }
        } else {
          opacityStrStr = "0.2";
          if (isFine) {
            filterStrStr = `brightness(${baseBright * 0.35})`;
          }
        }

        // Apply styled values only when changed to avoid DOM write thrashing
        const prev = prevStyles.current[i];
        if (prev.transform !== transformStr) {
          el.style.transform = transformStr;
          prev.transform = transformStr;
        }
        if (prev.zIndex !== zIndexStrStr) {
          el.style.zIndex = zIndexStrStr;
          prev.zIndex = zIndexStrStr;
        }
        if (prev.opacity !== opacityStrStr) {
          el.style.opacity = opacityStrStr;
          prev.opacity = opacityStrStr;
        }
        if (prev.filter !== filterStrStr) {
          el.style.filter = filterStrStr;
          prev.filter = filterStrStr;
        }

        // ── Atmosphere layer ──
        if (atm) {
          const atmTransformStr = transformStr;
          const atmZIndexStr = `${parseInt(zIndexStrStr) - 1}`;
          const atmOpacityStr = isFocusMode ? (isFocused ? "0.55" : "0.04") : h === i ? "0.7" : "0.28";

          const prevAtm = prevAtmStyles.current[i];
          if (prevAtm.transform !== atmTransformStr) {
            atm.style.transform = atmTransformStr;
            prevAtm.transform = atmTransformStr;
          }
          if (prevAtm.zIndex !== atmZIndexStr) {
            atm.style.zIndex = atmZIndexStr;
            prevAtm.zIndex = atmZIndexStr;
          }
          if (prevAtm.opacity !== atmOpacityStr) {
            atm.style.opacity = atmOpacityStr;
            prevAtm.opacity = atmOpacityStr;
          }
        }
      });

      // ── Sun light lerp ──
      if (sunMidEl) {
        sunLightRef.current.x  += (targetSunX - sunLightRef.current.x)  * 0.07;
        sunLightRef.current.y  += (targetSunY - sunLightRef.current.y)  * 0.07;
        sunLightRef.current.op += (targetSunOp - sunLightRef.current.op) * 0.07;

        const sunTransformStr = `translate(calc(-50% + ${sunLightRef.current.x}px), calc(-50% + ${sunLightRef.current.y}px))`;
        const sunOpacityStr = `${sunLightRef.current.op}`;

        if (prevSun.current.transform !== sunTransformStr) {
          sunMidEl.style.transform = sunTransformStr;
          prevSun.current.transform = sunTransformStr;
        }
        if (prevSun.current.opacity !== sunOpacityStr) {
          sunMidEl.style.opacity = sunOpacityStr;
          prevSun.current.opacity = sunOpacityStr;
        }
      }

      if (isVisible && !document.hidden) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !document.hidden) {
          if (!rafRef.current) {
            startRef.current = null;
            rafRef.current = requestAnimationFrame(tick);
          }
        } else {
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
          }
        }
      },
      { threshold: 0.01 }
    );

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      } else {
        if (isVisible && !rafRef.current) {
          startRef.current = null;
          rafRef.current = requestAnimationFrame(tick);
        }
      }
    };

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (containerRef.current) observer.unobserve(containerRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const info = focused >= 0 ? PLANET_INFO[PLANETS[focused].name] : null;
  const focPlanet = focused >= 0 ? PLANETS[focused] : null;

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: SOLAR_SIZE, height: SOLAR_SIZE, flexShrink: 0, overflow: "visible" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseRef.current = { x: 0, y: 0 };
        rectRef.current = null;
      }}
    >

      {/* ── Click-outside backdrop (focus mode) ── */}
      {focused >= 0 && (
        <div
          onClick={closeFocus}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(3,5,18,0.68)",
            backdropFilter: "blur(3px)",
            zIndex: 35,
            cursor: "pointer",
          }}
          role="presentation"
        />
      )}

      {/* ── Orbit rings ── */}
      {PLANETS.map((p, i) => {
        const b = p.a * Math.sqrt(1 - p.ecc * p.ecc);
        const isHov = hovered === i;
        const isFoc = focused === i;
        const isAnyFoc = focused !== -1;
        const baseOp = 0.38 - i * 0.040;
        const ringOp = isFoc ? 0.65 : isHov ? Math.min(0.58, baseOp + 0.22) : isAnyFoc ? baseOp * 0.12 : hovered !== -1 ? baseOp * 0.25 : baseOp;
        return (
          <div key={p.name + "-ring"} aria-hidden style={{
            position: "absolute", top: "50%", left: "50%",
            width: 0, height: 0,
            transform: `rotate(${p.tilt}deg)`,
            pointerEvents: "none",
          }}>
            <div style={{
              position: "absolute",
              left: -p.a * (1 + p.ecc), top: -b,
              width: 2 * p.a, height: 2 * b,
              borderRadius: "50%",
              border: `1.5px solid rgba(170,195,255,${ringOp})`,
              boxShadow: (isHov || isFoc) ? "0 0 18px rgba(120,150,255,0.22)" : "none",
              transition: "border-color 0.4s ease, box-shadow 0.4s ease",
            }}/>
          </div>
        );
      })}

      {/* ── Asteroid Belt ── */}
      {hasPointer && (
        <div aria-hidden style={{
          position: "absolute", top: "50%", left: "50%",
          width: 0, height: 0,
          animation: "asteroidBeltSpin 80s linear infinite",
          pointerEvents: "none",
          opacity: focused >= 0 ? 0.05 : hovered >= 0 ? 0.3 : 0.55,
          transition: "opacity 0.6s ease",
        }}>
          {ASTEROIDS.map((a, i) => {
            const rad = (a.angle * Math.PI) / 180;
            return (
              <div key={i} style={{
                position: "absolute",
                left: Math.cos(rad) * a.radius,
                top:  Math.sin(rad) * a.radius,
                width:  a.size, height: a.size,
                borderRadius: "50%",
                background: "white",
                opacity: a.opacity,
              }}/>
            );
          })}
        </div>
      )}

      {/* ── 3-Layer Sun ── */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 6, pointerEvents: "none" }}>
        {/* Outer halo - bigger */}
        <div aria-hidden style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(234,179,8,0.25) 0%, rgba(217,119,6,0.12) 38%, rgba(180,83,0,0.05) 60%, transparent 72%)",
          animation: "sunHalo 6s ease-in-out infinite alternate",
        }}/>
        {/* Corona rays */}
        <div aria-hidden style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 220, height: 220, borderRadius: "50%",
          background: "conic-gradient(from 0deg, transparent 0deg, rgba(253,200,50,0.09) 4deg, transparent 8deg, transparent 52deg, rgba(253,200,50,0.07) 56deg, transparent 60deg, transparent 112deg, rgba(253,200,50,0.08) 116deg, transparent 120deg, transparent 172deg, rgba(253,200,50,0.06) 176deg, transparent 180deg, transparent 232deg, rgba(253,200,50,0.09) 236deg, transparent 240deg, transparent 290deg, rgba(253,200,50,0.06) 294deg, transparent 298deg, transparent 340deg, rgba(253,200,50,0.07) 344deg, transparent 348deg)",
          animation: "sunRaysSpin 18s linear infinite",
          filter: "blur(3px)",
        }}/>
        {/* Mid glow — bigger & stronger, shifts toward hovered planet */}
        <div id="sun-mid-glow" aria-hidden style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(253,224,71,0.9) 0%, rgba(251,191,36,0.42) 38%, rgba(245,158,11,0.12) 62%, transparent 78%)",
          filter: "blur(22px)",
        }}/>
        {/* Core — larger */}
        <div aria-hidden className="sun-orb" style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 70, height: 70, borderRadius: "50%",
          background: "radial-gradient(circle at 33% 33%, #ffffff 0%, #fffde7 8%, #fef08a 18%, #f59e0b 50%, #b45309 78%, #451a03 100%)",
          boxShadow: "inset -6px -6px 14px rgba(0,0,0,0.55), 0 0 20px rgba(253,224,71,0.9)",
        }}/>
        {/* Sun label: A.I. — king of tech */}
        <div aria-hidden style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, calc(-50% + 46px))",
          fontSize: 9, fontWeight: 800,
          letterSpacing: "0.4em",
          color: "rgba(253,224,71,0.9)",
          textShadow: "0 0 10px rgba(253,224,71,0.9), 0 0 22px rgba(251,191,36,0.6)",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
        }}>A.I.</div>

        {/* Clickable invisible overlay on the sun — opens A.I. card */}
        <button
          onClick={(e) => { e.stopPropagation(); setSunFocused(f => !f); setFocused(-1); focusedRef.current = -1; }}
          aria-label="Learn about AI at BizzVector"
          style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 100, height: 100,
            borderRadius: "50%",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            zIndex: 8,
          }}
        />
      </div>

      {/* ── Sun A.I. Info Card ── */}
      {sunFocused && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, calc(-50% + 160px))",
            zIndex: 50,
            width: 294,
            background: "rgba(18,12,4,0.97)",
            border: "1px solid rgba(253,200,50,0.5)",
            borderRadius: 20,
            padding: "22px 24px",
            boxShadow: "0 0 50px rgba(253,200,50,0.3), 0 20px 60px rgba(0,0,0,0.6)",
            backdropFilter: "blur(18px)",
            animation: "cardFlyIn 0.55s 0.12s cubic-bezier(0.22,1,0.36,1) both",
          }}
        >
          <button onClick={closeSun} style={{ position: "absolute", top: 12, right: 14, background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 18, cursor: "pointer", lineHeight: 1, padding: 4 }} aria-label="Close">×</button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 28 }}>🌞</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(253,220,60,1)", letterSpacing: "0.05em" }}>Artificial Intelligence</div>
              <div style={{ fontSize: 10, color: "rgba(200,170,80,0.7)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>A.I. · The Core</div>
            </div>
          </div>

          <p style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(230,210,160,0.88)", margin: 0 }}>
            AI is the gravitational force at the center of BizzVector. Every service — from Frontend to Data — is powered, accelerated, and made smarter by artificial intelligence.
          </p>

          <a href="#services" onClick={closeSun} style={{ display: "inline-block", marginTop: 16, padding: "8px 18px", borderRadius: 30, background: "rgba(253,200,50,0.12)", border: "1px solid rgba(253,200,50,0.5)", color: "rgba(253,220,60,1)", fontSize: 12, fontWeight: 600, textDecoration: "none", letterSpacing: "0.08em" }}>
            View All Services →
          </a>
        </div>
      )}


      {/* ── Atmosphere layers (one per planet, behind planet) ── */}
      {PLANETS.map((p, i) => (
        <div key={p.name + "-atm"} ref={el => atmRefs.current[i] = el} aria-hidden style={{
          position: "absolute",
          top: "50%", left: "50%",
          width: p.size * 6,
          height: p.size * 6,
          marginTop: -p.size * 3,
          marginLeft: -p.size * 3,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(${p.glow},0.35) 0%, rgba(${p.glow},0.12) 45%, transparent 72%)`,
          filter: `blur(${p.size * 0.9}px)`,
          pointerEvents: "none",
          willChange: "transform, opacity",
          transition: "opacity 0.4s ease",
        }}/>
      ))}

      {/* ── Planet wrappers ── */}
      {PLANETS.map((p, i) => {
        const isHov = hovered === i;
        const isFoc = focused === i;
        const isAnyFoc = focused !== -1;
        let labelOp = 0.72;  // Readable by default
        if (isFoc || isHov) labelOp = 1;
        else if (isAnyFoc || hovered !== -1) labelOp = 0.08;

        return (
          <div
            key={p.name}
            ref={el => wrapperRefs.current[i] = el}
            onMouseEnter={() => { hoveredRef.current = i; setHovered(i); }}
            onMouseLeave={() => { hoveredRef.current = -1; setHovered(-1); }}
            onClick={(e) => {
              e.stopPropagation();
              if (focused === i) { closeFocus(); }
              else { focusedRef.current = i; setFocused(i); }
            }}
            style={{
              position: "absolute", top: "50%", left: "50%",
              width: p.size * 2, height: p.size * 2,
              marginTop: -p.size, marginLeft: -p.size,
              cursor: "pointer",
              willChange: "transform, opacity",
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (focused === i) { closeFocus(); }
                else { focusedRef.current = i; setFocused(i); }
              }}
              onMouseEnter={() => { hoveredRef.current = i; setHovered(i); }}
              onMouseLeave={() => { hoveredRef.current = -1; setHovered(-1); }}
              style={{
                position: "absolute",
                top: -40, left: -40,
                right: -40, bottom: -40,
                borderRadius: "50%",
                cursor: "pointer",
                zIndex: 2,
                background: "transparent",
                border: "none",
                padding: 0,
              }}
              aria-label={`Select ${p.name} service`}
            />
            {/* Planet sphere with rim lighting */}
            <div style={{
              width: "100%", height: "100%",
              borderRadius: "50%",
              background: p.gradient,
              boxShadow: hasPointer ? [
                // Inset dark shadow (shadow side, away from sun)
                `inset -${p.size * 0.45}px -${p.size * 0.35}px ${p.size * 0.7}px rgba(0,0,0,0.72)`,
                // Inset highlight (lit side — facing sun)
                `inset ${p.size * 0.25}px ${p.size * 0.2}px ${p.size * 0.45}px ${p.highlight || "rgba(255,255,255,0.22)"}`,
                // Rim light (bright outer edge glow)
                `0 0 ${p.size * 0.6}px rgba(${p.glow},0.5)`,
                // Drop glow
                `0 0 ${p.size * 2.5}px rgba(${p.glow},0.5)`,
              ].join(", ") : [
                `inset -${p.size * 0.45}px -${p.size * 0.35}px ${p.size * 0.7}px rgba(0,0,0,0.72)`,
                `inset ${p.size * 0.25}px ${p.size * 0.2}px ${p.size * 0.45}px ${p.highlight || "rgba(255,255,255,0.22)"}`,
                `0 0 ${p.size * 0.5}px rgba(${p.glow},0.3)`,
              ].join(", "),
              position: "relative", overflow: "visible",
            }}>
              {/* Saturn ring */}
              {p.hasRing && (
                <div aria-hidden style={{
                  position: "absolute", top: "50%", left: "50%",
                  width: p.size * 4.6, height: p.size * 1.5,
                  transform: "translate(-50%, -50%) rotateX(72deg) rotate(16deg)",
                  borderRadius: "50%",
                  border: `2px solid ${p.ringColor}`,
                  borderBottomWidth: "3px",
                  borderTopColor: "rgba(0,0,0,0.4)",
                  boxShadow: `0 6px 14px rgba(0,0,0,0.5), 0 0 10px ${p.ringColor}`,
                  pointerEvents: "none",
                }}/>
              )}
            </div>

            {/* Label */}
            <div style={{
              position: "absolute",
              top: p.size * 2 + 12, left: "50%",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
              fontSize: 11, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: (isHov || isFoc) ? "#ffffff" : `rgb(${p.glow})`,
              opacity: labelOp,
              transition: "all 0.3s ease",
              padding: "4px 10px", borderRadius: "10px",
              border: (isHov || isFoc) ? `1px solid rgba(${p.glow},0.45)` : "1px solid transparent",
              background: (isHov || isFoc) ? "rgba(8,12,30,0.9)" : "transparent",
              backdropFilter: (isHov || isFoc) ? "blur(6px)" : "none",
              pointerEvents: "none",
            }}>
              {p.name}
            </div>
          </div>
        );
      })}

      {/* ── Focus Service Card ── */}
      {focused >= 0 && info && focPlanet && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, calc(-50% + 160px))",
            zIndex: 50,
            width: 280,
            background: "rgba(8,14,38,0.97)",
            border: `1px solid rgba(${info.color},0.4)`,
            borderRadius: 20,
            padding: "22px 24px",
            boxShadow: `0 0 40px rgba(${info.color},0.25), 0 20px 60px rgba(0,0,0,0.5)`,
            backdropFilter: "blur(18px)",
            animation: "cardFlyIn 0.55s 0.12s cubic-bezier(0.22,1,0.36,1) both",
          }}
        >
          {/* Close button */}
          <button
            onClick={closeFocus}
            style={{
              position: "absolute", top: 12, right: 14,
              background: "none", border: "none",
              color: "rgba(255,255,255,0.4)", fontSize: 18,
              cursor: "pointer", lineHeight: 1, padding: 4,
            }}
            aria-label="Close"
          >×</button>

          {/* Icon + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 28 }}>{info.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: `rgb(${info.color})`, letterSpacing: "0.05em" }}>
                {info.service}
              </div>
              <div style={{ fontSize: 10, color: "rgba(150,160,200,0.7)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>
                {focPlanet.name} · Tech Node
              </div>
            </div>
          </div>

          {/* Description */}
          <p style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(200,215,240,0.85)", margin: 0 }}>
            {info.desc}
          </p>

          {/* CTA link */}
          <a
            href="#services"
            onClick={closeFocus}
            style={{
              display: "inline-block",
              marginTop: 16,
              padding: "8px 18px",
              borderRadius: 30,
              background: `rgba(${info.color},0.15)`,
              border: `1px solid rgba(${info.color},0.5)`,
              color: `rgb(${info.color})`,
              fontSize: 12, fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "0.08em",
              transition: "background 0.2s ease",
            }}
          >
            Learn More →
          </a>
        </div>
      )}
    </div>
  );
}
