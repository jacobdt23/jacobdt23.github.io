import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://jacobdt23.github.io",
  trailingSlash: "always",
  build: { format: "directory" },
  redirects: {
    // Old alias kept so existing /contact/ links still work
    "/contact/": "/where-to-find-me/",
  },
});
