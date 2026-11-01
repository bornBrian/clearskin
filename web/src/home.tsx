import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { useRef } from "react";
import { Footer, LocalNav, PLAY_URL, still, useSmoothScroll } from "./chrome";
import { Phone, seq } from "./phone";
import ScrollReveal from "./vendor/react-bits/ScrollReveal";

gsap.registerPlugin(ScrollTrigger);

function Badge({ className = "" }: { className?: string }) {
  return (
    <a className={`badge ${className}`} href={PLAY_URL} aria-label="Get it on Google Play">
      <img src="media/google-play.png" alt="Get it on Google Play" width={646} height={250} />
    </a>
  );
}

/** The four recordings the pinned phone plays through, in scroll order. */
const CHAPTERS = [
  { key: "scan", frames: seq("scan", 54), eyebrow: "Scan", title: "Front, left and right. Under a minute.", text: "It waits for good light and a still face, then maps your skin zone by zone, on your phone." },
  { key: "score", frames: seq("score", 39), eyebrow: "Score", title: "One number you can trust.", text: "Out of 100, with what changed since your last scan and how far your skin can go." },
  { key: "readings", frames: seq("readings", 51), eyebrow: "Readings", title: "Nine readings, in plain words.", text: "Blemishes, tone, pores, texture, oil, under-eyes, hydration, redness and smoothness. Lowest first." },
  { key: "routine", frames: seq("routine", 57), eyebrow: "Routine", title: "A routine built from what it sees.", text: "Every step is there for something the scan found. Tick it off, morning and evening." },
];
// Where each chapter sits in the pinned scroll (0..1); the first 10% is the hero handing over.
const SPAN = [
  [0.1, 0.33],
  [0.33, 0.52],
  [0.52, 0.75],
  [0.75, 0.97],
] as const;

