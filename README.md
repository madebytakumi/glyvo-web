# Glyvo Web (PWA)

Registro personal de salud y diabetes. Migración de la app Expo/React Native
(`../glyvo-app`) a una **PWA** con Vite + React + Tailwind, **online directo a
Supabase** (sin base de datos local ni sincronización).

## Stack

- **Vite + React 19 + TypeScript** (estricto)
- **Tailwind CSS v4** (tokens de tema claro/oscuro vía clase `.dark`)
- **Supabase** (`@supabase/supabase-js`) — auth + Postgres con RLS
- **TanStack React Query** (caché de datos) · **React Router** (rutas)
- **React Hook Form + Zod** (formularios y validación)
- **i18next** (es/en) · **Zustand** (auth/tema)
- **Recharts** (gráficas, lazy) · **lucide-react** (iconografía)
- **@react-pdf/renderer** (export PDF, cargado por import dinámico)
- **vite-plugin-pwa** (manifest + service worker) · **Vitest** (tests)

## Diseño

UI web-responsive con identidad **morado pastel**: sidebar fija en desktop +
barra inferior en móvil (`src/routes/`), grids multi-columna, gráficas (tendencia
de glucosa + adherencia) y dos mascotas, un **Beagle** y un **Pug**
(`src/components/mascots/`, SVG propio). Las zonas de glucosa y los estados se
mantienen saturados por claridad médica. Íconos PWA: `npm run gen-icons`
(rasteriza `public/mascots.svg`).

## Módulos

Glucosa, Comidas, Insulina, Medicamentos (catálogo + horarios + tomas del día
con adherencia) y Notas. Más Dashboard, Reportes (CSV/PDF) y Ajustes.

## Configuración

1. Copia `.env.example` a `.env` y completa las credenciales de Supabase:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
   La anon key es segura en el cliente: RLS protege cada fila por `auth.uid()`.
2. Esquema de la base de datos: `supabase/migrations/0001_init.sql`
   (8 tablas con RLS; aplícalo en un proyecto Supabase nuevo si hace falta).

## Scripts

```bash
npm run dev        # servidor de desarrollo
npm run build      # typecheck + build de producción (genera el service worker)
npm run preview    # sirve el build de producción
npm run test       # pruebas (Vitest)
npm run typecheck  # solo verificación de tipos
npm run lint       # oxlint
```

## Arquitectura

Organización por feature (`src/features/<dominio>/`):

- `model.ts` — tipos de dominio y lógica pura (zonas, adherencia, tags…)
- `schema.ts` — validación Zod (única fuente de verdad para formularios)
- `repository.ts` — IO contra Supabase (snake_case ↔ camelCase en un único mapper)
- `service.ts` / `instance.ts` — lógica de negocio inyectable (DIP) y su wiring
- `queries.ts` — hooks de React Query
- `components/` · `pages/` — UI

Base reutilizable en `src/shared/data/supabaseRepository.ts`
(`createSupabaseRepository`), que centraliza el CRUD y el mapeo de columnas base.

## Despliegue

Build estático (`dist/`) desplegable en cualquier hosting estático
(Vercel, Netlify, Cloudflare Pages). Configura las variables `VITE_*` en el
proveedor. SPA: redirige todas las rutas a `index.html`.

El service worker cachea el app-shell (offline-first del shell); **los datos
requieren conexión** (online directo a Supabase).
