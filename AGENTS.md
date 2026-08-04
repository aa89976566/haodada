# AGENTS.md

Persistent technical instructions for coding agents working in this repository.

Authoritative visual source: the live thisfoot mirror implementation in this repo (`src/data/thisfootHtml.ts`, `public/thisfoot.css`, `public/_nuxt/**`, `public/images/**`), plus any screenshots or references supplied in the task. Technical difficulty is not permission to redesign.

## Repository map

Do not invent directories. Current layout:

| Path | Responsibility |
| --- | --- |
| `src/app/layout.tsx` | Root layout, metadata, viewport, loads `public/thisfoot.css` via `asset()` |
| `src/app/page.tsx` | Renders `HomePage` only |
| `src/app/globals.css` | Minimal reset / preloader / video tweaks; must not become a second design system |
| `src/components/HomePage.tsx` | Client shell: preloader + `dangerouslySetInnerHTML` of the mirrored page; basePath rewriting |
| `src/data/thisfootHtml.ts` | Canonical page markup string (`THISFOOT_HTML`) |
| `src/lib/asset.ts` | `asset(path)` — prefixes `NEXT_PUBLIC_BASE_PATH` for GitHub Pages |
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

Styling system in production: **`public/thisfoot.css` + minimal `globals.css`**, not Tailwind utility classes. Tailwind 4 / PostCSS / `components.json` (shadcn) exist as unused scaffolding. Do not migrate the mirror to Tailwind, shadcn, or `motion` unless explicitly requested.

Canonical UI component: `src/components/HomePage.tsx` + markup in `src/data/thisfootHtml.ts`. There is no `src/components/ui/` tree.

## Canonical commands

Use only commands that exist. From `package.json` and `tsconfig.json`:

| Purpose | Command |
| --- | --- |
| Install | `npm ci` (preferred) or `npm install` |
| Development | `npm run dev` (`next dev --turbopack`) |
| Production build | `npm run build` (writes static site to `out/`) |
| Lint | `npm run lint` |
| Typecheck | `npx tsc --noEmit` |

`package.json` also defines `npm run start` (`next start`). This project uses `output: "export"`; production artifact is `out/`. Prefer `npm run dev` for interactive UI checks. Do not treat `next start` as proof the static export is correct.

GitHub Pages local parity (CI sets both; `next.config.ts` gates `basePath`/`assetPrefix` on `GITHUB_ACTIONS=true`, while `asset()` / `withBase()` use `NEXT_PUBLIC_BASE_PATH`):

```bash
export GITHUB_ACTIONS=true
export NEXT_PUBLIC_BASE_PATH=/haodada
npm run build
```

Not present in this repository (do not invent or auto-install during unrelated tasks):

- No formatter script / Prettier config
- No unit test runner or `test` script
- No Playwright / Storybook / screenshot baseline suite
- No active design-token module (colors/type live in `public/thisfoot.css` and `src/app/globals.css`)

## Change discipline

1. Read the relevant files (`HomePage.tsx`, `thisfootHtml.ts`, `thisfoot.css`, `asset.ts`, `layout.tsx`, target assets) before editing.
2. Make the smallest sufficient patch. Prefer editing CSS selectors or a single markup node over rewriting the HTML string or the component.
3. Never rewrite all of `THISFOOT_HTML` or `HomePage` to fix one positioning problem.
4. Preserve unrelated markup, copy, class names, asset paths, SMS links, and chat content.
5. Do not refactor unused scaffolding (`utils.ts`, Tailwind, shadcn, `motion`) into the live page without an explicit request.
6. Do not add dependencies unless required by the task and documented in the completion report.
7. Keep GitHub Pages basePath behavior intact: React-side URLs through `asset()`; HTML-string URLs through `HomePage` `withBase()` rewriting for `/_nuxt/`, `/img/`, `/images/`, `/social/`, `/privacypolicy.pdf`.
8. Review the final diff before claiming done.

## Approved-design lock

Treat supplied screenshots and the current approved mirror as specifications.

Unless redesign is explicitly requested, do not:

