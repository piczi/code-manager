import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CodeSnippet } from "@/types";
import CodeEditor from "./CodeEditor";

interface NewSnippetFormProps {
  newSnippet: Partial<CodeSnippet>
  setNewSnippet: React.Dispatch<React.SetStateAction<Partial<CodeSnippet>>>
  saveSnippet: () => void
  allTags?: string[] // 标记为可选，因为我们现在不使用它
}

export default function NewSnippetForm({ newSnippet, setNewSnippet, saveSnippet }: NewSnippetFormProps) {
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
              placeholder="标题"
              value={newSnippet.title}
              onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value })}
              required
              className="h-8 w-full rounded-sm border border-input bg-background text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language" className="text-xs font-medium mb-1.5">语言 <span className="text-red-500">*</span></Label>
            <Select
              value={newSnippet.language || "none"}
              onValueChange={(value) => setNewSnippet({ ...newSnippet, language: value })}
              placeholder="选择编程语言"
            >
              <SelectTrigger id="language" className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">请选择语言</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="c">C</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="go">Go</SelectItem>
                <SelectItem value="ruby">Ruby</SelectItem>
                <SelectItem value="php">PHP</SelectItem>
                <SelectItem value="csharp">C#</SelectItem>
                <SelectItem value="swift">Swift</SelectItem>
                <SelectItem value="kotlin">Kotlin</SelectItem>
                <SelectItem value="rust">Rust</SelectItem>
                <SelectItem value="shell">Shell</SelectItem>
                <SelectItem value="sql">SQL</SelectItem>
                <SelectItem value="other">其它</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-xs font-medium mb-1.5">分类</Label>
            <Input
              id="category"
              value={newSnippet.category || ''}
              onChange={e => setNewSnippet({ ...newSnippet, category: e.target.value })}
              className="w-full h-8 rounded-sm border border-input bg-background text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-xs font-medium mb-1.5">标签</Label>
            <Input
              id="tags"
              value={newSnippet.tags?.join(', ') || ''}
              onChange={e => setNewSnippet({ ...newSnippet, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) })}
              className="w-full h-8 rounded-sm border border-input bg-background text-sm"
              placeholder="输入标签，多个标签用逗号分隔"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="code" className="text-xs font-medium mb-1.5">代码 <span className="text-red-500">*</span></Label>
          <div className="h-48 border rounded-md overflow-hidden">
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
