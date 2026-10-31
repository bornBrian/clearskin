import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, useState } from "react";
import { EMAIL, Mark, PLAY_URL, useSmoothScroll } from "./shell";
import guides from "./content/guides.json";
import { InfiniteSlider } from "./vendor/motion-primitives/InfiniteSlider";
import CountUp from "./vendor/react-bits/CountUp";

gsap.registerPlugin(ScrollTrigger, SplitText);

const media = (f: string) => `media/${f}`;
const still = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}

/** A small square of dots, the brand's "scan" sign. */
function Dots({ size = 34 }: { size?: number }) {
  const on = [2, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17, 18, 22];
  return (
    <svg className="dots" width={size} height={size} viewBox="0 0 25 25" aria-hidden="true">
      {Array.from({ length: 25 }, (_, i) => (
        <circle key={i} cx={2.5 + (i % 5) * 5} cy={2.5 + Math.floor(i / 5) * 5} r={on.includes(i) ? 1.6 : 0.9} opacity={on.includes(i) ? 1 : 0.45} />
      ))}
    </svg>
  );
}

function Nav() {
  return (
    <header className="h-nav">
      <nav aria-label="Sections">
        <a href="#how">How it works</a>
        <a href="#readings">Readings</a>
        <a href="#guides">Guides</a>
        <a href="#plans">Plans</a>
      </nav>
      <a className="h-brand" href="./" aria-label="ClearSkin AI home">
        <Mark color="#F4F4F0" />
        clearskin
      </a>
      <a className="h-get" href={PLAY_URL}>
        Get the app <Arrow />
      </a>
    </header>
  );
}

const WORDS = [
  { w: "Scan.", sub: ["Front, left and right,", "in under a minute."] },
  { w: "Read.", sub: ["Nine readings", "in plain words."] },
  { w: "Glow.", sub: ["A routine built", "from what it sees."] },
];

function Hero() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.set(".h-words", { visibility: "visible" });
      if (still()) return;
      const split = new SplitText(".h-word b", { type: "chars", mask: "chars" });
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".h-film", { scale: 1.18, duration: 2.6, ease: "power3.out" }, 0)
        .from(split.chars, { yPercent: 110, duration: 1.3, stagger: 0.035 }, 0.25)
        .from(".h-word small, .h-card, .h-cta, .h-nav > *", { opacity: 0, y: 20, duration: 1.1, stagger: 0.06 }, 0.8);

      // On scroll the three words drift apart and the film sinks back.
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.8 };
      gsap.to(".h-word:nth-child(1)", { xPercent: -28, scrollTrigger: st });
      gsap.to(".h-word:nth-child(3)", { xPercent: 28, scrollTrigger: st });
      gsap.to(".h-word:nth-child(2)", { yPercent: -40, scrollTrigger: st });
      gsap.fromTo(".h-film", { filter: "brightness(1)" }, { scale: 1.1, filter: "brightness(0.45)", immediateRender: false, scrollTrigger: st });
      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <section className="h-hero" ref={root}>
      <video className="h-film" src={media("film-hero.mp4")} poster={media("film-hero.jpg")} autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
      <div className="h-shade" />
      <Nav />
      <h1 className="sr">ClearSkin AI: scan your face, read your skin, get a routine built from it</h1>
      <div className="h-words" aria-hidden="true">
        {WORDS.map((x) => (
          <div className="h-word" key={x.w}>
            <b>{x.w}</b>
            <small>
              {x.sub[0]}
              <br />
              {x.sub[1]}
            </small>
          </div>
        ))}
      </div>
      <a className="h-card" href="#readings">
        <span className="t">
          Your skin,
          <br />
          measured
        </span>
        <Dots size={26} />
        <img src={media("screen-report.webp")} alt="" width={360} height={779} />
        <span className="n">
          <b>9</b> readings
        </span>
        <span className="n r">
          <b>3</b> angles
        </span>
      </a>
      <p className="h-note">Free to start · Android · Made for every skin tone</p>
      <a className="h-cta" href={PLAY_URL}>
        Get it on Google Play <Arrow />
      </a>
    </section>
  );
}

function Marquee() {
  return (
    <div className="h-marquee" aria-hidden="true">
      <InfiniteSlider gap={64} speed={45}>
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i}>ClearSkin AI</span>
        ))}
      </InfiniteSlider>
    </div>
  );
}

