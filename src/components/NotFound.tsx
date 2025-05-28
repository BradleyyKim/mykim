import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NotFoundProps {
  title?: string;
  message?: string;
  linkText?: string;
  linkHref?: string;
}

export default function NotFound({
  title = "페이지를 찾을 수 없습니다",
  message = "요청하신 페이지가 존재하지 않거나 삭제되었습니다.",
  linkText = "메인 페이지로 돌아가기",
  linkHref = "/"
}: NotFoundProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl text-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="mb-8">{message}</p>
      <Link href={linkHref} passHref>
        <Button>{linkText}</Button>
      </Link>
    </div>
  );
}

// 재사용 가능한 404 컴포넌트들
export function PostNotFound() {
  return <NotFound title="포스트를 찾을 수 없습니다" message="요청하신 포스트가 존재하지 않거나 삭제되었습니다." linkText="메인 페이지로 돌아가기" />;
}

export function CategoryNotFound() {
  return <NotFound title="카테고리를 찾을 수 없습니다" message="요청하신 카테고리가 존재하지 않거나 삭제되었습니다." linkText="모든 게시물 보기" />;
}
