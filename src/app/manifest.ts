import type { MetadataRoute } from "next";
import { texts } from "@/lib/texts";

const iconBackground = "#0a0a0a";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: texts.app.name,
    short_name: texts.app.name,
    description: texts.app.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: iconBackground,
    theme_color: iconBackground,
    icons: [
      {
        src: "/icons/app-icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/app-icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
