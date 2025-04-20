import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../utils/db';
import { useToast } from '@/components/ui/use-toast';
import { CodeSnippet } from '@/types';

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
  const [activeTag, setActiveTag] = useState<string>('全部');
  // 当过滤条件变化时，重置分页到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory, activeTag]);
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

const formatCode = (code: string): string => {
  if (!code) return '';
  
  // Remove extra spaces around dots
  let formatted = code.replace(/\s*\.\s*/g, '.');
  
  // Split lines and process indentation
  const lines = formatted.split(/\r?\n/);
  const indentedLines: string[] = [];
  let indentLevel = 0;

  const processLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    
    // Decrease indentation for closing brackets/parentheses
    if (/^[}\])]/.test(trimmed) || trimmed.startsWith(')')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Add indentation
    const indent = '  '.repeat(indentLevel);
    const indentedLine = indent + trimmed;
    
    // Increase indentation for opening brackets/parentheses
    if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
      indentLevel++;
    }
    
    return indentedLine;
  };

  // Process each line
  for (let line of lines) {
    const processedLine = processLine(line);
    if (processedLine) indentedLines.push(processedLine);
  }

  // Join lines and add semicolon if needed
  formatted = indentedLines.join('\n');
  if (!formatted.trim().endsWith(';')) {
    formatted += ';';
  }
  
  return formatted;
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
      const formatted = formatCode(newSnippet.code!);
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
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(s => s.title.toLowerCase().includes(lower));
    }
    if (activeCategory !== '全部' && activeCategory !== 'all') {
      filtered = filtered.filter(s => s.category === activeCategory);
    }
    if (activeTag !== '全部' && activeTag !== 'all') {
      filtered = filtered.filter(s => s.tags.includes(activeTag));
    }
    return filtered;
  }, [snippets, searchTerm, activeCategory, activeTag]);

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

  const allTags = useMemo(() => {
    const set = new Set<string>();
    snippets.forEach(s => s.tags.forEach(t => set.add(t)));
    return ['全部', ...Array.from(set)];
  }, [snippets]);

  return {
    snippets: currentPageSnippets,
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    activeTag,
    setActiveTag,
    currentPage,
    setCurrentPage,
    newSnippet,
    setNewSnippet,
    snippetToDelete,
    setSnippetToDelete,
    totalPages,
    allCategories,
    allTags,
    isLoading,
    error,
    handleAddSnippet: saveSnippet,
    handleDeleteSnippet: deleteSnippet,
    copySnippet,
    formatCode
  } as const;
}
