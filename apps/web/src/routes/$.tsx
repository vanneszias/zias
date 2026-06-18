import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PillButton } from "@zias/ui/components/pill-button";
import { Section, SectionInner } from "@zias/ui/components/section";
import { ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "404 — Page not found | Zias" },
      {
        name: "description",
        content:
          "This page slipped out of the frame. Head back home or keep browsing Zias.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: NotFoundPage,
});

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <Nav />
      <main id="main-content">
        <Section
          variant="hero"
          className="isolate min-h-screen overflow-hidden pt-[104px]"
        >
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute top-24 left-[8%] size-56 rounded-full bg-section-pink/70 blur-3xl md:size-80" />
            <div className="absolute right-[6%] bottom-20 size-64 rounded-full bg-section-orange/65 blur-3xl md:size-96" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.22),transparent_60%)]" />
          </div>

          <SectionInner className="flex min-h-[calc(100vh-104px)] items-center py-16 md:py-24">
            <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.72fr)]">
              <section className="max-w-4xl">
                <p className="mb-6 inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-2 font-bold font-display text-sm text-white/85 backdrop-blur">
                  Error 404
                </p>
                <h1 className="font-black font-display text-[clamp(4.5rem,18vw,15rem)] text-white leading-[0.8] tracking-[-0.08em]">
                  Lost
                  <span className="block text-white/45">page.</span>
                </h1>
                <p className="mt-8 max-w-2xl font-body text-section-hero-subtext text-xl leading-relaxed md:text-2xl">
                  The URL got a little too adventurous. Let&apos;s get you back
                  to the useful part of the internet.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <PillButton onClick={() => navigate({ to: "/" })}>
                    Back home
                  </PillButton>
                  <Link
                    to="/journal"
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-4 font-bold font-display text-white transition-colors hover:bg-white/20"
                  >
                    Read the journal
                    <ArrowUpRight className="size-5" aria-hidden="true" />
                  </Link>
                </div>
              </section>

              <aside
                className="relative mx-auto aspect-[4/5] w-full max-w-sm lg:max-w-md"
                aria-hidden="true"
              >
                <div className="absolute inset-0 rotate-6 rounded-[2rem] bg-white/20 shadow-2xl backdrop-blur-md" />
                <div className="absolute inset-6 -rotate-3 rounded-[1.75rem] border border-white/30 bg-section-blue p-8 shadow-2xl">
                  <div className="flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span>zias.be</span>
                      <span>missing route</span>
                    </div>
                    <div>
                      <p className="font-black font-display text-[8rem] text-white leading-none tracking-[-0.08em] md:text-[10rem]">
                        404
                      </p>
                      <div className="mt-6 h-3 w-28 rounded-full bg-white/80" />
                      <div className="mt-4 h-3 w-44 rounded-full bg-white/35" />
                    </div>
                    <p className="-rotate-2 font-hand text-4xl text-white/85">
                      Try another door
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </SectionInner>
        </Section>
      </main>
      <Footer />
    </>
  );
}
