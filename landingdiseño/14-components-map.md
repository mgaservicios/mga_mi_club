# Street Dogs — Components Map

**Archivo:** `14-components-map.md`  
**Versión:** 1.0  
**Objetivo:** definir qué componentes usa cada página y cómo se reutilizan.

---

## 1. Arquitectura general

```text
src/
├── app/
│   ├── page.tsx
│   ├── equipo/page.tsx
│   ├── partidos/page.tsx
│   ├── galeria/page.tsx
│   ├── noticias/page.tsx
│   ├── noticias/[slug]/page.tsx
│   ├── contacto/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   ├── ui/
│   ├── cards/
│   ├── sections/
│   ├── forms/
│   ├── media/
│   └── motion/
├── lib/
├── hooks/
├── data/
├── types/
└── public/
```

---

## 2. Layout global

```text
SiteLayout
├── Navbar
├── PageTransition
├── Main
├── Footer
└── ScrollToTop
```

### `Navbar`

Props:

```ts
type NavbarProps = {
  transparent?: boolean;
  activePath?: string;
};
```

Responsabilidades:

- Logo.
- Navegación.
- Botón Login.
- Menú móvil.
- Fondo transparente en hero.
- Estado oscuro/glass al hacer scroll.

### `Footer`

Responsabilidades:

- Logo.
- Enlaces.
- Próximo partido.
- Contacto.
- Redes.
- Copyright.

### `PageContainer`

```ts
type PageContainerProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  children: React.ReactNode;
};
```

### `Section`

```ts
type SectionProps = {
  id?: string;
  spacing?: "sm" | "md" | "lg";
  background?: "default" | "surface" | "image";
  children: React.ReactNode;
};
```

---

## 3. Componentes UI base

```text
Button
IconButton
Badge
Avatar
Divider
SectionTitle
Eyebrow
GlassCard
Stat
Tooltip
Spinner
Skeleton
EmptyState
```

Variantes de `Button`:

```text
primary
secondary
ghost
danger
link
```

Tamaños:

```text
sm
md
lg
icon
```

---

## 4. Componentes de animación

```text
Reveal
StaggerGroup
ParallaxImage
AnimatedTitle
TextSplit
PageTransition
ScrollIndicator
CountUp
```

Reglas:

- No duplicar lógica GSAP.
- Encapsular animaciones en wrappers.
- Permitir desactivarlas por prop.
- Respetar `prefers-reduced-motion`.

---

## 5. Home

Ruta:

```text
/
```

```text
HomePage
├── HeroHome
│   ├── AnimatedTitle
│   ├── Eyebrow
│   ├── Button
│   ├── Button
│   └── ScrollIndicator
├── AboutPreview
│   ├── SectionTitle
│   ├── ParallaxImage
│   └── Button
├── NextMatchSection
│   ├── MatchCardFeatured
│   ├── Countdown
│   └── Button
├── FeaturedPlayers
│   ├── PlayerCard[]
│   └── Button
├── GalleryPreview
│   ├── GalleryGrid
│   └── Button
├── LatestNews
│   ├── NewsCard[]
│   └── Button
└── CTASection
```

Datos:

```text
hero
nextMatch
featuredPlayers
galleryPreview
latestNews
```

---

## 6. Equipo

Ruta:

```text
/equipo
```

```text
TeamPage
├── PageHero
├── TeamIntro
├── TeamPhoto
├── CoachingStaff
│   └── StaffCard[]
├── PlayersGrid
│   ├── PlayerFilters
│   └── PlayerCard[]
├── TeamStats
│   └── StatCard[]
├── TeamTimeline
│   └── Timeline
└── CTASection
```

Exclusivos:

```text
StaffCard
PlayerFilters
PlayerProfileModal
TeamTimeline
```

---

## 7. Partidos

Ruta:

```text
/partidos
```

```text
MatchesPage
├── PageHero
├── NextMatchSection
│   ├── MatchCardFeatured
│   ├── Countdown
│   ├── CalendarButton
│   └── MapButton
├── FixturesSection
│   ├── SeasonFilter
│   └── MatchCard[]
├── ResultsSection
│   └── ResultCard[]
├── StandingsSection
│   └── StandingsTable
├── MVPSection
│   └── MVPCard
└── CTASection
```

Exclusivos:

```text
Countdown
SeasonFilter
StandingsTable
MVPCard
CalendarButton
```

---

## 8. Galería

Ruta:

```text
/galeria
```

