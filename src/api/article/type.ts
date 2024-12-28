import { PartialBlock } from "@blocknote/core";
import { ResponseBase } from "../type";
import { tag } from "../../pages/Article/components/RightMenu/componets/ChooseTag";

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
