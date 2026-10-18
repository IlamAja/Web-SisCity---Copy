import type { AuthUser } from '../App'

export interface RoleLike {
  name: string
  label?: string
  color?: string
  permissions?: string[]
}

const CONTENT_KEYWORDS = [
  'artikel',
  'article',
  'konten',
  'content',
  'media',
  'video',
  'foto',
  'photo',
  'galeri',
  'gallery',
]

const SPECIFIC_CONTENT_PERMISSIONS = [
  'Kelola Konten (Artikel, Foto, Video)',
  'Create and edit articles',
  'Upload and manage media files',
  'Add video embeds',
  'Access public galleries and articles',
  'Lihat Galeri & Artikel',
]

export function getUserPermissions(user: AuthUser, rolesList?: RoleLike[]): string[] {
  if (!user) return []
  const perms = new Set<string>(user.permissions || [])

  if (rolesList && user.role) {
    const matchedRole = rolesList.find(r => r.name === user.role)
    if (matchedRole?.permissions) {
      matchedRole.permissions.forEach(p => perms.add(p))
    }
  }

  return Array.from(perms)
}

/**
 * Memeriksa apakah suatu user / role memiliki akses ke artikel dan konten lainnya
 */
export function canAccessContent(user: AuthUser, rolesList?: RoleLike[]): boolean {
  if (!user) return false
  if (user.role === 'admin' || user.role === 'editor') return true

  const perms = getUserPermissions(user, rolesList)

  return perms.some(p => {
    if (SPECIFIC_CONTENT_PERMISSIONS.includes(p)) return true
    const lower = p.toLowerCase()
    return CONTENT_KEYWORDS.some(kw => lower.includes(kw))
  })
}

/**
 * Memeriksa apakah user memiliki permission tertentu (pencarian pola fleksibel)
 */
export function hasPermission(user: AuthUser, patterns: string[], rolesList?: RoleLike[]): boolean {
  if (!user) return false
  if (user.role === 'admin') return true

  const perms = getUserPermissions(user, rolesList)
  return perms.some(p => {
    const lower = p.toLowerCase()
    return patterns.some(pattern => lower.includes(pattern.toLowerCase()))
  })
}

/**
 * Memeriksa apakah user memiliki akses ke Admin Dashboard
 */
export function canAccessAdminDashboard(user: AuthUser, rolesList?: RoleLike[]): boolean {
  if (!user) return false
  if (user.role === 'admin' || user.role === 'editor') return true
  if (canAccessContent(user, rolesList)) return true

  return hasPermission(user, [
    'konfigurasi sistem',
    'kelola pengguna',
    'peran',
    'role',
    'verifikasi proposal',
    'personel',
    'laporan',
    'analitik',
    'reporting',
  ], rolesList)
}
