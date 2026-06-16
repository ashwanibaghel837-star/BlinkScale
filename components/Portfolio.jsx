"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { projects } from "@/lib/content";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";
import { ArrowUpRightIcon } from "@/components/ui/Icons";

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check for desktop view to enable rotation
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize(); // Init
    window.addEventListener("resize", handleResize);
    
    // Trap focus/scroll when modal open
    if (!selectedProject) return () => window.removeEventListener("resize", handleResize);

    const onKeyDown = (event) => {
      if (event.key === "Escape") setSelectedProject(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedProject]);

  return (
    <>
      <section id="portfolio" className="section-anchor content-visibility-auto py-24 sm:py-28">
        <div className="section-shell">
          <Reveal>
            <SectionHeading
              eyebrow="Portfolio"
              title="Featured Projects"
              description="A look at what we've built, ranging from custom restaurant systems to interactive digital agency showcases and upcoming client platforms."
            />
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {projects.map((project) => (
              <TiltCard key={project.title} className="h-full">
                <motion.button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  whileHover={{ y: -4, rotate: isDesktop ? 1.5 : 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="glass-panel glow-frame group relative block h-full w-full overflow-hidden rounded-[34px] p-4 text-left"
                >
                  <div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,87,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(226,232,240,0.06),transparent_34%)] opacity-60 transition duration-500 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <div
                    className="pointer-events-none absolute -left-20 top-0 h-full w-16 rotate-[18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition duration-700 group-hover:translate-x-[36rem] group-hover:opacity-100"
                    aria-hidden="true"
                  />

                  <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-slate-950/40">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={1200}
                      height={900}
                      className="h-auto w-full scale-100 transition duration-700 ease-out group-hover:scale-105"
                    />

                    <div className="pointer-events-none absolute inset-0">
                      <div className="absolute inset-x-6 top-6 flex justify-between gap-4">
                        <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-blue-100/90">
                          {project.category}
                        </span>
                        <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-200">
                          {project.impact}
                        </span>
                      </div>

                      <div className="absolute inset-x-6 bottom-20 grid grid-cols-3 gap-3 opacity-60 transition duration-500 group-hover:translate-y-[-8px] group-hover:opacity-100">
                        {project.metrics.map((metric, index) => (
                          <div
                            key={metric}
                            className={`rounded-[18px] border border-white/10 px-3 py-3 text-[11px] uppercase tracking-[0.18em] text-white ${
                              index === 0 ? "bg-cyan-500/[0.14]" : "bg-white/[0.05]"
                            }`}
                          >
                            {metric}
                          </div>
                        ))}
                      </div>

                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="overflow-hidden rounded-full bg-white/[0.08]">
                          <div className="h-1.5 w-2/3 rounded-full bg-gradient-to-r from-slate-400 via-cyan-400 to-cyan-500 transition-all duration-700 group-hover:w-[88%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 mt-5 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                        {project.stack.join(" • ")}
                      </div>
                      <h3 className="mt-3 text-2xl font-semibold text-white">
                        {project.title}
                      </h3>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                        {project.spotlight}
                      </p>
                    </div>

                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white transition duration-500 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 group-hover:text-cyan-100">
                      <ArrowUpRightIcon className="h-5 w-5" />
                    </span>
                  </div>
                </motion.button>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close preview"
              className="absolute inset-0 bg-[#03050b]/80 backdrop-blur-lg"
              onClick={() => setSelectedProject(null)}
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="glass-panel glow-frame relative z-10 max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[36px] border border-white/[0.08]"
            >
              <div className="grid max-h-[92vh] gap-0 overflow-auto lg:grid-cols-[1.1fr_0.9fr]">
                <div className="relative min-h-[22rem] border-b border-white/[0.08] lg:min-h-full lg:border-b-0 lg:border-r">
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    width={1600}
                    height={1200}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050814]/80 via-transparent to-transparent" />
                </div>

                <div className="relative p-6 sm:p-8">
                  <div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,87,255,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(226,232,240,0.05),transparent_34%)]"
                    aria-hidden="true"
                  />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                          {selectedProject.category}
                        </div>
                        <h3 className="mt-4 text-4xl font-semibold text-white">
                          {selectedProject.title}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedProject(null)}
                        className="focus-ring rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white transition hover:bg-white/[0.1]"
                      >
                        Close
                      </button>
                    </div>

                    <p className="mt-6 text-base leading-8 text-slate-300">
                      {selectedProject.description}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-2">
                      {selectedProject.stack.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-8 rounded-[28px] border border-white/[0.08] bg-black/10 p-5">
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                        Project Spotlight
                      </div>
                      <p className="mt-4 text-base leading-8 text-slate-200">
                        {selectedProject.spotlight}
                      </p>
                    </div>

                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                      {selectedProject.metrics.map((metric, index) => (
                        <div
                          key={metric}
                          className={`rounded-[22px] border px-4 py-4 text-sm text-white ${
                            index === 0
                              ? "border-cyan-500/20 bg-cyan-500/10"
                              : "border-white/[0.08] bg-white/[0.04]"
                          }`}
                        >
                          {metric}
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-5">
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                        Why it feels premium
                      </div>
                      <p className="mt-4 text-sm leading-8 text-slate-300">
                        Motion, spacing, information hierarchy, and visual depth
                        are working together so the product looks refined at a
                        glance and more capable the longer you inspect it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
