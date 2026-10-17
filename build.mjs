// Génère le site à partir de la source lisible index.src.html :
//   index.html (FR), ar/index.html, en/index.html (minifiés) + sitemap.xml
//   (lastmod = date du build seulement pour les pages dont le contenu a changé).
// Les pages AR/EN reçoivent leurs propres <title>, meta, JSON-LD et contenu <noscript>,
// générés à partir des données trilingues déjà présentes dans le script de la page.
// Usage : node build.mjs   (ou sh build.sh)
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

process.chdir(dirname(fileURLToPath(import.meta.url)));
const SITE = "https://fcr-tunisie.com";
const MINIFIER = "html-minifier-terser@7.2.0";
const PATHS = { fr: "/", ar: "/ar/", en: "/en/" };
const src = readFileSync("index.src.html", "utf8");

/* ---------- Données trilingues (extraites du script de la page) ---------- */
function loadData() {
  const start = src.indexOf('const UPDATED = ');
  const end = src.indexOf('const KEY = "fcr-tn-v3";');
  if (start < 0 || end < 0) throw new Error("Bloc de données introuvable dans index.src.html");
  const code = src.slice(start, end) + ";({UPDATED, DATA, CONDS, LEAD, CONTENT, FAQS, DISCLAIMER})";
  return vm.runInNewContext(code, { document: { documentElement: { lang: "fr" } } });
}
const D = loadData();

