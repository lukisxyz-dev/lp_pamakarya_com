// @ts-check
import { defineConfig, envField, fontProviders, passthroughImageService } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
	output: "static",
	adapter: cloudflare(),
	image: {
		service: passthroughImageService(),
		layout: "constrained",
	},
	integrations: [react(), markdoc(), keystatic()],
	/*
	  Keystatic's API route reads these through astro:env (getSecret) when the
	  site runs in GitHub mode. All optional: local dev uses storage kind
	  "local" and needs none of them, so a missing secret must not fail the
	  build -- the admin simply cannot log in until Cloudflare has them set.
	*/
	env: {
		schema: {
			KEYSTATIC_GITHUB_CLIENT_ID: envField.string({
				context: 'server',
				access: 'secret',
				optional: true,
			}),
			KEYSTATIC_GITHUB_CLIENT_SECRET: envField.string({
				context: 'server',
				access: 'secret',
				optional: true,
			}),
			KEYSTATIC_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
			PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: envField.string({
				context: 'client',
				access: 'public',
				optional: true,
			}),
		},
	},
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
