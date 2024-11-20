import { ResponseBase } from "../type";

export interface ResponseGetActicalDirectory extends ResponseBase {
    data: acticalDirectory[]
}

export type acticalDirectory = {
    _id: string,
    name: string,
    type: "folder" | "actical",
    children: [],
    order: number
}

export interface ResponsegetDirectoryInfoById extends ResponseBase {
    data: DirectoryInfoById
}

export type DirectoryInfoById = {
    _id: string,
    name: string,
    type: "folder" | "actical",
    parentFolder: string,
    createdAt:Date,
    updatedAt:Date
    children: [],
    order: number,
    desc:string
}


