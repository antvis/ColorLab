import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths({
      projects: ["./tsconfig.json"],
    }),
  ],

  css: {
    preprocessorOptions: {
      less: {
        // 是否启用 Less 中的 JavaScript 表达式支持, 比如 width: (100 / 2)px;
        javascriptEnabled: true,
        // 常用于全局变量、全局 mixin, 避免每个文件手动 @import
        additionalData: `
          @import "antd/es/style/themes/default.less";
          @import "@/styles/variables.less";
        `,
        // 强制数学运算，即使带单位
        math: 'always',
        // 允许无括号的运算
        strictMath: false,
      },
    },
  },

  // 基础路径
  base: "/",

  // 解析别名
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // 添加其他需要的别名
    },
  },

  // 环境变量配置
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },

  // 开发服务器配置
  server: {
    port: 8000,
    open: true, // 服务启动成功后默认打开浏览器
  },
});
