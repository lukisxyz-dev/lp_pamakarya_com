export const siteTitle = "Pamakarya";
export const siteTagline = "Custom Laser Cutting & Fabrikasi";
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
	{ label: "Kontak", url: "/#kontak" },
];

export function slugify(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}
