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
  data: userInfo;
}

type userInfo = {
  id: string;
  imgurl: string;
  username: string;
};
