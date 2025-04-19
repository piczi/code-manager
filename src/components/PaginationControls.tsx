import React from 'react';
import { Button } from '@/components/ui/button';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages, setCurrentPage }) => {
  if (totalPages <= 1) return null;
  return (
    <nav className="flex justify-center mt-4 gap-2" aria-label="分页导航">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >上一页</Button>
      {Array.from({ length: totalPages }, (_, i) => (
        <Button
          key={i + 1}
          variant={currentPage === i + 1 ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCurrentPage(i + 1)}
          className="w-8 h-8 p-0"
        >{i + 1}</Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >下一页</Button>
    </nav>
  );
};

export default PaginationControls;
