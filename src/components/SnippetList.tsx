import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Copy, Trash2, Check, Maximize } from 'lucide-react'
import { CodeViewer } from "@/components/CodeEditor"
import type { CodeSnippet } from '@/types'
import FilterControls from './FilterControls'
import PaginationControls from './PaginationControls'
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

interface SnippetListProps {
  snippets: CodeSnippet[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  allCategories: string[];
  copySnippet: (snippet: CodeSnippet) => void;
  setSnippetToDelete: React.Dispatch<React.SetStateAction<CodeSnippet | null>>;
  formatCode: (code: string, language: string) => Promise<string>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  activeLanguage: string;
  setActiveLanguage: (language: string) => void;
  allLanguages: string[];
}

export default function SnippetList({
  snippets,
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  allCategories,
  copySnippet,
  setSnippetToDelete,
  formatCode,
  currentPage,
  setCurrentPage,
  totalPages,
  activeLanguage,
  setActiveLanguage,
  allLanguages
}: SnippetListProps) {
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  
  // 删除这里的重复分页逻辑，直接使用传入的已分页数据
  // const currentPageSnippets = snippets.slice(
  //   (currentPage - 1) * 10,
  //   currentPage * 10
  // );

  // 打开全屏代码查看器
  const openFullscreen = async (snippet: CodeSnippet) => {
    try {
      const formattedCode = await formatCode(snippet.code, snippet.language);
      
      // 使用localStorage存储代码数据，而不是URL参数
      const codeKey = `fullscreen_code_${Date.now()}`;
      const codeData = {
        code: formattedCode,
        language: snippet.language,
        title: snippet.title
      };
      
      // 存储到localStorage
      localStorage.setItem(codeKey, JSON.stringify(codeData));
      
      // 构建URL时只传递存储键，而不是完整代码
      const baseUrl = window.location.origin + window.location.pathname;
      const fullUrl = `${baseUrl}#/fullscreen?key=${codeKey}`;
      window.open(fullUrl, '_blank');
    } catch (error) {
      console.error('处理代码数据时出错:', error);
      alert('无法打开全屏视图，代码数据太大或格式不正确。');
    }
  };

  return (
    <>
      <FilterControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        allCategories={allCategories}
        activeLanguage={activeLanguage}
        setActiveLanguage={setActiveLanguage}
        allLanguages={allLanguages}
      />

      {/* 统计信息 */}
      <div className="text-sm text-muted-foreground mb-4">
        共 {snippets.length} 个代码片段，当前筛选出 {snippets.length} 个
      </div>

      <div className="grid gap-6">
        {snippets.map((snippet) => (
          <Card key={snippet.id} className="mb-4">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{snippet.title}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openFullscreen(snippet)}
                    title="全屏查看"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      copySnippet(snippet)
                      setCopiedSnippetId(snippet.id)
                      setTimeout(() => setCopiedSnippetId(null), 1000)
                    }}
                    title="复制代码"
                  >
                    {copiedSnippetId === snippet.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSnippetToDelete(snippet)}
                    title="删除代码"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {snippet.category && (
                  <Badge variant="outline" className="w-fit">
                    {snippet.category}
                  </Badge>
                )}
                {snippet.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-secondary/50">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <CodeViewer value={formatCode(snippet.code, snippet.language)} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {snippets.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">未找到匹配的代码片段</div>
      )}
    </>
  )
}
