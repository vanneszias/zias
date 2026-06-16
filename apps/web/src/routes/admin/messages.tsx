import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
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
import { cn } from "@zias/ui/lib/utils";
import { MailIcon, SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AdminActionLink,
  AdminPill,
  AdminShell,
} from "@/components/admin-shell";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/admin/messages")({
  component: AdminMessages,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) throw redirect({ to: "/admin/login" });
  },
});

function AdminMessages() {
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"all" | "unread">("all");
  const {
    data: messages,
    isLoading,
    isError,
    refetch,
  } = useQuery(trpc.contact.list.queryOptions());
  const { mutateAsync: markRead } = useMutation(
    trpc.contact.markRead.mutationOptions(),
  );

  async function handleMarkRead(id: string) {
    await markRead(id);
    qc.invalidateQueries({ queryKey: ["contact"] });
    toast.success("Marked as read");
  }

  const visibleMessages = useMemo(() => {
    return (messages ?? []).filter((msg) => {
      const matchesMode = mode === "all" ? true : !msg.isRead;
      const q = query.toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        msg.name?.toLowerCase().includes(q) ||
        msg.email.toLowerCase().includes(q) ||
        msg.message.toLowerCase().includes(q);
      return matchesMode && matchesQuery;
    });
  }, [messages, mode, query]);

  async function handleMarkVisibleRead() {
    const unreadVisible = visibleMessages.filter((m) => !m.isRead);
    if (unreadVisible.length === 0) {
      toast.info("No unread messages in current view");
      return;
    }
    await Promise.all(unreadVisible.map((m) => markRead(m.id)));
    qc.invalidateQueries({ queryKey: ["contact"] });
    toast.success(`Marked ${unreadVisible.length} messages as read`);
  }

  const unreadCount = messages?.filter((m) => !m.isRead).length ?? 0;

  return (
    <AdminShell
      title="Messages"
      description="Review contact requests and clear the inbox."
      backTo="/admin"
      backLabel="Dashboard"
      actions={
        <>
          <AdminActionLink to="/admin/posts/new">New post</AdminActionLink>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleMarkVisibleRead}
          >
            Mark visible read
          </Button>
        </>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MailIcon className="size-4" />
            Inbox
            {unreadCount > 0 ? (
              <AdminPill variant="warn">{unreadCount} unread</AdminPill>
            ) : null}
          </CardTitle>
          <CardDescription>
            {visibleMessages.length} messages in current view
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid gap-2 md:grid-cols-[1fr_160px]">
            <div className="relative block">
              <label htmlFor="messages-search" className="sr-only">
                Search messages
              </label>
              <SearchIcon className="pointer-events-none absolute top-2 left-2 size-4 text-muted-foreground" />
              <Input
                id="messages-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                data-admin-search
                placeholder="Search sender, email, or message"
                className="pl-8"
              />
            </div>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as "all" | "unread")}
              className="h-8 border border-input bg-background px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
            >
              <option value="all">All messages</option>
              <option value="unread">Unread only</option>
            </select>
          </div>

          {isError ? (
            <div className="mb-4 border border-destructive/30 bg-destructive/5 p-3">
              <p className="font-medium text-destructive text-sm">
                Could not load messages.
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
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {visibleMessages.map((msg) => (
                <article
                  key={msg.id}
                  className={cn(
                    "border p-4 transition-colors",
                    msg.isRead ? "bg-card" : "border-primary/30 bg-primary/5",
                  )}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-sm">
                          {msg.name || "Anonymous"}
                        </p>
                        <a
                          href={`mailto:${msg.email}`}
                          className="truncate text-muted-foreground text-xs hover:text-foreground"
                        >
                          {msg.email}
                        </a>
                        <AdminPill variant={msg.isRead ? "default" : "warn"}>
                          {msg.isRead ? "read" : "new"}
                        </AdminPill>
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
                        {msg.message}
                      </p>
                      <p className="mt-3 text-muted-foreground text-xs">
                        {new Date(msg.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {!msg.isRead ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkRead(msg.id)}
                      >
                        Mark read
                      </Button>
                    ) : null}
                  </div>
                </article>
              ))}
              {visibleMessages.length === 0 ? (
                <div className="border border-dashed p-10 text-center">
                  <p className="font-medium text-sm">No messages found.</p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    Change the filter or search query.
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
