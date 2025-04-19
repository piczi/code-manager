declare module 'js-beautify' {
  interface JsBeautifyOptions {
    indent_size?: number;
    indent_char?: string;
    max_preserve_newlines?: number;
    preserve_newlines?: boolean;
    keep_array_indentation?: boolean;
    break_chained_methods?: boolean;
    indent_scripts?: 'normal' | 'keep' | 'separate';
    brace_style?: 'collapse' | 'expand' | 'end-expand' | 'none';
    space_before_conditional?: boolean;
    unescape_strings?: boolean;
    jslint_happy?: boolean;
    end_with_newline?: boolean;
    wrap_line_length?: number;
    indent_inner_html?: boolean;
    comma_first?: boolean;
    e4x?: boolean;
    indent_empty_lines?: boolean;
  }

  export function js(code: string, options?: JsBeautifyOptions): string;
  export function html(code: string, options?: JsBeautifyOptions): string;
  export function css(code: string, options?: JsBeautifyOptions): string;
} 