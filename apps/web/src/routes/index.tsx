import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { CTASection } from "@/components/sections/cta";
import { HeroSection } from "@/components/sections/hero";
import { WhoAmISection } from "@/components/sections/whoami";
import { WorkSection } from "@/components/sections/work";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	return (
		<>
			<Nav />
			<main>
				<HeroSection />
				<WhoAmISection />
				<WorkSection />
				<CTASection />
			</main>
			<Footer />
		</>
	);
}
