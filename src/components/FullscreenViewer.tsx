// filepath: d:\workspace\code-manager\src\components\FullscreenViewer.tsx
import React, { useEffect } from 'react';
import { CodeViewer } from './CodeEditor';

/**
 * 全屏代码查看器页面组件
 * 这个组件会从URL的hash参数中获取代码和语言信息，然后在全屏模式下显示
 */
const FullscreenViewer: React.FC = () => {
  // 从URL参数中获取代码和语言
  const [codeData, setCodeData] = React.useState<{
    code: string;
    language: string;
    title: string;
  }>({
    code: '',
    language: 'javascript',
    title: '代码查看器'
  });

  useEffect(() => {
    try {
      // 从URL的hash部分获取参数
      // 假设格式是: #/fullscreen?code=xxx&language=xxx&title=xxx
      const hashPath = window.location.hash;
      const queryPart = hashPath.split('?')[1] || '';
      const searchParams = new URLSearchParams(queryPart);
      
      const code = searchParams.get('code') || '';
      const language = searchParams.get('language') || 'javascript';
      const title = searchParams.get('title') || '代码查看器';
      
      // 设置页面标题
      document.title = `${title} - 代码管理器`;
      
      // 设置代码数据
      setCodeData({
        code: decodeURIComponent(code),
        language,
        title
      });
    } catch (error) {
      console.error('解析URL参数时出错:', error);
      // 设置一个友好的错误消息作为代码内容
      setCodeData({
        code: '无法加载代码内容。可能是URL参数格式不正确。',
        language: 'text',
        title: '加载错误'
      });
    }
  }, []);

  return (
    <div className="fullscreen-viewer">
      <CodeViewer 
        value={codeData.code} 
        mode={codeData.language}
        isFullscreen={true}
      />
    </div>
  );
};

export default FullscreenViewer;