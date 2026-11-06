export function websiteMeta(title: string, description: string) {
  return {
    meta: [
      { title: `${title} | Elimu Bridge` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} | Elimu Bridge` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
