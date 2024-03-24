import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/main", "/gameplay"],
        disallow: "/",
      },
    ],
    sitemap: "https://duelovky.net/sitemap.xml",
  };
}
