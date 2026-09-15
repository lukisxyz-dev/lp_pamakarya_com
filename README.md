# Pamakarya

Situs Pamakarya, dibangun dengan [EmDash](https://github.com/emdash-cms/emdash) di atas Astro, berjalan di Cloudflare Workers.

Seluruh isi halaman publik berasal dari apa yang Pamakarya sudah publikasikan di pamakarya.com: deskripsi perusahaan, unit layanan, material, sektor industri, FAQ, dan dua belas foto portofolio. Tidak ada klaim baru yang ditambahkan. Klaim "10 tahun pengalaman" yang ada di situs lama sengaja tidak dipakai.

## Commands

```bash
pnpm dev              # Server dev Astro
pnpm build            # Build produksi
npx emdash types      # Regenerasi tipe TypeScript dari situs yang berjalan
pnpm format           # Format repo (oxfmt + Prettier untuk .astro)
pnpm format:check     # Cek format tanpa menulis
```

Admin UI ada di `http://localhost:4321/_emdash/admin`.

## Halaman

| Halaman     | Rute                     | Isi                                                                      |
| ----------- | ------------------------ | ------------------------------------------------------------------------ |
| Beranda     | `/`                      | Hero, Tentang, Layanan, Kenapa Kami, Alur, Portofolio (8 foto), FAQ, CTA |
| Layanan     | `/jasa`                  | Delapan unit layanan, tiga ledger spesifikasi, alur pemesanan, CTA       |
| Portofolio  | `/portfolio`             | Dua belas foto                                                           |
| Kontak      | `/contact`               | Kanal kontak, FAQ, CTA                                                   |
| Post        | `/posts`, `/posts/:slug` | Rute blog dari template; tidak ditautkan dari navigasi                   |
| Halaman CMS | `/:slug`                 | Halaman dari koleksi `pages`                                             |

## Struktur

| Berkas                            | Peran                                                                                                    |
| --------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `src/data/site.ts`                | Semua fakta perusahaan: kontak, unit layanan, material, sektor, alasan memilih, alur, FAQ, format berkas |
| `src/data/portfolio.ts`           | Dua belas foto dari `src/assets/portfolio` dan alt text-nya                                              |
| `src/components/`                 | Satu berkas per section; `WorkGrid.astro` dipakai beranda dan `/portfolio`                               |
| `src/styles/theme.css`            | Token warna, tipe, spasi, plus primitif `.band`, `.btn`, dan `.on-ink`                                   |
| `src/pages/robots.txt.ts`         | robots.txt; menggantikan milik EmDash agar bisa menunjuk dua sitemap                                     |
| `src/pages/sitemap-static.xml.ts` | Sitemap empat rute Astro, yang tidak bisa ditulis EmDash karena bukan entri koleksi                      |
| `seed/seed.json`                  | Skema koleksi, menu, dan konten contoh                                                                   |

Section memakai primitif bersama di `theme.css`: `.band` untuk irama vertikal, `.band__title`/`.band__lede` untuk kepala section, `.btn`/`.btn--primary`/`.btn--ghost` untuk tombol, dan `.on-ink` sebagai kontrak warna untuk apa pun yang dicat di atas navy.

## Sitemap dan robots

EmDash menulis `/sitemap.xml` sebagai indeks berisi satu sitemap per koleksi CMS, dan itu hanya memuat entri koleksi. Empat rute Astro (`/`, `/jasa`, `/portfolio`, `/contact`) bukan entri, jadi `sitemap-static.xml.ts` yang mendaftarkannya dan `robots.txt.ts` yang menunjuk keduanya. Robots.txt tetap menghormati Settings → SEO saat memuat isinya sendiri.

## Ikon dan kartu sosial

`public/` memuat `favicon.ico` (16/32/48), `icon-192.png`, `apple-touch-icon.png`, dan `og.jpg` (1200×630). Semuanya diturunkan dari `public/logo.png` dan foto hero, bukan aset baru. `Base.astro` memasangnya sebagai cadangan: begitu Settings → General punya favicon atau Settings → SEO punya gambar OG default, milik editor yang dipakai.

## Alt text portofolio

Situs lama memuat dua belas foto itu tanpa caption apa pun — halaman portofolionya masih berisi teks template yang belum diisi. Karena itu alt text-nya menyebut fakta yang pasti ("hasil pengerjaan Pamakarya, foto N dari 12") dan bukan menebak material atau nama produk.

Isi `ALT_TEXT` di `src/data/portfolio.ts` begitu subjek tiap foto sudah dipastikan. Itu satu-satunya suntingan yang berkas itu butuh.

## Tidak ada di situs ini

- **Alamat, kota, jam buka, peta.** Situs lama tidak mempublikasikan satu pun, dan peta ke tempat yang tidak diketahui lebih buruk daripada tanpa peta.
- **Formulir kontak.** Perusahaan menerima pesanan lewat WhatsApp dan email saja, jadi halaman kontak menyebut kanal itu apa adanya.
- **Nomor telepon terpisah.** Nomor yang bisa dihubungi adalah nomor WhatsApp itu sendiri.
- **Halaman pricelist.** Tombolnya di situs lama tidak menuju ke mana pun; tidak ada halaman yang bisa ditaut.
- **Kebijakan privasi / syarat & ketentuan.** Tidak ada di situs lama, jadi tidak ditaut dari footer.

## Deploy

```bash
pnpm deploy
```

Runtime Cloudflare Workers, database D1, penyimpanan R2. Konfigurasi ada di `astro.config.mjs` dan `wrangler.jsonc`.
