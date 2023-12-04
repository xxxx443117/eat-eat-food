import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  // HTTPS_DEV
  return {
    server: {
      port: 6695,
    },
  };
});
