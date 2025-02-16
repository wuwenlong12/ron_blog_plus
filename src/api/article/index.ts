import http from "..";
import { tag } from "../tag/type";
import {
  ResponseGetAllArticleInfo,
  ResponseGetArticleContent,
  ResponseGetArticleSummary,
  ResponseGetSearchArticle,
  ResponseUpdateArticleContent,
} from "./type";

enum API {
  ARTICLE_CONTENT = "/article/content",
  ARTICLE = "/article",
  ARTICLE_SUMMARY = "/article/summary",
  ARTICLE_TAGS = "/article/tags",
  SEARCH_TITLE = "/article/search/title",
  SEARCH_TAG = "/article/search/tag",
}

//根据目录id获取w文章内容
export const getArticleContentById = (id: string) =>
  http.get<any, ResponseGetArticleContent>(API.ARTICLE_CONTENT, {
    params: {
      id,
    },
  });

export const updateArticleContentById = (params: {
  id: string;
  content?: unknown;
  tags?: tag[];
}) => http.post<any, ResponseUpdateArticleContent>(API.ARTICLE_CONTENT, params);

// 更新文章标签
export const updateArticleTagsById = (params: { id: string; tags: tag[] }) =>
  http.post<any, ResponseUpdateArticleContent>(API.ARTICLE_TAGS, params);

export const getAllArticleInfo = () =>
  http.get<any, ResponseGetAllArticleInfo>(API.ARTICLE);

export const getArticleSummary = (
  pageNumber: number = 1,
  limitNumber: number = 10
) =>
  http.get<any, ResponseGetArticleSummary>(API.ARTICLE_SUMMARY, {
    params: {
      pageNumber,
      limitNumber,
    },
  });

export const searchArticleByTitle = (keyword: string) =>
  http.get<any, ResponseGetSearchArticle>(API.SEARCH_TITLE, {
    params: {
      keyword,
    },
  });

export const searchArticleByTag = (tagId: string) =>
  http.get<any, ResponseGetSearchArticle>(API.SEARCH_TAG, {
    params: {
      tagId,
    },
  });
