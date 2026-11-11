import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import { formsWithContact } from "@zias/blocks/forms-plugin";
import { defineConfig, envField } from "astro/config";
import emdash from "emdash/astro";
import { composeSeed } from "./seed/compose";

export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  image: { layout: "constrained", responsiveStyles: true },
  redirects: {
    "/home": "/",
    "/thesis": "/journal/thesis",
    "/thesis/[...page]": "/journal/thesis",
  },
  env: {
    schema: {
      PUBLIC_OG_URL: envField.string({
        context: "client",
        access: "public",
        default: "https://og.zias.be",
      }),
      PUBLIC_OPENPANEL_CLIENT_ID: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      PUBLIC_OPENPANEL_API_URL: envField.string({
        context: "client",
        access: "public",
        default: "https://analytics.zias.be/api",
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
    // Pre-bundle the React islands with the React copy the renderer uses;
    // left as workspace source, workerd would load a second React.
    ssr: {
      optimizeDeps: {
        include: ["@zias/ui/react/theme-toggle", "@zias/ui/react/mobile-menu"],
      },
    },
  },
  integrations: [
    composeSeed(),
    react(),
    emdash({
      database: d1({ binding: "DB", session: "auto", coalesce: true }),
      storage: r2({ binding: "MEDIA" }),
      plugins: [formsWithContact()],
    }),
  ],
  devToolbar: { enabled: false },
});
