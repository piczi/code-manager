import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import CodeEditor from "@/components/CodeEditor"
import { Button } from "@/components/ui/button"
import { CodeSnippet } from "@/types"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface NewSnippetFormProps {
  newSnippet: Partial<CodeSnippet>
  setNewSnippet: React.Dispatch<React.SetStateAction<Partial<CodeSnippet>>>
  saveSnippet: () => void
  allTags: string[]
}

export default function NewSnippetForm({ newSnippet, setNewSnippet, saveSnippet, allTags }: NewSnippetFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>创建新代码片段</CardTitle>
        <CardDescription>添加一个新的代码片段到您的收藏中</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">标题 <span className="text-red-500">*</span></Label>
          <Input
            id="title"
            value={newSnippet.title || ''}
            onChange={e => setNewSnippet({ ...newSnippet, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">代码 <span className="text-red-500">*</span></Label>
          <div className="h-64 border rounded-md overflow-hidden">
            <CodeEditor
              value={newSnippet.code || ''}
              onChange={value => setNewSnippet({ ...newSnippet, code: value })}
            />
          </div>
        </div>
        <div className="space-y-2">
  <Label htmlFor="language">语言 <span className="text-red-500">*</span></Label>
  <div className="w-full">
    <Select
      value={newSnippet.language || ''}
      onValueChange={(value: string) => setNewSnippet({ ...newSnippet, language: value })}
      required
    >
      <SelectTrigger className="w-full" id="language">
        <SelectValue placeholder="请选择语言" />
      </SelectTrigger>
      <SelectContent className="max-h-60 overflow-y-auto" position="popper">
        <SelectItem value="javascript">JavaScript</SelectItem>
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
        <div className="space-y-2">
          <Label htmlFor="category">分类</Label>
          <Input
            id="category"
            value={newSnippet.category || ''}
            onChange={e => setNewSnippet({ ...newSnippet, category: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">标签 (逗号分隔)</Label>
          <Input
            id="tags"
            list="tags-list"
            value={newSnippet.tags?.join(', ') || ''}
            onChange={e => setNewSnippet({ ...newSnippet, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) })}
          />
          <datalist id="tags-list">
            {allTags.map(tag => <option key={tag} value={tag} />)}
          </datalist>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={saveSnippet}>保存片段</Button>
      </CardFooter>
    </Card>
  )
}
