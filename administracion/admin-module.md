# Modulo de Administracion - MgaMiClubSAS

> Panel de administracion para gestionar el equipo Street Dogs
> Rutas: `/admin/*` (protegidas por middleware)
> Autenticacion: Supabase Auth (email/password)
> Patron: Server Component carga datos -> Client Component maneja CRUD

---

## Arquitectura

```
/auth/login                  ← Pagina de login
/(admin)/layout.tsx          ← Layout con Sidebar
  /admin/equipo              ← Gestion del equipo
  /admin/jugadores           ← Gestion de jugadores y cuerpo tecnico
  /admin/campeonatos         ← Gestion de campeonatos
  /admin/partidos            ← Gestion de partidos
  /admin/noticias            ← Gestion de noticias
  /admin/galeria             ← Gestion de galeria (albumes + fotos)
  /admin/standings           ← Tabla de posiciones
```

---

## Autenticacion

### Flujo

1. Usuario ingresa a `/admin/*`
2. Middleware (`src/middleware.ts`) intercepta la request
3. `src/lib/supabase/middleware.ts` crea cliente Supabase y llama `getUser()`
4. Si no hay usuario autenticado → redirige a `/auth/login`
5. Si Supabase no esta disponible → redirige a `/auth/login` (fail-secure)

### Login

**Ruta:** `/auth/login`
**Archivo:** `src/app/auth/login/page.tsx`
**Tipo:** Client Component

| Campo | Tipo | Placeholder |
|---|---|---|
| Email | email | `admin@miclub.com` |
| Password | password | `........` |

- Usa `createBrowserClient` de `@supabase/ssr`
- En exito → redirige a `/admin/equipo`
- En error → muestra banner rojo con mensaje de Supabase

---

## Layout Admin

**Archivo:** `src/app/(admin)/layout.tsx`

- Flex layout con fondo oscuro (`#0B0B0B`)
- Sidebar a la izquierda
- Contenido principal con `p-6`

### Sidebar

**Archivo:** `src/components/layout/sidebar.tsx`
**Tipo:** Client Component
**Ancho:** `w-96`
**Estilo:** Semi-transparente (`#111111/50`) con backdrop blur

| Link | Icono | Ruta |
|---|---|---|
| Equipo | Users | `/admin/equipo` |
| Jugadores | UserCheck | `/admin/jugadores` |
| Campeonatos | Trophy | `/admin/campeonatos` |
| Partidos | Calendar | `/admin/partidos` |
| Noticias | Newspaper | `/admin/noticias` |
| Galeria | Image | `/admin/galeria` |
| Clasificacion | BarChart3 | `/admin/standings` |

**Estado activo:** `bg-white/10`, texto full opacidad
**Estado inactivo:** Texto 50% opacidad, hover effects

---

## Paginas Admin (7 modulos)

---

### 1. Equipo

**Ruta:** `/admin/equipo`
**Archivo:** `src/app/(admin)/admin/equipo/page.tsx`
**Formulario:** `src/features/team/components/team-form.tsx`
**Tabla:** `teams`

Sin vista de lista — solo formulario para crear/editar el equipo ( registro unico).

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| Logo del Equipo | ImageUpload | No | Folder: `logos/`. Preview circular 96x96 |
| Nombre del Equipo | text | Si | |
| Ciudad | text | No | |
| Descripcion | text | No | |
| Nuestra Historia | textarea (6 rows) | No | Texto largo para `/nuestra-historia` |
| Color Primario | color picker + text | No | Dual input visual + hex. Default: `#000000` |
| Color Secundario | color picker + text | No | Dual input. Default: `#ffffff` |
| Instagram URL | url | No | |
| Facebook URL | url | No | |

**Server Actions:** `getTeam()`, `createTeam()`, `updateTeam()`, `deleteTeam()`
**Revalidacion:** `/`

---

### 2. Jugadores

**Ruta:** `/admin/jugadores`
**Archivo:** `src/app/(admin)/admin/jugadores/page.tsx`
**Client Component:** `src/app/(admin)/admin/jugadores/admin-players-client.tsx`
**Formulario:** `src/features/players/components/player-form.tsx`
**Tabla:** `players`

