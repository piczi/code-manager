import React, { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useSnippets } from "@/hooks/useSnippets"

const SnippetList = React.lazy(() => import("@/components/SnippetList"));
const NewSnippetForm = React.lazy(() => import("@/components/NewSnippetForm"));

export default function App() {
  const {
    snippets,
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    activeTag,
    setActiveTag,
    currentPage,
    setCurrentPage,
    totalPages,
    allCategories,
    allTags,
    copySnippet,
    setSnippetToDelete,
    formatCode,
    newSnippet,
    setNewSnippet,
    handleAddSnippet,
    handleDeleteSnippet,
    handleImportSnippets,
    snippetToDelete
  } = useSnippets()

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">代码片段列表</TabsTrigger>
          <TabsTrigger value="new">新建代码片段</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Suspense fallback={<div>加载中...</div>}>
            <SnippetList
              snippets={snippets}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              activeTag={activeTag}
              setActiveTag={setActiveTag}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              allCategories={allCategories}
              allTags={allTags}
              copySnippet={copySnippet}
              setSnippetToDelete={setSnippetToDelete}
              formatCode={formatCode}
              importSnippets={handleImportSnippets}
            />
          </Suspense>
        </TabsContent>
        <TabsContent value="new">
          <Suspense fallback={<div>加载中...</div>}>
            <NewSnippetForm
              newSnippet={newSnippet}
              setNewSnippet={setNewSnippet}
              saveSnippet={handleAddSnippet}
              allTags={allTags}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
      <AlertDialog open={snippetToDelete !== null} onOpenChange={(open) => !open && setSnippetToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除这个代码片段吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="mt-0 w-20">取消</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => snippetToDelete && handleDeleteSnippet(snippetToDelete.id)}
              className="mt-0 w-20"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}