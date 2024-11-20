import http from ".."
import { ResponseBase } from "../type"
import { ResponseGetActicalDirectory, ResponsegetDirectoryInfoById } from "./type"

enum API {
    ACTICAL_DIRECTORY = '/artical/directory',
}

//获取目录
export const getActicalDirectory =  (parentFolderId?:string) => http.get<any,ResponseGetActicalDirectory>(API.ACTICAL_DIRECTORY,{
    params: {
        parentFolderId: parentFolderId,
     }
})

//根据目录id获取目录信息
export const getDirectoryInfoById =  (id:string) => http.get<any,ResponsegetDirectoryInfoById>(API.ACTICAL_DIRECTORY,{
    params: {
        id,
     }
})

//修改目录信息
export const patchFolderInfo =  (folderId:string,newName:string,newDesc:string) => http.patch<any,ResponseBase>(API.ACTICAL_DIRECTORY,{folderId,newName,newDesc})
