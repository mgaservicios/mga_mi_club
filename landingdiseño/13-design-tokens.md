# Street Dogs — Design Tokens

**Archivo:** `13-design-tokens.md`  
**Versión:** 1.0  
**Stack objetivo:** Next.js + Tailwind CSS + GSAP

---

## 1. Propósito

Este documento funciona como fuente única de verdad visual para Street Dogs. Todos los componentes, páginas, animaciones y recursos deben respetar estos tokens.

Identidad:

- Negro profundo.
- Rojo intenso.
- Blanco de alto contraste.
- Estética deportiva cinematográfica.
- Superficies oscuras con textura.
- Microinteracciones sobrias.
- Jerarquía tipográfica fuerte.

No utilizar valores arbitrarios cuando ya exista un token equivalente.

---

## 2. Colores

### Marca

| Token | Valor | Uso |
|---|---:|---|
| `brand-primary` | `#C8102E` | CTA, enlaces activos, acentos |
| `brand-primary-hover` | `#E11D3F` | Hover |
| `brand-primary-dark` | `#8A0F22` | Gradientes y fondos |
| `brand-primary-soft` | `rgba(200,16,46,.14)` | Resaltados |
| `brand-primary-glow` | `rgba(200,16,46,.35)` | Brillos |

### Neutros

| Token | Valor |
|---|---:|
| `black` | `#000000` |
| `background` | `#050505` |
| `background-soft` | `#0A0A0A` |
| `surface` | `#101010` |
| `surface-raised` | `#171717` |
| `surface-muted` | `#202020` |
| `white` | `#FFFFFF` |
| `text-primary` | `#F7F7F7` |
| `text-secondary` | `#D2D2D2` |
| `text-muted` | `#8E8E8E` |
| `border` | `rgba(255,255,255,.09)` |
| `border-strong` | `rgba(255,255,255,.16)` |

### Estados

| Token | Valor |
|---|---:|
| `success` | `#22C55E` |
| `warning` | `#F59E0B` |
| `danger` | `#DC2626` |
| `info` | `#3B82F6` |

---

## 3. Gradientes

```css
--gradient-hero:
  linear-gradient(
    90deg,
    rgba(5,5,5,.96) 0%,
    rgba(5,5,5,.78) 36%,
    rgba(5,5,5,.30) 68%,
    rgba(5,5,5,.10) 100%
  );

--gradient-hero-bottom:
  linear-gradient(
    180deg,
    rgba(5,5,5,.05) 55%,
    rgba(5,5,5,.95) 100%
  );

--gradient-card:
  linear-gradient(
    145deg,
    rgba(255,255,255,.075),
    rgba(255,255,255,.025)
  );

--gradient-red:
  linear-gradient(
    135deg,
    #E11D3F 0%,
    #C8102E 45%,
    #8A0F22 100%
  );
```

---

## 4. Tipografía

```css
--font-display: "Bebas Neue", sans-serif;
--font-heading: "Oswald", sans-serif;
--font-body: "Inter", sans-serif;
```

| Token | Valor |
|---|---:|
| `display-xl` | `clamp(5rem, 9vw, 9rem)` |
| `display-lg` | `clamp(4rem, 7vw, 7rem)` |
| `h1` | `clamp(3.5rem, 6vw, 6rem)` |
| `h2` | `clamp(2.75rem, 4vw, 4.5rem)` |
| `h3` | `clamp(2rem, 3vw, 3rem)` |
| `h4` | `1.75rem` |
| `body-lg` | `1.25rem` |
| `body` | `1rem` |
| `small` | `.875rem` |
| `caption` | `.75rem` |

```css
--leading-display: .88;
--leading-heading: 1.05;
--leading-body: 1.65;

--tracking-display: .035em;
--tracking-heading: .02em;
--tracking-label: .10em;
```

---

## 5. Espaciado

Unidad base: `4px`.

```text
0  = 0
1  = 4px
2  = 8px
3  = 12px
4  = 16px
5  = 20px
6  = 24px
8  = 32px
10 = 40px
12 = 48px
16 = 64px
20 = 80px
24 = 96px
30 = 120px
40 = 160px
```

```css
--section-y-desktop: 120px;
--section-y-tablet: 88px;
--section-y-mobile: 64px;

--container-sm: 760px;
--container-md: 1040px;
--container-lg: 1320px;
--container-xl: 1520px;
--container-gutter: clamp(20px, 4vw, 48px);
```

