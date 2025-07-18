import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ""); // Third argument to load all env variables, including the ones with no prefixes.

  const BACKEND_URL = env.BACKEND_URL; // Access the variable here

  console.log("Backend URL:", BACKEND_URL); // It's a good practice to verify if the variable is loaded

  return defineConfig({
    define: {
      APP_ENV: JSON.stringify(BACKEND_URL), // Pass the value to the front end
    },
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: BACKEND_URL, // Backend URL should be directly used in the target
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  });
});
