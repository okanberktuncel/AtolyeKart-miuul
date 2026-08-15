export type Product = {
  id: string;
  category: string;
  title: string;
  description: string;
  price: number;
  unit: string;
  image: string;
};

export const PRODUCTS: Product[] = [
  {
    id: 'seramik-kupa',
    category: 'seramik',
    title: 'Toprak Ton Kupa',
    description:
      'El çarkında şekillendirilmiş, fırında iki kez pişirilmiş kupa. Her parça birbirinden hafifçe farklı desen ve dokuya sahip — tamamen aynısı yok. Günlük kahve ve çay keyfiniz için.',
    price: 320,
    unit: 'adet',
    image: 'https://images.unsplash.com/photo-1536936812504-0e77dc3f0b40?fm=jpg&q=60&w=800&auto=format&fit=crop',
  },
  {
    id: 'seramik-vazo',
    category: 'seramik',
    title: 'Toprak Kahve Vazo',
    description: 'Elde şekillendirilmiş, mat sırlı vazo. Kuru veya taze çiçek düzenlemeleri için sade ve sıcak bir dokunuş.',
    price: 380,
    unit: 'adet',
    image: 'https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?fm=jpg&q=60&w=800&auto=format&fit=crop',
  },
  {
    id: 'seramik-tabak',
    category: 'seramik',
    title: 'Renkli Desenli Tabak',
    description: 'Elde boyanmış renkli sıçrama desenli servis tabağı. Kahvaltı sofralarına ve pastalarınıza eşlik eder.',
    price: 260,
    unit: 'adet',
    image: 'https://images.unsplash.com/photo-1745828186668-d1131baac067?fm=jpg&q=60&w=800&auto=format&fit=crop',
  },
  {
    id: 'seramik-kase',
    category: 'seramik',
    title: 'Sarı Ton Kase',
    description: 'Yumuşak sarı-yeşil tonlarda, çorba ve salata servisi için elde şekillendirilmiş kase.',
    price: 240,
    unit: 'adet',
    image: 'https://images.unsplash.com/photo-1769163211419-f6befc56b8ff?fm=jpg&q=60&w=800&auto=format&fit=crop',
  },
  {
    id: 'mum-sandal',
    category: 'mum',
    title: 'Sandal Ağacı Soya Mumu',
    description:
      '%100 doğal soya balmumundan, elle dökülerek hazırlanmış kokulu mum. Cam kavanozu yeniden kullanılabilir. Ortalama 40 saat yanma süresi.',
    price: 245,
    unit: 'adet',
    image: 'https://images.unsplash.com/photo-1663089889826-0575c6ae19de?fm=jpg&q=60&w=800&auto=format&fit=crop',
  },
  {
    id: 'mum-karanlik',
    category: 'mum',
    title: 'Gece Kokusu Mumu',
    description: 'Odunsu ve baharatlı notalar taşıyan, akşam saatleri için elde dökülmüş özel seri mum.',
    price: 270,
    unit: 'adet',
    image: 'https://images.unsplash.com/photo-1714376880837-f40388a805e5?fm=jpg&q=60&w=800&auto=format&fit=crop',
  },
  {
    id: 'mum-kavanoz',
    category: 'mum',
    title: 'Cam Kavanoz Mumu',
    description: 'Şeffaf cam kavanoz içinde, hafif ve ferah kokulu soya mumu. Bitince saksı veya kalemlik olarak kullanılabilir.',
    price: 220,
    unit: 'adet',
    image: 'https://images.unsplash.com/photo-1607284235728-e0d256e519f9?fm=jpg&q=60&w=800&auto=format&fit=crop',
  },
  {
    id: 'taki-kupe',
    category: 'taki',
    title: 'Ay Taşı Damla Küpe',
    description:
      'Doğal ay taşı ve reçine detaylarla el işçiliğiyle bir araya getirilmiş küpe. Hipoalerjenik çelik mekanizma ile hassas ciltlere de uygun.',
    price: 410,
    unit: 'çift',
    image: 'https://images.unsplash.com/photo-1756792340190-2039b9a1787d?fm=jpg&q=60&w=800&auto=format&fit=crop',
  },
  {
    id: 'taki-kolye',
    category: 'taki',
    title: 'Boncuk Detaylı Kolye',
    description: 'Doğal taş boncuklarla elde dizilmiş, ince zincirli kolye. Günlük kombinlere sade bir vurgu katar.',
    price: 350,
    unit: 'adet',
    image: 'https://images.unsplash.com/photo-1654699991520-aaaf4dd2608b?fm=jpg&q=60&w=800&auto=format&fit=crop',
  },
  {
    id: 'taki-bileklik',
    category: 'taki',
    title: 'İnce Zincir Bileklik',
    description: 'Zarif ve ince tasarımlı, elde birleştirilmiş halka detaylı bileklik. Tek başına veya katlı kombinlerde şık durur.',
    price: 290,
    unit: 'adet',
    image: 'https://images.unsplash.com/photo-1602527428055-a2526fabdc9f?fm=jpg&q=60&w=800&auto=format&fit=crop',
  },
];

export const CATEGORIES = [
  { id: 'tumu', label: 'Tümü' },
  { id: 'seramik', label: 'Seramik' },
  { id: 'mum', label: 'Mum' },
  { id: 'taki', label: 'Takı' },
];
