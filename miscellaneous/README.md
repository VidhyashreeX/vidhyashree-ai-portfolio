# Future-Flow Portfolio Documentation

## 1) Project Purpose (for a 12-year-old)
This project is a personal portfolio website.
Think of it like an interactive digital storybook where each section tells a part of the developer's journey:
- Who she is
- What she can build
- What projects she has done
- How to contact her

The goal is to look modern and animated while still being fast and easy to use.

## 2) What This App Does
- Shows a full-screen personal background image with animated energy effects.
- Displays a hero section with typing animation.
- Shows About + Experience content.
- Shows a horizontally scrolling Projects section with 9 slots.
- Shows bottom action controls (Contact, CV) only when the user reaches the end of the page.
- Exposes backend APIs for projects, skills, education, and contact messages.
- Seeds initial sample data when DB/storage is empty.

## 3) Main Technology Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Query
- Wouter (routing)
- Three.js + @react-three/fiber

### Backend
- Node.js + Express 5
- TypeScript
- Drizzle ORM + Zod validation
- PostgreSQL driver (`pg`) with in-memory fallback storage

### Build/Tooling
- esbuild (server bundle)
- Vite (client build)
- tsx (run TS scripts)

## 4) Programming Languages and Tradeoffs

### TypeScript
Advantages:
- Catches many bugs before runtime.
- Great IDE autocomplete and safer refactors.
- Better team readability for large projects.

Disadvantages:
- Adds type complexity for beginners.
- Requires compile step and type maintenance.

### JavaScript (runtime)
Advantages:
- Runs directly in browser and Node.
- Huge ecosystem and community support.

Disadvantages:
- Dynamic behavior can cause runtime bugs.
- Async logic can be confusing without structure.

### CSS / Tailwind utility styling
Advantages:
- Fast UI iteration.
- Consistent spacing, color, and responsive behavior.

Disadvantages:
- Long class strings can be hard to scan.
- Needs strong design discipline to avoid inconsistency.

### SQL + ORM model approach (Drizzle)
Advantages:
- Strong schema structure for data.
- Type-safe query layer.

Disadvantages:
- Schema changes need migration discipline.
- ORM abstraction can hide SQL details for beginners.

## 5) Current Folder Organization (labeled)

- `client/`: Browser UI application
  - `client/src/pages/`: page-level screens and layout logic
  - `client/src/components/`: reusable UI sections
  - `client/src/hooks/`: API/data hooks
  - `client/src/lib/`: shared frontend utilities
  - `client/public/`: static assets (images, favicon)
- `server/`: Express API and runtime server
- `shared/`: shared API contracts and schemas used by both frontend and backend
- `script/`: build pipeline scripts
- `api/`: deployment/serverless entry integration
- `dist/`: generated production output

## 6) Important Files and Why They Matter

### UI Shell and Routing
1. `client/src/App.tsx`
- Key lines:
  - line 17 mounts global background animation layer.
  - lines 18-20 set route handling.
- Purpose: Entry UI shell and route switch.

2. `client/src/pages/Home.tsx`
- Key lines:
  - lines 55-87 typing animation state machine.
  - lines 89-104 bottom-of-page visibility logic.
  - lines 106-111 wheel-to-horizontal project scroll mapping.
  - lines 222-280 bottom fixed glass controls and signature text.
- Purpose: Main single-page experience and interaction logic.

3. `client/src/components/EnergyBackground.tsx`
- Key lines:
  - lines 22-43 wire animation frame update.
  - lines 99-244 cursor smoke particle system.
  - lines 213-220 bottom-zone color shift logic.
  - lines 253-264 full-screen photo + overlay setup.
- Purpose: Background visual engine (photo + particles + neon wires).

4. `client/src/components/Navigation.tsx`
- Key lines:
  - lines 55-72 active section tracking with IntersectionObserver.
  - lines 74-83 smooth section-scroll behavior.
- Purpose: Smooth single-page nav with active highlighting.

5. `client/index.html`
- Key line:
  - favicon now uses `site-favicon.svg` to avoid Replit icon.
- Purpose: Root HTML document.

### API and Data
6. `server/index.ts`
- Key lines:
  - lines 15-23 body parsers + raw body capture.
  - lines 36-60 request timing and API logging middleware.
  - lines 81-86 production static vs development Vite mode.
  - lines 92-103 HTTP server bind config.
- Purpose: Main server bootstrap and middleware wiring.

7. `server/routes.ts`
- Key lines:
  - lines 13-24 project endpoints.
  - lines 39-53 validated contact endpoint.
  - lines 63-143 startup seed workflow.
- Purpose: REST API contract implementation.

8. `server/storage.ts`
- Key lines:
  - lines 36-95 database-backed storage implementation.
  - lines 97-171 in-memory fallback implementation.
  - line 173 runtime storage selection.
- Purpose: Data source abstraction.

9. `shared/schema.ts`
- Key lines:
  - lines 8-46 table models for projects/skills/education/messages.
  - lines 50-53 insert schema generation.
  - lines 57-72 exported types used across app.
