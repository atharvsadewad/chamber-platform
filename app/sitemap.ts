import type { MetadataRoute } from "next";

const BASE_URL = "https://lawsandjudgments.in";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
    },
    {
      url: `${BASE_URL}/newspaper`,
    },
    {
      url: `${BASE_URL}/drafts`,
    },
    {
      url: `${BASE_URL}/procedures`,
    },
    {
      url: `${BASE_URL}/dictionary`,
    },
    {
      url: `${BASE_URL}/research`,
    },
    {
      url: `${BASE_URL}/bare-acts`,
    },
    {
      url: `${BASE_URL}/judgments`,
    },
    {
      url: `${BASE_URL}/ai`,
    },
  ];
}