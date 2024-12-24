import { ResponseBase } from "../type";

export interface ResponseGetArticleDirectory extends ResponseBase {
  data: ArticleDirectory[];
}

export type ArticleDirectory = {
  _id: string;
  name: string;
  type: "folder" | "article";
  children: [];
  order: number;
};

export interface ResponseGetDirectoryInfoById extends ResponseBase {
  data: GetDirectoryInfoById;
}

export type GetDirectoryInfoById = {
  _id: string;
  name: string;
  type: "folder" | "actical";
  parentFolder: string;
  createdAt: Date;
  updatedAt: Date;
  children: [];
  order: number;
  desc: string;
};

export interface ResponsePostDirectoryInfoById extends ResponseBase {
  data: PostDirectoryInfoById;
}

export type PostDirectoryInfoById = {
  _id: string;
  name: string;
  type: "folder" | "actical";
  parentFolder: string;
  createdAt: Date;
  updatedAt: Date;
  children: [];
  order: number;
};
