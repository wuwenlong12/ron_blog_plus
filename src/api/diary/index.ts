import { PartialBlock } from "@blocknote/core";
import http from "..";
import { ResponseBase } from "../type";
import {
  ResponseGetAllDiary,
  ResponseGetDiary,
  ResponseGetDiaryDates,
  ResponseGetDiaryTimeline,
} from "./type";
import { tag } from "../tag/type";

enum API {
  DIARY = "/diary",
  DIARY_LIST = "/diary/list",
  DIARY_CONTENT = "/diary/content",
  DIARY_DATE = "/diary/date",

  DIARY_TIMELINE = "/diary/timeline",
}

//获取日记列表
export const getAllDiary = (pageNumber: number = 1, pageSize: number = 10) =>
  http.get<any, ResponseGetAllDiary>(API.DIARY_LIST, {
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
  isToday?: boolean,
  date?: number,
  coverImage?: string
) =>
  http.post<any, ResponseBase>(API.DIARY, {
    isToday,
    date,
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

//根据目录id获取w文章内容
export const getDiaryDates = () =>
  http.get<any, ResponseGetDiaryDates>(API.DIARY_DATE);

export const getDiaryByDate = (date: number) =>
  http.get<any, ResponseGetDiary>(API.DIARY, {
    params: {
      date,
    },
  });

export const getDiaryTimeLine = () =>
  http.get<any, ResponseGetDiaryTimeline>(API.DIARY_TIMELINE, {});