function Story() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const ctx = canvas.current!.getContext("2d")!;
      CHAPTERS[0].frames.load();
      const first = CHAPTERS[0].frames.imgs[0];
      first.onload = () => CHAPTERS[0].frames.draw(ctx, 0);
      const caps = gsap.utils.toArray<HTMLElement>(".cap");

      let shown = -1;
      const render = (p: number) => {
        let c = 0;
        while (c < SPAN.length - 1 && p >= SPAN[c + 1][0]) c++;
        const [a, b] = SPAN[c];
        const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
        const f = CHAPTERS[c].frames;
        f.load();
        CHAPTERS[c + 1]?.frames.load(); // fetch the next one while this plays
        f.draw(ctx, t * (f.urls.length - 1));
        const on = p < SPAN[0][0] - 0.02 ? -1 : c;
        if (on !== shown) {
          caps.forEach((el, i) => el.classList.toggle("on", i === on));
          shown = on;
        }
      };

      if (still()) {
        render(SPAN[0][0]);
        return;
      }

      const mm = gsap.matchMedia();
      mm.add({ wide: "(min-width: 900px)", narrow: "(max-width: 899px)" }, (m) => {
        const wide = m.conditions!.wide;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: wide ? "+=520%" : "+=420%",
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (s) => render(s.progress),
          },
        });
        // The hero hands over: its words lift away and the phone settles into place.
        gsap.set(".story .phone", { y: () => innerHeight * (wide ? 0.5 : 0.44), scale: 0.92 });
        tl.to(".hero-copy", { opacity: 0, y: -60, duration: 0.08 }, 0)
          .to(".story .phone", { y: 0, x: () => (wide ? innerWidth * 0.19 : 0), scale: 1, duration: 0.1 }, 0)
          .to(".story .phone", { rotateY: wide ? -8 : 0, duration: 0.45 }, 0.1)
          .to(".story .phone", { rotateY: 0, duration: 0.45 }, 0.55)
          .to({}, { duration: 0.0 }, 1);
        render(0);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="story" id="story" ref={root}>
      <div className="stage">
        <div className="glow" aria-hidden="true" />
        <div className="hero-copy" id="top">
          <p className="eyebrow">ClearSkin AI</p>
          <h1>Your skin, measured.</h1>
          <p className="sub">Scan your face from every side. Get nine readings in plain words and a routine built from what it sees.</p>
          <div className="cta">
            <Badge />
            <span>Free to start</span>
          </div>
        </div>
        <div className="caps">
          {CHAPTERS.map((c) => (
            <div className="cap" key={c.key}>
              <p className="eyebrow">{c.eyebrow}</p>
              <h2>{c.title}</h2>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
        <Phone>
          <canvas ref={canvas} width={480} height={1039} role="img" aria-label="ClearSkin AI scanning a face, then showing the score, the nine readings and the routine" />
        </Phone>
      </div>
    </section>
  );
}

const FEATURES = [
  { img: "reminders", title: "Rings like an alarm.", text: "Morning and evening, at alarm volume, until you snooze or open it." },
  { img: "water", title: "Water, worked out for you.", text: "From your weight, your activity and today's weather." },
  { img: "today", title: "Your day on one screen.", text: "Score, today's steps, UV and water the moment you open it." },
  { img: "guides", title: "Guides for everything else.", text: "Food, sleep, bedding, a small budget, and which kitchen remedies burn.", href: "guides/" },
];

function Features() {
  return (
    <section className="features wrap" id="features">
      <motion.h2 className="section-title" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15% 0px" }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
        Made for every day.
      </motion.h2>
      <div className="tiles">
        {FEATURES.map((f, i) => {
          const Tag = f.href ? motion.a : motion.div;
          return (
            <Tag
              key={f.img}
              className="tile"
              {...(f.href ? { href: f.href } : {})}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1, delay: (i % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3>{f.title}</h3>
              <p>{f.text}</p>
              <Phone className="mini">
                <img src={`media/stills/${f.img}.webp`} alt="" width={540} height={1169} loading="lazy" />
              </Phone>
            </Tag>
          );
        })}
      </div>
    </section>
  );
}

function Privacy() {
  return (
    <section className="privacy">
      <div className="wrap">
        <p className="eyebrow">Privacy</p>
        <ScrollReveal baseOpacity={0.15} enableBlur={false} baseRotation={0} textClassName="privacy-text">
          Your photos are analysed and thrown away. Never stored on our servers, never sold, never used to train AI.
        </ScrollReveal>
        <a className="link light" href="privacy.html">
          Read the privacy policy ›
        </a>
      </div>
    </section>
  );
}

const FREE = ["2 scans every 30 days", "Your routine and alarm reminders", "Water target and safety guides"];
const PREMIUM = ["Scan as often as you like", "Every guide, matched to your scan", "The skin coach", "Your full progress history", "No ads"];

function Plans() {
  return (
    <section className="plans wrap" id="plans">
      <motion.h2 className="section-title" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15% 0px" }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
        Free to start.
      </motion.h2>
      <div className="plan-grid">
        <div className="plan">
          <h3>Free</h3>
          <p className="price">$0</p>
          <ul>
            {FREE.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="plan pro">
          <h3>Premium</h3>
          <p className="price">
            $4.99<span>/month</span>
          </p>
          <p className="alt">or $29.99 a year</p>
          <ul>
            {PREMIUM.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <a className="pill big" href={PLAY_URL}>
            Start free
          </a>
        </div>
      </div>
      <p className="fine">Billed through Google Play in your local currency. Cancel any time. Premium scans are fair-use.</p>
    </section>
  );
}

function Close() {
  return (
    <section className="close">
      <div className="glow" aria-hidden="true" />
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15% 0px" }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
        <h2>Know your skin.</h2>
        <p>ClearSkin AI. Free on Google Play.</p>
        <Badge />
      </motion.div>
    </section>
  );
}

export function Home() {
  useSmoothScroll();
  return (
    <>
      <LocalNav />
      <main>
        <Story />
        <Features />
        <Privacy />
        <Plans />
        <Close />
      </main>
      <Footer />
    </>
  );
}
