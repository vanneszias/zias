import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Footer } from "@/components/footer";
import { MultiPageLayout } from "@/components/multi-page-layout";
import { Nav } from "@/components/nav";
import type { SeriesManifest } from "@/lib/multi-page-manifest";

/* Eagerly import all _manifest.ts files — tiny files, fine to eager-load */
const manifests = import.meta.glob<{ manifest: SeriesManifest }>(
  "../../../content/journal/*/_manifest.ts",
  { eager: true },
);

/* Lazily import all page content components */
const pageComponents = import.meta.glob<{ default: React.ComponentType }>(
  "../../../content/journal/*/*.tsx",
);

export const Route = createFileRoute("/journal/$slug/$page")({
  loader: ({ params }) => {
    if (params.slug === "thesis") {
      const thesisPage = params.page === "introduction" ? "intro" : params.page;

      throw redirect({
        to: thesisPage === "index" ? "/thesis" : "/thesis/$page",
        params: thesisPage === "index" ? undefined : { page: thesisPage },
      });
    }

    const manifestModule =
      manifests[`../../../content/journal/${params.slug}/_manifest.ts`];
    if (!manifestModule) throw notFound();

    const pageExists = manifestModule.manifest.pages.some(
      (p) => p.slug === params.page,
    );
    if (!pageExists) throw notFound();

    return { manifest: manifestModule.manifest };
  },
  component: MultiPagePostPage,
});

function MultiPagePostPage() {
  const { slug, page } = Route.useParams();
  const { manifest } = Route.useLoaderData();

  const importFn =
    pageComponents[`../../../content/journal/${slug}/${page}.tsx`];
  if (!importFn) throw notFound();

  const PageContent = lazy(importFn);

  return (
    <>
      <Nav />
      <main>
        <MultiPageLayout manifest={manifest} seriesSlug={slug} pageSlug={page}>
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
