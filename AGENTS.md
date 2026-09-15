This is an EmDash site -- a CMS built on Astro with a full admin UI.

## Commands

```bash
pnpm dev              # Start the Astro dev server
npx emdash types      # Regenerate TypeScript types from a running site
pnpm format           # Format the repo (oxfmt + Prettier for .astro)
pnpm format:check     # Check formatting without writing
```

A lefthook `pre-commit` hook formats staged files and re-stages them, so the
formatted result lands in the same commit even when it was not staged.
`pnpm install` installs the hook through the `prepare` script. `.astro` goes
through Prettier (oxfmt silently skips the extension, so it is unformatted
without that second pass); everything else through oxfmt. Skip once with
`LEFTHOOK=0 git commit ...`.

The admin UI is at `http://localhost:4321/_emdash/admin`.

## Key Files

| File                     | Purpose                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `astro.config.mjs`       | Astro config with `emdash()` integration, database, and storage                    |
| `src/live.config.ts`     | EmDash loader registration (boilerplate -- don't modify)                           |
| `seed/seed.json`         | Schema definition + demo content (collections, fields, taxonomies, menus, widgets) |
| `emdash-env.d.ts`        | Generated types for collections (auto-regenerated on dev server start)             |
| `src/layouts/Base.astro` | Base layout with EmDash wiring (menus, search, page contributions)                 |
| `src/pages/`             | Astro pages -- all server-rendered                                                 |

## Skills

Agent skills are in `.agents/skills/`. Load them when working on specific tasks:

- **building-emdash-site** -- Querying content, rendering Portable Text, schema design, seed files, site features (menus, widgets, search, SEO, comments, bylines). Start here.
- **creating-plugins** -- Building EmDash plugins with hooks, storage, admin UI, API routes, and Portable Text block types.
- **emdash-cli** -- CLI commands for content management, seeding, type generation, and visual editing flow.

## Documentation

The EmDash docs are available as an MCP server at `https://docs.emdashcms.com/mcp`. When you need to verify an API, hook, config option, field type, or pattern, call `search_docs` against the live documentation rather than relying on training-data recall. The docs reflect current behaviour; assumptions may not.

This template ships with `.mcp.json`, `.cursor/mcp.json`, and `.vscode/mcp.json` so Claude Code, Cursor, and VS Code auto-discover the docs server. Other tools (OpenCode, Windsurf, etc.) need a manual one-time setup -- see [docs.emdashcms.com/docs-mcp](https://docs.emdashcms.com/docs-mcp).

## Rules

- The user verifies UI changes themselves. Do NOT open a browser, screenshot, curl, or otherwise self-verify visual output. Diagnose and build from code; ask the user to check.

- All content pages must be server-rendered (`output: "server"`). No `getStaticPaths()` for CMS content.
- Image fields are objects (`{ src, alt }`), not strings. Use `<Image image={...} />` from `"emdash/ui"`.
- `entry.id` is the slug (for URLs). `entry.data.id` is the database ULID (for API calls like `getEntryTerms`).
- Always call `Astro.cache.set(cacheHint)` on pages that query content.
- Taxonomy names in queries must match the seed's `"name"` field exactly (e.g., `"category"` not `"categories"`).
- Comments: 3 lines maximum, only where the code cannot say it. No narration of the
  next line, no restating what a selector or a value already says. No comment is
  better than a short one.
- Do NOT open a browser or screenshot pages to verify UI changes. The user
  verifies visually themselves. Confirm only what the build/CLI can answer
  (HTTP status, compile errors); then hand off.

## This Template

A general-purpose starting point with posts, pages, categories, and tags. Less opinionated than the themed templates -- a base for sites that want to define their own design.

There is intentionally no `theme.css`, no custom font configuration, no styled layouts beyond browser defaults. The home, posts index, post detail, and page routes all render with minimal styling. Start here if you want full control over the visual language; start with `blog`, `portfolio`, or `marketing` if you want a designed template to customise.

## Pages

| Page        | Path            | What it shows                                  |
| ----------- | --------------- | ---------------------------------------------- |
| Home        | `/`             | Site title + tagline, links into Posts / About |
| All posts   | `/posts`        | Post list                                      |
| Post detail | `/posts/[slug]` | Post content                                   |
| Page        | `/[slug]`       | Static page content (e.g. `/about`)            |

## Schema

- `posts` collection: `title`, `featured_image`, `content` (Portable Text), `excerpt` (text).
- `pages` collection: `title`, `content` (Portable Text).
- Taxonomies: `category`, `tag`. They are defined in the seed and assigned to
  posts, but there are no `/category/[slug]` or `/tag/[slug]` archive routes in
  this project. Term labels therefore render as text, never as links -- a link
  would point at a missing route. Do not add term links without adding the
  archive route they target.
- Single `primary` menu.

Site settings have `title` and `tagline`.

## Visual character

None imposed. Define your own.

This template ships without:

- `src/styles/theme.css` -- create one and import it from `Base.astro` if you want CSS-variable theming.
- Fonts in `astro.config.mjs` -- the `fonts:` array is empty. Add Google Fonts entries with `cssVariable` bindings if you want web fonts.
- A `components/` directory with styled cards / tag lists / etc. -- build them as needed.

## What to do here

If you're customising this template, the work is to add design, not to subtract it. Reasonable first moves:

1. Decide on one display + one body typeface, add them to `astro.config.mjs`, bind them to `--font-display` and `--font-body` CSS variables.
2. Create `src/styles/theme.css` with your colour palette, type scale, and spacing tokens.
3. Add it to `Base.astro` -- the layout already imports a small reset; add your theme above your page styles.
4. Build page-specific styles in each Astro page's `<style>` block, referencing the CSS variables.

If you want a designed template instead, switch to `blog`, `portfolio`, or `marketing` -- each ships with a full visual system you can re-skin via `theme.css`.

## What not to do

- Don't treat this as a finished design. The unstyled output is intentional; shipping it as-is looks unfinished because it is.
- Don't add component libraries (Tailwind UI, shadcn, etc.) without considering what they bring with them. The template is small on purpose.
- Don't recreate the blog template's three-column reading view here. If that's what you want, start from `blog`.
