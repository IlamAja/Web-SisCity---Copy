import type { Page } from '../App'
import type { ContentItem, PartnerCity } from '../data/mock'

const G = '#1a4030'
const GOLD = '#c9963a'
const PARCH = '#f7f2ea'

interface Props {
  articleId: number
  navigate: (p: Page, cityId?: string, articleId?: number) => void
  contentItems: ContentItem[]
  partnerCities: PartnerCity[]
}

export default function ArticleDetailPage({ articleId, navigate, contentItems, partnerCities }: Props) {
  const article = contentItems.find(item => item.id === articleId)

  if (!article || article.status !== 'published') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: PARCH }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📄</div>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '24px', color: G, marginBottom: '8px' }}>Artikel tidak ditemukan</h2>
          <p style={{ color: 'rgba(28,18,8,0.55)', marginBottom: '24px' }}>Artikel ini mungkin belum dipublish atau sudah dihapus.</p>
          <button
            onClick={() => navigate('landing')}
            style={{ backgroundColor: G, color: 'white', padding: '12px 28px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    )
  }

  const city = partnerCities.find(c => c.name === article.city)
  const formattedDate = new Date(article.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

  // Related articles: same city, same type, published, excluding current
  const related = contentItems
    .filter(item => item.id !== articleId && item.status === 'published' && item.type === 'article' && item.city === article.city)
    .slice(0, 3)

  return (
    <div style={{ backgroundColor: PARCH, minHeight: '100vh' }}>
      {/* ─── HERO / HEADER ──────────────────────────────── */}
      <div style={{
        position: 'relative',
        backgroundColor: G,
        padding: '64px 24px 48px',
        overflow: 'hidden',
      }}>
        {/* Background image overlay */}
        {article.thumbnail && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${article.thumbnail})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0.18,
          }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, rgba(26,64,48,0.85) 0%, rgba(26,64,48,0.97) 100%)` }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('landing')}
              style={{ color: 'rgba(255,255,255,0.5)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', padding: 0 }}
            >
              Beranda
            </button>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>›</span>
            {city && (
              <>
                <button
                  onClick={() => navigate('partner-city', city.id)}
                  style={{ color: 'rgba(255,255,255,0.5)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', padding: 0 }}
                >
                  {city.flag} {city.name}
                </button>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>›</span>
              </>
            )}
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Artikel</span>
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {article.tags.map(tag => (
                <span key={tag} style={{
                  backgroundColor: 'rgba(201,150,58,0.25)',
                  color: '#e0ac56',
                  border: '1px solid rgba(201,150,58,0.4)',
                  padding: '4px 12px',
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontSize: 'clamp(28px, 5vw, 48px)',
            color: 'white',
            fontWeight: 500,
            lineHeight: 1.25,
            marginBottom: '24px',
          }}>
            {article.title}
          </h1>

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: G }}>
                {article.author.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px' }}>{article.author}</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>·</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{formattedDate}</span>
            {city && (
              <>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>·</span>
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>{city.flag} {city.name}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── THUMBNAIL IMAGE ────────────────────────────── */}
      {article.thumbnail && (
        <div style={{ maxWidth: '800px', margin: '-24px auto 0', padding: '0 24px', position: 'relative', zIndex: 5 }}>
          <img
            src={article.thumbnail}
            alt={article.title}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '440px',
              objectFit: 'cover',
              display: 'block',
              boxShadow: '0 8px 40px rgba(26,64,48,0.25)',
            }}
          />
        </div>
      )}

      {/* ─── ARTICLE CONTENT ────────────────────────────── */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: article.thumbnail ? '48px 24px 80px' : '48px 24px 80px' }}>
        <div
          className="article-body"
          style={{
            fontSize: '17px',
            lineHeight: 1.85,
            color: 'rgba(28,18,8,0.82)',
            backgroundColor: 'white',
            padding: '48px 56px',
            boxShadow: '0 2px 16px rgba(28,18,8,0.06)',
            border: '1px solid #e8dfc9',
          }}
          dangerouslySetInnerHTML={{ __html: article.content ?? '<p style="color: rgba(28,18,8,0.4); font-style: italic;">Konten artikel belum tersedia.</p>' }}
        />

        {/* ─── BACK BUTTON ──────────────────────────────── */}
        <div style={{ marginTop: '40px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => city ? navigate('partner-city', city.id) : navigate('landing')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: G, color: 'white',
              padding: '12px 24px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600, transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7-7 7 7 7" />
            </svg>
            {city ? `Kembali ke ${city.name}` : 'Kembali ke Beranda'}
          </button>
          <button
            onClick={() => navigate('landing')}
            style={{
              backgroundColor: 'transparent', color: G,
              padding: '12px 24px', border: `1px solid ${G}`, cursor: 'pointer',
              fontSize: '13px', fontWeight: 500, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = G; e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = G }}
          >
            Beranda
          </button>
        </div>

        {/* ─── RELATED ARTICLES ──────────────────────────── */}
        {related.length > 0 && (
          <div style={{ marginTop: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ height: '1px', width: '32px', backgroundColor: GOLD }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: GOLD, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Artikel Terkait</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              {related.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => navigate('article-detail', undefined, rel.id)}
                  style={{
                    backgroundColor: 'white', border: '1px solid #e8dfc9',
                    cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(28,18,8,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  {rel.thumbnail && (
                    <img src={rel.thumbnail} alt={rel.title} style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }} />
                  )}
                  <div style={{ padding: '16px' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: GOLD, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                      {rel.tags[0] ?? 'Artikel'}
                    </div>
                    <h4 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '15px', color: G, fontWeight: 500, lineHeight: 1.4, margin: 0 }}>{rel.title}</h4>
                    <div style={{ marginTop: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(28,18,8,0.4)' }}>
                      {new Date(rel.date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
