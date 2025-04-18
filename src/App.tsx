import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import CodeEditor from './components/CodeEditor'

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
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')

  useEffect(() => {
    // Load snippets from chrome.storage
    chrome.storage.sync.get(['snippets'], (result) => {
      if (result.snippets) {
        setSnippets(result.snippets)
      }
    })
  }, [])

  const saveSnippet = () => {
    if (!newSnippet.title || !newSnippet.code) {
      toast({
        title: "Error",
        description: "Title and code are required",
        variant: "destructive"
      })
      return
    }

    const snippet: CodeSnippet = {
      id: Date.now().toString(),
      title: newSnippet.title!,
      code: newSnippet.code!,
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

  const handleFormat = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(code), null, 2)
      setCode(formatted)
    } catch (error) {
      console.error('Invalid JSON')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFormat}
                className="text-gray-600 hover:text-gray-900"
              >
                Format
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCode('')}
                className="text-gray-600 hover:text-gray-900"
              >
                Clear
              </Button>
            </div>
          </div>
          <div className="h-[600px] border rounded-md overflow-hidden">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
            />
          </div>
        </div>
      </div>
      <div className="w-[800px] h-[600px] p-4">
        <Tabs defaultValue="snippets">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="snippets">My Snippets</TabsTrigger>
            <TabsTrigger value="new">New Snippet</TabsTrigger>
          </TabsList>
          
          <TabsContent value="snippets">
            <div className="grid gap-4">
              {snippets.map((snippet) => (
                <Card key={snippet.id}>
                  <CardHeader>
                    <CardTitle>{snippet.title}</CardTitle>
                    <CardDescription>
                      Language: {snippet.language} | Category: {snippet.category}
                      {snippet.tags.length > 0 && ` | Tags: ${snippet.tags.join(', ')}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-2 rounded-md">
                      <code>{snippet.code}</code>
                    </pre>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => copySnippet(snippet.code)}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => deleteSnippet(snippet.id)}
                    >
                      Delete
                    </Button>
                  </CardFooter>
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
                  <textarea
                    id="code"
                    className="w-full h-32 p-2 border rounded-md"
                    value={newSnippet.code}
                    onChange={(e) => setNewSnippet({...newSnippet, code: e.target.value})}
                    placeholder="Enter your code here"
                    aria-label="Code snippet"
                  />
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
      <Toaster />
    </div>
  )
} 