import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs-extra'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-popup-html',
      closeBundle() {
        // 复制 popup.html 到 dist 根目录
        fs.copyFileSync('src/popup.html', 'dist/popup.html')
        
        // 修改 HTML 中的脚本路径 - 保证资源引用路径正确，并设置更宽的视口大小
        let html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=600, initial-scale=1.0" />
    <title>Code Snippet Manager</title>
    <link rel="stylesheet" href="./popup.css">
    <style>
      body {
        min-width: 600px;
        min-height: 600px;
      }
    </style>
  </head>
  <body class="bg-background text-foreground">
    <div id="root"></div>
    <script type="module" src="./popup.js"></script>
  </body>
</html>`
        
        fs.writeFileSync('dist/popup.html', html)
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'src/main.tsx'),
        background: path.resolve(__dirname, 'src/background.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        // 修改这里，确保CSS文件名是固定的，不包含哈希值
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'popup.css') {
            return 'popup.css';
          }
          return '[name].[hash][extname]';
        },
        chunkFileNames: '[name].[hash].js',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: true,
    assetsDir: '.',
    minify: false,
  },
  publicDir: 'public',
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
    modules: {
      localsConvention: 'camelCase',
    },
  },
})