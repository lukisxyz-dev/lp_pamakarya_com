// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	image: {
		layout: "constrained",
		responsiveStyles: true,
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
