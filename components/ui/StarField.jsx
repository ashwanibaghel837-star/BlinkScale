"use client";

import { useEffect, useRef, useState } from "react";

// Pseudo-random generator with fixed seed to keep star layout consistent
function genStars(count, layer) {
  const sizeRange  = { far: [0.8, 1.4], mid: [1.3, 1.8], near: [1.8, 2.5] };
  const opacRange  = { far: [0.15, 0.35], mid: [0.35, 0.6], near: [0.55, 0.8] };
  const twinklePct = { far: 0.6, mid: 0.75, near: 0.9 };
  const parallaxSpeed = { far: 0.06, mid: 0.14, near: 0.25 };
  const parallaxMouse = { far: 0.25, mid: 0.55, near: 1.1 };
  
  const [sMin, sMax] = sizeRange[layer];
  const [oMin, oMax] = opacRange[layer];

  let seed = layer === "far" ? 12345 : layer === "mid" ? 67890 : 111213;
  const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };

  return Array.from({ length: count }, (_, i) => {
    const twinkle = rand() < twinklePct[layer];
    return {
      id: `${layer}-${i}`,
      x: -0.05 + rand() * 1.1, // slightly wider than 0..1 to hide edges during mouse move
      y: rand() * 3, // virtual Y coordinate multiplier
      size: sMin + rand() * (sMax - sMin),
      baseOpacity: oMin + rand() * (oMax - oMin),
      twinkle,
      twinkleDur: twinkle ? (1.5 + rand() * 2.5) * 1000 : 0,  // ms
      twinkleDelay: twinkle ? rand() * 5000 : 0,             // ms
      parallax: parallaxSpeed[layer],
      parallaxMouse: parallaxMouse[layer],
    };
  });
}

const FAR_STARS  = genStars(120, "far");
const MID_STARS  = genStars(80, "mid");
const NEAR_STARS = genStars(40, "near");
const ALL_STARS = [...FAR_STARS, ...MID_STARS, ...NEAR_STARS];

const NEBULAS = [
  // Blob 1: Electric Blue - visible at start
  { x: 0.15, y: 0.08, size: 0.45, color: "rgba(0, 87, 255, 0.22)", stop: 0.65, driftSpeed: 0.0002, driftAmp: 0.02 },
  // Blob 2: Silver Mist - visible early-mid scroll
  { x: 0.90, y: 0.65, size: 0.40, color: "rgba(226, 232, 240, 0.05)", stop: 0.60, driftSpeed: 0.00015, driftAmp: 0.015 },
  // Blob 3: Deep Blue - visible mid scroll
  { x: 0.20, y: 1.35, size: 0.48, color: "rgba(0, 31, 128, 0.28)", stop: 0.68, driftSpeed: 0.00018, driftAmp: 0.02 },
  // Blob 4: Electric Blue - visible late scroll
  { x: 0.85, y: 2.10, size: 0.42, color: "rgba(0, 87, 255, 0.16)", stop: 0.62, driftSpeed: 0.00012, driftAmp: 0.018 },
  // Blob 5: Silver Mist - visible near bottom
  { x: 0.10, y: 2.80, size: 0.46, color: "rgba(226, 232, 240, 0.05)", stop: 0.65, driftSpeed: 0.00022, driftAmp: 0.02 },
  // Blob 6: Deep Blue - visible at footer
  { x: 0.88, y: 3.50, size: 0.40, color: "rgba(0, 31, 128, 0.24)", stop: 0.60, driftSpeed: 0.00014, driftAmp: 0.015 },
];

const PRESET_SHOOTING_STARS = [
  { top: 5,  left: 10, angle: 30,  len: 160, travel: 1200, dur: 3.5 }, // TL -> BR
  { top: 15, left: 85, angle: 150, len: 160, travel: 1200, dur: 4 },   // TR -> BL
  { top: 80, left: 10, angle: -30, len: 140, travel: 1000, dur: 3.8 }, // BL -> TR
];

