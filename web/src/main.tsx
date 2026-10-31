import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { StrictMode, useEffect, useRef, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Footer, Mark, Nav, PLAY_URL, useSmoothScroll } from "./shell";
import { InfiniteSlider } from "./vendor/motion-primitives/InfiniteSlider";
import CountUp from "./vendor/react-bits/CountUp";
import ScrollReveal from "./vendor/react-bits/ScrollReveal";
import SplitText from "./vendor/react-bits/SplitText";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

const media = (f: string) => `media/${f}`;

/** Google's badge, unaltered, drifting a little towards the pointer. */
function Badge() {
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  return (
    <motion.a
      className="badge"
      href={PLAY_URL}
      aria-label="Get it on Google Play"
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.18);
        y.set((e.clientY - r.top - r.height / 2) * 0.25);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <img src={media("google-play.png")} alt="Get it on Google Play" width={646} height={250} />
    </motion.a>
  );
}

/** Rises into place once, when it first scrolls into view. */
function Rise({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

function Hero() {
  return (
    <header className="hero">
      <div className="wrap">
        <div>
          <h1 className="display">
            <SplitText text="Your skin," tag="span" splitType="chars" effect="rise" mask trigger="load" delay={30} duration={1.1} textAlign="left" />
            <br />
            <span className="accent">
              <SplitText text="measured." tag="span" splitType="chars" effect="rise" mask trigger="load" delay={30} duration={1.1} textAlign="left" />
            </span>
          </h1>
          <motion.p className="lead" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            One scan of your face, from the front and both sides. Nine measurements in plain words. Then a routine built from what it actually sees.
          </motion.p>
          <motion.div className="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }}>
            <Badge />
            <span className="note">Free to start · Android</span>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}>
          <div className="stage">
            <video src={media("hero.mp4")} poster={media("hero.jpg")} autoPlay muted loop playsInline preload="auto" aria-label="A hand holding a phone running a ClearSkin scan" />
          </div>
          <div className="caption">A real scan in the app: the face mesh, then the report.</div>
        </motion.div>
      </div>
    </header>
  );
}

const READING = [
  ["Blemishes", 64], ["Texture", 72], ["Pores", 70], ["Redness", 82], ["Even tone", 67],
  ["Hydration", 80], ["Oil balance", 74], ["Smoothness", 92], ["Under-eyes", 77],
] as const;

/** One real reading running past: what a scan actually returns. */
function Marquee() {
  return (
    <div className="marquee" aria-label="An example scan's nine readings">
      <InfiniteSlider gap={56} speed={34} speedOnHover={12}>
        {READING.map(([m, v]) => (
          <div className="item" key={m} aria-hidden>
            <span>{m}</span>
            <span className="num">{v}</span>
            <span className="tick" />
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
}

const STEPS = [
  { video: "hero", title: "One scan, every side.", text: "Front, left and right in under a minute. The app waits for good light and a still face before it measures anything." },
  { video: "couch", title: "Your day, on one screen.", text: "Your score, this morning's steps, today's UV and your water, the moment you open it." },
  { video: "routine", title: "A routine built from what it sees.", text: "Not from a quiz. Every step is there for something the scan found, with how much to use and how long to wait." },
  { video: "alarm", title: "Reminders that ring like an alarm.", text: "Turn it on and your morning and evening routine ring at alarm volume until you snooze or open them." },
  { video: "guides", title: "Guides for everything else.", text: "Food, water, weather, bedding, a small budget. Which kitchen remedies help, and which ones burn." },
  { video: "progress", title: "See it change, week by week.", text: "Same light, same angle, every week. The chart shows what's actually moving, and what isn't yet." },
];

/** Desktop: the steps scroll past a sticky phone that changes with them.
 *  Phones: each step with its own clip. */
function Story() {
  const [on, setOn] = useState(0);
  const steps = useRef<(HTMLDivElement | null)[]>([]);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const triggers = steps.current.map((el, i) =>
      el
        ? ScrollTrigger.create({
            trigger: el,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => self.isActive && setOn(i),
          })
        : null,
    );
    return () => triggers.forEach((t) => t?.kill());
  }, []);

  // only the clip on screen plays, from its start
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
    <section className="block story" id="how">
      <div className="wrap">
        <div className="head story-head">
          <h2 className="display">
            <SplitText text="After you open it." tag="span" splitType="words" effect="rise" mask textAlign="left" />
          </h2>
        </div>
      </div>
      <div className="wrap story-grid">
        <div className="steps">
          {STEPS.map((s, i) => (
            <div key={s.video} ref={(el) => void (steps.current[i] = el)} className={`step${i === on ? " on" : ""}`}>
              <div className="n">{String(i + 1).padStart(2, "0")}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
        <div className="sticky">
          <div className="screens">
            {STEPS.map((s, i) => (
              <video key={s.video} ref={(el) => void (videos.current[i] = el)} className={i === on ? "on" : ""} src={media(`${s.video}.mp4`)} poster={media(`${s.video}.jpg`)} muted loop playsInline preload={i < 2 ? "auto" : "metadata"} aria-hidden={i !== on} />
            ))}
            <div className="ticks" aria-hidden>
              {STEPS.map((s, i) => (
                <i key={s.video} className={i <= on ? "on" : ""} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="wrap story-mobile">
        {STEPS.map((s, i) => (
          <Rise key={s.video}>
            <div className="card">
              <video src={media(`${s.video}.mp4`)} poster={media(`${s.video}.jpg`)} autoPlay muted loop playsInline preload="metadata" />
              <div className="n">{String(i + 1).padStart(2, "0")}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </Rise>
        ))}
      </div>
    </section>
  );
}

const EXAMPLE = [
  ["Blemishes", 64], ["Even tone", 67], ["Pores", 70],
  ["Texture", 72], ["Oil balance", 74], ["Under-eyes", 77],
  ["Hydration", 80], ["Redness", 82], ["Smoothness", 92],
] as const;

function Nine() {
  return (
    <section className="block" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="head">
          <h2 className="display">Nine readings, in plain words.</h2>
          <p className="lead">Out of 100, higher is better, lowest first. Each one comes with what it means and what to do about it.</p>
        </div>
        <div className="grid9">
          {EXAMPLE.map(([k, v], i) => (
            <div key={k}>
              <div className="v">
                <CountUp to={v} from={Math.max(0, v - 30)} duration={1.6} delay={i * 0.06} />
              </div>
              <div className="k">{k}</div>
            </div>
          ))}
        </div>
        <p className="fine">An example scan.</p>
      </div>
    </section>
  );
}

function Statement() {
  return (
    <section className="block statement">
      <div className="wrap">
        <ScrollReveal baseOpacity={0.12} enableBlur blurStrength={6} baseRotation={0} textClassName="scroll-reveal-text">
          Answers alone can't tell acne from irritation, or dry skin from dehydrated skin. So ClearSkin looks first, from every side, and only then builds your routine. Nothing in it is a guess.
        </ScrollReveal>
      </div>
    </section>
  );
}

const SAFE = [
  ["Oats", "Ground fine, in a lukewarm bath or as a paste, for itchy, irritated skin."],
  ["Raw honey", "A thin mask for ten minutes, rinsed with lukewarm water."],
  ["Fresh aloe gel", "Only the clear inner gel, after sun. Patch test first."],
  ["Cooled green tea", "A cold compress on red or puffy skin."],
];
const NEVER = [
  ["Lemon or lime juice", "Acid plus sun burns and leaves dark marks for months."],
  ["Toothpaste, baking soda", "Far too alkaline. The redness outlasts the spot."],
  ["Lightening creams", "Many hide mercury or strong steroids that damage skin for years."],
  ["Sugar or salt scrubs", "Sharp grains tear facial skin."],
];

function Guides() {
  return (
    <section className="block" id="guides">
      <div className="wrap">
        <div className="head">
          <h2 className="display">Not everything good for skin comes in a bottle.</h2>
          <p className="lead">
            Food, water worked out for your body and today's weather, bedding, sleep, and what to do on a small budget. A taste, or{" "}
            <a href="guides/">read the full guides</a>:
          </p>
        </div>
        <div className="lists">
          <Rise>
            <h3>Safe on skin</h3>
            {SAFE.map(([t, d], i) => (
              <div className="row" key={t}>
                <div className="i">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <b>{t}</b>
                  <span>{d}</span>
                </div>
              </div>
            ))}
          </Rise>
          <Rise delay={0.1}>
            <h3>Never on your face</h3>
            {NEVER.map(([t, d]) => (
              <div className="row" key={t}>
                <div className="i x" aria-hidden>×</div>
                <div>
                  <b>{t}</b>
                  <span>{d}</span>
                </div>
              </div>
            ))}
          </Rise>
        </div>
      </div>
    </section>
  );
}

function Privacy() {
  return (
    <section className="block" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="head">
          <h2 className="display">Your photos stay on your phone.</h2>
          <p className="lead">
            They're sent encrypted only to be analysed, processed in real time and thrown away, with location data stripped first. Never stored on our servers, never sold, never used to train AI. Export or delete everything from Settings, any time.{" "}
            <a href="privacy.html">The privacy policy</a> has the detail.
          </p>
        </div>
      </div>
    </section>
  );
}

const PLAN_ROWS = [
  ["Skin scans", "2 every 30 days", "As often as you like"],
  ["Routine, reminders, streaks", "Included", "Included"],
  ["Water target, safety guides", "Included", "Included"],
  ["Every guide", "", "Included"],
  ["Skin coach", "", "Included"],
  ["Full progress history, before and after", "", "Included"],
  ["Ads", "Yes", "None"],
];

function Plans() {
  return (
    <section className="block" id="pricing" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="head">
          <h2 className="display">Free to start. $4.99 when you want everything.</h2>
        </div>
        <Rise>
          <table className="plan-table">
            <thead>
              <tr>
                <th />
                <th>Free</th>
                <th>
                  Premium <span>$4.99 a month or $29.99 a year</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {PLAN_ROWS.map(([k, a, b]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td>{a || <span className="none">·</span>}</td>
                  <td>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Rise>
        <p className="fine">Billed through Google Play in your local currency. Cancel any time in Google Play. Premium scans are fair-use.</p>
      </div>
    </section>
  );
}

/** The crescent draws itself when it comes into view. */
function Close() {
  const ref = useRef<SVGSVGElement>(null);
  const seen = useInView(ref, { once: true, margin: "-20% 0px" });
  return (
    <section className="block close">
      <div className="wrap">
        <Mark ref={ref} className="mark" draw={seen} />
        <h2 className="display">Know your skin.</h2>
        <p className="lead" style={{ margin: "22px auto 0" }}>ClearSkin AI, on Google Play.</p>
        <Badge />
      </div>
    </section>
  );
}

function App() {
  useSmoothScroll();
  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <Story />
      <Nine />
      <Statement />
      <Guides />
      <Privacy />
      <Plans />
      <Close />
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
