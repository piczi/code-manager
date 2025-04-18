import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs-extra'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-popup-html',
      closeBundle() {
        // 复制 popup.html 到 dist 根目录
        fs.copyFileSync('src/popup.html', 'dist/popup.html')
        
        // 修改 HTML 中的脚本路径
        let html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Code Snippet Manager</title>
    <link rel="stylesheet" href="./popup.css">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./popup.js"></script>
  </body>
</html>`
        
        fs.writeFileSync('dist/popup.html', html)
      }
    },
    {
      name: 'copy-monaco-editor',
      async buildStart() {
        const sourceDir = path.resolve(__dirname, 'node_modules/monaco-editor/min/vs');
        const targetDir = path.resolve(__dirname, 'public/node_modules/monaco-editor/min/vs');
        
        await fs.ensureDir(path.dirname(targetDir));
        await fs.copy(sourceDir, targetDir);
        
        console.log('Monaco Editor files copied successfully!');
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
        assetFileNames: '[name].[hash][extname]',
        chunkFileNames: '[name].[hash].js',
        manualChunks: {
          'monaco-editor': ['@monaco-editor/react'],
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: true,
    assetsDir: '.',
    minify: false,
  },
  publicDir: 'public',
  optimizeDeps: {
    include: ['@monaco-editor/react'],
  },
  css: {
    postcss: './postcss.config.js',
  },
}) 