**Vista de lista:**
- Cada jugador como card con: foto circular 48x48, nombre, numero (#N), rol, posicion
- Botones: "Editar" (outline) y "Eliminar" (destructive)
- Toggle entre lista y formulario inline

**Formulario:**

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| Foto | ImageUpload | No | Folder: `players/` |
| Nombre | text | Si | |
| # Camiseta | number (0-99) | No | |
| Rol | select | No | Jugador / Entrenador / Asistente |
| Posicion | select | No | Base / Escolta / Alero / Ala-Pivot / Pivot |
| Fecha de nacimiento | date | No | |
| Lugar de nacimiento | text | No | |
| Altura (cm) | number (0-250) | No | |
| Telefono | text | No | |
| Clubes anteriores | textarea (2 rows) | No | |
| Email | email | No | |
| Bio | textarea (3 rows) | No | |

**Estadisticas (solo si rol = "Jugador"):**

| Campo | Tipo | Default |
|---|---|---|
| PTS (Puntos) | number (min 0) | 0 |
| REB (Rebotes) | number (min 0) | 0 |
| AST (Asistencias) | number (min 0) | 0 |
| ROB (Robos) | number (min 0) | 0 |
| MIN (Minutos) | number (min 0) | 0 |

**Constantes:**
```typescript
PLAYER_ROLES = [
  { value: "player", label: "Jugador" },
  { value: "head_coach", label: "Entrenador Principal" },
  { value: "assistant_coach", label: "Asistente" },
]
POSITIONS = [
  { value: "base", label: "Base" },
  { value: "escolta", label: "Escolta" },
  { value: "alero", label: "Alero" },
  { value: "ala_pivot", label: "Ala-Pivot" },
  { value: "pivot", label: "Pivot" },
]
```

**Server Actions:** `getPlayers()`, `getPlayersByRole()`, `createPlayer()`, `updatePlayer()`, `deletePlayer()`
**Revalidacion:** `/`, `/plantel`, `/admin/jugadores`
**Fallback:** Si falla INSERT/UPDATE con todos los campos, reintenta sin `birthplace`, `height_cm`, `previous_clubs`

---

### 3. Campeonatos

**Ruta:** `/admin/campeonatos`
**Archivo:** `src/app/(admin)/admin/campeonatos/page.tsx`
**Client Component:** `src/app/(admin)/admin/campeonatos/admin-championships-client.tsx`
**Formulario:** `src/features/championships/components/championship-form.tsx`
**Tabla:** `championships`

**Vista de lista:**
- Cada campeonato como card con: foto thumbnail 48x64, nombre, rango de fechas, ganador, puesto
- Botones: "Editar" y "Eliminar"

**Formulario:**

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| Nombre | text | Si | |
| Fecha inicio | date | No | |
| Fecha fin | date | No | |
| Cantidad equipos | number | No | |
| Lugar | text | No | |
| Organizador | text | No | |
| Ganador | text | No | |
| Puesto Streetdogs | number | No | |
| Foto del campeonato | file upload | No | Folder: `championships/`. Preview 128x192 |

**Server Actions:** `getChampionships()`, `createChampionship()`, `updateChampionship()`, `deleteChampionship()`
**Revalidacion:** `/admin/campeonatos`, `/partidos`

---

### 4. Partidos

**Ruta:** `/admin/partidos`
**Archivo:** `src/app/(admin)/admin/partidos/page.tsx`
**Client Component:** `src/app/(admin)/admin/partidos/admin-matches-client.tsx`
**Formulario:** `src/features/matches/components/match-form.tsx`
**Tabla:** `matches`

**Carga de datos:** `Promise.all([getMatches(team.id), getChampionships(team.id)])`

**Vista de lista:**
- Cada partido como card con: "vs" (local) o "@" (visitante) + rival, badge resultado, fecha
- Botones: "Editar" y "Eliminar"

**Formulario:**

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| Rival | text | Si | |
| Fecha y hora | datetime-local | Si | Conversion UTC con offset de timezone |
| Resultado | text | No | Ej: "85-78" |
| Lugar | radio buttons | No | Local / Visitante |
| Resumen | textarea (3 rows) | No | |
| Campeonato | select | No | Poblado desde championships. "Sin campeonato" default |
| Proximo partido | checkbox | No | Solo uno por equipo. Muestra en home page |
| Imagen de resumen | file upload | No | Folder: `matches/`. Preview 128x192 |
| Galeria de imagenes | file upload (multiple) | No | Folder: `matches/`. Grid preview 96x96 |

**Funcionalidad especial — Proximo Partido:**
- Checkbox "Marcar como proximo partido"
- Solo un partido puede ser "proximo" por equipo
- Al marcar: `setNextMatch(teamId, matchId)` desactiva todos y activa el seleccionado
- Se muestra destacado en la pagina principal (`/`)

**Server Actions:** `getMatches()`, `createMatch()`, `updateMatch()`, `deleteMatch()`, `getNextMatch()`, `setNextMatch()`, `unsetNextMatch()`
**Revalidacion:** `/`, `/partidos`, `/admin/partidos`

---

### 5. Noticias

**Ruta:** `/admin/noticias`
**Archivo:** `src/app/(admin)/admin/noticias/page.tsx`
**Client Component:** `src/app/(admin)/admin/noticias/admin-news-client.tsx`
**Formulario:** `src/features/news/components/news-form.tsx`
**Tabla:** `news`

**Vista de lista:**
- Cada noticia como card con: imagen thumbnail 48x48, titulo, badge de estado, fecha
- Badge "Publicado" (verde) o "Borrador" (amarillo)
- Botones: "Editar" y "Eliminar"

**Formulario:**

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| Imagen | ImageUpload | No | Folder: `news/` |
| Titulo | text | Si | |
| Contenido | textarea (6 rows) | Si | |
| Publicar | checkbox | No | Si esta marcado, visible para todos. Si no, solo borrador |

**Server Actions:** `getAllNews()`, `getPublishedNews()`, `createNews()`, `updateNews()`, `deleteNews()`
**Revalidacion:** `/noticias`, `/admin/noticias`
**RLS:** Solo noticias con `published=true` son visibles publicamente

---

### 6. Galeria

**Ruta:** `/admin/galeria`
**Archivo:** `src/app/(admin)/admin/galeria/page.tsx`
**Client Component:** `src/app/(admin)/admin/galeria/admin-gallery-client.tsx`
**Formulario:** `src/features/gallery/components/gallery-form.tsx`
**Tablas:** `gallery`, `albums`

El modulo mas complejo — navegable en dos niveles.

**Carga de datos:** `Promise.all([getGallery(team.id), getAlbums(team.id)])`

#### Nivel 1: Vista de Albumes

- Grid responsive de cards de album (2-4 columnas)
- Cada album muestra: imagen de portada, nombre, contador de fotos, descripcion (truncada)
- Album virtual "Sin album" para imagenes sin `album_id`
- Boton "Crear Album" abre formulario inline
- BotonEliminar album (X) en hover — avisa "Las imagenes no se eliminaran"

**Formulario de Album:**

| Campo | Tipo | Requerido |
|---|---|---|
| Nombre | text | Si |
| Descripcion | text | No |

#### Nivel 2: Fotos del Album

- Boton volver a lista de albumes
- Header con nombre del album
- Boton "Agregar Fotos"
- Grid responsive (3-5 columnas) de imagenes
- Cada imagen: foto completa, titulo, botones editar/eliminar en hover
- Click abre ImageLightbox (pantalla completa, z-9999)

**Formulario de Foto:**

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| Imagen/Imagenes | file upload | Si | **Edicion:** archivo unico. **Creacion:** seleccion multiple con preview grid |
| Titulo | text | Si (creacion) | Se aplica a todas las imagenes en carga multiple |
| Album | select | No | Poblado desde albums. "Sin album" default |
| Fecha | text | No | Texto libre: "2024", "Enero 2024", "15/03/2024" |
| Lugar | text | No | |
| Descripcion | textarea (2 rows) | No | |

**Funcionalidad especial:**
- **Carga multiple:** En modo creacion, seleccionar varios archivos sube cada uno individualmente y crea un registro gallery por cada uno
- **Indicador de progreso:** "Subiendo X de Y..."
- **ImageLightbox:** createPortal, cierra con Escape o click en fondo
- **Album sin agrupar:** Album virtual con id `__ungrouped__` para imagenes sin album_id

**Server Actions:**
- Gallery: `getGallery()`, `getGalleryByAlbum()`, `createGalleryImage()`, `updateGalleryImage()`, `deleteGalleryImage()`
- Albums: `getAlbums()`, `createAlbum()`, `updateAlbum()`, `deleteAlbum()`
**Revalidacion:** `/galeria`, `/admin/galeria`
**Fallback:** Gallery actions reintenta sin `album_id`, `photo_date`, `location` si falla

---

### 7. Clasificacion

**Ruta:** `/admin/standings`
**Archivo:** `src/app/(admin)/admin/standings/page.tsx`
**Formulario:** `src/features/standings/components/standings-form.tsx`
**Tabla:** `standings`

Patron diferente — usa **edicion inline en tabla HTML** en vez del toggle lista/formulario.

**Tabla:**

| Columna | Header | Alineacion | Notas |
|---|---|---|---|
| position | # | left | |
| team_name | Equipo | left | Bold |
| wins | PG | center | Partidos Ganados |
| losses | PP | center | Partidos Perdidos |
| points_for | PF | center | Puntos a Favor |
| points_against | PC | center | Puntos en Contra |
| diff (calculado) | Dif | center | PF - PC. Verde si positivo, rojo si negativo. Prefijo `+` |
| actions | Acciones | center | "Editar" y "Eliminar" (ghost, texto rojo) |

**Formulario inline (aparece al crear/editar):**

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| Nombre del Equipo | text | Si | |
| Posicion | number (min 1) | No | Auto-asigna `standings.length + 1` para nuevos |
| Victorias | number (min 0) | No | |
| Derrotas | number (min 0) | No | |
| Puntos a Favor | number (min 0) | No | |
| Puntos en Contra | number (min 0) | No | |

**Server Actions:** `getStandings()`, `createStanding()`, `updateStanding()`, `deleteStanding()`
**Revalidacion:** `/`, `/admin/standings`

---

## Componentes Compartidos del Admin

### ImageUpload

**Archivo:** `src/features/team/components/image-upload.tsx`
**Usado por:** Team, Player, News, Championship forms

- Sube a Supabase `team-assets` bucket
- Preview circular 96x96 cuando hay valor
- Boton "Eliminar" para limpiar imagen
- Muestra errores de upload

| Prop | Tipo | Descripcion |
|---|---|---|
| `value` | `string \| null` | URL actual de la imagen |
| `onChange` | `(url: string \| null) => void` | Callback al cambiar |
| `folder` | `string` | Subcarpeta en Supabase storage |
| `label` | `string` | Texto del boton |

### ImageLightbox

**Archivo:** `src/components/image-lightbox.tsx`
**Usado por:** Gallery admin, Galeria publica

-createPortal a `document.body`
- z-index 9999
- Max dimension: 90vh / 90vw
- Cierra con Escape o click en fondo

---

## Patrones Comunes

| Patron | Descripcion |
|---|---|
| `force-dynamic` | Todas las paginas admin deshabilitan SSG |
| Guard de equipo | Cada pagina llama `getTeam()` primero — si no existe, muestra "Primero configura tu equipo." |
| CRUD toggle | Server Component carga datos → Client Component alterna entre lista y formulario |
| Formulario Card | Todos usan wrapper `Card` con boton "Guardar"/"Agregar" y "Cancelar" |
| Eliminar | Boton solo en modo edicion, con `confirm()` dialog |
| Refresco | Despues de mutations: `handleRefresh()` (re-fetch) + `router.refresh()` (revalidate server) |
| Fechas | Todas en locale `es-CO` con formato `{ day: "numeric", month: "short", year: "numeric" }` |
| Uploads | Client-side via browser Supabase client, nombres UUID, bucket `team-assets` |
| Fallback DB | Player/Gallery actions reintentan sin columnas nuevas si falla el INSERT/UPDATE |

---

## Inventario de Archivos

### Rutas Admin (13)

| Archivo | Tipo |
|---|---|
| `src/app/(admin)/layout.tsx` | Layout con sidebar |
| `src/app/(admin)/admin/equipo/page.tsx` | Server Component |
| `src/app/(admin)/admin/jugadores/page.tsx` | Server Component |
| `src/app/(admin)/admin/jugadores/admin-players-client.tsx` | Client Component |
| `src/app/(admin)/admin/campeonatos/page.tsx` | Server Component |
| `src/app/(admin)/admin/campeonatos/admin-championships-client.tsx` | Client Component |
| `src/app/(admin)/admin/partidos/page.tsx` | Server Component |
| `src/app/(admin)/admin/partidos/admin-matches-client.tsx` | Client Component |
| `src/app/(admin)/admin/noticias/page.tsx` | Server Component |
| `src/app/(admin)/admin/noticias/admin-news-client.tsx` | Client Component |
| `src/app/(admin)/admin/galeria/page.tsx` | Server Component |
| `src/app/(admin)/admin/galeria/admin-gallery-client.tsx` | Client Component |
| `src/app/(admin)/admin/standings/page.tsx` | Server Component |

### Auth (1)

| Archivo | Tipo |
|---|---|
| `src/app/auth/login/page.tsx` | Client Component |

### Supabase/Config (4)

| Archivo | Proposito |
|---|---|
| `src/middleware.ts` | Root middleware |
| `src/lib/supabase/middleware.ts` | Logica de auth |
| `src/lib/supabase/server.ts` | Cliente server-side |
| `src/lib/supabase/client.ts` | Cliente browser-side |

### Formularios (8)

| Archivo | Feature |
|---|---|
| `src/features/team/components/team-form.tsx` | Equipo |
| `src/features/team/components/image-upload.tsx` | Upload compartido |
| `src/features/players/components/player-form.tsx` | Jugadores |
| `src/features/championships/components/championship-form.tsx` | Campeonatos |
| `src/features/matches/components/match-form.tsx` | Partidos |
| `src/features/news/components/news-form.tsx` | Noticias |
| `src/features/gallery/components/gallery-form.tsx` | Galeria |
| `src/features/standings/components/standings-form.tsx` | Clasificacion |

### Server Actions (8)

| Archivo | Operaciones |
|---|---|
| `src/features/team/actions.ts` | CRUD teams |
| `src/features/players/actions.ts` | CRUD players + getPlayersByRole |
| `src/features/championships/actions.ts` | CRUD championships |
| `src/features/matches/actions.ts` | CRUD matches + next match management |
| `src/features/news/actions.ts` | CRUD news + getPublishedNews |
| `src/features/gallery/actions.ts` | CRUD gallery images |
| `src/features/gallery/album-actions.ts` | CRUD albums |
| `src/features/standings/actions.ts` | CRUD standings |

### Tipos (8)

| Archivo | Tipos |
|---|---|
| `src/features/team/types.ts` | Team, TeamInput |
| `src/features/players/types.ts` | Player, PlayerRole, Position, PlayerInput |
| `src/features/players/constants.ts` | PLAYER_ROLES, POSITIONS, ROLE_LABELS, POSITION_LABELS |
| `src/features/championships/types.ts` | Championship, ChampionshipInput |
| `src/features/matches/types.ts` | Match, MatchInput |
| `src/features/news/types.ts` | News, NewsInput |
| `src/features/gallery/types.ts` | GalleryImage, GalleryInput |
| `src/features/gallery/album-types.ts` | Album, AlbumInput |
| `src/features/standings/types.ts` | Standing, StandingInput |

### Componentes compartidos (2)

| Archivo | Uso |
|---|---|
| `src/components/layout/sidebar.tsx` | Navegacion admin |
| `src/components/image-lightbox.tsx` | Visor de imagenes fullscreen |

---

## Storage

**Bucket:** `team-assets` (publico)

| Subcarpeta | Uso | Componente |
|---|---|---|
| `logos/` | Logos de equipos | TeamForm |
| `players/` | Fotos de jugadores | PlayerForm |
| `championships/` | Fotos de campeonatos | ChampionshipForm |
| `matches/` | Fotos de partidos | MatchForm |
| `gallery/` | Fotos de galeria | GalleryForm |
| `news/` | Fotos de noticias | NewsForm |

Todos los uploads usan nombres UUID generados en el cliente via `createBrowserClient`.
