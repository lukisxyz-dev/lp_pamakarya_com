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
