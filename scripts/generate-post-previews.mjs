// scripts/generate-post-previews.mjs
//
// Generates one static HTML file per post at /p/<id>.html.
// Each file contains REAL <title>, og:*, twitter:*, and JSON-LD tags for that
// specific post, baked directly into the HTML at build time. This is what
// makes social media (WhatsApp, Facebook, Twitter/X, etc.) previews work
// correctly on GitHub Pages, since GitHub Pages serves static files only and
// cannot run PHP or any other server-side code, and crawlers never run
// the page's JavaScript.
//
// Visiting /p/<id>.html:
//   - Shows a real, correct preview when scraped by a social network crawler.
//   - Immediately redirects real human visitors into the full interactive
//     app at /post.html?id=<id>, where the existing fetchPost() JS takes over.
//
// Run with: node scripts/generate-post-previews.mjs
// (Also run automatically by .github/workflows/generate-post-previews.yml)

import fs from "fs";
import path from "path";

const SITE_URL = "https://www.anbumiththiran.in";
const API_BASE = "https://premium-backend-8plp.onrender.com/content/public";
// If you maintain a list-all endpoint, set it here. Otherwise this script
// will fall back to reading the post IDs out of sitemap.xml.
const LIST_API = process.env.POSTS_LIST_API || ""; // e.g. "https://premium-backend-8plp.onrender.com/content/public"

const OUT_DIR = path.join(process.cwd(), "p");
const SITEMAP_PATH = path.join(process.cwd(), "sitemap.xml");

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Request failed (${res.status}): ${url}`);
  return res.json();
}

// Try to discover post IDs. Prefers a list endpoint if provided via env var,
// otherwise falls back to parsing existing sitemap.xml for post.html?id=N entries.
async function getPostIds() {
  if (LIST_API) {
    try {
      const data = await fetchJson(LIST_API);
      const list = Array.isArray(data) ? data : data.posts || data.results || [];
      const ids = list.map((p) => p.id).filter(Boolean);
      if (ids.length) return ids;
    } catch (err) {
      console.warn("List API failed, falling back to sitemap.xml:", err.message);
    }
  }

  if (fs.existsSync(SITEMAP_PATH)) {
    const xml = fs.readFileSync(SITEMAP_PATH, "utf8");
    const ids = [...xml.matchAll(/post\.html\?id=(\d+)/g)].map((m) => m[1]);
    if (ids.length) return [...new Set(ids)];
  }

  console.warn("No post IDs discovered. Nothing to generate.");
  return [];
}

function buildHtml(post) {
  const id = post.id;
  const contentType = post.contenttype
    ? post.contenttype.charAt(0).toUpperCase() + post.contenttype.slice(1)
    : "Post";
  const title = `${post.title} | ${contentType} - Anbudan Miththiran`;
  const description = post.tags && post.tags.length
    ? `Read ${post.title} by ${post.writer || "Anbudan Miththiran"}. Tags: ${post.tags.join(", ")}`
    : `Read ${post.title} by ${post.writer || "Anbudan Miththiran"}.`;
  const displayImage =
    (post.contenttype === "book" ? post.book_cover_url : null) ||
    post.image_url ||
    `${SITE_URL}/logo.jpg`;
  const appUrl = `${SITE_URL}/post.html?id=${encodeURIComponent(id)}`;
  const previewUrl = `${SITE_URL}/p/${encodeURIComponent(id)}.html`;

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: contentType,
            item: `${SITE_URL}/category.html?type=${post.contenttype || ""}`,
          },
          { "@type": "ListItem", position: 3, name: post.title },
        ],
      },
      {
        "@type": "Article",
        headline: post.title,
        description,
        image: displayImage,
        author: { "@type": "Person", name: post.writer || "Anbudan Miththiran" },
        datePublished: post.createdat,
        publisher: {
          "@type": "Organization",
          name: "Anbudan Miththiran",
          logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.jpg` },
        },
      },
    ],
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${escapeHtml(appUrl)}">

<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:image" content="${escapeHtml(displayImage)}">
<meta property="og:url" content="${escapeHtml(previewUrl)}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Anbudan Miththiran">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${escapeHtml(displayImage)}">

<script type="application/ld+json">${JSON.stringify(schemaData)}</script>

<!-- Send real human visitors straight into the interactive app.
     Crawlers (Facebook, WhatsApp, Twitter, etc.) do not execute JS or
     follow meta-refresh in a way that affects the scraped preview, so they
     will read only the tags above. -->
<meta http-equiv="refresh" content="0; url=${escapeHtml(appUrl)}">
<script>window.location.replace(${JSON.stringify(appUrl)});</script>
</head>
<body>
<p>Redirecting to <a href="${escapeHtml(appUrl)}">${escapeHtml(post.title)}</a>...</p>
</body>
</html>
`;
}

async function main() {
  const ids = await getPostIds();
  if (!ids.length) return;

  fs.mkdirSync(OUT_DIR, { recursive: true });

  let success = 0;
  for (const id of ids) {
    try {
      const post = await fetchJson(`${API_BASE}/${id}`);
      if (!post || post.success === false || !post.title) {
        console.warn(`Skipping post ${id}: not found or premium.`);
        continue;
      }
      post.id = post.id || id;
      const html = buildHtml(post);
      fs.writeFileSync(path.join(OUT_DIR, `${id}.html`), html, "utf8");
      success++;
    } catch (err) {
      console.warn(`Failed to generate preview for post ${id}:`, err.message);
    }
  }

  console.log(`Generated ${success}/${ids.length} post preview pages in /p`);

  // Update sitemap.xml: replace post.html?id=N entries with /p/N.html entries
  // so that social media crawlers and search engines index the correct shareable URLs.
  if (fs.existsSync(SITEMAP_PATH)) {
    let sitemap = fs.readFileSync(SITEMAP_PATH, "utf8");
    sitemap = sitemap.replace(
      /https:\/\/www\.anbumiththiran\.in\/post\.html\?id=(\d+)/g,
      (_, id) => `${SITE_URL}/p/${id}.html`
    );
    fs.writeFileSync(SITEMAP_PATH, sitemap, "utf8");
    console.log("Updated sitemap.xml: post URLs now point to /p/<id>.html");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
