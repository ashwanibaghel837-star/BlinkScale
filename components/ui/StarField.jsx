"use client";

/**
 * PREMIUM STARFIELD — 3-Layer Depth System + Parallax Nebulas
 * ─────────────────────────────────────────────────────────────
 * Far layer   : 75 tiny stars, slowest parallax
 * Mid layer   : 50 medium stars, steady parallax
 * Near layer  : 25 larger stars, fastest parallax
 * 
 * Nebulas     : 2 soft blobs that subtly shift with mouse
 * Shooting    : Exactly 1 shooting star at a time, triggers every 8-12s
 */

import { useEffect, useRef, useState } from "react";

// Pre-generate static star data
function genStars(count, layer) {
  const sizeRange  = { far: [0.8, 1.4], mid: [1.3, 1.8], near: [1.8, 2.5] };
  const opacRange  = { far: [0.15, 0.35], mid: [0.35, 0.6], near: [0.55, 0.8] };
  const twinklePct = { far: 0.6, mid: 0.75, near: 0.9 };
  
  const [sMin, sMax] = sizeRange[layer];
  const [oMin, oMax] = opacRange[layer];

  let seed = layer === "far" ? 1 : layer === "mid" ? 2 : 3;
  const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };

  return Array.from({ length: count }, (_, i) => {
    const twinkle = rand() < twinklePct[layer];
    return {
      id: `${layer}-${i}`,
      top: rand() * 100,
      left: rand() * 100,
      size: sMin + rand() * (sMax - sMin),
      opacity: oMin + rand() * (oMax - oMin),
      twinkle,
      twinkleDur: twinkle ? 1.5 + rand() * 2.5 : 0,  // Faster twinkle: 1.5–4.0s
      twinkleDelay: twinkle ? rand() * 5 : 0,   // tighter offset
    };
  });
}

const FAR_STARS  = genStars(120, "far");
const MID_STARS  = genStars(80, "mid");
const NEAR_STARS = genStars(40, "near");

