import About from "@/components/About";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import WhyChooseUs from "@/components/WhyChooseUs";
import Industries from "@/components/Industries";
import FutureOfBusiness from "@/components/FutureOfBusiness";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BizzVector",
  description:
    "BizzVector helps businesses grow faster through websites, custom software, AI solutions and business automation systems.",
  url: "https://bizzvector.com",
  email: "contact@bizzvector.com",
  areaServed: "Worldwide",
  knowsAbout: [
    "Website Development",
    "Software Development",
    "Business Automation",
    "AI Solutions",
    "Digital Presence",
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <div className="relative isolate overflow-x-hidden">
        <Navbar />
        <main>
          <Hero />
          <Services />
          <About />
          <WhyChooseUs />
          <Process />
          <Portfolio />
          <Industries />
          <Testimonials />
          <FutureOfBusiness />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </>
  );
}
