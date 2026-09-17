// @ts-check
import { defineConfig, fontProviders, passthroughImageService } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
/*
  The Cloudflare adapter is only applied for a build. Left installed during
  `astro dev`, it runs every on-demand route inside the workerd runtime, where
  Node's `fs` does not exist -- which is exactly what Keystatic's local-mode
  API needs to list and write src/content. Astro's own dev server handles
  `prerender = false` routes in Node, so dev keeps working without it.
*/
const isBuild = process.argv.includes("build") || process.argv.includes("preview");

export default defineConfig({
	output: "static",
	...(isBuild ? { adapter: cloudflare() } : {}),
	image: {
		service: passthroughImageService(),
		layout: "constrained",
	},
	integrations: [react(), markdoc(), keystatic()],
	fonts: [
		{
			provider: fontProviders.local(),
			name: "Open Runde",
			cssVariable: "--font-open-runde",
			fallbacks: ["ui-rounded", "system-ui", "sans-serif"],
			options: {
				variants: [
					{
						weight: 400,
						style: "normal",
						src: ["./src/fonts/OpenRunde-Regular.woff2"],
					},
					{
						weight: 500,
						style: "normal",
						src: ["./src/fonts/OpenRunde-Medium.woff2"],
					},
					{
						weight: 600,
						style: "normal",
						src: ["./src/fonts/OpenRunde-Semibold.woff2"],
					},
					{ weight: 700, style: "normal", src: ["./src/fonts/OpenRunde-Bold.woff2"] },
				],
			},
		},
	],
	devToolbar: { enabled: false },
});
