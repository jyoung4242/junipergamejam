import { defineConfig } from "vite";
import pkg from "./package.json";

export default defineConfig({
  base: "./",
  build: {
    target: "esnext", //browsers can handle the latest ES features
  },
  assetsInclude: ["**/*.png", "**/*.jpg", "**/*.svg", "**/*.tff"],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
});
