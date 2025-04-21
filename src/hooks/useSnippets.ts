import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../utils/db';
import { useToast } from '@/components/ui/use-toast';
import { CodeSnippet } from '@/types';
import { format as sqlFormatter } from 'sql-formatter';
import { js as beautifyJs, html as beautifyHtml, css as beautifyCss } from 'js-beautify';

const DEFAULT_NEW_SNIPPET: Partial<CodeSnippet> = {
  title: '',
  code: '',
  language: 'javascript',
  tags: [],
  category: '常规'
};

const SNIPPETS_PER_PAGE = 5;

export function useSnippets() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [activeLanguage, setActiveLanguage] = useState<string>('全部');
  // 当过滤条件变化时，重置分页到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory, activeLanguage]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const snippetsPerPage = SNIPPETS_PER_PAGE;
  const [newSnippet, setNewSnippet] = useState<Partial<CodeSnippet>>({
    title: '',
    code: '',
    language: 'javascript',
    tags: [],
    category: '常规'
  });
  const [snippetToDelete, setSnippetToDelete] = useState<CodeSnippet | null>(null);
  const { toast } = useToast();

  const loadSnippets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const loaded = await db.getAllSnippets();
      if (!loaded) {
        throw new Error('Failed to load snippets');
      }
      
      const processedSnippets = loaded.map(snippet => {
        const now = Date.now();
        return {
          ...snippet,
          createdAt: (snippet as any).createdAt || now,
          updatedAt: (snippet as any).updatedAt || now
        };
      });
      
      setSnippets(processedSnippets);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载代码片段失败';
      setError(errorMessage);
      toast({ title: '错误', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadSnippets();
  }, [loadSnippets]);

