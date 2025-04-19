import React, { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


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
  activeTag: string;
  setActiveTag: (tag: string) => void;
  allCategories: string[];
  allTags: string[];

}

const FilterControls: React.FC<FilterControlsProps> = React.memo(({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  activeTag,
  setActiveTag,
  allCategories,
  allTags,
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
                className="w-full pl-8 pr-2 h-7 rounded-sm border border-input bg-background text-xs"
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
            <select
              id="category-filter"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full text-xs h-7 rounded-sm border border-input bg-background px-3 py-0"
              aria-label="选择分类"
              title="选择分类"
            >
              <option value="">分类</option>
              {allCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* 标签筛选 */}
          <div className="flex-1 min-w-[150px]">
            <Label htmlFor="tag-filter" className="text-xs font-medium mb-1.5">
              标签
            </Label>
            <select
              id="tag-filter"
              value={activeTag}
              onChange={(e) => setActiveTag(e.target.value)}
              className="w-full text-xs h-7 rounded-sm border border-input bg-background px-3 py-0"
              aria-label="选择标签"
              title="选择标签"
            >
              <option value="">标签</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
});

export default FilterControls;
