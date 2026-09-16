import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage from './pages/Landing'
import PartnerCityPage from './pages/PartnerCity'
import Portal from './pages/Portal'
import AdminDashboard from './pages/Admin'
import { adminUsers as initialUsers, contentItems as initialContentItems, foreignRelationsPersonnel as initialPersonnel, partnerCities as initialPartnerCities, proposals as initialProposals, roles as initialRoles } from './data/mock'
import type { ContentItem, HomepageMessages, PendingHomepageVoice } from './data/mock'
import { homepageMessages as initialHomepageMessages } from './data/mock'

export type Page = 'landing' | 'partner-city' | 'portal' | 'admin'

export type AuthUser = {
  id: number
  name: string
  email: string
  role: 'admin' | 'foreign-rep' | 'editor'
  city: string
  photo?: string
  permissions?: string[]
} | null

function getStored<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored) as T : fallback
  } catch {
    return fallback
  }
}

function storeValue<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export default function App() {
  const [page, setPage] = useState<Page>('landing')
  const [selectedCity, setSelectedCity] = useState<string>('kyoto')
  const [auth, setAuth] = useState<AuthUser>(() => getStored<AuthUser>('siskota.auth', null))
  const [partnerCities, setPartnerCities] = useState(() => getStored('siskota.partnerCities', initialPartnerCities))
  const [contentItems, setContentItems] = useState<ContentItem[]>(() => getStored('siskota.contentItems', initialContentItems))
  const [personnel, setPersonnel] = useState(() => getStored('siskota.personnel', initialPersonnel))
  const [proposals, setProposals] = useState(() => getStored('siskota.proposals', initialProposals))
  const [users, setUsers] = useState(() => getStored('siskota.users', initialUsers))
  const [roles, setRoles] = useState(() => getStored('siskota.roles', initialRoles))
  const [pendingVoices, setPendingVoices] = useState<PendingHomepageVoice[]>(() => getStored('siskota.pendingVoices', []))
  const [homepageMessages, setHomepageMessages] = useState<HomepageMessages>(() => {
    const stored = getStored<Partial<HomepageMessages>>('siskota.homepageMessages', {})
    return {
      ...initialHomepageMessages,
      ...stored,
      mayor: { ...initialHomepageMessages.mayor, ...stored.mayor },
      voices: stored.voices ?? initialHomepageMessages.voices,
      stats: (stored.stats ?? initialHomepageMessages.stats).map(stat => ({
        ...stat,
        num: stat.num.replace(/\D/g, ''),
        suffix: stat.suffix ?? (stat.num.includes('+') ? '+' : ''),
      })),
    }
  })

  useEffect(() => { storeValue('siskota.partnerCities', partnerCities) }, [partnerCities])
  useEffect(() => { storeValue('siskota.contentItems', contentItems) }, [contentItems])
  useEffect(() => { storeValue('siskota.personnel', personnel) }, [personnel])
  useEffect(() => { storeValue('siskota.proposals', proposals) }, [proposals])
  useEffect(() => { storeValue('siskota.users', users) }, [users])
  useEffect(() => { storeValue('siskota.roles', roles) }, [roles])
  useEffect(() => { storeValue('siskota.auth', auth) }, [auth])
  useEffect(() => { storeValue('siskota.pendingVoices', pendingVoices) }, [pendingVoices])
  useEffect(() => { storeValue('siskota.homepageMessages', homepageMessages) }, [homepageMessages])

  const navigate = (p: Page, cityId?: string) => {
    setPage(p)
    if (cityId) setSelectedCity(cityId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#f7f2ea', color: '#1c1208' }}>
      <Navbar page={page} auth={auth} navigate={navigate} setAuth={setAuth} />
      <main>
        {page === 'landing' && <LandingPage navigate={navigate} partnerCities={partnerCities} contentItems={contentItems} personnel={personnel} homepageMessages={homepageMessages} />}
        {page === 'partner-city' && <PartnerCityPage cityId={selectedCity} navigate={navigate} partnerCities={partnerCities} contentItems={contentItems} />}
        {page === 'portal' && <Portal auth={auth} setAuth={setAuth} navigate={navigate} proposals={proposals} setProposals={setProposals} partnerCities={partnerCities} users={users} setUsers={setUsers} roles={roles} pendingVoices={pendingVoices} setPendingVoices={setPendingVoices} />}
        {page === 'admin' && <AdminDashboard auth={auth} navigate={navigate} partnerCities={partnerCities} setPartnerCities={setPartnerCities} contentItems={contentItems} setContentItems={setContentItems} personnel={personnel} setPersonnel={setPersonnel} proposals={proposals} setProposals={setProposals} users={users} setUsers={setUsers} roles={roles} setRoles={setRoles} homepageMessages={homepageMessages} setHomepageMessages={setHomepageMessages} pendingVoices={pendingVoices} setPendingVoices={setPendingVoices} />}
      </main>
      {page !== 'admin' && <Footer navigate={navigate} />}
    </div>
  )
}
