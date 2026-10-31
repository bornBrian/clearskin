# clearskin site

The ClearSkin AI website, moving to Cloudflare Pages at clearskinai.app.
Cloudflare settings: root directory `web`, build command `npm run build`,
output directory `dist`. `web/public/_headers` sets the security headers
(HSTS, content security policy, no framing) and `web/public/app-ads.txt`
lists AdMob as the authorised ad seller. Until the domain is live, GitHub
Pages keeps serving the last build at the repo root
(bornbrian.github.io/clearskin/); delete that copy after the switch.

The source is in `web/` (React + Vite): Motion for interaction, GSAP
ScrollTrigger and Lenis for scroll, components from React Bits (SplitText,
ScrollReveal, CountUp; MIT + Commons Clause) and Motion Primitives (Infinite
Slider; MIT). `npm run build` in `web/` writes the site to `web/dist`.

The videos are real phones running the real app (from the ClearSkin ad
tooling, `tool/ads/motion/screen_comp.py` in the app repo). The privacy policy
and terms are the app repo's `docs/PRIVACY_POLICY.md` and `docs/TERMS.md`,
filled in, at `web/src/content/`.

```sh
cd web
npm install
npm run dev       # local preview
npm run build     # into web/dist
```
