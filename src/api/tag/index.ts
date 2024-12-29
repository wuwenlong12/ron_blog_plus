import http from "..";
import { ResponseGetTag } from "./type";

enum API {
  TAG = "/tag",
}

//新增tag
export const postTag = (name: string, color: string) =>
  http.post<any, ResponseGetTag>(API.TAG, { name, color });

//删除tag
export const deleteTag = (id: string) =>
  http.delete<any, ResponseGetTag>(API.TAG, {
    params: {
      id,
    },
  });
//查找全部tag
export const getTag = () => http.get<any, ResponseGetTag>(API.TAG, {});
