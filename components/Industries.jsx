"use client";

import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";

const industries = [
  { name: "Hotels & Hospitality", desc: "Custom booking systems, websites, and guest experience portals.", icon: "🏨", accent: "rgba(0, 87, 255, 0.12)" },
  { name: "Restaurants & Cafes", desc: "Direct customer ordering portals and automated lead flows.", icon: "🍔", accent: "rgba(226, 232, 240, 0.05)" },
  { name: "Startups", desc: "Fast, MVP software development, product strategies, and launch execution.", icon: "🚀", accent: "rgba(0, 87, 255, 0.12)" },
  { name: "NGOs", desc: "Trust-centric landing pages, donor forms, and campaign management.", icon: "🤝", accent: "rgba(226, 232, 240, 0.05)" },
  { name: "Coaching Institutes", desc: "Internal databases, booking channels, and automated student alerts.", icon: "📚", accent: "rgba(0, 87, 255, 0.12)" },
  { name: "Healthcare", desc: "Patient portals, registration systems, and scheduling automation.", icon: "⚕️", accent: "rgba(226, 232, 240, 0.05)" },
  { name: "Local Businesses", desc: "Google profile setups, digital fronts, and automated lead capture.", icon: "🏪", accent: "rgba(0, 87, 255, 0.12)" },
  { name: "Professional Services", desc: "Lead generation funnels, booking automation, and client portals.", icon: "💼", accent: "rgba(226, 232, 240, 0.05)" },
];

export default function Industries() {
  return (
    <section id="industries" className="section-anchor content-visibility-auto py-24 sm:py-28">
      <div className="section-shell">
        <Reveal>
          <SectionHeading
            eyebrow="Industries We Serve"
            title="Tailored tech systems built around your specific industry flow."
            description="We build software and websites designed to solve the real operational challenges of your niche, rather than pushing generic templates."
          />
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((ind, index) => (
            <Reveal key={ind.name} delay={index * 0.06} className="h-full">
              <TiltCard className="h-full">
                <div 
                  className="glow-frame glass-panel group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#09111f]/45 p-6 transition-all duration-300 hover:bg-[#09111f]/80"
                >
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle at top left, ${ind.accent}, transparent 65%)`
                    }}
                    aria-hidden="true"
                  />
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="text-3xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.15)] group-hover:scale-110 transition-transform duration-300 self-start">
                      {ind.icon}
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300">
                      {ind.name}
                    </h3>
                    <p className="mt-3 text-xs leading-6 text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                      {ind.desc}
                    </p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
