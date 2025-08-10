import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/ToTooCap-FrontEnd/",
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
