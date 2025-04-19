import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  readOnly = false,
}) => {
  return (
    <div className="h-full relative">
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={code => {
          const highlighted = highlight(code, languages.javascript, 'javascript');
          const lines = highlighted.split('\n');
          return lines.map((line, i) => `<span class="line-number">${i + 1}</span>${line}`).join('\n');
        }}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
          backgroundColor: '#2d2d2d',
          color: '#ccc',
          minHeight: '100%',
        }}
        readOnly={readOnly}
        className="code-editor"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const textarea = e.target as HTMLTextAreaElement;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const value = textarea.value;
            const newValue = value.substring(0, start) + '\n' + value.substring(end);
            onChange(newValue);
            // 设置光标位置
            setTimeout(() => {
              textarea.selectionStart = start + 1;
              textarea.selectionEnd = start + 1;
            }, 0);
          }
        }}
      />
      <style>
        {`
          .code-editor {
            position: relative;
            counter-reset: line;
            margin: 1rem 0;
          }
          .code-editor textarea {
            outline: none;
            padding: 0 !important;
            margin: 0 !important;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            resize: none;
            color: transparent;
            background: transparent;
            caret-color: #fff;
            border: none;
            font-family: inherit;
            font-size: inherit;
            line-height: 1.5;
            tab-size: 2;
            padding-left: 3.5em !important;
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
          }
          .code-editor pre {
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
            position: relative;
            z-index: 1;
            padding-left: 3.5em !important;
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
          }
          .code-editor pre code {
            display: block;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
            line-height: 1.5;
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
          }
          .code-editor pre .line-number {
            position: absolute;
            left: 0;
            color: #858585;
            text-align: right;
            width: 3em;
            user-select: none;
            padding-right: 0.5em;
          }
          /* Prism.js 语法高亮样式覆盖 */
          .token.comment,
          .token.prolog,
          .token.doctype,
          .token.cdata {
            color: #999;
          }
          .token.punctuation {
            color: #ccc;
          }
          .token.property,
          .token.tag,
          .token.boolean,
          .token.number,
          .token.constant,
          .token.symbol,
          .token.deleted {
            color: #f08d49;
          }
          .token.selector,
          .token.attr-name,
          .token.string,
          .token.char,
          .token.builtin,
          .token.inserted {
            color: #7ec699;
          }
          .token.operator,
          .token.entity,
          .token.url,
          .language-css .token.string,
          .style .token.string {
            color: #67cdcc;
          }
          .token.atrule,
          .token.attr-value,
          .token.keyword {
            color: #cc99cd;
          }
          .token.function,
          .token.class-name {
            color: #f08d49;
          }
          .token.regex,
          .token.important,
          .token.variable {
            color: #f08d49;
          }
        `}
      </style>
    </div>
  );
};

export default CodeEditor; 