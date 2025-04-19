import React from 'react';
import AceEditor from 'react-ace';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/ext-language_tools';

// 配置 Ace Editor 的基础路径
ace.config.set('basePath', '/ace/');

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

interface CodeViewerProps {
  value: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ value }) => {
  return (
    <div className="relative rounded-lg overflow-hidden" style={{ minHeight: '200px' }}>
      <div className="absolute inset-0">
        <AceEditor
          mode="javascript"
          theme="tomorrow_night"
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
            // 移除 minLines 和 maxLines 设置，让编辑器自然适应容器高度
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
}) => {
  return (
    <div className="h-full relative rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-[#2d2d2d]">
        <AceEditor
          mode="javascript"
          theme="tomorrow_night"
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