import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Footer } from "@/components/footer";
import { MultiPageLayout } from "@/components/multi-page-layout";
import { Nav } from "@/components/nav";
import { manifest } from "@/content/journal/thesis/_manifest";

const pageComponents = import.meta.glob<{ default: React.ComponentType }>(
  "../../content/journal/thesis/*.tsx",
);

export const Route = createFileRoute("/thesis/$page")({
  loader: ({ params }) => {
    if (params.page === "index") {
      throw redirect({ to: "/thesis" });
    }

    const pageExists = manifest.pages.some((p) => p.slug === params.page);
    if (!pageExists) throw notFound();
  },
  component: ThesisChapterPage,
});

function ThesisChapterPage() {
  const { page } = Route.useParams();
  const importFn = pageComponents[`../../content/journal/thesis/${page}.tsx`];
  if (!importFn) throw notFound();

  const PageContent = lazy(importFn);

  return (
    <>
      <Nav />
      <main>
        <MultiPageLayout
          manifest={manifest}
          seriesSlug="thesis"
          pageSlug={page}
          basePath="/thesis"
          parentHref="/journal"
          parentLabel="Journal"
        >
          <Suspense fallback={<PageContentSkeleton />}>
            <PageContent />
          </Suspense>
        </MultiPageLayout>
      </main>
      <Footer />
    </>
  );
}

function PageContentSkeleton() {
  return (
    <div className="space-y-4 py-4">
      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
      <div className="h-4 w-full animate-pulse rounded bg-muted" />
      <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
      <div className="mt-8 h-4 w-1/2 animate-pulse rounded bg-muted" />
      <div className="h-4 w-full animate-pulse rounded bg-muted" />
    </div>
  );
}
