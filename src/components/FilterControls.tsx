import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

const FilterControls: React.FC<FilterControlsProps> = ({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  activeTag,
  setActiveTag,
  allCategories,
  allTags
}) => (
  <>
    <div className="mb-4">
      <Label htmlFor="search" className="sr-only">搜索代码片段</Label>
      <div className="relative">
        <Input
          id="search"
          placeholder="按名称搜索代码片段..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="flex-1 min-w-[250px]">
        <Label htmlFor="category-filter" className="text-sm mb-1 block">分类筛选</Label>
        <select
          id="category-filter"
          aria-label="分类筛选"
          title="分类筛选"
          value={activeCategory}
          onChange={e => setActiveCategory(e.target.value)}
          className="w-full border border-input bg-background px-3 py-2 rounded-md text-sm"
        >
          {allCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[250px]">
        <Label htmlFor="tag-filter" className="text-sm mb-1 block">标签筛选</Label>
        <select
          id="tag-filter"
          aria-label="标签筛选"
          title="标签筛选"
          value={activeTag}
          onChange={e => setActiveTag(e.target.value)}
          className="w-full border border-input bg-background px-3 py-2 rounded-md text-sm"
        >
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>
    </div>
  </>
);

export default FilterControls;
