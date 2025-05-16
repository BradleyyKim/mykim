"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // 페이지네이션 범위 계산
  const renderPageButtons = () => {
    const pageNumbers = [];
    const maxButtonsToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

    // 표시 버튼 수가 maxButtonsToShow보다 작으면 시작 페이지 조정
    if (endPage - startPage + 1 < maxButtonsToShow) {
      startPage = Math.max(1, endPage - maxButtonsToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button key={i} variant={i === currentPage ? "default" : "outline"} size="sm" onClick={() => onPageChange(i)} className="w-9 h-9">
          {i}
        </Button>
      );
    }

    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="w-9 h-9 p-0">
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {renderPageButtons()}

      <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="w-9 h-9 p-0">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
