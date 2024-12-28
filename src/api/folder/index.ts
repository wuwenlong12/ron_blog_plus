import http from "..";
import { tag } from "../../pages/Article/components/RightMenu/componets/ChooseTag";
import { ResponseBase } from "../type";
import {
  ResponseGetArticleDirectory,
  ResponseGetDirectoryInfoById,
  ResponsePostDirectoryInfoById,
} from "./type";

enum API {
  ACTICAL_DIRECTORY = "/folder",
  ACTICAL_DIRECTORY_NAME = "/folder/name",
  ACTICAL_DIRECTORY_DESC = "/folder/desc",
  ACTICAL_DIRECTORY_ORDER = "/folder/order",
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
  http.get<any, ResponseGetDirectoryInfoById>(API.ACTICAL_DIRECTORY, {
    params: {
      id,
    },
  });

//根据目录id添加文章或文件夹
export const postDirectoryInfoById = (
  name: string,
  parentFolderId: string | null,
  type: "folder" | "article",
  tags?: tag[]
) =>
  http.post<any, ResponsePostDirectoryInfoById>(API.ACTICAL_DIRECTORY, {
    name,
    parentFolderId,
    type,
    tags,
  });

//根据目录id添加文章或文件夹
export const deleteDirectoryInfoById = (
  itemId: string,
  type: "folder" | "article"
) =>
  http.delete<any, ResponseBase>(API.ACTICAL_DIRECTORY, {
    params: {
      itemId,
      type,
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

export const patchFolderOrder = (
  itemId: string,
  type: string,
  dropOrder: number,
  newParentFolderId: string | null
) =>
  http.patch<any, ResponseBase>(API.ACTICAL_DIRECTORY_ORDER, {
    itemId,
    type,
    dropOrder,
    newParentFolderId,
  });