- Change composition, section order, or visual hierarchy
- Change the color system (`#213c86`, `#ffd150`, `#3861d2`, `#ff0400`, `#ff4d4d`, `#ffc800`, `#18a7e5`, black/white chat surfaces)
- Replace typography roles (SpaceMono / Andale Mono / Dominion / chat system fonts)
- Convert the yellow phone column, desktop wings, or chat into generic card layouts
- Simplify intentional art direction or MSCHF/thisfoot structure
- Introduce a new design system (Tailwind redesign, shadcn components, new token files)
- Modify approved copy while fixing layout
- Replace supplied or captured assets with placeholders, stock photos, or regenerated images
- Delete or rename hashed `public/_nuxt/**` assets without updating every reference in `thisfootHtml.ts` and `thisfoot.css`

The custom Drive hero (`public/images/hero-drive.*` + `.hero-drive-*` rules in `thisfoot.css`) is an approved insertion. Do not remove it or swap it for a full-page screenshot implementation unless asked.

## Asset manifest

Significant visual assets must be registered in one typed manifest at `src/data/assets.ts` (create when first needed; keep it the single registry).

Required entry shape:

```ts
{
  src: string;
  alt: string;
  width: number;
  height: number;
  role: string;
  fit: "contain" | "cover";
  position: string;
  priority?: boolean;
}
```

Rules:

- Components and markup generators must consume significant assets through this manifest (or derive paths from it), not scatter hard-coded image paths across new JSX.
- Existing captured paths inside `THISFOOT_HTML` remain valid until intentionally migrated; when touching an asset, register it in the manifest and keep `src` synchronized with `public/`.
- Always record intrinsic `width` / `height` from the real file (examples already in tree: hero-drive `2394×1360`; logo `42ca3f1.png` `1101×498`).
- Use `asset(src)` when emitting URLs from React. Inside `THISFOOT_HTML`, keep root-absolute paths (`/images/...`, `/_nuxt/...`) so `withBase()` can rewrite them.
- Do not replace an existing registered asset merely because positioning is difficult.

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

If an asset is poorly prepared (excess canvas, wrong matte, subject off-center), fix or crop the asset file. Do not compensate with fragile layout hacks.

## Image-container contract

Every significant image must have:

- Explicit intrinsic `width` and `height` (as on `.hero-drive-img`)
- A stable parent wrapper (e.g. `.hero-drive-wrap`)
- Reserved `aspect-ratio` matching the asset
- Explicit `object-fit` and `object-position`
- Responsive sizing via `%` / `max-width` / media queries in `thisfoot.css`
- Accurate `alt` text

Fit rules for this repo:

- `contain` for isolated products, characters, logos, cutouts, and desktop hero side art
- `cover` only where cropping is approved (current mobile hero-drive uses `cover` with `object-position: center 42%`; desktop hero-drive uses `contain` on `#213c86`)
- Transparent PNG/WebP for movable foreground objects (pointer, logos, phone numbers)
- Important text in HTML/CSS, not baked into AI images when avoidable
- `next/image` is configured `unoptimized: true` for static export; do not assume optimizer behavior

Forbid:

- Stretching (`width`/`height` mismatch without controlled `object-fit`)
- Uncontrolled cropping
- Negative margins used to repair bad assets (existing mirror offsets such as CTA `margin-top: -61px` are approved legacy; do not add new ones to fix new assets)
- Random pixel coordinates for new work
- Full-page generated screenshots used as the responsive implementation
- Positioning important elements relative to `body`
- Replacing `hero-drive.jpg` / `.webp` or `_nuxt` assets because layout is hard

## Positioning contract

Structural layout must use the existing flex / fixed-column system in `thisfoot.css`, or additive Grid / Flexbox / `minmax()` / `clamp()` / intrinsic sizing / container queries when extending.

Absolute positioning is allowed only for deliberate artwork layering inside a local positioned container (existing examples: `#MSCHFPreloader`, `.pointer`, chat bubble tails).

Position the **wrapper**, not ad-hoc image transforms.

Forbid fragile new coordinates:

```css
left: 847px;
top: 193px;
```

Prefer proportional rules:

