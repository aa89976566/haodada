# AGENTS.md

Persistent technical instructions for coding agents working in this repository.

Authoritative visual source: the live thisfoot mirror in this repo (`src/data/thisfootHtml.ts`, `public/thisfoot.css`, `public/_nuxt/**`, `public/images/**`), plus any screenshots or references supplied in the task. Technical difficulty is not permission to redesign.

Supplied hero / reference images are **visual baselines**. The responsive implementation is HTML + CSS + individual static assets — never a full-page screenshot used as the page.

## Repository map

Do not invent directories. Current layout:

| Path | Responsibility |
| --- | --- |
| `src/app/layout.tsx` | Root layout, metadata, viewport; loads `/thisfoot.css` via `asset()` |
| `src/app/page.tsx` | Renders `HomePage` only |
| `src/app/globals.css` | Minimal reset / preloader / video tweaks; must not become a second design system |
| `src/components/HomePage.tsx` | Client shell: preloader + `dangerouslySetInnerHTML` of the mirrored page; `withBase()` rewriting |
| `src/data/thisfootHtml.ts` | Canonical page markup string (`THISFOOT_HTML`) — primary asset path source for the rendered page |
| `src/lib/asset.ts` | `asset(path)` — prefixes `NEXT_PUBLIC_BASE_PATH` for React-side URLs |
| `src/lib/utils.ts` | `cn()` helper (shadcn scaffolding; unused by the current page) |
| `public/thisfoot.css` | Canonical site styles, fonts, layout, hero-drive rules, motion |
| `public/_nuxt/img/` | Captured raster assets (hashed filenames) |
| `public/_nuxt/fonts/` | Captured webfonts referenced by `thisfoot.css` |
| `public/_nuxt/videos/` | Captured video (`a52d925.mp4`) |
| `public/images/` | Project hero assets (`hero-drive.jpg`, `hero-drive.webp`) |
| `public/img/phonenumbers/` | Phone CTA images |
| `public/social/` | Open Graph / Twitter share cards |
| `public/privacypolicy.pdf` | Linked legal asset |
| `next.config.ts` | Static export, `images.unoptimized`, GitHub Pages `basePath` / `assetPrefix` |
| `.github/workflows/deploy-pages.yml` | `npm ci` → `NEXT_PUBLIC_BASE_PATH=/haodada` → `npm run build` → `out/` |

Stack: Next.js 15 App Router, React 19, TypeScript strict, static `output: "export"`, npm (`package-lock.json`).

Styling system in production: **`public/thisfoot.css` + minimal `globals.css`**, not Tailwind utility classes. Tailwind 4 / PostCSS / `components.json` (shadcn) exist as unused scaffolding.

There is no `src/components/ui/` tree and no `src/data/assets.ts`.

## Rendering architecture (do not replace)

The page is a static HTML mirror injected by React:

1. `src/app/page.tsx` → `HomePage`
2. `HomePage` injects `THISFOOT_HTML` via `dangerouslySetInnerHTML`
3. Layout and look come from `public/thisfoot.css` (linked in `layout.tsx`) plus small overrides in `globals.css`

Unless the user explicitly requests an architecture change, agents must not:

- Replace `dangerouslySetInnerHTML` with React component trees
- Migrate the static mirror into JSX / Tailwind / shadcn components
- Change App Router routing or the static-export model
- Introduce Tailwind, `motion`, or other unused deps into the live page while doing visual or asset-placement work

## Current asset-resolution mechanism

There is **no** typed asset manifest in this repository. Do not invent one during visual work.

How assets resolve today:

| Surface | Mechanism |
| --- | --- |
| Markup inside `THISFOOT_HTML` | Root-absolute paths such as `/_nuxt/img/...`, `/images/...`, `/img/...`, `/social/...`, `/privacypolicy.pdf` |
| GitHub Pages prefix for that markup | `HomePage` `withBase()` rewrites matching `src` / `href` / `srcset` when `NEXT_PUBLIC_BASE_PATH` is set |
| React / layout URLs (e.g. stylesheet) | `asset()` from `src/lib/asset.ts` prefixes `NEXT_PUBLIC_BASE_PATH` |
| Next config on CI | `GITHUB_ACTIONS=true` enables `basePath` / `assetPrefix` `/haodada` in `next.config.ts` |
| Files on disk | Under `public/` at the same path after the leading `/` |

Rules for assets referenced in `thisfootHtml.ts`:

- Keep the existing HTML convention: root-absolute paths that `withBase()` already understands
- Place or replace files under the matching `public/` folder
- Update `alt`, `width`, `height`, `src`, `srcset`, and class names in the HTML string when the asset changes
- Do not invent a parallel TypeScript manifest, React `<Image>` tree, or scattered JSX path constants to “own” those references

Preserve the basePath contract:

- React-side: `asset()`
- Injected HTML: root-absolute paths + `withBase()`
- Do not remove or redesign this pairing to “make assets work”

