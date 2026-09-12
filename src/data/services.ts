/**
 * services.ts -- the single source of truth for what Pamakarya offers.
 *
 * Every value in this file traces to the GROUNDED list given to this build.
 * There are no estimates, no placeholders and no `TBD` strings: where the
 * client has published nothing, the field is `null`, and any component that
 * consumes it must restructure so no empty cell is rendered. The one thing
 * that must never happen is a plausible-looking invented number -- a
 * fabrication buyer checks specifications, and one wrong figure costs more
 * credibility than a missing one. (`pendingClientConfirmations` below is the
 * list of what is missing.)
 *
 * The landing page renders both its desktop table and its stacked mobile
 * `<dl>` blocks from this one module. Never hand-maintain a second copy.
 */

/** A material family Pamakarya processes. */
export interface Material {
	/** Display name, as the live site writes it. */
	name: string;
	/** Short uppercase Latin form for mono spec labels. */
	label: string;
}

/**
 * Stable slug for a material group. A literal union rather than `string`, so a
 * typo in a service's material list is a compile error instead of a silently
 * empty cell.
 */
export type MaterialGroupSlug = "akrilik-mdf-kayu" | "stainless-aluminium" | "plastik-karet";

/**
 * The material families, grouped by the live site's own application pairings
 * rather than by shop taxonomy. The grouping and its "cocok untuk" line are
 * the site's claim, used verbatim: it is the only statement it makes about
 * which material is for which kind of job.
 */
export interface MaterialGroup {
	slug: MaterialGroupSlug;
	/** Serial number, matching the order the live site's FAQ lists them in. */
	index: number;
	/** The material families in this group, as the live site names them. */
	materials: Material[];
	/** The live site's own "cocok untuk" pairing, verbatim. */
	application: string;
}

/** The three grounded lead-time tiers. */
export interface LeadTimeTier {
	/** Stable slug for in-page anchors. */
	slug: string;
	/** The published tier, e.g. `"1–2 hari"`. En dash, not a hyphen. */
	label: string;
	/** The published qualifier, e.g. `"desain simpel, jumlah kecil"`. */
	qualifier: string;
}

/** A sector Pamakarya states it serves. */
export interface Sector {
	/** Display name, as the live site writes it. */
	name: string;
	/** Short uppercase Latin form for mono spec labels. */
	label: string;
}

/** One of the six services Pamakarya offers. */
export interface Service {
	/** Stable slug for in-page anchors. */
	slug: string;
	/** The service name, verbatim from the live site's "Layanan Kami" grid. */
	name: string;
	/**
	 * One plain factual sentence. No superlatives, no "solusi", no claim the
	 * live site does not already make.
	 */
	summary: string;
	/**
	 * The material groups this service is known to handle, at the family-level
	 * granularity the client actually published -- the live site attaches its
	 * material list to the workshop, not to a thickness or a tolerance per
	 * service.
	 *
	 * `null` where the client publishes nothing, deliberately not `[]`: an
	 * empty array would read as "this service handles no material", which is a
	 * different and false claim.
	 */
	materials: MaterialGroup[] | null;
	/**
	 * The live site's own "cocok untuk" pairing for this service.
	 *
	 * ALWAYS `null`, and that is the honest value: the site attaches its
	 * application pairings to the material families, not to the services --
	 * see `MaterialGroup.application`, which is populated and which the tables
	 * render. A service-to-application pairing is a client decision, not
	 * something to infer from the material list. The field is kept so Step 4
	 * has an explicit hook for the per-service column.
	 */
	application: string | null;
	/**
	 * A grounded lead-time tier, or `null` where the live site does not state
	 * one. The published tiers describe a scale ("produksi massal" 7+ hari),
	 * not a per-service promise, so only the mass-production service resolves.
	 */
	leadTime: LeadTimeTier | null;
}

/** The material families, grouped by the live site's application pairings. */
export const materialGroups: MaterialGroup[] = [
	{
		slug: "akrilik-mdf-kayu",
		index: 1,
		materials: [
			{ name: "Akrilik", label: "AKRILIK" },
			{ name: "MDF", label: "MDF" },
			{ name: "Kayu", label: "KAYU" },
		],
		application: "dekorasi, signage, furnitur",
	},
	{
		slug: "stainless-aluminium",
		index: 2,
		materials: [
			{ name: "Stainless", label: "STAINLESS" },
			{ name: "Aluminium", label: "ALUMINIUM" },
		],
		application: "industri otomotif & konstruksi",
	},
	{
		slug: "plastik-karet",
		index: 3,
		materials: [
			{ name: "Plastik", label: "PLASTIK" },
			{ name: "Karet", label: "KARET" },
		],
		application: "kemasan & branding produk",
	},
];

