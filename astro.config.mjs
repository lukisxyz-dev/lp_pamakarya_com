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
	integrations: [
		// Required by EmDash: the admin UI hydrates with React. Removing this
		// leaves the admin stuck on "Loading EmDash...".
		react(),
		emdash({
			database: d1({ binding: "DB", session: "auto" }),
			storage: r2({ binding: "MEDIA" }),
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "IBM Plex Sans",
			cssVariable: "--font-body",
			weights: [400, 500, 600, 700],
			styles: ["normal"],
			subsets: ["latin"],
			fallbacks: ["sans-serif"],
		},
		{
			// Every numeral, unit, label, table figure and caption. Pair it
			// with `font-variant-numeric: tabular-nums` so columns of figures
			// align. Nothing on this site is italic, hence styles: ["normal"].
			provider: fontProviders.google(),
			name: "IBM Plex Mono",
			cssVariable: "--font-mono",
			weights: [400, 500, 600],
			styles: ["normal"],
			subsets: ["latin"],
			fallbacks: ["ui-monospace", "monospace"],
		},
	],
	devToolbar: { enabled: false },
});
