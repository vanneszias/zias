import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { CTASection } from "@/components/sections/cta";
import { HeroSection } from "@/components/sections/hero";
import { WhoAmISection } from "@/components/sections/whoami";
import { WorkSection } from "@/components/sections/work";
import { staticOgUrl } from "@/lib/og";

const SITE_URL = "https://zias.be";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zias — Crafting Digital Experiences" },
      {
        name: "description",
        content:
          "A one-person studio building websites, web apps and mobile products for brands with taste.",
      },
      { property: "og:title", content: "Zias — Crafting Digital Experiences" },
      {
        property: "og:description",
        content:
          "A one-person studio building websites, web apps and mobile products for brands with taste.",
      },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: staticOgUrl("/site") },
      { name: "twitter:title", content: "Zias — Crafting Digital Experiences" },
      {
        name: "twitter:description",
        content:
          "A one-person studio building websites, web apps and mobile products for brands with taste.",
      },
      { name: "twitter:image", content: staticOgUrl("/site") },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <HeroSection />
        <WhoAmISection />
        <WorkSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
