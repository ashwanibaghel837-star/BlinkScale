"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { services } from "@/lib/content";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";
import {
  ChipIcon,
  CodeIcon,
  GlobeIcon,
  StrategyIcon,
  SupportIcon,
} from "@/components/ui/Icons";

const iconMap = {
  website:      GlobeIcon,
  software:     CodeIcon,
  support:      SupportIcon,
  hardware:     ChipIcon,
};

// Unique nebula gradient per service — each card is a mini galaxy cluster
const nebulaMap = {
  website:      "radial-gradient(ellipse at 30% 20%, rgba(0,87,255,0.22) 0%, rgba(0,87,255,0.08) 45%, transparent 72%)",
  software:     "radial-gradient(ellipse at 70% 15%, rgba(226,232,240,0.06) 0%, rgba(226,232,240,0.02) 45%, transparent 72%)",
  support:      "radial-gradient(ellipse at 40% 25%, rgba(0,87,255,0.22) 0%, rgba(0,87,255,0.08) 45%, transparent 72%)",
  hardware:     "radial-gradient(ellipse at 60% 20%, rgba(226,232,240,0.06) 0%, rgba(226,232,240,0.02) 45%, transparent 72%)",
};

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize(); // Init
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      id="services"
      className="section-anchor section-flow-fade content-visibility-auto relative z-20 -mt-28 pb-24 pt-16 sm:pb-28"
    >
      <div className="section-shell">
        <Reveal>
          <div className="glass-panel glow-frame rounded-[36px] px-5 py-8 sm:px-8 sm:py-10">
            <SectionHeading
              eyebrow="Services"
              title="What We Do"
              description="We build modular, integrated solutions that grow alongside your business. Hover through our capabilities to see how we help businesses work smarter."
            />
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 lg:grid-cols-5">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            const isActive   = activeIndex === index;
            const isNeighbour = !isActive && Math.abs(activeIndex - index) === 1;
            const nebula = nebulaMap[service.icon];

            return (
              <Reveal
                key={service.title}
                delay={index * 0.07}
                className={`h-full ${isActive ? "lg:col-span-2" : "lg:col-span-1"}`}
              >
                <TiltCard className="h-full">
                  {/* Active card animated glow ring */}
                  {isActive && (
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-[30px]"
                      animate={{
                        boxShadow: [
                          "0 0 0px 0px rgba(0, 87, 255, 0)",
                          "0 0 28px 4px rgba(0, 87, 255, 0.35)",
                          "0 0 0px 0px rgba(0, 87, 255, 0)",
                        ],
                      }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}

                  <motion.article
                    animate={{
                      opacity:  isNeighbour ? 0.62 : 1,
                      scale:    isNeighbour ? 0.985 : 1,
                      y:        isActive ? -4 : 0,
                    }}
                    whileHover={{ scale: 1.015, y: -4 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveIndex(index);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`group glow-frame relative flex h-full min-h-[300px] cursor-pointer flex-col overflow-hidden rounded-[30px] border p-6 transition-[border-color,background-color] duration-300 ease-out ${
                      isActive
                        ? "border-cyan-500/20 bg-[#09111f]/[0.9] shadow-[0_22px_60px_rgba(0,87,255,0.18)]"
                        : "border-white/[0.08] bg-[#09111f]/[0.78] hover:border-white/15"
                    }`}
                  >
                    {/* Existing gradient accent */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${service.accent} transition-opacity duration-300 ${
                        isActive ? "opacity-100" : "opacity-60"
                      }`}
                      aria-hidden="true"
                    />

                    {/* Nebula galaxy overlay — unique per service */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: nebula,
                        opacity: isActive ? 1 : 0.6,
                        transition: "opacity 0.35s ease",
                        animation: isActive ? "nebulaShimmer 3s ease-in-out infinite" : "none",
                      }}
                    />

                    <div
                      className={`absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_42%)] transition duration-300 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                      aria-hidden="true"
                    />
                    <div
                      className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent transition-opacity duration-300 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                      aria-hidden="true"
                    />

                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex items-start justify-between gap-4">
                        {/* Icon with gravity — attracted to cursor */}
                        <div
                          data-gravity
                          className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-100 shadow-[0_0_30px_rgba(0,87,255,0.18)] transition duration-500 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 group-hover:shadow-[0_0_50px_rgba(0,87,255,0.26)]"
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="text-right">
                          <div className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                            0{index + 1}
                          </div>
                          <div className="mt-2 text-xs uppercase tracking-[0.26em] text-slate-300">
                            {service.stat}
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex-1">
                        <h3 className="text-2xl font-semibold text-white">
                          {service.title}
                        </h3>
                        <p className="mt-4 text-sm leading-7 text-slate-300">
                          {service.description}
                        </p>
                      </div>

                      {/* Expanded content */}
                      <div
                        className={`overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-out ${
                          isActive ? "mt-5 max-h-60 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 overflow-y-auto custom-scrollbar max-h-[14rem] md:max-h-[16rem]">
                          <p className="text-sm leading-7 text-slate-200/95 pr-2">
                            {service.extra}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {service.bullets.map((bullet) => (
                              <span
                                key={bullet}
                                className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200"
                              >
                                {bullet}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
