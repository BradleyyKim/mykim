"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("검색어:", searchQuery);

    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl mx-auto mb-6">
      <Input type="text" placeholder="검색어를 입력하세요..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="rounded-r-none" />
      <Button type="submit" className="rounded-l-none">
        검색
      </Button>
    </form>
  );
}
