/**
 * site.ts -- the company facts a page or the header states, and the only place
 * they are written down.
 *
 * Same rule as the rest of the site: every value here traces to something
 * Pamakarya has published. All five come from pamakarya.com, which prints one
 * email, one WhatsApp number, and three profiles (Instagram, Tokopedia,
 * WhatsApp) in its own header and footer.
 *
 * Deliberately absent: street address, city, opening hours, and a separate
 * landline. The live site publishes none of them. The phone number a visitor
 * can actually reach is the WhatsApp number, so the top strip's "telephone"
 * is that number and nothing else -- inventing a second one would be a
 * fabricated way to contact the company.
 *
 * Email and phone are not EmDash site settings (the settings model stores
 * title, tagline, logo, favicon, url, postsPerPage, dateFormat, timezone,
 * social, and seo), and Tokopedia is not one of the services its `social`
 * object covers. Keeping the whole strip in one module is why it renders as
 * one strip; splitting it between settings and constants would give the top
 * bar two sources for one row.
 */

export const companyName = "Pamakarya";

export const contact = {
	/** As printed on the live site. */
	whatsappDisplay: "0878-8435-4403",
	/** E.164 without the plus, for wa.me. */
	whatsappNumber: "6287884354403",
	/** E.164 with the plus, for the `tel:` scheme. */
	phone: "+6287884354403",
	whatsappBaseUrl: "https://wa.me/6287884354403",
	email: "pama.karya.disgn@gmail.com",
	instagramUrl: "https://www.instagram.com/pamakaryadesign/",
	instagramHandle: "@pamakaryadesign",
	tokopediaUrl: "https://www.tokopedia.com/pamakary",
	tokopediaHandle: "pamakary",
} as const;

/**
 * A `wa.me` deep link carrying an opening line.
 *
 * `encodeURIComponent` rather than hand-written `%0A` escapes: a hand-escaped
 * string is one mistyped hex digit away from a broken link, and it cannot
 * carry the spaces and punctuation an Indonesian sentence needs.
 */
export const whatsappLink = (message: string): string =>
	`${contact.whatsappBaseUrl}?text=${encodeURIComponent(message)}`;

/**
 * business -- what the company is, in the live site's own words.
 *
 * The service lines ("unit usaha") used to live here; they are Keystatic
 * entries now (src/content/services), because the client edits them.
 * `materials` and `sectors` are the FAQ's own answers and the about page's own
 * list. Nothing here is a claim the client has not already made.
 */
export const business = {
	/** Meta description. One sentence, services first, because that is the query. */
	description:
		"Jasa laser cutting, laser marking, CNC routing, dan fabrikasi custom untuk kebutuhan industri dengan hasil presisi.",
	/** The FAQ's own answer to "material apa saja yang bisa diproses?". */
	materials: ["Akrilik", "MDF", "Kayu", "Stainless steel", "Aluminium", "Plastik", "Karet"],
	/** The about page's own list of industries served. */
	sectors: ["Otomotif", "Elektronik", "Arsitektur", "Interior", "Konstruksi", "Industri kreatif"],
	/** The mark, and its real pixel size -- the size the file on disk has. */
	logo: { path: "/logo.png", width: 450, height: 180 },
} as const;

/** One reason to choose the company. */
export interface Reason {
	title: string;
	/** The live site's own sentence, shortened only where it repeats the title. */
	description: string;
}

/**
 * whyUs -- the five quality claims the live site makes about itself, taken
 * from the homepage's "Penyedia Jasa Laser Cutting Terbaik" list. The FAQ
 * states the same set under "Kenapa memilih Pamakarya?".
 *
 * Its sixth claim, "10 tahun pengalaman", is deliberately absent: the client
 * rejects it (see About.astro). The remaining five are published as written.
 */
export const whyUs = [
	{
		title: "Hasil presisi tinggi",
		description: "Setiap potongan dikerjakan dengan mesin CNC presisi tinggi dan hasil akurat.",
	},
	{
		title: "Pengerjaan cepat & harga terjangkau",
		description: "Waktu pengerjaan singkat dengan penawaran harga yang bisa disesuaikan.",
	},
	{
		title: "Material berkualitas",
		description: "Bahan yang kami proses dipilih untuk hasil akhir yang rapi dan tahan lama.",
	},
	{
		title: "Desain custom sesuai kebutuhan",
		description: "Produk dibuat mengikuti gambar kerja, skema, atau ide yang Anda bawa.",
	},
	{
		title: "Dukungan tim profesional",
		description: "Dikerjakan tim yang menangani konsultasi, desain, produksi, hingga pengiriman.",
	},
] satisfies Reason[];

