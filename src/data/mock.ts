export type PartnerArticle = {
  id: number
  title: string
  image: string
  date: string
  tags: string[]
  excerpt: string
}

export type PartnerCity = {
  id: string
  name: string
  country: string
  flag: string
  year: number
  status: string
  statusLabel: string
  description: string
  population: string
  area: string
  timezone: string
  contactPerson: string
  contactOrg: string
  coverImage: string
  thumbImage: string
  accentColor: string
  tags: string[]
  milestones: { year: number; title: string; desc: string }[]
  articles: PartnerArticle[]
}

export const partnerCities: PartnerCity[] = [
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Jepang',
    flag: '🇯🇵',
    year: 1985,
    status: 'active',
    statusLabel: 'Aktif',
    description: 'Mitra tertua sejak 1985. Kerja sama berfokus pada pelestarian cagar budaya, tata kota bersejarah, pendidikan, serta pertukaran seni dan pelajar.',
    population: '1,4 juta',
    area: '827 km²',
    timezone: 'JST (UTC+9)',
    contactPerson: 'Director, International Affairs Bureau',
    contactOrg: 'Kyoto City Hall',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1400&h=700&fit=crop&auto=format',
    thumbImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&h=300&fit=crop&auto=format',
    accentColor: '#c0392b',
    tags: ['Budaya', 'Warisan', 'Seni', 'Pendidikan'],
    milestones: [
      { year: 1985, title: 'Perjanjian Kota Kembar', desc: 'Kerja sama resmi dimulai antara Yogyakarta dan Kyoto dalam upaya memperkuat hubungan budaya dan pendidikan.' },
      { year: 2019, title: 'Pertukaran Warisan Budaya', desc: 'Program bersama tentang pelestarian cagar budaya dan penguatan pertukaran seni serta pelajar digelar.' },
    ],
    articles: [],
  },
  {
    id: 'hue',
    name: 'Hue',
    country: 'Vietnam',
    flag: '🇻🇳',
    year: 2014,
    status: 'active',
    statusLabel: 'Aktif',
    description: 'Berfokus pada konservasi warisan budaya dan promosi pariwisata berbasis tradisi sebagai sesama kota bersejarah bekas ibu kota kerajaan.',
    population: '1,3 juta',
    area: '4.947 km²',
    timezone: 'ICT (UTC+7)',
    contactPerson: 'Director, International Relations Office',
    contactOrg: 'Hue City People\'s Committee',
    coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1400&h=700&fit=crop&auto=format',
    thumbImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=500&h=300&fit=crop&auto=format',
    accentColor: '#bf7a2d',
    tags: ['Warisan', 'Pariwisata', 'Sejarah', 'Kebudayaan'],
    milestones: [
      { year: 2014, title: 'Kerja Sama Kota Bersejarah', desc: 'Perjanjian kerja sama dimulai untuk memperkuat hubungan budaya antara dua kota kerajaan.' },
      { year: 2022, title: 'Promosi Tradisi dan Pariwisata', desc: 'Program promosi warisan budaya dan pariwisata berbasis sejarah dilaksanakan bersama.' },
    ],
    articles: [],
  },
  {
    id: 'gangbuk-seoul',
    name: 'Gangbuk-gu, Seoul',
    country: 'Korea Selatan',
    flag: '🇰🇷',
    year: 2017,
    status: 'active',
    statusLabel: 'Aktif',
    description: 'Kerja sama mencakup pertukaran kebudayaan, program pengembangan kepemudaan, serta promosi pariwisata dan ekonomi kreatif.',
    population: '430 ribu',
    area: '23,4 km²',
    timezone: 'KST (UTC+9)',
    contactPerson: 'Head of International Exchange Division',
    contactOrg: 'Gangbuk-gu Office',
    coverImage: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=1400&h=700&fit=crop&auto=format',
    thumbImage: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=500&h=300&fit=crop&auto=format',
    accentColor: '#9b5de5',
    tags: ['Kebudayaan', 'Pemuda', 'Pariwisata', 'Kreatif'],
    milestones: [
      { year: 2017, title: 'MOU Pertukaran Budaya', desc: 'Kerja sama formal mulai digulirkan untuk pertukaran budaya dan pemuda.' },
      { year: 2023, title: 'Ekonomi Kreatif dan Pariwisata', desc: 'Kolaborasi fokus pada promosi kota, ekonomi kreatif, serta penguatan hubungan sosial-budaya.' },
    ],
    articles: [],
  },
  {
    id: 'hefei',
    name: 'Hefei',
    country: 'Tiongkok',
    flag: '🇨🇳',
    year: 2016,
    status: 'active',
    statusLabel: 'Aktif',
    description: 'Berfokus pada penguatan sektor ekonomi, perdagangan, investasi, pengembangan teknologi, dan pendidikan.',
    population: '5,3 juta',
    area: '11.000 km²',
    timezone: 'CST (UTC+8)',
    contactPerson: 'Director, Foreign Affairs Bureau',
    contactOrg: 'Hefei Municipal Government',
    coverImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1400&h=700&fit=crop&auto=format',
    thumbImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&h=300&fit=crop&auto=format',
    accentColor: '#d97706',
    tags: ['Ekonomi', 'Teknologi', 'Pendidikan', 'Perdagangan'],
    milestones: [
      { year: 2016, title: 'Kerja Sama Ekonomi', desc: 'Hubungan kerja sama dimulai pada sektor perdagangan, investasi, dan pengembangan ekonomi.' },
      { year: 2023, title: 'Pendidikan dan Teknologi', desc: 'Program pertukaran pendidikan serta inovasi teknologi menjadi fokus baru dalam kemitraan.' },
    ],
    articles: [],
  },
  {
    id: 'commewijne',
    name: 'Commewijne',
    country: 'Suriname',
    flag: '🇸🇷',
    year: 2015,
    status: 'active',
    statusLabel: 'Aktif',
    description: 'Memiliki ikatan sejarah masyarakat Jawa di Suriname, dengan fokus kerja sama pada pertukaran seni budaya dan sektor pertanian.',
    population: '32 ribu',
    area: '2.352 km²',
    timezone: 'SRT (UTC-3)',
    contactPerson: 'District Coordination Officer',
    contactOrg: 'Commewijne District Government',
    coverImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&h=700&fit=crop&auto=format',
    thumbImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&h=300&fit=crop&auto=format',
    accentColor: '#16a34a',
    tags: ['Sejarah', 'Budaya', 'Pertanian', 'Jawa Suriname'],
    milestones: [
      { year: 2015, title: 'Hubungan Budaya', desc: 'Kemitraan dibangun berdasarkan sejarah dan hubungan masyarakat Jawa di Suriname.' },
      { year: 2021, title: 'Seni dan Pertanian', desc: 'Program pertukaran seni budaya serta penguatan sektor pertanian dilanjutkan.' },
    ],
    articles: [],
  },
  {
    id: 'paramaribo',
    name: 'Paramaribo',
    country: 'Suriname',
    flag: '🇸🇷',
    year: 2012,
    status: 'active',
    statusLabel: 'Aktif',
    description: 'Ibu kota Suriname yang bekerja sama dalam pengembangan tata kota, seni pertunjukan, dan penguatan kebudayaan.',
    population: '240 ribu',
    area: '182 km²',
    timezone: 'SRT (UTC-3)',
    contactPerson: 'City International Affairs Officer',
    contactOrg: 'Paramaribo City Government',
    coverImage: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1400&h=700&fit=crop&auto=format',
    thumbImage: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=500&h=300&fit=crop&auto=format',
    accentColor: '#0891b2',
    tags: ['Tata Kota', 'Seni Pertunjukan', 'Budaya', 'Urban'],
    milestones: [
      { year: 2012, title: 'Kemitraan Kota Ibu Kota', desc: 'Kerja sama ditandatangani untuk memperkuat hubungan kota di sektor kebudayaan dan tata kota.' },
      { year: 2023, title: 'Kebudayaan dan Tata Kelola', desc: 'Kolaborasi berlanjut pada seni pertunjukan, tata kelola kota, dan promosi budaya lokal.' },
    ],
    articles: [],
  },
  {
    id: 'baalbek',
    name: 'Baalbek',
    country: 'Lebanon',
    flag: '🇱🇧',
    year: 2018,
    status: 'active',
    statusLabel: 'Aktif',
    description: 'Berfokus pada tata kelola kota bersejarah, pelestarian situs cagar budaya, dan promosi pariwisata warisan dunia.',
    population: '120 ribu',
    area: '3.000 km²',
    timezone: 'EET (UTC+2)',
    contactPerson: 'Municipal Heritage Officer',
    contactOrg: 'Baalbek Municipality',
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1400&h=700&fit=crop&auto=format',
    thumbImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&h=300&fit=crop&auto=format',
    accentColor: '#a16207',
    tags: ['Warisan', 'Pariwisata', 'Sejarah', 'Kota Tua'],
    milestones: [
      { year: 2018, title: 'Kesepakatan Pelestarian', desc: 'Kerja sama fokus pada tata kelola kota bersejarah dan pelestarian situs budaya.' },
      { year: 2024, title: 'Pariwisata Warisan Dunia', desc: 'Promosi objek warisan dan penguatan tata kelola pariwisata dilakukan bersama.' },
    ],
    articles: [],
  },
  {
    id: 'hluboka-nad-vltavou',
    name: 'Hluboká nad Vltavou',
    country: 'Ceko',
    flag: '🇨🇿',
    year: 2024,
    status: 'active',
    statusLabel: 'Aktif',
    description: 'Mitra kerja sama yang berfokus pada promosi pariwisata, seni budaya, pemberdayaan UMKM, dan pertukaran pemuda.',
    population: '15 ribu',
    area: '18 km²',
    timezone: 'CET (UTC+1)',
    contactPerson: 'Municipal International Cooperation Coordinator',
    contactOrg: 'Town of Hluboká nad Vltavou',
    coverImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1400&h=700&fit=crop&auto=format',
    thumbImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=500&h=300&fit=crop&auto=format',
    accentColor: '#0f766e',
    tags: ['Pariwisata', 'Seni Budaya', 'UMKM', 'Pemuda'],
    milestones: [
      { year: 2024, title: 'Pembentukan Kemitraan Baru', desc: 'Kerja sama formal dimulai dengan fokus pada pariwisata, budaya, dan pemberdayaan UMKM.' },
      { year: 2024, title: 'Pertukaran Pemuda dan Budaya', desc: 'Kolaborasi awal diarahkan pada promosi budaya, pertukaran pemuda, dan penguatan ekonomi kreatif.' },
    ],
    articles: [],
  },
]

