import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig, fontProviders } from "astro/config";
import emdash from "emdash/astro";

export default defineConfig({
	output: "server",
	adapter: cloudflare(),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	/**
	 * Open Runde (https://github.com/lauridskern/open-runde), self-hosted from
	 * src/fonts -- it is not on Google Fonts, so the local provider is the only
	 * option. Four static weights bound to one CSS variable; the metric-matched
	 * fallback Astro generates from those files is what keeps the header from
	 * reflowing before the font lands.
	 */
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
	integrations: [
		react(),
		emdash({
			database: d1({ binding: "DB", session: "auto" }),
			storage: r2({ binding: "MEDIA" }),
		}),
	],
	devToolbar: { enabled: false },
});
