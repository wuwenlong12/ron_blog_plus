import { PartialBlock } from "@blocknote/core";
import { ResponseBase } from "../type";

export interface ResponseGetTag extends ResponseBase {
  data: GetTag;
}
export type GetTag = {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
