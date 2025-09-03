import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.jsx",
      name: "MyWidget",
      fileName: (format) => `my-widget.${format}.js`,
      formats: ["umd"],
    },
  },
});
