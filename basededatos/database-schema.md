# Base de Datos - MgaMiClubSAS

> Proyecto: Street Dogs | Básquet +40 Patagonia
> Plataforma: Supabase (PostgreSQL) con Row Level Security
> Arquitectura: Multi-tenant via `team_id` en todas las tablas hijas
> Cliente: `@supabase/ssr` v0.12.3 + `@supabase/supabase-js` v2.109.0
> Proyecto Supabase: `xajvvnajobhdwtmccjgd`

---

## Resumen

| Metrica | Valor |
|---|---|
| Tablas | 8 |
| Migraciones | 16 |
| Columnas totales | ~85 |
| Buckets de almacenamiento | 1 (`team-assets`) |
| Foreign Keys | 9 (7 CASCADE, 2 SET NULL) |
| Funciones RPC | 0 |
| Server Actions | 39 funciones |

---

## Tablas

### `teams`

Tabla principal. Cada equipo es un tenant. Todas las tablas hijas referencian esta.

| Columna | Tipo | Constraints | Migracion |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | 001 |
| `name` | `text` | NOT NULL | 001 |
| `logo_url` | `text` | nullable | 001 |
| `city` | `text` | nullable | 001 |
| `description` | `text` | nullable | 001 |
| `primary_color` | `text` | nullable | 001 |
| `secondary_color` | `text` | nullable | 001 |
| `instagram_url` | `text` | nullable | 007 |
| `facebook_url` | `text` | nullable | 007 |
| `history` | `text` | nullable | 014 |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | 001 |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | 001 |

**Indices:** `idx_teams_name (name)`
**RLS:** Public SELECT, Authenticated INSERT/UPDATE/DELETE

---

### `players`

Jugadores y cuerpo tecnico de cada equipo.

| Columna | Tipo | Constraints | Migracion |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | 003 |
| `team_id` | `uuid` | NOT NULL, FK -> `teams(id)` ON DELETE CASCADE | 003 |
| `name` | `text` | NOT NULL | 003 |
| `photo_url` | `text` | nullable | 003 |
| `number` | `integer` | nullable | 003 |
| `position` | `text` | CHECK IN ('base','escolta','alero','ala_pivot','pivot') | 003 |
| `role` | `text` | NOT NULL, default 'player', CHECK IN ('player','head_coach','assistant_coach') | 003 |
| `birth_date` | `date` | nullable | 003 |
| `birthplace` | `text` | nullable | 016 |
| `height_cm` | `integer` | nullable | 016 |
| `previous_clubs` | `text` | nullable | 016 |
| `phone` | `text` | nullable | 003 |
| `email` | `text` | nullable | 003 |
| `bio` | `text` | nullable | 003 |
| `social_links` | `jsonb` | default `'{}'` | 003 |
| `points` | `integer` | default 0 | 003 |
| `rebounds` | `integer` | default 0 | 003 |
| `assists` | `integer` | default 0 | 003 |
| `steals` | `integer` | default 0 | 003 |
| `minutes` | `integer` | default 0 | 003 |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | 003 |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | 003 |

**Indices:** `idx_players_team_id`, `idx_players_role`, `idx_players_position`, `idx_players_number`
**RLS:** Public SELECT, Authenticated INSERT/UPDATE/DELETE
**Nota:** Las acciones `createPlayer` y `updatePlayer` tienen fallback: si falla el INSERT/UPDATE con todos los campos, reintenta sin `birthplace`, `height_cm`, `previous_clubs` (columnas agregadas despues).

---

### `matches`

Partidos jugados y proximo partido.

| Columna | Tipo | Constraints | Migracion |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | 004 |
| `team_id` | `uuid` | NOT NULL, FK -> `teams(id)` ON DELETE CASCADE | 004 |
| `rival` | `text` | NOT NULL | 004 |
| `date` | `timestamptz` | NOT NULL | 004 |
| `result` | `text` | nullable | 004 |
| `summary` | `text` | nullable | 004 |
| `is_home` | `boolean` | default true | 004 |
| `image_url` | `text` | nullable | 009 |
| `images` | `text[]` | default `'{}'` | 009 |
| `championship_id` | `uuid` | nullable, FK -> `championships(id)` ON DELETE SET NULL | 011 |
| `is_next_match` | `boolean` | default false | 015 |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | 004 |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | 004 |

**Indices:** `idx_matches_team_id`, `idx_matches_date (date DESC)`, `idx_matches_championship_id`
**RLS:** Public SELECT, Authenticated INSERT/UPDATE/DELETE
**Nota:** Solo un partido puede tener `is_next_match = true` por equipo. `setNextMatch()` primero desactiva todos y luego activa el seleccionado.

---

### `gallery`

Fotos de la galeria del equipo.