/** One step of the ordering flow. */
export interface ProcessStep {
	title: string;
	description: string;
}

/**
 * processSteps -- the FAQ's own answer to "Bagaimana cara memesan?", in its
 * own order. The WhatsApp-first opening is why the CTA on this site is a
 * WhatsApp link and not a form: the company does not take orders any other way.
 */
export const processSteps = [
	{
		title: "Hubungi kami",
		description: "Kirim pesan lewat WhatsApp atau email, sebutkan kebutuhan Anda.",
	},
	{
		title: "Kirim desain",
		description: "Lampirkan gambar kerja dalam format AI, DXF, SVG, atau PDF.",
	},
	{
		title: "Konsultasi & revisi",
		description: "Kami tinjau desain dan bahas penyesuaian sebelum produksi.",
	},
	{
		title: "Produksi",
		description: "Pengerjaan dimulai setelah desain dan material disepakati.",
	},
	{
		title: "Pengiriman",
		description: "Produk jadi dikirim ke lokasi Anda atau diambil langsung.",
	},
] satisfies ProcessStep[];

/** One question and its answer, from the live site's own FAQ. */
export interface Faq {
	question: string;
	/** Answers are the live site's, split into points where it wrote points. */
	answer: string;
	/** The bullet points the live site writes under this answer, if any. */
	points?: readonly string[];
}

/**
 * faqs -- the live homepage's "Paling Sering Ditanyakan", verbatim. The
 * "kenapa memilih" answer drops its 10-year line for the same reason whyUs
 * does; everything else is as published.
 *
 * These are the company's own words to its own customers, which is also what
 * makes them worth marking up as FAQPage for search.
 */
export const faqs = [
	{
		question: "Apa saja layanan yang ditawarkan Pamakarya?",
		answer: "Kami menyediakan layanan manufaktur untuk kebutuhan industri maupun satuan.",
		points: [
			"Laser Cutting: akrilik, MDF, stainless, aluminium, dan lainnya",
			"Laser Marking: ukiran detail dan tanda permanen",
			"Fabrikasi Custom: sesuai kebutuhan industri",
			"Manufaktur CNC Presisi",
			"Desain dan Prototyping",
		],
	},
	{
		question: "Kenapa memilih Pamakarya?",
		answer: "Karena pengerjaan kami mengutamakan hasil dan ketepatan waktu.",
		points: [
			"Hasil presisi tinggi",
			"Pengerjaan cepat dan harga terjangkau",
			"Material berkualitas",
			"Dukungan tim profesional",
		],
	},
	{
		question: "Material apa saja yang bisa diproses?",
		answer: "Material yang kami proses disesuaikan dengan kebutuhan produknya.",
		points: [
			"Akrilik, MDF, dan kayu untuk dekorasi, signage, dan furnitur",
			"Stainless steel dan aluminium untuk industri otomotif dan konstruksi",
			"Plastik dan karet untuk kemasan dan branding produk",
		],
	},
	{
		question: "Berapa lama waktu pengerjaan?",
		answer: "Waktu pengerjaan tergantung tingkat kesulitan dan jumlah pesanan.",
		points: [
			"1-2 hari untuk desain simpel dengan jumlah kecil",
			"3-5 hari untuk pesanan sedang",
			"7 hari atau lebih untuk produksi massal",
		],
	},
	{
		question: "Bagaimana cara memesan?",
		answer: "Pemesanan dilakukan lewat WhatsApp atau email, lalu berjalan dalam lima langkah.",
		points: [
			"Hubungi kami via WhatsApp atau email",
			"Kirim desain dalam format AI, DXF, SVG, atau PDF",
			"Konsultasi dan revisi desain",
			"Produksi dimulai",
			"Pengiriman atau ambil langsung",
		],
	},
] satisfies Faq[];

/**
 * fileFormats -- the design files the company asks for. Printed in the FAQ's
 * own answer, and repeated beside the upload-shaped CTA where a visitor
 * decides whether they can order at all.
 */
export const fileFormats = ["AI", "DXF", "SVG", "PDF"] as const;
