import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import type { PostCategory } from "@zias/content";
import { formatPostDate } from "@zias/content";
import { Button } from "@zias/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@zias/ui/components/card";
import { Input } from "@zias/ui/components/input";
import { Skeleton } from "@zias/ui/components/skeleton";
import { SearchIcon, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AdminActionLink,
  AdminPill,
  AdminShell,
} from "@/components/admin-shell";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/admin/posts/")({
  component: AdminPostsList,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) throw redirect({ to: "/admin/login" });
  },
});

function AdminPostsList() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "published"
  >("all");
  const [sortBy, setSortBy] = useState<"updated" | "title">("updated");
  const {
    data: posts,
    isLoading,
    isError,
    refetch,
  } = useQuery(trpc.journal.adminList.queryOptions());
  const { mutateAsync: deletePost } = useMutation(
    trpc.journal.delete.mutationOptions(),
  );

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await deletePost(id);
    qc.invalidateQueries({ queryKey: ["journal"] });
    toast.success("Post deleted");
  }

  const filteredPosts = useMemo(() => {
    const base = (posts ?? []).filter((post) => {
      const q = query.toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        post.title.toLowerCase().includes(q) ||
        post.slug.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "draft"
            ? post.isDraft
            : !post.isDraft;

      return matchesQuery && matchesStatus;
    });

    return base.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      const aTime = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
      const bTime = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
      return bTime - aTime;
    });
  }, [posts, query, sortBy, statusFilter]);

  return (
    <AdminShell
      title="Posts"
      description="Search, review, edit, and publish journal content."
      backTo="/admin"
      backLabel="Dashboard"
      actions={
        <AdminActionLink to="/admin/posts/new" strong>
          New post
        </AdminActionLink>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Content library</CardTitle>
          <CardDescription>
            {filteredPosts.length} of {posts?.length ?? 0} posts shown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid gap-2 md:grid-cols-[1fr_160px_190px]">
            <div className="relative block">
              <label htmlFor="posts-search" className="sr-only">
                Search posts
              </label>
              <SearchIcon className="pointer-events-none absolute top-2 left-2 size-4 text-muted-foreground" />
              <Input
                id="posts-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                data-admin-search
                placeholder="Search title or slug"
                className="pl-8"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "draft" | "published")
              }
              className="h-8 border border-input bg-background px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
            >
              <option value="all">All statuses</option>
              <option value="draft">Drafts</option>
              <option value="published">Published</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "updated" | "title")}
              className="h-8 border border-input bg-background px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
            >
              <option value="updated">Latest activity</option>
              <option value="title">Title</option>
            </select>
          </div>

          {isError ? (
            <div className="mb-4 border border-destructive/30 bg-destructive/5 p-3">
              <p className="font-medium text-destructive text-sm">
                Could not load posts.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </div>
          ) : null}

          {isLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          ) : (
            <div className="overflow-hidden border">
              <div className="hidden grid-cols-[1fr_120px_120px_120px_92px] border-b bg-muted/50 px-3 py-2 text-muted-foreground text-xs md:grid">
                <span>Title</span>
                <span>Status</span>
                <span>Category</span>
                <span>Published</span>
                <span className="text-right">Actions</span>
              </div>
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="grid gap-3 border-b px-3 py-3 last:border-b-0 md:grid-cols-[1fr_120px_120px_120px_92px] md:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-sm">
                        {post.title}
                      </p>
                      {post.isCustomPage ? <AdminPill>custom</AdminPill> : null}
                    </div>
                    <p className="truncate text-muted-foreground text-xs">
                      /{post.slug} · {post.readTime} min read
                    </p>
                  </div>
                  <div>
                    <AdminPill variant={post.isDraft ? "warn" : "success"}>
                      {post.isDraft ? "draft" : "published"}
                    </AdminPill>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {categoryLabel(post.category as PostCategory)}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {post.publishedAt
                      ? formatPostDate(new Date(post.publishedAt))
                      : "Not published"}
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate({
                          to: "/admin/posts/$id/edit",
                          params: { id: post.id },
                        })
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => handleDelete(post.id, post.title)}
                      aria-label={`Delete ${post.title}`}
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredPosts.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="font-medium text-sm">No posts found.</p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    Change the filters or create a new post.
                  </p>
                  <AdminActionLink to="/admin/posts/new" strong>
                    Create post
                  </AdminActionLink>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}

function categoryLabel(category: PostCategory) {
  return category.split(":").at(-1)?.replace(/-/g, " ") ?? category;
}
