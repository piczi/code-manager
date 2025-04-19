import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../utils/db';
import { useToast } from '@/components/ui/use-toast';

export interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  category: string;
}

export function useSnippets() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [activeTag, setActiveTag] = useState<string>('全部');
  // 当过滤条件变化时，重置分页到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory, activeTag]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const snippetsPerPage = 5;
  const [newSnippet, setNewSnippet] = useState<Partial<CodeSnippet>>({
    title: '',
    code: '',
    language: 'javascript',
    tags: [],
    category: 'general'
  });
  const [snippetToDelete, setSnippetToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const loadSnippets = useCallback(async () => {
    try {
      const loaded = await db.getAllSnippets();
      setSnippets(loaded);
    } catch (error) {
      toast({ title: '错误', description: '加载代码片段失败', variant: 'destructive' });
    }
  }, [toast]);

  useEffect(() => {
    loadSnippets();
  }, [loadSnippets]);

  const formatCode = useCallback((code: string): string => {
    let formatted = code.replace(/\s*\.\s*/g, '.');
    const lines = formatted.split(/\r?\n/);
    const indentedLines: string[] = [];
    let indentLevel = 0;
    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        indentedLines.push('');
        continue;
      }
      if (/^[}\])]/.test(trimmed) || trimmed.startsWith(')')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      const indent = '  '.repeat(indentLevel);
      indentedLines.push(indent + trimmed);
      if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
        indentLevel++;
      }
    }
    formatted = indentedLines.join('\n');
    if (!formatted.trim().endsWith(';')) {
      formatted += ';';
    }
    return formatted;
  }, []);

  const saveSnippet = useCallback(async () => {
    if (!newSnippet.title || !newSnippet.code || !newSnippet.language) {
      toast({ title: '错误', description: '标题、代码和语言均为必填项', variant: 'destructive' });
      return;
    }
    const formatted = formatCode(newSnippet.code!);
    const snippet: CodeSnippet = {
      id: Date.now().toString(),
      title: newSnippet.title!,
      code: formatted,
      language: newSnippet.language!,
      tags: newSnippet.tags || [],
      category: newSnippet.category!
    };
    try {
      await db.saveSnippet(snippet);
      await loadSnippets();
      setNewSnippet({ title: '', code: '', language: 'javascript', tags: [], category: 'general' });
      toast({ title: '成功', description: '代码片段已成功保存' });
    } catch (error) {
      toast({ title: '错误', description: '保存代码片段失败', variant: 'destructive' });
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

  const copySnippet = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: '成功', description: '代码已复制到剪贴板' });
  }, [toast]);

  const filteredSnippets = useMemo(() => {
    let filtered = snippets;
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(s => s.title.toLowerCase().includes(lower));
    }
    if (activeCategory !== '全部') {
      filtered = filtered.filter(s => s.category === activeCategory);
    }
    if (activeTag !== '全部') {
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
    // 原始和筛选后的片段
    filteredSnippets,
    currentPageSnippets,
    // 状态与操作
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
    saveSnippet,
    deleteSnippet,
    copySnippet,
    formatCode
  };
}
