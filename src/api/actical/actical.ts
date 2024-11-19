import http from ".."
import { ResponseBase } from "../type"
import { ResponseGetActicalDirectory } from "./type"

enum API {
    ACTICAL_DIRECTORY = '/artical/directory',
}
//获取目录
export const getActicalDirectory =  (parentFolderId?:string) => http.get<any,ResponseGetActicalDirectory>(API.ACTICAL_DIRECTORY,{
    params: {
        parentFolderId: parentFolderId,
     }
})

//获取目录
export const patchFolderInfo =  (folderId:string,newName:string,newDesc:string) => http.patch<any,ResponseBase>(API.ACTICAL_DIRECTORY,{folderId,newName,newDesc})