| Columna | Tipo | Constraints | Migracion |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | 005 |
| `team_id` | `uuid` | NOT NULL, FK -> `teams(id)` ON DELETE CASCADE | 005 |
| `title` | `text` | NOT NULL | 005 |
| `image_url` | `text` | NOT NULL | 005 |
| `description` | `text` | nullable | 005 |
| `album` | `text` | default 'general' | 005 |
| `album_id` | `uuid` | nullable, FK -> `albums(id)` ON DELETE SET NULL | 013 |
| `photo_date` | `date` | nullable | 013 |
| `location` | `text` | nullable | 013 |
| `sort_order` | `integer` | default 0 | 005 |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | 005 |

**Indices:** `idx_gallery_team_id`, `idx_gallery_album`, `idx_gallery_album_id`
**RLS:** Public SELECT, Authenticated INSERT/UPDATE/DELETE
**Nota:** Tiene sistema dual de albumes: `album` (string legacy) y `album_id` (FK a albums). Las acciones tienen fallback para columnas nuevas.

---

### `news`

Noticias publicadas del equipo.

| Columna | Tipo | Constraints | Migracion |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | 006 |
| `team_id` | `uuid` | NOT NULL, FK -> `teams(id)` ON DELETE CASCADE | 006 |
| `title` | `text` | NOT NULL | 006 |
| `content` | `text` | NOT NULL | 006 |
| `image_url` | `text` | nullable | 006 |
| `published` | `boolean` | default false | 006 |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | 006 |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | 006 |

**Indices:** `idx_news_team_id`, `idx_news_published (published, created_at DESC)`
**RLS:** Public solo puede ver donde `published = true`. Authenticated tiene acceso completo.

---

### `standings`

Tabla de posiciones de campeonato.

| Columna | Tipo | Constraints | Migracion |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | 008 |
| `team_id` | `uuid` | NOT NULL, FK -> `teams(id)` ON DELETE CASCADE | 008 |
| `team_name` | `text` | NOT NULL (denormalizado) | 008 |
| `wins` | `integer` | default 0 | 008 |
| `losses` | `integer` | default 0 | 008 |
| `points_for` | `integer` | default 0 | 008 |
| `points_against` | `integer` | default 0 | 008 |
| `position` | `integer` | nullable | 008 |
| `created_at` | `timestamptz` | default `now()` | 008 |
| `updated_at` | `timestamptz` | default `now()` | 008 |

**Indices:** Ninguno definido
**RLS:** Public SELECT, Service role acceso completo, Authenticated acceso completo

---

### `championships`

Torneos y campeonatos en los que participa el equipo.

| Columna | Tipo | Constraints | Migracion |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | 010 |
| `team_id` | `uuid` | NOT NULL, FK -> `teams(id)` ON DELETE CASCADE | 010 |
| `name` | `text` | NOT NULL | 010 |
| `start_date` | `date` | nullable | 010 |
| `end_date` | `date` | nullable | 010 |
| `num_teams` | `integer` | nullable | 010 |
| `location` | `text` | nullable | 010 |
| `photo_url` | `text` | nullable | 010 |
| `organizer` | `text` | nullable | 010 |
| `winner` | `text` | nullable | 010 |
| `our_placement` | `integer` | nullable | 010 |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | 010 |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | 010 |

**Indices:** `idx_championships_team_id`, `idx_championships_start_date (start_date DESC)`
**RLS:** Public SELECT, Authenticated INSERT/UPDATE/DELETE

---

### `albums`

Albumes para organizar fotos de la galeria.

| Columna | Tipo | Constraints | Migracion |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | 012 |
| `team_id` | `uuid` | NOT NULL, FK -> `teams(id)` ON DELETE CASCADE | 012 |
| `name` | `text` | NOT NULL | 012 |
| `description` | `text` | nullable | 012 |
| `cover_url` | `text` | nullable | 012 |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | 012 |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | 012 |

**Indices:** `idx_albums_team_id`
**RLS:** Public SELECT, Authenticated INSERT/UPDATE/DELETE

---

## Relaciones

```
teams (1) ──────< (N) players           team_id FK  ON DELETE CASCADE
teams (1) ──────< (N) matches           team_id FK  ON DELETE CASCADE
teams (1) ──────< (N) gallery           team_id FK  ON DELETE CASCADE
teams (1) ──────< (N) news              team_id FK  ON DELETE CASCADE
teams (1) ──────< (N) standings         team_id FK  ON DELETE CASCADE
teams (1) ──────< (N) championships     team_id FK  ON DELETE CASCADE
teams (1) ──────< (N) albums            team_id FK  ON DELETE CASCADE

championships (1) ──────< (N) matches   championship_id FK  ON DELETE SET NULL
albums (1) ─────────────< (N) gallery   album_id FK         ON DELETE SET NULL
```

