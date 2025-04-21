import React, { useEffect } from 'react';
import { usePerformance } from '../hooks/usePerformance';
import AceEditor from 'react-ace';

// 导入ace核心模块
import ace from 'ace-builds';
// 手动设置Ace编辑器的基础路径，不使用webpack-resolver
// 注意：这里的路径是相对于构建后的位置
ace.config.set('basePath', '/node_modules/ace-builds/src-noconflict');
ace.config.set('modePath', '/node_modules/ace-builds/src-noconflict');
ace.config.set('themePath', '/node_modules/ace-builds/src-noconflict');
ace.config.set('workerPath', '/node_modules/ace-builds/src-noconflict');
// 'extPath' 不是有效的配置选项，移除它

// 导入基础依赖
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/ext-language_tools';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  mode?: string;
  theme?: string;
}

interface CodeViewerProps {
  value: string;
  mode?: string;
  theme?: string;
  isFullscreen?: boolean;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ 
  value, 
  mode = 'javascript',
  theme = 'tomorrow_night',
  isFullscreen = false
}) => {
  const { startRender } = usePerformance('CodeViewer');
  useEffect(() => {
    startRender();
    
    // 确保 ACE 编辑器的滚动条可见
    document.documentElement.style.setProperty('--scrollbarBG', 'rgba(100, 100, 100, 0.2)');
    document.documentElement.style.setProperty('--thumbBG', 'rgba(180, 180, 180, 0.5)');
    
    // 应用自定义样式到编辑器
    const style = document.createElement('style');
    style.textContent = `
      .ace_scrollbar::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        background: var(--scrollbarBG);
      }
      .ace_scrollbar::-webkit-scrollbar-thumb {
        background-color: var(--thumbBG);
        border-radius: 6px;
      }
      .ace_scrollbar {
        scrollbar-width: thin;
        scrollbar-color: var(--thumbBG) var(--scrollbarBG);
      }
      .ace_scrollbar-v {
        cursor: default;
        position: absolute;
        z-index: 6;
        width: 10px !important;
        right: 0;
      }
      .ace_scrollbar-h {
        cursor: default;
        position: absolute;
        z-index: 6;
        bottom: 0;
        height: 10px !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [startRender]);

  return (
    <div 
      className={`relative rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-6' : ''}`} 
      style={{ minHeight: isFullscreen ? '100vh' : '200px' }}
    >
      <div className="absolute inset-0">
        <AceEditor
          mode={mode}
          theme={theme}
          value={value}
          name={`code-viewer-${isFullscreen ? 'fullscreen' : 'normal'}`}
          editorProps={{ 
            $blockScrolling: false, // 关闭 blockScrolling 以确保滚动条正常显示
            showPrintMargin: false,
          }}
          setOptions={{
            showLineNumbers: true,
            tabSize: 2,
            highlightActiveLine: false,
            highlightGutterLine: false,
            showGutter: true,
            displayIndentGuides: true,
            readOnly: true,
            showPrintMargin: false,
            wrap: false,
            useSoftTabs: true,
            useWorker: false,
            fontSize: isFullscreen ? 16 : 14,
            fontFamily: "monospace",
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showFoldWidgets: false,
            showInvisibles: false,
            autoScrollEditorIntoView: false,
            scrollPastEnd: true,
            fixedWidthGutter: true,
            dragEnabled: false,
            mergeUndoDeltas: false,
            behavioursEnabled: false,
            wrapBehavioursEnabled: false,
            copyWithEmptySelection: false,
            fadeFoldWidgets: false,
            indentedSoftWrap: false,
            hScrollBarAlwaysVisible: true, // 确保水平滚动条总是可见
            vScrollBarAlwaysVisible: true  // 确保垂直滚动条总是可见
          }}
          width="100%"
          height="100%"
          style={{
            backgroundColor: '#2d2d2d',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            fontSize: isFullscreen ? 16 : 14,
          }}
          wrapEnabled={false}
          showPrintMargin={false}
        />
      </div>
      {isFullscreen && (
        <div className="absolute top-4 right-4 z-50">
          <button 
            onClick={() => window.close()} 
            className="bg-primary text-primary-foreground hover:bg-primary/90 p-2 rounded-md"
          >
            关闭全屏
          </button>
        </div>
      )}
    </div>
  );
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  mode = 'javascript',
  theme = 'tomorrow_night',
}) => {
  const { startRender } = usePerformance('CodeEditor');

  useEffect(() => {
    startRender();
    
    // 确保编辑器滚动条可见
    document.documentElement.style.setProperty('--scrollbarBG', 'rgba(100, 100, 100, 0.2)');
    document.documentElement.style.setProperty('--thumbBG', 'rgba(180, 180, 180, 0.5)');
  }, [startRender]);

  return (
    <div className="h-full relative rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-[#2d2d2d]">
        <AceEditor
          mode={mode}
          theme={theme}
          value={value}
          onChange={onChange}
          name="code-editor"
          editorProps={{ 
            $blockScrolling: false, // 关闭 blockScrolling 以确保滚动条正常显示
            showPrintMargin: false
          }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
            scrollPastEnd: true,
            useWorker: false, // 禁用 Web Worker 以避免 CSP 问题
            hScrollBarAlwaysVisible: true, // 确保水平滚动条总是可见
            vScrollBarAlwaysVisible: true  // 确保垂直滚动条总是可见
          }}
          readOnly={readOnly}
          width="100%"
          height="100%"
          style={{ 
            backgroundColor: '#2d2d2d',
            fontSize: 14 
          }}
          wrapEnabled={false}
          showPrintMargin={false}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
