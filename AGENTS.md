This is an EmDash site -- a CMS built on Astro with a full admin UI.

One landing page at `/`, plus a 404. No blog in scope. `src/pages/blog/` still
exists in the repo and still renders, but nothing links to it: it is
deliberately out of scope, must not be deleted, and the landing page must never
gain a link to it.

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

| File                     | Purpose                                                                   |
| ------------------------ | ------------------------------------------------------------------------- |
| `astro.config.mjs`       | Astro config: `emdash()` integration, D1 database, R2 storage, fonts      |
| `src/live.config.ts`     | EmDash loader registration (boilerplate -- don't modify)                  |
| `seed/seed.json`         | Schema only: `posts` collection + `category` taxonomy, no content         |
| `.emdash/seed.json`      | Authored articles (gitignored). Wins over `seed/seed.json`                |
| `emdash-env.d.ts`        | Generated types for collections (auto-regenerated on dev start)           |
| `src/layouts/Base.astro` | Site shell: skip link, header, `<main>`, footer, mobile sticky action bar |
| `src/data/services.ts`   | The 6 services, 3 material groups, 3 lead-time tiers, 6 sectors           |
| `src/data/site.ts`       | Company facts: contact, design formats, ordering steps, pricing variables |
| `src/data/sections.ts`   | Section ids and the header nav, so a link and its target share one source |

## Pages

| Page    | Path   | What it shows                              |
| ------- | ------ | ------------------------------------------ |
| Landing | `/`    | Hero, services, proof, ordering, FAQ       |
| 404     | `/404` | Not-found shell: one heading, one way back |

`/_emdash/admin` and `/_emdash/api/*` are injected by the `emdash()`
integration from `node_modules` -- they are not files in `src/pages/`.

`src/components/` holds Hero, MateriLayanan, Bukti, CaraPesan, Faq,
SectionHead, Button and Icon. `index.astro` composes Hero → MateriLayanan →
Bukti → CaraPesan → Faq.

`Base.astro` holds the header, footer and the mobile-only sticky action bar.
The header nav is four same-page anchors -- Layanan, Material, Cara pesan, FAQ
-- whose ids come from `src/data/sections.ts`, so a header link and its target
cannot drift apart. There is no Blog link and no Admin link in the public nav.
The skip link is the first focusable element; the landmarks are
`<main id="main">`, `<header>`, `<nav aria-label="Utama">` and `<footer>`.

## Data layer

`src/data/` is the single source of truth for page content, and rendering reads
from it -- never a second hand-maintained copy of the same data in markup.
`services.ts` owns the 6 services, the 3 material groups, the 3 lead-time tiers
and the 6 sectors; `site.ts` owns the company-level facts; `sections.ts` owns
the section ids.

## Design

The system is "Gambar Kerja": white paper ground, near-black ink, hairline
rules, monospaced spec labels, mm-first numerals, and exactly one accent
(`--signal`, machine-guard yellow). The accent is used only as a filled surface
or a focus halo, never as text on white -- #FFC300 on #FFFFFF is 1.61:1 and
fails. `--rule` is decorative only; `--rule-strong` carries every structural
boundary (3.47:1, passes WCAG 1.4.11). Radius 0, 2px maximum on buttons. No
shadows.

`src/styles/tokens.css` is the source of truth and `src/styles/theme.css` is a
small override surface on top of it. The template's indigo/pink brand tokens
and the entire `--gradient-*` family were deleted, not overridden -- there are
no gradients and no brand colours in the token set, and nothing can inherit one
by accident. What `theme.css` still holds is a bounded legacy bridge of old
token names, needed only because the out-of-scope blog routes still consume
them; that block disappears when the blog routes do.

Fonts are configured in `astro.config.mjs`: **IBM Plex Sans** as `--font-body`
(400/500/600/700) and **IBM Plex Mono** as `--font-mono` (400/500/600), Google
provider, `latin` subset. Nothing on the site is heavier than weight 700.

## Images

The `sharp` build script is deliberately blocked in `pnpm-workspace.yaml`.
Astro's `<Image>` optimisation and the `emdash/ui` `Image` component therefore
MUST NOT be used. Images are pre-optimised WebP files in `public/foto/`
(`hero.webp`, `hero-mobile.webp`, `proof-1.webp` ... `proof-6.webp`), used via
plain `<img>` with explicit `width`, `height`, `loading` and `decoding`
attributes. If an image needs to change it is re-exported by hand, not generated
at build time.

## The content rule

The client has confirmed almost none of their own numbers. The live
pamakarya.com publishes no tolerance, no machine wattage or bed size, no maximum
thickness, no minimum order, no payment terms, no pricing unit, no opening
hours, no street address, and **no location at all -- the city is unpublished
and the string "Yogyakarta" must never be written.** Inventing any of these is
the worst failure mode for this project, because a fabrication buyer checks
specifications and one wrong number destroys the page's credibility.

`pendingClientConfirmations` in `src/data/services.ts` lists every value the
client must still supply before the spec sheet can be filled in further. It is
documentation only and is imported by no page. Nothing on that list may appear
on the page until the client confirms it in writing.

## Skills

Agent skills are in `.agents/skills/`. Load them when working on specific tasks:

- **building-emdash-site** -- Querying content, rendering Portable Text, schema design, seed files, site features (taxonomies, search, SEO, comments, bylines). Start here.
- **creating-plugins** -- Building EmDash plugins with hooks, storage, admin UI, API routes, and Portable Text block types.
- **emdash-cli** -- CLI commands for content management, seeding, type generation, and visual editing flow.

## Documentation

The EmDash docs are available as an MCP server at `https://docs.emdashcms.com/mcp`. When you need to verify an API, hook, config option, field type, or pattern, call `search_docs` against the live documentation rather than relying on training-data recall. The docs reflect current behaviour; assumptions may not.

This template ships with `.mcp.json`, `.cursor/mcp.json`, and `.vscode/mcp.json` so Claude Code, Cursor, and VS Code auto-discover the docs server. Other tools (OpenCode, Windsurf, etc.) need a manual one-time setup -- see [docs.emdashcms.com/docs-mcp](https://docs.emdashcms.com/docs-mcp).

## Rules

- `output: "server"` is required and all content pages must be server-rendered. No `getStaticPaths()` for CMS content.
- `react()` must stay in `astro.config.mjs` -- the EmDash admin UI hydrates with React. Removing it leaves the admin stuck on "Loading EmDash...".
- CMS image fields are objects (`{ id, src, alt }`), not strings. This is a schema concern only: rendering them still goes through plain `<img>`, per the no-sharp constraint above.
- `entry.id` is the slug (for URLs). `entry.data.id` is the database ULID (for API calls like `getEntryTerms`).
- Always call `Astro.cache.set(cacheHint)` on pages that query content.
- Taxonomy names in queries must match the seed's `"name"` field exactly (e.g., `"category"` not `"categories"`).

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
  The landing page is hand-built Astro components reading `src/data/`, not CMS
  blocks or Portable Text.
- Don't delete `src/pages/blog/` or link to it from the landing page. It is
  out of scope, not removed.
- Don't add gradients or brand colours. `tokens.css` does not define them.
- Don't reach for a JS framework on the public pages. Only the admin uses React.
