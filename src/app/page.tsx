import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { HeroNav } from "@/components/hero-nav";
import { GalleryImage } from "@/components/gallery-image";
import { AlumniCarousel } from "@/components/alumni-carousel";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Footer } from "@/components/footer";

async function getHomeData() {
  const [profile, featuredPosts, latestPosts, albums, latestGalleryItems, categories, alumni] = await Promise.all([
    prisma.siteProfile.findFirst({ where: { id: 1 } }),
    prisma.post.findMany({
      where: { status: "published", featured: true },
      take: 3,
      orderBy: { publishedAt: "desc" },
      include: { author: true, category: true },
    }),
    prisma.post.findMany({
      where: { status: "published" },
      take: 6,
      orderBy: { publishedAt: "desc" },
      include: { author: true, category: true },
    }),
    prisma.album.findMany({
      take: 6,
      include: { _count: { select: { items: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.galleryItem.findMany({
      where: { showOnHome: true },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { album: true },
    }),
    prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
    }),
    prisma.alumni.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return { profile, featuredPosts, latestPosts, albums, latestGalleryItems, categories, alumni };
}

function formatDate(date: Date) {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function HomePage() {
  const { profile, featuredPosts, latestPosts, albums, latestGalleryItems, categories, alumni } = await getHomeData();

  const bannerBrightness = `brightness(${(profile?.homeBannerBrightness ?? 35) / 100})`;

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-primary overflow-hidden">
        {/* Background Banner Image - constrained to header width */}
        {profile?.homeBanner && (
          <div className="absolute inset-0 flex justify-center pointer-events-none">
            <div className="w-full max-w-[90%] px-4 sm:px-6 lg:px-8 h-full">
              <div className="relative w-full h-full">
                <img
                  src={profile.homeBanner}
                  alt="Banner"
                  className="w-full h-full object-cover"
                  style={{ filter: bannerBrightness }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-950/60 via-primary-900/40 to-primary-950/20" />
              </div>
            </div>
          </div>
        )}
        {/* Pattern overlay when no banner */}
        {!profile?.homeBanner && (
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50 pointer-events-none" />
        )}

        {/* Top Navigation Bar with secondary color */}
        <HeroNav
          logo={profile?.logo}
          schoolName={profile?.shortName || "SMA Annajah"}
          slogan={profile?.slogan}
          ppdbUrl={profile?.ppdbUrl || "https://sas.smaannajah.sch.id/ppdb"}
        />

        <div className="relative z-10 max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {profile?.slogan?.split("|")[0] || "Mewujudkan Generasi"}
              <br />
              <span className="text-primary-300">
                {profile?.slogan?.split("|")[1]?.trim() || "Berprestasi & Berakhlak Mulia"}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-primary-200 mb-8 max-w-2xl">
              {profile?.description || "SMA Annajah adalah sekolah menengah atas yang berkomitmen untuk mencetak generasi unggul, berakhlak mulia, dan berprestasi di era global."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/profil"
                className="px-8 py-3.5 bg-white text-primary-900 font-semibold rounded-xl hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl"
              >
                Profil Sekolah
              </Link>
              <Link
                href="/berita"
                className="px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                Berita Terbaru
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="section-title">Berita Unggulan</h2>
              <p className="section-subtitle mx-auto">
                Informasi dan berita terbaru dari SMA Annajah
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {featuredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/berita/${post.slug}`}
                  className="card group"
                >
                  <div className="aspect-[16/10] bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    {post.category && (
                      <span
                        className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-3"
                        style={{
                          backgroundColor: post.category.color + "20",
                          color: post.category.color,
                        }}
                      >
                        {post.category.name}
                      </span>
                    )}
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                      <span>{post.author.name}</span>
                      <span>&middot;</span>
                      <span>{post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About / Visi Misi */}
      {(profile?.vision || profile?.mission) && (
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="section-title">Visi & Misi</h2>
                <p className="section-subtitle">
                  Landasan dan tujuan penyelenggaraan pendidikan di SMA Annajah
                </p>
                {profile?.vision && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                    <h3 className="font-semibold text-primary-900 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Visi
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{profile.vision}</p>
                  </div>
                )}
                {profile?.mission && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-primary-900 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      Misi
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {profile.mission}
                    </p>
                  </div>
                )}
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-primary-100 to-primary-50 rounded-3xl p-8 lg:p-12">
                  <div className="space-y-6">
                    {[
                      {
                        num: "1",
                        title: profile?.feature1Title || "Pendidikan Berkualitas",
                        desc: profile?.feature1Description || "Kurikulum terpadu dengan standar nasional",
                      },
                      {
                        num: "2",
                        title: profile?.feature2Title || "Pengembangan Karakter",
                        desc: profile?.feature2Description || "Pembentukan akhlak mulia dan budi pekerti",
                      },
                      {
                        num: "3",
                        title: profile?.feature3Title || "Prestasi & Inovasi",
                        desc: profile?.feature3Description || "Mendorong siswa berprestasi dan berinovasi",
                      },
                    ].map((feature) => (
                      <div key={feature.num} className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary-900 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                          {feature.num}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest News */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-title">Berita Terbaru</h2>
              <p className="section-subtitle">Ikuti perkembangan terbaru dari SMA Annajah</p>
            </div>
            <Link href="/berita" className="btn-secondary hidden sm:inline-flex">
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.length > 0 ? (
              latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/berita/${post.slug}`}
                  className="card group"
                >
                  <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {post.image ? (
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    {post.category && (
                      <span
                        className="inline-block px-2.5 py-1 text-xs font-medium rounded-full mb-2"
                        style={{ backgroundColor: post.category.color + "20", color: post.category.color }}
                      >
                        {post.category.name}
                      </span>
                    )}
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-400">
                Belum ada berita
              </div>
            )}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link href="/berita" className="btn-primary">
              Lihat Semua Berita
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {(albums.length > 0 || latestGalleryItems.length > 0) && (
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="section-title">Galeri Kegiatan</h2>
                <p className="section-subtitle">Dokumentasi kegiatan dan momen di SMA Annajah</p>
              </div>
              <Link href="/galeri" className="btn-secondary hidden sm:inline-flex">
                Lihat Galeri
              </Link>
            </div>

            {/* Latest Photos */}
            {latestGalleryItems.length > 0 && (
              <div className="mb-10">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {latestGalleryItems.map((item) => (
                    <a
                      key={item.id}
                      href={item.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100"
                    >
                      <GalleryImage
                        src={item.image}
                        alt={item.title || "Foto galeri"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      {item.album && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur rounded-lg text-white text-xs">
                          {item.album.title}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Albums */}
            {albums.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Album Galeri</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {albums.map((album) => (
                    <Link
                      key={album.id}
                      href={`/galeri/${album.slug}`}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-primary-200 to-primary-300"
                    >
                      {album.coverImage ? (
                        <GalleryImage
                          src={album.coverImage}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-12 h-12 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white font-medium text-sm">{album.title}</p>
                          <p className="text-white/70 text-xs mt-1">{album._count.items} foto</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center mt-8 sm:hidden">
              <Link href="/galeri" className="btn-primary">
                Lihat Galeri
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Alumni Testimonials */}
      {alumni.length > 0 && (
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="section-title">Kata Alumni</h2>
              <p className="section-subtitle mx-auto">
                Pendapat dan kesan mereka selama belajar di SMA Annajah
              </p>
            </div>
            <AlumniCarousel items={alumni} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-900 to-primary-800 rounded-3xl p-8 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Bergabunglah Bersama Kami
              </h2>
              <p className="text-primary-200 text-lg mb-8 max-w-2xl mx-auto">
                Daftarkan putra-putri Anda di SMA Annajah dan jadilah bagian dari generasi unggul berprestasi
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href={profile?.ppdbUrl || "https://sas.smaannajah.sch.id/ppdb"}
                  className="px-10 py-4 bg-white text-primary-900 font-bold text-lg rounded-xl hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl"
                >
                  Daftar Sekarang
                </Link>
                <Link
                  href="/profil"
                  className="px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                >
                  Pelajari Lebih Lanjut
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton whatsapp={profile?.whatsapp || null} />
    </>
  );
}
