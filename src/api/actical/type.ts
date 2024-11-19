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



