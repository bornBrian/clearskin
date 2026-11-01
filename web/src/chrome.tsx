import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import markSvg from "../public/media/mark.svg?raw";

gsap.registerPlugin(ScrollTrigger);

/** The listing, once it's live (the package name is fixed). */
export const PLAY_URL = "https://play.google.com/store/apps/details?id=com.clearskinai.app";
export const EMAIL = "support@britechapps.com";
export const still = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Lenis smooth scrolling driven by GSAP's ticker, so pinned scenes and the page move as one. */
export function useSmoothScroll() {
  useEffect(() => {
    if (still()) return;
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href^='#']");
      if (!a) return;
      e.preventDefault();
      lenis.scrollTo(a.getAttribute("href")!, { offset: -52 });
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}

/** The C·skin mark, inline so "skin" is set in the brand face. */
export function Mark({ className = "" }: { className?: string }) {
  const svg = markSvg.replace(/fill="#151A17"/g, 'fill="currentColor"').replace("<svg ", '<svg aria-hidden="true" ');
  return <span className={`mark ${className}`} dangerouslySetInnerHTML={{ __html: svg }} />;
}

const LINKS = [
  ["Overview", "#top"],
  ["How it works", "#story"],
  ["Features", "#features"],
  ["Plans", "#plans"],
  ["Guides", "guides/"],
] as const;

/** Apple-style product bar: name on the left, sections and one button on the right.
 *  On phones the sections fold into a sheet behind a chevron. */
export function LocalNav({ home = true }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const on = () => setStuck(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const href = (h: string) => (h.startsWith("#") && !home ? `./${h === "#top" ? "" : h}` : h);
  return (
    <header className={`lnav${stuck ? " stuck" : ""}${open ? " open" : ""}`}>
      <div className="lnav-bar">
        <a className="lnav-name" href={home ? "#top" : "./"} aria-label="ClearSkin AI home">
          <Mark />
          <span>ClearSkin AI</span>
        </a>
        <nav className="lnav-links" aria-label="Sections">
          {LINKS.map(([l, h]) => (
            <a key={l} href={href(h)}>
              {l}
            </a>
          ))}
        </nav>
        <button className="lnav-more" type="button" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
          <motion.svg width="14" height="14" viewBox="0 0 14 14" animate={{ rotate: open ? 180 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}>
            <path d="M2 5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </button>
        <a className="pill" href={PLAY_URL}>
          Get the app
        </a>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            className="lnav-sheet"
            aria-label="Sections"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {LINKS.map(([l, h], i) => (
              <motion.a key={l} href={href(h)} onClick={() => setOpen(false)} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}>
                {l}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

const GUIDE_LINKS = [
  ["Great skin on a small budget", "budget"],
  ["Kitchen remedies: what helps, what burns", "kitchen"],
  ["Skin-lightening creams: the hidden danger", "lightening"],
  ["Water and your skin", "water"],
];

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <p className="foot-note">
          ClearSkin AI gives cosmetic guidance, not medical advice. See a doctor for anything painful, spreading or not healing. Readings shown on this page are from an example scan.
        </p>
        <div className="foot-cols">
          <div>
            <h3>Guides</h3>
            {GUIDE_LINKS.map(([t, id]) => (
              <a key={id} href={`guides/${id}.html`}>
                {t}
              </a>
            ))}
            <a href="guides/">All guides</a>
          </div>
          <div>
            <h3>ClearSkin AI</h3>
            <a href={PLAY_URL}>Get it on Google Play</a>
            <a href="privacy.html">Privacy policy</a>
            <a href="terms.html">Terms of use</a>
          </div>
          <div>
            <h3>Contact</h3>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href="https://www.instagram.com/clear_skinai/">Instagram</a>
            <a href="https://britechapps.com">Bri Technologies</a>
          </div>
        </div>
        <p className="foot-legal">© 2026 Bri Technologies.</p>
      </div>
    </footer>
  );
}