/** The three published lead-time tiers, verbatim. */
export const leadTimeTiers: LeadTimeTier[] = [
	{ slug: "cepat", label: "1–2 hari", qualifier: "desain simpel, jumlah kecil" },
	{ slug: "sedang", label: "3–5 hari", qualifier: "pesanan sedang" },
	{ slug: "massal", label: "7+ hari", qualifier: "produksi massal" },
];

/** The six sectors the live site states it serves. */
export const sectors: Sector[] = [
	{ name: "Otomotif", label: "OTOMOTIF" },
	{ name: "Elektronik", label: "ELEKTRONIK" },
	{ name: "Konstruksi", label: "KONSTRUKSI" },
	{ name: "Arsitektur", label: "ARSITEKTUR" },
	{ name: "Interior", label: "INTERIOR" },
	{ name: "Industri kreatif", label: "INDUSTRI KREATIF" },
];

/** Resolve a group slug. Throws if the slug is unknown -- build-time data. */
export function materialGroup(slug: MaterialGroupSlug): MaterialGroup {
	const group = materialGroups.find((candidate) => candidate.slug === slug);
	if (!group) throw new Error(`Unknown material group slug: ${slug}`);
	return group;
}

/** Resolve a lead-time tier slug. Throws if the slug is unknown. */
export function leadTimeTier(slug: string): LeadTimeTier {
	const tier = leadTimeTiers.find((candidate) => candidate.slug === slug);
	if (!tier) throw new Error(`Unknown lead-time tier slug: ${slug}`);
	return tier;
}

/**
 * The six services, in the order the live site lists them.
 *
 * `materials` and `leadTime` are deliberately sparse, and the sparseness is the
 * point. The live site grounds material families for laser cutting only; it
 * publishes nothing about which material laser marking, the two fabrication
 * services or mesin tepat guna handle. Note also that the grounded family
 * `Plastik, Karet` appears in the material list but is not attributed to a
 * specific service anywhere, so no service claims it.
 */
export const services: Service[] = [
	{
		slug: "laser-cutting-plat-metal",
		name: "Laser Cutting Plat / Metal",
		summary:
			"Layanan potong plat dan metal dengan mesin laser CNC, dengan hasil potong yang mengikuti file desain.",
		materials: [materialGroup("stainless-aluminium")],
		application: null,
		leadTime: null,
	},
	{
		slug: "laser-cutting-akrilik",
		name: "Laser Cutting Akrilik",
		summary:
			"Layanan potong akrilik dan MDF dengan mesin laser CNC, dengan hasil potong yang mengikuti file desain.",
		materials: [materialGroup("akrilik-mdf-kayu")],
		application: null,
		leadTime: null,
	},
	{
		slug: "laser-marking",
		name: "Laser Marking",
		summary:
			"Layanan penandaan permukaan material dengan mesin laser, untuk menuliskan teks, nomor, atau logo pada part.",
		materials: null,
		application: null,
		leadTime: null,
	},
	{
		slug: "jasa-pembuatan-pagar",
		name: "Jasa Pembuatan Pagar",
		summary: "Pembuatan pagar besi yang dikerjakan sesuai ukuran dan desain yang Anda kirim.",
		materials: null,
		application: null,
		leadTime: null,
	},
	{
		slug: "jasa-pembuatan-fasad",
		name: "Jasa Pembuatan Fasad",
		summary: "Pembuatan fasad bangunan yang dikerjakan sesuai ukuran dan desain yang Anda kirim.",
		materials: null,
		application: null,
		leadTime: null,
	},
	{
		slug: "pembuatan-mesin-tepat-guna",
		name: "Pembuatan Mesin Tepat Guna",
		summary:
			"Pembuatan mesin tepat guna sesuai kebutuhan produksi atau usaha Anda, dikerjakan dari desain yang disepakati.",
		materials: null,
		application: null,
		leadTime: leadTimeTier("massal"),
	},
];

/**
 * Every value the client must supply before more of the spec sheet can be
 * shown. Documentation only -- it is never rendered on the page and no page
 * may import it. Grouped by what is being asked for rather than by page
 * section, so the list can be sent to the client as-is.
 */
export const pendingClientConfirmations: string[] = [
	// Process capability
	"Toleransi yang bisa dicapai per material",
	"Daya mesin (kW) dan area kerja (mm) per unit",
	"Ketebalan maksimum per material",
	"Material dan finishing yang tersedia per layanan",
	"Kemampuan laser marking: material yang bisa ditandai dan kedalaman marking",

	// Commercials
	"Minimum order",
	"Ketentuan pembayaran dan DP",
	"Satuan perhitungan harga (per luas potong, per menit mesin, atau per unit)",
	"Berapa lama penawaran dikirim setelah file diterima",
	"Apakah menerima PO dan menerbitkan faktur",
	"Apakah ada garansi, dan apa cakupan syaratnya",

	// Lead time
	"Tambahan hari untuk finishing dan untuk rangka/assembly",

	// Contact and location
	"Jam operasional",
	"Alamat lengkap",
	"Area layanan dan ketentuan kirim luar kota",
];
