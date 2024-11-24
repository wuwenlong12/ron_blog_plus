import { ComponentKey, IconKey } from "./utils";
export interface BackendRouteNode {
  _id: string; // 唯一标识
  name: string; // 路由名称
  type: "folder" | "article"; // 类型
  children?: BackendRouteNode[]; // 子节点（递归结构）
  order?: number; // 排序字段
}

export interface Route {
  path: string;
  element: ComponentKey;
  meta: {
    label: string;
    key: string;
    icon?: IconKey;
    type?: "folder" | "article";
  };
  children?: Route[];
}
export interface RouteMap {
  path: string;
  element: React.ReactElement;
  meta: {
    label: string;
    key: string;
    icon?: React.ReactNode;
    type?: "folder" | "article";
  };
  children?: Route[];
}