/* ---------- Contrôles de cohérence de la source (le build s'arrête si un point est oublié) ---------- */
const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
function checkSource() {
  const errors = [];
  const [, day, month, year] = D.UPDATED.match(/^(\d{1,2}) (\S+) (\d{4})$/) || [];
  const m = MONTHS.indexOf(month);
  if (m < 0) throw new Error(`UPDATED doit être au format « 17 octobre 2026 » (actuel : « ${D.UPDATED} »)`);
  const iso = `${year}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  for (const [, d] of src.matchAll(/"dateModified": "([\d-]+)"/g))
    if (d !== iso) errors.push(`index.src.html : JSON-LD "dateModified": "${d}" ≠ ${iso} (UPDATED)`);
  const noscript = src.match(/<noscript>[\s\S]*?<\/noscript>/)[0];
  if (!noscript.includes(D.UPDATED)) errors.push(`index.src.html : la date du <noscript> FR doit être « ${D.UPDATED} »`);
  if (!readFileSync("llms.txt", "utf8").includes(`Dernière mise à jour : ${D.UPDATED}.`))
    errors.push(`llms.txt : « Dernière mise à jour : ${D.UPDATED}. » attendu`);
  const ldFr = JSON.parse(src.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const faqFr = ldFr["@graph"].find(g => g["@type"] === "FAQPage").mainEntity.length;
  if (faqFr !== D.FAQS.length) errors.push(`index.src.html : JSON-LD FR a ${faqFr} questions, FAQS en a ${D.FAQS.length} (à synchroniser)`);
  for (const f of D.FAQS) for (const l of ["fr", "ar", "en"])
    if (!f.q[l] || !f.a[l]) errors.push(`FAQS : traduction « ${l} » manquante pour « ${f.q.fr} »`);
  if (errors.length) throw new Error("Source incohérente :\n- " + errors.join("\n- "));
}
try { checkSource(); } catch (e) { console.error(`\n❌ ${e.message}\n`); process.exit(1); }

/* ---------- Contrôle des pages générées ---------- */
function checkPage(l, html) {
  if (!html.includes(`<html lang="${l}"`)) throw new Error(`${l} : <html lang="${l}"> absent`);
  if (!html.includes(`href="${SITE}${PATHS[l]}"`) || !/rel="?canonical"?/.test(html)) throw new Error(`${l} : canonical absent`);
  for (const x of [...Object.keys(PATHS), "x-default"])
    if (!html.includes(`hreflang="${x}"`) && !html.includes(`hreflang=${x}`)) throw new Error(`${l} : hreflang ${x} absent`);
  for (const [, json] of html.matchAll(/<script type="?application\/ld\+json"?>([\s\S]*?)<\/script>/g)) JSON.parse(json);
}

/* ---------- Textes SEO propres à chaque langue ---------- */
const META = {
  ar: {
    locale: "ar_TN",
    title: "FCR تونس 2026 — توريد سيارتك دون معاليم (العودة النهائية) · قائمة الخطوات",
    description: "نظام FCR 2026: استورد سيارتك إلى تونس بإعفاء كلي (0٪) أو جزئي (25٪) من المعاليم والأداءات. قائمة مجانية للتونسيين المقيمين بالخارج: الشروط، الوثائق، الديوانة، المعاينة، اللوحة «ن ت»، خطوة بخطوة.",
    keywords: "FCR تونس, FCR 2026, العودة النهائية, تغيير مكان الإقامة, توريد سيارة إلى تونس, التونسيون المقيمون بالخارج, الديوانة التونسية, لوحة ن ت, المعاينة, الوكالة الفنية للنقل البري, امتياز جبائي, سيارة كهربائية FCR",
    h1: "FCR تونس 2026 — توريد سيارتك (تغيير مكان الإقامة)",
    disclaimerShort: "أداة مساعدة غير رسمية. تحقّق دائمًا لدى الديوانة التونسية والوكالة الفنية للنقل البري والقنصلية.",
  },
  en: {
    locale: "en_US",
    title: "FCR Tunisia 2026 — Import your car tax-free (permanent return) · Checklist",
    description: "FCR Tunisia 2026: import your car into Tunisia fully exempt (0%) or at 25% of duties and taxes. Free checklist for Tunisians living abroad: conditions, documents, customs, ATTT inspection, « ن ت » plate, step by step.",
    keywords: "FCR Tunisia, FCR 2026, import car to Tunisia tax free, permanent return Tunisia, change of residence Tunisia car, Tunisians living abroad, Tunisian customs, ATTT, RS plate, electric car FCR",
    h1: "FCR Tunisia 2026 — Import your car (change of residence)",
    disclaimerShort: "Unofficial helper tool. Always check with Tunisian Customs, the ATTT and the Tunisian Consulate.",
  },
};

const tr = (v, l) => (v && typeof v === "object" ? (v[l] ?? v.fr) : v);
// Texte HTML des données : on garde les balises (<b>…) mais on échappe les « < » littéraux (ex. « < 3,5 t »).
const h = (v, l) => String(tr(v, l)).replace(/<(?![a-zA-Z\/!])/g, "&lt;");
const attr = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const text = s => String(s).replace(/<[^>]+>/g, "");
const section = key => D.DATA.find(s => s.key === key);

function seoBlock(l) {
  const m = META[l], url = SITE + PATHS[l];
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization", "@id": `${SITE}/#org`, name: "FCR Tunisie", url: `${SITE}/`, logo: `${SITE}/og-image.svg`,
      },
      {
        "@type": "WebSite", "@id": `${SITE}/#website`, name: "FCR Tunisie", url: `${SITE}/`,
        inLanguage: Object.keys(PATHS), publisher: { "@id": `${SITE}/#org` },
      },
      {
        "@type": "WebPage", "@id": `${url}#webpage`, url, name: m.title, description: m.description,
        inLanguage: l, isPartOf: { "@id": `${SITE}/#website` }, publisher: { "@id": `${SITE}/#org` },
      },
      {
        "@type": "FAQPage", inLanguage: l,
        mainEntity: D.FAQS.map(f => ({
          "@type": "Question", name: text(tr(f.q, l)),
          acceptedAnswer: { "@type": "Answer", text: text(tr(f.a, l)) },
        })),
      },
    ],
  };
  const others = Object.keys(PATHS).filter(x => x !== l)
    .map(x => `<meta property="og:locale:alternate" content="${x === "fr" ? "fr_TN" : META[x].locale}" />`).join("\n");
  return `<title>${attr(m.title)}</title>
<meta name="description" content="${attr(m.description)}" />
<meta name="keywords" content="${attr(m.keywords)}" />
<meta name="author" content="FCR Tunisie" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
<link rel="canonical" href="${url}" />
<meta name="theme-color" content="#dc2640" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="${m.locale}" />
${others}
<meta property="og:site_name" content="FCR Tunisie" />
<meta property="og:title" content="${attr(m.title)}" />
<meta property="og:description" content="${attr(m.description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${SITE}/og-image.svg" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${attr(m.title)}" />
<meta name="twitter:description" content="${attr(m.description)}" />
<meta name="twitter:image" content="${SITE}/og-image.svg" />
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`;
}

