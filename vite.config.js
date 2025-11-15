import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy:
        mode === "development"
          ? {
              "/api": {
                target: "http://localhost:7777",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
              },
            }
          : undefined,
    },
  };
});
