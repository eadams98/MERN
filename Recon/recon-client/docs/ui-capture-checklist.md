# UI change — before / after captures

The recon-client UI roadmap (Recon repo: `docs/architecture/recon-client-ui-roadmap.md`) asks for **before/after screenshots in the PR when practical** for UI work.

## How to use this doc

1. **Before** starting a change: run `npm start`, open the listed route, capture a screenshot (same viewport each time, e.g. 1280×720).
2. **After** the change: same route, same viewport, new screenshot.
3. Attach both images to the PR description (or paste into the team wiki). Name files clearly, e.g. `wave2-home-before.png`, `wave2-home-after.png`.

## Wave 2 (PE-020–PE-030) — suggested captures

| Area | Route | What to show |
|------|--------|----------------|
| Home / dashboard | `/home` | Full page including nav + main (was “RECON” stub; now role cards). |
| School report shell | `/home/report/view` as school user | Header + `ContentCard` + form (after scaffold). |

## Wave 3+ (placeholder)

Add rows here per PR (Login, a11y, report toolbar, etc.).

## Automation (optional)

If the team adds Playwright or Cypress later, store baseline images under `e2e/__snapshots__/` or equivalent and reference them in CI. Until then, **manual captures** satisfy the roadmap.
