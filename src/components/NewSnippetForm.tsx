import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CodeSnippet } from "@/types";
import CodeEditor from "./CodeEditor";

interface NewSnippetFormProps {
  newSnippet: Partial<CodeSnippet>
  setNewSnippet: React.Dispatch<React.SetStateAction<Partial<CodeSnippet>>>
  saveSnippet: () => void
  allTags: string[]
}

export default function NewSnippetForm({ newSnippet, setNewSnippet, saveSnippet, allTags }: NewSnippetFormProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <CardTitle>创建新代码片段</CardTitle>
          <CardDescription>添加一个新的代码片段到您的收藏中</CardDescription>
        </div>
        <Button onClick={saveSnippet} className="h-9">保存片段</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-medium mb-1.5">标题 <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              value={newSnippet.title || ''}
              onChange={e => setNewSnippet({ ...newSnippet, title: e.target.value })}
              required
              className="w-full h-7 rounded-sm border border-input bg-background text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language" className="text-xs font-medium mb-1.5">语言 <span className="text-red-500">*</span></Label>
            <div className="w-full">
              <select
                id="language"
                value={newSnippet.language || ''}
                onChange={(e) => setNewSnippet({ ...newSnippet, language: e.target.value })}
                className="w-full h-7 rounded-sm border border-input bg-background text-xs px-3 py-0"
                required
                aria-label="选择编程语言"
                title="选择编程语言"
              >
                <option value="">请选择语言</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="go">Go</option>
                <option value="ruby">Ruby</option>
                <option value="php">PHP</option>
                <option value="csharp">C#</option>
                <option value="swift">Swift</option>
                <option value="kotlin">Kotlin</option>
                <option value="rust">Rust</option>
                <option value="shell">Shell</option>
                <option value="sql">SQL</option>
                <option value="other">其它</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-xs font-medium mb-1.5">分类</Label>
            <Input
              id="category"
              value={newSnippet.category || ''}
              onChange={e => setNewSnippet({ ...newSnippet, category: e.target.value })}
              className="w-full h-7 rounded-sm border border-input bg-background text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-xs font-medium mb-1.5">标签 (逗号分隔)</Label>
            <Input
              id="tags"
              list="tags-list"
              value={newSnippet.tags?.join(', ') || ''}
              onChange={e => setNewSnippet({ ...newSnippet, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) })}
              className="w-full h-7 rounded-sm border border-input bg-background text-xs"
            />
            <datalist id="tags-list">
              {allTags.map(tag => <option key={tag} value={tag} />)}
            </datalist>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="code" className="text-xs font-medium mb-1.5">代码 <span className="text-red-500">*</span></Label>
          <div className="h-64 border rounded-md overflow-hidden">
            <CodeEditor
              value={newSnippet.code || ''}
              onChange={(value: string) => setNewSnippet({ ...newSnippet, code: value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