## Canonical commands

Use only commands that exist:

| Purpose | Command |
| --- | --- |
| Install | `npm ci` (preferred) or `npm install` |
| Development | `npm run dev` |
| Production build | `npm run build` (writes `out/`) |
| Lint | `npm run lint` |
| Typecheck | `npx tsc --noEmit` |

`package.json` also defines `npm run start` (`next start`). With `output: "export"`, the deployable artifact is `out/`. Prefer `npm run dev` for interactive UI checks. Do not treat `next start` as proof the static export is correct.

GitHub Pages local parity (CI sets both; `next.config.ts` gates `basePath`/`assetPrefix` on `GITHUB_ACTIONS=true`, while `asset()` / `withBase()` use `NEXT_PUBLIC_BASE_PATH`):

```bash
export GITHUB_ACTIONS=true
export NEXT_PUBLIC_BASE_PATH=/haodada
npm run build
```

Unavailable in this repository — do not require, invent, or auto-install for ordinary tasks:

- No format / Prettier command or config
- No unit test script or runner
- No Playwright install or Playwright command
- No screenshot-baseline suite or baseline-update workflow
- No typed asset manifest (`src/data/assets.ts` does not exist)

## Change discipline

1. Inspect relevant files before editing (`HomePage.tsx`, `thisfootHtml.ts`, `thisfoot.css`, `asset.ts`, `layout.tsx`, target `public/` assets).
2. Make the smallest sufficient patch.
3. Never rewrite all of `THISFOOT_HTML` or `HomePage` to fix one positioning problem.
4. Preserve unrelated markup, copy, class names, asset paths, SMS links, and chat content.
5. Do not add dependencies unless required by the task and reported on completion.
6. Review the final diff before claiming done.

### Smallest appropriate surface for visual fixes

Prefer, in order:

1. **Styling / positioning** in `public/thisfoot.css` (and only if needed, tiny overrides in `src/app/globals.css`)
2. **HTML structure** edits inside `src/data/thisfootHtml.ts` (single nodes / attributes, not a full rewrite)
3. **Static asset** edits in existing public folders (`public/images/`, `public/_nuxt/img/`, `public/img/`, etc.)
4. **Rendering-shell** edits in `HomePage.tsx` / `layout.tsx` only when strictly necessary (e.g. `withBase()` path coverage)

Do not migrate architecture, introduce Tailwind, or rebuild the page in React to fix placement.

## Approved-design lock

Treat supplied screenshots and the current approved mirror as specifications.

Unless redesign is explicitly requested, do not:

- Change composition, section order, or visual hierarchy
- Change the color system (`#213c86`, `#ffd150`, `#3861d2`, `#ff0400`, `#ff4d4d`, `#ffc800`, `#18a7e5`, black/white chat surfaces)
- Replace typography roles (SpaceMono / Andale Mono / Dominion / chat system fonts)
- Convert the yellow phone column, desktop wings, or chat into generic card layouts
- Simplify intentional art direction or MSCHF/thisfoot structure
- Introduce a new design system
- Modify approved copy while fixing layout
- Replace supplied or captured assets with placeholders, stock photos, or regenerated images
- Delete or rename hashed `public/_nuxt/**` assets without updating every reference in `thisfootHtml.ts` and `thisfoot.css`

The custom Drive hero (`public/images/hero-drive.*` + `.hero-drive-*` rules in `thisfoot.css`, referenced from `THISFOOT_HTML`) is an approved insertion. The image files are a visual baseline; responsive behavior remains the `<picture>` / `.hero-drive-wrap` markup and CSS (`aspect-ratio`, `object-fit`, breakpoints). Do not replace that implementation with a full-page generated screenshot.

## Asset inspection

Before integrating or repositioning any image, inspect:

- Natural width and height
- Aspect ratio
- Transparency (most `public/_nuxt/img/*.png` and phone CTAs are RGBA cutouts)
- Subject bounding area and built-in whitespace
- Background contamination
- Focal point and intended crop
- Desktop behavior (center column `414px` from `769px` up; side columns fixed)
- Mobile behavior (`max-width: 768px`, side columns `.is-hidden-mobile`)

If an asset is poorly prepared, fix or crop the asset file. Do not compensate with fragile layout hacks.

When changing a significant image in the mirror:

- Keep intrinsic `width` / `height` accurate in the HTML (hero-drive example: `2394×1360`)
- Keep a stable wrapper class and matching `aspect-ratio` / `object-fit` / `object-position` in `thisfoot.css`
- Prefer `contain` for logos, cutouts, and desktop side art; use `cover` only where cropping is already approved (mobile hero-drive: `cover` + `object-position: center 42%`; desktop hero-drive: `contain` on `#213c86`)
- Do not stretch, randomly pixel-offset, or replace assets merely because positioning is hard
- Do not add new negative-margin “asset repairs” (existing mirror offsets such as CTA `margin-top: -61px` are approved legacy)