function Statement() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (still()) return;
      gsap.fromTo(".s-bg", { yPercent: -12, scale: 1.15 }, { yPercent: 12, scale: 1.05, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.from(".s-line", {
        clipPath: "inset(0 0 100% 0)",
        yPercent: 40,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".s-head", start: "top 80%", end: "top 40%", scrub: 1 },
      });
    },
    { scope: root },
  );
  return (
    <section className="s-wrap" ref={root}>
      <video className="s-bg" src={media("film-shelf.mp4")} poster={media("film-shelf.jpg")} autoPlay muted loop playsInline aria-hidden="true" />
      <p className="s-top">Answers alone can't tell acne from irritation, or dry skin from dehydrated skin.</p>
      <div className="s-mid">
        <Dots size={58} />
        <h2 className="s-head">
          <span className="s-line">It looks first.</span>
          <span className="s-line">Then it builds</span>
          <span className="s-line">your routine.</span>
        </h2>
        <p>
          ClearSkin scans your face from the front and both sides, waits for good light and a still face, and only then decides what your skin needs. Nothing in your routine is a guess.
        </p>
        <a className="u-link" href="#how">
          See how it works <Arrow />
        </a>
      </div>
    </section>
  );
}

const READINGS = [
  { k: "Blemishes", v: 64, img: "50426", t: "Active spots and breakouts, zone by zone." },
  { k: "Even tone", v: 67, img: "4573", t: "Dark marks and patches against your own tone." },
  { k: "Pores", v: 70, img: "skin_macro", t: "How visible they are, mostly nose and cheeks." },
  { k: "Texture", v: 72, img: "51171", t: "Bumps and roughness, read in raking light." },
  { k: "Oil balance", v: 74, img: "50422", t: "Shine across the T-zone and cheeks." },
  { k: "Under-eyes", v: 77, img: "51177", t: "Darkness and puffiness under the eyes." },
  { k: "Hydration", v: 80, img: "serum_pour", t: "How much water the top layer is holding." },
  { k: "Redness", v: 82, img: "50756", t: "Irritation and flushing, not your natural tone." },
  { k: "Smoothness", v: 92, img: "41181", t: "Fine lines and creases." },
];

