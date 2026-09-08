import { useState } from 'react'
import { proposals, partnerCities } from '../data/mock'
import type { Page, AuthUser } from '../App'

const G = '#1a4030'
const GOLD = '#c9963a'
const PARCH = '#f7f2ea'

interface Props {
  auth: AuthUser
  setAuth: (u: AuthUser) => void
  navigate: (p: Page, cityId?: string) => void
}

type PortalTab = 'overview' | 'submit' | 'detail'

const DEMO_USERS = [
  { id: 2, name: 'Tanaka Hiroshi', email: 'tanaka.h@city.kyoto.jp', role: 'foreign-rep' as const, city: 'Kyoto' },
  { id: 3, name: 'Emma Thompson', email: 'e.thompson@wcc.govt.nz', role: 'foreign-rep' as const, city: 'Wellington' },
  { id: 4, name: 'Kim Jae-won', email: 'kjw@gwangju.go.kr', role: 'foreign-rep' as const, city: 'Gwangju' },
  { id: 1, name: 'Drs. Bambang Wijayanto', email: 'bambang.w@jogjakota.go.id', role: 'admin' as const, city: 'Yogyakarta' },
]

function StatusBadge({ status }: { status: 'pending' | 'accepted' | 'rejected' }) {
  const config = {
    pending: { bg: '#fef3c7', color: '#92400e', border: '#fde68a', label: 'Pending Review', dot: '#d97706' },
    accepted: { bg: '#dcfce7', color: '#166534', border: '#bbf7d0', label: 'Approved', dot: '#16a34a' },
    rejected: { bg: '#fee2e2', color: '#991b1b', border: '#fecaca', label: 'Rejected', dot: '#dc2626' },
  }
  const c = config[status]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: c.bg, color: c.color, border: `1px solid ${c.border}`, padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: c.dot, display: 'inline-block' }} />
      {c.label}
    </span>
  )
}

