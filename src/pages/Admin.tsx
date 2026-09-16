import { useEffect, useRef, useState } from 'react'
import { proposals, adminUsers, roles, foreignRelationsPersonnel, partnerCities } from '../data/mock'
import type { ContentItem, HomepageMessages, PendingHomepageVoice } from '../data/mock'
import type { Page, AuthUser } from '../App'
import QuillRichTextEditor from '../components/QuillEditor'

const G = '#1a4030'
const GOLD = '#c9963a'
const PARCH = '#f7f2ea'
const DARK = '#0f2a1f'
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const permissionOptions = [
  'Kelola Pengguna & Peran',
  'Verifikasi Proposal Kemitraan',
  'Kelola Konten (Artikel, Foto, Video)',
  'Kelola Profil Personel Hubungan Luar Negeri',
  'Lihat Laporan & Analitik',
  'Konfigurasi Sistem',
  'Submit collaboration proposals',
  'Track proposal status',
  'View partner city profiles',
  'Access public galleries and articles',
  'Manage personal account details',
  'Submit Partner Voice',
  'Create and edit articles',
  'Upload and manage media files',
  'Add video embeds',
  'View basic reporting',
  'Lihat Halaman Publik',
  'Lihat Galeri & Artikel',
]
const defaultRolePermissions: string[] = []

interface Props {
  auth: AuthUser
  navigate: (p: Page) => void
  partnerCities: typeof partnerCities
  setPartnerCities: React.Dispatch<React.SetStateAction<typeof partnerCities>>
  contentItems: ContentItem[]
  setContentItems: React.Dispatch<React.SetStateAction<ContentItem[]>>
  personnel: typeof foreignRelationsPersonnel
  setPersonnel: React.Dispatch<React.SetStateAction<typeof foreignRelationsPersonnel>>
  proposals: typeof proposals
  setProposals: React.Dispatch<React.SetStateAction<typeof proposals>>
  users: typeof adminUsers
  setUsers: React.Dispatch<React.SetStateAction<typeof adminUsers>>
  roles: typeof roles
  setRoles: React.Dispatch<React.SetStateAction<typeof roles>>
  homepageMessages: HomepageMessages
  setHomepageMessages: React.Dispatch<React.SetStateAction<HomepageMessages>>
  pendingVoices: PendingHomepageVoice[]
  setPendingVoices: React.Dispatch<React.SetStateAction<PendingHomepageVoice[]>>
}

type AdminTab = 'overview' | 'proposals' | 'users' | 'roles' | 'content' | 'cities' | 'personnel' | 'homepage'

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

function RichTextEditor({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  const editorRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) editorRef.current.innerHTML = value
  }, [value])

  const runCommand = (command: string, commandValue?: string) => {
    editorRef.current?.focus()
    document.execCommand(command, false, commandValue)
    onChange(editorRef.current?.innerHTML ?? '')
  }

  const addImage = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.onload = () => {
        const scale = Math.min(1, 1200 / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))
        canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height)
        editorRef.current?.focus()
        document.execCommand('insertImage', false, canvas.toDataURL('image/jpeg', 0.7))
        onChange(editorRef.current?.innerHTML ?? '')
      }
      image.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const toolbarButton = (label: string, command: string, commandValue?: string) => (
    <button
      type="button"
      onMouseDown={event => { event.preventDefault(); runCommand(command, commandValue) }}
      style={{ minWidth: '32px', padding: '6px 8px', border: '1px solid #e8dfc9', backgroundColor: 'white', color: G, cursor: 'pointer', fontWeight: 600 }}
      title={label}
      aria-label={label}
    >
      {label}
    </button>
  )

  return (
    <div style={{ border: '1px solid #e8dfc9', backgroundColor: PARCH }}>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap', padding: '8px', borderBottom: '1px solid #e8dfc9', backgroundColor: '#efe5cf' }}>
        <select onChange={event => runCommand('fontName', event.target.value)} defaultValue="Inter" aria-label="Choose font" style={{ padding: '6px 8px', border: '1px solid #e8dfc9', color: G, backgroundColor: 'white' }}>
          <option value="Inter">Inter</option>
          <option value="Georgia">Georgia</option>
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier New</option>
        </select>
        <select onChange={event => runCommand('formatBlock', event.target.value)} defaultValue="p" aria-label="Choose text style" style={{ padding: '6px 8px', border: '1px solid #e8dfc9', color: G, backgroundColor: 'white' }}>
          <option value="p">Paragraph</option>
          <option value="h2">Heading</option>
          <option value="h3">Subheading</option>
          <option value="blockquote">Quote</option>
        </select>
        {toolbarButton('B', 'bold')}
        {toolbarButton('I', 'italic')}
        {toolbarButton('U', 'underline')}
        {toolbarButton('Left', 'justifyLeft')}
        {toolbarButton('Center', 'justifyCenter')}
        {toolbarButton('Right', 'justifyRight')}
        {toolbarButton('• List', 'insertUnorderedList')}
        {toolbarButton('1. List', 'insertOrderedList')}
        {toolbarButton('Clear', 'removeFormat')}
        <button type="button" onMouseDown={event => { event.preventDefault(); imageInputRef.current?.click() }} style={{ padding: '6px 10px', border: '1px solid #e8dfc9', backgroundColor: G, color: 'white', cursor: 'pointer', fontWeight: 600 }}>Add Photo</button>
        <button type="button" onMouseDown={event => { event.preventDefault(); const url = window.prompt('Paste image URL'); if (url) { editorRef.current?.focus(); document.execCommand('insertImage', false, url); onChange(editorRef.current?.innerHTML ?? '') } }} style={{ padding: '6px 10px', border: '1px solid #e8dfc9', backgroundColor: 'white', color: G, cursor: 'pointer' }}>Image URL</button>
        <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={event => { addImage(event.target.files?.[0]); event.currentTarget.value = '' }} />
      </div>
      <div style={{ position: 'relative' }}>
        {!value && <div style={{ position: 'absolute', top: '16px', left: '16px', color: 'rgba(28,18,8,0.5)', fontSize: '14px', pointerEvents: 'none' }}>{placeholder}</div>}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={event => onChange(event.currentTarget.innerHTML)}
          data-placeholder={placeholder}
          style={{ minHeight: '280px', padding: '16px', backgroundColor: PARCH, color: '#1c1208', fontSize: '14px', lineHeight: 1.7, outline: 'none' }}
        />
      </div>
    </div>
  )
}

