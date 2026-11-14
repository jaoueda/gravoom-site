# Gravoom site: notes for Claude

Static site on GitHub Pages (gravoom.com). Plain HTML and one shared stylesheet, `site.css`. There is no build step, no bundler and no React. French pages live at the root and English pages under `/en/`. When you change one language, change the other one too.

## Design setup

The setup has three parts.

1. **Animations: Motion.** Motion is the framework-agnostic successor to Framer Motion. Load it as an ES module from a pinned CDN version. Don't use npm, since there is no build step:

   ```html
   <script type="module">
     import { animate, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@14.9.0/+esm";
   </script>
   ```

   - Respect `prefers-reduced-motion`. Skip the effect or snap to its end state.
   - Content must be visible without JS. Only hide elements from a script that will reveal them.
   - Use restraint: this is a grave-care service for grieving families. Prefer one calm, orchestrated moment and motion that answers user actions (FAQ open, form steps, confirmations) over scattered entrance effects.

2. **Design: the `frontend-design` skill** (`.claude/skills/frontend-design/`). Use it for any UI work. Work within the existing brand (Bricolage Grotesque + Figtree, the tokens in `site.css`, the logo in `/brand/`) instead of reinventing it.

3. **Components: the 21st.dev Magic MCP** (`.mcp.json`, server `21st-magic`). Use it to search for and generate component ideas. It needs a `TWENTY_FIRST_API_KEY` from https://21st.dev/magic/console. Its output is React + Tailwind, so always port it to semantic HTML + `site.css` before adding it here. Never add React or Tailwind to the site.

## Checks before finishing
- Keep the layout working at phone width (no horizontal scroll) and keep keyboard focus visible.
- Bump the `site.css?v=` query string on every page when `site.css` changes.
- Shared animation code lives in `/motion.js` (one home-page load sequence, FAQ open/close, visit dialog entrance). Pages with a FAQ or the visit dialog load it with `<script type="module" src="/motion.js?v=...">`; bump that `v` when it changes.
- Layout vocabulary: `.wrap.ledger` with `.sec-head` and `.ledger-body` for ruled sections; prices are `.prices > .price` rows. Keep surfaces flat (borders, no card shadows) and labels in sentence case.

## Content map
- `/conseils/` holds the French guides (SEO articles) and `/en/grave-care-in-france/` the English guide. `/partenaires/` is the page for professionals. They are plain HTML like every other page.
- When you add or rename a page, update `sitemap.xml` and the footer links on every page.
- Facts in the guides (law, dates, prices) must be true and must match `/cgv/`. Don't invent testimonials, figures or partner terms.
- The home page opens the visit request from a link: `/?visite`, `/?commune=Douai`, `/?visite&formule=saisons`.
