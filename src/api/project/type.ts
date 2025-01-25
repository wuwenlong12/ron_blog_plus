import { PartialBlock } from "@blocknote/core";
import { ResponseBase } from "../type";

export interface ResponseGetProject extends ResponseBase {
  data: ProjectItem[];
}
export type ProjectItem = {
  _id?: string;
  img_url: string;
  title: string;
  category: string;
  likes?: number;
  button_url: string;
  content: PartialBlock[];
  createdAt?: string;
  updatedAt?: string;
};
