// filepath: d:\workspace\code-manager\src\components\FullscreenViewer.tsx
import React, { useEffect } from 'react';
import { CodeViewer } from './CodeEditor';

/**
 * 全屏代码查看器页面组件
 * 这个组件会从localStorage获取代码数据，然后在全屏模式下显示
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
      // 从URL的hash部分获取存储键
      const hashPath = window.location.hash;
      const queryPart = hashPath.split('?')[1] || '';
      const searchParams = new URLSearchParams(queryPart);
      
      // 获取存储键
      const storageKey = searchParams.get('key');
      
      if (!storageKey) {
        throw new Error('未找到代码存储键');
      }
      
      // 从localStorage获取代码数据
      const storedData = localStorage.getItem(storageKey);
      
      if (!storedData) {
        throw new Error('未找到存储的代码数据');
      }
      
      // 解析代码数据
      const parsedData = JSON.parse(storedData);
      
      // 设置页面标题
      document.title = `${parsedData.title || '代码查看器'} - 代码管理器`;
      
      // 设置代码数据
      setCodeData({
        code: parsedData.code || '',
        language: parsedData.language || 'javascript',
        title: parsedData.title || '代码查看器'
      });
      
      // 查看完后，从localStorage移除数据以节省空间
      // 使用setTimeout确保代码已经被正确渲染
      setTimeout(() => {
        localStorage.removeItem(storageKey);
      }, 1000);
      
    } catch (error) {
      console.error('获取代码数据时出错:', error);
      // 设置一个友好的错误消息作为代码内容
      setCodeData({
        code: '无法加载代码内容。' + (error instanceof Error ? error.message : '未知错误'),
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
