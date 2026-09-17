/**
 * keystatic.config.ts -- the /keystatic admin's shape, and nothing else.
 *
 * Keystatic is the editor only: it writes the files under src/content/ and
 * the build reads them back through src/content.config.ts. Storage is local
 * while developing (writes straight to the working tree) and Keystatic Cloud
 * in production builds, where commits are made by Keystatic's service on the
 * editor's behalf -- editors sign in with an email and password there, so
 * they need no GitHub account. import.meta.env is what lets Vite inline the
 * switch on the client, where process.env does not exist.
 *
 * Labels and help text are in Bahasa Indonesia because the editor is the
 * client, not a developer. "Tampilkan di beranda" defaults to true: an
 * unstated preference must show the work, not hide it.
 */
import { collection, config, fields } from "@keystatic/core";

/** team/project from the Keystatic Cloud project settings. */
const CLOUD_PROJECT = "pamakarya/pamakarya";

const storage = import.meta.env.DEV
	? ({ kind: "local" } as const)
	: ({ kind: "cloud" } as const);

const landingField = () =>
	fields.checkbox({
		label: "Tampilkan di beranda",
		description: "Biarkan tercentang agar item ini muncul di halaman utama.",
		defaultValue: true,
	});

const servicesImage = (label: string, description?: string) =>
	fields.image({
		label,
		...(description ? { description } : {}),
		directory: "public/services",
		publicPath: "/services/",
	});

export default config({
	storage,
	cloud: { project: CLOUD_PROJECT },
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
				landing: landingField(),
			},
		}),
		services: collection({
			label: "Jasa",
			pluralLabel: "Jasa",
			slugField: "title",
			path: "src/content/services/*",
			format: { data: "yaml" },
			entryLayout: "form",
			schema: {
				title: fields.slug({
					name: {
						label: "Nama layanan",
						description: "Mis. 'Laser Cutting'. Urutan alfabetis tidak masalah; pakai Urutan.",
						validation: { isRequired: true },
					},
				}),
				description: fields.text({
					label: "Deskripsi",
					description: "Satu kalimat yang tampil pada kartu layanan di beranda.",
					multiline: true,
				}),
				image: servicesImage(
					"Foto / ilustrasi",
					"Wajib. Foto diam yang tampil sebagai latar kartu layanan.",
				),
				imageAnimated: servicesImage(
					"Foto animasi (opsional)",
					"Versi bergerak dari foto yang sama; diputar di kartu layanan.",
				),
				landing: landingField(),
				order: fields.number({
					label: "Urutan",
					description: "Angka kecil tampil lebih dulu. Kartu beranda diberi nomor dari urutan ini.",
					defaultValue: 0,
				}),
			},
		}),
		blog: collection({
			label: "Blog",
			pluralLabel: "Blog",
			slugField: "title",
			path: "src/content/blog/*",
			format: { contentField: "content" },
			entryLayout: "form",
			schema: {
				title: fields.slug({
					name: {
						label: "Judul",
						validation: { isRequired: true },
					},
				}),
				excerpt: fields.text({
					label: "Ringkasan",
					description: "Satu dua kalimat untuk daftar blog dan hasil pencarian Google.",
					multiline: true,
					validation: { isRequired: true },
				}),
				publishedAt: fields.date({
					label: "Tanggal terbit",
					validation: { isRequired: true },
				}),
				cover: fields.image({
					label: "Foto sampul (opsional)",
					description: "Tampil di daftar blog dan di atas tulisan.",
					directory: "src/assets/blog",
					publicPath: "/src/assets/blog/",
				}),
				content: fields.markdoc({
					label: "Isi tulisan",
					description: "Tulis seperti di Word: heading, daftar, gambar bisa disisipkan.",
				}),
			},
		}),
	},
});
