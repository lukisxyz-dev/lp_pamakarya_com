/**
 * sections.ts -- the in-page anchor contract.
 *
 * The header nav (Base.astro) links to these ids and the landing page
 * (index.astro) puts them on the section elements. Both read this module, so
 * a nav link and its target can never drift apart, and an id can never be
 * renamed on only one side.
 *
 * Every id is lowercase, hyphenated, and already used as a `kebab-case` word
 * in the page copy. The section elements themselves are written in Steps 4-5
 * and must carry `tabindex="-1"` so an anchor jump moves focus, not just
 * scroll position (WCAG 2.4.11), plus the global `scroll-margin` from
 * tokens.css.
 *
 * Where each id lives on the landing page:
 *
 *   #layanan     Section §2 top -- "Layanan dan material", the section wrapper
 *   #kapasitas   Section §2 subsection -- the service/capacity table and the
 *                lead-time table. Target of the sticky-bar "Kapasitas" button
 *                and of the hero's secondary CTA.
 *   #material    Section §2 subsection -- the material families, grouped by
 *                the live site's own application pairings
 *   #bukti       Section §3 -- documentary photographs
 *   #cara-pesan  Section §4 -- ordering steps, file checklist, pricing
 *   #faq         Section §5 -- the FAQ disclosures
 */

export const sectionIds = {
	/** §2 section wrapper; header nav "Layanan". */
	layanan: "layanan",
	/** §2 capacity table + lead-time table; sticky bar "Kapasitas". */
	kapasitas: "kapasitas",
	/** §2 material list; header nav "Material". */
	material: "material",
	/** §3 documentary proof. */
	bukti: "bukti",
	/** §4 ordering; header nav "Cara pesan". */
	caraPesan: "cara-pesan",
	/** §5 FAQ; header nav "FAQ". */
	faq: "faq",
} as const;

export type SectionId = (typeof sectionIds)[keyof typeof sectionIds];

/**
 * Build an in-page href. Use this rather than writing the fragment by hand: a
 * bare hash with no target scrolls to the top and is a dead end of exactly the
 * kind the current site is built from, and the type keeps a typo out of the
 * markup.
 */
export const anchor = (id: SectionId): `#${SectionId}` => `#${id}`;

/**
 * Build a section href that is valid from wherever it is rendered.
 *
 * A bare `#layanan` only resolves on the landing page. The shell renders the
 * same header and the same sticky bar on the 404, where those ids do not
 * exist, so a bare fragment there is a link that does nothing -- the exact
 * dead-end failure this rebuild exists to remove. Qualifying with `/` costs
 * nothing on the landing page (the browser treats it as a same-document
 * navigation and scrolls) and makes the anchor correct on every page.
 */
export const sectionHref = (id: SectionId, onLandingPage: boolean): string =>
	onLandingPage ? `#${id}` : `/#${id}`;

/**
 * The header nav, in order. Rendered only at >=1024px; below that the sticky
 * bar's "Kapasitas" button delivers the one jump that matters and everything
 * else is reached by scrolling a page that is about five screens tall.
 *
 * There is deliberately no Blog entry and no Admin entry: the site has no
 * second destination, and `/_emdash/admin` is not a public route.
 */
export const navItems: { id: SectionId; label: string }[] = [
	{ id: sectionIds.layanan, label: "Layanan" },
	{ id: sectionIds.material, label: "Material" },
	{ id: sectionIds.caraPesan, label: "Cara pesan" },
	{ id: sectionIds.faq, label: "FAQ" },
];
