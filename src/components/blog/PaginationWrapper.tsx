"use client";

import { useRouter } from "next/navigation";
import Pagination from "./Pagination";

interface PaginationWrapperProps {
  currentPage: number;
  totalPages: number;
  categorySlug?: string;
}

export default function PaginationWrapper({ currentPage, totalPages, categorySlug }: PaginationWrapperProps) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    if (categorySlug) {
      const url = page === 1 ? `/?category=${categorySlug}` : `/?page=${page}&category=${categorySlug}`;
      router.push(url);
    } else {
      const url = page === 1 ? "/" : `?page=${page}`;
      router.push(url);
    }
  };

  return <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />;
}
