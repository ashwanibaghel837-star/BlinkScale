"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import Reveal from "@/components/ui/Reveal";

// Event Horizon rings (Accretion disk)
const RINGS = [
  { delay: "0s",    size: 340, duration: "4.2s" },
  { delay: "1.4s",  size: 340, duration: "4.2s" },
  { delay: "2.8s",  size: 340, duration: "4.2s" },
];

// Orbiting spark particles around the Black Hole
const SPARKS = Array.from({ length: 4 }, (_, i) => ({
  angle: i * 90,
  radius: 170, // pushed out to orbit the black hole
  duration: `${14 + i * 2}s`,
  size: i % 2 === 0 ? 2 : 1,     // tiny dots
  opacity: 0.15 + (i % 2) * 0.1, // faint
}));

export default function FinalCta() {
  const ref = useInView(useRef(null));

  const [formData, setFormData] = useState({
    name: "",
    business: "",
    mobile: "",
    email: "",
    requirement: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | success

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.requirement) {
      alert("Please fill in Name, Email and Requirement.");
      return;
    }
    setStatus("sending");
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", business: "", mobile: "", email: "", requirement: "" });
    }, 1200);
  };

  return (
    <section id="contact" className="section-anchor content-visibility-auto py-24 sm:py-28 relative">
      <div className="section-shell">
        <Reveal>
          <div className="glass-panel relative overflow-hidden rounded-[36px] px-5 py-14 sm:px-8 sm:py-16 lg:p-16">

            {/* Deep Space Background gradient */}
            <div
              className="absolute inset-0 opacity-40 mix-blend-screen"
              style={{
                background: "radial-gradient(ellipse at center, rgba(0,87,255,0.15) 0%, transparent 70%)"
              }}
              aria-hidden="true"
            />

            {/* The Cosmic Object: Premium Black Hole / Eclipse */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50"
            >
              {/* Accretion Disk Glow (Outer) */}
              <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,87,255,0.08)_0%,transparent_60%)] blur-[40px]" />
              
              {/* Event Horizon Pulsing Rings */}
              {RINGS.map((ring, i) => (
                <div
                  key={i}
                  style={{
                    position:     "absolute",
                    width:        ring.size,
                    height:       ring.size,
                    borderRadius: "50%",
                    border:       "1px solid rgba(0,87,255,0.12)",
                    transform:    "translate(-50%, -50%) scale(0.6)",
                    animation:    `energyRing ${ring.duration} ${ring.delay} ease-out infinite`,
                    willChange:   "transform, opacity",
                  }}
                />
              ))}

              {/* Black Hole Core */}
              <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 bg-[#02050e] shadow-[0_0_60px_rgba(0,87,255,0.08)_inset,0_0_80px_rgba(0,87,255,0.12)]" />
            </div>

            <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:text-left items-start max-w-6xl mx-auto">
              
              {/* Left Column: Direct Contacts */}
              <div>
                <span className="eyebrow">Ready to automate & grow?</span>
                <h2 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl text-white tracking-tight">
                  Let&apos;s Build Something Amazing Together
                </h2>
                <p className="mt-6 text-base leading-8 text-slate-300">
                  Whether you need a custom web platform, native mobile app, automated workflow, or AI system, our team is ready to deliver. Reach out directly or drop us your details in the form.
                </p>

                <div className="mt-10 space-y-4">
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/919027872803"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:border-green-400/30 hover:bg-green-400/5 group"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 group-hover:scale-110 transition duration-300">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.292 1.48 5.357 1.481 5.25.001 9.518-4.269 9.521-9.519.001-2.544-1.001-4.93-2.822-6.753-1.82-1.821-4.204-2.822-6.753-2.822-5.253 0-9.522 4.268-9.524 9.518-.001 2.112.553 4.177 1.606 5.975L1.442 21.6l4.24-.954zm10.573-5.26c-.287-.144-1.702-.84-1.965-.936-.264-.096-.456-.144-.648.144-.192.288-.744.936-.912 1.128-.168.192-.336.216-.624.072-2.812-1.412-4.633-3.678-5.32-4.857-.168-.288-.018-.444.126-.588.13-.13.287-.336.43-.504.145-.168.192-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.648-1.56-.888-2.136-.233-.564-.47-.487-.648-.496-.168-.008-.36-.008-.552-.008s-.504.072-.768.36c-.264.288-1.008.984-1.008 2.4s1.032 2.784 1.176 2.976c.144.192 2.032 3.102 4.921 4.347.687.296 1.224.473 1.64.606.69.22 1.32.19 1.816.115.553-.083 1.702-.696 1.944-1.368.24-.672.24-1.248.168-1.368-.072-.12-.264-.192-.552-.336z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-widest text-slate-500 font-medium">WhatsApp Us</div>
                      <div className="text-sm sm:text-base font-semibold text-white mt-0.5 group-hover:text-green-400 transition">+91 90278 72803</div>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:contact@bizzvector.com"
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:border-cyan-500/30 hover:bg-cyan-500/5 group"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition duration-300">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-widest text-slate-500 font-medium">Email Us</div>
                      <div className="text-sm sm:text-base font-semibold text-white mt-0.5 group-hover:text-cyan-400 transition">contact@bizzvector.com</div>
                    </div>
                  </a>

                  {/* Book a Call */}
                  <a
                    href="https://wa.me/919027872803?text=Hi%20BizzVector%2C%20I%20would%20like%20to%20book%20a%20consultation%20call%20to%20discuss%20our%20project%20requirements."
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/5 group"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition duration-300">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-widest text-slate-500 font-medium">Call Consultation</div>
                      <div className="text-sm sm:text-base font-semibold text-white mt-0.5 group-hover:text-cyan-400 transition">Book A Call (Via WhatsApp)</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className="rounded-[28px] border border-white/10 bg-black/45 p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cyan-500 to-slate-400 opacity-20" />
                
                {status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center"
                  >
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 text-3xl font-bold mb-6">✓</span>
                    <h3 className="text-2xl font-semibold text-white">Message Sent!</h3>
                    <p className="text-slate-300 text-sm leading-6 mt-3 max-w-sm mx-auto">
                      Thank you for reaching out. We have received your requirements and will contact you within the next few business hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="mt-8 text-xs font-semibold text-cyan-400 uppercase tracking-widest hover:text-cyan-300 transition"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h3 className="text-xl font-semibold text-white tracking-tight">Drop Your Requirements</h3>
                    <p className="text-xs text-slate-400 leading-5">Fill in your details and requirements below, and we will get back to you promptly.</p>
                    
                    <div>
                      <label htmlFor="form-name" className="block text-[11px] uppercase tracking-wider text-slate-400 mb-2 font-medium">Name <span className="text-cyan-400">*</span></label>
                      <input
                        type="text"
                        id="form-name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-400/50 focus:bg-white/[0.06] focus:outline-none transition"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="form-business" className="block text-[11px] uppercase tracking-wider text-slate-400 mb-2 font-medium">Business Name</label>
                        <input
                          type="text"
                          id="form-business"
                          name="business"
                          value={formData.business}
                          onChange={handleChange}
                          placeholder="Acme Corp"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-400/50 focus:bg-white/[0.06] focus:outline-none transition"
                        />
                      </div>
                      <div>
                        <label htmlFor="form-mobile" className="block text-[11px] uppercase tracking-wider text-slate-400 mb-2 font-medium">Mobile Number</label>
                        <input
                          type="tel"
                          id="form-mobile"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          placeholder="+91 90278 72803"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-400/50 focus:bg-white/[0.06] focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="form-email" className="block text-[11px] uppercase tracking-wider text-slate-400 mb-2 font-medium">Email Address <span className="text-cyan-400">*</span></label>
                      <input
                        type="email"
                        id="form-email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-400/50 focus:bg-white/[0.06] focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="form-req" className="block text-[11px] uppercase tracking-wider text-slate-400 mb-2 font-medium">Requirement <span className="text-cyan-400">*</span></label>
                      <textarea
                        id="form-req"
                        name="requirement"
                        required
                        rows={4}
                        value={formData.requirement}
                        onChange={handleChange}
                        placeholder="Tell us about your project or system automation requirements..."
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-400/50 focus:bg-white/[0.06] focus:outline-none transition resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="w-full rounded-xl bg-gradient-to-r from-[#0057ff] to-[#2d7dff] py-3 text-sm font-semibold text-white hover:opacity-95 active:scale-[0.98] transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_18px_40px_rgba(0,87,255,0.35)] hover:shadow-[0_22px_55px_rgba(0,87,255,0.45)]"
                      >
                        {status === "sending" ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>Sending Message...</span>
                          </>
                        ) : (
                          <span>Submit Requirement</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
