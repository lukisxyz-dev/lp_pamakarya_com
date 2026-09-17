/**
 * content.ts -- the one place that reads the Keystatic-managed collections.
 *
 * Every consumer (bands, pages, footer, JSON-LD) goes through these helpers
 * so sorting and the landing filter live in exactly one spot. "Tampilkan di
 * beranda" is opt-out: an unstated preference shows the item everywhere.
 *
 * Ordering: services by their explicit Urutan number, ties by title; the
 * portfolio has no order field, so its ids sort naturally (2 before 10).
 */
import type { ImageMetadata } from "astro";
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

const portfolioImageFiles = import.meta.glob<{ default: ImageMetadata }>(
	"../assets/portfolio/*.webp",
	{ eager: true },
);
const portfolioImageByBasename: Record<string, ImageMetadata> = Object.fromEntries(
	Object.entries(portfolioImageFiles).map(([path, mod]) => [
		path.split("/").pop() ?? "",
		mod.default,
	]),
);

export type ServiceEntry = CollectionEntry<"services">;
export type PortfolioEntry = CollectionEntry<"portfolio">;
export type PostEntry = CollectionEntry<"blog">;

export async function getAllServices(): Promise<ServiceEntry[]> {
	const entries = await getCollection("services");
	return entries.sort(
		(a, b) =>
			(a.data.order ?? Number.MAX_SAFE_INTEGER) - (b.data.order ?? Number.MAX_SAFE_INTEGER) ||
			a.data.title.localeCompare(b.data.title),
	);
}

export async function getLandingServices(): Promise<ServiceEntry[]> {
	return (await getAllServices()).filter((entry) => entry.data.landing !== false);
}

export async function getAllPortfolio(): Promise<PortfolioEntry[]> {
	const entries = await getCollection("portfolio");
	return entries.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
}

export async function getAllPosts(): Promise<PostEntry[]> {
	const entries = await getCollection("blog");
	return entries.sort(
		(a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
	);
}

export type ReasonEntry = CollectionEntry<"reasons">;
export type StepEntry = CollectionEntry<"steps">;
export type FaqEntry = CollectionEntry<"faqs">;
export type Settings = CollectionEntry<"settings">["data"];

/** Urutan kecil dulu; entri tanpa urutan ditaruh paling belakang. */
const byOrder = <T extends { data: { order?: number } }>(a: T, b: T) =>
	(a.data.order ?? Number.MAX_SAFE_INTEGER) - (b.data.order ?? Number.MAX_SAFE_INTEGER);

export async function getAllReasons(): Promise<ReasonEntry[]> {
	return (await getCollection("reasons")).sort(byOrder);
}

export async function getAllSteps(): Promise<StepEntry[]> {
	return (await getCollection("steps")).sort(byOrder);
}

export async function getAllFaqs(): Promise<FaqEntry[]> {
	return (await getCollection("faqs")).sort(byOrder);
}

/**
 * The single "Pengaturan situs" entry: company name, contact channels, and
 * the three ledgers (materials, sectors, accepted file formats). Throws when
 * it is missing -- every page needs it, so a silent fallback would ship a
 * site with a blank header instead of failing the build.
 */
export async function getSettings(): Promise<Settings> {
	const [entry] = await getCollection("settings");
	if (!entry) {
		throw new Error("Entry 'Pengaturan situs' tidak ditemukan di src/content/settings.yaml.");
	}
	return entry.data;
}

/**
 * Portfolio photos as the grid wants them: the stored
 * `/src/assets/portfolio/<file>.webp` path resolved to real ImageMetadata, so
 * the picture keeps going through Astro's image pipeline. A reference to a
 * file that is gone throws -- a broken photo must fail the build, not vanish.
 * `landingOnly` applies the "Tampilkan di beranda" filter for the homepage.
 */
export async function getPortfolioGridItems(options: { landingOnly?: boolean } = {}) {
	const entries = (await getAllPortfolio()).filter(
		(entry) => !options.landingOnly || entry.data.landing !== false,
	);
	return entries.map((entry) => {
		const src = portfolioImageByBasename[entry.data.image.split("/").pop() ?? ""];
		if (!src) {
			throw new Error(
				`Foto tidak ditemukan di src/assets/portfolio: ${entry.data.image} (entry ${entry.id})`,
			);
		}
		return {
			src,
			alt: entry.data.caption ?? entry.data.title,
			...(entry.data.caption ? { caption: entry.data.caption } : {}),
		};
	});
}
