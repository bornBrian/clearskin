// Runs after vite build. Turns the app's guides (src/content/guides.json,
// exported from the app by tool/export_guides_test.dart) into plain HTML
// articles at dist/guides/<id>.html, one page per skin question people search
// for, plus a guides index, sitemap.xml and robots.txt. Free guides are
// published in full; Premium ones show their first section and point to the
// app. Also gives the built home page a canonical URL and app structured data.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const web = resolve(here, "..");
const dist = resolve(web, "dist");
const SITE = "https://clearskin.britechapps.com";
const COMPANY = "https://britechapps.com";
const PLAY = "https://play.google.com/store/apps/details?id=com.clearskinai.app";
const guides = JSON.parse(readFileSync(resolve(web, "src/content/guides.json"), "utf8"));
const today = new Date().toISOString().slice(0, 10);

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const ld = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

const org = { "@type": "Organization", "@id": `${COMPANY}/#organization`, name: "Bri Technologies", url: `${COMPANY}/` };
const founder = { "@type": "Person", "@id": `${COMPANY}/born-brian#person`, name: "Born Mugisha Brian", alternateName: "Born Brian", url: `${COMPANY}/born-brian` };
const app = {
  "@type": "MobileApplication",
  "@id": `${SITE}/#app`,
  name: "ClearSkin AI",
  url: `${SITE}/`,
  downloadUrl: PLAY,
  operatingSystem: "Android",
  applicationCategory: "HealthApplication",
  description: "ClearSkin AI scans your face from every side, measures nine things about your skin and builds a skincare routine from what it sees. Made for every skin tone.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@id": org["@id"] },
  creator: { "@id": founder["@id"] },
};

function page({ path, title, description, image, body, data }) {
  const url = `${SITE}/${path}`;
  const img = `${SITE}/${image}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; upgrade-insecure-requests">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(url)}">
<meta name="theme-color" content="#EEF2ED">
<meta property="og:type" content="article">
<meta property="og:site_name" content="ClearSkin AI">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(img)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="guide.css">
${ld(data)}
</head>
<body>
<header class="wrap top">
  <a class="mark" href="../"><img src="../media/mark.svg" width="26" height="26" alt="">ClearSkin AI</a>
  <nav aria-label="Sections"><a href="./">Guides</a><a href="../#how">How it works</a></nav>
  <a class="get" href="${PLAY}">Get the app</a>
</header>
<main>
${body}
</main>
<footer class="wrap">
  <span>© ${today.slice(0, 4)} <a href="${COMPANY}/">Bri Technologies</a>. Guides for general skin care, not medical advice. See a doctor for anything painful, spreading or not healing.</span>
  <a href="../privacy.html">Privacy</a><a href="../terms.html">Terms</a>
</footer>
</body>
</html>
`;
}

function section(s) {
  const points = s.points
    .map(
      (p) => `      <li>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.detail)}</p>${p.evidence ? `\n        <span class="ev">${esc(p.evidence)}</span>` : ""}
      </li>`,
    )
    .join("\n");
  return `    <section class="part${s.avoid ? " avoid" : ""}">
      <h2>${esc(s.heading)}</h2>
      <ol>
${points}
      </ol>
    </section>`;
}

const cta = (lead) => `    <aside class="cta">
      <p>${esc(lead)}</p>
      <a href="${PLAY}"><img src="../media/google-play.png" alt="Get it on Google Play" width="180" height="53"></a>
    </aside>`;

function others(id) {
  return `    <nav class="more" aria-label="More guides">
      <h2>More guides</h2>
${guides
  .filter((g) => g.id !== id)
  .map((g) => `      <a href="${g.id}.html"><b>${esc(g.title)}</b><span>${esc(g.teaser)}</span></a>`)
  .join("\n")}
    </nav>`;
}

mkdirSync(resolve(dist, "guides"), { recursive: true });
writeFileSync(resolve(dist, "guides/guide.css"), readFileSync(resolve(here, "guide.css")));

