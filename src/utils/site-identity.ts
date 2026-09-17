/**
 * site-identity.ts -- the site's own address and navigation, which are code
 * concerns rather than content: the canonical origin, the title separator,
 * and the menu. The company name and tagline are the client's words and live
 * in the "Pengaturan situs" Keystatic entry (see src/utils/content.ts).
 */
export const siteUrl = "https://pamakarya.com";
export const titleSeparator = " | ";

export interface MenuItem {
	label: string;
	url: string;
	target?: string;
}

export const primaryMenu: MenuItem[] = [
	{ label: "Beranda", url: "/" },
	{ label: "Tentang Kami", url: "/#tentang-kami" },
	{ label: "Jasa", url: "/#jasa" },
	{ label: "Portofolio", url: "/#portofolio" },
	{ label: "Blog", url: "/blog" },
	{ label: "Kontak", url: "/#kontak" },
];

export function slugify(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}
