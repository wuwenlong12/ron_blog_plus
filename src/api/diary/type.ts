import { PartialBlock } from "@blocknote/core";
import { ResponseBase } from "../type";
import { tag } from "../tag/type";

export interface ResponseGetAllDiary extends ResponseBase {
  data: AllDiary;
}
export type AllDiary = {
  diaries: Diary[];
  pagination: Pagination;
};

export type Diary = {
  _id: string;
  title: string;
  tags?: tag[];
  summary?: PartialBlock[];
  coverImage: string;
  content?: PartialBlock[];
  createdAt: Date;
  updatedAt: Date;
};

export type Pagination = {
  currentPage: number;
  pageSize: number;
  total: number;
};

export interface ResponseGetDiary extends ResponseBase {
  data: Diary;
}
