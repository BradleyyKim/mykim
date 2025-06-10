"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, X, AlertCircle } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import { Category, fetchCategories } from "@/lib/api";
import { useForm, Controller, Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateSlugFromText, suggestSlugFromTitle } from "@/lib/slug-utils";

// Zod schema for form validation
const postSchema = z.object({
  title: z.string().min(1, "제목은 필수 항목입니다."),
  content: z.string().min(1, "내용은 필수 항목입니다."),
  category: z.string().min(1, "카테고리는 필수 항목입니다."),
  description: z.string().optional(),
  publishedDate: z.string().optional(),
  slug: z.string().min(1, "URL 슬러그는 필수 항목입니다.")
});

type PostFormData = z.infer<typeof postSchema>;

// 공통 에러 메시지 컴포넌트
interface FormErrorMessageProps {
  error?: string;
  showError: boolean;
}

function FormErrorMessage({ error, showError }: FormErrorMessageProps) {
  if (!showError || !error) return null;
  return <p className="text-xs text-red-500 mt-1">{error}</p>;
}

// 알림 컴포넌트
interface NotificationAreaProps {
  error: string | null;
  isLoadingCategories: boolean;
  hasCategoriesError: boolean;
}

function NotificationArea({ error, isLoadingCategories, hasCategoriesError }: NotificationAreaProps) {
  if (error) {
    return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>;
  }

  if (!isLoadingCategories && hasCategoriesError) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6 flex items-start">
        <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">카테고리를 가져올 수 없습니다</p>
          <p className="text-sm mt-1">
            카테고리가 없어 새 글을 작성할 수 없습니다. 나중에 다시 시도하거나 관리자에게 문의하세요.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

// 카테고리 선택 컴포넌트
interface CategorySelectProps {
  control: Control<PostFormData>;
  categories: Category[];
  isLoadingCategories: boolean;
  errors: FieldErrors<PostFormData>;
  disabled: boolean;
}

function CategorySelect({ control, categories, isLoadingCategories, errors, disabled }: CategorySelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="category" className="flex items-center">
        카테고리
        <span className="text-red-500 ml-1">*</span>
      </Label>
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange} disabled={disabled || isLoadingCategories}>
            <SelectTrigger className={`w-full ${errors.category ? "border-red-500" : ""}`}>
              <SelectValue placeholder={isLoadingCategories ? "카테고리 로딩 중..." : "카테고리를 선택하세요"} />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <FormErrorMessage error={errors.category?.message} showError={!!errors.category} />
    </div>
  );
}

// 제목 입력 컴포넌트
interface TitleInputProps {
  register: UseFormRegister<PostFormData>;
  errors: FieldErrors<PostFormData>;
  disabled: boolean;
}

function TitleInput({ register, errors, disabled }: TitleInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="title" className="flex items-center">
        제목
        <span className="text-red-500 ml-1">*</span>
      </Label>
      <Input
        id="title"
        {...register("title")}
        placeholder="제목을 입력하세요"
        className={`text-lg ${errors.title ? "border-red-500" : ""}`}
        disabled={disabled}
      />
      <FormErrorMessage error={errors.title?.message} showError={!!errors.title} />
    </div>
  );
}

// 내용 에디터 컴포넌트
interface ContentEditorProps {
  control: Control<PostFormData>;
  errors: FieldErrors<PostFormData>;
  disabled: boolean;
  onPlainTextChange: (text: string) => void;
}

function ContentEditor({ control, errors, disabled, onPlainTextChange }: ContentEditorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="content" className="flex items-center">
        내용
        <span className="text-red-500 ml-1">*</span>
      </Label>
      <div className={`${errors.content ? "border border-red-500 rounded-md" : ""} relative`}>
        <Controller
          name="content"
          control={control}
          render={({ field }: { field: { value: string; onChange: (value: string) => void } }) => (
            <RichTextEditor
              content={field.value}
              onChange={field.onChange}
              onPlainTextChange={onPlainTextChange}
              placeholder="내용을 입력하세요..."
              maxLength={20000}
            />
          )}
        />
        {disabled && (
          <div className="absolute inset-0 bg-gray-100  dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 flex items-center justify-center cursor-not-allowed">
            <p className="text-gray-500 font-medium">카테고리가 필요합니다</p>
          </div>
        )}
      </div>
      <FormErrorMessage error={errors.content?.message} showError={!!errors.content} />
    </div>
  );
}

// 발행 날짜 선택 컴포넌트
interface PublishedDateInputProps {
  control: Control<PostFormData>;
  errors: FieldErrors<PostFormData>;
  disabled: boolean;
}

