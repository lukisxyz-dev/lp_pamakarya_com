import type { APIRoute } from "astro";
import { getSiteSettings } from "emdash";

/**
 * The sitemap EmDash cannot write. `/sitemap.xml` is an index of the CMS
 * collections, and these four are Astro pages rather than entries, so nothing
 * else lists them -- `/` is the page this site exists for.
 *
 * No `lastmod`: the only honest timestamp would be a build time, and a wrong
 * lastmod costs more than a missing one.
 */
export const prerender = false;

const PATHS = ["/", "/jasa", "/portfolio", "/contact"];

export const GET: APIRoute = async ({ url }) => {
	const settings = await getSiteSettings();
	const origin = (settings.url || url.origin).replace(/\/+$/, "");
	const body = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...PATHS.map((path) => `  <url><loc>${origin}${path}</loc></url>`),
		"</urlset>",
		"",
	].join("\n");

	return new Response(body, {
		status: 200,
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
