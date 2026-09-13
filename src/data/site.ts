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

/** One service line ("unit usaha"). */
export interface ServiceUnit {
	name: string;
	/** Absent where the live site names the unit but never describes it. */
	description?: string;
}

/**
 * business -- what the company is, in the live site's own words, and what it
 * sells. The live site publishes it in two places and they do not agree:
 *
 *   - the "Layanan" menu lists five units: Laser Cutting, Laser CO2, Laser
 *     Marking, CNC Routing, Cutting Akrilik. Three of the five pages behind
 *     those links are 404 and the other two say "System Is Under Maintenance",
 *     so the menu proves the names and nothing else.
 *   - the homepage's "Layanan Kami" cards describe six: Laser Cutting Plat /
 *     Metal, Laser Cutting Akrilik, Laser Marking, Jasa Pembuatan Pagar, Jasa
 *     Pembuatan Fasad, Pembuatan Mesin Tepat Guna.
 *
 * The three that appear in both are merged once below, described with the
 * homepage's own sentence. Laser CO2 and CNC Routing have no description
 * anywhere on the live site, so they carry their name only: a written-out
 * capability nothing published would be an invented one.
 *
 * `materials` and `sectors` are the FAQ's own answers and the about page's own
 * list. Nothing here is a claim the client has not already made.
 */
export const business = {
	/** Meta description. One sentence, services first, because that is the query. */
	description:
		"Jasa laser cutting, laser marking, CNC routing, dan fabrikasi custom untuk kebutuhan industri. Pengalaman lebih dari 10 tahun dengan hasil presisi.",
	serviceUnits: [
		{
			name: "Laser Cutting",
			description: "Jasa laser cutting plat dan metal dengan hasil presisi tinggi.",
		},
		{
			name: "Laser Cutting Akrilik",
			description: "Jasa laser cutting akrilik dengan hasil yang estetik.",
		},
		{ name: "Laser CO2" },
		{
			name: "Laser Marking",
			description: "Jasa laser marking dengan ketelitian dan hasil yang presisi.",
		},
		{ name: "CNC Routing" },
		{
			name: "Jasa Pembuatan Pagar",
			description: "Jasa pembuatan pagar yang kokoh untuk melindungi rumah.",
		},
		{
			name: "Jasa Pembuatan Fasad",
			description: "Jasa pembuatan fasad yang estetik.",
		},
		{
			name: "Pembuatan Mesin Tepat Guna",
			description: "Pembuatan mesin tepat guna dan manufaktur custom sesuai kebutuhan.",
		},
	] satisfies ServiceUnit[],
	/** The FAQ's own answer to "material apa saja yang bisa diproses?". */
	materials: ["Akrilik", "MDF", "Kayu", "Stainless steel", "Aluminium", "Plastik", "Karet"],
	/** The about page's own list of industries served. */
	sectors: ["Otomotif", "Elektronik", "Arsitektur", "Interior", "Konstruksi", "Industri kreatif"],
	/** The mark, and its real pixel size -- the size the file on disk has. */
	logo: { path: "/logo.png", width: 1920, height: 768 },
} as const;
