import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/footer";
import { MultiPageLayout } from "@/components/multi-page-layout";
import { Nav } from "@/components/nav";
import { manifest } from "@/content/journal/thesis/_manifest";
import ThesisIndexPage from "@/content/journal/thesis/index";

export const Route = createFileRoute("/thesis/")({
  component: ThesisPage,
});

function ThesisPage() {
  return (
    <>
      <Nav />
      <main>
        <MultiPageLayout
          manifest={manifest}
          seriesSlug="thesis"
          pageSlug="index"
          basePath="/thesis"
          parentHref="/journal"
          parentLabel="Journal"
        >
          <ThesisIndexPage />
        </MultiPageLayout>
      </main>
      <Footer />
    </>
  );
}
