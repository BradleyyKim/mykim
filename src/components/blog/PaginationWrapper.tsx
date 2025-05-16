"use client";

import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";

interface PaginationWrapperProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationWrapper({ currentPage, totalPages }: PaginationWrapperProps) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    const url = page === 1 ? "/" : `?page=${page}`;
    router.push(url);
  };

  return <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />;
}