```css
left: 50%;
width: clamp(16rem, 42%, 36rem);
transform: translateX(-50%);
```

Preserve the desktop contract: center phone column `414px` from `769px` up; left/right wings `width: calc((100% - 414px) / 2)` with `position: fixed`.

## Layering contract

Each layered visual section must use a local stacking context:

```css
position: relative;
isolation: isolate;
min-width: 0;
overflow: clip;
```

Documented z-index scale for this project (extend only with named steps nearby):

| Token use | Value |
| --- | --- |
| Chat bubble pseudo tails | `0` / `1` |
| Preloader inner frame | `9` |
| Preloader overlay | `99` |

Forbid arbitrary values such as `z-index: 9999`.

## Responsive contract

Breakpoints already encoded in `public/thisfoot.css`:

- `max-width: 768px` — mobile; hide `.is-hidden-mobile`
- `min-width: 769px` — desktop; center column `414px`, fixed side columns

Do not create mobile layouts by only scaling the desktop wings down.

Unless the task defines another matrix, verify:

```text
1440 × 900
1280 × 800
834 × 1194
390 × 844
320 × 568
```

Require zero unintended horizontal overflow at `320px` (`html` already sets `overflow-x: hidden`; that is not a license to clip meaningful content).

When testing GitHub Pages builds, confirm asset URLs resolve under `/haodada/`.

## Content / layout separation

Page content enters through typed data modules under `src/data/` (`thisfootHtml.ts`, future `assets.ts`).

Generated or dynamic content must not directly emit:

- Arbitrary JSX trees
- CSS strings that define layout geometry
- Class names that invent a parallel design system
- Layout values (widths, offsets, z-index)
- Asset paths outside the manifest
- Component structure

Content generation controls copy and asset identity only. Layout stays in `thisfoot.css` / component structure.

Do not grow `THISFOOT_HTML` with inline styles for positioning.

## Visual verification loop

For any UI or asset change:

1. Run `npm run dev` (or a Pages-parity build).
2. Render `/` and dismiss or skip the preloader as needed (`sessionStorage` key `thisfoot-entered`).
3. Capture screenshots at the required viewports.
4. Compare against the approved reference / prior approved render.
5. Identify the largest visual mismatch.
6. Fix one mismatch at a time (prefer CSS, then markup, then asset crop).
7. Re-render and re-compare.
8. Stop only when acceptance criteria pass.

Do not claim visual accuracy without inspecting the rendered result. A green `npm run build` is not visual proof.

## Visual regression testing

No Playwright, Storybook, or screenshot suite exists today. Do not install one unless the task explicitly requests it.

Recommended future setup (not active): Playwright screenshot tests against the viewport matrix above, with checked-in baselines and intentional review for updates.

Never update screenshot baselines automatically just to make tests pass. Baseline updates require human or explicit task authorization.

## Determinism

When adding or running visual checks:

- Fixed fixtures and stable images from `public/`
- Seeded randomness if any probabilistic UI appears
- Mock network where external requests would affect UI
- Fixed locale / timezone
- Disable non-essential motion (`prefers-reduced-motion` rules already exist in `thisfoot.css`; honor them in tests)
- Consistent browser environment

Preloader state must be controlled (`thisfoot-entered`) so screenshots do not flake on the ENTER gate.

## Validation

Before completion, run what exists:

1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run build`
4. For visual work: rendered viewport verification (matrix above), including basePath check when Pages-relevant

Skip only with an explicit reason in the completion report.

## Completion report

Report:

- Files changed
- Behavior / visuals changed
- Commands executed
- Validation results
- Viewports inspected
- Remaining visual differences vs reference
- Any skipped validation and why

## Hard-stop conditions

Stop and ask for clarification when:

- Authoritative references conflict (task screenshot vs current approved mirror vs live thisfoot capture)
- A required asset is missing from `public/`
- A redesign appears necessary but was not authorized
- The change would force a Tailwind/shadcn rewrite or other unrelated architecture shift
- Acceptance criteria cannot be determined safely
- Updating a visual baseline may hide a regression
- GitHub Pages `basePath` handling would need to be removed or redesigned to “make assets work”
)
