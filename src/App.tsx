import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import CodeEditor, { CodeViewer } from "@/components/CodeEditor"
import { Copy, Trash2 } from 'lucide-react'
import { db } from './utils/db'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const [filteredSnippets, setFilteredSnippets] = useState<CodeSnippet[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const snippetsPerPage = 5 // 每页显示的代码片段数量
  const [activeCategory, setActiveCategory] = useState<string>('全部')
  const [activeTag, setActiveTag] = useState<string>('全部')
  const [newSnippet, setNewSnippet] = useState<Partial<CodeSnippet>>({
    title: '',
    code: '',
    language: 'javascript',
    tags: [],
    category: 'general'
  })
  const [snippetToDelete, setSnippetToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadSnippets()
  }, [])

  // 添加搜索和筛选逻辑
  useEffect(() => {
    // 先根据搜索词筛选
    let filtered = snippets;
    
    if (searchTerm.trim()) {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(snippet => 
        snippet.title.toLowerCase().includes(lowercaseSearchTerm)
      );
    }
    
    // 再根据分类筛选
    if (activeCategory !== '全部') {
      filtered = filtered.filter(snippet => 
        snippet.category === activeCategory
      );
    }
    
    // 最后根据标签筛选
    if (activeTag !== '全部') {
      filtered = filtered.filter(snippet => 
        snippet.tags.includes(activeTag)
      );
    }
    
    setFilteredSnippets(filtered);
    setCurrentPage(1); // 重置为第一页
  }, [snippets, searchTerm, activeCategory, activeTag])

  const loadSnippets = async () => {
    try {
      const loadedSnippets = await db.getAllSnippets()
      setSnippets(loadedSnippets)
    } catch (error) {
      console.error('Failed to load snippets:', error)
      toast({
        title: "错误",
        description: "加载代码片段失败",
        variant: "destructive"
      })
    }
  }

  const formatCode = (code: string) => {
    try {
      console.log('Original code:', code); // 调试用
      
      // 1. 处理点号操作符
      let formatted = code.replace(/\s*\.\s*/g, '.');
      
      // 2. 处理缩进
      const lines = formatted.split(/\r?\n/);
      
      // 3. 识别块级结构并应用缩进
      const indentedLines = [];
      let indentLevel = 0;
      
      for (let line of lines) {
        // 移除每行开头的空白
        const trimmedLine = line.trim();
        
        // 跳过空行
        if (trimmedLine === '') {
          indentedLines.push('');
          continue;
        }
        
        // 检查是否应该减少缩进（如果这行包含关闭括号）
        if (trimmedLine.match(/^[}\])]/) || trimmedLine.startsWith(')')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        // 应用当前缩进级别
        const indent = '  '.repeat(indentLevel);
        indentedLines.push(indent + trimmedLine);
        
        // 检查是否应该增加缩进（如果这行包含开放括号）
        if (trimmedLine.endsWith('{') || trimmedLine.endsWith('[') || trimmedLine.endsWith('(')) {
          indentLevel++;
        }
      }
      
      // 4. 合并行
      formatted = indentedLines.join('\n');
      
      // 5. 确保代码以分号结尾
      if (!formatted.trim().endsWith(';')) {
        formatted = formatted + ';';
      }
      
      console.log('Formatted code:', formatted); // 调试用
      return formatted;
    } catch (e) {
      console.error('Formatting error:', e);
      return code;
    }
  }

  const saveSnippet = async () => {
    if (!newSnippet.title || !newSnippet.code || !newSnippet.language) {
      toast({
        title: "错误",
        description: "标题、代码和语言均为必填项",
        variant: "destructive"
      });
      return;
    }

    // 格式化代码
    const formattedCode = formatCode(newSnippet.code)
    console.log('Saving formatted code:', formattedCode); // 调试用

    const snippet: CodeSnippet = {
      id: Date.now().toString(),
      title: newSnippet.title!,
      code: formattedCode,
      language: newSnippet.language!,
      tags: newSnippet.tags!,
      category: newSnippet.category!
    }

    try {
      await db.saveSnippet(snippet)
      await loadSnippets()
      
      setNewSnippet({
        title: '',
        code: '',
        language: 'javascript',
        tags: [],
        category: 'general'
      })

      toast({
        title: "成功",
        description: "代码片段已成功保存"
      })
    } catch (error) {
      console.error('Failed to save snippet:', error)
      toast({
        title: "错误",
        description: "保存代码片段失败",
        variant: "destructive"
      })
    }
  }

  const deleteSnippet = async (id: string) => {
    try {
      await db.deleteSnippet(id)
      await loadSnippets()
      setSnippetToDelete(null)
      
      toast({
        title: "成功",
        description: "代码片段已成功删除"
      })
    } catch (error) {
      console.error('Failed to delete snippet:', error)
      toast({
        title: "错误",
        description: "删除代码片段失败",
        variant: "destructive"
      })
    }
  }

  const handleDeleteClick = (id: string) => {
    setSnippetToDelete(id)
  }

  const copySnippet = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "成功",
      description: "代码已复制到剪贴板"
    })
  }

  // 计算当前页显示的代码片段
  const getCurrentPageSnippets = () => {
    const indexOfLastSnippet = currentPage * snippetsPerPage;
    const indexOfFirstSnippet = indexOfLastSnippet - snippetsPerPage;
    return filteredSnippets.slice(indexOfFirstSnippet, indexOfLastSnippet);
  };

  // 页面切换处理函数
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // 计算总页数
  const totalPages = Math.ceil(filteredSnippets.length / snippetsPerPage);

  // 获取所有唯一的分类和标签
  const getAllCategories = () => {
    const categories = new Set<string>();
    snippets.forEach(snippet => {
      categories.add(snippet.category);
    });
    return ['全部', ...Array.from(categories)];
  };

  const getAllTags = () => {
    const tags = new Set<string>();
    snippets.forEach(snippet => {
      snippet.tags.forEach(tag => {
        tags.add(tag);
      });
    });
    return ['全部', ...Array.from(tags)];
  };

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
            <div className="mb-4">
              <Label htmlFor="search" className="sr-only">搜索代码片段</Label>
              <div className="relative">
                <Input
                  id="search"
                  placeholder="按名称搜索代码片段..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* 分类和标签筛选 */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex-1 min-w-[250px]">
                <Label htmlFor="category-filter" className="text-sm mb-1 block">分类筛选</Label>
                <Select
                  value={activeCategory}
                  onValueChange={setActiveCategory}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAllCategories().map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1 min-w-[250px]">
                <Label htmlFor="tag-filter" className="text-sm mb-1 block">标签筛选</Label>
                <Select
                  value={activeTag}
                  onValueChange={setActiveTag}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择标签" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAllTags().map(tag => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* 统计信息 */}
            <div className="text-sm text-muted-foreground mb-4">
              共 {snippets.length} 个代码片段，当前筛选出 {filteredSnippets.length} 个
            </div>
            
            <div className="grid gap-6">
              {getCurrentPageSnippets().map((snippet) => (
                <Card key={snippet.id} className="overflow-hidden flex flex-col" style={{ height: "500px" }}>
                  <CardHeader className="relative pb-2">
                    <CardTitle className="text-lg">{snippet.title}</CardTitle>
                    <CardDescription className="text-sm">
                      语言: {snippet.language} | 分类: {snippet.category}
                      {snippet.tags.length > 0 && ` | 标签: ${snippet.tags.join(', ')}`}
                    </CardDescription>
                    <div className="absolute top-2 right-4 flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copySnippet(snippet.code)}
                        className="h-8 w-8"
                        title="复制代码"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(snippet.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        title="删除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 pb-6 flex-grow flex flex-col" style={{ minHeight: "300px" }}>
                    <div className="relative flex-grow h-full" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <CodeViewer value={formatCode(snippet.code)} />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* 分页导航 */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    上一页
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => paginate(i + 1)}
                        className="w-8 h-8 p-0"
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    下一页
                  </Button>
                </div>
              )}
              
              {filteredSnippets.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  未找到匹配的代码片段
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="new">
            <Card>
              <CardHeader>
                <CardTitle>创建新代码片段</CardTitle>
                <CardDescription>
                  添加一个新的代码片段到您的收藏中
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    标题 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={newSnippet.title}
                    onChange={(e) => setNewSnippet({...newSnippet, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="code">
                    代码 <span className="text-red-500">*</span>
                  </Label>
                  <div className="h-64 border rounded-md overflow-hidden">
                    <CodeEditor
                      value={newSnippet.code || ''}
                      onChange={(value) => setNewSnippet({...newSnippet, code: value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">
                    语言 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="language"
                    value={newSnippet.language}
                    onChange={(e) => setNewSnippet({...newSnippet, language: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">分类</Label>
                  <Input
                    id="category"
                    value={newSnippet.category}
                    onChange={(e) => setNewSnippet({...newSnippet, category: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">标签 (逗号分隔)</Label>
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
                <Button onClick={saveSnippet}>保存片段</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}