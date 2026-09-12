/**
 * site.ts -- the grounded company facts the landing page states.
 *
 * Same rule as src/data/services.ts: every value here traces to the GROUNDED
 * list, and anything the client has not published is absent rather than
 * guessed. Because this file has no `null` fields, its shape is the
 * enforcement -- what is not in here does not exist yet. In particular there
 * is deliberately no address, no city, no opening hours, no minimum order, no
 * payment terms and no warranty: the live site publishes none of them, and
 * Pamakarya's location is not published anywhere. See
 * `pendingClientConfirmations` in ./services.ts for the open questions.
 */

/** The company name, as the live site writes it. */
export const companyName = "Pamakarya";

/** Years operating, as the live site states it. */
export const experience = {
	value: "10+",
	unit: "tahun",
	/** Plain-language form for running prose. */
	prose: "10+ tahun",
} as const;

/**
 * The file formats the live site accepts, verbatim. Order and names are the
 * site's own: `AI` and `SVG` are the drawing formats, `DXF` and `PDF` the
 * interchange formats.
 */
export const designFileFormats: string[] = ["AI", "DXF", "SVG", "PDF"];

/** Contact details. All four are published on the live site. */
export const contact = {
	/** Display number, as printed on the live site. */
	whatsappDisplay: "0878-8435-4403",
	/** E.164, for the wa.me deep link. */
	whatsappNumber: "6287884354403",
	/** `https://wa.me/<number>` -- append `?text=` for a prefilled intent. */
	whatsappBaseUrl: "https://wa.me/6287884354403",
	email: "pama.karya.disgn@gmail.com",
	instagramUrl: "https://www.instagram.com/pamakaryadesign/",
	instagramHandle: "@pamakaryadesign",
	tokopediaUrl: "https://www.tokopedia.com/pamakary",
	tokopediaHandle: "pamakary",
} as const;

/**
 * The live site's own claim, and the only commercial promise it makes. Stated
 * once, in the hero, and nowhere else.
 */
export const freeConsultation = "Konsultasi gratis";

/**
 * Build a `wa.me` deep link with a prefilled message.
 *
 * `encodeURIComponent` is used rather than hand-written `%0A` escapes: the
 * spec's templates are written with `%0A` because they are documentation, but
 * a hand-escaped string is one mistyped hex digit away from a broken link, and
 * it cannot carry the `&` in "otomotif & konstruksi" or the en dashes in the
 * lead-time tiers.
 *
 * Callers pass a distinct opening intent per CTA -- hero, post-capacity and
 * footer each ask a different question, so the buyer never arrives with the
 * generic "mohon info layanannya" that every competitor sends.
 */
export const whatsappLink = (message: string): string =>
	`${contact.whatsappBaseUrl}?text=${encodeURIComponent(message)}`;

/**
 * The documentary stills in `public/foto/`.
 *
 * Pre-optimised WebP, referenced with plain `<img>`: Astro's `<Image>` is not
 * available here (the `sharp` build script is deliberately blocked in
 * pnpm-workspace.yaml), so every intrinsic size below is the file's real
 * pixel size, read from its WebP header. Hard-coding width/height is what
 * keeps CLS at zero, so these numbers must stay in step with the files.
 *
 * No captions are attached to these: what each photograph shows is only known
 * to whoever shot it, and a caption naming a material or a thickness that the
 * photograph does not provably show would be an invented specification.
 */
export interface Photo {
	/** Path under `public/`. */
	src: string;
	/** Intrinsic pixel width, as encoded. */
	width: number;
	/** Intrinsic pixel height, as encoded. */
	height: number;
}

export const heroPhoto: { desktop: Photo; mobile: Photo } = {
	desktop: { src: "/foto/hero.webp", width: 1000, height: 667 },
	mobile: { src: "/foto/hero-mobile.webp", width: 800, height: 1000 },
};

/**
 * The proof strip. Six photographs, in file order. The short descriptions are
 * generic on purpose -- "Pekerjaan fabrikasi" is supportable, a named material
 * or a measured dimension would not be.
 */
export const proofPhotos: (Photo & { description: string })[] = [
	{ src: "/foto/proof-1.webp", width: 800, height: 533, description: "Pekerjaan fabrikasi" },
	{ src: "/foto/proof-2.webp", width: 800, height: 533, description: "Pekerjaan fabrikasi" },
	{ src: "/foto/proof-3.webp", width: 800, height: 533, description: "Pekerjaan fabrikasi" },
	{ src: "/foto/proof-4.webp", width: 800, height: 533, description: "Pekerjaan fabrikasi" },
	{ src: "/foto/proof-5.webp", width: 800, height: 533, description: "Pekerjaan fabrikasi" },
	{ src: "/foto/proof-6.webp", width: 800, height: 533, description: "Pekerjaan fabrikasi" },
];

/**
 * The ordering steps, verbatim from the live FAQ's five-step answer. Rendered
 * as an `<ol>` in one section and as the prefilled WhatsApp checklist in
 * another, both from this array.
 */
export const orderingSteps: string[] = [
	"Hubungi via WhatsApp atau email",
	"Kirim desain",
	"Konsultasi & revisi desain",
	"Produksi dimulai",
	"Pengiriman atau ambil langsung",
];

/** What to send with an enquiry, as the mono checklist reads it. */
export interface EnquiryChecklistItem {
	/** Mono label, uppercase. */
	label: string;
	/** What the buyer supplies for that line. */
	detail: string;
}

export const enquiryChecklist: EnquiryChecklistItem[] = [
	{ label: "DESAIN", detail: "File desain (AI, DXF, SVG, PDF), atau foto sketsa berukuran" },
	{ label: "MATERIAL", detail: "Jenis material yang diinginkan" },
	{ label: "UKURAN", detail: "Panjang dan lebar part, dalam mm" },
	{ label: "JUMLAH", detail: "Jumlah part yang dipesan" },
	{
		label: "LINGKUP",
		detail: "Potong saja, atau termasuk perakitan dan pemasangan",
	},
];

/**
 * The cost variables named in the pricing paragraph. This is the whole of the
 * page's pricing content: there is no price list, no minimum order and no
 * pricing unit, because the client has confirmed none.
 */
export const pricingCostVariables: string[] = [
	"Material",
	"Ketebalan",
	"Panjang potong",
	"Jumlah",
	"Tingkat kerumitan",
	"Finishing",
];
