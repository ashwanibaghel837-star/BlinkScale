import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import LightSystem from "@/components/ui/LightSystem";
import CursorGlow from "@/components/ui/CursorGlow";
import StarField from "@/components/ui/StarField";
import GravityField from "@/components/ui/GravityField";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  metadataBase: new URL("https://bizzvector.com"),
  title: {
    default: "BizzVector | Build. Automate. Scale.",
    template: "%s | BizzVector",
  },
  description:
    "We help businesses grow faster through websites, custom software, AI solutions and business automation systems.",
  keywords: [
    "IT company website",
    "website development",
    "software development",
    "business automation",
    "AI solutions",
    "WhatsApp automation",
    "BizzVector",
    "Next.js landing page",
  ],
  openGraph: {
    title: "BizzVector | Build. Automate. Scale.",
    description:
      "We help businesses grow faster through websites, custom software, AI solutions and business automation systems.",
    url: "https://bizzvector.com",
    siteName: "BizzVector",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "BizzVector website preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BizzVector | Build. Automate. Scale.",
    description:
      "We help businesses grow faster through websites, custom software, AI solutions and business automation systems.",
    images: ["/og-image.svg"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#050814",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        {/* Starfield — fixed, z-0, behind everything */}
        <StarField />
        {/* Gravity cursor attraction for [data-gravity] elements */}
        <GravityField radius={150} maxPull={5} />
        <LightSystem>
          {children}
          <CursorGlow />
        </LightSystem>
      </body>
    </html>
  );
}
