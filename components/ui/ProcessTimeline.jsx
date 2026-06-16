"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Animated connector line + stager-revealed step cards
export default function ProcessTimeline({ steps }) {
  const containerRef = useRef(null);
  const lineInView = useInView(containerRef, { once: true, margin: "-80px" });

  return (
    <div className="mt-16 grid gap-6 xl:grid-cols-[0.4fr_0.6fr]">
      {/* ── Left sticky panel ── */}
      <div className="glass-panel glow-frame relative overflow-hidden rounded-[34px] px-6 py-8 sm:px-8 sm:py-10 xl:sticky xl:top-24 xl:self-start">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle at top left,rgba(0,87,255,0.15),transparent_34%),radial-gradient(circle at bottom right,rgba(226,232,240,0.06),transparent_36%)]"
          aria-hidden="true"
        />
        <div className="relative z-10">
          <span className="eyebrow">Delivery Flow</span>
          <h3 className="mt-8 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Clear steps, calm execution, and support that stays close after launch.
          </h3>
          <p className="mt-5 text-sm leading-8 text-slate-300 sm:text-base">
            Every stage stays visible, collaborative, and paced to keep momentum
            high without turning the process into noise.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[22px] border border-white/[0.08] bg-white/[0.04] px-4 py-4"
              >
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  Step 0{index + 1}
                </div>
                <div className="mt-3 text-base font-medium text-white">{step.title}</div>
                <p className="mt-2 text-sm leading-7 text-slate-300">{step.outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: animated step cards ── */}
      <div ref={containerRef} className="relative pl-0 sm:pl-8">
        {/* Animated curved SVG connector line */}
        <svg
          className="absolute bottom-6 left-0 top-6 hidden w-8 sm:block pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 32 100"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="flow-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0057ff" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#e2e8f0" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d="M 16,0 C 32,30 0,70 16,100"
            vectorEffect="non-scaling-stroke"
            fill="none"
            stroke="url(#flow-grad)"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={lineInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          />
        </svg>

        <div className="space-y-5">
          {steps.map((step, index) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, x: 24 }}
              animate={lineInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2 + index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="glass-panel glow-frame relative overflow-hidden rounded-[30px] px-6 py-6 sm:px-8 sm:py-8"
            >
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  background: `radial-gradient(circle at top right, ${step.accent}, transparent 34%)`,
                }}
                aria-hidden="true"
              />
              {/* Timeline dot */}
              <div
                className="absolute left-[-0.45rem] top-10 hidden h-4 w-4 rounded-full border border-blue-400/40 bg-[#0057ff] shadow-[0_0_24px_rgba(0,87,255,0.6)] sm:block"
                aria-hidden="true"
              />

              <div className="relative z-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div data-gravity className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-base font-semibold text-white">
                    0{index + 1}
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-200">
                    {step.outcome}
                  </div>
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-white sm:text-[1.9rem]">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
                  {step.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