**Notas de diseno:**
- Todas las tablas hijas se eliminan en cascada al borrar el `team` padre.
- `matches.championship_id` usa SET NULL: un partido sobrevive sin su campeonato.
- `gallery.album_id` usa SET NULL: una foto sobrevive sin su album.
- `standings.team_name` esta denormalizado (guardado junto a `team_id`).

---

## Indices Completos

| Tabla | Indice | Columna(s) |
|---|---|---|
| teams | `idx_teams_name` | `name` |
| players | `idx_players_team_id` | `team_id` |
| players | `idx_players_role` | `role` |
| players | `idx_players_position` | `position` |
| players | `idx_players_number` | `number` |
| matches | `idx_matches_team_id` | `team_id` |
| matches | `idx_matches_date` | `date DESC` |
| matches | `idx_matches_championship_id` | `championship_id` |
| gallery | `idx_gallery_team_id` | `team_id` |
| gallery | `idx_gallery_album` | `album` |
| gallery | `idx_gallery_album_id` | `album_id` |
| news | `idx_news_team_id` | `team_id` |
| news | `idx_news_published` | `(published, created_at DESC)` |
| championships | `idx_championships_team_id` | `team_id` |
| championships | `idx_championships_start_date` | `start_date DESC` |
| albums | `idx_albums_team_id` | `team_id` |

---

## Almacenamiento (Storage)

### Bucket: `team-assets`

| Propiedad | Valor |
|---|---|
| ID | `team-assets` |
| Publico | `true` |
| Lectura | Public |
| Escritura | Solo authenticated |
| Eliminacion | Solo authenticated |

**Carpetas a nivel de aplicacion:**
- `logos/` — logos de equipos
- `players/` — fotos de jugadores
- `matches/` — fotos de partidos
- `galeria/` — fotos de galeria
- `championships/` — fotos de campeonatos

---

## Migraciones (16)

| # | Archivo | Descripcion |
|---|---|---|
| 001 | `001_create_teams.sql` | Tabla teams + RLS |
| 002 | `002_create_storage_bucket.sql` | Bucket team-assets |
| 003 | `003_create_players.sql` | Tabla players + indices + RLS |
| 004 | `004_create_matches.sql` | Tabla matches + indices + RLS |
| 005 | `005_create_gallery.sql` | Tabla gallery + indices + RLS |
| 006 | `006_create_news.sql` | Tabla news + RLS (published-only para publico) |
| 007 | `007_add_social_fields.sql` | ALTER teams: instagram_url, facebook_url |
| 008 | `008_create_standings.sql` | Tabla standings + RLS |
| 009 | `009_add_match_images.sql` | ALTER matches: image_url, images[] |
| 010 | `010_create_championships.sql` | Tabla championships + indices + RLS |
| 011 | `011_add_championship_to_matches.sql` | ALTER matches: championship_id FK |
| 012 | `012_create_albums.sql` | Tabla albums + RLS |
| 013 | `013_add_album_to_gallery.sql` | ALTER gallery: album_id FK, photo_date, location |
| 014 | `014_add_history_to_teams.sql` | ALTER teams: history |
| 015 | `015_add_is_next_match.sql` | ALTER matches: is_next_match |
| 016 | `016_add_player_fields.sql` | ALTER players: birthplace, height_cm, previous_clubs |

---

## TypeScript Types

Cada feature tiene su archivo de tipos en `src/features/<feature>/types.ts`:

| Feature | Archivo | Tipo principal |
|---|---|---|
| team | `src/features/team/types.ts` | `Team`, `TeamInput` |
| players | `src/features/players/types.ts` | `Player`, `PlayerRole`, `Position`, `PlayerInput` |
| matches | `src/features/matches/types.ts` | `Match`, `MatchInput` |
| news | `src/features/news/types.ts` | `News`, `NewsInput` |
| gallery | `src/features/gallery/types.ts` | `GalleryImage`, `GalleryInput` |
| gallery (albums) | `src/features/gallery/album-types.ts` | `Album`, `AlbumInput` |
| standings | `src/features/standings/types.ts` | `Standing`, `StandingInput` |
| championships | `src/features/championships/types.ts` | `Championship`, `ChampionshipInput` |

**Enums:**
```typescript
type PlayerRole = "player" | "head_coach" | "assistant_coach";
type Position = "base" | "escolta" | "alero" | "ala_pivot" | "pivot";
```

---

## Server Actions (39 funciones)

### team/actions.ts
| Funcion | Operacion | Notas |
|---|---|---|
| `getTeam()` | SELECT * | ORDER BY created_at DESC LIMIT 1 |
| `getTeamById(id)` | SELECT * | WHERE id = ? |
| `createTeam(input)` | INSERT | |
| `updateTeam(id, input)` | UPDATE | Setea updated_at |
| `deleteTeam(id)` | DELETE | |

