import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Copy, Trash2, Check } from 'lucide-react'
import { CodeViewer } from "@/components/CodeEditor"
import type { CodeSnippet } from '@/types'
import FilterControls from './FilterControls'
import PaginationControls from './PaginationControls'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

interface SnippetListProps {
  snippets: CodeSnippet[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  activeTag: string;
  setActiveTag: (tag: string) => void;
  allCategories: string[];
  allTags: string[];
  copySnippet: (snippet: CodeSnippet) => void;
  setSnippetToDelete: React.Dispatch<React.SetStateAction<CodeSnippet | null>>;
  formatCode: (code: string, language: string) => string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}

export default function SnippetList({
  snippets,
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  activeTag,
  setActiveTag,
  allCategories,
  allTags,
  copySnippet,
  setSnippetToDelete,
  formatCode,
  currentPage,
  setCurrentPage,
  totalPages
}: SnippetListProps) {
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const currentPageSnippets = snippets.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  return (
    <>
      <FilterControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        activeTag={activeTag}
        setActiveTag={setActiveTag}
        allCategories={allCategories}
        allTags={allTags}
      />

      {/* 统计信息 */}
      <div className="text-sm text-muted-foreground mb-4">
        共 {currentPageSnippets.length} 个代码片段，当前筛选出 {currentPageSnippets.length} 个
      </div>

      <div className="grid gap-6">
        {currentPageSnippets.map((snippet) => (
          <Card key={snippet.id} className="mb-4">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{snippet.title}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      copySnippet(snippet)
                      setCopiedSnippetId(snippet.id)
                      setTimeout(() => setCopiedSnippetId(null), 1000)
                    }}
                  >
                    {copiedSnippetId === snippet.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSnippetToDelete(snippet)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                {snippet.category} - {snippet.tags.join(', ')}
              </CardDescription>
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

      {currentPageSnippets.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">未找到匹配的代码片段</div>
      )}
    </>
  )
}
