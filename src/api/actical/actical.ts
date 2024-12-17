import http from "..";
import { ResponseBase } from "../type";
import {
  ResponseGetArticleDirectory,
  ResponsegetDirectoryInfoById,
} from "./type";

enum API {
  ACTICAL_DIRECTORY = "/artical/directory",
  ACTICAL_DIRECTORY_NAME = "/artical/directory/name",
  ACTICAL_DIRECTORY_DESC = "/artical/directory/desc",
}

//获取目录
export const getActicalDirectory = (parentFolderId?: string) =>
  http.get<any, ResponseGetArticleDirectory>(API.ACTICAL_DIRECTORY, {
    params: {
      parentFolderId: parentFolderId,
    },
  });

//根据目录id获取目录信息
export const getDirectoryInfoById = (id: string) =>
  http.get<any, ResponsegetDirectoryInfoById>(API.ACTICAL_DIRECTORY, {
    params: {
      id,
    },
  });

//修改目录信息
export const patchFolderName = (folderId: string, newName: string) =>
  http.patch<any, ResponseBase>(API.ACTICAL_DIRECTORY_NAME, {
    folderId,
    newName,
  });

export const patchFolderDesc = (folderId: string, newDesc: string) =>
  http.patch<any, ResponseBase>(API.ACTICAL_DIRECTORY_DESC, {
    folderId,
    newDesc,
  });
