/**
 * portfolio.ts -- the work photos, pulled in from src/assets/portfolio.
 *
 * The files are the twelve images pamakarya.com publishes in its own gallery,
 * re-encoded to WebP at 1000px. They live under src/assets rather than public/
 * so Astro's image pipeline resizes and re-encodes them per breakpoint; the
 * glob means dropping a thirteenth file in adds it to the grid with no code
 * change.
 *
 * Alt text. The live site ships these images with no caption of any kind -- its
 * portfolio page is unfilled template text ("Calvin Carlo", "Design your apps
 * in your own way"). So each description states only what is certain: that the
 * photo is Pamakarya's own work, and its position in the set. Naming a material
 * or a product per photo would be inventing a claim about a picture nobody here
 * has been able to look at. Fill in ALT_TEXT as the real subjects are
 * confirmed; that is the one edit this file needs.
 */
import type { ImageMetadata } from "astro";

const photos = import.meta.glob<{ default: ImageMetadata }>("../assets/portfolio/*.webp", {
	eager: true,
});

/** Position of a `pamakarya-<n>.webp` filename, or 0 if it does not match. */
const ordinal = (path: string): number => {
	const match = /\/(\d+)\.webp$/.exec(path);
	return match ? Number(match[1]) : 0;
};

/**
 * Per-photo text, keyed by position. Anything missing falls back to the
 * numbered description below, so a new photo is never rendered with no alt.
 */
const ALT_TEXT: Record<number, { alt: string; caption?: string }> = {};

export interface PortfolioItem {
	src: ImageMetadata;
	alt: string;
	caption?: string;
}

const entries = Object.entries(photos)
	.map(([path, module]) => ({ path, src: module.default }))
	.sort((a, b) => ordinal(a.path) - ordinal(b.path));

export const portfolio: PortfolioItem[] = entries.map(({ src }, index) => {
	const position = index + 1;
	const authored = ALT_TEXT[position];
	return {
		src,
		alt: authored?.alt ?? `Hasil pengerjaan Pamakarya, foto ${position} dari ${entries.length}`,
		...(authored?.caption ? { caption: authored.caption } : {}),
	};
});
