/**
 * post controller
 */


import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
  async create(ctx) {
    try {
      // 요청 정보 로깅
      console.log('=== Post Creation Request ===');
      console.log('Headers:', ctx.headers);
      console.log('Body:', ctx.request.body);
      console.log('User:', ctx.state.user);
      
      // 기존 create 로직 실행
      const result = await super.create(ctx);
      
      // 성공 로깅
      console.log('=== Post Creation Success ===');
      console.log('Created post:', result);
      return result;
    } catch (error) {
      // 에러 로깅
      console.error('=== Post Creation Error ===');
      console.error('Error details:', error);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  },
}));