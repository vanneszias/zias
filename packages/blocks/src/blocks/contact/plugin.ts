import createFormsPlugin, {
  type FormDefinition,
  type FormsPluginOptions,
  formsPlugin,
} from "@emdash-cms/plugin-forms";
import {
  definePlugin,
  type PluginContext,
  type StorageCollection,
  ulid,
} from "emdash";
import { CONTACT_FORM } from "./form";

/**
 * EmDash's forms plugin, loaded through this module so a fresh site starts
 * with the contact form the `zias_contact` block renders. Submissions are
 * stored in the plugin and read under Plugins > Forms in the admin.
 */
export function formsWithContact(options?: FormsPluginOptions) {
  return { ...formsPlugin(options), entrypoint: "@zias/blocks/forms-plugin" };
}

export function createPlugin(options?: FormsPluginOptions) {
  const forms = createFormsPlugin(options);
  const { hooks } = definePlugin({
    id: forms.id,
    version: forms.version,
    hooks: { "plugin:install": provisionContactForm },
  });
  return { ...forms, hooks: { ...forms.hooks, ...hooks } };
}

async function provisionContactForm(_event: unknown, ctx: PluginContext) {
  const forms = ctx.storage.forms as StorageCollection<FormDefinition>;
  const existing = await forms.query({
    where: { slug: CONTACT_FORM.slug },
    limit: 1,
  });
  if (existing.items.length > 0) return;
  const now = new Date().toISOString();
  await forms.put(ulid(), {
    ...CONTACT_FORM,
    status: "active",
    submissionCount: 0,
    lastSubmissionAt: null,
    createdAt: now,
    updatedAt: now,
  });
}