## Positioning contract

Use the existing flex / fixed-column system in `thisfoot.css`, or additive Grid / Flexbox / `minmax()` / `clamp()` / intrinsic sizing / container queries when extending.

Absolute positioning only for deliberate artwork layering inside a local positioned container (existing: `#MSCHFPreloader`, `.pointer`, chat bubble tails).

Position the **wrapper**, not ad-hoc image transforms.

Forbid fragile new coordinates such as `left: 847px; top: 193px`. Prefer proportional rules (`left: 50%`, `width: clamp(...)`, `transform: translateX(-50%)`).

Preserve desktop: center phone column `414px` from `769px` up; wings `width: calc((100% - 414px) / 2)` with `position: fixed`.

## Layering contract

Layered sections should use a local stacking context:

```css
position: relative;
isolation: isolate;
min-width: 0;
overflow: clip;
```

Documented z-index scale (extend only with nearby named steps):

| Use | Value |
| --- | --- |
| Chat bubble pseudo tails | `0` / `1` |
| Preloader inner frame | `9` |
| Preloader overlay | `99` |

Forbid arbitrary values such as `z-index: 9999`.

## Responsive contract

Breakpoints in `public/thisfoot.css`:

- `max-width: 768px` — mobile; hide `.is-hidden-mobile`
- `min-width: 769px` — desktop; center column `414px`, fixed side columns

Do not create mobile layouts by only shrinking the desktop wings.

Manual verification viewports (unless the task defines another matrix):

```text
1440 × 900
1280 × 800
834 × 1194
390 × 844
320 × 568
```

Require zero unintended horizontal overflow at `320px` (`html { overflow-x: hidden }` is not a license to clip meaningful content).

When testing Pages builds, confirm asset URLs resolve under `/haodada/`.

## Content / layout separation

Page content for the mirror lives in `src/data/thisfootHtml.ts`. Layout lives in `public/thisfoot.css` (and minimal `globals.css`).

Do not grow `THISFOOT_HTML` with inline styles for positioning.

Generated content must not invent parallel JSX, CSS design systems, class-name schemes, layout values, or a second asset path system. Layout stays in CSS; asset identity stays in the HTML path convention above.

## Visual verification loop

No automated visual test runner exists. For UI or asset changes, verify manually in the browser:

1. Run `npm run dev` (or a Pages-parity build served for inspection).
2. Open `/` and dismiss or skip the preloader (`sessionStorage` key `thisfoot-entered`).
3. Manually resize or device-emulate each viewport in the matrix above.
4. Capture screenshots as needed and compare to the approved reference / prior approved render.
5. Identify the largest visual mismatch.
6. Fix one mismatch at a time via the smallest surface (CSS → HTML → asset → shell).
7. Re-render and re-compare.
8. Stop only when acceptance criteria pass.

Do not claim visual accuracy without inspecting the rendered result. A green `npm run build` is not visual proof.

## Validation

Before completion, run what exists:

1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run build`
4. For visual work: manual browser verification at the viewport matrix (and basePath check when Pages-relevant)

Do not require format, unit-test, Playwright, or baseline-update commands — they are not available.

Skip a listed step only with an explicit reason in the completion report.

## Future recommendations (not current requirements)

These are optional future work and require **explicit user approval** before implementation:

1. **Typed asset manifest** (e.g. `src/data/assets.ts`) — architectural change; a TS manifest cannot control paths inside injected HTML unless the rendering model is also redesigned.
2. **Playwright (or similar) visual regression** with checked-in baselines and intentional human review for baseline updates.

Do not install these, migrate the mirror to consume a manifest, or invent a baseline-update workflow during ordinary visual/asset tasks.

Never update screenshot baselines automatically just to make tests pass (applies only if such a suite is later approved and added).

## Determinism

When capturing manual comparison screenshots:

- Use stable files from `public/`
- Control preloader state (`thisfoot-entered`)
- Prefer consistent browser, locale, and timezone
- Honor `prefers-reduced-motion` rules already in `thisfoot.css` when motion would obscure layout comparison

## Completion report

Report:

- Files changed
- Behavior / visuals changed
- Commands executed
- Validation results
- Viewports inspected (manual)
- Remaining visual differences vs reference
- Any skipped validation and why

## Hard-stop conditions

Stop and ask for clarification when:

- Authoritative references conflict (task screenshot vs current approved mirror vs live thisfoot capture)
- A required asset is missing from `public/`
- A redesign appears necessary but was not authorized
- The fix would require replacing `dangerouslySetInnerHTML`, migrating to React/Tailwind, or other architecture changes
- Introducing an asset manifest or Playwright appears necessary but was not approved
- Acceptance criteria cannot be determined safely
- GitHub Pages `basePath` handling would need to be removed or redesigned to “make assets work”
)
