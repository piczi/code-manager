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

        // 复制 Ace Editor 资源文件
        const acePath = path.resolve(__dirname, 'node_modules/ace-builds/src-noconflict');
        const distAcePath = path.resolve(__dirname, 'dist/ace');
        fs.ensureDirSync(distAcePath);
        fs.copySync(acePath, distAcePath);
      }
    },
    {
      name: 'copy-ace-resources',
      async writeBundle() {
        // 复制 Ace Editor 资源文件
        const aceSourcePath = path.resolve(__dirname, 'node_modules/ace-builds/src-noconflict');
        const aceTargetPath = path.resolve(__dirname, 'dist/ace');
        await fs.ensureDir(aceTargetPath);
        await fs.copy(aceSourcePath, aceTargetPath);
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
    open: '/index.html'
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
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
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'react-vendor';
            }
            if (id.includes('ace-builds')) {
              if (id.includes('/mode-')) {
                return 'ace-editor-modes';
              }
              if (id.includes('/theme-')) {
                return 'ace-editor-themes';
              }
              if (id.includes('/ext-')) {
                return 'ace-editor-ext';
              }
              return 'ace-editor-core';
            }
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            return 'vendor';
          }
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: true,
    assetsDir: '.',
    terserOptions: {
      // compress: {
      //   drop_console: true,
      //   drop_debugger: true,
      //   pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
      // },
      format: {
        comments: false,
      },
    },
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
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-ace',
      'ace-builds',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-select',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
    ],
  },
})