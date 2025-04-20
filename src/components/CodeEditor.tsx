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
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ 
  value, 
  mode = 'javascript',
  theme = 'tomorrow_night'
}) => {
  const { startRender } = usePerformance('CodeViewer');

  useEffect(() => {
    startRender();
  }, [startRender]);

  return (
    <div className="relative rounded-lg overflow-hidden" style={{ minHeight: '200px' }}>
      <div className="absolute inset-0">
        <AceEditor
          mode={mode}
          theme={theme}
          value={value}
          name="code-viewer"
          editorProps={{ 
            $blockScrolling: true
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
            fontSize: 14,
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
            indentedSoftWrap: false
          }}
          width="100%"
          height="100%"
          style={{
            backgroundColor: '#2d2d2d',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }}
        />
      </div>
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
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
            scrollPastEnd: true,
            useWorker: false, // 禁用 Web Worker 以避免 CSP 问题
          }}
          readOnly={readOnly}
          width="100%"
          height="100%"
          style={{ backgroundColor: '#2d2d2d' }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;