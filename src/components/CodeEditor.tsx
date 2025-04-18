import React from 'react';
import Editor from '@monaco-editor/react';
import { loader } from '@monaco-editor/react';

// Configure Monaco Editor to use local files
loader.config({
  paths: {
    vs: '/node_modules/monaco-editor/min/vs'
  }
});

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  readOnly = false,
}) => {
  return (
    <div className="h-full">
      <Editor
        height="100%"
        defaultLanguage={language}
        value={value}
        onChange={(value) => onChange(value || '')}
        theme="vs-dark"
        options={{
          readOnly,
          lineNumbers: 'on',
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
};

export default CodeEditor; 