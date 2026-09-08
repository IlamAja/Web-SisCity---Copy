import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage from './pages/Landing'
import PartnerCityPage from './pages/PartnerCity'
import Portal from './pages/Portal'
import AdminDashboard from './pages/Admin'
import { contentItems as initialContentItems, partnerCities as initialPartnerCities } from './data/mock'
import type { ContentItem } from './data/mock'

export type Page = 'landing' | 'partner-city' | 'portal' | 'admin'

export type AuthUser = {
  id: number
  name: string
  email: string
  role: 'admin' | 'foreign-rep' | 'editor'
  city: string
} | null

export default function App() {
  const [page, setPage] = useState<Page>('landing')
  const [selectedCity, setSelectedCity] = useState<string>('kyoto')
  const [auth, setAuth] = useState<AuthUser>(null)
  const [partnerCities, setPartnerCities] = useState(initialPartnerCities)
  const [contentItems, setContentItems] = useState<ContentItem[]>(initialContentItems)

  const navigate = (p: Page, cityId?: string) => {
    setPage(p)
    if (cityId) setSelectedCity(cityId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#f7f2ea', color: '#1c1208' }}>
      <Navbar page={page} auth={auth} navigate={navigate} setAuth={setAuth} />
      <main>
        {page === 'landing' && <LandingPage navigate={navigate} partnerCities={partnerCities} contentItems={contentItems} />}
        {page === 'partner-city' && <PartnerCityPage cityId={selectedCity} navigate={navigate} partnerCities={partnerCities} />}
        {page === 'portal' && <Portal auth={auth} setAuth={setAuth} navigate={navigate} />}
        {page === 'admin' && <AdminDashboard auth={auth} navigate={navigate} partnerCities={partnerCities} setPartnerCities={setPartnerCities} contentItems={contentItems} setContentItems={setContentItems} />}
      </main>
      {page !== 'admin' && <Footer navigate={navigate} />}
    </div>
  )
}
