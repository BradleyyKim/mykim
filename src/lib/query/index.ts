/**
 * Query Domain exports
 * TanStack Query 관련 모든 기능을 통합하여 export
 */
export {
  TanstackProvider,
  queryClient,
  useAdminAuth,
  useLoginMutation,
  useCreatePost,
  usePosts,
  useUpdatePost,
  useDeletePost,
  useUpdatePostBySlug,
  useDeletePostBySlug
} from "./tanstack-query";
