import React from "react";
import EditFolderInfo from "../pages/EditFolderInfo/EditFolderInfo";
import EditArticleInfo from "../pages/EditArticleInfo/EditArticleInfo";
import { BackendRouteNode, Route, RouteMap } from "./type";
import { ComponentKey } from "./utils";

// const componentMap: Record<string, React.ComponentType> = {
//   folder: EditFolderInfo,
//   article: EditArticleInfo,
// };

/**
 * 递归生成路由配置
 * @param nodes 后端返回的路由节点
 * @returns 路由配置数组
 */
export const generateRoutes = (nodes: BackendRouteNode[]): Route[] => {
  return nodes.map((node) => {
    // 根据类型映射到对应组件
    // const Component = componentMap[node.type] || EditFolderInfo;
    
    // 创建路由对象
    const route: Route = {
      path: node.name, // 使用 `_id` 作为路径
      element: node.type=='folder'? ComponentKey.EditFolderInfo :ComponentKey.EditArticleInfo,
      meta: {
        label: node.name, // 路由菜单显示名称
        key: node._id, // 唯一标识
        type:node.type,
      },
    };

    // 如果有子节点，递归处理
    if (node.children && node.children.length > 0) {
      route.children = generateRoutes(node.children);
    }

    return route;
  });
};
