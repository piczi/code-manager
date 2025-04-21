import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../utils/db';
import { useToast } from '@/components/ui/use-toast';
import { CodeSnippet } from '@/types';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import parserTypescript from 'prettier/parser-typescript';
import parserHtml from 'prettier/parser-html';
import parserMarkdown from 'prettier/parser-markdown';
import parserPostcss from 'prettier/parser-postcss';
import { format as sqlFormatter } from 'sql-formatter';

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
    switch (language) {
      case 'javascript':
        return await prettier.format(code, { parser: 'babel', plugins: [parserBabel] });
      case 'typescript':
        return await prettier.format(code, { parser: 'typescript', plugins: [parserTypescript] });
      case 'json':
        return await prettier.format(code, { parser: 'json', plugins: [parserBabel] });
      case 'html':
        return await prettier.format(code, { parser: 'html', plugins: [parserHtml] });
      case 'markdown':
        return await prettier.format(code, { parser: 'markdown', plugins: [parserMarkdown] });
      case 'css':
        return await prettier.format(code, { parser: 'css', plugins: [parserPostcss] });
      case 'sql':
        return await sqlFormatter(code);
      default:
        return code;
    }
  } catch {
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
      const formatted = await formatCode(newSnippet.code!);
      const now = Date.now();
      const snippet: CodeSnippet = {
        id: now.toString(),
        title: newSnippet.title!,
        code: formatted,
        language: newSnippet.language!,
        tags: newSnippet.tags || [],
        category: newSnippet.category!,
        createdAt: now,
        updatedAt: now
      };

      await db.saveSnippet(snippet);
      await loadSnippets();
      setNewSnippet(DEFAULT_NEW_SNIPPET);
      toast({ title: '成功', description: '代码片段已成功保存' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '保存代码片段失败';
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
