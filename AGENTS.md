# Repository Guidelines

## Project Structure & Modules
- Root holds production guides (e.g., `ai_voice_guide.md`, `episode_1_production_guide.md`) plus the web app in `sunday-brunch-website/`.
- Frontend lives in `sunday-brunch-website/src/` with React + Vite:
  - `components/` for reusable UI (e.g., `EpisodePlayer.jsx`, `RecipeCard.jsx`).
  - `pages/` for screen-level views (`RecipePage.jsx`).
  - `services/` for API helpers (`convertkit.js` for ConvertKit signup).
  - Global styles in `App.css`, `index.css`; entry in `main.jsx` mounts `App.jsx`.
- Environment sample: `sunday-brunch-website/.env.example` (copy to `.env` before running).

## Build, Test, and Development Commands
Run inside `sunday-brunch-website/`:
- `npm install` — install dependencies.
- `npm run dev` — start Vite dev server (hot reload).
- `npm run build` — production bundle to `dist/`.
- `npm run preview` — serve the built bundle locally.

## Coding Style & Naming
- React 18 with functional components; prefer hooks over classes.
- Indent with 4 spaces; omit semicolons to match existing files.
- Favor descriptive component names (`RecipeCard`, `EpisodePlayer`) and camelCase for props/state (`isSubmitting`, `subscribeToNewsletter`).
- CSS is plain files imported per component; keep class names kebab-case and scoped by feature (e.g., `.episode-player__controls`).
- Use Axios for HTTP; centralize requests in `src/services/` and import into components.

## Testing Guidelines
- No automated tests are present yet. When adding tests, colocate under `src/` mirroring source paths (e.g., `components/__tests__/RecipeCard.test.jsx`) using Vitest + Testing Library.
- Keep tests focused on rendering, props, and service call outcomes; prefer data-testid over brittle selectors.

## Environment, Security, and Config
- Required vars: `VITE_CONVERTKIT_FORM_ID`, `VITE_CONVERTKIT_API_KEY` in `.env` (never commit secrets). Use `.env.example` as a template.
- Network calls go to ConvertKit; handle failures with user-friendly messages as in `convertkit.js`.
- Avoid logging secrets; sanitize console output in production code.

## Commit & Pull Request Guidelines
- Use concise, imperative commit subjects (e.g., “Add hero signup form validation”); group related changes per commit.
- PRs should describe scope, testing done (`npm run build`/manual checks), and any env changes. Attach screenshots/GIFs for UI changes and link relevant issues/tasks.
