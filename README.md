# Zias

The website for Zias, built on a CMS so the content can be edited without code changes.

- **Site**: [Astro](https://astro.build) with the EmDash CMS, server-rendered on Cloudflare Workers, with a D1 database for content and an R2 bucket for media.
- **Design system**: Tailwind theme, fonts and Astro components shared across the site.
- **Blocks**: typed page blocks (a schema and a renderer for each) that pages are composed from in the CMS.

## Layout

```
apps/
  site/      @zias/site  Astro + EmDash site, deployed with Workers Builds
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

A site without the status entry, and so every fresh database, shows only the under construction page. Signed in to the admin you see the real site. To open it to visitors, go to **Site > Site status** in the admin and switch off **Under construction**; the message on that page is edited there too.

The schema and starter content live in `apps/site/seed/`; page block types come from `packages/blocks` and are merged in automatically. A fresh database gets the schema on first request, and the pages and posts once the admin setup has run. Local state is kept in `apps/site/.wrangler` and `apps/site/.emdash`, both git-ignored.

## Commands

Run from the repo root:

| Command               | What it does                              |
| --------------------- | ----------------------------------------- |
| `bun run dev`         | Start the apps in development mode        |
| `bun run build`       | Build all apps                            |
| `bun run check-types` | Type-check all apps                       |
| `bun run check`       | Format and lint with Biome (writes fixes) |
| `bun run deploy`      | Build and deploy the apps by hand         |

Within `apps/site`, `bun run types` regenerates the EmDash types, and `bun run preview` serves the production build locally.

## Deployment

Both Workers deploy through [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/), Cloudflare's Git integration. There is no GitHub Actions workflow.

| Worker      | Root directory | Build command   | Domains                  |
| ----------- | -------------- | --------------- | ------------------------ |
| `zias-site` | `apps/site`    | `bun run build` | `zias.be`, `www.zias.be` |
| `zias-og`   | `apps/og`      | (none)          | `og.zias.be`             |

- A push to `master` runs `wrangler deploy`, which also attaches the custom domains in `routes`.
- Every other branch and pull request runs `wrangler preview`. That gives the branch its own Preview URL on `workers.dev`, and Cloudflare comments it on the PR.
- Previews use separate resources from the `previews` block in each `wrangler.jsonc` (D1 `zias-site-preview`, R2 `zias-media-preview` and `zias-og-images-preview`, a preview session KV), so a PR never reads or writes production content.
- Build variables: production sets `PUBLIC_OPENPANEL_CLIENT_ID`; previews leave it empty, so they send no analytics.

To deploy by hand, run `bun run deploy` from the repo root.

## Tooling

- [Bun workspaces](https://bun.sh/docs/install/workspaces) for packages
- [Turborepo](https://turbo.build) to run tasks across the workspace (`turbo.json`)
- [Biome](https://biomejs.dev) for formatting and linting (`biome.json`)