---

## 6. Radios

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-2xl: 24px;
--radius-3xl: 32px;
--radius-pill: 999px;
--radius-circle: 50%;
```

---

## 7. Sombras

```css
--shadow-sm: 0 8px 24px rgba(0,0,0,.24);
--shadow-md: 0 18px 48px rgba(0,0,0,.40);
--shadow-lg: 0 30px 90px rgba(0,0,0,.58);
--shadow-red: 0 0 42px rgba(200,16,46,.28);
--shadow-red-strong: 0 0 72px rgba(200,16,46,.38);
```

---

## 8. Glassmorphism

```css
--glass-bg: rgba(16,16,16,.64);
--glass-bg-light: rgba(255,255,255,.055);
--glass-border: rgba(255,255,255,.10);
--glass-blur: 18px;
--glass-saturate: 130%;
```

```css
.glass {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter:
    blur(var(--glass-blur))
    saturate(var(--glass-saturate));
}
```

---

## 9. Breakpoints

```text
xs   390px
sm   640px
md   768px
lg   1024px
xl   1280px
2xl  1440px
3xl  1920px
```

Reglas:

- Mobile-first.
- Navbar móvil debajo de `1024px`.
- Grids de cuatro columnas desde `1280px`.
- Hero alineado a la izquierda en desktop y centrado en mobile.
- Reducir parallax en tablet.
- Desactivar parallax con `prefers-reduced-motion`.

---

## 10. Z-index

```text
base        0
decorative  10
content     20
sticky      40
navbar      60
dropdown    70
overlay     80
modal       90
toast       100
loader      110
```

---

## 11. Motion

```css
--motion-fast: 160ms;
--motion-normal: 280ms;
--motion-slow: 520ms;
--motion-reveal: 800ms;
--motion-hero: 1200ms;

--ease-out: cubic-bezier(.22,1,.36,1);
--ease-soft: cubic-bezier(.16,1,.3,1);
--ease-standard: cubic-bezier(.4,0,.2,1);
```

Reglas:

- Hover entre `160ms` y `280ms`.
- Reveal entre `650ms` y `850ms`.
- No usar `bounce` ni `elastic`.
- Animar principalmente `transform` y `opacity`.
- Evitar animar `width`, `height`, `top` y `left`.
- Respetar `prefers-reduced-motion`.

---

## 12. Tailwind CSS 4

```css
@import "tailwindcss";

@theme {
  --color-brand: #C8102E;
  --color-brand-hover: #E11D3F;
  --color-brand-dark: #8A0F22;

  --color-background: #050505;
  --color-surface: #101010;
  --color-surface-raised: #171717;

  --color-text: #F7F7F7;
  --color-muted: #8E8E8E;

  --font-display: "Bebas Neue", sans-serif;
  --font-heading: "Oswald", sans-serif;
  --font-sans: "Inter", sans-serif;

  --radius-card: 24px;
  --radius-button: 16px;

  --shadow-card: 0 18px 48px rgba(0,0,0,.40);
  --shadow-glow: 0 0 42px rgba(200,16,46,.28);
}
```

---

## 13. Variables CSS

```css
:root {
  color-scheme: dark;

  --page-bg: #050505;
  --page-text: #F7F7F7;
  --page-muted: #8E8E8E;

  --brand: #C8102E;
  --brand-hover: #E11D3F;
  --brand-dark: #8A0F22;

  --surface: #101010;
  --surface-raised: #171717;

  --border: rgba(255,255,255,.09);
  --border-strong: rgba(255,255,255,.16);

  --container: 1320px;
  --gutter: clamp(20px, 4vw, 48px);
  --navbar-height: 88px;
}
```

---

## 14. Iconografía

- Librería: Lucide React.
- Tamaños: 16, 20, 24 y 32 px.
- Stroke por defecto: `1.8`.
- Color base: `text-secondary`.
- Hover: `brand-primary`.
- No mezclar familias de iconos.

---

## 15. Checklist

- [ ] No hay colores hardcodeados fuera del sistema.
- [ ] No hay radios arbitrarios.
- [ ] Todos los espacios siguen la escala.
- [ ] Las animaciones respetan las duraciones definidas.
- [ ] Los textos cumplen contraste AA.
- [ ] Las imágenes tienen overlay suficiente.
- [ ] Los componentes reutilizan los mismos tokens.
- [ ] Mobile respeta un gutter mínimo de 20 px.

---

**Fin del documento.**