for (const g of guides) {
  const shown = g.premium ? g.sections.slice(0, 1) : g.sections;
  const hidden = g.sections.length - shown.length;
  const text = [g.teaser, ...g.sections.flatMap((s) => s.points.map((p) => `${p.title}. ${p.detail}`))].join(" ");
  const body = `  <article class="wrap guide">
    <p class="crumbs"><a href="../">ClearSkin AI</a> / <a href="./">Guides</a></p>
    <h1>${esc(g.title)}</h1>
    <p class="lead">${esc(g.teaser)}</p>
    <p class="meta">${g.minutes} min read · from the ClearSkin AI app</p>
    <img class="photo" src="${esc(g.image)}" alt="">
${shown.map(section).join("\n")}
${
  hidden
    ? cta(`${hidden} more section${hidden > 1 ? "s" : ""} of this guide, worked out for your own skin, are in ClearSkin AI Premium.`)
    : cta("ClearSkin AI scans your face from every side and builds your routine from what it sees. The first scans are free.")
}
${others(g.id)}
  </article>`;
  writeFileSync(
    resolve(dist, `guides/${g.id}.html`),
    page({
      path: `guides/${g.id}.html`,
      title: `${g.title} · ClearSkin AI guide`,
      description: g.teaser,
      image: `guides/${g.image}`,
      body,
      data: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            headline: g.title,
            description: g.teaser,
            image: `${SITE}/guides/${g.image}`,
            url: `${SITE}/guides/${g.id}.html`,
            dateModified: today,
            wordCount: text.split(/\s+/).length,
            isAccessibleForFree: !g.premium,
            ...(g.premium ? { hasPart: { "@type": "WebPageElement", isAccessibleForFree: false, cssSelector: ".cta" } } : {}),
            author: { "@id": org["@id"] },
            publisher: org,
            about: { "@id": app["@id"] },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "ClearSkin AI", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE}/guides/` },
              { "@type": "ListItem", position: 3, name: g.title },
            ],
          },
        ],
      },
    }),
  );
}

// Photos are copied from public/guides by vite, so they sit next to the
// pages; the index lists every guide.
const index = `  <section class="wrap guide">
    <p class="crumbs"><a href="../">ClearSkin AI</a> / Guides</p>
    <h1>Skin care guides</h1>
    <p class="lead">Straight answers for real skin: what to buy on a small budget, which kitchen remedies help and which burn, why lightening creams are dangerous, how much water you need, and how weather, bedding, food and sleep show up on your face.</p>
    <div class="cards">
${guides
  .map(
    (g) => `      <a class="card" href="${g.id}.html">
        <img src="${esc(g.image)}" alt="" loading="lazy">
        <b>${esc(g.title)}</b>
        <span>${esc(g.teaser)}</span>
        <i>${g.minutes} min${g.premium ? " · Premium in the app" : ""}</i>
      </a>`,
  )
  .join("\n")}
    </div>
${cta("Every guide in the app is matched to what your scan finds. The first scans are free.")}
  </section>`;
writeFileSync(
  resolve(dist, "guides/index.html"),
  page({
    path: "guides/",
    title: "Skin care guides · ClearSkin AI",
    description: "Free skin care guides: a routine on a small budget, safe kitchen remedies, the dangers of lightening creams, water, weather, bedding, food and sleep.",
    image: `guides/${guides[0].image}`,
    body: index,
    data: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Skin care guides",
      url: `${SITE}/guides/`,
      publisher: org,
      hasPart: guides.map((g) => ({ "@type": "Article", headline: g.title, url: `${SITE}/guides/${g.id}.html` })),
    },
  }),
);

// Home page: canonical URL, absolute share image and the app's structured data.
const homeFile = resolve(dist, "index.html");
let home = readFileSync(homeFile, "utf8");
if (!home.includes('rel="canonical"')) {
  home = home
    .replace('content="media/og.jpg"', `content="${SITE}/media/og.jpg"`)
    .replace(
      "</head>",
      `<link rel="canonical" href="${SITE}/">\n<meta property="og:url" content="${SITE}/">\n<meta name="twitter:card" content="summary_large_image">\n${ld({
        "@context": "https://schema.org",
        "@graph": [app, org, founder, { "@type": "WebSite", url: `${SITE}/`, name: "ClearSkin AI", publisher: { "@id": org["@id"] } }],
      })}\n</head>`,
    );
  writeFileSync(homeFile, home);
}

const urls = ["", "guides/", ...guides.map((g) => `guides/${g.id}.html`), "privacy.html", "terms.html"];
writeFileSync(
  resolve(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${SITE}/${u}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`,
);
writeFileSync(resolve(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`seo: ${guides.length} guide pages, index, sitemap (${urls.length} urls), robots.txt`);
