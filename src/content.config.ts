/**
 * content.config.ts -- the three Keystatic-managed collections.
 *
 * Keystatic writes these files (see keystatic.config.ts); this file is how
 * the build reads them. Portfolio photos are kept under src/assets so they
 * keep going through Astro's image pipeline, so the schema resolves the
 * stored path string into real ImageMetadata by basename. Services media
 * stays in public/services as plain URLs -- it is drawn as a CSS background,
 * which the pipeline does not handle.
 */
import type { ImageMetadata } from "astro";
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const portfolioImageFiles = import.meta.glob<{ default: ImageMetadata }>(
	"./assets/portfolio/*.webp",
	{ eager: true },
);
const portfolioImageByBasename: Record<string, ImageMetadata> = Object.fromEntries(
	Object.entries(portfolioImageFiles).map(([path, mod]) => [path.split("/").pop() ?? "", mod.default]),
);

const portfolio = defineCollection({
	loader: glob({ pattern: "*.yaml", base: "./src/content/portfolio" }),
	schema: z.object({
		title: z.string(),
		image: z
			.string()
			.transform((value, ctx) => {
				const meta = portfolioImageByBasename[value.split("/").pop() ?? ""];
				if (!meta) {
					ctx.addIssue({
						code: "custom",
						message: `Foto tidak ditemukan di src/assets/portfolio: ${value}`,
					});
					return z.NEVER;
				}
				return meta;
			}),
		caption: z.string().optional(),
		landing: z.boolean().optional(),
	}),
});

const services = defineCollection({
	loader: glob({ pattern: "*.yaml", base: "./src/content/services" }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		image: z.string().optional(),
		imageAnimated: z.string().optional(),
		landing: z.boolean().optional(),
		order: z.number().optional(),
	}),
});

const blog = defineCollection({
	loader: glob({ pattern: "*.mdoc", base: "./src/content/blog" }),
	schema: z.object({
		title: z.string(),
		excerpt: z.string(),
		publishedAt: z.coerce.date(),
		cover: z.string().optional(),
	}),
});

export const collections = { portfolio, services, blog };
