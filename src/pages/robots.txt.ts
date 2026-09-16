import type { APIRoute } from "astro";
import { siteUrl } from "../utils/site-identity";

export const prerender = true;

const PATHS = ["/", "/jasa", "/portfolio", "/contact"];

export const GET: APIRoute = () => {
	const origin = siteUrl.replace(/\/+$/, "");
	const body = [
		"User-agent: *",
		"Allow: /",
		"",
		`Sitemap: ${origin}/sitemap-static.xml`,
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
