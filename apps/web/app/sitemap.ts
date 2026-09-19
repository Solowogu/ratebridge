import type { MetadataRoute } from "next";
import { providers } from "./data/providers";

const BASE_URL = "https://www.pagosync.com";

function createSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPages = [
    "",
    "/about",
    "/affiliate-disclosure",
    "/how-we-compare",
    "/privacy",
  ];

  const pageEntries = publicPages.map((path) => ({
    url: `${BASE_URL}${path}`,
  }));

  const providerEntries = providers.map((provider) => ({
    url: `${BASE_URL}/providers/${createSlug(provider.name)}`,
  }));

  return [...pageEntries, ...providerEntries];
}
