/**
 * site.ts -- the two facts that are not content: the site's own URL, and the
 * `wa.me` link builder the pages use.
 *
 * Everything a client edits now lives in Keystatic (src/content): company
 * name, tagline, description, contact channels, the material/sector/file
 * ledgers, the service lines, the reasons, the ordering steps, the FAQs, the
 * portfolio, and the blog. Read those through src/utils/content.ts.
 *
 * The WhatsApp number is the one field that appears in a URL *and* in a
 * sentence, so the builder takes the whole base URL from the settings
 * singleton rather than assembling it here -- `whatsappLink` is called with
 * the settings object every time.
 */
import type { Settings } from "../utils/content";

/**
 * The mark and its real pixel size. Not content: the numbers must match the
 * file on disk, so they belong next to the code that declares them (see also
 * Header.astro and Footer.astro, which draw the same file).
 */
export const logo = { path: "/logo.png", width: 450, height: 180 };

/** A `wa.me` deep link carrying an opening line. */
export const whatsappLink = (settings: Settings, message: string): string =>
	`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