### players/actions.ts
| Funcion | Operacion | Notas |
|---|---|---|
| `getPlayers(teamId)` | SELECT * | ORDER BY role, number |
| `getPlayersByRole(teamId, role)` | SELECT * | WHERE role = ? ORDER BY number |
| `getPlayerById(id)` | SELECT * | |
| `createPlayer(input)` | INSERT | Fallback sin columnas nuevas |
| `updatePlayer(id, input)` | UPDATE | Fallback sin columnas nuevas |
| `deletePlayer(id)` | DELETE | |

### matches/actions.ts
| Funcion | Operacion | Notas |
|---|---|---|
| `getMatches(teamId)` | SELECT * | ORDER BY date DESC |
| `getMatchById(id)` | SELECT * | |
| `createMatch(input)` | INSERT | |
| `updateMatch(id, input)` | UPDATE | Setea updated_at |
| `deleteMatch(id)` | DELETE | |
| `getNextMatch(teamId)` | SELECT * | WHERE is_next_match = true LIMIT 1 |
| `setNextMatch(teamId, matchId)` | UPDATE | Desactiva todos, activa uno |
| `unsetNextMatch(matchId)` | UPDATE | Setea is_next_match = false |

### news/actions.ts
| Funcion | Operacion | Notas |
|---|---|---|
| `getPublishedNews(teamId)` | SELECT * | WHERE published = true, ORDER BY created_at DESC |
| `getAllNews(teamId)` | SELECT * | ORDER BY created_at DESC |
| `getNewsById(id)` | SELECT * | |
| `createNews(input)` | INSERT | |
| `updateNews(id, input)` | UPDATE | Setea updated_at |
| `deleteNews(id)` | DELETE | |

### gallery/actions.ts
| Funcion | Operacion | Notas |
|---|---|---|
| `getGallery(teamId)` | SELECT * | ORDER BY sort_order, created_at DESC |
| `getGalleryByAlbum(teamId, album)` | SELECT * | WHERE album = ? |
| `getAlbums(teamId)` | SELECT DISTINCT album | Legacy string-based |
| `createGalleryImage(input)` | INSERT | Fallback sin columnas nuevas |
| `updateGalleryImage(id, input)` | UPDATE | Fallback sin columnas nuevas |
| `deleteGalleryImage(id)` | DELETE | |

### gallery/album-actions.ts
| Funcion | Operacion | Notas |
|---|---|---|
| `getAlbums(teamId)` | SELECT * | ORDER BY created_at DESC |
| `getAlbumById(id)` | SELECT * | |
| `createAlbum(input)` | INSERT | |
| `updateAlbum(id, input)` | UPDATE | Setea updated_at |
| `deleteAlbum(id)` | DELETE | |

### standings/actions.ts
| Funcion | Operacion | Notas |
|---|---|---|
| `getStandings(teamId)` | SELECT * | ORDER BY position ASC |
| `getStandingById(id)` | SELECT * | |
| `createStanding(input)` | INSERT | |
| `updateStanding(id, input)` | UPDATE | Setea updated_at |
| `deleteStanding(id)` | DELETE | |

### championships/actions.ts
| Funcion | Operacion | Notas |
|---|---|---|
| `getChampionships(teamId)` | SELECT * | ORDER BY start_date DESC |
| `getChampionshipById(id)` | SELECT * | |
| `createChampionship(input)` | INSERT | |
| `updateChampionship(id, input)` | UPDATE | Setea updated_at |
| `deleteChampionship(id)` | DELETE | |

---

## Autenticacion

- **Proveedor:** Supabase Auth (email/password)
- **Middleware:** `src/lib/supabase/middleware.ts` — redirige `/admin/*` a `/auth/login` si no esta autenticado
- **Clientes Supabase:**
  - `src/lib/supabase/client.ts` — browser client (`createBrowserClient`)
  - `src/lib/supabase/server.ts` — server client (`createServerClient` con cookie handler)
  - `src/lib/supabase/middleware.ts` — middleware client (refresh de sesion)

---

## Row Level Security (RLS)

| Tabla | Publico | Anon | Authenticated |
|---|---|---|---|
| teams | SELECT | SELECT | SELECT, INSERT, UPDATE, DELETE |
| players | SELECT | SELECT | SELECT, INSERT, UPDATE, DELETE |
| matches | SELECT | SELECT | SELECT, INSERT, UPDATE, DELETE |
| gallery | SELECT | SELECT | SELECT, INSERT, UPDATE, DELETE |
| news | SELECT (solo `published=true`) | SELECT (solo publicados) | SELECT, INSERT, UPDATE, DELETE |
| standings | SELECT | SELECT | SELECT, INSERT, UPDATE, DELETE |
| championships | SELECT | SELECT | SELECT, INSERT, UPDATE, DELETE |
| albums | SELECT | SELECT | SELECT, INSERT, UPDATE, DELETE |
