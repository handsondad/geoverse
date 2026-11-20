import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    // three-vendor（约 600 KB）只在 3D 地球仪路由按需加载，不进首屏
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const norm = id.replace(/\\/g, "/");
          if (norm.includes("/node_modules/three/")) return "three-vendor";
          if (norm.includes("/node_modules/")) return "vendor";
          if (norm.includes("/src/data/geo/")) return "geo-data";
        }
      }
    }
  }
});
