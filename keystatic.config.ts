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
import { collection, config, fields, singleton } from "@keystatic/core";

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
		reasons: collection({
			label: "Kenapa memilih kami",
			pluralLabel: "Kenapa memilih kami",
			slugField: "title",
			path: "src/content/reasons/*",
			format: { data: "yaml" },
			entryLayout: "form",
			schema: {
				title: fields.slug({
					name: {
						label: "Alasan",
						description: "Mis. 'Hasil presisi tinggi'. Satu baris, jadi judul baris di beranda.",
						validation: { isRequired: true },
					},
				}),
				description: fields.text({
					label: "Penjelasan",
					description: "Satu kalimat yang menjelaskan alasan di atasnya.",
					multiline: true,
					validation: { isRequired: true },
				}),
				order: fields.number({
					label: "Urutan",
					description: "Angka kecil tampil lebih dulu.",
					defaultValue: 0,
				}),
			},
		}),
		steps: collection({
			label: "Alur pemesanan",
			pluralLabel: "Alur pemesanan",
			slugField: "title",
			path: "src/content/steps/*",
			format: { data: "yaml" },
			entryLayout: "form",
			schema: {
				title: fields.slug({
					name: {
						label: "Langkah",
						description: "Mis. 'Hubungi kami'.",
						validation: { isRequired: true },
					},
				}),
				description: fields.text({
					label: "Penjelasan",
					description: "Apa yang terjadi pada langkah ini.",
					multiline: true,
					validation: { isRequired: true },
				}),
				order: fields.number({
					label: "Urutan",
					description: "Angka kecil tampil lebih dulu; langkah 1 juga jadi pembuka band.",
					defaultValue: 0,
				}),
			},
		}),
		faqs: collection({
			label: "Tanya jawab",
			pluralLabel: "Tanya jawab",
			slugField: "question",
			path: "src/content/faqs/*",
			format: { data: "yaml" },
			entryLayout: "form",
			schema: {
				question: fields.slug({
					name: {
						label: "Pertanyaan",
						validation: { isRequired: true },
					},
				}),
				answer: fields.text({
					label: "Jawaban",
					description: "Jawaban singkat sebelum daftar poin (kalau ada).",
					multiline: true,
					validation: { isRequired: true },
				}),
				points: fields.array(
					fields.text({ label: "Poin", validation: { isRequired: true } }),
					{
						label: "Poin jawaban",
						description: "Opsional. Tiap baris jadi satu butir daftar.",
						itemLabel: (props) => props.value || "Poin",
					},
				),
				order: fields.number({
					label: "Urutan",
					description: "Angka kecil tampil lebih dulu.",
					defaultValue: 0,
				}),
			},
		}),
	},
	singletons: {
		settings: singleton({
			label: "Pengaturan situs",
			path: "src/content/settings",
			format: { data: "yaml" },
			entryLayout: "form",
			schema: {
				companyName: fields.text({
					label: "Nama perusahaan",
					validation: { isRequired: true },
				}),
				tagline: fields.text({
					label: "Tagline",
					description: "Baris pendek di samping nama pada judul halaman.",
					validation: { isRequired: true },
				}),
				description: fields.text({
					label: "Deskripsi singkat",
					description: "Dipakai sebagai meta description bawaan dan di footer.",
					multiline: true,
					validation: { isRequired: true },
				}),
				materials: fields.array(
					fields.text({ label: "Material", validation: { isRequired: true } }),
					{
						label: "Material yang diproses",
						description: "Tampil di bagian Tentang Kami dan halaman kontak.",
						itemLabel: (props) => props.value || "Material",
					},
				),
				sectors: fields.array(
					fields.text({ label: "Industri", validation: { isRequired: true } }),
					{
						label: "Industri yang dilayani",
						description: "Tampil di bagian Tentang Kami.",
						itemLabel: (props) => props.value || "Industri",
					},
				),
				fileFormats: fields.array(
					fields.text({ label: "Format", validation: { isRequired: true } }),
					{
						label: "Format desain yang diterima",
						description: "Mis. AI, DXF, SVG, PDF. Tampil di CTA dan halaman kontak.",
						itemLabel: (props) => props.value || "Format",
					},
				),
				whatsappDisplay: fields.text({
					label: "Nomor WhatsApp (tampilan)",
					description: "Seperti yang tercetak di situs, mis. 0878-8435-4403.",
					validation: { isRequired: true },
				}),
				whatsappNumber: fields.text({
					label: "Nomor WhatsApp (wa.me)",
					description: "Format internasional tanpa tanda plus, mis. 6287884354403.",
					validation: { isRequired: true },
				}),
				phone: fields.text({
					label: "Telepon (tel:)",
					description: "Format internasional dengan tanda plus, mis. +6287884354403.",
					validation: { isRequired: true },
				}),
				email: fields.text({
					label: "Email",
					validation: { isRequired: true },
				}),
				instagramHandle: fields.text({
					label: "Instagram (tampilan)",
					validation: { isRequired: true },
				}),
				instagramUrl: fields.text({
					label: "Instagram (tautan)",
					validation: { isRequired: true },
				}),
				tokopediaHandle: fields.text({
					label: "Tokopedia (tampilan)",
					validation: { isRequired: true },
				}),
				tokopediaUrl: fields.text({
					label: "Tokopedia (tautan)",
					validation: { isRequired: true },
				}),
			},
		}),
	},
});
