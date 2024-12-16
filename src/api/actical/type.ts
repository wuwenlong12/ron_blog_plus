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

export interface ResponsegetDirectoryInfoById extends ResponseBase {
  data: DirectoryInfoById;
}

export type DirectoryInfoById = {
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
