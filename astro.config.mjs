// @ts-check
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  site: "https://zohaibakber.com",
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Inter Tight",
      cssVariable: "--font-sans",
      weights: ["300 600"],
      styles: ["normal"],
      fallbacks: ["Helvetica Neue", "Arial", "sans-serif"],
    },
  ],
});
