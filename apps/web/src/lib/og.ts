import { ogBaseUrl } from "@/lib/urls";

export const STATIC_OG_VERSION = "v3";

export function staticOgUrl(path: string) {
  return `${ogBaseUrl}${path}?v=${STATIC_OG_VERSION}`;
}

export function journalOgUrl(slug: string, updatedAt?: Date | string | null) {
  const version = updatedAt ? new Date(updatedAt).getTime().toString(36) : "v0";
  return `${ogBaseUrl}/journal/${slug}?v=${version}`;
}
