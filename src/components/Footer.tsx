import type { Page } from '../App'

interface Props {
  navigate: (p: Page, cityId?: string) => void
}

export default function Footer({ navigate }: Props) {
  return (
    <footer style={{ backgroundColor: '#0f2a1f', color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-sm flex items-center justify-center" style={{ backgroundColor: '#c9963a' }}>
              <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#1a4030', fontSize: '16px', fontWeight: 700 }}>J</span>
            </div>
            <div>
              <div style={{ color: 'white', fontFamily: 'Fraunces, Georgia, serif', fontSize: '16px', fontWeight: 600 }}>SISKOTA Yogyakarta</div>
              <div style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Sister City Information System</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed max-w-sm mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
            The official Yogyakarta City platform for managing and publishing information on international sister-city collaboration and partnerships.
          </p>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <div>International Affairs Division</div>
            <div>Yogyakarta City Government</div>
            <div>Jl. Kenari No. 56, Yogyakarta 55165</div>
            <div className="mt-2">humas@jogjakota.go.id · +62 274 515 100</div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: '#c9963a' }}>Navigation</h4>
          <ul className="space-y-3 text-sm">
            {[
              { label: 'Home', action: () => navigate('landing') },
              { label: 'Partner Cities', action: () => navigate('partner-city', 'kyoto') },
              { label: 'Gallery', action: () => navigate('landing') },
              { label: 'Team', action: () => navigate('landing') },
            ].map(item => (
              <li key={item.label}>
                <button onClick={item.action} className="hover:text-white transition-colors text-left" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: '#c9963a' }}>Sister Cities</h4>
          <ul className="space-y-3 text-sm">
            {[
              { label: '🇯🇵 Kyoto, Jepang', id: 'kyoto' },
              { label: '🇳🇱 Leiden, Belanda', id: 'leiden' },
              { label: '🇰🇷 Gwangju, Korsel', id: 'gwangju' },
              { label: '🇩🇪 Tübingen, Jerman', id: 'tubingen' },
              { label: '🇳🇿 Wellington, NZ', id: 'wellington' },
              { label: '🇨🇳 Haikou, China', id: 'haikou' },
              { label: '🇨🇿 Hluboká nad Vltavou, Ceko', id: 'hluboka-nad-vltavou' },
            ].map(c => (
              <li key={c.id}>
                <button onClick={() => navigate('partner-city', c.id)} className="hover:text-white transition-colors text-left" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © 2024 Yogyakarta City Government. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
