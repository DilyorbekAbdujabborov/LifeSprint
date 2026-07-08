# LifeSprint Design System

## 1. Design Read

LifeSprint - bu ta'lim va gamification platformasi. Shuning uchun design language:

- aniq;
- ishonchli;
- energiyali;
- data-friendly;
- premium, lekin shovqinsiz.

Bu ilova uchun eng to'g'ri yo'nalish:

- "Academic OS"
- "Midnight classroom"
- "Learning cockpit"

Ya'ni:

- chapda navigatsiya;
- markazda task / learning content;
- yuqorida status, XP, notifications;
- o'ngda yordamchi va summary;
- signal ranglar faqat ma'noli holatlar uchun.

## 2. Visual Principles

### 2.1 Asosiy tamoyillar

- Har bir komponent bitta vazifa bajaradi.
- Rang statusni bildiradi, bezak emas.
- Card faqat hierarchy bo'lsa ishlatiladi.
- Motion faqat feedback va yo'naltirish uchun.
- Og'ir gradientlar va ortiqcha neon ishlatilmaydi.

### 2.2 Tonal identitet

- Background: sovuq, toza, chuqur.
- Primary accent: electric blue.
- Reward accent: amber.
- Success: emerald.
- Danger: rose/red.
- Info: sky/cyan.

Bu tanlov ilovaning ta'lim va performance ruhiga mos, va generic purple-dashboard ko'rinishidan qochadi.

## 3. Foundation Tokens

### 3.1 Color tokens

Light theme:

- `--bg`: `#f4f7fb`
- `--surface`: `#ffffff`
- `--surface-2`: `#f8fafc`
- `--surface-3`: `#eef2f7`
- `--text`: `#0f172a`
- `--text-muted`: `#475569`
- `--border`: `rgba(15, 23, 42, 0.10)`
- `--brand`: `#2563eb`
- `--accent`: `#14b8a6`
- `--reward`: `#f59e0b`
- `--success`: `#22c55e`
- `--warning`: `#f97316`
- `--danger`: `#ef4444`
- `--info`: `#38bdf8`

Dark theme:

- `--bg`: `#08101f`
- `--surface`: `#111827`
- `--surface-2`: `#162033`
- `--surface-3`: `#1e293b`
- `--text`: `#e5eefc`
- `--text-muted`: `#b3c0d4`
- `--border`: `rgba(148, 163, 184, 0.18)`
- `--brand`: `#60a5fa`
- `--accent`: `#2dd4bf`
- `--reward`: `#fbbf24`
- `--success`: `#4ade80`
- `--warning`: `#fb923c`
- `--danger`: `#f87171`
- `--info`: `#7dd3fc`

### 3.2 Radius tokens

- `--radius-xs`: 10px
- `--radius-sm`: 14px
- `--radius-md`: 18px
- `--radius-lg`: 24px
- `--radius-xl`: 32px
- `--radius-pill`: 9999px

### 3.3 Shadow tokens

- `--shadow-xs`: minimal lift
- `--shadow-sm`: default card
- `--shadow-md`: elevated panel
- `--shadow-lg`: modal / hero depth

### 3.4 Motion tokens

- Duration fast: 120ms
- Duration normal: 180ms
- Duration slow: 260ms
- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`

Motion policy:

- transform and opacity only;
- hover is subtle;
- active state gives physical press;
- respect reduced motion.

### 3.5 Typography

Recommended stack:

- Display: `Inter`, `ui-sans-serif`, system stack
- Body: `Inter`, `ui-sans-serif`, system stack
- Mono: `ui-monospace`, `SFMono-Regular`, `SF Mono`, `Consolas`, monospace

If brand wants a more expressive version later:

- display can move to `Space Grotesk` or `Sora`;
- mono can move to `JetBrains Mono`.

### 3.6 Spacing scale

Use a 4px base grid:

- 4
- 8
- 12
- 16
- 20
- 24
- 32
- 40
- 48
- 64

## 4. Semantic Layers

### 4.1 Surfaces

- `surface-base`: page background
- `surface-panel`: normal cards
- `surface-raised`: important panels
- `surface-overlay`: modals / drawers

### 4.2 Text hierarchy

- `text-primary`
- `text-secondary`
- `text-tertiary`
- `text-inverse`
- `text-link`

### 4.3 Status hierarchy

- `brand`: navigation, primary CTA, selected states
- `accent`: supportive emphasis
- `reward`: XP / coin / gamification
- `success`: completed states
- `warning`: waiting / caution
- `danger`: destructive / failure
- `info`: informational / helper

## 5. Component Rules

### 5.1 Buttons

Allowed variants:

- primary
- secondary
- ghost
- destructive

Rules:

- one primary CTA per section;
- label must fit on one line;
- focus ring visible;
- active state must be tactile.

### 5.2 Inputs

Rules:

- label above input;
- helper text below;
- error text below helper;
- placeholder never acts as label;
- height at least 44px.

### 5.3 Cards

Rules:

- card only when elevation adds meaning;
- otherwise use borders and spacing;
- card radius must follow the token scale;
- no mixed random radii in the same page.

### 5.4 Navigation

Rules:

- single-line desktop nav;
- mobile drawer on small screens;
- active state should be obvious;
- sidebar state must survive page refresh if relevant.

### 5.5 Data views

Rules:

- numbers align with tabular rhythm;
- charts and stats should use semantic colors only;
- empty states should explain what to do next.

## 6. Page Architecture

### 6.1 App shell

- sidebar
- header
- content viewport
- overlays

### 6.2 Screen types

- dashboard
- detail explorer
- form/editor
- ranking/analytics
- modal/overlay

### 6.3 Layout rhythm

- desktop: 2-column or 3-column grid where useful;
- mobile: stack everything explicitly;
- avoid long chains of identical split sections;
- use alternating density, not repetitive templates.

## 7. Migration Plan

### Phase 1

- Keep current React structure.
- Introduce global tokens in `data/design-tokens.css`.
- Stop adding new hardcoded colors unless they map to tokens.

### Phase 2

- Replace repeated purple/gray literals with semantic tokens.
- Create reusable primitives:
  - button
  - panel
  - chip
  - stat tile
  - input field

### Phase 3

- Move module styles to token-based variants.
- Formalize component usage rules in code.
- Reduce duplicated hardcoded layout classes.

## 8. What This System Fixes

- generic AI-purple feel;
- inconsistent backgrounds;
- random radius and shadow choices;
- unclear priority between surfaces;
- status colors used as decoration instead of meaning.

## 9. What Still Needs Work

- Some current components still use hardcoded colors.
- Some screens still behave like demos, not production modules.
- Role-based permissions need a stronger backend policy.
- State ownership needs more normalization.

## 10. Final Direction

LifeSprint should look like a serious learning platform, not a template.

The system should feel:

- structured;
- energetic;
- academically credible;
- data-rich;
- confident without being loud.
