import React, { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useSnippets } from "@/hooks/useSnippets"

const SnippetList = React.lazy(() => import("@/components/SnippetList"));
const NewSnippetForm = React.lazy(() => import("@/components/NewSnippetForm"));

export default function App() {
  const [activeTab, setActiveTab] = React.useState("list");
  
  const {
    snippets,
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
    handleAddSnippet,
    handleDeleteSnippet,
    snippetToDelete
  } = useSnippets()
  
  // 自定义保存函数
  const handleSaveSnippet = async () => {
    await handleAddSnippet();
  };

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
              activeLanguage={activeLanguage}
              setActiveLanguage={setActiveLanguage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              allCategories={allCategories}
              allLanguages={allLanguages}
              copySnippet={copySnippet}
              setSnippetToDelete={setSnippetToDelete}
              formatCode={formatCode}
            />
          </Suspense>
        </TabsContent>
        <TabsContent value="new">
          <Suspense fallback={<div>加载中...</div>}>
            <NewSnippetForm
              newSnippet={newSnippet}
              setNewSnippet={setNewSnippet}
              saveSnippet={handleSaveSnippet}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
      <AlertDialog open={snippetToDelete !== null} onOpenChange={(open) => !open && setSnippetToDelete(null)}>
        <AlertDialogContent className="rounded-xl shadow-lg border-0 p-6">
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除这个代码片段吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-row justify-end items-center gap-2">
            <AlertDialogCancel className="w-20 h-10 px-0 rounded-md mt-0">取消</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => snippetToDelete && handleDeleteSnippet(snippetToDelete.id)}
              className="w-20 h-10 px-0 rounded-md"
            >
              删除
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}