import React, { useMemo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FileText, Download, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import type { CodeSnippet } from '@/types';

// 防抖函数
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

interface FilterControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  activeTag: string;
  setActiveTag: (tag: string) => void;
  allCategories: string[];
  allTags: string[];
  snippets: CodeSnippet[];
  importSnippets: (snippets: CodeSnippet[]) => void;
}

const FilterControls: React.FC<FilterControlsProps> = React.memo(({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  activeTag,
  setActiveTag,
  allCategories,
  allTags,
  snippets,
  importSnippets
}) => {
  const { toast } = useToast();

  // 防抖处理搜索
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 300),
    [setSearchTerm]
  );

  // 缓存分类选项
  const categoryOptions = useMemo(() => 
    allCategories.map(category => (
      <SelectItem key={category} value={category}>{category}</SelectItem>
    )),
    [allCategories]
  );

  // 缓存标签选项
  const tagOptions = useMemo(() => 
    allTags.map(tag => (
      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
    )),
    [allTags]
  );

  // 导出代码片段
  const handleExport = useCallback(() => {
    try {
      const data = JSON.stringify(snippets, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'code-snippets.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "导出成功",
        description: "代码片段已导出为 JSON 文件",
      });
    } catch (error) {
      toast({
        title: "导出失败",
        description: "导出过程中发生错误",
        variant: "destructive",
      });
    }
  }, [snippets, toast]);

  // 导入代码片段
  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        const importedSnippets = JSON.parse(data);
        importSnippets(importedSnippets);
        toast({
          title: "导入成功",
          description: `成功导入 ${importedSnippets.length} 个代码片段`,
        });
      } catch (error) {
        toast({
          title: "导入失败",
          description: "导入的文件格式不正确",
          variant: "destructive",
        });
      }
    };
    reader.onerror = () => {
      toast({
        title: "导入失败",
        description: "读取文件时发生错误",
        variant: "destructive",
      });
    };
    reader.readAsText(file);
  }, [importSnippets, toast]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            导出
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => document.getElementById('import-file')?.click()}
          >
            <Upload className="h-4 w-4" />
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              id="import-file"
              aria-label="导入代码片段文件"
            />
            导入
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">支持 JSON 格式导入导出</span>
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="search" className="sr-only">搜索代码片段</Label>
        <div className="relative">
          <Input
            id="search"
            placeholder="按名称搜索代码片段..."
            value={searchTerm}
            onChange={e => debouncedSearch(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex-1 min-w-[250px]">
          <Label htmlFor="category-filter" className="text-sm mb-1 block">分类筛选</Label>
          <Select
            value={activeCategory}
            onValueChange={setActiveCategory}
          >
            <SelectTrigger className="w-full rounded-lg shadow-sm border-primary" id="category-filter">
              <SelectValue placeholder="请选择分类" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto min-w-[180px] rounded-lg shadow-md border border-primary" position="popper">
              {categoryOptions}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-[250px]">
          <Label htmlFor="tag-filter" className="text-sm mb-1 block">标签筛选</Label>
          <Select
            value={activeTag}
            onValueChange={setActiveTag}
          >
            <SelectTrigger className="w-full rounded-lg shadow-sm border-primary" id="tag-filter">
              <SelectValue placeholder="请选择标签" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto min-w-[180px] rounded-lg shadow-md border border-primary" position="popper">
              {tagOptions}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
});

export default FilterControls;
