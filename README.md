# Zias

The website for Zias, built on a CMS so the content can be edited without code changes.

- **Site**: [Astro](https://astro.build) with the EmDash CMS, server-rendered on Cloudflare Workers, with a D1 database for content and an R2 bucket for media.
- **Design system**: Tailwind theme, fonts and Astro components shared across the site.
- **Blocks**: typed page blocks (a schema and a renderer for each) that pages are composed from in the CMS.

## Layout

```
apps/
  site/      @zias/site  Astro + EmDash site, deployed with Wrangler
  og/        @zias/og    Cloudflare Worker that renders Open Graph images
packages/
  ui/        @zias/ui      design system: theme, fonts, Astro components
  blocks/    @zias/blocks  block schemas and renderers used by pages
  config/                  shared TypeScript config
```

## Prerequisites

- [Bun](https://bun.sh) (the version pinned in `package.json`)
- A Cloudflare account, for deploys

## Getting started

```bash
bun install
bun run dev
```

Then open the site at the URL the dev server prints. The CMS admin is at `/_emdash/admin`. On first visit it runs setup and registers a passkey for the admin account.

Seed content and schema live in `apps/site/seed/`. Local state is kept in `apps/site/.wrangler` and `apps/site/.emdash`, both git-ignored.

## Commands

Run from the repo root:

| Command | What it does |
| --- | --- |
| `bun run dev` | Start the apps in development mode |
| `bun run build` | Build all apps |
| `bun run check-types` | Type-check all apps |
| `bun run check` | Format and lint with Biome (writes fixes) |
| `bun run deploy` | Build and deploy the apps to Cloudflare |

Within `apps/site`, `bun run types` regenerates the EmDash types, and `bun run preview` serves the production build locally.

## Deployment

Deploys target Cloudflare Workers using the configuration in `apps/site/wrangler.jsonc`.

1. One-time setup: with Wrangler, create the D1 database and the R2 bucket named in `apps/site/wrangler.jsonc`. The bindings in that file must match the resource names.
2. Deploy from the repo root:

   ```bash
   bun run deploy
   ```

`bun run deploy` builds the site and runs `wrangler deploy` for it.

## Tooling

- [Bun workspaces](https://bun.sh/docs/install/workspaces) for packages
- [Turborepo](https://turbo.build) to run tasks across the workspace (`turbo.json`)
- [Biome](https://biomejs.dev) for formatting and linting (`biome.json`)
