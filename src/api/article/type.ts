import { PartialBlock } from "@blocknote/core";
import { ResponseBase } from "../type";

export interface ResponseGetArticleContent extends ResponseBase {
  data: ArticleContent;
}
export type ArticleContent = {
  _id: string;
  title: string;
  content: PartialBlock[];
  parentFolder: string;
  createdAt: Date;
  updatedAt: Date;
};
export interface ResponseUpdateArticleContent extends ResponseBase {
  data: ArticleContent;
}
