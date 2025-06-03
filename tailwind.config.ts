// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,ts,js,jsx,tsx}", // 包括 TypeScript 和 Vue 文件
  ],
  theme: {
    extend: {}, // 你可以在这里扩展 Tailwind 配置
  },
  plugins: [],
};