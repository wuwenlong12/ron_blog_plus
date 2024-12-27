import React from "react";
import { RouteObject } from "react-router-dom";
import { ArticleDirectory } from "../api/folder/type";
import Loading from "../components/loading/loading";

// 懒加载组件的映射
export const componentMap: Record<
  string,
  React.LazyExoticComponent<React.FC<any>>
> = {
  ArticleMainContent: React.lazy(
    () => import("../pages/ArticleMainContent/ArticleMainContent")
  ),
};

// 组件名称映射（可以动态扩展）
export const componentKey = {
  ArticleMainContent: "ArticleMainContent",
};

// 定义 handle 类型
interface RouteHandle {
  componentName: string; // 存储组件名称
  label: string; // 路由标签
  key: string; // 唯一标识
  type: string; // 路由类型（例如：文章、主页等）
}

export const generateRoutesMap = (
  nodes: ArticleDirectory[],
  isRoot: boolean = true // 标识是否为顶层调用
): RouteObject[] => {
  const routes = nodes.map((node) => {
    const route: RouteObject = {
      path: node._id, // 路由路径
      element: componentKey.ArticleMainContent,
      handle: {
        label: node.name,
        key: node._id,
        type: node.type,
      } as RouteHandle, // 明确指定 handle 的类型
    };

    // 如果有子节点，递归处理
    if (node.children && node.children.length > 0) {
      route.children = generateRoutesMap(node.children, false);
    }

    return route;
  });

  // 仅在顶层添加 index 路由
  if (isRoot) {
    const indexRoute: RouteObject = {
      index: true, // 顶层默认路由
      element: componentKey.ArticleMainContent, // 默认路由的组件
      handle: {
        label: "默认首页",
        key: "default-index",
        type: "folder",
      } as RouteHandle,
    };

    return [indexRoute, ...routes];
  }

  return routes;
};
