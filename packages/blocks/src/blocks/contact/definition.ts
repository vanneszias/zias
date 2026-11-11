import type { FormField } from "@emdash-cms/plugin-forms";
import {
  getPublicPluginApiRouteHandler,
  type PublicPluginRuntimeLocals,
} from "emdash/plugin-utils";

export interface PublicForm {
  fields: FormField[];
  submitLabel: string;
  honeypot: boolean;
}

/** Reads a form's public definition through the forms plugin's own public route, in-process. */
export async function loadForm(
  locals: PublicPluginRuntimeLocals,
  origin: URL,
  slug: string,
): Promise<PublicForm | null> {
  const handle = getPublicPluginApiRouteHandler(locals);
  if (!handle) return null;
  const request = new Request(
    new URL("/_emdash/api/plugins/emdash-forms/definition", origin),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: slug }),
    },
  );
  const response = await handle(
    "emdash-forms",
    "POST",
    "/definition",
    request,
  ).catch(() => null);
  const form = response?.success
    ? (response.data as {
        pages: { fields: FormField[] }[];
        settings: Record<string, string>;
      })
    : null;
  if (!form) return null;
  return {
    fields: form.pages.flatMap((page) => page.fields),
    submitLabel: form.settings.submitLabel || "Send",
    honeypot: form.settings.spamProtection === "honeypot",
  };
}
