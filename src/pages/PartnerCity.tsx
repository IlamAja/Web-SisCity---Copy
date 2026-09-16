import { useState } from 'react'
import type { Page } from '../App'
import type { ContentItem, PartnerCity } from '../data/mock'

const G = '#1a4030'
const GOLD = '#c9963a'
const PARCH = '#f7f2ea'

function getPlainText(html: string) {
  const element = document.createElement('div')
  element.innerHTML = html
  return element.textContent?.replace(/\s+/g, ' ').trim() ?? ''
}

interface Props {
  cityId: string
  navigate: (p: Page, cityId?: string) => void
  partnerCities: PartnerCity[]
  contentItems: ContentItem[]
}

export default function PartnerCityPage({ cityId, navigate, partnerCities, contentItems }: Props) {
  const city = partnerCities.find(c => c.id === cityId) ?? partnerCities[0]
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null)

  const cityArticles = contentItems
    .filter(item => item.status === 'published' && item.type === 'article' && item.city === city.name)
    .map(item => ({
      id: item.id,
      title: item.title,
      image: item.thumbnail || city.thumbImage,
      date: item.date,
      tags: item.tags,
      excerpt: getPlainText(item.content ?? '').slice(0, 180) || 'Baca berita dan dokumentasi terbaru dari kerja sama kota mitra.',
    }))
  const fallbackArticles = cityArticles.length ? cityArticles : city.articles
  const filtered = activeTag ? fallbackArticles.filter(a => a.tags.includes(activeTag)) : fallbackArticles
  const allTags = Array.from(new Set(fallbackArticles.flatMap(a => a.tags)))

  return (
    <div>
      {/* ─── CITY HERO ──────────────────────────────────── */}
      <section style={{
        position: 'relative',
        aspectRatio: '16 / 5',
        backgroundImage: `url(${city.coverImage})`,
        backgroundSize: 'cover',
        backgroundPosition: city.coverPosition ?? 'center',
        display: 'flex',
        alignItems: 'flex-end',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(15,42,31,0.95) 0%, rgba(15,42,31,0.5) 40%, transparent 80%)` }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${city.accentColor}22 0%, transparent 60%)` }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1152px', margin: '0 auto', padding: '0 24px 48px' }}>
          <button onClick={() => navigate('landing')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.6)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', marginBottom: '24px' }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7-7 7 7 7" /></svg>
            Back to Home
          </button>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '32px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '40px' }}>{city.flag}</span>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{city.country} · Partner city since {city.year}</div>
                  <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(40px, 6vw, 64px)', color: 'white', fontWeight: 500, lineHeight: 1, marginTop: '4px' }}>{city.name}</h1>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {city.tags.map(tag => (
                  <span key={tag} style={{ backgroundColor: 'rgba(201,150,58,0.25)', color: '#e0ac56', border: '1px solid rgba(201,150,58,0.35)', padding: '4px 12px', fontSize: '11px', letterSpacing: '0.05em' }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* City stats */}
            <div style={{ display: 'flex', gap: '32px', marginLeft: 'auto' }}>
              {[
                { label: 'Population', value: city.population },
                { label: 'Area', value: city.area },
                { label: 'Time Zone', value: city.timezone },
                { label: 'Partner Since', value: String(city.year) },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '18px', color: GOLD, fontWeight: 500 }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CITY SELECTOR STRIP ────────────────────────── */}
      <div style={{ backgroundColor: G, overflowX: 'auto' }}>
        <div style={{ display: 'flex', maxWidth: '1152px', margin: '0 auto', padding: '0 24px' }}>
          {partnerCities.map(c => (
            <button
              key={c.id}
              onClick={() => navigate('partner-city', c.id)}
              style={{
                padding: '14px 20px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
                backgroundColor: c.id === cityId ? GOLD : 'transparent',
                color: c.id === cityId ? G : 'rgba(255,255,255,0.6)',
                borderBottom: c.id === cityId ? `2px solid ${GOLD}` : '2px solid transparent',
              }}
            >
              {c.flag} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* ─── DESCRIPTION + CONTACT ──────────────────────── */}
      <section style={{ backgroundColor: 'white', padding: '64px 24px' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '64px', alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ height: '1px', width: '32px', backgroundColor: GOLD }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: GOLD, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>About the Partnership</span>
            </div>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '28px', color: G, fontWeight: 500, marginBottom: '16px' }}>
              Yogyakarta &amp; {city.name}
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(28,18,8,0.7)', marginBottom: '24px' }}>{city.description}</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => navigate('portal')}
                style={{ backgroundColor: G, color: 'white', padding: '12px 24px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
              >
                Submit Collaboration Proposal
              </button>
              <button
                onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ backgroundColor: 'transparent', color: G, padding: '12px 24px', fontSize: '13px', fontWeight: 500, border: `1px solid ${G}`, cursor: 'pointer' }}
              >
                View Timeline →
              </button>
            </div>
          </div>

          {/* Contact card */}
          <div style={{ backgroundColor: PARCH, border: '1px solid #e8dfc9', padding: '28px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>Official Contact</div>
            <div style={{ fontWeight: 600, color: G, fontSize: '15px', marginBottom: '4px' }}>{city.contactPerson}</div>
            <div style={{ fontSize: '13px', color: 'rgba(28,18,8,0.6)', marginBottom: '20px' }}>{city.contactOrg}</div>
            <div style={{ borderTop: '1px solid #e8dfc9', paddingTop: '16px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>Yogyakarta Coordination</div>
              <div style={{ fontSize: '13px', color: 'rgba(28,18,8,0.6)' }}>
                <div>Ir. Siti Rahayu Kusuma, M.Hum.</div>
                <div style={{ marginTop: '2px', color: 'rgba(28,18,8,0.45)' }}>Kepala Sub-Bidang Kerjasama Internasional</div>
                <div style={{ marginTop: '8px' }}>siti.rahayu@jogjakota.go.id</div>
                <div>+62 274 515 100 ext. 202</div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #e8dfc9', paddingTop: '16px', marginTop: '16px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
                {city.statusLabel}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTERACTIVE TIMELINE ───────────────────────── */}
      <section id="timeline" style={{ padding: '96px 24px', backgroundColor: PARCH }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ height: '1px', width: '32px', backgroundColor: GOLD }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: GOLD, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Timeline</span>
          </div>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(26px, 4vw, 36px)', color: G, fontWeight: 500, marginBottom: '48px' }}>
            Partnership Journey<br />Yogyakarta – {city.name}
          </h2>

          <div style={{ position: 'relative', paddingLeft: '48px' }}>
            {/* Vertical line */}
            <div style={{ position: 'absolute', left: '18px', top: '8px', bottom: '8px', width: '2px', backgroundColor: '#e8dfc9' }} />

            {city.milestones.map((m, i) => (
              <div
                key={i}
                style={{ position: 'relative', marginBottom: '0', cursor: 'pointer' }}
                onClick={() => setExpandedMilestone(expandedMilestone === i ? null : i)}
              >
                {/* Dot */}
                <div style={{
                  position: 'absolute', left: '-37px', top: '20px',
                  width: '20px', height: '20px', borderRadius: '50%',
                  backgroundColor: expandedMilestone === i ? GOLD : 'white',
                  border: `2px solid ${expandedMilestone === i ? GOLD : '#e8dfc9'}`,
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: expandedMilestone === i ? G : GOLD }} />
                </div>

                <div style={{
                  padding: '20px 24px',
                  backgroundColor: expandedMilestone === i ? 'white' : 'transparent',
                  border: expandedMilestone === i ? `1px solid ${GOLD}` : '1px solid transparent',
                  marginBottom: '4px',
                  transition: 'all 0.25s',
                  boxShadow: expandedMilestone === i ? '0 4px 16px rgba(28,18,8,0.08)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 600,
                      color: expandedMilestone === i ? GOLD : 'rgba(28,18,8,0.4)',
                      minWidth: '48px', transition: 'color 0.2s',
                    }}>
                      {m.year}
                    </div>
                    <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '17px', fontWeight: 500, color: expandedMilestone === i ? G : '#3d2f1a' }}>
                      {m.title}
                    </div>
                    <div style={{ marginLeft: 'auto', color: 'rgba(28,18,8,0.35)', fontSize: '18px', transition: 'transform 0.2s', transform: expandedMilestone === i ? 'rotate(180deg)' : 'none' }}>
                      ▾
                    </div>
                  </div>
                  {expandedMilestone === i && (
                    <div style={{ marginTop: '12px', paddingLeft: '64px', fontSize: '14px', lineHeight: 1.7, color: 'rgba(28,18,8,0.65)' }}>
                      {m.desc}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ARTICLES ───────────────────────────────────── */}
      {fallbackArticles.length > 0 && (
        <section style={{ padding: '72px 24px', backgroundColor: PARCH, color: G }}>
          <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ height: '1px', width: '32px', backgroundColor: GOLD }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: GOLD, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Artikel Partner City</span>
                </div>
                <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '28px', color: G, fontWeight: 500 }}>
                  Berita Terkini
                </h2>
              </div>

              {/* Tag filter */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setActiveTag(null)}
                  style={{
                    padding: '6px 14px', fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s',
                    backgroundColor: activeTag === null ? G : 'transparent',
                    color: activeTag === null ? 'white' : 'rgba(28,18,8,0.55)',
                    border: `1px solid ${activeTag === null ? G : '#e8dfc9'}`,
                  }}
                >
                  Semua
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    style={{
                      padding: '6px 14px', fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s',
                      backgroundColor: activeTag === tag ? GOLD : 'transparent',
                      color: activeTag === tag ? G : 'rgba(28,18,8,0.55)',
                      border: `1px solid ${activeTag === tag ? GOLD : '#e8dfc9'}`,
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px', color: 'rgba(28,18,8,0.4)', fontSize: '14px' }}>
                Tidak ada artikel untuk tag ini.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '36px' }}>
                {filtered.map(article => (
                  <article key={article.id} style={{ overflow: 'hidden', backgroundColor: 'white', border: '1px solid #e8dfc9', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <div style={{ position: 'relative', height: '188px', overflow: 'hidden', backgroundColor: '#2b2b2b' }}>
                      <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                      />
                      <span style={{ position: 'absolute', top: '18px', left: '12px', backgroundColor: G, color: GOLD, padding: '6px 12px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>{article.tags[0] ?? 'Artikel'}</span>
                    </div>
                    <div style={{ padding: '20px 24px 24px' }}>
                      <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '19px', fontWeight: 500, color: G, lineHeight: 1.35, marginBottom: '12px' }}>{article.title}</h3>
                      <p style={{ fontSize: '14px', color: 'rgba(28,18,8,0.65)', lineHeight: 1.6, marginBottom: '16px' }}>{article.excerpt}</p>
                      <div style={{ fontSize: '11px', color: 'rgba(28,18,8,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>{new Date(article.date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── OTHER CITIES ───────────────────────────────── */}
      <section style={{ padding: '64px 24px', backgroundColor: G }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: GOLD, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '24px' }}>
            Kota Mitra Lainnya
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {partnerCities.filter(c => c.id !== cityId).map(c => (
              <button
                key={c.id}
                onClick={() => navigate('partner-city', c.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 18px', fontSize: '13px', fontWeight: 500,
                  backgroundColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = G; e.currentTarget.style.borderColor = GOLD }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
              >
                <span style={{ fontSize: '18px' }}>{c.flag}</span>
                <span>{c.name}</span>
                <span style={{ fontSize: '11px', opacity: 0.5 }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
