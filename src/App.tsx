import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useSnippets } from "@/hooks/useSnippets"
import SnippetList from "@/components/SnippetList"
import NewSnippetForm from "@/components/NewSnippetForm"

export default function App() {
  const {
    currentPageSnippets,
    searchTerm, setSearchTerm,
    activeCategory, setActiveCategory,
    activeTag, setActiveTag,
    currentPage, setCurrentPage,
    newSnippet, setNewSnippet,
    snippetToDelete, setSnippetToDelete,
    saveSnippet,
    copySnippet,
    deleteSnippet,
    formatCode,
    totalPages,
    allCategories,
    allTags
  } = useSnippets()

  return (
    <div className="min-h-screen bg-background p-4">
      <Toaster />
      <AlertDialog open={snippetToDelete !== null} onOpenChange={(open) => !open && setSnippetToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除这个代码片段吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center gap-4 sm:justify-center">
            <div className="flex gap-4 justify-center">
              <AlertDialogCancel className="mt-0 w-20">取消</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => snippetToDelete && deleteSnippet(snippetToDelete)}
                className="mt-0 w-20"
              >
                删除
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="snippets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="snippets">我的代码片段</TabsTrigger>
            <TabsTrigger value="new">新建片段</TabsTrigger>
          </TabsList>
          <TabsContent value="snippets">
            <SnippetList
              currentPageSnippets={currentPageSnippets}
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
            />
          </TabsContent>
          <TabsContent value="new">
            <NewSnippetForm
              newSnippet={newSnippet}
              setNewSnippet={setNewSnippet}
              saveSnippet={saveSnippet}
              allTags={allTags}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}