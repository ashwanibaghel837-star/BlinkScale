import { services } from "@/lib/content";
import {
  BrandMark,
  DribbbleIcon,
  LinkedInIcon,
  XIcon,
} from "@/components/ui/Icons";

const footerLinks = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Why Us", href: "#why-choose-us" },
  { label: "Process", href: "#process" },
  { label: "Work", href: "#portfolio" },
  { label: "Industries", href: "#industries" },
];

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com", icon: LinkedInIcon },
  { label: "Dribbble", href: "https://dribbble.com", icon: DribbbleIcon },
  { label: "X", href: "https://x.com", icon: XIcon },
];

const launchYear = 2026;

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] py-10">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <div className="inline-flex items-center gap-3">
              <img
                src="/logo.png"
                alt="BizzVector Logo"
                className="h-12 w-auto object-contain"
              />
              <div>
                <div className="font-display text-base font-bold uppercase tracking-[0.16em]">
                  <span className="text-slate-300">Bizz</span>
                  <span className="text-cyan-500">Vector</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400 mt-0.5">
                  Build. Automate. Scale.
                </div>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Custom Software • AI Solutions • Business Automation • Websites
            </p>
          </div>

          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-slate-400">
              Links
            </div>
            <div className="mt-4 space-y-3">
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="focus-ring block rounded-full text-sm text-slate-300 transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-slate-400">
              Services
            </div>
            <div className="mt-4 space-y-3">
              {services.map((service) => (
                <div key={service.title} className="text-sm text-slate-300">
                  {service.title}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-slate-400">
              Contact
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <a
                href="mailto:contact@bizzvector.com"
                className="focus-ring block rounded-full transition-colors duration-300 hover:text-white"
              >
                contact@bizzvector.com
              </a>
              <a
                href="tel:+919027872803"
                className="focus-ring block rounded-full transition-colors duration-300 hover:text-white"
              >
                +91 90278 72803
              </a>
            </div>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition duration-300 hover:border-blue-300/30 hover:bg-blue-400/10 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.08] pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {launchYear} BizzVector. Crafted for growing businesses.</p>
          <p>Built with Next.js, Tailwind CSS, and Framer Motion.</p>
        </div>
      </div>
    </footer>
  );
}
