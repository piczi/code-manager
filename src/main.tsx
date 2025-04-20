import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Toaster } from '@/components/ui/toaster'
import FullscreenViewer from './components/FullscreenViewer'

// 使用 hash 路由模式来避免 404 问题
// 检查URL的hash部分是否包含 fullscreen
const isFullscreenPath = window.location.hash.includes('#/fullscreen');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {isFullscreenPath ? <FullscreenViewer /> : <App />}
    <Toaster />
  </React.StrictMode>,
)