export default function AdminDashboard({ auth, navigate, partnerCities, setPartnerCities, contentItems, setContentItems, personnel, setPersonnel, proposals, setProposals, users, setUsers, roles, setRoles, homepageMessages, setHomepageMessages, pendingVoices, setPendingVoices }: Props) {
  const [tab, setTab] = useState<AdminTab>('overview')
  const [proposalFilter, setProposalFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all')
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null)
  const [verifyNote, setVerifyNote] = useState('')
  const [verifyAction, setVerifyAction] = useState<'accept' | 'reject' | null>(null)
  const localProposals = proposals
  const localUsers = users
  const [homepageVoiceForm, setHomepageVoiceForm] = useState({ id: null as number | null, city: '', flag: '🌏', quote: '', name: '', role: '', photo: '', photoPosition: '50% 50%' })
  const [voiceDragPosition, setVoiceDragPosition] = useState({ x: 50, y: 50 })
  const [isDraggingVoice, setIsDraggingVoice] = useState(false)
  const [voiceDragStart, setVoiceDragStart] = useState({ pointerX: 0, pointerY: 0, x: 50, y: 50 })
  const [localRoles, setLocalRoles] = useState(roles)
  const localPersonnel = personnel
  const [personnelCountry, setPersonnelCountry] = useState('Indonesia')
  const [contentTab, setContentTab] = useState<'list' | 'new'>('list')
  const [newArticle, setNewArticle] = useState({ title: '', city: '', type: 'article', content: '', tags: '', videoUrl: '', thumbnail: '' })
  const [contentEditingId, setContentEditingId] = useState<number | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ action: 'accept' | 'reject'; proposalId: string } | null>(null)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [userForm, setUserForm] = useState({ id: null as number | null, name: '', email: '', city: '', role: 'foreign-rep' as 'admin' | 'foreign-rep' | 'editor' | 'viewer', status: 'active' as 'active' | 'pending' })
  const [roleFormOpen, setRoleFormOpen] = useState(false)
  const [roleForm, setRoleForm] = useState({ name: '', label: '', color: '#1a4030', permissions: defaultRolePermissions })
  const [personnelFormOpen, setPersonnelFormOpen] = useState(false)
  const [cityFormOpen, setCityFormOpen] = useState(false)
  const [cityForm, setCityForm] = useState({ id: '', name: '', country: '', flag: '🌏', year: String(new Date().getFullYear()), description: '', coverImage: '', coverPosition: '50% 50%', population: '', area: '', timezone: '' })
  const [cityImageEditingId, setCityImageEditingId] = useState<string | null>(null)
  const [cityImageUrl, setCityImageUrl] = useState('')
  const [cityImagePosition, setCityImagePosition] = useState('center')
  const [cityImagePreview, setCityImagePreview] = useState('')
  const [quickDragPosition, setQuickDragPosition] = useState({ x: 50, y: 50 })
  const [isDraggingQuickImage, setIsDraggingQuickImage] = useState(false)
  const [quickDragStart, setQuickDragStart] = useState({ pointerX: 0, pointerY: 0, x: 50, y: 50 })
  const [imageUploadError, setImageUploadError] = useState('')
  const [dragPosition, setDragPosition] = useState({ x: 50, y: 50 })
  const [isDraggingImage, setIsDraggingImage] = useState(false)
  const [dragStart, setDragStart] = useState({ pointerX: 0, pointerY: 0, x: 50, y: 50 })
  const [personnelForm, setPersonnelForm] = useState({ id: null as number | null, name: '', title: '', leadershipLabel: '', country: 'Indonesia', email: '', phone: '', bio: '', photo: '' })
  const canConfigure = auth?.role === 'admin' || auth?.permissions?.includes('Konfigurasi Sistem')

  const readImageFile = (file: File, onRead: (dataUrl: string) => void) => {
    if (!file.type.startsWith('image/')) {
      setImageUploadError('File harus berupa gambar.')
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImageUploadError('Ukuran gambar maksimal 5 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.onload = () => {
        const maxDimension = 1200
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))
        canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height)
        setImageUploadError('')
        onRead(canvas.toDataURL('image/jpeg', 0.68))
      }
      image.onerror = () => setImageUploadError('File gambar tidak dapat dibaca.')
      image.src = String(reader.result)
    }
    reader.onerror = () => setImageUploadError('File gambar tidak dapat dibaca.')
    reader.readAsDataURL(file)
  }

  const getPositionValues = (position?: string) => {
    const [x = '50%', y = '50%'] = (position ?? '50% 50%').split(' ')
    return { x: Number.parseFloat(x) || 50, y: Number.parseFloat(y) || 50 }
  }

  const startImageDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDraggingImage(true)
    setDragStart({ pointerX: event.clientX, pointerY: event.clientY, ...dragPosition })
  }

  const moveImageDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingImage) return
    const nextPosition = {
      x: Math.max(0, Math.min(100, dragStart.x - (event.clientX - dragStart.pointerX) / 3)),
      y: Math.max(0, Math.min(100, dragStart.y - (event.clientY - dragStart.pointerY) / 3)),
    }
    setDragPosition(nextPosition)
    setCityForm(form => ({ ...form, coverPosition: `${nextPosition.x}% ${nextPosition.y}%` }))
  }

  const finishImageDrag = () => setIsDraggingImage(false)

  if (!auth || !canConfigure) {
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
  const personnelCountries = Array.from(new Set(localPersonnel.map(person => person.country)))
  const visiblePersonnel = localPersonnel.filter(person => person.country === personnelCountry)

  const handleVerify = (action: 'accept' | 'reject') => {
    setProposals(prev => prev.map(p => p.id === (confirmAction?.proposalId ?? selectedProposal) ? { ...p, status: action === 'accept' ? 'accepted' : 'rejected', adminNote: verifyNote || (action === 'accept' ? 'Proposal approved by the partnership review team.' : 'Proposal rejected. Please revise and resubmit.'), reviewedBy: auth.name, reviewedAt: new Date().toISOString().split('T')[0] } : p))
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
      setUsers(prev => prev.map(u => u.id === userForm.id ? { ...u, name, email, city, role: userForm.role, status: userForm.status } : u))
    } else {
      setUsers(prev => [
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

    setUsers(prev => prev.filter(u => u.id !== id))
  }

  const handleActivateUser = (id: number) => {
    const user = localUsers.find(u => u.id === id)
    if (!user) return

    const confirmed = window.confirm(`Apakah Anda yakin ingin mengaktifkan user "${user.name}"?`)
    if (!confirmed) return

    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'active', lastLogin: 'Just now' } : u))
  }

  const handleSaveRole = () => {
    const name = roleForm.name.trim()
    const label = roleForm.label.trim()
    if (!name || !label) return

    const permissions = roleForm.permissions.filter(Boolean)

    if (localRoles.some(r => r.name === name)) {
      const nextRoles = localRoles.map(r => r.name === name ? { ...r, label, color: roleForm.color, permissions } : r)
      setLocalRoles(nextRoles)
      setRoles(nextRoles)
    } else {
      const nextRoles = [...localRoles, { name, label, color: roleForm.color, permissions }]
      setLocalRoles(nextRoles)
      setRoles(nextRoles)
    }

    setRoleForm({ name: '', label: '', color: '#1a4030', permissions: defaultRolePermissions })
    setRoleFormOpen(false)
  }

  const handleDeleteRole = (name: string) => {
    if (name === 'admin') return

    const role = localRoles.find(r => r.name === name)
    if (!role) return

    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus role "${role.label}"?`)
    if (!confirmed) return

    setLocalRoles(prev => prev.filter(r => r.name !== name))
    setRoles(prev => prev.filter(r => r.name !== name))
    setUsers(prev => prev.map(u => u.role === name ? { ...u, role: 'viewer' as const } : u))
  }

  const handleSaveContent = (status: 'draft' | 'published') => {
    const title = newArticle.title.trim()
    const city = newArticle.city.trim() || 'Yogyakarta'
    if (!title) return
    if (newArticle.type === 'photo' && !newArticle.thumbnail) {
      setImageUploadError('Konten foto wajib memiliki file gambar.')
      return
    }

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

    const currentPerson = personnelForm.id ? localPersonnel.find(item => item.id === personnelForm.id) : null
    if (!name || !title || !email || !phone) return
    if (!personnelForm.photo && !currentPerson?.photo) {
      setImageUploadError('Foto personel wajib diunggah.')
      return
    }

    const normalized = {
      id: personnelForm.id ?? Date.now(),
      name,
      role: title,
      leadershipLabel: personnelForm.leadershipLabel.trim(),
      title,
      country: personnelForm.country,
      partnerCity: currentPerson?.partnerCity ?? 'yogyakarta',
      photo: personnelForm.photo,
      email,
      phone,
      bio: personnelForm.bio || 'Partnership team member coordinating international collaboration initiatives.',
    }

    setPersonnel(prev => {
      if (personnelForm.id) {
        return prev.map(item => item.id === personnelForm.id ? { ...item, ...normalized } : item)
      }
      return [normalized, ...prev]
    })

    setPersonnelForm({ id: null, name: '', title: '', leadershipLabel: '', country: 'Indonesia', email: '', phone: '', bio: '', photo: '' })
    setPersonnelFormOpen(false)
  }

  const handleDeletePersonnel = (id: number) => {
    const person = localPersonnel.find(item => item.id === id)
    if (!person) return

    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus anggota tim "${person.name}"?`)
    if (!confirmed) return

    setPersonnel(prev => prev.filter(item => item.id !== id))
  }

  const handleSaveCityImage = (cityId: string) => {
    const imageUrl = cityImageUrl.trim()
    if (!imageUrl) return

    setPartnerCities(prev => prev.map(city => city.id === cityId ? { ...city, coverImage: imageUrl, thumbImage: imageUrl } : city))
    setCityImageEditingId(null)
    setCityImageUrl('')
  }

  const handleCityImageFile = (file: File | undefined, cityId?: string) => {
    if (!file) return
    readImageFile(file, dataUrl => {
      if (cityId) {
        setCityImagePreview(dataUrl)
      } else {
        setCityForm(form => ({ ...form, coverImage: dataUrl }))
      }
    })
  }

  const startQuickImageDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDraggingQuickImage(true)
    setQuickDragStart({ pointerX: event.clientX, pointerY: event.clientY, ...quickDragPosition })
  }

  const moveQuickImageDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingQuickImage) return
    setQuickDragPosition({
      x: Math.max(0, Math.min(100, quickDragStart.x - (event.clientX - quickDragStart.pointerX) / 3)),
      y: Math.max(0, Math.min(100, quickDragStart.y - (event.clientY - quickDragStart.pointerY) / 3)),
    })
  }

  const saveQuickCityImage = (cityId: string) => {
    if (!cityImagePreview) return
    setPartnerCities(prev => prev.map(city => city.id === cityId ? { ...city, coverImage: cityImagePreview, thumbImage: cityImagePreview, coverPosition: `${quickDragPosition.x}% ${quickDragPosition.y}%` } : city))
    setCityImageEditingId(null)
    setCityImagePreview('')
  }

  const cancelQuickCityImage = () => {
    setCityImageEditingId(null)
    setCityImagePreview('')
    setImageUploadError('')
  }

  const resetCityForm = () => {
    setCityForm({ id: '', name: '', country: '', flag: '🌏', year: String(new Date().getFullYear()), description: '', coverImage: '', coverPosition: '50% 50%', population: '', area: '', timezone: '' })
    setCityFormOpen(false)
  }

  const handleSaveCity = () => {
    const name = cityForm.name.trim()
    const country = cityForm.country.trim()
    if (!name || !country) return

    const cityId = cityForm.id || `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`
    const existing = partnerCities.find(city => city.id === cityForm.id)
    if (!cityForm.coverImage && !existing) {
      setImageUploadError('Cover image wajib diunggah.')
      return
    }
    const city = {
      ...(existing ?? partnerCities[0]),
      id: cityId,
      name,
      country,
      flag: cityForm.flag || '🌏',
      year: Number(cityForm.year) || new Date().getFullYear(),
      description: cityForm.description.trim(),
      coverPosition: cityForm.coverPosition,
      population: cityForm.population.trim() || '—',
      area: cityForm.area.trim() || '—',
      timezone: cityForm.timezone.trim() || '—',
      coverImage: cityForm.coverImage.trim() || existing?.coverImage || partnerCities[0].coverImage,
      thumbImage: cityForm.coverImage.trim() || existing?.thumbImage || partnerCities[0].thumbImage,
    }

    setPartnerCities(prev => existing ? prev.map(item => item.id === existing.id ? city : item) : [...prev, city])
    resetCityForm()
  }

  const handleEditCity = (city: typeof partnerCities[number]) => {
    setCityForm({ id: city.id, name: city.name, country: city.country, flag: city.flag, year: String(city.year), description: city.description, coverImage: city.coverImage, coverPosition: city.coverPosition ?? '50% 50%', population: city.population, area: city.area, timezone: city.timezone })
    setDragPosition(getPositionValues(city.coverPosition))
    setCityFormOpen(true)
  }

  const handleDeleteCity = (cityId: string) => {
    const city = partnerCities.find(item => item.id === cityId)
    if (!city || !window.confirm(`Apakah Anda yakin ingin menghapus partner city "${city.name}"?`)) return
    setPartnerCities(prev => prev.filter(item => item.id !== cityId))
  }

  const handleSaveHomepageVoice = () => {
    if (!homepageVoiceForm.city.trim() || !homepageVoiceForm.quote.trim() || !homepageVoiceForm.name.trim() || !homepageVoiceForm.role.trim()) return
    const voice = { ...homepageVoiceForm, id: homepageVoiceForm.id ?? Date.now(), city: homepageVoiceForm.city.trim(), quote: homepageVoiceForm.quote.trim(), name: homepageVoiceForm.name.trim(), role: homepageVoiceForm.role.trim(), photoPosition: `${voiceDragPosition.x}% ${voiceDragPosition.y}%` }
    setHomepageMessages(prev => ({ ...prev, voices: homepageVoiceForm.id ? prev.voices.map(item => item.id === homepageVoiceForm.id ? voice : item) : [...prev.voices, voice] }))
    setHomepageVoiceForm({ id: null, city: '', flag: '🌏', quote: '', name: '', role: '', photo: '', photoPosition: '50% 50%' })
  }

  const handleEditHomepageVoice = (voice: HomepageMessages['voices'][number]) => {
    const [x = '50%', y = '50%'] = (voice.photoPosition ?? '50% 50%').split(' ')
    setVoiceDragPosition({ x: Number.parseFloat(x) || 50, y: Number.parseFloat(y) || 50 })
    setHomepageVoiceForm({ ...voice, photo: voice.photo ?? '', photoPosition: voice.photoPosition ?? '50% 50%' })
  }

  const startVoiceDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDraggingVoice(true)
    setVoiceDragStart({ pointerX: event.clientX, pointerY: event.clientY, ...voiceDragPosition })
  }

  const moveVoiceDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingVoice) return
    const nextPosition = {
      x: Math.max(0, Math.min(100, voiceDragStart.x - (event.clientX - voiceDragStart.pointerX) / 2)),
      y: Math.max(0, Math.min(100, voiceDragStart.y - (event.clientY - voiceDragStart.pointerY) / 2)),
    }
    setVoiceDragPosition(nextPosition)
    setHomepageVoiceForm(form => ({ ...form, photoPosition: `${nextPosition.x}% ${nextPosition.y}%` }))
  }

  const handleDeleteHomepageVoice = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus partner voice ini?')) setHomepageMessages(prev => ({ ...prev, voices: prev.voices.filter(voice => voice.id !== id) }))
  }

  const handleValidateVoice = (voice: PendingHomepageVoice, approved: boolean) => {
    setPendingVoices(prev => prev.map(item => item.id === voice.id ? { ...item, status: approved ? 'pending' : 'rejected', adminNote: approved ? 'Approved' : 'Rejected' } : item).filter(item => approved ? item.id !== voice.id : true))
    if (approved) setHomepageMessages(prev => ({ ...prev, voices: [...prev.voices, voice] }))
  }

  const TABS: { key: AdminTab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '◈' },
    { key: 'proposals', label: 'Proposal Review', icon: '◉' },
    { key: 'users', label: 'User Management', icon: '◎' },
    { key: 'roles', label: 'Roles & Access', icon: '◇' },
    { key: 'content', label: 'Content Management', icon: '◻' },
    { key: 'cities', label: 'Partner Cities', icon: '◎' },
    { key: 'homepage', label: 'Homepage Messages', icon: '✦' },
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
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>System Permissions</label>
                      <div style={{ display: 'grid', gap: '8px', border: '1px solid #e8dfc9', padding: '12px', backgroundColor: PARCH }}>
                        {permissionOptions.map(permission => (
                          <label key={permission} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', backgroundColor: roleForm.permissions.includes(permission) ? 'rgba(26,64,48,0.08)' : 'transparent', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={roleForm.permissions.includes(permission)}
                              onChange={e => setRoleForm(form => ({ ...form, permissions: e.target.checked ? [...form.permissions, permission] : form.permissions.filter(item => item !== permission) }))}
                              style={{ width: '16px', height: '16px', accentColor: G, cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '13px', color: 'rgba(28,18,8,0.75)' }}>{permission}</span>
                          </label>
                        ))}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(28,18,8,0.5)', marginTop: '6px' }}>Centang fitur yang boleh diakses role ini.</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleSaveRole} style={{ backgroundColor: G, color: 'white', padding: '9px 20px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Save</button>
                    <button onClick={() => { setRoleFormOpen(false); setRoleForm({ name: '', label: '', color: '#1a4030', permissions: defaultRolePermissions }) }} style={{ backgroundColor: 'transparent', color: 'rgba(28,18,8,0.5)', padding: '9px 20px', fontSize: '13px', border: '1px solid #e8dfc9', cursor: 'pointer' }}>Cancel</button>
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
                        <button onClick={() => { setRoleForm({ name: role.name, label: role.label, color: role.color, permissions: role.permissions.filter(permission => permissionOptions.includes(permission)) }); setRoleFormOpen(true) }} style={{ flex: 1, padding: '8px', fontSize: '12px', backgroundColor: 'transparent', color: G, border: `1px solid ${G}`, cursor: 'pointer', fontWeight: 500 }}>Edit Access</button>
                        {role.name !== 'admin' && <button onClick={() => handleDeleteRole(role.name)} style={{ padding: '8px 14px', fontSize: '12px', backgroundColor: PARCH, color: 'rgba(28,18,8,0.5)', border: '1px solid #e8dfc9', cursor: 'pointer' }}>Remove</button>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div onClick={() => { setRoleFormOpen(true); setRoleForm({ name: '', label: '', color: '#1a4030', permissions: defaultRolePermissions }) }} style={{ marginTop: '24px', backgroundColor: 'white', border: '1px dashed #e8dfc9', padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
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
                  {imageUploadError && <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '10px 12px', fontSize: '12px', marginBottom: '16px' }}>{imageUploadError}</div>}
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
                        {f.type === 'textarea' && f.key !== 'content' && (
                          <textarea value={newArticle[f.key as keyof typeof newArticle]} onChange={e => setNewArticle(a => ({ ...a, [f.key]: e.target.value }))}
                            placeholder={f.ph} rows={8} style={{ width: '100%', padding: '9px 14px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box', resize: 'vertical', fontFamily: 'Inter, system-ui, sans-serif' }} />
                        )}
                        {f.key === 'content' && <QuillRichTextEditor value={newArticle.content} onChange={content => setNewArticle(article => ({ ...article, content }))} placeholder={f.ph} />}
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
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Thumbnail Image (max 5 MB)</label>
                      <input type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) readImageFile(file, dataUrl => setNewArticle(article => ({ ...article, thumbnail: dataUrl }))) }} style={{ width: '100%', padding: '9px 14px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box' }} />
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

          {/* ═══ HOMEPAGE MESSAGES ══════════════════ */}
          {tab === 'homepage' && (
            <div>
              <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '26px', color: G, fontWeight: 500, marginBottom: '4px' }}>Homepage Messages</h1>
              <p style={{ fontSize: '13px', color: 'rgba(28,18,8,0.5)', marginBottom: '28px' }}>Manage the mayor message and partner voices shown on the homepage.</p>

              {pendingVoices.length > 0 && <div style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '18px', color: G, marginBottom: '16px' }}>Partner Voice Validation</h3>
                {pendingVoices.map(voice => <div key={voice.id} style={{ borderTop: '1px solid #e8dfc9', padding: '14px 0', display: 'flex', gap: '14px', alignItems: 'center' }}>
                  {voice.photo ? <img src={voice.photo} alt="Voice profile" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} /> : <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: PARCH, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{voice.flag}</div>}
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 600, color: G }}>{voice.name} · {voice.role}</div><div style={{ fontSize: '12px', color: 'rgba(28,18,8,0.55)' }}>{voice.city}</div><div style={{ fontSize: '13px', fontStyle: 'italic', marginTop: '4px' }}>{voice.quote}</div></div>
                  <div style={{ display: 'flex', gap: '6px' }}><button onClick={() => handleValidateVoice(voice, true)} style={{ backgroundColor: '#166534', color: 'white', border: 'none', padding: '7px 12px', cursor: 'pointer' }}>Approve</button><button onClick={() => handleValidateVoice(voice, false)} style={{ backgroundColor: '#991b1b', color: 'white', border: 'none', padding: '7px 12px', cursor: 'pointer' }}>Reject</button></div>
                </div>)}
              </div>}

              <div style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '18px', color: G, marginBottom: '6px' }}>Homepage Statistics</h3>
                <p style={{ fontSize: '12px', color: 'rgba(28,18,8,0.5)', marginBottom: '16px' }}>Update the three statistics shown in the homepage ribbon.</p>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {homepageMessages.stats.map((stat, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 1fr', gap: '10px' }}>
                      <input type="text" inputMode="numeric" pattern="[0-9]*" value={stat.num} onKeyDown={e => { if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'].includes(e.key)) e.preventDefault() }} onChange={e => setHomepageMessages(prev => ({ ...prev, stats: prev.stats.map((item, itemIndex) => itemIndex === index ? { ...item, num: e.target.value.replace(/\D/g, '') } : item) }))} placeholder="Number" aria-label={`Statistic ${index + 1} number`} style={{ padding: '10px 12px', border: '1px solid #e8dfc9', backgroundColor: PARCH, fontSize: '13px' }} />
                      <input value={stat.label} onChange={e => setHomepageMessages(prev => ({ ...prev, stats: prev.stats.map((item, itemIndex) => itemIndex === index ? { ...item, label: e.target.value } : item) }))} placeholder="Label" style={{ padding: '10px 12px', border: '1px solid #e8dfc9', backgroundColor: PARCH, fontSize: '13px' }} />
                      <input value={stat.sub} onChange={e => setHomepageMessages(prev => ({ ...prev, stats: prev.stats.map((item, itemIndex) => itemIndex === index ? { ...item, sub: e.target.value } : item) }))} placeholder="Description" style={{ padding: '10px 12px', border: '1px solid #e8dfc9', backgroundColor: PARCH, fontSize: '13px' }} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '18px', color: G, marginBottom: '16px' }}>Mayor's Message</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <textarea value={homepageMessages.mayor.quote} onChange={e => setHomepageMessages(prev => ({ ...prev, mayor: { ...prev.mayor, quote: e.target.value } }))} rows={5} placeholder="Message quote" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8dfc9', backgroundColor: PARCH, fontSize: '13px', boxSizing: 'border-box', resize: 'vertical' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input value={homepageMessages.mayor.name} onChange={e => setHomepageMessages(prev => ({ ...prev, mayor: { ...prev.mayor, name: e.target.value } }))} placeholder="Name / title" style={{ padding: '10px 12px', border: '1px solid #e8dfc9', backgroundColor: PARCH, fontSize: '13px' }} />
                    <input value={homepageMessages.mayor.period} onChange={e => setHomepageMessages(prev => ({ ...prev, mayor: { ...prev.mayor, period: e.target.value } }))} placeholder="Period" style={{ padding: '10px 12px', border: '1px solid #e8dfc9', backgroundColor: PARCH, fontSize: '13px' }} />
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '24px' }}>
                <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '18px', color: G, marginBottom: '16px' }}>Partner Voices</h3>
                <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
                  {homepageMessages.voices.map(voice => (
                    <div key={voice.id} style={{ border: '1px solid #e8dfc9', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 600, color: G }}>{voice.flag} {voice.city}</div>
                          <div style={{ fontSize: '12px', color: 'rgba(28,18,8,0.55)', marginTop: '4px' }}>{voice.name} · {voice.role}</div>
                          <div style={{ fontSize: '13px', color: 'rgba(28,18,8,0.7)', fontStyle: 'italic', marginTop: '8px', lineHeight: 1.5 }}>{voice.quote}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                          <button onClick={() => handleEditHomepageVoice(voice)} style={{ fontSize: '11px', padding: '5px 10px', backgroundColor: 'transparent', color: G, border: `1px solid ${G}`, cursor: 'pointer' }}>Edit</button>
                          <button onClick={() => handleDeleteHomepageVoice(voice.id)} style={{ fontSize: '11px', padding: '5px 10px', backgroundColor: '#991b1b', color: 'white', border: 'none', cursor: 'pointer' }}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid #e8dfc9', paddingTop: '20px', display: 'grid', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '12px' }}>
                    <input value={homepageVoiceForm.city} onChange={e => setHomepageVoiceForm(form => ({ ...form, city: e.target.value }))} placeholder="City and country" style={{ padding: '10px 12px', border: '1px solid #e8dfc9', backgroundColor: PARCH, fontSize: '13px' }} />
                    <input value={homepageVoiceForm.flag} onChange={e => setHomepageVoiceForm(form => ({ ...form, flag: e.target.value }))} placeholder="Flag" style={{ padding: '10px 12px', border: '1px solid #e8dfc9', backgroundColor: PARCH, fontSize: '13px' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input value={homepageVoiceForm.name} onChange={e => setHomepageVoiceForm(form => ({ ...form, name: e.target.value }))} placeholder="Person name" style={{ padding: '10px 12px', border: '1px solid #e8dfc9', backgroundColor: PARCH, fontSize: '13px' }} />
                    <input value={homepageVoiceForm.role} onChange={e => setHomepageVoiceForm(form => ({ ...form, role: e.target.value }))} placeholder="Role / title" style={{ padding: '10px 12px', border: '1px solid #e8dfc9', backgroundColor: PARCH, fontSize: '13px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Profile Photo (max 5 MB)</label>
                    <input type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) readImageFile(file, dataUrl => setHomepageVoiceForm(form => ({ ...form, photo: dataUrl }))) }} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8dfc9', backgroundColor: PARCH, fontSize: '13px', boxSizing: 'border-box' }} />
                    {homepageVoiceForm.photo && (
                      <div
                        onPointerDown={startVoiceDrag}
                        onPointerMove={moveVoiceDrag}
                        onPointerUp={() => setIsDraggingVoice(false)}
                        onPointerCancel={() => setIsDraggingVoice(false)}
                        style={{ width: '180px', aspectRatio: '1 / 1', marginTop: '10px', backgroundImage: `linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px), url(${homepageVoiceForm.photo})`, backgroundSize: '33.333% 33.333%, 33.333% 33.333%, cover', backgroundPosition: `center center, center center, ${voiceDragPosition.x}% ${voiceDragPosition.y}%`, backgroundRepeat: 'repeat, repeat, no-repeat', cursor: isDraggingVoice ? 'grabbing' : 'grab', border: `1px solid ${GOLD}`, touchAction: 'none' }}
                      />
                    )}
                    {homepageVoiceForm.photo && <div style={{ fontSize: '11px', color: 'rgba(28,18,8,0.5)', marginTop: '5px' }}>Geser foto di dalam kotak 1:1 untuk mengatur crop profil.</div>}
                  </div>
                  <textarea value={homepageVoiceForm.quote} onChange={e => setHomepageVoiceForm(form => ({ ...form, quote: e.target.value }))} rows={4} placeholder="Partner quote" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8dfc9', backgroundColor: PARCH, fontSize: '13px', boxSizing: 'border-box', resize: 'vertical' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleSaveHomepageVoice} style={{ backgroundColor: G, color: 'white', padding: '9px 18px', border: 'none', cursor: 'pointer', fontSize: '13px' }}>{homepageVoiceForm.id ? 'Update Voice' : 'Add Voice'}</button>
                    {homepageVoiceForm.id && <button onClick={() => setHomepageVoiceForm({ id: null, city: '', flag: '🌏', quote: '', name: '', role: '', photo: '', photoPosition: '50% 50%' })} style={{ backgroundColor: 'transparent', color: G, padding: '9px 18px', border: `1px solid ${G}`, cursor: 'pointer', fontSize: '13px' }}>Cancel Edit</button>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ PARTNER CITIES ═════════════════════ */}
          {tab === 'cities' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                  <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '26px', color: G, fontWeight: 500, marginBottom: '4px' }}>Partner Cities</h1>
                  <p style={{ fontSize: '13px', color: 'rgba(28,18,8,0.5)' }}>Manage the cities shown across the public website.</p>
                </div>
                <button onClick={() => { resetCityForm(); setCityFormOpen(true) }} style={{ backgroundColor: G, color: 'white', padding: '10px 20px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>+ Add Partner City</button>
              </div>

              {cityFormOpen && (
                <div style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '24px', marginBottom: '24px' }}>
                  <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '16px', color: G, fontWeight: 500, marginBottom: '16px' }}>{cityForm.id ? 'Edit Partner City' : 'Add Partner City'}</h3>
                  {imageUploadError && <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '10px 12px', fontSize: '12px', marginBottom: '16px' }}>{imageUploadError}</div>}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 80px 1fr', gap: '12px', marginBottom: '12px' }}>
                    <input value={cityForm.name} onChange={e => setCityForm(form => ({ ...form, name: e.target.value }))} placeholder="City name" style={{ padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', backgroundColor: PARCH }} />
                    <input value={cityForm.country} onChange={e => setCityForm(form => ({ ...form, country: e.target.value }))} placeholder="Country" style={{ padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', backgroundColor: PARCH }} />
                    <input value={cityForm.flag} onChange={e => setCityForm(form => ({ ...form, flag: e.target.value }))} placeholder="Flag" style={{ padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', backgroundColor: PARCH }} />
                    <input type="number" value={cityForm.year} onChange={e => setCityForm(form => ({ ...form, year: e.target.value }))} placeholder="Year" style={{ padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', backgroundColor: PARCH }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <input value={cityForm.population} onChange={e => setCityForm(form => ({ ...form, population: e.target.value }))} placeholder="Population" style={{ padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', backgroundColor: PARCH }} />
                    <input value={cityForm.area} onChange={e => setCityForm(form => ({ ...form, area: e.target.value }))} placeholder="Area" style={{ padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', backgroundColor: PARCH }} />
                    <input value={cityForm.timezone} onChange={e => setCityForm(form => ({ ...form, timezone: e.target.value }))} placeholder="Time zone" style={{ padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', backgroundColor: PARCH }} />
                  </div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cover Image (max 5 MB)</label>
                  <input type="file" accept="image/*" onChange={e => handleCityImageFile(e.target.files?.[0])} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', backgroundColor: PARCH, boxSizing: 'border-box', marginBottom: '12px' }} />
                  {cityForm.coverImage && (
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Drag to position the cover</label>
                      <div
                        onPointerDown={startImageDrag}
                        onPointerMove={moveImageDrag}
                        onPointerUp={finishImageDrag}
                        onPointerCancel={finishImageDrag}
                        style={{ aspectRatio: '16 / 5', width: '100%', backgroundImage: `linear-gradient(rgba(255,255,255,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.22) 1px, transparent 1px), url(${cityForm.coverImage})`, backgroundSize: '33.333% 50%, 33.333% 50%, cover', backgroundPosition: `center center, center center, ${cityForm.coverPosition}`, backgroundRepeat: 'repeat, repeat, no-repeat', cursor: isDraggingImage ? 'grabbing' : 'grab', border: `1px solid ${GOLD}`, touchAction: 'none', marginBottom: '12px' }}
                      />
                      <div style={{ fontSize: '11px', color: 'rgba(28,18,8,0.5)', marginBottom: '12px' }}>{Math.round(dragPosition.x)}% horizontal · {Math.round(dragPosition.y)}% vertical</div>
                    </div>
                  )}
                  <textarea value={cityForm.description} onChange={e => setCityForm(form => ({ ...form, description: e.target.value }))} rows={3} placeholder="Partnership description" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', backgroundColor: PARCH, boxSizing: 'border-box', resize: 'vertical', marginBottom: '12px' }} />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleSaveCity} style={{ backgroundColor: G, color: 'white', padding: '9px 20px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Save City</button>
                    <button onClick={resetCityForm} style={{ backgroundColor: 'transparent', color: 'rgba(28,18,8,0.5)', padding: '9px 20px', fontSize: '13px', border: '1px solid #e8dfc9', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gap: '12px' }}>
                {partnerCities.map(city => (
                  <div key={city.id} style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '28px' }}>{city.flag}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '17px', color: G }}>{city.name}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(28,18,8,0.5)', marginTop: '3px' }}>{city.country} · Partner since {city.year}</div>
                    </div>
                    <button onClick={() => handleEditCity(city)} style={{ fontSize: '12px', padding: '7px 14px', backgroundColor: 'transparent', color: G, border: `1px solid ${G}`, cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDeleteCity(city.id)} style={{ fontSize: '12px', padding: '7px 14px', backgroundColor: '#991b1b', color: 'white', border: 'none', cursor: 'pointer' }}>Delete</button>
                  </div>
                ))}
              </div>
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
                <button onClick={() => { setImageUploadError(''); setPersonnelFormOpen(true); setPersonnelForm({ id: null, name: '', title: '', leadershipLabel: '', country: personnelCountry, email: '', phone: '', bio: '', photo: '' }) }} style={{ backgroundColor: G, color: 'white', padding: '10px 20px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>+ Add Team Member</button>
              </div>

              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', borderBottom: '1px solid #e8dfc9', marginBottom: '24px' }}>
                {personnelCountries.map(country => (
                  <button
                    key={country}
                    onClick={() => setPersonnelCountry(country)}
                    style={{ padding: '10px 16px', whiteSpace: 'nowrap', fontSize: '12px', fontWeight: 600, color: personnelCountry === country ? G : 'rgba(28,18,8,0.5)', backgroundColor: personnelCountry === country ? '#efe5cf' : 'transparent', border: 'none', borderBottom: personnelCountry === country ? `2px solid ${GOLD}` : '2px solid transparent', cursor: 'pointer' }}
                  >
                    {country}
                  </button>
                ))}
              </div>

              {personnelFormOpen && (
                <div style={{ backgroundColor: 'white', border: '1px solid #e8dfc9', padding: '24px', marginBottom: '24px' }}>
                  <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '16px', color: G, fontWeight: 500, marginBottom: '16px' }}>{personnelForm.id ? 'Edit Team Member' : 'Add Team Member'}</h3>
                  {imageUploadError && <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '10px 12px', fontSize: '12px', marginBottom: '16px' }}>{imageUploadError}</div>}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Country</label>
                      <select value={personnelForm.country} onChange={e => setPersonnelForm(f => ({ ...f, country: e.target.value }))} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box' }}>
                        {personnelCountries.map(country => <option key={country} value={country}>{country}</option>)}
                      </select>
                    </div>
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
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Profile Photo (max 5 MB)</label>
                      <input type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) readImageFile(file, dataUrl => setPersonnelForm(form => ({ ...form, photo: dataUrl }))) }} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: G, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Biography</label>
                      <textarea value={personnelForm.bio} onChange={e => setPersonnelForm(f => ({ ...f, bio: e.target.value }))} rows={4} placeholder="Short bio..." style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8dfc9', fontSize: '13px', outline: 'none', backgroundColor: PARCH, boxSizing: 'border-box', resize: 'vertical' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleSavePersonnel} style={{ backgroundColor: G, color: 'white', padding: '9px 20px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Save</button>
                    <button onClick={() => { setPersonnelFormOpen(false); setPersonnelForm({ id: null, name: '', title: '', leadershipLabel: '', country: personnelCountry, email: '', phone: '', bio: '', photo: '' }) }} style={{ backgroundColor: 'transparent', color: 'rgba(28,18,8,0.5)', padding: '9px 20px', fontSize: '13px', border: '1px solid #e8dfc9', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gap: '16px' }}>
                {visiblePersonnel.map((p, i) => (
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
                      <button onClick={() => { setPersonnelForm({ id: p.id, name: p.name, title: p.title, leadershipLabel: p.leadershipLabel, country: p.country, email: p.email, phone: p.phone, bio: p.bio, photo: p.photo }); setPersonnelFormOpen(true) }} style={{ fontSize: '12px', padding: '7px 14px', backgroundColor: 'transparent', color: G, border: `1px solid ${G}`, cursor: 'pointer' }}>Edit Profil</button>
                      <button onClick={() => handleDeletePersonnel(p.id)} style={{ fontSize: '12px', padding: '7px 14px', backgroundColor: '#991b1b', color: 'white', border: 'none', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>

              <div onClick={() => { setImageUploadError(''); setPersonnelFormOpen(true); setPersonnelForm({ id: null, name: '', title: '', leadershipLabel: '', country: personnelCountry, email: '', phone: '', bio: '', photo: '' }) }} style={{ marginTop: '24px', backgroundColor: 'white', border: '1px dashed #e8dfc9', padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
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
