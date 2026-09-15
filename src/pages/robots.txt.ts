import type { APIRoute } from "astro";
import { getSiteSettings } from "emdash";

/**
 * robots.txt -- EmDash injects this route itself, and this replaces it for one
 * reason: its `Sitemap:` line can only name `/sitemap.xml`, while the four
 * Astro pages live in `/sitemap-static.xml` beside it.
 *
 * Settings -> SEO -> robots.txt still wins, and both sitemap lines are appended
 * to it when it carries none, which is what EmDash's own route does.
 */
export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
	const settings = await getSiteSettings();
	const origin = (settings.url || url.origin).replace(/\/+$/, "");
	const sitemaps = [`Sitemap: ${origin}/sitemap.xml`, `Sitemap: ${origin}/sitemap-static.xml`];
	const custom = settings.seo?.robotsTxt;

	const body = custom
		? custom.toLowerCase().includes("sitemap:")
			? custom
			: `${custom.trimEnd()}\n\n${sitemaps.join("\n")}\n`
		: [
				"User-agent: *",
				"Allow: /",
				"",
				"# Disallow admin and API routes",
				"Disallow: /_emdash/",
				"",
				...sitemaps,
				"",
			].join("\n");

	return new Response(body, {
		status: 200,
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=86400",
		},
	});
};
