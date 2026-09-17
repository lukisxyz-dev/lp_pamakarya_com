/**
 * keystatic.config.ts -- the /keystatic admin's shape, and nothing else.
 *
 * Keystatic is the editor only: it writes these files into the repo and the
 * build reads them back through src/content.config.ts. The storage kind is
 * decided by environment -- local mode while developing (writes straight to
 * the working tree), GitHub mode in production (commits through the GitHub
 * API), so the same config serves both.
 *
 * Labels and help text are in Bahasa Indonesia because the editor is the
 * client, not a developer. "Tampilkan di beranda" defaults to true: an
 * unstated preference must show the work, not hide it.
 */
import { collection, config, fields } from "@keystatic/core";

/** The GitHub repo GitHub mode commits to -- the repo must live on GitHub. */
const GITHUB_REPO = "OWNER/REPO";

const storage = import.meta.env.DEV
	? ({ kind: "local" } as const)
	: ({ kind: "github", repo: GITHUB_REPO } as const);

export default config({
	storage,
	collections: {
		portfolio: collection({
			label: "Portofolio",
			pluralLabel: "Portofolio",
			slugField: "title",
			path: "src/content/portfolio/*",
			format: { data: "yaml" },
			entryLayout: "form",
			schema: {
				title: fields.slug({
					name: {
						label: "Judul",
						description: "Nama pekerjaan, mis. 'Pagar laser cutting rumah'.",
						validation: { isRequired: true },
					},
				}),
				image: fields.image({
					label: "Foto",
					description: "Wajib. Foto hasil pengerjaan; tanpa foto entry tidak bisa disimpan.",
					directory: "src/assets/portfolio",
					publicPath: "/src/assets/portfolio/",
					validation: { isRequired: true },
				}),
				caption: fields.text({
					label: "Keterangan",
					description: "Opsional. Muncul di bawah foto pada halaman portofolio.",
					multiline: true,
				}),
				landing: fields.checkbox({
					label: "Tampilkan di beranda",
					description: "Biarkan tercentang agar foto muncul di halaman utama.",
					defaultValue: true,
				}),
			},
		}),
	},
});
