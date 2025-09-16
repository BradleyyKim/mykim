import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostForm from "../forms/PostForm";

// API 모킹
jest.mock("../../lib/api", () => ({
  fetchCategories: jest.fn(() =>
    Promise.resolve([
      { id: 1, name: "기술", slug: "tech" },
      { id: 2, name: "일상", slug: "daily" }
    ])
  )
}));

// 테스트용 QueryClient 생성 함수
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0
      },
      mutations: {
        retry: false
      }
    }
  });

// 테스트용 Wrapper 컴포넌트
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

// 모킹된 useRouter
const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack
  })
}));

// RichTextEditor 모킹
jest.mock("../RichTextEditor", () => {
  return function MockRichTextEditor({
    content,
    onChange,
    onPlainTextChange,
    placeholder
  }: {
    content: string;
    onChange: (value: string) => void;
    onPlainTextChange: (text: string) => void;
    placeholder: string;
  }) {
    return (
      <textarea
        id="content"
        data-testid="rich-text-editor"
        value={content}
        onChange={e => {
          onChange(e.target.value);
          onPlainTextChange(e.target.value);
        }}
        placeholder={placeholder}
      />
    );
  };
});

describe("PostForm", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSubmit.mockResolvedValue(undefined);
  });

  const defaultProps = {
    onSubmit: mockOnSubmit,
    submitText: "작성하기",
    title: "새 글 작성"
  };

  describe("컴포넌트 렌더링", () => {
    it("폼의 기본 요소들이 렌더링된다", async () => {
      render(
        <TestWrapper>
          <PostForm {...defaultProps} />
        </TestWrapper>
      );

      // 제목 확인
      expect(screen.getByText("새 글 작성")).toBeInTheDocument();

      // 카테고리 로딩 후 확인
      await waitFor(() => {
        expect(screen.getByText("카테고리를 선택하세요")).toBeInTheDocument();
      });

      // 폼 필드들 확인
      expect(screen.getByLabelText(/제목/)).toBeInTheDocument();
      expect(screen.getByLabelText(/내용/)).toBeInTheDocument();
      expect(screen.getByLabelText(/발행 날짜/)).toBeInTheDocument();
      expect(screen.getByLabelText(/태그/)).toBeInTheDocument();
      expect(screen.getByLabelText(/URL 슬러그/)).toBeInTheDocument();

      // 버튼들 확인
      expect(screen.getByRole("button", { name: /취소/ })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /작성하기/ })).toBeInTheDocument();
    });

    it("초기 데이터로 폼이 채워진다", async () => {
      const initialData = {
        title: "테스트 제목",
        content: "테스트 내용",
        category: "tech",
        description: "테스트 설명",
        slug: "test-slug"
      };

      render(
        <TestWrapper>
          <PostForm {...defaultProps} initialData={initialData} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue("테스트 제목")).toBeInTheDocument();
      });

      expect(screen.getByDisplayValue("테스트 내용")).toBeInTheDocument();
      expect(screen.getByDisplayValue("test-slug")).toBeInTheDocument();
    });
  });

  describe("태그 관리", () => {
    it("태그를 추가할 수 있다", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <PostForm {...defaultProps} />
        </TestWrapper>
      );

      // 카테고리 로딩 대기
      await waitFor(() => {
        expect(screen.getByLabelText(/태그/)).toBeInTheDocument();
      });

      const tagInput = screen.getByLabelText(/태그/);

      // 태그 입력 후 Enter
      await user.type(tagInput, "React");
      await user.keyboard("{Enter}");

      // 태그가 추가되었는지 확인
      expect(screen.getByText("React")).toBeInTheDocument();
    });
  });
});
