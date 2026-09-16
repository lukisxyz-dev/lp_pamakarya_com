import type { APIRoute } from "astro";
import { siteUrl } from "../utils/site-identity";

export const prerender = true;

const PATHS = ["/", "/jasa", "/portfolio", "/contact"];

export const GET: APIRoute = () => {
	const origin = siteUrl.replace(/\/+$/, "");
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
