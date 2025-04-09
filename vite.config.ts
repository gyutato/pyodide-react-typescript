import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Python 파일을 애셋으로 취급
  assetsInclude: ["**/*.py"],
});