export const foreignRelationsPersonnel = [
  {
    id: 1,
    name: 'Bambang Wijayanto',
    role: 'Head of Partnership Affairs',
    leadershipLabel: 'Head of Division',
    title: 'Head of Foreign Relations Division',
    country: 'Indonesia',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&auto=format&face=center',
    email: 'bambang.w@jogjakota.go.id',
    phone: '+62 274 515 100 ext. 201',
    bio: 'Over 20 years of experience in city diplomacy and international cooperation. Leading Yogyakarta’s sister-city expansion across Asia and Europe.',
  },
  {
    id: 2,
    name: 'Siti Rahayu Kusuma',
    role: 'International Cooperation Lead',
    leadershipLabel: '',
    title: 'Head of International Cooperation Sub-Division',
    country: 'Indonesia',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&auto=format',
    email: 'siti.rahayu@jogjakota.go.id',
    phone: '+62 274 515 100 ext. 202',
    bio: 'Specialist in multilateral city diplomacy with a focus on cultural and academic exchange. Managing day-to-day coordination with the partner city network.',
  },
  {
    id: 3,
    name: 'Eko Prasetyo',
    role: 'International Cooperation Analyst',
    leadershipLabel: '',
    title: 'International Cooperation Analyst',
    country: 'Indonesia',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&auto=format',
    email: 'eko.prasetyo@jogjakota.go.id',
    phone: '+62 274 515 100 ext. 203',
    bio: 'Handles proposal evaluation, partnership documentation, and collaboration coordination with partner cities across the Asia-Pacific region.',
  },
  {
    id: 4,
    name: 'Anisa Putri Wulandari',
    role: 'Protocol and Communications Officer',
    leadershipLabel: '',
    title: 'Protocol & Public Relations Staff',
    country: 'Indonesia',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&auto=format',
    email: 'anisa.putri@jogjakota.go.id',
    phone: '+62 274 515 100 ext. 204',
    bio: 'Coordinates official delegations, protocol matters, and public communication for international programs hosted by Yogyakarta.',
  },
  {
    id: 5,
    name: 'Agung Purbantoro',
    role: 'Cultural Diplomacy Consultant',
    leadershipLabel: '',
    title: 'Cultural Diplomacy Consultant',
    country: 'Indonesia',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format',
    email: 'agung.p@jogjakota.go.id',
    phone: '+62 274 515 100 ext. 205',
    bio: 'Serves as a cultural liaison and advisor for heritage-based international initiatives and public diplomacy programs.',
  },
]