- Purpose: Single source of truth for DB and validation types.

10. `client/src/hooks/use-projects.ts`
- Key lines:
  - lines 4-13 projects list fetch + validation.
  - lines 15-27 project detail fetch logic.
- Purpose: Typed API fetching for project UI.

11. `client/src/hooks/use-contact.ts`
- Key lines:
  - lines 6-23 mutation for sending contact message.
- Purpose: Contact form submission logic.

### Build and Runtime
12. `script/build.ts`
- Key lines:
  - line 36 clears `dist`.
  - line 39 runs Vite client build.
  - lines 49-61 bundles server as `dist/index.cjs`.
- Purpose: Production build pipeline.

13. `server/static.ts`
- Key lines:
  - lines 5-18 static serving and SPA fallback.
- Purpose: Serve built frontend in production.

14. `server/vite.ts`
- Key lines:
  - lines 11-30 Vite middleware dev server setup.
  - lines 47-51 dynamic cache-busting in dev HTML template.
- Purpose: Development-time SSR-ish middleware delivery.

## 7) Workflow: Request to Render
1. Browser loads `/`.
2. `App.tsx` mounts providers + global background + Home page.
3. `Home.tsx` requests projects via `useProjects()`.
4. Frontend calls Express route `/api/projects`.
5. `server/routes.ts` delegates to `storage`.
6. `storage` reads DB (or memory fallback).
7. JSON is returned and validated with shared schemas.
8. UI renders cards and interactions.

## 8) Line of Code Snapshot (current)
- Total code-like files scanned: 77 files
- Total lines scanned: 7,324 lines
- By area:
  - `client`: 6,551 lines
  - `server`: 511 lines
  - `shared`: 165 lines
  - `api + script`: 106 lines

Top heavy files (by line count):
- `client/src/components/ui/sidebar.tsx` (727)
- `client/src/components/ui/chart.tsx` (365)
- `client/src/pages/Home.tsx` (283)
- `client/src/components/EnergyBackground.tsx` (282)

## 9) Visual Design System Used
- Primary accent: electric cyan family (`#00f0ff` and related glows).
- Base background: deep navy/blue tones with image-overlay blending.
- Motion system:
  - Typing animation for role text.
  - Cursor-smoke particles with dynamic color shift near bottom.
  - Neon wire animated lines (Three.js).
  - Section and component fade/slide reveals.
- Glass style:
  - Blurred, translucent, rounded controls for Contact and CV.

## 10) References and Inspiration
- Hover interaction direction requested by user: Aristide Benoist style behavior.
- Glass-inspired UI direction requested by user: modern Apple-like frosted components.
- External icon/logo sources used during iteration: Devicon CDN and related SVG icon sets.

## 11) Iteration History (from this implementation cycle)
High-level progression:
1. Started with basic portfolio skeleton.
2. Fixed local run workflow and localhost serving.
3. Repaired runtime mismatch issues between build/dev paths.
4. Added energy background animation system.
5. Expanded cursor smoke effect to full-page behavior.
6. Added bottom-zone color transition for particles.
7. Switched gradient background to full-image background.
8. Aligned image to right side and tuned scaling.
9. Introduced and later removed separate Projects page.
10. Moved projects to main page.
11. Converted project browsing to horizontal strip using vertical wheel input.
12. Implemented bottom-only appearance logic for Contact/CV controls.
13. Added center-bottom signature line.
14. Replaced tab icon to remove Replit favicon.
15. Built and rebuilt production output repeatedly to validate each stage.

Approximate number of significant visual/behavior changes in this cycle: 15+.

## 12) Diagnostics and Deployment Issues Encountered
1. Node runtime mismatch with Vite (`crypto.hash` issue)
- Symptom: dev/build failed on Node 18 for Vite internals.
- Fix: used production build path and adjusted workflow accordingly.

2. Port binding and sandbox restrictions (`EPERM`, `EADDRINUSE`)
- Symptom: server could not bind or port already occupied.
- Fix: managed listener process, restarted services, verified active PID.

3. Asset not visible after adding image
- Symptom: image existed in `client/public` but not displayed.
- Root cause: running build output did not include latest asset yet.
- Fix: rebuild + restart so `dist/public` included the file.

4. Type mismatch in route component (historical)
- Symptom: typed route prop mismatch when a separate Projects route existed.
- Fix: route architecture simplified to single-page flow.

5. Favicon mismatch (Replit icon)
- Symptom: browser tab still showed unwanted icon.
- Fix: changed root HTML favicon link to custom SVG in `client/public/site-favicon.svg`.

## 13) How to Run
```bash
npm install
npm run dev
```

Production:
```bash
npm run build
npm start
```

## 14) Non-technical Summary
This is a polished portfolio website where animation, design, and interaction were refined through many iterations. The final system uses modern web tools, typed APIs, and careful UI behavior so the site feels professional while staying maintainable.