function StarLayer({ stars, layerRef, disableTwinkle = false }) {
  return (
    <div
      ref={layerRef}
      className="pointer-events-none absolute inset-x-[-5%] top-[-100vh] h-[300vh]"
      aria-hidden="true"
      style={{ willChange: "transform" }}
    >
      {/* Tile 1: Top (-100vh) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[100vh]">
        {stars.map((s) => (
          <span
            key={`${s.id}-t1`}
            style={{
              position: "absolute",
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: "white",
              opacity: s.opacity,
              willChange: !disableTwinkle && s.twinkle ? "opacity" : "auto",
              animation: !disableTwinkle && s.twinkle ? `starTwinkle ${s.twinkleDur}s ease-in-out ${s.twinkleDelay}s infinite alternate` : "none",
            }}
          />
        ))}
      </div>

      {/* Tile 2: Center (0vh) */}
      <div className="pointer-events-none absolute inset-x-0 top-[100vh] h-[100vh]">
        {stars.map((s) => (
          <span
            key={`${s.id}-t2`}
            style={{
              position: "absolute",
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: "white",
              opacity: s.opacity,
              willChange: !disableTwinkle && s.twinkle ? "opacity" : "auto",
              animation: !disableTwinkle && s.twinkle ? `starTwinkle ${s.twinkleDur}s ease-in-out ${s.twinkleDelay}s infinite alternate` : "none",
            }}
          />
        ))}
      </div>

      {/* Tile 3: Bottom (100vh) */}
      <div className="pointer-events-none absolute inset-x-0 top-[200vh] h-[100vh]">
        {stars.map((s) => (
          <span
            key={`${s.id}-t3`}
            style={{
              position: "absolute",
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: "white",
              opacity: s.opacity,
              willChange: !disableTwinkle && s.twinkle ? "opacity" : "auto",
              animation: !disableTwinkle && s.twinkle ? `starTwinkle ${s.twinkleDur}s ease-in-out ${s.twinkleDelay}s infinite alternate` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function StarField() {
  const farRef  = useRef(null);
  const midRef  = useRef(null);
  const nearRef = useRef(null);
  const nebulaContainerRef = useRef(null);
  
  const rafRef  = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  // Single organic shooting star state
  const [shootingStar, setShootingStar] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Only run mouse parallax if the device has a fine pointer (desktop with mouse)
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    let onMouse = null;
    let onScroll = null;

    if (hasFinePointer) {
      onMouse = (e) => {
        mouseRef.current = {
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        };
      };
      window.addEventListener("mousemove", onMouse, { passive: true });

      let tx = 0.5, ty = 0.5;
      let lastScrollY = -1;
      const tick = () => {
        const dx = mouseRef.current.x - tx;
        const dy = mouseRef.current.y - ty;
        const sy = window.scrollY;
        const vh = window.innerHeight || 1000;

        // Only write to DOM if coordinates are actively changing or user is scrolling
        if (Math.abs(dx) > 0.0001 || Math.abs(dy) > 0.0001 || sy !== lastScrollY) {
          tx += dx * 0.04;
          ty += dy * 0.04;
          lastScrollY = sy;

          const ox = (tx - 0.5) * 80;
          const oy = (ty - 0.5) * 80;

          // Modulo scroll calculations for seamless looping
          const yFar = (sy * -0.06) % vh;
          const yMid = (sy * -0.14) % vh;
          const yNear = (sy * -0.25) % vh;

          // Stars parallax with hardware-accelerated translate3d
          if (farRef.current)  farRef.current.style.transform  = `translate3d(${ox * 0.25}px, ${oy * 0.25 + yFar}px, 0)`;
          if (midRef.current)  midRef.current.style.transform  = `translate3d(${ox * 0.55}px, ${oy * 0.55 + yMid}px, 0)`;
          if (nearRef.current) nearRef.current.style.transform = `translate3d(${ox * 1.1}px, ${oy * 1.1 + yNear}px, 0)`;
          
          // Nebula container parallax (translates the single nebula container containing all scattered blobs)
          if (nebulaContainerRef.current) {
            nebulaContainerRef.current.style.transform = `translate3d(${-ox * 0.5}px, ${-oy * 0.5 + sy * -0.15}px, 0)`;
          }
        }

        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } else {
      // On mobile/touch, run a high-performance passive scroll event listener
      onScroll = () => {
        const sy = window.scrollY;
        const vh = window.innerHeight || 1000;
        
        const yFar = (sy * -0.06) % vh;
        const yMid = (sy * -0.14) % vh;
        const yNear = (sy * -0.25) % vh;
        
        if (farRef.current)  farRef.current.style.transform  = `translate3d(0, ${yFar}px, 0)`;
        if (midRef.current)  midRef.current.style.transform  = `translate3d(0, ${yMid}px, 0)`;
        if (nearRef.current) nearRef.current.style.transform = `translate3d(0, ${yNear}px, 0)`;
        
        if (nebulaContainerRef.current) {
          nebulaContainerRef.current.style.transform = `translate3d(0, ${sy * -0.15}px, 0)`;
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll(); // Initialize positions
    }

    // ── Shooting Star Sequencer (Exactly 10s gap, 3 specific paths) ──
    let timeoutId;
    if (!isMobile) {
      const presetShootingStars = [
        { top: 5,  left: 10, angle: 30,  len: 160, travel: 1200, dur: 3.5 }, // TL -> BR
        { top: 15, left: 85, angle: 150, len: 160, travel: 1200, dur: 4 },   // TR -> BL
        { top: 80, left: 10, angle: -30, len: 140, travel: 1000, dur: 3.8 }, // BL -> TR
      ];
      let currentShootingIndex = 0;
      
      const triggerShootingStar = () => {
        setShootingStar(null);
        setTimeout(() => {
          setShootingStar(presetShootingStars[currentShootingIndex]);
          currentShootingIndex = (currentShootingIndex + 1) % presetShootingStars.length;
          timeoutId = setTimeout(triggerShootingStar, 10000); // exactly 10s next
        }, 50);
      };
      
      // Initial start
      timeoutId = setTimeout(triggerShootingStar, 3000);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      if (hasFinePointer && onMouse) {
        window.removeEventListener("mousemove", onMouse);
      }
      if (!hasFinePointer && onScroll) {
        window.removeEventListener("scroll", onScroll);
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(timeoutId);
    };
  }, [isMobile]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#02040c]"
      aria-hidden="true"
      role="presentation"
    >
      {/* ── Nebula Container (Translates on scroll + mouse movement) ── */}
      <div
        ref={nebulaContainerRef}
        className="pointer-events-none absolute inset-x-0 top-0 h-[400vh]"
        style={{ willChange: "transform" }}
      >
        {/* Blob 1: Electric Blue - visible at start */}
        <div style={{
          position: "absolute", top: "8vh", left: "15%",
          width: "45vw", height: "45vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 87, 255, 0.22) 0%, transparent 65%)",
          filter: "blur(70px)",
          animation: isMobile ? "none" : "auraDrift 16s ease-in-out infinite alternate",
        }} />
        
        {/* Blob 2: Silver Mist - visible early-mid scroll */}
        <div style={{
          position: "absolute", top: "65vh", right: "10%",
          width: "40vw", height: "40vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(226, 232, 240, 0.05) 0%, transparent 60%)",
          filter: "blur(65px)",
          animation: isMobile ? "none" : "auraDrift 22s ease-in-out infinite alternate-reverse",
        }} />

        {/* Blob 3: Deep Blue - visible mid scroll */}
        {!isMobile && (
          <div style={{
            position: "absolute", top: "135vh", left: "20%",
            width: "48vw", height: "48vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0, 31, 128, 0.28) 0%, transparent 68%)",
            filter: "blur(80px)",
            animation: "auraDrift 20s ease-in-out infinite alternate",
          }} />
        )}

        {/* Blob 4: Electric Blue - visible late scroll */}
        {!isMobile && (
          <div style={{
            position: "absolute", top: "210vh", right: "15%",
            width: "42vw", height: "42vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0, 87, 255, 0.16) 0%, transparent 62%)",
            filter: "blur(70px)",
            animation: "auraDrift 26s ease-in-out infinite alternate-reverse",
          }} />
        )}

        {/* Blob 5: Silver Mist - visible near bottom */}
        <div style={{
          position: "absolute", top: "280vh", left: "10%",
          width: "46vw", height: "46vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(226, 232, 240, 0.05) 0%, transparent 65%)",
          filter: "blur(75px)",
          animation: isMobile ? "none" : "auraDrift 18s ease-in-out infinite alternate",
        }} />

        {/* Blob 6: Deep Blue - visible at footer */}
        {!isMobile && (
          <div style={{
            position: "absolute", top: "350vh", right: "12%",
            width: "40vw", height: "40vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0, 31, 128, 0.24) 0%, transparent 60%)",
            filter: "blur(60px)",
            animation: "auraDrift 24s ease-in-out infinite alternate-reverse",
          }} />
        )}
      </div>

      {/* ── 3 Star Layers (Seamless looping) ── */}
      <StarLayer stars={FAR_STARS}  layerRef={farRef} disableTwinkle={isMobile} />
      {!isMobile && <StarLayer stars={MID_STARS}  layerRef={midRef} disableTwinkle={false} />}
      {!isMobile && <StarLayer stars={NEAR_STARS} layerRef={nearRef} disableTwinkle={false} />}

      {/* ── Single Shooting Star ── */}
      {shootingStar && (
        <div
          style={{
            position: "absolute",
            top: `${shootingStar.top}%`,
            left: `${shootingStar.left}%`,
            transform: `rotate(${shootingStar.angle}deg)`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <span
            className="shooting-star"
            style={{
              width: `${shootingStar.len}px`,
              animationDuration: `${shootingStar.dur}s`,
              animationIterationCount: 1,
              "--ss-travel": `${shootingStar.travel}px`,
            }}
          />
        </div>
      )}
    </div>
  );
}
