import { useState } from 'react'
import { foreignRelationsPersonnel, galleryPhotos } from '../data/mock'
import type { ContentItem } from '../data/mock'
import { partnerCities as initialPartnerCities } from '../data/mock'
import type { Page } from '../App'

const G = '#1a4030'
const GOLD = '#c9963a'
const PARCH = '#f7f2ea'

interface Props {
  navigate: (p: Page, cityId?: string) => void
  partnerCities: typeof initialPartnerCities
  contentItems: ContentItem[]
}

type GalleryItem = {
  id: number | string
  src: string
  alt: string
  caption: string
  mediaType: 'photo' | 'video' | 'article'
  videoUrl?: string
}

function getEmbedUrl(url: string) {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`
    if (parsed.hostname.includes('youtube.com') && parsed.pathname === '/watch') {
      const videoId = parsed.searchParams.get('v')
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
  } catch {
    return url
  }
  return url
}

function GalleryMedia({ item, lightbox = false }: { item: GalleryItem; lightbox?: boolean }) {
  const mediaStyle = { width: '100%', height: lightbox ? 'auto' : '440px', objectFit: 'cover' as const, display: 'block' }
  if (item.mediaType === 'video' && item.videoUrl) {
    const isDirectVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(item.videoUrl)
    return isDirectVideo ? (
      <video src={item.videoUrl} controls style={mediaStyle} poster={item.src} />
    ) : (
      <iframe
        src={getEmbedUrl(item.videoUrl)}
        title={item.alt}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ ...mediaStyle, border: 0 }}
      />
    )
  }
  return <img src={item.src} alt={item.alt} style={mediaStyle} />
}

function EyebrowLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div style={{ height: '1px', width: '32px', backgroundColor: GOLD }} />
      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: GOLD, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{text}</span>
    </div>
  )
}

function SectionHeading({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', color: light ? 'white' : G, fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 500, lineHeight: 1.15 }}>
      {children}
    </h2>
  )
}

export default function LandingPage({ navigate, partnerCities, contentItems }: Props) {
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [galleryTab, setGalleryTab] = useState<'photos' | 'video' | 'articles'>('photos')
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const activityGalleryItems: GalleryItem[] = galleryPhotos.map(photo => ({ ...photo, mediaType: 'photo' as const }))
  const publishedContent = contentItems.filter(item => item.status === 'published')
  const contentGalleryItems: GalleryItem[] = publishedContent.map(item => {
    const city = partnerCities.find(partnerCity => partnerCity.name === item.city)
    const fallbackImage = city?.coverImage ?? activityGalleryItems[0].src
    return {
      id: `content-${item.id}`,
      src: item.thumbnail || fallbackImage,
      alt: item.title,
      caption: `${item.type === 'article' ? 'Artikel' : item.type === 'video' ? 'Video' : 'Foto'} · ${item.title}`,
      mediaType: item.type,
      videoUrl: item.videoUrl,
    }
  })
  const galleryCollections: Record<'photos' | 'video' | 'articles', GalleryItem[]> = {
    photos: [...activityGalleryItems, ...contentGalleryItems.filter((_, index) => publishedContent[index]?.type === 'photo')],
    video: [...activityGalleryItems.slice(0, 2), ...contentGalleryItems.filter((_, index) => publishedContent[index]?.type === 'video')],
    articles: contentGalleryItems.filter((_, index) => publishedContent[index]?.type === 'article'),
  }
  const visibleGalleryItems = galleryCollections[galleryTab]
  const currentVisibleGallery = visibleGalleryItems[galleryIndex % visibleGalleryItems.length] ?? activityGalleryItems[0]

  return (
    <div>
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - 62px)',
          backgroundImage: 'url(https://images.unsplash.com/photo-1583309219338-a582f1db9a68?w=1800&h=1000&fit=crop&auto=format)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,42,31,0.88) 0%, rgba(26,64,48,0.72) 60%, rgba(15,42,31,0.5) 100%)' }} />
        {/* Batik accent stripe */}
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: `linear-gradient(to bottom, ${GOLD}, transparent)` }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1152px', margin: '0 auto', padding: '0 24px', paddingTop: '12px', paddingBottom: '40px' }}>
          <div style={{ maxWidth: '760px', marginTop: '52px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ height: '1px', width: '40px', backgroundColor: GOLD }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: GOLD, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                Yogyakarta City Government
              </span>
            </div>
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(54px, 5vw, 90px)', fontWeight: 400, color: 'white', lineHeight: 0.94, marginBottom: '18px', letterSpacing: '-0.04em' }}>
              Explore<br />
              <span style={{ color: '#e0ac56' }}>Yogyakarta Sister</span>
              <br />
              Cities
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '18px', lineHeight: 1.6, maxWidth: '560px', marginBottom: '28px' }}>
              A digital platform for sister-city collaboration, connecting Yogyakarta with international partners through culture, knowledge, and shared urban development.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => document.getElementById('partner-cities')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ backgroundColor: GOLD, color: G, padding: '13px 26px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', letterSpacing: '0.02em', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e0ac56')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = GOLD)}
              >
                Explore Partner Cities
              </button>
              <button
                onClick={() => navigate('portal')}
                style={{ backgroundColor: 'transparent', color: 'white', padding: '13px 26px', fontSize: '14px', fontWeight: 500, border: '1px solid rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)')}
              >
                Register
              </button>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.35)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <div style={{ width: '1px', height: '40px', backgroundColor: 'rgba(255,255,255,0.25)', animation: 'pulse 2s infinite' }} />
          <span>Scroll</span>
        </div>
      </section>

      {/* ─── STATS RIBBON ─────────────────────────────────── */}
      <div style={{ backgroundColor: G }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {[
            { num: '8', label: 'Active Sister Cities', sub: 'across multiple regions' },
            { num: '39+', label: 'Years of Partnership', sub: 'since 1985' },
            { num: '200+', label: 'Joint Programs', sub: 'implemented' },
            { num: 'Global', label: 'Cultural Exchange', sub: 'and cooperation' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '8px' }}>
              <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(28px, 4vw, 40px)', color: GOLD, fontWeight: 600, lineHeight: 1 }}>{s.num}</div>
              <div style={{ color: 'white', fontSize: '13px', fontWeight: 500, marginTop: '4px' }}>{s.label}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', marginTop: '2px' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── MAYOR WELCOME ────────────────────────────────── */}
      <section style={{ padding: '96px 24px', backgroundColor: PARCH }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
          {/* Mayor */}
          <div>
            <EyebrowLabel text="Mayor's Message" />
            <SectionHeading>Message from the Mayor of Yogyakarta</SectionHeading>
            <div style={{ height: '3px', width: '48px', backgroundColor: GOLD, marginTop: '16px', marginBottom: '28px' }} />
            <blockquote style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: '24px', marginBottom: '32px' }}>
              <p style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '18px', lineHeight: 1.75, color: '#3d2f1a', fontStyle: 'italic', marginBottom: '8px' }}>
                "Yogyakarta is a city shaped by rich cultural heritage and a forward-looking spirit. Sister-city cooperation is more than diplomacy; it is a human bridge connecting communities, ideas, and hopes across borders."
              </p>
            </blockquote>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, color: G, fontSize: '15px' }}>Mayor of Yogyakarta</div>
                <div style={{ color: 'rgba(28,18,8,0.55)', fontSize: '13px', marginTop: '2px' }}>2021–2026</div>
              </div>
            </div>
          </div>

          {/* Foreign rep quotes */}
          <div>
            <EyebrowLabel text="Partner Voices" />
            <SectionHeading>From Our Sister Cities</SectionHeading>
            <div style={{ height: '3px', width: '48px', backgroundColor: GOLD, marginTop: '16px', marginBottom: '28px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { city: 'Kyoto, Jepang', flag: '🇯🇵', quote: '"Yogyakarta and Kyoto share the soul of cities that refuse to let tradition disappear — our partnership is a mutual vow to keep culture alive for generations to come."', name: 'Mayor Koji Matsui', role: 'Walikota Kyoto' },
                { city: 'Leiden, Belanda', flag: '🇳🇱', quote: '"The Javanese manuscripts in our university are not Dutch heritage — they are Yogyakarta\'s heritage that we are honored to return, page by page, to their rightful home."', name: 'Thierry Aartsen', role: 'Walikota Leiden' },
                { city: 'Gwangju, Korsel', flag: '🇰🇷', quote: '"Yogyakarta and Gwangju are kindred cities — both chose culture and humanity over silence when history demanded courage. That bond is unbreakable."', name: 'Kim Kwang-chung', role: 'Walikota Gwangju' },
              ].map(q => (
                <div key={q.city} style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '20px', boxShadow: '0 1px 4px rgba(28,18,8,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{q.flag}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: GOLD, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{q.city}</span>
                  </div>
                  <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'rgba(28,18,8,0.7)', fontStyle: 'italic', marginBottom: '10px' }}>{q.quote}</p>
                  <div style={{ fontSize: '11px', color: 'rgba(28,18,8,0.4)' }}>— {q.name}, {q.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PARTNER CITIES ───────────────────────────────── */}
      <section id="partner-cities" style={{ padding: '96px 24px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '56px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <EyebrowLabel text="Partner Cities" />
              <SectionHeading>Connected Cities<br />Across the World</SectionHeading>
            </div>
            <p style={{ maxWidth: '360px', color: 'rgba(28,18,8,0.6)', fontSize: '14px', lineHeight: 1.7 }}>
              Yogyakarta collaborates with cities around the world through cultural exchange, education, research, and sustainable urban development.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
            {partnerCities.map(city => (
              <button
                key={city.id}
                onClick={() => navigate('partner-city', city.id)}
                onMouseEnter={() => setHoveredCity(city.id)}
                onMouseLeave={() => setHoveredCity(null)}
                style={{
                  position: 'relative',
                  height: '260px',
                  overflow: 'hidden',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'block',
                  textAlign: 'left',
                  transition: 'transform 0.3s',
                  transform: hoveredCity === city.id ? 'scale(1.01)' : 'scale(1)',
                }}
              >
                <img
                  src={city.thumbImage}
                  alt={city.name}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', transform: hoveredCity === city.id ? 'scale(1.08)' : 'scale(1)' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(15,42,31,0.9) 0%, rgba(15,42,31,0.3) 50%, transparent 100%)` }} />
                {/* Status badge */}
                <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: GOLD, color: G, padding: '3px 10px', fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em' }}>
                  ACTIVE · {city.year}
                </div>
                <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '22px' }}>{city.flag}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{city.country}</span>
                  </div>
                  <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '24px', color: 'white', fontWeight: 500, lineHeight: 1 }}>{city.name}</div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {city.tags.slice(0, 2).map(tag => (
                      <span key={tag} style={{ fontSize: '10px', padding: '2px 8px', backgroundColor: 'rgba(201,150,58,0.25)', color: '#e0ac56', border: '1px solid rgba(201,150,58,0.3)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Hover arrow */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%)`,
                  width: '48px', height: '48px', borderRadius: '50%', backgroundColor: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: hoveredCity === city.id ? 1 : 0, transition: 'opacity 0.25s',
                }}>
                  <svg width="20" height="20" fill="none" stroke={G} strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" /></svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HUBUNGAN LUAR NEGERI ───────────────────────────── */}
      <section id="foreign-relations" style={{ padding: '96px 24px', backgroundColor: PARCH }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <div style={{ maxWidth: '560px', marginBottom: '56px' }}>
            <EyebrowLabel text="Team" />
            <SectionHeading>City Partnership Focal Points</SectionHeading>
            <div style={{ height: '3px', width: '48px', backgroundColor: GOLD, marginTop: '16px', marginBottom: '16px' }} />
            <p style={{ color: 'rgba(28,18,8,0.6)', fontSize: '14px', lineHeight: 1.7 }}>
              The local partnership team coordinates collaboration, project review, and international engagement across Yogyakarta's network of sister cities.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
            {foreignRelationsPersonnel.map((p, i) => (
              <div key={p.id} style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', overflow: 'hidden', boxShadow: '0 1px 6px rgba(28,18,8,0.05)', transition: 'box-shadow 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(28,18,8,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 6px rgba(28,18,8,0.05)')}
              >
                <div style={{ position: 'relative', minHeight: '32px', backgroundColor: '#e8dfc9' }}>
                  {i === 0 && (
                    <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: G, color: GOLD, padding: '3px 10px', fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em' }}>
                      KEPALA BIDANG
                    </div>
                  )}
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '15px', fontWeight: 500, color: G, lineHeight: 1.3, marginBottom: '4px' }}>{p.name}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: GOLD, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>{p.title}</div>
                  <p style={{ fontSize: '12px', color: 'rgba(28,18,8,0.6)', lineHeight: 1.6, marginBottom: '12px' }}>{p.bio}</p>
                  <div style={{ borderTop: '1px solid #e8dfc9', paddingTop: '12px', fontSize: '11px', color: 'rgba(28,18,8,0.5)' }}>
                    <div style={{ marginBottom: '3px' }}>📧 {p.email}</div>
                    <div>{p.phone}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GALLERY ──────────────────────────────────────── */}
      <section id="gallery" style={{ padding: '96px 24px', backgroundColor: G }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <EyebrowLabel text="Galeri Multimedia" />
              <SectionHeading light>Dokumentasi Kegiatan<br />Kota Mitra</SectionHeading>
            </div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0', border: `1px solid rgba(255,255,255,0.2)` }}>
              {(['photos', 'video', 'articles'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setGalleryTab(tab)}
                  style={{
                    padding: '10px 24px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                    backgroundColor: galleryTab === tab ? GOLD : 'transparent',
                    color: galleryTab === tab ? G : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {tab === 'photos' ? '📷 Foto' : tab === 'video' ? '🎬 Video' : '📰 Artikel'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '20px', alignItems: 'center' }}>
            <div style={{ position: 'relative', overflow: 'hidden', border: `1px solid rgba(255,255,255,0.15)`, background: 'rgba(255,255,255,0.02)' }}>
              {currentVisibleGallery.mediaType === 'video' && currentVisibleGallery.videoUrl ? (
                <GalleryMedia item={currentVisibleGallery} />
              ) : (
                <button
                  onClick={() => setLightbox(galleryIndex % visibleGalleryItems.length)}
                  style={{ width: '100%', border: 'none', background: 'transparent', padding: 0, cursor: 'zoom-in' }}
                >
                  <GalleryMedia item={currentVisibleGallery} />
                </button>
              )}
              <div style={{ position: 'absolute', inset: 'auto 0 0', padding: '20px 22px', background: 'linear-gradient(to top, rgba(15,42,31,0.85), rgba(15,42,31,0.08))' }}>
                <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '20px', color: 'white', marginBottom: '4px' }}>{currentVisibleGallery.caption}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => setGalleryIndex((galleryIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length || 0)}
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', padding: '12px 18px', fontSize: '14px', cursor: 'pointer' }}
              >
                ← Previous
              </button>
              <button
                onClick={() => setGalleryIndex((galleryIndex + 1) % visibleGalleryItems.length || 0)}
                style={{ backgroundColor: GOLD, color: G, border: 'none', padding: '12px 18px', fontSize: '14px', cursor: 'pointer', fontWeight: 600 }}
              >
                Next →
              </button>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                {visibleGalleryItems.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setGalleryIndex(index)}
                    style={{
                      width: '12px', height: '12px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                      backgroundColor: index === galleryIndex % visibleGalleryItems.length ? GOLD : 'rgba(255,255,255,0.25)',
                    }}
                    aria-label={`View slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ───────────────────────────────────── */}
      <section style={{ backgroundColor: GOLD, padding: '64px 24px' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '32px' }}>
          <div>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(24px, 3vw, 36px)', color: G, fontWeight: 500, marginBottom: '8px' }}>
              Interested in collaborating with Yogyakarta?
            </h2>
            <p style={{ color: 'rgba(26,64,48,0.75)', fontSize: '15px' }}>
              Partner cities and institutions can submit collaboration proposals through our official portal.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('portal')}
              style={{ backgroundColor: G, color: 'white', padding: '14px 32px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0f2a1f')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = G)}
            >
              Submit Proposal
            </button>
            <button
              onClick={() => navigate('portal')}
              style={{ backgroundColor: 'transparent', color: G, padding: '14px 32px', fontSize: '14px', fontWeight: 500, border: `1.5px solid ${G}`, cursor: 'pointer' }}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,42,31,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={() => setLightbox(null)}
        >
          <div style={{ maxWidth: '900px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <GalleryMedia item={visibleGalleryItems[lightbox]} lightbox />
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginTop: '12px', textAlign: 'center' }}>{visibleGalleryItems[lightbox].caption}</div>
          </div>
          <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: '24px', right: '24px', color: 'white', backgroundColor: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
          <button onClick={() => setLightbox((lightbox - 1 + visibleGalleryItems.length) % visibleGalleryItems.length)} style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: 'white', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', padding: '12px 16px', fontSize: '20px', cursor: 'pointer' }}>‹</button>
          <button onClick={() => setLightbox((lightbox + 1) % visibleGalleryItems.length)} style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)', color: 'white', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', padding: '12px 16px', fontSize: '20px', cursor: 'pointer' }}>›</button>
        </div>
      )}
    </div>
  )
}
