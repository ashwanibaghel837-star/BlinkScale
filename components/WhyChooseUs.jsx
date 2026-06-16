"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";
import {
  CodeIcon,
  StrategyIcon,
  SupportIcon,
  ChipIcon,
  GlobeIcon,
} from "@/components/ui/Icons";

const reasons = [
  {
    title: "Custom Solutions",
    description: "No one-size-fits-all approach. We design technology directly around your workflows and business goals.",
    icon: GlobeIcon,
    accent: "from-cyan-500/10 to-cyan-600/5",
  },
  {
    title: "Founder-Led Execution",
    description: "Work directly with decision makers. No layers of account managers, just direct collaboration with technical leads.",
    icon: StrategyIcon,
    accent: "from-slate-500/10 to-slate-600/5",
  },
  {
    title: "Modern Technology",
    description: "Built using industry-leading tools like Next.js, Tailwind CSS, and cloud platforms for speed, reliability, and scale.",
    icon: CodeIcon,
    accent: "from-cyan-500/10 to-cyan-600/5",
  },
  {
    title: "Scalable Systems",
    description: "Solutions that grow with your business. Clean codebase and modular architecture ready for your future expansion.",
    icon: ChipIcon,
    accent: "from-slate-500/10 to-slate-600/5",
  },
  {
    title: "Long-Term Support",
    description: "We're partners, not just developers. We stick around after the launch to ensure uptime, security, and continuous updates.",
    icon: SupportIcon,
    accent: "from-cyan-500/10 to-cyan-600/5",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="section-anchor content-visibility-auto py-24 sm:py-28">
      <div className="section-shell">
        <Reveal>
          <SectionHeading
            eyebrow="Why Choose Us"
            title="Built for businesses that want clarity, direct execution, and premium delivery."
            description="We eliminate unnecessary agency layers to build reliable, high-performance technology systems tailored to your operation."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 0.08} className="h-full">
                <TiltCard className="h-full">
                  <div className="glow-frame glass-panel group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#09111f]/60 p-6 sm:p-8 transition-transform duration-500 hover:scale-[1.02]">
                    {/* Atmospheric Glow */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                      aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cyan-500 to-slate-400 opacity-10 transition-opacity duration-500 group-hover:opacity-60" />

                    <div className="relative z-10 flex h-full flex-col">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-400 shadow-[0_0_15px_rgba(0,87,255,0.15)] transition-shadow duration-300 group-hover:shadow-[0_0_25px_rgba(0,87,255,0.35)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-6 text-xl font-semibold text-white sm:text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-4 text-sm leading-8 text-slate-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