export const galleryPhotos = [
  { id: 1, cityId: 'kyoto', src: 'https://images.unsplash.com/photo-1571086811602-bb82a42c46ae?w=800&h=500&fit=crop&auto=format', alt: 'Workshop batik bersama delegasi Kyoto', caption: 'Workshop Batik Bersama Delegasi Kyoto' },
  { id: 2, cityId: 'hue', src: 'https://images.unsplash.com/photo-1549921296-3b0f9a35af35?w=800&h=500&fit=crop&auto=format', alt: 'Pertunjukan budaya dalam program pertukaran Hue', caption: 'Pertukaran Pertunjukan Budaya Yogyakarta – Hue' },
  { id: 3, cityId: 'gangbuk-seoul', src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=500&fit=crop&auto=format', alt: 'Pertukaran pelajar Yogyakarta dan Gangbuk-gu', caption: 'Pertukaran Pelajar Yogyakarta – Gangbuk-gu, Seoul' },
  { id: 4, cityId: 'hefei', src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop&auto=format', alt: 'Pertemuan kerja sama teknologi dengan Hefei', caption: 'Forum Inovasi dan Teknologi Yogyakarta – Hefei' },
  { id: 5, cityId: 'commewijne', src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=500&fit=crop&auto=format', alt: 'Pertukaran budaya masyarakat Jawa Suriname', caption: 'Pertukaran Budaya Yogyakarta – Commewijne' },
  { id: 6, cityId: 'paramaribo', src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=500&fit=crop&auto=format', alt: 'Pertemuan delegasi kerja sama Paramaribo', caption: 'Pertemuan Delegasi Yogyakarta – Paramaribo' },
  { id: 7, cityId: 'baalbek', src: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&h=500&fit=crop&auto=format', alt: 'Program pelestarian budaya bersama Baalbek', caption: 'Program Pelestarian Warisan Budaya Yogyakarta – Baalbek' },
  { id: 8, cityId: 'hluboka-nad-vltavou', src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop&auto=format', alt: 'Forum pariwisata dan pemuda Hluboka', caption: 'Forum Pariwisata dan Pemuda Yogyakarta – Hluboká' },
]

export const proposals = [
  {
    id: 'PROP-2024-001',
    cityId: 'kyoto',
    city: 'Kyoto',
    country: 'Japan',
    flag: '🇯🇵',
    submittedBy: 'Tanaka Hiroshi',
    submittedAt: '2024-03-01',
    title: 'Digital Cultural Archive Expansion Project',
    category: 'Warisan Budaya',
    status: 'accepted' as const,
    description: 'Proposal untuk mengembangkan bersama platform arsip digital dwibahasa artefak budaya Yogyakarta dan Kyoto, didanai Japan Foundation.',
    objectives: 'Membuat portal web yang menampung 5.000+ foto, 200 video, dan 800 dokumen dari kedua kota, tersedia dalam Bahasa Indonesia, Jepang, dan Inggris.',
    budget: 'USD 280,000 (Japan Foundation Grant)',
    duration: '24 bulan',
    adminNote: 'Proposal disetujui. Alokasi anggaran telah dikonfirmasi. Silakan berkoordinasi dengan Drs. Bambang Wijayanto untuk penjadwalan rapat kickoff. Penandatanganan MOU direncanakan Juli 2024.',
    reviewedBy: 'Eko Prasetyo, S.IP.',
    reviewedAt: '2024-03-20',
  },
  {
    id: 'PROP-2024-002',
    cityId: 'wellington',
    city: 'Wellington',
    country: 'New Zealand',
    flag: '🇳🇿',
    submittedBy: 'Emma Thompson',
    submittedAt: '2024-04-10',
    title: 'Creative Cities Youth Film Exchange 2024',
    category: 'Industri Kreatif',
    status: 'pending' as const,
    description: 'Program residensi pembuat film usia 18–30 tahun secara resiprokal selama enam minggu di kedua kota.',
    objectives: 'Menghasilkan 4 film pendek kolaboratif sebagai output program, menampilkan perspektif budaya kedua kota.',
    budget: 'NZD 95,000 (Creative NZ + KJRI Auckland)',
    duration: '6 bulan',
    adminNote: null,
    reviewedBy: null,
    reviewedAt: null,
  },
  {
    id: 'PROP-2024-003',
    cityId: 'gwangju',
    city: 'Gwangju',
    country: 'South Korea',
    flag: '🇰🇷',
    submittedBy: 'Kim Jae-won',
    submittedAt: '2024-02-15',
    title: 'Urban Mural Trails Network',
    category: 'Pengembangan Kota',
    status: 'rejected' as const,
    description: 'Proposal untuk merancang bersama jalur mural urban yang saling terhubung di kedua kota sebagai bagian dari inisiatif Gwangju Human Rights Award.',
    objectives: 'Menciptakan 20 titik mural bertema HAM dan keberagaman di sepanjang 3 koridor kota di masing-masing kota.',
    budget: 'USD 450,000',
    duration: '18 bulan',
    adminNote: 'Proposal ditolak pada tahap ini. Anggaran yang diusulkan (USD 450.000) melebihi batas dana kerjasama kota kembar kami saat ini. Kami menyarankan pengajuan ulang dengan pendekatan bertahap, dengan Fase 1 dibatasi USD 120.000. Pengajuan ulang diharapkan sebelum Q3 2024.',
    reviewedBy: 'Ir. Siti Rahayu Kusuma, M.Hum.',
    reviewedAt: '2024-03-05',
  },
]

export const adminUsers = [
  { id: 1, name: 'Drs. Bambang Wijayanto', email: 'bambang.w@jogjakota.go.id', role: 'admin' as const, city: 'Yogyakarta', status: 'active' as const, lastLogin: '25 Apr 2024' },
  { id: 2, name: 'Tanaka Hiroshi', email: 'tanaka.h@city.kyoto.jp', role: 'foreign-rep' as const, city: 'Kyoto', status: 'active' as const, lastLogin: '24 Apr 2024' },
  { id: 3, name: 'Emma Thompson', email: 'e.thompson@wcc.govt.nz', role: 'foreign-rep' as const, city: 'Wellington', status: 'active' as const, lastLogin: '20 Apr 2024' },
  { id: 4, name: 'Kim Jae-won', email: 'kjw@gwangju.go.kr', role: 'foreign-rep' as const, city: 'Gwangju', status: 'active' as const, lastLogin: '18 Apr 2024' },
  { id: 5, name: 'Hans Mueller', email: 'h.mueller@tuebingen.de', role: 'foreign-rep' as const, city: 'Tübingen', status: 'pending' as const, lastLogin: '—' },
  { id: 6, name: 'Eko Prasetyo', email: 'eko.prasetyo@jogjakota.go.id', role: 'editor' as const, city: 'Yogyakarta', status: 'active' as const, lastLogin: '25 Apr 2024' },
  { id: 7, name: 'Anisa Putri Wulandari', email: 'anisa.putri@jogjakota.go.id', role: 'editor' as const, city: 'Yogyakarta', status: 'active' as const, lastLogin: '24 Apr 2024' },
]

export const roles = [
  {
    name: 'admin',
    label: 'Administrator',
    color: '#1a4030',
    permissions: [
      'Kelola Pengguna & Peran',
      'Verifikasi Proposal Kemitraan',
      'Kelola Konten (Artikel, Foto, Video)',
      'Kelola Profil Personel Hubungan Luar Negeri',
      'Lihat Laporan & Analitik',
      'Konfigurasi Sistem',
    ],
  },
  {
    name: 'foreign-rep',
    label: 'Partner Representative',
    color: '#c9963a',
    permissions: [
      'Submit collaboration proposals',
      'Track proposal status',
      'View partner city profiles',
      'Access public galleries and articles',
      'Manage personal account details',
    ],
  },
  {
    name: 'editor',
    label: 'Content Editor',
    color: '#2980b9',
    permissions: [
      'Create and edit articles',
      'Upload and manage media files',
      'Add video embeds',
      'View basic reporting',
    ],
  },
  {
    name: 'viewer',
    label: 'Pengunjung Publik',
    color: '#7f8c8d',
    permissions: [
      'Lihat Halaman Publik',
      'Lihat Galeri & Artikel',
    ],
  },
]

export type ContentItem = {
  id: number
  type: 'article' | 'photo' | 'video'
  title: string
  city: string
  author: string
  date: string
  status: 'draft' | 'published'
  tags: string[]
  content?: string
  videoUrl?: string
  thumbnail?: string
}

export const contentItems: ContentItem[] = [
  { id: 1, type: 'article' as const, title: 'Batik Jogja dan Kimono Kyoto: Merajut Cerita Lintas Samudera', city: 'Kyoto', author: 'Eko Prasetyo', date: '2024-03-15', status: 'published' as const, tags: ['Budaya', 'Seni'] },
  { id: 2, type: 'article' as const, title: 'Leiden Serahkan Salinan Digital 200 Manuskrip Kuno Yogyakarta', city: 'Leiden', author: 'Anisa Putri Wulandari', date: '2024-02-10', status: 'published' as const, tags: ['Warisan', 'Arsip'] },
  { id: 3, type: 'photo' as const, title: 'Dokumentasi Workshop Batik — Delegasi Kyoto 2023', city: 'Kyoto', author: 'Anisa Putri Wulandari', date: '2023-11-20', status: 'published' as const, tags: ['Foto', 'Workshop'] },
  { id: 4, type: 'video' as const, title: 'Recap: Wayang Kulit di Gwangju Cultural Centre', city: 'Gwangju', author: 'Eko Prasetyo', date: '2024-01-08', status: 'draft' as const, tags: ['Video', 'Pertunjukan'] },
  { id: 5, type: 'article' as const, title: 'Delegasi Pemuda Wellington Kunjungi Sanggar Tari Yogyakarta', city: 'Wellington', author: 'Eko Prasetyo', date: '2024-04-01', status: 'draft' as const, tags: ['Pemuda', 'Seni'] },
]
