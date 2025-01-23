import { PartialBlock } from "@blocknote/core";
import { ResponseBase } from "../type";
import { tag } from "../tag/type";

export interface ResponseCheckSystemInit extends ResponseBase {
  data: CheckSystemInitData;
}
type CheckSystemInitData = {
  initialized: boolean;
};

export interface ResponseLogin extends ResponseBase {
  data: User;
}

export type User = {
  id?: string;
  username?: string;
  email?: string;
  password?: string;
  github?: string;
  wx?: string;
  school?: string;
  explain?: Array<string>;
  imgurl?: string;
  oldPassword?: string;
  newPassword?: string;
};
