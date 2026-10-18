import { useState } from 'react'
import type { Page, AuthUser } from '../App'
import { canAccessAdminDashboard, canAccessContent } from '../utils/permissions'
import type { RoleLike } from '../utils/permissions'

interface Props {
  page: Page
  auth: AuthUser
  navigate: (p: Page, cityId?: string, articleId?: number) => void
  setAuth: (u: AuthUser) => void
  roles?: RoleLike[]
}

export default function Navbar({ page, auth, navigate, setAuth, roles }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    setAuth(null)
    navigate('landing')
    setMenuOpen(false)
  }

  const navLink = (label: string, target: Page, sub?: string) => (
    <button
      onClick={() => { navigate(target, sub); setMenuOpen(false) }}
      className={`text-sm font-medium transition-colors hover:text-jogja-gold ${page === target ? 'text-jogja-gold' : 'text-white/80'}`}
    >
      {label}
    </button>
  )

  return (
    <nav style={{ backgroundColor: '#1a4030', fontFamily: 'Inter, system-ui, sans-serif' }} className="sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <button onClick={() => navigate('landing')} className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ backgroundColor: '#c9963a' }}>
            <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#1a4030', fontSize: '14px', fontWeight: 700 }}>J</span>
          </div>
          <div className="text-left">
            <div style={{ color: 'white', fontFamily: 'Fraunces, Georgia, serif', fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1 }}>SISKOTA</div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1, marginTop: '2px' }}>Yogyakarta</div>
          </div>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLink('Home', 'landing')}
          {navLink('Partner Cities', 'partner-city', 'kyoto')}
          <button
            onClick={() => { document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' }); if (page !== 'landing') navigate('landing'); setMenuOpen(false) }}
            className="text-sm font-medium text-white/80 hover:text-jogja-gold transition-colors"
          >
            Gallery
          </button>
          <button
            onClick={() => { document.getElementById('foreign-relations')?.scrollIntoView({ behavior: 'smooth' }); if (page !== 'landing') navigate('landing'); setMenuOpen(false) }}
            className="text-sm font-medium text-white/80 hover:text-jogja-gold transition-colors"
          >
            Team
          </button>
        </div>

        {/* Auth section */}
        {/* Auth section */}
        <div className="hidden md:flex items-center gap-3">
          {auth ? (
            <>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: auth.role === 'admin' ? '#c9963a' : '#2a5d47', color: 'white' }}>
                  {auth.name[0]}
                </div>
                <span>{auth.name.split(' ')[0]}</span>
                <span className="text-white/30">·</span>
                <span className="text-xs font-medium" style={{ color: auth.role === 'admin' ? '#e0ac56' : '#a7f3d0' }}>
                  {roles?.find(r => r.name === auth.role)?.label || (auth.role === 'admin' ? 'Admin' : auth.role === 'foreign-rep' ? 'Partner' : 'Editor')}
                </span>
              </div>
<<<<<<< HEAD
              {canAccessAdminDashboard(auth, roles) && (
=======
              {(auth.role === 'admin' || auth.permissions?.includes('Konfigurasi Sistem')) && (
>>>>>>> b05ce159409d9220f4915afa478d7dff8341532b
                <button onClick={() => navigate('admin')} className="text-xs px-3 py-1.5 rounded-sm font-medium transition-colors" style={{ backgroundColor: page === 'admin' ? '#c9963a' : 'rgba(201,150,58,0.2)', color: '#e0ac56' }}>
                  {auth.role === 'admin' ? 'Admin Dashboard' : 'Content Studio'}
                </button>
              )}
              <button onClick={handleLogout} className="text-xs text-white/40 hover:text-white/70 transition-colors">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('admin')} className="text-sm px-4 py-2 font-medium rounded-sm transition-colors" style={{ backgroundColor: '#c9963a', color: '#1a4030' }}>
                Admin Access
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white/70 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t" style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: '#0f2a1f' }}>
          <div className="px-6 py-4 flex flex-col gap-4">
            <button onClick={() => { navigate('landing'); setMenuOpen(false) }} className="text-sm text-white/80 text-left">Home</button>
            <button onClick={() => { navigate('partner-city', 'kyoto'); setMenuOpen(false) }} className="text-sm text-white/80 text-left">Partner Cities</button>
<<<<<<< HEAD
            {canAccessAdminDashboard(auth, roles) && (
              <button onClick={() => { navigate('admin'); setMenuOpen(false) }} className="text-sm text-left font-medium" style={{ color: '#e0ac56' }}>
                {auth?.role === 'admin' ? 'Admin Dashboard' : 'Content Studio'}
              </button>
=======
            {(auth?.role === 'admin' || auth?.permissions?.includes('Konfigurasi Sistem')) && (
              <button onClick={() => { navigate('admin'); setMenuOpen(false) }} className="text-sm text-left" style={{ color: '#e0ac56' }}>Admin Dashboard</button>
>>>>>>> b05ce159409d9220f4915afa478d7dff8341532b
            )}
            {auth ? (
              <button onClick={handleLogout} className="text-sm text-white/40 text-left">Logout</button>
            ) : (
              <button onClick={() => { navigate('admin'); setMenuOpen(false) }} className="text-sm text-left" style={{ color: '#c9963a' }}>Admin Access</button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
