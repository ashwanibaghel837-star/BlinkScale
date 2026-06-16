"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";

export default function FutureOfBusiness() {
  return (
    <section className="section-anchor content-visibility-auto py-20 sm:py-24">
      <div className="section-shell">
        <Reveal>
          <div className="glass-panel glow-frame relative overflow-hidden rounded-[38px] border border-white/[0.08] bg-slate-950/45 px-6 py-16 text-center sm:px-12 sm:py-20">
            {/* Cosmic portal background glow */}
            <div 
              className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,87,255,0.08)_0%,transparent_70%)] blur-[40px] pointer-events-none" 
              aria-hidden="true" 
            />
            <div 
              className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/15 animate-[spin_40s_linear_infinite] pointer-events-none"
              style={{ borderStyle: "dashed" }}
              aria-hidden="true" 
            />
            <div 
              className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(226,232,240,0.05)_0%,transparent_60%)] blur-[20px] pointer-events-none" 
              aria-hidden="true" 
            />

            <div className="relative z-10 mx-auto max-w-3xl">
              <span className="eyebrow">The Next Paradigm</span>
              <h2 className="mx-auto mt-6 text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl lg:leading-tight">
                The Future Belongs To Automated Businesses
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Businesses that embrace automation, AI, and modern software will move faster,
                serve customers better, and scale efficiently. BizzVector helps make that future possible.
              </p>
              <div className="mt-10">
                <MagneticButton href="#contact">
                  Prepare Your Business
                </MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
