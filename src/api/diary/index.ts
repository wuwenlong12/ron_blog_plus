import { PartialBlock } from "@blocknote/core";
import http from "..";
import { ResponseBase } from "../type";
import { ResponseGetAllDiary, ResponseGetDiary } from "./type";
import { tag } from "../tag/type";

enum API {
  DIARY = "/diary",
  DIARY_CONTENT = "/diary/content",
}

//根据目录id获取w文章内容
export const getAllDiary = (pageNumber: number = 1, pageSize: number = 10) =>
  http.get<any, ResponseGetAllDiary>(API.DIARY, {
    params: {
      pageNumber,
      pageSize,
    },
  });
//根据目录id获取w文章内容
export const postDiary = (
  title: string,
  tags: tag[],
  content: PartialBlock[],
  coverImage?: string
) =>
  http.post<any, ResponseBase>(API.DIARY, {
    title,
    tags,
    content,
    coverImage,
  });

export const updateDiary = (
  id: string,
  title: string,
  tags: tag[],
  content: PartialBlock[],
  coverImage?: string
) =>
  http.put<any, ResponseBase>(API.DIARY, {
    id,
    title,
    tags,
    content,
    coverImage,
  });
//根据目录id获取w文章内容
export const getDiaryById = (id: string) =>
  http.get<any, ResponseGetDiary>(API.DIARY_CONTENT, {
    params: {
      id,
    },
  });