```text
GalleryPage
├── PageHero
├── GalleryToolbar
│   ├── SearchInput
│   └── FilterTabs
├── FeaturedGallery
│   └── GalleryCarousel
├── GalleryGrid
│   └── GalleryCard[]
├── VideoGrid
│   └── VideoCard[]
├── InstagramFeed
└── CTASection
```

Exclusivos:

```text
GalleryToolbar
GalleryCarousel
Lightbox
VideoCard
InstagramFeed
```

---

## 9. Noticias

Ruta:

```text
/noticias
```

```text
NewsPage
├── PageHero
├── FeaturedNews
├── NewsToolbar
│   ├── SearchInput
│   └── CategoryTabs
├── NewsGrid
│   └── NewsCard[]
├── Pagination
└── CTASection
```

Artículo:

```text
ArticlePage
├── ArticleHero
├── ArticleMeta
├── ArticleBody
├── ShareBar
├── ArticleGallery
├── RelatedNews
└── CTASection
```

---

## 10. Contacto

Ruta:

```text
/contacto
```

```text
ContactPage
├── PageHero
├── ContactSection
│   ├── ContactInfo
│   └── ContactForm
├── MapSection
├── SocialLinks
└── CTASection
```

Exclusivos:

```text
ContactInfo
ContactForm
MapSection
FormField
FormSelect
FormTextarea
```

---

## 11. Matriz de reutilización

| Componente | Home | Equipo | Partidos | Galería | Noticias | Contacto |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Navbar | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Footer | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| PageContainer | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Section | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| PageHero |  | ✓ | ✓ | ✓ | ✓ | ✓ |
| SectionTitle | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Button | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| GlassCard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CTASection | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Reveal | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| PlayerCard | ✓ | ✓ |  |  |  |  |
| MatchCard | ✓ |  | ✓ |  |  |  |
| GalleryCard | ✓ |  |  | ✓ |  |  |
| NewsCard | ✓ |  |  |  | ✓ |  |
| Countdown | ✓ |  | ✓ |  |  |  |
| SearchInput |  |  |  | ✓ | ✓ |  |
| FormField |  |  |  |  |  | ✓ |

---

## 12. Convención de nombres

```text
Navbar.tsx
Footer.tsx
PageHero.tsx
SectionTitle.tsx
HeroHome.tsx
PlayerCard.tsx
MatchCard.tsx
GalleryCard.tsx
NewsCard.tsx
CTASection.tsx
ContactForm.tsx
```

Reglas:

- PascalCase para componentes.
- camelCase para props y helpers.
- Un componente por archivo.
- Secciones de página dentro de `sections`.
- Primitivas reutilizables dentro de `ui`.
- No mezclar datos y presentación.

---

## 13. Tipos compartidos

```ts
export type Player = {
  id: string;
  name: string;
  number: number;
  position: string;
  image: string;
  specialty?: string;
};

export type Match = {
  id: string;
  opponent: string;
  date: string;
  time: string;
  venue: string;
  status: "upcoming" | "finished" | "cancelled";
  homeScore?: number;
  awayScore?: number;
};

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  publishedAt: string;
};

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  category: string;
  width: number;
  height: number;
};
```

---

## 14. Flujo de datos

```text
data/
├── players.ts
├── matches.ts
├── news.ts
├── gallery.ts
└── navigation.ts
```

Reglas:

- Primera versión con TypeScript o JSON.
- UI preparada para migrar a Supabase o CMS.
- No hardcodear listas extensas dentro de `page.tsx`.
- Acceso a datos centralizado en `lib/`.

---

## 15. Dependencias

```text
next
react
react-dom
typescript
tailwindcss
clsx
tailwind-merge
gsap
@gsap/react
lucide-react
react-hook-form
zod
@hookform/resolvers
```

---

## 16. Checklist

- [ ] Navbar y Footer viven en el layout global.
- [ ] `PageHero` se reutiliza en páginas internas.
- [ ] Home utiliza un hero específico.
- [ ] Las cards comparten tokens y estados.
- [ ] Las animaciones están encapsuladas.
- [ ] Los datos no viven dentro de componentes visuales.
- [ ] Todos los componentes están tipados.
- [ ] Todos los controles tienen focus visible.
- [ ] Modales bloquean el scroll del body.
- [ ] Lightbox y menú móvil funcionan con teclado.
- [ ] No hay duplicación estructural entre páginas.

---

**Fin del documento.**
