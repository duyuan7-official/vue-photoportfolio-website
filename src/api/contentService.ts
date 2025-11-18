// src/api/contentService.ts
import apiClient from './apiClient';

// --- 适配 Strapi 的数据结构 ---
// (如果将来更换后端, 只需修改这个文件中的实现)

/**
 * 获取文章列表 (用于 ArticleView.vue)
 * @param searchTerm 搜索关键词
 */
export const getArticles = (searchTerm: string = '') => {
  const params: any = {
    'populate[cover_image]': true,
    'sort': 'publishedAt:desc',
    'populate[author][populate]': 'headshot',
  };
  if (searchTerm.trim() !== '') {
    params['filters[title][$containsi]'] = searchTerm;
  }
  return apiClient.get('/api/articles', { params });
};

/**
 * 按 slug 获取单篇文章 (用于 ArticleDetailView.vue)
 * @param slug 文章的 slug
 */
export const getArticleBySlug = (slug: string) => {
  return apiClient.get('/api/articles', {
    params: {
      'filters[slug][$eq]': slug,
      'populate': ['cover_image', 'comments'],
      'populate[author][populate]': 'headshot',
    },
  });
};

/**
 * 提交评论 (用于 ArticleDetailView.vue)
 * @param articleId 关联的文章 ID
 * @param author 评论者昵称
 * @param content 评论内容
 */
export const postComment = (articleId: number, author: string, content: string) => {
  return apiClient.post('/api/comments', {
    data: {
      author_name: author,
      content: content,
      article: articleId,
    },
  });
};

/**
 * 按分类获取照片 (用于 PortraitsView.vue, LandscapeView.vue)
 * @param category 'portrait' 或 'landscape'
 */
export const getPhotosByCategory = (category: 'portrait' | 'landscape') => {
  return apiClient.get('/api/photos', {
    params: {
      'populate': 'image',
      'filters[category][$eq]': category,
    },
  });
};

/**
 * 获取所有旅程 (用于 JourneyView.vue)
 */
export const getJourneys = () => {
  return apiClient.get('/api/journeys', {
    params: {
      'populate': 'cover_image',
      'sort': 'date:desc',
    },
  });
};

/**
 * 按 slug 获取单个旅程的详情 (用于 JourneyGallery.vue)
 * @param slug 旅程的 slug
 */
export const getJourneyBySlug = (slug: string) => {
  return apiClient.get('/api/journeys', {
    params: {
      'filters[slug][$eq]': slug,
      'populate[photos][populate]': 'image',
    },
  });
};

/**
 * (可选) 获取最近的文章 (用于 ArticleDetailView.vue)
 * @param currentSlug 要排除的当前文章 slug
 * @param limit 获取的数量
 */
export const getRecentArticles = (currentSlug: string, limit: number = 3) => {
    return apiClient.get('/api/articles', {
        params: {
            'populate': 'cover_image',
            'filters[slug][$ne]': currentSlug,
            'pagination[limit]': limit,
            'sort': 'publishedAt:desc'
        }
    });
};