/// <reference types="vitest"/>
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

const isPreview = process.env.NODE_ENV === "preview";
console.log("環境変数 = " + process.env.NODE_ENV);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./vitest-setup.ts"],
  },
  build: {
    outDir: "./dist",
  },
  ...(isPreview ? { assetsInclude: ["robots.txt"] } : {}), // preview環境をクローリング対象外にするため

  /**
   * 今後GTMも実装し、環境によって出し分ける予定
   * https://sunday-morning.app/posts/2021-05-02-vercel-preview-fixed-subdomain
   * https://qiita.com/AsilHatake/items/905a5bccddca584dc068
   */
});