function PublishedDateInput({ control, errors, disabled }: PublishedDateInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="publishedDate">발행 날짜</Label>
      <Controller
        name="publishedDate"
        control={control}
        render={({ field }) => (
          <Input
            id="publishedDate"
            type="datetime-local"
            value={field.value || ""}
            onChange={e => field.onChange(e.target.value)}
            className={errors.publishedDate ? "border-red-500" : ""}
            disabled={disabled}
          />
        )}
      />
      <p className="text-xs text-gray-500">글이 발행될 날짜와 시간을 설정하세요.</p>
      <FormErrorMessage error={errors.publishedDate?.message} showError={!!errors.publishedDate} />
    </div>
  );
}

// 태그 입력 컴포넌트
interface TagsInputProps {
  tags: string[];
  tagInput: string;
  setTagInput: (value: string) => void;
  onAddTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveTag: (tag: string) => void;
  disabled: boolean;
}

function TagsInput({ tags, tagInput, setTagInput, onAddTag, onRemoveTag, disabled }: TagsInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="tags">태그</Label>
      <Input
        id="tags"
        value={tagInput}
        onChange={e => setTagInput(e.target.value)}
        onKeyDown={onAddTag}
        placeholder="태그를 입력하고 Enter를 누르세요"
        disabled={disabled}
      />
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="ml-1 text-blue-600 hover:text-blue-800"
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// 버튼 그룹 컴포넌트
interface SubmitButtonGroupProps {
  isSubmitting: boolean;
  disabled: boolean;
  onCancel: () => void;
  submitText: string;
}

function SubmitButtonGroup({ isSubmitting, disabled, onCancel, submitText }: SubmitButtonGroupProps) {
  return (
    <div className="flex justify-end gap-4 pt-4">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
        취소
      </Button>
      <Button type="submit" disabled={isSubmitting || disabled} className="min-w-[100px]">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            처리 중...
          </>
        ) : disabled ? (
          "카테고리 필요"
        ) : (
          submitText
        )}
      </Button>
    </div>
  );
}

// 유틸리티 함수들
const extractFirstImageFromHtml = (html: string) => {
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const imgMatch = html.match(imgRegex);
  return imgMatch?.[1] || null;
};

const stripHtml = (html: string) => {
  return html.replace(/<\/?[^>]+(>|$)/g, "");
};

const createDescription = (content: string, existingDescription?: string) => {
  const plainText = stripHtml(content);
  return existingDescription || plainText.substring(0, 160);
};

// Slug 입력 컴포넌트
interface SlugInputProps {
  control: Control<PostFormData>;
  errors: FieldErrors<PostFormData>;
  disabled: boolean;
  onSlugChange: (slug: string) => void;
  generatedSlug: string;
}

function SlugInput({ control, errors, disabled, onSlugChange, generatedSlug }: SlugInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="slug" className="flex items-center">
        URL 슬러그
        <span className="text-red-500 ml-1">*</span>
      </Label>
      <Controller
        name="slug"
        control={control}
        render={({ field }) => (
          <Input
            id="slug"
            value={field.value || ""}
            onChange={e => {
              const rawValue = e.target.value;
              const processedSlug = generateSlugFromText(rawValue);
              field.onChange(rawValue);
              onSlugChange(processedSlug);
            }}
            placeholder="예: my-awesome-post"
            className={errors.slug ? "border-red-500" : ""}
            disabled={disabled}
          />
        )}
      />
      <FormErrorMessage error={errors.slug?.message} showError={!!errors.slug} />

      {/* Slug 미리보기 */}
      {generatedSlug && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          <span className="font-medium">URL 미리보기: </span>
          <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">/posts/{generatedSlug}</span>
        </div>
      )}
    </div>
  );
}

// 날짜 유틸리티 함수들
const formatDateTimeLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getCurrentDateTime = (): string => {
  return formatDateTimeLocal(new Date());
};

const parsePublishedDate = (publishedDate?: string): string => {
  if (!publishedDate) return getCurrentDateTime();

  try {
    // ISO 날짜 문자열을 Date 객체로 변환
    const date = new Date(publishedDate);
    if (isNaN(date.getTime())) {
      return getCurrentDateTime();
    }
    return formatDateTimeLocal(date);
  } catch {
    return getCurrentDateTime();
  }
};

// 메인 PostForm 컴포넌트
interface PostFormProps {
  initialData?: {
    title?: string;
    content?: string;
    description?: string;
    category?: string;
    publishedDate?: string;
    slug?: string;
  };
  onSubmit: (
    data: PostFormData & {
      slug?: string;
      featuredImage?: { url: string; alternativeText?: string } | null;
    }
  ) => Promise<void>;
  submitText: string;
  title: string;
}