const formatCode = async (code: string, language?: string): Promise<string> => {
  if (!code) return '';
  
  try {
    // 通用的格式化选项
    const jsOptions = {
      indent_size: 2,
      indent_char: ' ',
      max_preserve_newlines: 1,
      preserve_newlines: true,
      keep_array_indentation: false,
      break_chained_methods: false,
      indent_scripts: 'normal' as const,
      brace_style: 'collapse' as const,
      space_before_conditional: true,
      unescape_strings: false,
      jslint_happy: false,
      end_with_newline: false,
      indent_empty_lines: false,
    };

    const htmlOptions = {
      indent_size: 2,
      indent_char: ' ',
      max_preserve_newlines: 1,
      preserve_newlines: true,
      indent_inner_html: false,
      wrap_line_length: 0,
      indent_scripts: 'normal' as const,
      brace_style: 'collapse' as const,
      unformatted: ['code', 'pre', 'em', 'strong', 'span'],
      content_unformatted: [],
      extra_liners: ['head', 'body', '/html'],
      end_with_newline: false,
    };

    const cssOptions = {
      indent_size: 2,
      indent_char: ' ',
      max_preserve_newlines: 1,
      preserve_newlines: true,
      end_with_newline: false,
    };

    // SQL格式化选项
    const sqlOptions = {
      language: 'sql' as const,
      indent: '  ',
      uppercase: false,
      linesBetweenQueries: 2,
    };

    switch (language?.toLowerCase()) {
      case 'javascript':
      case 'js':
        return beautifyJs(code, jsOptions);
      case 'typescript':
      case 'ts':
        return beautifyJs(code, jsOptions);
      case 'jsx':
      case 'tsx':
        return beautifyJs(code, { ...jsOptions, e4x: true });
      case 'json':
        try {
          return JSON.stringify(JSON.parse(code), null, 2);
        } catch (err) {
          console.error('JSON 格式化失败:', err);
          return code;
        }
      case 'html':
      case 'xml':
      case 'svg':
        return beautifyHtml(code, htmlOptions);
      case 'css':
      case 'scss':
      case 'less':
        return beautifyCss(code, cssOptions);
      case 'sql':
        return sqlFormatter(code, sqlOptions);
      case 'markdown':
      case 'md':
        // Markdown 通常不需要特殊格式化
        return code;
      default:
        // 尝试使用 js 格式化，如果失败则返回原始代码
        try {
          return beautifyJs(code, jsOptions);
        } catch (e) {
          return code;
        }
    }
  } catch (error) {
    console.error('格式化代码失败:', error);
    // 出错时返回原始代码
    return code;
  }
};

  const saveSnippet = useCallback(async () => {
    if (!newSnippet.title || !newSnippet.code || !newSnippet.language) {
      toast({ 
        title: '错误', 
        description: '标题、代码和语言均为必填项', 
        variant: 'destructive' 
      });
      return;
    }

    try {
      // 在保存前格式化代码
      let formattedCode = newSnippet.code;
      try {
        console.log(`开始格式化代码，语言: ${newSnippet.language}`);
        formattedCode = await formatCode(newSnippet.code, newSnippet.language);
        console.log('代码格式化成功');
      } catch (formatError) {
        console.error('格式化代码失败:', formatError);
        // 格式化失败时使用原始代码，但不中断保存流程
        toast({ 
          title: '警告', 
          description: '代码格式化失败，将使用原始代码保存', 
          variant: 'default' 
        });
      }

      const now = Date.now();
      const snippet: CodeSnippet = {
        id: now.toString(),
        title: newSnippet.title!,
        code: formattedCode,
        language: newSnippet.language!,
        tags: newSnippet.tags || [],
        category: newSnippet.category!,
        createdAt: now,
        updatedAt: now
      };

      console.log('准备保存的代码片段:', {
        id: snippet.id,
        title: snippet.title,
        language: snippet.language,
        codeLength: snippet.code.length,
        tags: snippet.tags,
        category: snippet.category
      });

      await db.saveSnippet(snippet);
      await loadSnippets();
      setNewSnippet(DEFAULT_NEW_SNIPPET);
      toast({ title: '成功', description: '代码片段已成功保存' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '保存代码片段失败';
      console.error('保存代码片段失败:', error);
      setError(errorMessage);
      toast({ 
        title: '错误', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    }
  }, [newSnippet, formatCode, loadSnippets, toast]);

  const deleteSnippet = useCallback(async (id: string) => {
    try {
      await db.deleteSnippet(id);
      await loadSnippets();
      setSnippetToDelete(null);
      toast({ title: '成功', description: '代码片段已成功删除' });
    } catch (error) {
      toast({ title: '错误', description: '删除代码片段失败', variant: 'destructive' });
    }
  }, [loadSnippets, toast]);

  const copySnippet = useCallback((snippet: CodeSnippet) => {
    navigator.clipboard.writeText(snippet.code);
    toast({ title: '成功', description: '代码已复制到剪贴板' });
  }, [toast]);

  const filteredSnippets = useMemo(() => {
    let filtered = snippets;
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (activeCategory !== '全部' && activeCategory !== 'all') {
      filtered = filtered.filter(s => s.category === activeCategory);
    }
    if (activeLanguage !== '全部' && activeLanguage !== 'all') {
      filtered = filtered.filter(s => s.language === activeLanguage);
    }
    // 按更新时间倒序排列（新的在前）
    return filtered.sort((a, b) => {
      const timeA = a.updatedAt || a.createdAt || 0;
      const timeB = b.updatedAt || b.createdAt || 0;
      return timeB - timeA;
    });
  }, [snippets, searchTerm, activeCategory, activeLanguage]);

  const currentPageSnippets = useMemo(() => {
    const start = (currentPage - 1) * snippetsPerPage;
    return filteredSnippets.slice(start, start + snippetsPerPage);
  }, [filteredSnippets, currentPage]);

  const totalPages = Math.ceil(filteredSnippets.length / snippetsPerPage);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    snippets.forEach(s => set.add(s.category));
    return ['全部', ...Array.from(set)];
  }, [snippets]);

  const allLanguages = useMemo(() => {
    const set = new Set<string>();
    snippets.forEach(s => set.add(s.language));
    return ['全部', ...Array.from(set)];
  }, [snippets]);

  return {
    snippets: currentPageSnippets,
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    activeLanguage,
    setActiveLanguage,
    allLanguages,
    currentPage,
    setCurrentPage,
    totalPages,
    allCategories,
    copySnippet,
    setSnippetToDelete,
    formatCode,
    newSnippet,
    setNewSnippet,
    handleAddSnippet: saveSnippet,
    handleDeleteSnippet: deleteSnippet,
    snippetToDelete,
    isLoading,
    error
  } as const;
}
