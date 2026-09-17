import type { APIRoute } from "astro";
import { siteUrl } from "../utils/site-identity";
import { getAllPosts } from "../utils/content";

export const prerender = true;

const PATHS = ["/", "/jasa", "/portfolio", "/contact", "/blog"];

export const GET: APIRoute = async () => {
	const origin = siteUrl.replace(/\/+$/, "");
	const posts = await getAllPosts();
	const paths = [...PATHS, ...posts.map((post) => `/blog/${post.id}`)];
	const body = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...paths.map((path) => `  <url><loc>${origin}${path}</loc></url>`),
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
