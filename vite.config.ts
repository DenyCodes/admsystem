import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import ReactInspector from "vite-plugin-react-inspector"; // Corrigido: sem as chaves { }

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    // Adiciona o inspector apenas em desenvolvimento
    mode === "development" && ReactInspector(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));