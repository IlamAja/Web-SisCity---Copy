import { useState } from 'react'
import { proposals, adminUsers, roles, foreignRelationsPersonnel, partnerCities } from '../data/mock'
import type { ContentItem } from '../data/mock'
import type { Page, AuthUser } from '../App'

const G = '#1a4030'
const GOLD = '#c9963a'
const PARCH = '#f7f2ea'
const DARK = '#0f2a1f'

interface Props {
  auth: AuthUser
  navigate: (p: Page) => void
  partnerCities: typeof partnerCities
  setPartnerCities: React.Dispatch<React.SetStateAction<typeof partnerCities>>
  contentItems: ContentItem[]
  setContentItems: React.Dispatch<React.SetStateAction<ContentItem[]>>
}

type AdminTab = 'overview' | 'proposals' | 'users' | 'roles' | 'content' | 'personnel'

function Badge({ label, color, bg, border }: { label: string; color: string; bg: string; border: string }) {
  return <span style={{ backgroundColor: bg, color, border: `1px solid ${border}`, padding: '3px 10px', fontSize: '11px', fontWeight: 600, display: 'inline-block' }}>{label}</span>
}

function StatusChip({ status }: { status: 'pending' | 'accepted' | 'rejected' }) {
  const map = {
    pending: { bg: '#fef3c7', color: '#92400e', border: '#fde68a', label: 'Pending' },
    accepted: { bg: '#dcfce7', color: '#166534', border: '#bbf7d0', label: 'Approved' },
    rejected: { bg: '#fee2e2', color: '#991b1b', border: '#fecaca', label: 'Rejected' },
  }
  const c = map[status]
  return <Badge label={c.label} color={c.color} bg={c.bg} border={c.border} />
}

function RoleChip({ role }: { role: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    'admin': { bg: '#dcfce7', color: G, label: 'Admin' },
    'foreign-rep': { bg: '#fef3c7', color: '#92400e', label: 'Partner' },
    'editor': { bg: '#dbeafe', color: '#1e40af', label: 'Editor' },
    'viewer': { bg: '#f3f4f6', color: '#374151', label: 'Viewer' },
  }
  const c = map[role] ?? { bg: '#f3f4f6', color: '#374151', label: role }
  return <Badge label={c.label} color={c.color} bg={c.bg} border={c.bg} />
}