export default function Portal({ auth, setAuth, navigate }: Props) {
  const [tab, setTab] = useState<PortalTab>('overview')
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login')
  const [loginError, setLoginError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    title: '', category: '', description: '', objectives: '', budget: '', duration: '', attachments: '',
  })

  const handleLogin = () => {
    const user = DEMO_USERS.find(u => u.email === loginEmail)
    if (user) {
      setAuth(user)
      setLoginError('')
      if (user.role === 'admin') navigate('admin')
    } else {
      setLoginError('Email tidak ditemukan. Gunakan salah satu: tanaka.h@city.kyoto.jp, e.thompson@wcc.govt.nz, kjw@gwangju.go.kr, atau bambang.w@jogjakota.go.id')
    }
  }

  const myProposals = auth ? proposals.filter(p => p.city === auth.city) : []
  const detail = selectedProposal ? proposals.find(p => p.id === selectedProposal) : null

  if (!auth) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: PARCH, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ width: '56px', height: '56px', backgroundColor: G, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: GOLD, fontSize: '24px', fontWeight: 700 }}>J</span>
            </div>
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '26px', color: G, fontWeight: 500, marginBottom: '6px' }}>Sister City Portal</h1>
            <p style={{ fontSize: '13px', color: 'rgba(28,18,8,0.55)' }}>SISKOTA Yogyakarta — Partnership Collaboration Platform</p>
          </div>

          <div style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '36px', boxShadow: '0 4px 24px rgba(28,18,8,0.07)' }}>
            {/* Mode toggle */}
            <div style={{ display: 'flex', gap: '0', border: '1px solid #e8dfc9', marginBottom: '28px' }}>
              {(['login', 'register'] as const).map(m => (
                <button key={m} onClick={() => setLoginMode(m)} style={{ flex: 1, padding: '10px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'all 0.15s', backgroundColor: loginMode === m ? G : 'transparent', color: loginMode === m ? 'white' : 'rgba(28,18,8,0.5)' }}>
                  {m === 'login' ? 'Login' : 'Register'}
                </button>
              ))}
            </div>

            {loginMode === 'login' ? (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: G, marginBottom: '6px', letterSpacing: '0.04em' }}>Email Address</label>
                <input
                  type="email" value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="email@kotamitra.go"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e8dfc9', fontSize: '14px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box', marginBottom: '8px' }}
                />
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: G, marginBottom: '6px', letterSpacing: '0.04em', marginTop: '16px' }}>Password</label>
                <input
                  type="password" defaultValue="••••••••"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e8dfc9', fontSize: '14px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box', marginBottom: '8px' }}
                />
                {loginError && (
                  <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', padding: '10px 14px', fontSize: '12px', color: '#991b1b', marginBottom: '16px', lineHeight: 1.5 }}>
                    {loginError}
                  </div>
                )}
                <button
                  onClick={handleLogin}
                  style={{ width: '100%', backgroundColor: G, color: 'white', padding: '12px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', marginTop: '8px' }}
                >
                  Access Portal
                </button>

                {/* Demo accounts */}
                <div style={{ marginTop: '24px', padding: '16px', backgroundColor: PARCH, border: '1px solid #e8dfc9' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Demo Accounts</div>
                  {DEMO_USERS.map(u => (
                    <button key={u.id} onClick={() => setLoginEmail(u.email)}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 0', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'rgba(28,18,8,0.6)', borderBottom: '1px solid #e8dfc9' }}
                    >
                      <span style={{ color: u.role === 'admin' ? GOLD : G, fontWeight: 600 }}>
                        {u.role === 'admin' ? '[Admin] ' : '[Rep] '}
                      </span>
                      {u.email} — {u.city}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '13px', color: 'rgba(28,18,8,0.6)', lineHeight: 1.7, marginBottom: '20px' }}>
                  Account registration for partner institutions must be approved by the Yogyakarta City International Affairs team. Please contact us:
                </p>
                <div style={{ backgroundColor: PARCH, border: '1px solid #e8dfc9', padding: '16px', fontSize: '13px', color: 'rgba(28,18,8,0.7)' }}>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>International Affairs Division</div>
                  <div>humas@jogjakota.go.id</div>
                  <div>+62 274 515 100 ext. 201</div>
                  <div style={{ marginTop: '8px', fontSize: '11px', color: 'rgba(28,18,8,0.45)' }}>Office hours: Monday–Friday, 08:00–16:00 WIB</div>
                </div>
                <button onClick={() => setLoginMode('login')} style={{ width: '100%', backgroundColor: 'transparent', color: G, padding: '12px', fontSize: '14px', fontWeight: 500, border: `1px solid ${G}`, cursor: 'pointer', marginTop: '16px' }}>
                  ← Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Authenticated state
  if (detail && tab === 'detail') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: PARCH }}>
        <div style={{ backgroundColor: G, padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => { setTab('overview'); setSelectedProposal(null) }} style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7-7 7 7 7" /></svg>
            Back
          </button>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'white', fontSize: '20px', fontWeight: 500 }}>Proposal Details</h2>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', overflow: 'hidden' }}>
            <div style={{ padding: '32px', borderBottom: '1px solid #e8dfc9' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: GOLD, letterSpacing: '0.08em' }}>{detail.id}</div>
                <StatusBadge status={detail.status} />
              </div>
              <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '24px', color: G, fontWeight: 500, marginBottom: '8px' }}>{detail.title}</h2>
              <div style={{ fontSize: '13px', color: 'rgba(28,18,8,0.5)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span>📍 {detail.flag} {detail.city}, {detail.country}</span>
                <span>📅 Submitted: {new Date(detail.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span>🏷️ {detail.category}</span>
              </div>
            </div>

            <div style={{ padding: '32px', display: 'grid', gap: '24px' }}>
              {[
                { label: 'Proposal Description', value: detail.description },
                { label: 'Objectives & Outputs', value: detail.objectives },
                { label: 'Estimated Budget', value: detail.budget },
                { label: 'Program Duration', value: detail.duration },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>{f.label}</div>
                  <div style={{ fontSize: '14px', color: 'rgba(28,18,8,0.75)', lineHeight: 1.7 }}>{f.value}</div>
                </div>
              ))}

              {/* Admin response */}
              {detail.adminNote && (
                <div style={{
                  padding: '20px', border: `1px solid ${detail.status === 'accepted' ? '#bbf7d0' : detail.status === 'rejected' ? '#fecaca' : '#fde68a'}`,
                  backgroundColor: detail.status === 'accepted' ? '#f0fdf4' : detail.status === 'rejected' ? '#fff5f5' : '#fffbeb',
                }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px', color: detail.status === 'accepted' ? '#166534' : detail.status === 'rejected' ? '#991b1b' : '#92400e' }}>
                    {detail.status === 'accepted' ? '✓ Admin Approval Note' : detail.status === 'rejected' ? '✗ Rejection Reason' : '⏳ Admin Note'}
                  </div>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(28,18,8,0.75)' }}>{detail.adminNote}</p>
                  {detail.reviewedBy && (
                    <div style={{ marginTop: '12px', fontSize: '12px', color: 'rgba(28,18,8,0.45)' }}>
                      Reviewed by: {detail.reviewedBy} · {detail.reviewedAt && new Date(detail.reviewedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  )}
                </div>
              )}

              {detail.status === 'pending' && !detail.adminNote && (
                <div style={{ padding: '20px', backgroundColor: '#fef3c7', border: '1px solid #fde68a' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#92400e', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>⏳ Status: Pending Review</div>
                  <p style={{ fontSize: '13px', color: '#92400e', lineHeight: 1.6 }}>
                    Your proposal is currently being reviewed by the international cooperation team. Estimated review time: 5–10 working days. You will receive a notification via the registered email address.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: PARCH }}>
      {/* Portal header */}
      <div style={{ backgroundColor: G, padding: '24px' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: GOLD, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>Sister City Portal</div>
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '22px', color: 'white', fontWeight: 500 }}>
              Welcome, {auth.name.split(' ')[0]}
            </h1>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>
              {auth.city} · {auth.role === 'foreign-rep' ? 'Partner Representative' : 'Administrator'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {auth.role === 'admin' && (
              <button onClick={() => navigate('admin')} style={{ padding: '9px 18px', fontSize: '13px', backgroundColor: GOLD, color: G, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                Admin Dashboard →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e8dfc9' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '0' }}>
          {[
            { key: 'overview', label: 'My Proposals' },
            { key: 'submit', label: auth.role === 'foreign-rep' ? '+ Submit Proposal' : 'Information' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as PortalTab)}
              style={{
                padding: '16px 20px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                backgroundColor: 'transparent',
                color: tab === t.key ? G : 'rgba(28,18,8,0.5)',
                borderBottom: `2px solid ${tab === t.key ? G : 'transparent'}`,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '48px 24px' }}>
        {tab === 'overview' && (
          <div>
            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
              {[
                { label: 'Total Proposals', value: myProposals.length, color: G },
                { label: 'Pending', value: myProposals.filter(p => p.status === 'pending').length, color: '#b45309' },
                { label: 'Approved', value: myProposals.filter(p => p.status === 'accepted').length, color: '#166534' },
              ].map(s => (
                <div key={s.label} style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '24px' }}>
                  <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '36px', color: s.color, fontWeight: 500, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(28,18,8,0.55)', marginTop: '6px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {myProposals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 24px', backgroundColor: 'white', border: '1px solid #e8dfc9' }}>
                <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '20px', color: G, marginBottom: '12px' }}>No Proposals Yet</div>
                <p style={{ fontSize: '14px', color: 'rgba(28,18,8,0.55)', marginBottom: '24px' }}>You have not submitted a collaboration proposal yet. Start with your first proposal.</p>
                <button onClick={() => setTab('submit')} style={{ backgroundColor: G, color: 'white', padding: '12px 28px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                  Submit Proposal Now
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '20px', color: G, fontWeight: 500, marginBottom: '8px' }}>Proposal History</h2>
                {myProposals.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedProposal(p.id); setTab('detail') }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
                      backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '20px 24px', cursor: 'pointer', textAlign: 'left', transition: 'box-shadow 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(28,18,8,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: GOLD, letterSpacing: '0.08em', marginBottom: '4px' }}>{p.id}</div>
                      <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '16px', color: G, fontWeight: 500, marginBottom: '4px' }}>{p.title}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(28,18,8,0.5)' }}>{p.category} · Submitted {new Date(p.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <StatusBadge status={p.status} />
                      <svg width="16" height="16" fill="none" stroke="rgba(28,18,8,0.3)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'submit' && auth.role === 'foreign-rep' && !submitted && (
          <div style={{ maxWidth: '720px' }}>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '26px', color: G, fontWeight: 500, marginBottom: '8px' }}>Submit a Collaboration Proposal</h2>
            <p style={{ fontSize: '14px', color: 'rgba(28,18,8,0.6)', marginBottom: '36px', lineHeight: 1.7 }}>
              Complete the form below to submit a partnership proposal to the Yogyakarta City government. Proposals are reviewed by the international cooperation team within 5–10 working days.
            </p>

            <div style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '36px' }}>
              <div style={{ display: 'grid', gap: '20px' }}>
                {/* City rep info */}
                <div style={{ backgroundColor: PARCH, border: '1px solid #e8dfc9', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ fontSize: '28px' }}>{partnerCities.find(c => c.name === auth.city)?.flag ?? '🌏'}</div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'rgba(28,18,8,0.5)' }}>Submitting as</div>
                    <div style={{ fontWeight: 600, color: G }}>{auth.name} · {auth.city}</div>
                  </div>
                </div>

                {[
                  { key: 'title', label: 'Proposal Title', placeholder: 'Example: Digital Cultural Exchange Program 2024', type: 'input' },
                  { key: 'category', label: 'Category', placeholder: '', type: 'select', options: ['Culture & Heritage', 'Education & Research', 'Creative Industry', 'Urban Development', 'Tourism', 'Economy & Trade', 'Environmental Sustainability', 'Health', 'Other'] },
                  { key: 'description', label: 'Proposal Description', placeholder: 'Describe the background, purpose, and overview of the program you are proposing...', type: 'textarea' },
                  { key: 'objectives', label: 'Objectives & Target Outputs', placeholder: 'Specify the program goals and expected outputs...', type: 'textarea' },
                  { key: 'budget', label: 'Estimated Budget', placeholder: 'Example: USD 50,000 (50% Japan Foundation Grant, 50% local budget)', type: 'input' },
                  { key: 'duration', label: 'Program Duration', placeholder: '', type: 'duration-select', options: ['1–3 months', '4–6 months', '7–12 months', '13–18 months', '19–24 months', 'More than 24 months'] },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: G, marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{field.label}</label>
                    {field.type === 'input' && (
                      <input
                        value={form[field.key as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #e8dfc9', fontSize: '14px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box' }}
                      />
                    )}
                    {field.type === 'textarea' && (
                      <textarea
                        value={form[field.key as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        rows={4}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #e8dfc9', fontSize: '14px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box', resize: 'vertical', fontFamily: 'Inter, system-ui, sans-serif' }}
                      />
                    )}
                    {(field.type === 'select' || field.type === 'duration-select') && (
                      <select
                        value={form[field.key as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #e8dfc9', fontSize: '14px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif' }}
                      >
                        <option value="">— Select an option —</option>
                        {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    )}
                  </div>
                ))}

                <div style={{ borderTop: '1px solid #e8dfc9', paddingTop: '20px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setTab('overview')} style={{ padding: '11px 24px', fontSize: '14px', backgroundColor: 'transparent', color: G, border: `1px solid ${G}`, cursor: 'pointer', fontWeight: 500 }}>
                    Cancel
                  </button>
                  <button
                    onClick={() => { if (form.title && form.category && form.description) setSubmitted(true) }}
                    style={{ padding: '11px 28px', fontSize: '14px', backgroundColor: G, color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Send Proposal →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'submit' && submitted && (
          <div style={{ maxWidth: '540px', margin: '0 auto', textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#dcfce7', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px' }}>✓</div>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '26px', color: G, fontWeight: 500, marginBottom: '12px' }}>Proposal Submitted Successfully!</h2>
            <p style={{ fontSize: '14px', color: 'rgba(28,18,8,0.6)', lineHeight: 1.7, marginBottom: '32px' }}>
              The proposal "<strong>{form.title}</strong>" has been received. The International Affairs team will review it within 5–10 working days. A notification will be sent to <strong>{auth.email}</strong>.
            </p>
            <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a', padding: '16px', fontSize: '13px', color: '#92400e', marginBottom: '32px', textAlign: 'left' }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>Temporary Reference Number</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace' }}>PROP-2024-{String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}</div>
            </div>
            <button onClick={() => { setSubmitted(false); setTab('overview'); setForm({ title: '', category: '', description: '', objectives: '', budget: '', duration: '', attachments: '' }) }}
              style={{ backgroundColor: G, color: 'white', padding: '12px 28px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
