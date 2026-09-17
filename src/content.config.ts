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
import { file, glob } from "astro/loaders";
import { load as parseYaml } from "js-yaml";

const portfolio = defineCollection({
	loader: glob({ pattern: "*.yaml", base: "./src/content/portfolio" }),
	schema: z.object({
		title: z.string(),
		/** A path under src/assets/portfolio; resolved to ImageMetadata at render. */
		image: z.string(),
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

const reasons = defineCollection({
	loader: glob({ pattern: "*.yaml", base: "./src/content/reasons" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		order: z.number().optional(),
	}),
});

const steps = defineCollection({
	loader: glob({ pattern: "*.yaml", base: "./src/content/steps" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		order: z.number().optional(),
	}),
});

const faqs = defineCollection({
	loader: glob({ pattern: "*.yaml", base: "./src/content/faqs" }),
	schema: z.object({
		question: z.string(),
		answer: z.string(),
		points: z.array(z.string()).optional(),
		order: z.number().optional(),
	}),
});

const settings = defineCollection({
	/**
	 * `file()` reads a YAML object as a map of entries, so the singleton's
	 * fields are nested under one id. The object is written by Keystatic's
	 * "Pengaturan situs" singleton (src/content/settings.yaml); getSettings()
	 * in src/utils/content.ts unwraps the single entry.
	 */
	loader: file("./src/content/settings.yaml", {
		parser: (text) => ({ settings: parseYaml(text) }),
	}),
	schema: z.object({
		companyName: z.string(),
		tagline: z.string(),
		description: z.string(),
		materials: z.array(z.string()),
		sectors: z.array(z.string()),
		fileFormats: z.array(z.string()),
		whatsappDisplay: z.string(),
		whatsappNumber: z.string(),
		phone: z.string(),
		email: z.string(),
		instagramHandle: z.string(),
		instagramUrl: z.string(),
		tokopediaHandle: z.string(),
		tokopediaUrl: z.string(),
	}),
});

export const collections = { portfolio, services, blog, reasons, steps, faqs, settings };
