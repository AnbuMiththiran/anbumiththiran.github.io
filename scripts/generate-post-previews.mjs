// scripts/generate-post-previews.mjs

import fs from "fs";
import path from "path";

const SITE_URL = "https://www.anbumiththiran.in";
const API_BASE = "https://premium-backend-8plp.onrender.com/content/public";

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
  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }

  return response.json();
}

function stripHtml(text = "") {
  return String(text)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildDescription(post) {
  if (post.summary) return post.summary;

  if (post.content) {
    return stripHtml(post.content).substring(0, 160);
  }

  return `Read ${post.title} by ${post.writer || "Anbudan Miththiran"}.`;
}

async function getPostIds() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.warn("sitemap.xml not found");
    return [];
  }

  const sitemap = fs.readFileSync(SITEMAP_PATH, "utf8");

  const matches = [
    ...sitemap.matchAll(/post\.html\?id=(\d+)/g)
  ];

  return [...new Set(matches.map(m => m[1]))];
}

function buildHtml(post) {
  const id = post.id;

  const contentType =
    post.contenttype
      ? post.contenttype.charAt(0).toUpperCase() +
        post.contenttype.slice(1)
      : "Post";

  const title =
    `${post.title} | ${contentType} - Anbudan Miththiran`;

  const description = buildDescription(post);

  let image =
    (post.contenttype === "book"
      ? post.book_cover_url
      : null) ||
    post.image_url ||
    `${SITE_URL}/logo.jpg`;

  if (!image.startsWith("http")) {
    image = SITE_URL + image;
  }

  const imageVersion =
    post.updatedat ||
    post.createdat ||
    Date.now();

  const ogImage =
    `${image}?v=${encodeURIComponent(imageVersion)}`;

  const appUrl =
    `${SITE_URL}/post.html?id=${id}`;

  const previewUrl =
    `${SITE_URL}/p/${id}.html`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    image: [image],
    url: previewUrl,
    mainEntityOfPage: previewUrl,
    datePublished: post.createdat || "",
    dateModified:
      post.updatedat ||
      post.createdat ||
      "",
    author: {
      "@type": "Person",
      name: post.writer || "Anbudan Miththiran"
    },
    publisher: {
      "@type": "Organization",
      name: "Anbudan Miththiran",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.jpg`
      }
    }
  };

  return `<!DOCTYPE html>
<html lang="ta">
<head>

<meta charset="UTF-8">
<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<title>${escapeHtml(title)}</title>

<meta name="description"
      content="${escapeHtml(description)}">

<meta name="robots"
      content="index,follow,max-image-preview:large">

<link rel="canonical"
      href="${escapeHtml(previewUrl)}">

<meta property="og:locale"
      content="ta_IN">

<meta property="og:type"
      content="article">

<meta property="og:site_name"
      content="Anbudan Miththiran">

<meta property="og:title"
      content="${escapeHtml(title)}">

<meta property="og:description"
      content="${escapeHtml(description)}">

<meta property="og:url"
      content="${escapeHtml(previewUrl)}">

<meta property="og:image"
      content="${escapeHtml(ogImage)}">

<meta property="og:image:width"
      content="1200">

<meta property="og:image:height"
      content="630">

<meta property="article:author"
      content="${escapeHtml(
        post.writer || "Anbudan Miththiran"
      )}">

<meta property="article:published_time"
      content="${escapeHtml(
        post.createdat || ""
      )}">

<meta name="twitter:card"
      content="summary_large_image">

<meta name="twitter:title"
      content="${escapeHtml(title)}">

<meta name="twitter:description"
      content="${escapeHtml(description)}">

<meta name="twitter:image"
      content="${escapeHtml(ogImage)}">

<meta name="twitter:url"
      content="${escapeHtml(previewUrl)}">

<script type="application/ld+json">
${JSON.stringify(schema)}
</script>

<meta http-equiv="refresh"
      content="0;url=${escapeHtml(appUrl)}">

<script>
window.location.replace(
  ${JSON.stringify(appUrl)}
);
</script>

</head>

<body>

<p>
Redirecting to
<a href="${escapeHtml(appUrl)}">
${escapeHtml(post.title)}
</a>
</p>

</body>
</html>`;
}

async function main() {
  const ids = await getPostIds();

  if (!ids.length) {
    console.log("No posts found");
    return;
  }

  fs.mkdirSync(OUT_DIR, {
    recursive: true
  });

  let generated = 0;

  for (const id of ids) {
    try {
      const post =
        await fetchJson(`${API_BASE}/${id}`);

      if (!post || !post.title) {
        console.warn(`Skipping ${id}`);
        continue;
      }

      post.id = post.id || id;

      const html = buildHtml(post);

      fs.writeFileSync(
        path.join(OUT_DIR, `${id}.html`),
        html,
        "utf8"
      );

      generated++;
      console.log(`Generated: ${id}`);
    } catch (error) {
      console.error(
        `Failed ${id}:`,
        error.message
      );
    }
  }

  console.log(
    `Generated ${generated}/${ids.length} previews`
  );

  if (fs.existsSync(SITEMAP_PATH)) {
    let sitemap =
      fs.readFileSync(
        SITEMAP_PATH,
        "utf8"
      );

    sitemap = sitemap.replace(
      /https:\/\/www\.anbumiththiran\.in\/post\.html\?id=(\d+)/g,
      (_, id) =>
        `${SITE_URL}/p/${id}.html`
    );

    fs.writeFileSync(
      SITEMAP_PATH,
      sitemap,
      "utf8"
    );

    console.log(
      "Updated sitemap.xml"
    );
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
