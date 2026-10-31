# clearskin site

The ClearSkin AI website, served by GitHub Pages from this repo's root
(bornbrian.github.io/clearskin/).

The source is in `web/` (React + Vite): Motion for interaction, GSAP
ScrollTrigger and Lenis for scroll, components from React Bits (SplitText,
ScrollReveal, CountUp; MIT + Commons Clause) and Motion Primitives (Infinite
Slider; MIT). `npm run build` in `web/` writes `index.html`, `privacy.html`,
`terms.html`, `assets/` and `media/` here at the root.

The videos are real phones running the real app (from the ClearSkin ad
tooling, `tool/ads/motion/screen_comp.py` in the app repo). The privacy policy
and terms are the app repo's `docs/PRIVACY_POLICY.md` and `docs/TERMS.md`,
filled in, at `web/src/content/`.

```sh
cd web
npm install
npm run dev       # local preview
npm run build     # into the repo root
```
