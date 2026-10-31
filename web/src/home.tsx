import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { EMAIL, Mark, PLAY_URL, useSmoothScroll } from "./shell";
import guides from "./content/guides.json";

const media = (f: string) => `media/${f}`;
const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Fades every [data-r] element up as it scrolls into view, once. */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-r]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Play() {
  return (
    <a className="play" href={PLAY_URL} aria-label="Get it on Google Play">
      <img src={media("google-play.png")} alt="Get it on Google Play" width={646} height={250} />
    </a>
  );
}

function Hero() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (still()) return;
      gsap.from(".hero h1, .hero p, .hero .play", { opacity: 0, y: 24, duration: 1.2, stagger: 0.12, ease: "expo.out", delay: 0.2 });
      gsap.to(".hero video", { scale: 1.08, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
    },
    { scope: root },
  );
  return (
    <header className="hero" ref={root}>
      <video src={media("film-hero.mp4")} poster={media("film-hero.jpg")} autoPlay muted loop playsInline aria-hidden="true" />
      <nav className="top" aria-label="Main">
        <a className="brand" href="./" aria-label="ClearSkin AI home">
          <Mark color="#FFFFFF" />
          clearskin
        </a>
        <span className="links">
          <a href="#how">How it works</a>
          <a href="guides/">Guides</a>
          <a href="#plans">Plans</a>
        </span>
      </nav>
      <div className="hero-text">
        <h1>
          Your skin,
          <br />
          measured.
        </h1>
        <p>One scan of your face from every side. Nine readings in plain words. A routine built from what it sees.</p>
        <Play />
      </div>
    </header>
  );
}

const STEPS = [
  { video: "hero", title: "Scan", text: "Front, left and right, in under a minute." },
  { video: "routine", title: "Follow", text: "A routine built from what the scan found." },
  { video: "progress", title: "See it change", text: "Same light, same angle, every week." },
];

const READINGS = [
  ["Blemishes", 64], ["Even tone", 67], ["Pores", 70],
  ["Texture", 72], ["Oil balance", 74], ["Under-eyes", 77],
  ["Hydration", 80], ["Redness", 82], ["Smoothness", 92],
] as const;

export function Home() {
  useSmoothScroll();
  useReveal();
  return (
    <>
      <Hero />
      <main>
        <section className="wrap block" id="how">
          <h2 data-r>How it works</h2>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div className="step" key={s.video} data-r style={{ transitionDelay: `${i * 90}ms` }}>
                <video src={media(`${s.video}.mp4`)} poster={media(`${s.video}.jpg`)} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
                <b>{s.title}</b>
                <span>{s.text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap block">
          <h2 data-r>Nine readings, in plain words</h2>
          <div className="nine" data-r>
            {READINGS.map(([k, v]) => (
              <div key={k}>
                <span className="v">{v}</span>
                <span className="k">{k}</span>
              </div>
            ))}
          </div>
          <p className="fine">Out of 100, from an example scan. Each comes with what it means and what to do.</p>
        </section>

        <section className="wrap block">
          <h2 data-r>Guides</h2>
          <div className="list">
            {guides.slice(0, 4).map((g) => (
              <a key={g.id} href={`guides/${g.id}.html`} data-r>
                <b>{g.title}</b>
                <span>{g.teaser}</span>
              </a>
            ))}
          </div>
          <a className="more" href="guides/">
            All guides →
          </a>
        </section>

        <section className="wrap block" id="plans">
          <h2 data-r>Plans</h2>
          <div className="plans" data-r>
            <div>
              <b>Free</b>
              <p>2 scans every 30 days, your routine, reminders and the safety guides.</p>
            </div>
            <div>
              <b>Premium · $4.99 a month or $29.99 a year</b>
              <p>Unlimited scans, every guide, the skin coach, full progress history and no ads.</p>
            </div>
          </div>
          <p className="fine">
            Your photos are analysed and thrown away, never stored, sold or used to train AI. <a href="privacy.html">Privacy policy</a>
          </p>
        </section>

        <section className="wrap block end" data-r>
          <h2>Know your skin.</h2>
          <Play />
        </section>
      </main>
      <footer className="wrap foot">
        <span>
          © 2026 <a href="https://britechapps.com">Bri Technologies</a>. Cosmetic guidance, not medical advice.
        </span>
        <span>
          <a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a> · <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </span>
      </footer>
    </>
  );
}
