import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Use GitHub Pages style base ONLY when explicitly building for it.
// Local dev + Vercel deploy should use base '/'.
const isGhPages =
  process.env.GITHUB_PAGES === "true" ||
  process.env.VITE_DEPLOY_TARGET === "gh-pages";

export default defineConfig({
  plugins: [react()],

  base: isGhPages ? "/ToTooCap-FrontEnd/" : "/",

  optimizeDeps: {
    include: ["fabric"],
  },
  server: {
    port: 3000,
    open: true, // will open http://localhost:3000/ (correct) when base=/
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