export default function AdminDashboard({ auth, navigate, partnerCities, setPartnerCities, contentItems, setContentItems }: Props) {
  const [tab, setTab] = useState<AdminTab>('overview')
  const [proposalFilter, setProposalFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all')
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null)
  const [verifyNote, setVerifyNote] = useState('')
  const [verifyAction, setVerifyAction] = useState<'accept' | 'reject' | null>(null)
  const [localProposals, setLocalProposals] = useState(proposals)
  const [localUsers, setLocalUsers] = useState(adminUsers)
  const [localRoles, setLocalRoles] = useState(roles)
  const [localPersonnel, setLocalPersonnel] = useState(foreignRelationsPersonnel)
  const [contentTab, setContentTab] = useState<'list' | 'new'>('list')
  const [newArticle, setNewArticle] = useState({ title: '', city: '', type: 'article', content: '', tags: '', videoUrl: '', thumbnail: '' })
  const [contentEditingId, setContentEditingId] = useState<number | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ action: 'accept' | 'reject'; proposalId: string } | null>(null)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [userForm, setUserForm] = useState({ id: null as number | null, name: '', email: '', city: '', role: 'foreign-rep' as 'admin' | 'foreign-rep' | 'editor' | 'viewer', status: 'active' as 'active' | 'pending' })
  const [roleFormOpen, setRoleFormOpen] = useState(false)
  const [roleForm, setRoleForm] = useState({ name: '', label: '', color: '#1a4030', permissions: 'Manage roles, Review proposals' })
  const [personnelFormOpen, setPersonnelFormOpen] = useState(false)
  const [cityImageEditingId, setCityImageEditingId] = useState<string | null>(null)
  const [cityImageUrl, setCityImageUrl] = useState('')
  const [personnelForm, setPersonnelForm] = useState({ id: null as number | null, name: '', title: '', leadershipLabel: '', email: '', phone: '', bio: '', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&auto=format' })

  if (!auth || auth.role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: PARCH }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '24px', color: G, marginBottom: '12px' }}>Access Restricted</div>
          <p style={{ fontSize: '14px', color: 'rgba(28,18,8,0.6)', marginBottom: '24px' }}>This page is available to administrators only.</p>
          <button onClick={() => navigate('landing')} style={{ backgroundColor: G, color: 'white', padding: '10px 24px', border: 'none', cursor: 'pointer' }}>Back to Home</button>
        </div>
      </div>
    )
  }

  const filteredProposals = proposalFilter === 'all' ? localProposals : localProposals.filter(p => p.status === proposalFilter)
  const detail = selectedProposal ? localProposals.find(p => p.id === selectedProposal) : null

  const handleVerify = (action: 'accept' | 'reject') => {
    setLocalProposals(prev => prev.map(p => p.id === (confirmAction?.proposalId ?? selectedProposal) ? { ...p, status: action === 'accept' ? 'accepted' : 'rejected', adminNote: verifyNote || (action === 'accept' ? 'Proposal approved by the partnership review team.' : 'Proposal rejected. Please revise and resubmit.'), reviewedBy: auth.name, reviewedAt: new Date().toISOString().split('T')[0] } : p))
    setSelectedProposal(null)
    setVerifyNote('')
    setVerifyAction(null)
    setConfirmAction(null)
  }

  const handleSaveUser = () => {
    const name = userForm.name.trim()
    const email = userForm.email.trim()
    const city = userForm.city.trim()

    if (!name || !email || !city) return

    if (userForm.id) {
      setLocalUsers(prev => prev.map(u => u.id === userForm.id ? { ...u, name, email, city, role: userForm.role, status: userForm.status } : u))
    } else {
      setLocalUsers(prev => [
        ...prev,
        {
          id: Date.now(),
          name,
          email,
          role: userForm.role,
          city,
          status: userForm.status,
          lastLogin: 'Just now',
        },
      ])
    }

    setUserForm({ id: null, name: '', email: '', city: '', role: 'foreign-rep', status: 'active' })
    setAddUserOpen(false)
  }

  const handleDeleteUser = (id: number) => {
    const user = localUsers.find(u => u.id === id)
    if (!user) return

    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus user "${user.name}"?`)
    if (!confirmed) return

    setLocalUsers(prev => prev.filter(u => u.id !== id))
  }

  const handleActivateUser = (id: number) => {
    const user = localUsers.find(u => u.id === id)
    if (!user) return

    const confirmed = window.confirm(`Apakah Anda yakin ingin mengaktifkan user "${user.name}"?`)
    if (!confirmed) return

    setLocalUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'active', lastLogin: 'Just now' } : u))
  }

  const handleSaveRole = () => {
    const name = roleForm.name.trim()
    const label = roleForm.label.trim()
    if (!name || !label) return

    const permissions = roleForm.permissions.split(',').map(p => p.trim()).filter(Boolean)

    if (localRoles.some(r => r.name === name)) {
      setLocalRoles(prev => prev.map(r => r.name === name ? { ...r, label, color: roleForm.color, permissions } : r))
    } else {
      setLocalRoles(prev => [...prev, { name, label, color: roleForm.color, permissions }])
    }

    setRoleForm({ name: '', label: '', color: '#1a4030', permissions: 'Manage roles, Review proposals' })
    setRoleFormOpen(false)
  }

  const handleDeleteRole = (name: string) => {
    if (name === 'admin') return

    const role = localRoles.find(r => r.name === name)
    if (!role) return

    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus role "${role.label}"?`)
    if (!confirmed) return

    setLocalRoles(prev => prev.filter(r => r.name !== name))
    setLocalUsers(prev => prev.map(u => u.role === name ? { ...u, role: 'viewer' as const } : u))
  }

  const handleSaveContent = (status: 'draft' | 'published') => {
    const title = newArticle.title.trim()
    const city = newArticle.city.trim() || 'Yogyakarta'
    if (!title) return

    const tags = newArticle.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)

    const contentEntry: ContentItem = {
      id: contentEditingId ?? Date.now(),
      type: newArticle.type as 'article' | 'photo' | 'video',
      title,
      city,
      author: auth.name,
      date: new Date().toISOString().split('T')[0],
      status,
      tags: tags.length ? tags : ['General'],
      content: newArticle.content.trim(),
      videoUrl: newArticle.videoUrl.trim(),
      thumbnail: newArticle.thumbnail.trim(),
    }

    setContentItems(prev => {
      if (contentEditingId) {
        return prev.map(item => item.id === contentEditingId ? { ...item, ...contentEntry } : item)
      }
      return [contentEntry, ...prev]
    })

    setNewArticle({ title: '', city: '', type: 'article', content: '', tags: '', videoUrl: '', thumbnail: '' })
    setContentEditingId(null)
    setContentTab('list')
  }

  const handleDeleteContent = (id: number) => {
    const item = contentItems.find(entry => entry.id === id)
    if (!item) return

    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus konten "${item.title}"?`)
    if (!confirmed) return

    setContentItems(prev => prev.filter(entry => entry.id !== id))
  }

  const handlePublishContent = (id: number) => {
    const item = contentItems.find(entry => entry.id === id)
    if (!item) return

    setContentItems(prev => prev.map(entry => entry.id === id ? { ...entry, status: 'published' } : entry))
  }

  const handleEditContent = (item: ContentItem) => {
    setContentEditingId(item.id)
    setNewArticle({
      title: item.title,
      city: item.city,
      type: item.type,
      content: item.content ?? '',
      tags: item.tags.join(', '),
      videoUrl: item.videoUrl ?? '',
      thumbnail: item.thumbnail ?? '',
    })
    setContentTab('new')
  }

  const handleSavePersonnel = () => {
    const name = personnelForm.name.trim()
    const title = personnelForm.title.trim()
    const email = personnelForm.email.trim()
    const phone = personnelForm.phone.trim()

    if (!name || !title || !email || !phone) return

    const normalized = {
      id: personnelForm.id ?? Date.now(),
      name,
      role: title,
      leadershipLabel: personnelForm.leadershipLabel.trim(),
      title,
      country: 'Indonesia',
      photo: personnelForm.photo,
      email,
      phone,
      bio: personnelForm.bio || 'Partnership team member coordinating international collaboration initiatives.',
    }

    setLocalPersonnel(prev => {
      if (personnelForm.id) {
        return prev.map(item => item.id === personnelForm.id ? { ...item, ...normalized } : item)
      }
      return [normalized, ...prev]
    })

    setPersonnelForm({ id: null, name: '', title: '', leadershipLabel: '', email: '', phone: '', bio: '', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&auto=format' })
    setPersonnelFormOpen(false)
  }

  const handleDeletePersonnel = (id: number) => {
    const person = localPersonnel.find(item => item.id === id)
    if (!person) return

    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus anggota tim "${person.name}"?`)
    if (!confirmed) return

    setLocalPersonnel(prev => prev.filter(item => item.id !== id))
  }

  const handleSaveCityImage = (cityId: string) => {
    const imageUrl = cityImageUrl.trim()
    if (!imageUrl) return

    setPartnerCities(prev => prev.map(city => city.id === cityId ? { ...city, coverImage: imageUrl, thumbImage: imageUrl } : city))
    setCityImageEditingId(null)
    setCityImageUrl('')
  }

  const TABS: { key: AdminTab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '◈' },
    { key: 'proposals', label: 'Proposal Review', icon: '◉' },
    { key: 'users', label: 'User Management', icon: '◎' },
    { key: 'roles', label: 'Roles & Access', icon: '◇' },
    { key: 'content', label: 'Content Management', icon: '◻' },
    { key: 'personnel', label: 'Partnership Team', icon: '▣' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ─── SIDEBAR ─────────────────────────────── */}
      <aside style={{ width: '240px', backgroundColor: DARK, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: '64px', height: 'calc(100vh - 64px)', overflow: 'auto' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: GOLD, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>Admin Dashboard</div>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '16px', color: 'white', fontWeight: 500 }}>SISKOTA Yogyakarta</div>
        </div>

        <nav style={{ padding: '12px 0', flex: 1 }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSelectedProposal(null) }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '11px 20px',
                fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                backgroundColor: tab === t.key ? GOLD : 'transparent',
                color: tab === t.key ? G : 'rgba(255,255,255,0.6)',
              }}
            >
              <span style={{ fontSize: '14px', opacity: 0.8 }}>{t.icon}</span>
              {t.label}
              {t.key === 'proposals' && localProposals.filter(p => p.status === 'pending').length > 0 && (
                <span style={{ marginLeft: 'auto', backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>
                  {localProposals.filter(p => p.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Signed in as</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{auth.name.split(' ').slice(0, 2).join(' ')}</div>
          <button onClick={() => navigate('landing')} style={{ marginTop: '12px', width: '100%', padding: '8px', fontSize: '12px', backgroundColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
            ← Back to Site
          </button>
        </div>
      </aside>

      {/* ─── MAIN ────────────────────────────────── */}
      <div style={{ flex: 1, backgroundColor: PARCH, overflow: 'auto' }}>
        <div style={{ padding: '40px 40px' }}>

          {confirmAction && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,42,31,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
              <div style={{ width: '100%', maxWidth: '420px', backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '28px' }}>
                <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '22px', color: G, marginBottom: '12px' }}>
                  {confirmAction.action === 'accept' ? 'Approve proposal?' : 'Reject proposal?'}
                </div>
                <p style={{ fontSize: '14px', color: 'rgba(28,18,8,0.65)', lineHeight: 1.7, marginBottom: '20px' }}>
                  This action will update the proposal status and notify the submitting partner city.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setConfirmAction(null)} style={{ backgroundColor: 'transparent', color: G, border: `1px solid ${G}`, padding: '9px 18px', fontSize: '13px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button onClick={() => { handleVerify(confirmAction.action); setConfirmAction(null) }} style={{ backgroundColor: confirmAction.action === 'accept' ? '#166534' : '#991b1b', color: 'white', border: 'none', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    {confirmAction.action === 'accept' ? 'Confirm Approve' : 'Confirm Reject'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══ OVERVIEW ════════════════════════ */}
          {tab === 'overview' && (
            <div>
              <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '28px', color: G, fontWeight: 500, marginBottom: '4px' }}>System Overview</h1>
              <p style={{ fontSize: '13px', color: 'rgba(28,18,8,0.5)', marginBottom: '36px' }}>
                Welcome to the SISKOTA Yogyakarta admin dashboard. Monday, 25 April 2024.
              </p>

              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
                {[
                  { label: 'Partner Cities', value: '6', sub: 'active', color: G, icon: '🌏' },
                  { label: 'Incoming Proposals', value: String(localProposals.length), sub: `${localProposals.filter(p => p.status === 'pending').length} pending`, color: '#b45309', icon: '📋' },
                  { label: 'Active Users', value: String(localUsers.filter(u => u.status === 'active').length), sub: 'registered', color: '#1e40af', icon: '👥' },
                  { label: 'Published Content', value: String(contentItems.filter(c => c.status === 'published').length), sub: 'articles & media', color: '#6d28d9', icon: '📰' },
                ].map(s => (
                  <div key={s.label} style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ fontSize: '28px' }}>{s.icon}</div>
                    <div>
                      <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '32px', color: s.color, fontWeight: 500, lineHeight: 1 }}>{s.value}</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(28,18,8,0.6)', marginTop: '3px' }}>{s.label}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(28,18,8,0.4)' }}>{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Pending proposals */}
                <div style={{ backgroundColor: 'white', border: '1px solid #e8dfc9' }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8dfc9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '16px', color: G, fontWeight: 500 }}>Pending Review</h3>
                    <button onClick={() => setTab('proposals')} style={{ fontSize: '12px', color: GOLD, backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>View all →</button>
                  </div>
                  {localProposals.filter(p => p.status === 'pending').map(p => (
                    <div key={p.id} style={{ padding: '16px 24px', borderBottom: '1px solid #f0ebe0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: G, marginBottom: '2px' }}>{p.title}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(28,18,8,0.5)' }}>{p.flag} {p.city} · {p.submittedBy}</div>
                      </div>
                      <button onClick={() => { setTab('proposals'); setSelectedProposal(p.id) }} style={{ fontSize: '12px', padding: '5px 12px', backgroundColor: G, color: 'white', border: 'none', cursor: 'pointer' }}>Review</button>
                    </div>
                  ))}
                  {localProposals.filter(p => p.status === 'pending').length === 0 && (
                    <div style={{ padding: '32px 24px', textAlign: 'center', color: 'rgba(28,18,8,0.4)', fontSize: '13px' }}>No pending proposals ✓</div>
                  )}
                </div>

                {/* Recent users */}
                <div style={{ backgroundColor: 'white', border: '1px solid #e8dfc9' }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8dfc9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '16px', color: G, fontWeight: 500 }}>Recent Users</h3>
                    <button onClick={() => setTab('users')} style={{ fontSize: '12px', color: GOLD, backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>View all →</button>
                  </div>
                  {localUsers.slice(0, 5).map(u => (
                    <div key={u.id} style={{ padding: '12px 24px', borderBottom: '1px solid #f0ebe0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: u.role === 'admin' ? G : u.role === 'foreign-rep' ? GOLD : '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 600 }}>
                          {u.name[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 500, color: G }}>{u.name.split(' ')[0]} {u.name.split(' ')[1]}</div>
                          <div style={{ fontSize: '11px', color: 'rgba(28,18,8,0.5)' }}>{u.city}</div>
                        </div>
                      </div>
                      <RoleChip role={u.role} />
                    </div>
                  ))}
                </div>

                {/* City stats */}
                <div style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', gridColumn: '1 / -1' }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8dfc9' }}>
                    <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '16px', color: G, fontWeight: 500 }}>Partner City Status</h3>
                  </div>
                  <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0' }}>
                    {partnerCities.map((c, i) => (
                      <div key={c.id} style={{ padding: '16px', borderRight: i % 3 !== 2 ? '1px solid #f0ebe0' : 'none', borderBottom: i < 3 ? '1px solid #f0ebe0' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '20px' }}>{c.flag}</span>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: G }}>{c.name}</div>
                            <div style={{ fontSize: '11px', color: 'rgba(28,18,8,0.45)' }}>{c.country} · sejak {c.year}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span style={{ fontSize: '11px', backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', fontWeight: 600 }}>AKTIF</span>
                          <span style={{ fontSize: '11px', backgroundColor: PARCH, color: 'rgba(28,18,8,0.5)', padding: '2px 8px' }}>
                            {localProposals.filter(p => p.city === c.name).length} proposal
                          </span>
                        </div>
                          {cityImageEditingId === c.id ? (
                            <div style={{ marginTop: '12px' }}>
                              <input
                                value={cityImageUrl}
                                onChange={e => setCityImageUrl(e.target.value)}
                                placeholder="Cover image URL"
                                aria-label={`Cover image URL for ${c.name}`}
                                style={{ width: '100%', padding: '7px 8px', border: '1px solid #e8dfc9', fontSize: '11px', boxSizing: 'border-box', marginBottom: '6px' }}
                              />
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button onClick={() => handleSaveCityImage(c.id)} style={{ fontSize: '11px', padding: '5px 9px', backgroundColor: G, color: 'white', border: 'none', cursor: 'pointer' }}>Save Photo</button>
                                <button onClick={() => { setCityImageEditingId(null); setCityImageUrl('') }} style={{ fontSize: '11px', padding: '5px 9px', backgroundColor: 'transparent', color: 'rgba(28,18,8,0.5)', border: '1px solid #e8dfc9', cursor: 'pointer' }}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <button onClick={() => { setCityImageEditingId(c.id); setCityImageUrl(c.coverImage) }} style={{ marginTop: '12px', fontSize: '11px', padding: '5px 9px', backgroundColor: 'transparent', color: G, border: `1px solid ${G}`, cursor: 'pointer' }}>Edit Cover Photo</button>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ PROPOSALS ══════════════════════════ */}
          {tab === 'proposals' && !selectedProposal && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                  <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '26px', color: G, fontWeight: 500, marginBottom: '4px' }}>Proposal Review</h1>
                  <p style={{ fontSize: '13px', color: 'rgba(28,18,8,0.5)' }}>Review and verify partnership proposals from partner city representatives.</p>
                </div>
              </div>

              {/* Filter tabs */}
              <div style={{ display: 'flex', gap: '0', marginBottom: '24px', border: '1px solid #e8dfc9', width: 'fit-content' }}>
                {(['all', 'pending', 'accepted', 'rejected'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setProposalFilter(f)}
                    style={{
                      padding: '8px 18px', fontSize: '12px', fontWeight: 500, border: 'none', cursor: 'pointer',
                      backgroundColor: proposalFilter === f ? G : 'transparent',
                      color: proposalFilter === f ? 'white' : 'rgba(28,18,8,0.5)',
                    }}
                  >
                    {f === 'all' ? `All (${localProposals.length})` : f === 'pending' ? `Pending (${localProposals.filter(p => p.status === 'pending').length})` : f === 'accepted' ? `Approved (${localProposals.filter(p => p.status === 'accepted').length})` : `Rejected (${localProposals.filter(p => p.status === 'rejected').length})`}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredProposals.map(p => (
                  <div key={p.id} style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: GOLD, letterSpacing: '0.08em' }}>{p.id}</span>
                        <span style={{ fontSize: '10px', backgroundColor: PARCH, color: 'rgba(28,18,8,0.5)', padding: '2px 8px' }}>{p.category}</span>
                        <StatusChip status={p.status} />
                      </div>
                      <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '16px', color: G, fontWeight: 500, marginBottom: '4px' }}>{p.title}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(28,18,8,0.5)' }}>
                        {p.flag} {p.city} · {p.submittedBy} · Submitted {new Date(p.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedProposal(p.id)}
                      style={{ padding: '9px 20px', fontSize: '13px', backgroundColor: p.status === 'pending' ? G : 'transparent', color: p.status === 'pending' ? 'white' : G, border: `1px solid ${G}`, cursor: 'pointer', fontWeight: 500, whiteSpace: 'nowrap' }}
                    >
                      {p.status === 'pending' ? 'Review & Verify' : 'View Details'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Proposal Detail / Verify ─── */}
          {tab === 'proposals' && selectedProposal && detail && (
            <div>
              <button onClick={() => { setSelectedProposal(null); setVerifyAction(null); setVerifyNote('') }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(28,18,8,0.5)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', marginBottom: '24px' }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7-7 7 7 7" /></svg>
                Back to List
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
                {/* Detail card */}
                <div style={{ backgroundColor: 'white', border: '1px solid #e8dfc9' }}>
                  <div style={{ padding: '28px 32px', borderBottom: '1px solid #e8dfc9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: GOLD }}>{detail.id}</span>
                      <StatusChip status={detail.status} />
                    </div>
                    <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '22px', color: G, fontWeight: 500, marginBottom: '10px' }}>{detail.title}</h2>
                    <div style={{ fontSize: '13px', color: 'rgba(28,18,8,0.5)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <span>{detail.flag} {detail.city}, {detail.country}</span>
                    </div>
                  </div>
                  <div style={{ padding: '28px 32px', display: 'grid', gap: '20px' }}>
                    {[
                      { label: 'Description', value: detail.description },
                      { label: 'Objectives & Outputs', value: detail.objectives },
                      { label: 'Budget', value: detail.budget },
                      { label: 'Duration', value: detail.duration },
                    ].map(f => (
                      <div key={f.label}>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '5px' }}>{f.label}</div>
                        <div style={{ fontSize: '14px', color: 'rgba(28,18,8,0.75)', lineHeight: 1.7 }}>{f.value}</div>
                      </div>
                    ))}
                    {detail.adminNote && (
                      <div style={{ padding: '16px', backgroundColor: detail.status === 'accepted' ? '#f0fdf4' : '#fff5f5', border: `1px solid ${detail.status === 'accepted' ? '#bbf7d0' : '#fecaca'}` }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: detail.status === 'accepted' ? '#166534' : '#991b1b', marginBottom: '6px' }}>
                          {detail.status === 'accepted' ? '✓ Approval Note' : '✗ Rejection Reason'}
                        </div>
                        <div style={{ fontSize: '13px', color: 'rgba(28,18,8,0.7)', lineHeight: 1.6 }}>{detail.adminNote}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(28,18,8,0.4)', marginTop: '8px' }}>
                          By: {detail.reviewedBy} · {detail.reviewedAt}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verify panel */}
                {detail.status === 'pending' && (
                  <div style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '28px', position: 'sticky', top: '80px' }}>
                    <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '18px', color: G, fontWeight: 500, marginBottom: '20px' }}>Review Panel</h3>

                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: G, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Notes / Reason</label>
                    <textarea
                      value={verifyNote}
                      onChange={e => setVerifyNote(e.target.value)}
                      placeholder="Write approval notes or rejection reasons..."
                      rows={5}
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, resize: 'vertical', marginBottom: '16px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif' }}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button
                        onClick={() => { setVerifyAction('accept'); setConfirmAction({ action: 'accept', proposalId: detail.id }) }}
                        style={{ padding: '12px', fontSize: '14px', fontWeight: 600, backgroundColor: '#166534', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        ✓ Approve Proposal
                      </button>
                      <button
                        onClick={() => { setVerifyAction('reject'); setConfirmAction({ action: 'reject', proposalId: detail.id }) }}
                        style={{ padding: '12px', fontSize: '14px', fontWeight: 600, backgroundColor: '#991b1b', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        ✗ Reject Proposal
                      </button>
                      <button
                        onClick={() => setSelectedProposal(null)}
                        style={{ padding: '12px', fontSize: '13px', backgroundColor: 'transparent', color: 'rgba(28,18,8,0.5)', border: '1px solid #e8dfc9', cursor: 'pointer' }}
                      >
                        Hold
                      </button>
                    </div>

                    <div style={{ marginTop: '20px', padding: '14px', backgroundColor: PARCH, fontSize: '12px', color: 'rgba(28,18,8,0.55)', lineHeight: 1.6 }}>
                      <strong>Note:</strong> This decision will be sent by email to the submitting party and recorded in the system.
                    </div>
                  </div>
                )}

                {detail.status !== 'pending' && (
                  <div style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '28px' }}>
                    <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '16px', color: G, fontWeight: 500, marginBottom: '12px' }}>Decision History</h3>
                    <div style={{ fontSize: '13px', color: 'rgba(28,18,8,0.6)', display: 'grid', gap: '8px' }}>
                      <div><span style={{ fontWeight: 600 }}>Status:</span> <StatusChip status={detail.status} /></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ USERS ══════════════════════════════ */}
          {tab === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                  <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '26px', color: G, fontWeight: 500, marginBottom: '4px' }}>User Management</h1>
                  <p style={{ fontSize: '13px', color: 'rgba(28,18,8,0.5)' }}>{localUsers.length} registered users</p>
                </div>
                <button onClick={() => { setAddUserOpen(!addUserOpen); if (addUserOpen) setUserForm({ id: null, name: '', email: '', city: '', role: 'foreign-rep', status: 'active' }) }} style={{ backgroundColor: G, color: 'white', padding: '10px 20px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                  + Add User
                </button>
              </div>

              {addUserOpen && (
                <div style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '24px', marginBottom: '24px' }}>
                  <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '16px', color: G, fontWeight: 500, marginBottom: '16px' }}>{userForm.id ? 'Edit User' : 'Add New User'}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Full Name</label>
                      <input value={userForm.name} onChange={e => setUserForm(f => ({ ...f, name: e.target.value }))} placeholder="User Name" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email</label>
                      <input value={userForm.email} onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))} placeholder="email@domain.com" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>City / Institution</label>
                      <input value={userForm.city} onChange={e => setUserForm(f => ({ ...f, city: e.target.value }))} placeholder="City Name" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Role</label>
                      <select value={userForm.role} onChange={e => setUserForm(f => ({ ...f, role: e.target.value as 'admin' | 'foreign-rep' | 'editor' | 'viewer' }))} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box' }}>
                        <option value="admin">Admin</option>
                        <option value="foreign-rep">Partner</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</label>
                      <select value={userForm.status} onChange={e => setUserForm(f => ({ ...f, status: e.target.value as 'active' | 'pending' }))} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box' }}>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleSaveUser} style={{ backgroundColor: G, color: 'white', padding: '9px 20px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Save</button>
                    <button onClick={() => { setAddUserOpen(false); setUserForm({ id: null, name: '', email: '', city: '', role: 'foreign-rep', status: 'active' }) }} style={{ backgroundColor: 'transparent', color: 'rgba(28,18,8,0.5)', padding: '9px 20px', fontSize: '13px', border: '1px solid #e8dfc9', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              )}

              <div style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e8dfc9', backgroundColor: PARCH }}>
                      {['User', 'Email', 'City', 'Role', 'Status', 'Last Login', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'rgba(28,18,8,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {localUsers.map((u, i) => (
                      <tr key={u.id} style={{ borderBottom: i < localUsers.length - 1 ? '1px solid #f0ebe0' : 'none' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: u.role === 'admin' ? G : u.role === 'foreign-rep' ? GOLD : '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                              {u.name[0]}
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 500, color: G }}>{u.name.split(',')[0]}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(28,18,8,0.6)', fontFamily: 'JetBrains Mono, monospace' }}>{u.email}</td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(28,18,8,0.6)' }}>{u.city}</td>
                        <td style={{ padding: '14px 16px' }}><RoleChip role={u.role} /></td>
                        <td style={{ padding: '14px 16px' }}>
                          <Badge
                            label={u.status === 'active' ? 'Active' : 'Pending'}
                            color={u.status === 'active' ? '#166534' : '#92400e'}
                            bg={u.status === 'active' ? '#dcfce7' : '#fef3c7'}
                            border={u.status === 'active' ? '#bbf7d0' : '#fde68a'}
                          />
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '12px', color: 'rgba(28,18,8,0.45)', fontFamily: 'JetBrains Mono, monospace' }}>{u.lastLogin}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <button onClick={() => { setUserForm({ id: u.id, name: u.name, email: u.email, city: u.city, role: u.role, status: u.status }); setAddUserOpen(true) }} style={{ fontSize: '11px', padding: '4px 10px', backgroundColor: 'transparent', color: G, border: `1px solid ${G}`, cursor: 'pointer' }}>Edit</button>
                            {u.status === 'pending' && (
                              <button onClick={() => handleActivateUser(u.id)} style={{ fontSize: '11px', padding: '4px 10px', backgroundColor: '#166534', color: 'white', border: 'none', cursor: 'pointer' }}>Activate</button>
                            )}
                            <button onClick={() => handleDeleteUser(u.id)} style={{ fontSize: '11px', padding: '4px 10px', backgroundColor: '#991b1b', color: 'white', border: 'none', cursor: 'pointer' }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══ ROLES ══════════════════════════════ */}
          {tab === 'roles' && (
            <div>
              <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '26px', color: G, fontWeight: 500, marginBottom: '4px' }}>Roles & Permissions</h1>
              <p style={{ fontSize: '13px', color: 'rgba(28,18,8,0.5)', marginBottom: '36px' }}>Manage user roles and access permissions within the SISKOTA system.</p>

              {roleFormOpen && (
                <div style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '24px', marginBottom: '24px' }}>
                  <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '16px', color: G, fontWeight: 500, marginBottom: '16px' }}>{localRoles.some(r => r.name === roleForm.name) ? 'Edit Role' : 'Add New Role'}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Role Name</label>
                      <input value={roleForm.name} onChange={e => setRoleForm(f => ({ ...f, name: e.target.value }))} placeholder="manager" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Display Label</label>
                      <input value={roleForm.label} onChange={e => setRoleForm(f => ({ ...f, label: e.target.value }))} placeholder="Program Manager" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Permissions (comma-separated)</label>
                      <input value={roleForm.permissions} onChange={e => setRoleForm(f => ({ ...f, permissions: e.target.value }))} placeholder="Manage roles, Review proposals" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleSaveRole} style={{ backgroundColor: G, color: 'white', padding: '9px 20px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Save</button>
                    <button onClick={() => { setRoleFormOpen(false); setRoleForm({ name: '', label: '', color: '#1a4030', permissions: 'Manage roles, Review proposals' }) }} style={{ backgroundColor: 'transparent', color: 'rgba(28,18,8,0.5)', padding: '9px 20px', fontSize: '13px', border: '1px solid #e8dfc9', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                {localRoles.map(role => (
                  <div key={role.name} style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', overflow: 'hidden' }}>
                    <div style={{ height: '4px', backgroundColor: role.color }} />
                    <div style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div>
                          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '18px', color: G, fontWeight: 500 }}>{role.label}</div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: GOLD, marginTop: '2px' }}>{role.name}</div>
                        </div>
                        <div style={{ fontSize: '12px', backgroundColor: PARCH, padding: '4px 10px', color: 'rgba(28,18,8,0.5)' }}>
                          {localUsers.filter(u => u.role === role.name).length} users
                        </div>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Access Rights</div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '6px' }}>
                          {role.permissions.map(p => (
                            <li key={p} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(28,18,8,0.7)' }}>
                              <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '12px' }}>✓</span>
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => { setRoleForm({ name: role.name, label: role.label, color: role.color, permissions: role.permissions.join(', ') }); setRoleFormOpen(true) }} style={{ flex: 1, padding: '8px', fontSize: '12px', backgroundColor: 'transparent', color: G, border: `1px solid ${G}`, cursor: 'pointer', fontWeight: 500 }}>Edit Access</button>
                        {role.name !== 'admin' && <button onClick={() => handleDeleteRole(role.name)} style={{ padding: '8px 14px', fontSize: '12px', backgroundColor: PARCH, color: 'rgba(28,18,8,0.5)', border: '1px solid #e8dfc9', cursor: 'pointer' }}>Remove</button>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div onClick={() => { setRoleFormOpen(true); setRoleForm({ name: '', label: '', color: '#1a4030', permissions: 'Manage roles, Review proposals' }) }} style={{ marginTop: '24px', backgroundColor: 'white', border: '1px dashed #e8dfc9', padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>+</div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: G }}>Add New Role</div>
                <div style={{ fontSize: '12px', color: 'rgba(28,18,8,0.45)' }}>Create a custom role with tailored permissions</div>
              </div>
            </div>
          )}

          {/* ═══ CONTENT ════════════════════════════ */}
          {tab === 'content' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                  <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '26px', color: G, fontWeight: 500, marginBottom: '4px' }}>Content Management</h1>
                  <p style={{ fontSize: '13px', color: 'rgba(28,18,8,0.5)' }}>Manage articles, photos, and videos across the system.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setContentTab('list')} style={{ padding: '9px 18px', fontSize: '13px', backgroundColor: contentTab === 'list' ? G : 'transparent', color: contentTab === 'list' ? 'white' : G, border: `1px solid ${G}`, cursor: 'pointer' }}>Content List</button>
                  <button onClick={() => setContentTab('new')} style={{ padding: '9px 18px', fontSize: '13px', backgroundColor: contentTab === 'new' ? G : 'transparent', color: contentTab === 'new' ? 'white' : G, border: `1px solid ${G}`, cursor: 'pointer' }}>+ Create Content</button>
                </div>
              </div>

              {contentTab === 'list' && (
                <div style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e8dfc9', backgroundColor: PARCH }}>
                        {['Title', 'Type', 'Partner City', 'Author', 'Date', 'Status', 'Actions'].map(h => (
                          <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'rgba(28,18,8,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {contentItems.map((c, i) => (
                        <tr key={c.id} style={{ borderBottom: i < contentItems.length - 1 ? '1px solid #f0ebe0' : 'none' }}>
                          <td style={{ padding: '14px 16px', maxWidth: '280px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: G, lineHeight: 1.4 }}>{c.title}</div>
                            <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                              {c.tags.map(tag => <span key={tag} style={{ fontSize: '10px', backgroundColor: PARCH, color: 'rgba(28,18,8,0.5)', padding: '1px 6px' }}>{tag}</span>)}
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontSize: '11px', padding: '3px 8px', backgroundColor: c.type === 'article' ? '#dbeafe' : c.type === 'photo' ? '#fef3c7' : '#f3e8ff', color: c.type === 'article' ? '#1e40af' : c.type === 'photo' ? '#92400e' : '#6d28d9', fontWeight: 600 }}>
                              {c.type === 'article' ? '📄 Artikel' : c.type === 'photo' ? '📷 Foto' : '🎬 Video'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(28,18,8,0.6)' }}>{c.city}</td>
                          <td style={{ padding: '14px 16px', fontSize: '12px', color: 'rgba(28,18,8,0.55)' }}>{c.author}</td>
                          <td style={{ padding: '14px 16px', fontSize: '12px', color: 'rgba(28,18,8,0.45)', fontFamily: 'JetBrains Mono, monospace' }}>{new Date(c.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <Badge
                              label={c.status === 'published' ? 'Published' : 'Draft'}
                              color={c.status === 'published' ? '#166534' : '#92400e'}
                              bg={c.status === 'published' ? '#dcfce7' : '#fef3c7'}
                              border={c.status === 'published' ? '#bbf7d0' : '#fde68a'}
                            />
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              <button onClick={() => handleEditContent(c)} style={{ fontSize: '11px', padding: '4px 10px', backgroundColor: 'transparent', color: G, border: `1px solid ${G}`, cursor: 'pointer' }}>Edit</button>
                              {c.status === 'draft' && <button onClick={() => handlePublishContent(c.id)} style={{ fontSize: '11px', padding: '4px 10px', backgroundColor: G, color: 'white', border: 'none', cursor: 'pointer' }}>Publish</button>}
                              <button onClick={() => handleDeleteContent(c.id)} style={{ fontSize: '11px', padding: '4px 10px', backgroundColor: '#991b1b', color: 'white', border: 'none', cursor: 'pointer' }}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {contentTab === 'new' && (
                <div style={{ maxWidth: '720px', backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '36px' }}>
                  <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '20px', color: G, fontWeight: 500, marginBottom: '24px' }}>Create New Content</h3>
                  <div style={{ display: 'grid', gap: '18px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Content Type</label>
                      <div style={{ display: 'flex', gap: '0', border: '1px solid #e8dfc9' }}>
                        {[{ key: 'article', label: '📄 Article' }, { key: 'photo', label: '📷 Photo' }, { key: 'video', label: '🎬 Video' }].map(t => (
                          <button key={t.key} onClick={() => setNewArticle(f => ({ ...f, type: t.key }))}
                            style={{ flex: 1, padding: '9px', fontSize: '13px', border: 'none', cursor: 'pointer', backgroundColor: newArticle.type === t.key ? G : 'transparent', color: newArticle.type === t.key ? 'white' : 'rgba(28,18,8,0.5)' }}>
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {[
                      { key: 'title', label: 'Title', ph: 'Article title...', type: 'input' },
                      { key: 'city', label: 'Related City', ph: '', type: 'select', opts: partnerCities.map(c => c.name) },
                      { key: 'tags', label: 'Article Tag', ph: '', type: 'tag-select', opts: ['Culture', 'Education', 'Research', 'Tourism', 'Innovation', 'Public Diplomacy'] },
                      ...(newArticle.type === 'article' ? [{ key: 'content', label: 'Article Content', ph: 'Write your article content...', type: 'textarea' }] : []),
                      ...(newArticle.type === 'video' ? [{ key: 'videoUrl', label: 'Video Embed URL', ph: 'https://www.youtube.com/embed/...', type: 'input' }] : []),
                    ].map((f: any) => (
                      <div key={f.key}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</label>
                        {f.type === 'input' && (
                          <input value={newArticle[f.key as keyof typeof newArticle]} onChange={e => setNewArticle(a => ({ ...a, [f.key]: e.target.value }))}
                            placeholder={f.ph} style={{ width: '100%', padding: '9px 14px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box' }} />
                        )}
                        {f.type === 'textarea' && (
                          <textarea value={newArticle[f.key as keyof typeof newArticle]} onChange={e => setNewArticle(a => ({ ...a, [f.key]: e.target.value }))}
                            placeholder={f.ph} rows={8} style={{ width: '100%', padding: '9px 14px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box', resize: 'vertical', fontFamily: 'Inter, system-ui, sans-serif' }} />
                        )}
                        {f.type === 'select' && (
                          <select value={newArticle[f.key as keyof typeof newArticle]} onChange={e => setNewArticle(a => ({ ...a, [f.key]: e.target.value }))}
                            style={{ width: '100%', padding: '9px 14px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif' }}>
                            <option value="">— Select an option —</option>
                            {f.opts?.map((o: string) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        )}
                        {f.type === 'tag-select' && (
                          <select value={newArticle.tags} onChange={e => setNewArticle(a => ({ ...a, tags: e.target.value }))}
                            style={{ width: '100%', padding: '9px 14px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif' }}>
                            <option value="">— Select article tag —</option>
                            {f.opts?.map((o: string) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        )}
                      </div>
                    ))}

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Thumbnail URL</label>
                      <input
                        value={newArticle.thumbnail}
                        onChange={e => setNewArticle(a => ({ ...a, thumbnail: e.target.value }))}
                        placeholder="https://.../image.jpg"
                        style={{ width: '100%', padding: '9px 14px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box' }}
                      />
                    </div>

                    {(newArticle.type === 'article' || newArticle.type === 'video') && (
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Video Embed URL</label>
                        <input
                          value={newArticle.videoUrl}
                          onChange={e => setNewArticle(a => ({ ...a, videoUrl: e.target.value }))}
                          placeholder="https://www.youtube.com/embed/..."
                          style={{ width: '100%', padding: '9px 14px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box' }}
                        />
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
                      <button onClick={() => handleSaveContent('draft')} style={{ backgroundColor: G, color: 'white', padding: '11px 28px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Save Draft</button>
                      <button onClick={() => handleSaveContent('published')} style={{ backgroundColor: '#166534', color: 'white', padding: '11px 28px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Publish</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ PERSONNEL ══════════════════════════ */}
          {tab === 'personnel' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                  <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '26px', color: G, fontWeight: 500, marginBottom: '4px' }}>Partnership Team</h1>
                  <p style={{ fontSize: '13px', color: 'rgba(28,18,8,0.5)' }}>Manage the international cooperation team profile.</p>
                </div>
                <button onClick={() => { setPersonnelFormOpen(true); setPersonnelForm({ id: null, name: '', title: '', leadershipLabel: '', email: '', phone: '', bio: '', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&auto=format' }) }} style={{ backgroundColor: G, color: 'white', padding: '10px 20px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>+ Add Team Member</button>
              </div>

              {personnelFormOpen && (
                <div style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '24px', marginBottom: '24px' }}>
                  <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '16px', color: G, fontWeight: 500, marginBottom: '16px' }}>{personnelForm.id ? 'Edit Team Member' : 'Add Team Member'}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Name</label>
                      <input value={personnelForm.name} onChange={e => setPersonnelForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Title</label>
                      <input value={personnelForm.title} onChange={e => setPersonnelForm(f => ({ ...f, title: e.target.value }))} placeholder="Head of Division" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Leadership Label</label>
                      <input value={personnelForm.leadershipLabel} onChange={e => setPersonnelForm(f => ({ ...f, leadershipLabel: e.target.value }))} placeholder="Head of Division (optional)" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email</label>
                      <input value={personnelForm.email} onChange={e => setPersonnelForm(f => ({ ...f, email: e.target.value }))} placeholder="name@domain.com" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Phone</label>
                      <input value={personnelForm.phone} onChange={e => setPersonnelForm(f => ({ ...f, phone: e.target.value }))} placeholder="+62 ..." style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Biography</label>
                      <textarea value={personnelForm.bio} onChange={e => setPersonnelForm(f => ({ ...f, bio: e.target.value }))} rows={4} placeholder="Short bio..." style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box', resize: 'vertical' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleSavePersonnel} style={{ backgroundColor: G, color: 'white', padding: '9px 20px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Save</button>
                    <button onClick={() => { setPersonnelFormOpen(false); setPersonnelForm({ id: null, name: '', title: '', leadershipLabel: '', email: '', phone: '', bio: '', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&auto=format' }) }} style={{ backgroundColor: 'transparent', color: 'rgba(28,18,8,0.5)', padding: '9px 20px', fontSize: '13px', border: '1px solid #e8dfc9', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gap: '16px' }}>
                {localPersonnel.map((p, i) => (
                  <div key={p.id} style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '20px 24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '16px', color: G, fontWeight: 500 }}>{p.name}</div>
                        {p.leadershipLabel && <Badge label={p.leadershipLabel} color={G} bg={GOLD} border={GOLD} />}
                      </div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: GOLD, marginBottom: '6px' }}>{p.title}</div>
                      <div style={{ fontSize: '13px', color: 'rgba(28,18,8,0.6)', lineHeight: 1.5 }}>{p.bio}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(28,18,8,0.45)', marginTop: '6px' }}>{p.email} · {p.phone}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                      <button onClick={() => { setPersonnelForm({ id: p.id, name: p.name, title: p.title, leadershipLabel: p.leadershipLabel, email: p.email, phone: p.phone, bio: p.bio, photo: p.photo }); setPersonnelFormOpen(true) }} style={{ fontSize: '12px', padding: '7px 14px', backgroundColor: 'transparent', color: G, border: `1px solid ${G}`, cursor: 'pointer' }}>Edit Profil</button>
                      <button onClick={() => handleDeletePersonnel(p.id)} style={{ fontSize: '12px', padding: '7px 14px', backgroundColor: '#991b1b', color: 'white', border: 'none', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>

              <div onClick={() => { setPersonnelFormOpen(true); setPersonnelForm({ id: null, name: '', title: '', leadershipLabel: '', email: '', phone: '', bio: '', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&auto=format' }) }} style={{ marginTop: '24px', backgroundColor: 'white', border: '1px dashed #e8dfc9', padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>+</div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: G }}>Add Team Member</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
