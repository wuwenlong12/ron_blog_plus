import { PartialBlock } from "@blocknote/core";
import { ResponseBase } from "../type";
import { tag } from "../tag/type";
import { SiteInfo } from "../site/type";

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
  role: Role;
  managedSites: SiteInfo;
  password?: string;
  imgurl?: string;
  oldPassword?: string;
  newPassword?: string;
};
export type Role = {
  _id: string;
  name: "superAdmin" | "webMaster" | "user";
  permissions: string[];
};
