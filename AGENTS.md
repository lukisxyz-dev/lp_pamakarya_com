This is an EmDash site -- a CMS built on Astro with a full admin UI.

A landing page plus a blog. The landing page is deliberately plain: the site
name and one link into the blog. All content lives in the `posts` collection.

## Commands

```bash
pnpm dev              # Start the Astro dev server
npx emdash types      # Regenerate TypeScript types from a running site
pnpm format           # Format everything (oxfmt + prettier for .astro)
pnpm format:check     # Check formatting without writing
```

A lefthook `pre-commit` hook formats staged files and re-stages them, so the
formatted result lands in the same commit even if it was not staged. `.astro`
goes through Prettier (oxfmt cannot parse it); everything else through oxfmt.

The admin UI is at `http://localhost:4321/_emdash/admin`.

## Key Files

| File                     | Purpose                                                           |
| ------------------------ | ----------------------------------------------------------------- |
| `astro.config.mjs`       | Astro config with `emdash()` integration, database, and storage   |
| `src/live.config.ts`     | EmDash loader registration (boilerplate -- don't modify)          |
| `seed/seed.json`         | Schema only: `posts` collection + `category` taxonomy, no content |
| `.emdash/seed.json`      | Authored articles (gitignored). Wins over `seed/seed.json`        |
| `emdash-env.d.ts`        | Generated types for collections (auto-regenerated on dev start)   |
| `src/layouts/Base.astro` | Site layout: site name, Blog/Admin nav, footer                    |

## Skills

Agent skills are in `.agents/skills/`. Load them when working on specific tasks:

- **building-emdash-site** -- Querying content, rendering Portable Text, schema design, seed files, site features (taxonomies, search, SEO, comments, bylines). Start here.
- **creating-plugins** -- Building EmDash plugins with hooks, storage, admin UI, API routes, and Portable Text block types.
- **emdash-cli** -- CLI commands for content management, seeding, type generation, and visual editing flow.

## Documentation

The EmDash docs are available as an MCP server at `https://docs.emdashcms.com/mcp`. When you need to verify an API, hook, config option, field type, or pattern, call `search_docs` against the live documentation rather than relying on training-data recall. The docs reflect current behaviour; assumptions may not.

This template ships with `.mcp.json`, `.cursor/mcp.json`, and `.vscode/mcp.json` so Claude Code, Cursor, and VS Code auto-discover the docs server. Other tools (OpenCode, Windsurf, etc.) need a manual one-time setup -- see [docs.emdashcms.com/docs-mcp](https://docs.emdashcms.com/docs-mcp).

## Rules

- All content pages must be server-rendered (`output: "server"`). No `getStaticPaths()` for CMS content.
- Image fields are objects (`{ id, src, alt }`), not strings. Use `<Image image={...} />` from `"emdash/ui"`.
- `entry.id` is the slug (for URLs). `entry.data.id` is the database ULID (for API calls like `getEntryTerms`).
- Always call `Astro.cache.set(cacheHint)` on pages that query content.
- Taxonomy names in queries must match the seed's `"name"` field exactly (e.g., `"category"` not `"categories"`).
- `react()` must stay in `astro.config.mjs` -- the EmDash admin UI hydrates with React. Removing it leaves the admin stuck on "Loading EmDash...".

## Pages

| Page        | Path           | What it shows                              |
| ----------- | -------------- | ------------------------------------------ |
| Landing     | `/`            | Site name + link to the blog. No CMS query |
| Blog index  | `/blog`        | Published posts, newest first              |
| Blog detail | `/blog/[slug]` | Single post: title, date, image, body      |
| 404         | `/404`         | Not-found fallback                         |

`/_emdash/admin` and `/_emdash/api/*` are injected by the `emdash()`
integration from `node_modules` -- they are not files in `src/pages/`.

## Schema

- `posts` collection: `title`, `excerpt`, `featured_image` (image), `content` (Portable Text).
- One taxonomy: `category` (flat), applied to `posts`.
- Site settings: `title`, `tagline`. Title renders in the header.

## Seed files

EmDash resolves the seed in this order:

1. `.emdash/seed.json` (gitignored -- holds the articles)
2. `package.json` → `emdash.seed`
3. `seed/seed.json` (committed -- schema only)

Auto-seed on first request applies **structure only** (`includeContent` defaults
to `false`). To apply content, hit the setup route, which defaults to including it:

```bash
curl "http://localhost:4321/_emdash/api/setup/dev-bypass?redirect=/_emdash/admin"
```

Append `?content=0` to apply schema only.

## What not to do

- Don't re-introduce the marketing blocks plugin or `src/components/blocks/`.
  The site has no hero/features/pricing/FAQ blocks; content is plain Portable Text.
- Don't add gradients or brand colours. The theme flattens the template's
  gradient tokens on purpose -- the landing page is white, black text.
- Don't reach for a JS framework on the public pages. Only the admin uses React.
