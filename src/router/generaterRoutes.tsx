import React from "react";
import EditFolderInfo from "../pages/ArticleMainContent/ArticleMainContent";
import EditArticleInfo from "../pages/EditArticleInfo/EditArticleInfo";
import { BackendRouteNode, Route, RouteMap } from "./type";
import { ComponentKey } from "./utils";
import { RouteObject } from "react-router-dom";

// const componentMap: Record<string, React.ComponentType> = {
//   folder: EditFolderInfo,
//   article: EditArticleInfo,
// };
const ArticleMainContent = React.lazy(() => import("../pages/ArticleMainContent/ArticleMainContent"));
/**
 * 递归生成路由配置
 * @param nodes 后端返回的路由节点
 * @returns 路由配置数组
 */
export const generateRoutes = (nodes: BackendRouteNode[]): RouteObject[] => {
  return nodes.map((node) => {
    // 根据类型映射到对应组件
    // const Component = componentMap[node.type] || EditFolderInfo;
    
    // 创建路由对象
    const route: RouteObject = {
      path: node.name, // 使用 `_id` 作为路径
      Component: ArticleMainContent,
      handle: {
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
