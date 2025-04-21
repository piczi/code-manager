import React, { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


// 防抖函数
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

interface FilterControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  activeLanguage: string;
  setActiveLanguage: (language: string) => void;
  allCategories: string[];
  allLanguages: string[];
}

const FilterControls: React.FC<FilterControlsProps> = React.memo(({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  activeLanguage,
  setActiveLanguage,
  allCategories,
  allLanguages,
}) => {
  // 本地输入状态，保证输入流畅
  const [localValue, setLocalValue] = React.useState(searchTerm);

  React.useEffect(() => {
    setLocalValue(searchTerm);
  }, [searchTerm]);

  // 防抖处理搜索，仅防抖搜索行为
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 300),
    [setSearchTerm]
  );

  // 确保 activeCategory 的值在组件渲染时正确映射
  const mappedActiveCategory = activeCategory === '全部' ? 'all' : activeCategory;
  const mappedActiveLanguage = activeLanguage === '全部' ? 'all' : activeLanguage;

  return (
    <>
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex flex-row gap-2">
          {/* 搜索栏 */}
          <div className="relative flex-1 min-w-[150px]">
            <Label htmlFor="search" className="text-xs font-medium mb-1.5">
              按名称搜索
            </Label>
            <div className="relative">
              <Input
                id="search"
                placeholder="输入代码片段名称..."
                value={localValue}
                onChange={e => {
                  setLocalValue(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                className="w-full pl-8 pr-2 h-8 rounded-sm border border-input bg-background text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* 分类筛选 */}
          <div className="flex-1 min-w-[150px]">
            <Label htmlFor="category-filter" className="text-xs font-medium mb-1.5">
              分类
            </Label>
            <Select
              value={mappedActiveCategory}
              onValueChange={(value) => setActiveCategory(value === 'all' ? '全部' : value)}
              placeholder="选择分类"
            >
              <SelectTrigger id="category-filter" className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                {allCategories
                  .filter(category => category !== '全部')
                  .map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* 语言筛选 */}
          <div className="flex-1 min-w-[150px]">
            <Label htmlFor="language-filter" className="text-xs font-medium mb-1.5">
              语言
            </Label>
            <Select
              value={mappedActiveLanguage}
              onValueChange={(value) => setActiveLanguage(value === 'all' ? '全部' : value)}
              placeholder="选择语言"
            >
              <SelectTrigger id="language-filter" className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部语言</SelectItem>
                {allLanguages
                  .filter(language => language !== '全部')
                  .map(language => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
});

export default FilterControls;
