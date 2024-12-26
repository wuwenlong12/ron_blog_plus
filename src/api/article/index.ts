import http from "..";
import {
  ResponseGetArticleContent,
  ResponseUpdateArticleContent,
} from "./type";

enum API {
  ARTICLE_CONTENT = "/article/content",
}

//根据目录id获取w文章内容
export const getArticleContentById = (id: string) =>
  http.get<any, ResponseGetArticleContent>(API.ARTICLE_CONTENT, {
    params: {
      id,
    },
  });

export const updateArticleContentById = (id: string, content: unknown) =>
  http.post<any, ResponseUpdateArticleContent>(API.ARTICLE_CONTENT, {
    id,
    content,
  });
