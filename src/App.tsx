import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import CodeEditor from "@/components/CodeEditor"
import { Copy, Trash2 } from 'lucide-react'
import * as beautify from 'js-beautify'

interface CodeSnippet {
  id: string
  title: string
  code: string
  language: string
  tags: string[]
  category: string
}

export default function App() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([])
  const [newSnippet, setNewSnippet] = useState<Partial<CodeSnippet>>({
    title: '',
    code: '',
    language: 'javascript',
    tags: [],
    category: 'general'
  })
  const { toast } = useToast()

  useEffect(() => {
    // Load snippets from chrome.storage
    chrome.storage.sync.get(['snippets'], (result) => {
      if (result.snippets) {
        setSnippets(result.snippets)
      }
    })
  }, [])

  const formatCode = (code: string) => {
    try {
      // 确保代码以分号结尾
      const codeWithSemicolon = code.trim().endsWith(';') ? code : code + ';';
      return beautify.js(codeWithSemicolon, {
        indent_size: 2,
        indent_char: ' ',
        max_preserve_newlines: 1,
        preserve_newlines: true,
        keep_array_indentation: false,
        break_chained_methods: false,
        indent_scripts: 'normal',
        brace_style: 'collapse',
        space_before_conditional: true,
        unescape_strings: false,
        jslint_happy: false,
        end_with_newline: true,
        wrap_line_length: 80,
        indent_inner_html: false,
        comma_first: false,
        e4x: false,
        indent_empty_lines: false
      })
    } catch (e) {
      console.error('Formatting error:', e);
      return code;
    }
  }

  const saveSnippet = () => {
    if (!newSnippet.title || !newSnippet.code) {
      toast({
        title: "Error",
        description: "Title and code are required",
        variant: "destructive"
      })
      return
    }

    // 格式化代码
    const formattedCode = formatCode(newSnippet.code)
    console.log('Formatted code:', formattedCode); // 调试用

    const snippet: CodeSnippet = {
      id: Date.now().toString(),
      title: newSnippet.title!,
      code: formattedCode,
      language: newSnippet.language!,
      tags: newSnippet.tags!,
      category: newSnippet.category!
    }

    const updatedSnippets = [...snippets, snippet]
    setSnippets(updatedSnippets)
    chrome.storage.sync.set({ snippets: updatedSnippets })
    
    setNewSnippet({
      title: '',
      code: '',
      language: 'javascript',
      tags: [],
      category: 'general'
    })

    toast({
      title: "Success",
      description: "Snippet saved successfully"
    })
  }

  const deleteSnippet = (id: string) => {
    const updatedSnippets = snippets.filter(s => s.id !== id)
    setSnippets(updatedSnippets)
    chrome.storage.sync.set({ snippets: updatedSnippets })
    
    toast({
      title: "Success",
      description: "Snippet deleted successfully"
    })
  }

  const copySnippet = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Success",
      description: "Code copied to clipboard"
    })
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="snippets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="snippets">My Snippets</TabsTrigger>
            <TabsTrigger value="new">New Snippet</TabsTrigger>
          </TabsList>
          <TabsContent value="snippets">
            <div className="grid gap-6">
              {snippets.map((snippet) => (
                <Card key={snippet.id} className="overflow-hidden">
                  <CardHeader className="relative pb-2">
                    <CardTitle className="text-lg">{snippet.title}</CardTitle>
                    <CardDescription className="text-sm">
                      Language: {snippet.language} | Category: {snippet.category}
                      {snippet.tags.length > 0 && ` | Tags: ${snippet.tags.join(', ')}`}
                    </CardDescription>
                    <div className="absolute top-2 right-4 flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copySnippet(snippet.code)}
                        className="h-8 w-8"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteSnippet(snippet.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 pb-6">
                    <div className="relative">
                      <CodeEditor
                        value={formatCode(snippet.code)}
                        onChange={() => {}}
                        readOnly={true}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="new">
            <Card>
              <CardHeader>
                <CardTitle>Create New Snippet</CardTitle>
                <CardDescription>
                  Add a new code snippet to your collection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newSnippet.title}
                    onChange={(e) => setNewSnippet({...newSnippet, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <div className="h-64 border rounded-md overflow-hidden">
                    <CodeEditor
                      value={newSnippet.code || ''}
                      onChange={(value) => setNewSnippet({...newSnippet, code: value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={newSnippet.language}
                    onChange={(e) => setNewSnippet({...newSnippet, language: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newSnippet.category}
                    onChange={(e) => setNewSnippet({...newSnippet, category: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={newSnippet.tags?.join(', ')}
                    onChange={(e) => setNewSnippet({
                      ...newSnippet,
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSnippet}>Save Snippet</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}