export default function StarField() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const [mounted, setMounted] = useState(false);
  
  // Ref for the active shooting star
  const activeShootingStarRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse listener
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const onMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    if (hasFinePointer) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    }

    // Shooting star trigger interval
    let timeoutId;
    let currentShootingIndex = 0;

    const triggerShootingStar = () => {
      const preset = PRESET_SHOOTING_STARS[currentShootingIndex];
      activeShootingStarRef.current = {
        ...preset,
        startTime: performance.now(),
      };
      currentShootingIndex = (currentShootingIndex + 1) % PRESET_SHOOTING_STARS.length;
      timeoutId = setTimeout(triggerShootingStar, 10000); // Trigger every 10 seconds
    };

    // Delay first shooting star by 3 seconds
    timeoutId = setTimeout(triggerShootingStar, 3000);

    // Animation Loop
    let smoothMx = 0.5;
    let smoothMy = 0.5;
    let rafId;

    const tick = (timestamp) => {
      // Lerp mouse values for smooth movement
      smoothMx += (mouseRef.current.x - smoothMx) * 0.04;
      smoothMy += (mouseRef.current.y - smoothMy) * 0.04;

      const ox = (smoothMx - 0.5) * 80;
      const oy = (smoothMy - 0.5) * 80;
      const sy = window.scrollY;

      const width = canvas.width;
      const height = canvas.height;

      // Clear screen
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Nebulas
      NEBULAS.forEach((neb) => {
        const driftX = Math.sin(timestamp * neb.driftSpeed) * neb.driftAmp * width;
        const driftY = Math.cos(timestamp * neb.driftSpeed * 0.75) * neb.driftAmp * height;

        // Position neb with scroll parallax and mouse movement
        const nebX = neb.x * width - ox * 0.5 + driftX;
        const nebY = neb.y * height - sy * 0.15 - oy * 0.5 + driftY;
        const radius = neb.size * width;

        // Visibility check (if offscreen, skip draw call)
        if (nebY + radius < 0 || nebY - radius > height) return;

        const grad = ctx.createRadialGradient(nebX, nebY, 0, nebX, nebY, radius);
        grad.addColorStop(0, neb.color);
        grad.addColorStop(neb.stop, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(nebX, nebY, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Stars (Far, Mid, Near)
      const virtualHeight = height * 3;

      ALL_STARS.forEach((star) => {
        // Calculate Y position with scroll parallax and wrap around virtual height
        let y = (star.y * virtualHeight - sy * star.parallax) % virtualHeight;
        if (y < 0) y += virtualHeight;

        // Only draw if visible on screen
        if (y < -star.size || y > height + star.size) return;

        // Calculate X position with mouse parallax
        const x = star.x * width + ox * star.parallaxMouse;

        // Twinkle opacity
        let opacity = star.baseOpacity;
        if (star.twinkle) {
          const age = (timestamp - star.twinkleDelay) / star.twinkleDur;
          const wave = Math.sin(age * Math.PI * 2); // -1 to 1
          opacity = star.baseOpacity * (0.15 + 0.85 * (wave + 1) / 2);
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, star.size / 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw Shooting Star (if active)
      if (activeShootingStarRef.current) {
        const ss = activeShootingStarRef.current;
        const elapsed = (timestamp - ss.startTime) / 1000;
        
        if (elapsed > ss.dur) {
          activeShootingStarRef.current = null;
        } else if (elapsed <= ss.dur * 0.3) { // Travel phase (first 30% of duration)
          const travelP = elapsed / (ss.dur * 0.3); // 0 to 1
          const currentTravel = travelP * ss.travel;
          const angleRad = (ss.angle * Math.PI) / 180;
          
          const startX = (ss.left / 100) * width;
          const startY = (ss.top / 100) * height;
          
          const headX = startX + Math.cos(angleRad) * currentTravel;
          const headY = startY + Math.sin(angleRad) * currentTravel;
          
          const tailX = headX - Math.cos(angleRad) * ss.len;
          const tailY = headY - Math.sin(angleRad) * ss.len;
          
          // Calculate fade in/out opacity
          const p = elapsed / ss.dur; // 0 to 0.3
          let ssOpacity = 0;
          if (p < 0.06) {
            ssOpacity = p / 0.06;
          } else if (p >= 0.06 && p <= 0.3) {
            ssOpacity = 1 - (p - 0.06) / (0.3 - 0.06);
          }
          
          // Create line gradient
          const ssGrad = ctx.createLinearGradient(tailX, tailY, headX, headY);
          ssGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
          ssGrad.addColorStop(0.5, `rgba(255, 255, 255, ${ssOpacity * 0.9})`);
          ssGrad.addColorStop(0.9, `rgba(255, 255, 255, ${ssOpacity})`);
          ssGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
          
          ctx.strokeStyle = ssGrad;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(headX, headY);
          ctx.stroke();
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (hasFinePointer) {
        window.removeEventListener("mousemove", onMouseMove);
      }
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#02040c]"
      aria-hidden="true"
      role="presentation"
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
