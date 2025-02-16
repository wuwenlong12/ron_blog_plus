import { PartialBlock } from "@blocknote/core";
import { ResponseBase } from "../type";
import { tag } from "../tag/type";

export interface ResponseGetArticleContent extends ResponseBase {
  data: ArticleContent;
}
export type ArticleContent = {
  _id: string;
  title: string;
  tags: tag[];
  content: PartialBlock[];
  parentFolder: string;
  createdAt: Date;
  updatedAt: Date;
};
export interface ResponseUpdateArticleContent extends ResponseBase {
  data: ArticleContent;
}

export interface ResponseGetAllArticleInfo extends ResponseBase {
  data: ArticleInfos;
}

interface ArticleInfo {
  _id: string;
  title: string;
  updatedAt: string; // 使用 ISO 日期字符串
}

type ArticleInfos = Record<string, ArticleInfo[]>;

export interface ResponseGetArticleSummary extends ResponseBase {
  data: ArticleSummaryData;
}
type ArticleSummaryData = {
  articles: Articles[];
  pagination: Pagination;
};
export type Articles = {
  _id: string;
  title: string;
  tags: tag[];
  summary: PartialBlock[];
  createdAt: Date;
  updatedAt: Date;
};
type Pagination = {
  currentPage: number;
  pageSize: number;
  total: number;
};

export interface ResponseGetSearchArticle extends ResponseBase {
  data: ArticleListData;
}
type ArticleListData = {
  list: Articles[];
  pagination: Pagination;
};
