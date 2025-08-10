import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
const isGhPages =
  process.env.GITHUB_PAGES === "true" ||
  process.env.VITE_DEPLOY_TARGET === "gh-pages";

export default defineConfig({
  plugins: [react()],
  // Vercel: '/', GH Pages: '/ToTooCap-FrontEnd/'
  base: isGhPages ? "/ToTooCap-FrontEnd/" : "/",
  optimizeDeps: {
    include: ["fabric"],
  },
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
