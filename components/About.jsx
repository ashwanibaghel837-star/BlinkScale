"use client";

import Image from "next/image";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { CheckIcon } from "@/components/ui/Icons";
import useSafeReducedMotion from "@/components/ui/useSafeReducedMotion";

const bullets = [
  "Eliminate repetitive manual work",
  "Streamline daily business operations",
  "Create better customer experiences",
];

const trustPillars = [
  {
    title: "Custom Solutions",
    description: "No generic templates. Every line of code is written around your business workflows.",
  },
  {
    title: "Fast Delivery",
    description: "Rapid iteration cycles with direct communication and regular live previews.",
  },
  {
    title: "Long-Term Support",
    description: "We stick around post-launch to manage upgrades, updates, and system scaling.",
  },
  {
    title: "Scalable Systems",
    description: "Built on clean Next.js architecture ready for your future business expansion.",
  },
];

function TrustCard({ title, description }) {
  return (
    <div className="glow-frame group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#09111f]/60 p-5 transition-transform duration-500 hover:scale-[1.03]">
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cyan-500 to-slate-400 opacity-20 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 text-xs font-semibold">
            ✓
          </span>
          <h4 className="font-display text-base font-semibold text-white tracking-tight">{title}</h4>
        </div>
        <p className="mt-3 text-[13px] leading-6 text-slate-300">{description}</p>
      </div>
    </div>
  );
}

/**
 * About section — "stillness zone" by design.
 * Minimal animation: simple fade-in reveals, animated counters.
 * No continuous motion. Contrast with Hero's kinetic energy.
 */
export default function About() {
  return (
    <section id="about" className="section-anchor content-visibility-auto py-24 sm:py-28">
      <div className="section-shell">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Left: visual panel — Cosmic Data Core */}
          <Reveal from="left">
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[40px] border border-white/5 bg-[#030712] p-4 sm:p-8">
                       {/* Deep Space Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle at center,rgba(0,87,255,0.15)_0%,transparent_60%)]" />
              
              {/* Concentric Orbit Rings */}
              <div className="absolute h-[130%] w-[130%] animate-[spin_60s_linear_infinite] rounded-full border border-white/[0.03] border-t-white/[0.1] border-b-cyan-500/[0.2]" />
              <div className="absolute h-[85%] w-[85%] animate-[spin_40s_linear_infinite_reverse] rounded-full border border-blue-500/[0.05] border-r-blue-400/[0.25]" />
              <div className="absolute h-[50%] w-[50%] animate-[spin_20s_linear_infinite] rounded-full border border-slate-500/[0.08] border-l-slate-400/[0.15] border-dashed" />
              
              {/* The Core Image */}
              <div className="glow-frame float-card-slow relative z-10 w-full overflow-hidden rounded-[36px] bg-[#02040c]/50 p-2 shadow-[0_0_60px_rgba(0,87,255,0.15)] backdrop-blur-md">
                <Image
                  src="/about-pic.png"
                  alt="BizzVector Team and Systems"
                  width={1200}
                  height={900}
                  priority
                  className="h-auto w-full object-cover rounded-[28px] opacity-95 transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Floating HUD Elements */}
              <div data-gravity className="absolute left-[5%] top-[15%] z-20 rounded-2xl border border-cyan-400/20 bg-black/40 p-3 shadow-[0_0_20px_rgba(0,87,255,0.1)] backdrop-blur-md transition-colors hover:border-cyan-400/50">
                <div className="text-[10px] font-mono tracking-widest text-cyan-400">SYS.SYNC</div>
                <div className="mt-2 flex gap-1.5">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400/40" style={{ animationDelay: '0.2s' }} />
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400/20" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>

              <div data-gravity className="absolute bottom-[15%] right-[5%] z-20 rounded-2xl border border-slate-500/20 bg-black/40 p-4 shadow-[0_0_20px_rgba(200,200,220,0.06)] backdrop-blur-md transition-colors hover:border-slate-400/40">
                <div className="text-[10px] font-mono tracking-widest text-slate-400">UPTIME</div>
                <div className="mt-1 font-mono text-sm font-bold text-white tracking-wider">99.99%</div>
              </div>
            </div>
          </Reveal>

          {/* Right: text content — staggered reveals, intentionally still */}
          <div>
            <Reveal delay={0.08}>
              <SectionHeading
                eyebrow="About BizzVector"
                title="Technology That Solves Real Business Problems"
                description="Most businesses don't need more tools. They need better systems. At BizzVector, we help businesses eliminate repetitive work, streamline operations and create better customer experiences through modern technology."
              />
            </Reveal>

            <div className="mt-6 text-sm sm:text-base leading-8 text-slate-300">
              <p>
                From professional websites to complete business automation systems, our goal is simple: Help businesses work smarter and grow faster.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {bullets.map((item, i) => (
                <Reveal key={item} delay={0.1 + i * 0.07}>
                  <div className="glow-frame glass-panel group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 hover:bg-white/[0.04]">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-[0_0_15px_rgba(0,87,255,0.2)] transition-shadow duration-300 group-hover:shadow-[0_0_25px_rgba(0,87,255,0.4)]">
                      <CheckIcon className="h-5 w-5" />
                    </span>
                    <span className="text-sm sm:text-base font-medium text-white">{item}</span>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Trust Badges — replaces numerical stats */}
            <Reveal delay={0.22}>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {trustPillars.map((pillar) => (
                  <TrustCard
                    key={pillar.title}
                    title={pillar.title}
                    description={pillar.description}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
