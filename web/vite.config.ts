import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import legacy from "@vitejs/plugin-legacy"; // 兼容不支持esm的浏览器
import vueJsx from "@vitejs/plugin-vue-jsx"; // Vue支持JSX
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  root: "./",
  plugins: [
    vue(),
    vueJsx(),
    legacy({
      targets: ["defaults", "not IE 11"]
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  define: {
    __VUE_OPTIONS_API__: false
  },
});