export default function PostForm({ initialData, onSubmit, submitText, title }: PostFormProps) {
  const router = useRouter();
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [generatedSlug, setGeneratedSlug] = useState<string>("");

  // 통합된 상태 변수 계산
  const isFormDisabled = categories.length === 0;
  const hasCategoriesError = categories.length === 0 && !isLoadingCategories;

  // React Hook Form 설정
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      publishedDate: parsePublishedDate(initialData?.publishedDate),
      slug: initialData?.slug || ""
    }
  });

  // 제목과 slug 변경 감지
  const titleValue = watch("title");
  const slugValue = watch("slug");

  // 제목이 변경되고 slug가 비어있으면 자동 제안
  useEffect(() => {
    if (titleValue && titleValue.length > 0 && (!slugValue || slugValue.length === 0)) {
      const suggestedSlug = suggestSlugFromTitle(titleValue);
      setGeneratedSlug(suggestedSlug);
    } else if (slugValue && slugValue.length > 0) {
      // 사용자가 직접 입력한 slug가 있으면 그것을 사용
      const processedSlug = generateSlugFromText(slugValue);
      setGeneratedSlug(processedSlug);
    } else {
      setGeneratedSlug("");
    }
  }, [titleValue, slugValue]);

  // 카테고리 데이터 로드
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const categoryData = await fetchCategories();

        if (categoryData.length > 0) {
          setCategories(categoryData);
        } else {
          console.warn("카테고리 데이터가 비어있습니다");
          setCategories([]);
        }
      } catch (error) {
        console.error("카테고리 로드 중 오류 발생:", error);
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Plain text 변경 처리 (자동 description 생성)
  const handlePlainTextChange = (plainText: string) => {
    setValue("description", plainText);
  };

  const handleFormSubmit = async (data: PostFormData) => {
    if (isFormDisabled) {
      setError("카테고리를 가져올 수 없어 작성할 수 없습니다. 나중에 다시 시도해주세요.");
      return;
    }

    // 내용에서 첫 번째 이미지를 찾아서 featuredImage로 설정
    const imageUrl = extractFirstImageFromHtml(data.content);

    let featuredImage = null;
    if (imageUrl) {
      featuredImage = {
        url: imageUrl,
        alternativeText: data.title
      };
    }

    // description 생성
    const description = createDescription(data.content, data.description);

    // slug 처리: 사용자가 입력하지 않았으면 제목에서 생성
    const finalSlug =
      data.slug && data.slug.trim().length > 0 ? generateSlugFromText(data.slug) : suggestSlugFromTitle(data.title);

    setIsSubmitting(true);
    setError(null);

    try {
      // 선택된 카테고리 ID 찾기
      const selectedCategory = categories.find(cat => cat.slug === data.category);

      if (!selectedCategory) {
        setError("유효한 카테고리를 선택해주세요.");
        setIsSubmitting(false);
        return;
      }

      // 부모 컴포넌트의 onSubmit 호출
      await onSubmit({
        ...data,
        description,
        category: selectedCategory.id.toString(),
        slug: finalSlug,
        featuredImage
      });

      // 성공 시 메인 페이지로 이동
      router.push("/");
    } catch (error) {
      console.error("Error submitting post:", error);
      setError(error instanceof Error ? error.message : "처리 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>
      <NotificationArea
        error={error}
        isLoadingCategories={isLoadingCategories}
        hasCategoriesError={hasCategoriesError}
      />
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <CategorySelect
          control={control}
          categories={categories}
          isLoadingCategories={isLoadingCategories}
          errors={errors}
          disabled={isFormDisabled}
        />
        <TitleInput register={register} errors={errors} disabled={isFormDisabled} />
        <ContentEditor
          control={control}
          errors={errors}
          disabled={isFormDisabled}
          onPlainTextChange={handlePlainTextChange}
        />
        <PublishedDateInput control={control} errors={errors} disabled={isFormDisabled} />
        <TagsInput
          tags={tags}
          tagInput={tagInput}
          setTagInput={setTagInput}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          disabled={isFormDisabled}
        />
        <SlugInput
          control={control}
          errors={errors}
          disabled={isFormDisabled}
          onSlugChange={setGeneratedSlug}
          generatedSlug={generatedSlug}
        />
        <SubmitButtonGroup
          isSubmitting={isSubmitting}
          disabled={isFormDisabled}
          onCancel={() => router.back()}
          submitText={submitText}
        />
      </form>
    </div>
  );
}
