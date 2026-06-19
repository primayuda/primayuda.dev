import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/logos");

/** @type {Record<string, { siteUrl: string }>} */
const logos = {
  cisco: { siteUrl: "https://www.cisco.com" },
  "sembilan-pilar": {
    siteUrl: "https://sps.spilar.net",
    light:
      "https://sps.spilar.net/wp-content/uploads/2024/04/cropped-icon-sps-192x192.png",
    dark: "https://sps.spilar.net/wp-content/uploads/2024/04/cropped-icon-sps-192x192.png",
  },
  starcore: { siteUrl: "https://starcore.co.id" },
  "secure-task": { siteUrl: "https://securetask.id" },
  "divers-paradise": { siteUrl: "https://diversparadisekomodo.com" },
  "nakula-dive": { siteUrl: "https://nakuladive.com" },
  bt: { siteUrl: "https://www.bt.com" },
  "168-solution": { siteUrl: "https://168solution.com" },
  amdocs: { siteUrl: "https://www.amdocs.com" },
  kacindo: { siteUrl: "https://kacindo.co.id" },
  nokia: { siteUrl: "https://www.nokia.com" },
  "sampoerna-telekom": { siteUrl: "https://net1.co.id" },
  esia: { siteUrl: "https://www.esia.co.id" },
  ipb: { siteUrl: "https://ipb.ac.id" },
  itb: { siteUrl: "https://www.itb.ac.id" },
  divessi: { siteUrl: "https://www.divessi.com" },
  padi: { siteUrl: "https://www.padi.com" },
};

function lightUrl(domain) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

function darkUrl(siteUrl) {
  return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(siteUrl)}&size=128`;
}

function duckDuckGoUrl(domain) {
  return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
}

function domainFromSiteUrl(siteUrl) {
  return new URL(siteUrl).hostname.replace(/^www\./, "");
}

async function download(url, { allowNotOk = false } = {}) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok && !allowNotOk) {
    return null;
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer.length > 0 ? buffer : null;
}

async function firstAvailable(urls, options = {}) {
  for (const url of urls) {
    const buffer = await download(url, options);
    if (buffer) {
      return buffer;
    }
  }
  return null;
}

await mkdir(outDir, { recursive: true });

for (const [slug, config] of Object.entries(logos)) {
  const { siteUrl, light: customLight, dark: customDark } = config;
  const domain = domainFromSiteUrl(siteUrl);
  const light =
    (customLight ? await download(customLight) : null) ??
    (await firstAvailable([lightUrl(domain), darkUrl(siteUrl)], {
      allowNotOk: false,
    }) ?? (await download(duckDuckGoUrl(domain), { allowNotOk: true })));
  const dark =
    (customDark ? await download(customDark) : null) ??
    (await firstAvailable([darkUrl(siteUrl), lightUrl(domain)], {
      allowNotOk: false,
    }) ?? (await download(duckDuckGoUrl(domain), { allowNotOk: true })));

  if (!light || !dark) {
    console.warn(`skipped ${slug} (no favicon found)`);
    continue;
  }

  await writeFile(path.join(outDir, `${slug}.png`), light);
  await writeFile(path.join(outDir, `${slug}-dark.png`), dark);
  console.log(`saved ${slug}`);
}

console.log("done");