function Readings() {
  const track = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLElement>(null);
  const [at, setAt] = useState(0);

  useGSAP(
    () => {
      if (still()) return;
      gsap.from(".r-rule", { scaleX: 0, transformOrigin: "left", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 75%" } });
      gsap.from(".r-card", { x: 160, opacity: 0, duration: 1.2, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: ".r-track", start: "top 80%" } });
    },
    { scope: root },
  );

  // Drag to scroll with a mouse; touch and trackpads scroll natively.
  useEffect(() => {
    const el = track.current!;
    let down = false;
    let x0 = 0;
    let s0 = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      x0 = e.clientX;
      s0 = el.scrollLeft;
      el.classList.add("dragging");
    };
    const onMove = (e: PointerEvent) => down && (el.scrollLeft = s0 - (e.clientX - x0));
    const onUp = () => {
      down = false;
      el.classList.remove("dragging");
    };
    const onScroll = () => setAt(Math.round(el.scrollLeft / (el.scrollWidth - el.clientWidth || 1) * (READINGS.length - 1)));
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  const step = (d: number) => {
    const el = track.current!;
    const card = el.querySelector<HTMLElement>(".r-card")!;
    el.scrollBy({ left: d * (card.offsetWidth + 16), behavior: "smooth" });
  };

  return (
    <section className="r-wrap" id="readings" ref={root}>
      <div className="r-head">
        <div>
          <small>The readings</small>
          <h2>Nine readings, in plain words</h2>
        </div>
        <span className="r-rule" />
        <div className="r-ctrl">
          <span className="r-count">
            {String(at + 1).padStart(2, "0")} / 09
          </span>
          <button type="button" onClick={() => step(-1)} aria-label="Previous reading">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Next reading">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
      <div className="r-track" ref={track} tabIndex={0} aria-label="The nine readings from an example scan">
        {READINGS.map((r, i) => (
          <article className="r-card" key={r.k}>
            <img src={media(`people/${r.img}.webp`)} alt="" width={900} height={1200} loading="lazy" draggable={false} />
            <div className="r-shade" />
            <Dots size={30} />
            <span className="r-i">{String(i + 1).padStart(2, "0")}</span>
            <div className="r-v">
              <b>
                <CountUp to={r.v} from={Math.max(0, r.v - 40)} duration={1.6} />
              </b>
              <span>out of 100</span>
            </div>
            <h3>{r.k}</h3>
            <p>{r.t}</p>
          </article>
        ))}
      </div>
      <div className="r-foot">
        <span className="r-rule2" />
        <p>
          Lowest first · what it means · what to do <em>· an example scan</em>
        </p>
      </div>
    </section>
  );
}

const STEPS = [
  { video: "hero", title: "One scan, every side.", text: "Front, left and right in under a minute. The app waits for good light and a still face before it measures anything." },
  { video: "couch", title: "Your day, on one screen.", text: "Your score, this morning's steps, today's UV and your water, the moment you open it." },
  { video: "routine", title: "A routine built from what it sees.", text: "Not from a quiz. Every step is there for something the scan found, with how much to use and how long to wait." },
  { video: "alarm", title: "Reminders that ring like an alarm.", text: "Your morning and evening routine ring at alarm volume until you snooze or open them." },
  { video: "progress", title: "See it change, week by week.", text: "Same light, same angle, every week. The chart shows what's actually moving, and what isn't yet." },
];

/** The steps scroll past a pinned phone that changes with them. */
function How() {
  const root = useRef<HTMLElement>(null);
  const [on, setOn] = useState(0);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".w-step").forEach((el, i) =>
        ScrollTrigger.create({ trigger: el, start: "top 60%", end: "bottom 60%", onToggle: (s) => s.isActive && setOn(i) }),
      );
      if (still()) return;
      gsap.from(".w-title .ln", { yPercent: 100, duration: 1.2, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".w-title", start: "top 80%" } });
    },
    { scope: root },
  );

  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === on) {
        v.currentTime = 0;
        void v.play().catch(() => {});
      } else v.pause();
    });
  }, [on]);

  return (
    <section className="w-wrap" id="how" ref={root}>
      <h2 className="w-title">
        <span className="mask">
          <span className="ln">After you</span>
        </span>
        <span className="mask">
          <span className="ln">
            <em>open it.</em>
          </span>
        </span>
      </h2>
      <div className="w-grid">
        <div className="w-steps">
          {STEPS.map((s, i) => (
            <div className={`w-step${i === on ? " on" : ""}`} key={s.video}>
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <video className="w-inline" src={media(`${s.video}.mp4`)} poster={media(`${s.video}.jpg`)} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
            </div>
          ))}
        </div>
        <div className="w-sticky">
          <div className="w-phone">
            {STEPS.map((s, i) => (
              <video key={s.video} ref={(el) => void (videos.current[i] = el)} className={i === on ? "on" : ""} src={media(`${s.video}.mp4`)} poster={media(`${s.video}.jpg`)} muted loop playsInline preload={i < 2 ? "auto" : "metadata"} aria-hidden={i !== on} />
            ))}
          </div>
          <div className="w-bar" aria-hidden="true">
            {STEPS.map((s, i) => (
              <i key={s.video} className={i <= on ? "on" : ""} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Guides() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (still()) return;
      gsap.from(".g-card", { y: 80, opacity: 0, duration: 1.1, stagger: 0.07, ease: "expo.out", scrollTrigger: { trigger: ".g-grid", start: "top 80%" } });
    },
    { scope: root },
  );
  return (
    <section className="g-wrap" id="guides" ref={root}>
      <div className="r-head">
        <div>
          <small>Guides</small>
          <h2>Not everything good for skin comes in a bottle</h2>
        </div>
        <span className="r-rule" />
        <a className="u-link" href="guides/">
          All guides <Arrow />
        </a>
      </div>
      <div className="g-grid">
        {guides.map((g) => (
          <a className="g-card" key={g.id} href={`guides/${g.id}.html`}>
            <img src={`guides/${g.image}`} alt="" loading="lazy" />
            <span className="g-meta">
              {g.minutes} min{g.premium ? " · Premium" : " · Free"}
            </span>
            <b>{g.title}</b>
            <span>{g.teaser}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

const FREE = ["2 skin scans every 30 days", "Your routine, reminders and streaks", "Water target and the safety guides"];
const PREMIUM = ["Scan as often as you like", "Every guide, matched to your scan", "The skin coach", "Full progress history, before and after", "No ads"];

function Plans() {
  return (
    <section className="p-wrap" id="plans">
      <div className="r-head">
        <div>
          <small>Plans</small>
          <h2>Free to start. $4.99 when you want everything</h2>
        </div>
        <span className="r-rule" />
      </div>
      <div className="p-grid">
        <div className="p-card">
          <small>Free</small>
          <b className="p-price">$0</b>
          <ul>
            {FREE.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <div className="p-card p-pro">
          <small>Premium</small>
          <b className="p-price">
            $4.99<span> a month</span>
          </b>
          <span className="p-alt">or $29.99 a year</span>
          <ul>
            {PREMIUM.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <a className="p-go" href={PLAY_URL}>
            Start free on Google Play <Arrow />
          </a>
        </div>
        <div className="p-card p-private">
          <Dots size={40} />
          <b>Your photos stay on your phone.</b>
          <p>
            Sent encrypted only to be analysed, then thrown away, with location data stripped first. Never stored on our servers, never sold, never used to train AI. <a href="privacy.html">The privacy policy</a> has the detail.
          </p>
        </div>
      </div>
      <p className="p-fine">Billed through Google Play in your local currency. Cancel any time. Premium scans are fair-use.</p>
    </section>
  );
}

const END = ["Know", "your", "skin."];

function End() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (still()) return;
      // The words start huddled in the middle and spread to the edges as you scroll in.
      gsap.from(".e-words b", {
        x: (i: number) => (1 - i) * window.innerWidth * 0.16,
        opacity: 0.2,
        ease: "power2.out",
        scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 15%", scrub: 1 },
      });
      gsap.fromTo(".e-film", { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "top top", scrub: true } });
    },
    { scope: root },
  );
  return (
    <section className="e-wrap" ref={root}>
      <video className="e-film" src={media("film-mirror.mp4")} poster={media("film-mirror.jpg")} autoPlay muted loop playsInline aria-hidden="true" />
      <div className="e-shade" />
      <div className="e-top">
        <span className="pill">
          Free to start <i />
        </span>
        <span>ClearSkin AI</span>
        <span className="e-mark">
          <Dots size={20} /> Bri Technologies
        </span>
      </div>
      <h2 className="e-words">
        {END.map((w) => (
          <b key={w}>{w}</b>
        ))}
      </h2>
      <div className="e-bottom">
        <a className="h-cta" href={PLAY_URL}>
          Get it on Google Play <Arrow />
        </a>
        <a className="e-badge" href={PLAY_URL} aria-label="Get it on Google Play">
          <img src={media("google-play.png")} alt="Get it on Google Play" width={646} height={250} />
        </a>
        <div className="e-thumbs" aria-hidden="true">
          <img src={media("screen-today.webp")} alt="" width={360} height={779} loading="lazy" />
          <img src={media("screen-report.webp")} alt="" width={360} height={779} loading="lazy" />
        </div>
      </div>
    </section>
  );
}

function Foot() {
  return (
    <footer className="f-wrap">
      <div className="f-row">
        <a className="h-brand" href="./">
          <Mark color="#F4F4F0" />
          clearskin
        </a>
        <nav aria-label="Footer">
          <a href="guides/">Guides</a>
          <a href="privacy.html">Privacy policy</a>
          <a href="terms.html">Terms of use</a>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <a href="https://www.instagram.com/clear_skinai/">Instagram</a>
        </nav>
      </div>
      <p>
        © 2026 <a href="https://britechapps.com">Bri Technologies</a>, Dodoma, Tanzania. Cosmetic guidance, not medical advice. See a doctor for anything painful, spreading or not healing.
      </p>
    </footer>
  );
}

export function Home() {
  useSmoothScroll();
  return (
    <>
      <main>
        <Hero />
        <Marquee />
        <Statement />
        <Readings />
        <How />
        <Guides />
        <Plans />
        <End />
      </main>
      <Foot />
    </>
  );
}