function noscriptBlock(l) {
  const phases = D.DATA.filter(s => /^p[1-9]$/.test(s.key)).map(s =>
    `<h2>${h(s.phase, l)} — ${h(s.title, l)}</h2><p>${h(s.sub, l)}</p>` +
    s.groups.map(g => `<h3>${h(g.title, l)}</h3><ul>${g.items.map(i => `<li><strong>${h(i.t, l)}:</strong> ${h(i.d, l)}</li>`).join("")}</ul>`).join(""));
  return `<noscript>
    <article style="max-width:820px;margin:1rem auto;padding:1rem;line-height:1.6">
      <h1>${META[l].h1}</h1>
      <p>${h(D.LEAD, l)}</p>
      ${D.CONTENT.map(c => `<h2>${h(c.h, l)}</h2><p>${h(c.p, l)}</p>`).join("")}
      <h2>${h(section("cond").title, l)}</h2>
      <ul>${D.CONDS.map(c => `<li><strong>${h(c.t, l)}:</strong> ${h(c.d, l)}</li>`).join("")}</ul>
      ${phases.join("")}
      <h2>${h(section("faq").title, l)}</h2>
      ${D.FAQS.map(f => `<p><strong>${h(f.q, l)}</strong> ${h(f.a, l)}</p>`).join("")}
      <p><em>${META[l].disclaimerShort}</em></p>
    </article>
  </noscript>`;
}

function replaceBetween(html, startRe, endRe, replacement) {
  const s = html.search(startRe), e = html.search(endRe);
  if (s < 0 || e < 0 || e < s) throw new Error(`Marqueur introuvable : ${startRe}`);
  const endLen = html.slice(e).match(endRe)[0].length;
  return html.slice(0, s) + replacement + html.slice(e + endLen);
}

function page(l) {
  if (l === "fr") return src;
  if (!src.includes('<html lang="fr">')) throw new Error('Balise <html lang="fr"> introuvable dans index.src.html');
  let html = src.replace('<html lang="fr">', `<html lang="${l}"${l === "ar" ? ' dir="rtl"' : ""}>`);
  html = replaceBetween(html, /<!-- SEO:START/, /<!-- SEO:END -->/, seoBlock(l));
  html = replaceBetween(html, /<noscript>/, /<\/noscript>/, noscriptBlock(l));
  return html;
}

/* ---------- Minification (mêmes options qu'avant) ---------- */
function minify(input, output) {
  execFileSync("npx", ["--yes", MINIFIER,
    "--collapse-whitespace", "--remove-comments", "--remove-redundant-attributes",
    "--remove-script-type-attributes", "--minify-css", "true",
    "--minify-js", '{"mangle":true,"compress":true}',
    "-o", output, input], { stdio: ["ignore", "ignore", "inherit"] });
}

const tmp = mkdtempSync(join(tmpdir(), "fcr-build-"));
const changed = {};
for (const l of Object.keys(PATHS)) {
  const out = l === "fr" ? "index.html" : `${l}/index.html`;
  if (l !== "fr") mkdirSync(l, { recursive: true });
  const tmpFile = join(tmp, `${l}.html`);
  writeFileSync(tmpFile, page(l));
  const before = existsSync(out) ? readFileSync(out, "utf8") : null;
  minify(tmpFile, out);
  const built = readFileSync(out, "utf8");
  checkPage(l, built);
  changed[l] = built !== before;
  console.log(`OK -> ${out} (${readFileSync(out).length} octets)`);
}

/* ---------- Sitemap avec alternates hreflang ---------- */
const today = new Date().toISOString().slice(0, 10);
const oldSitemap = existsSync("sitemap.xml") ? readFileSync("sitemap.xml", "utf8") : "";
const lastmod = (l, p) => {
  const prev = oldSitemap.match(new RegExp(`<loc>${SITE}${p}</loc>\\s*<lastmod>([\\d-]+)</lastmod>`));
  return !changed[l] && prev ? prev[1] : today;
};
const alternates = Object.entries(PATHS)
  .map(([l, p]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${p}"/>`)
  .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>`).join("\n");
const urls = Object.entries(PATHS).map(([l, p]) => `  <url>
    <loc>${SITE}${p}</loc>
    <lastmod>${lastmod(l, p)}</lastmod>
${alternates}
  </url>`).join("\n");
writeFileSync("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`);
console.log(`OK -> sitemap.xml (pages modifiées : ${Object.keys(changed).filter(l => changed[l]).join(", ") || "aucune"})`);
