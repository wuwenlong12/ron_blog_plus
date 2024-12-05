import React, { Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { acticalDirectory } from "../api/actical/type";
import Loading from "../components/loading/loading";

// 懒加载组件的映射
export const componentMap: Record<string, React.LazyExoticComponent<React.FC<any>>> = {
  ArticleMainContent: React.lazy(() => import("../pages/ArticleMainContent/ArticleMainContent")),
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

export const generateRoutesMap = (nodes: acticalDirectory[]): RouteObject[] => {
  return nodes.map((node) => {
    const route: RouteObject = {
      path: node.name, // 路由路径
      handle: {
        componentName: componentKey.ArticleMainContent, // 存储组件名称
        label: node.name,
        key: node._id,
        type: node.type,
      } as RouteHandle, // 明确指定 handle 的类型
    };

    if (node.children && node.children.length > 0) {
      route.children = generateRoutesMap(node.children);
    }

    return { ...route };
  });
};

export const generateRoutes = (nodes: RouteObject[]): RouteObject[] => {
  return nodes.map((node) => {
    const componentName = node.handle?.componentName; // 获取存储的组件名称

    // 确保 componentName 对应到 componentMap 中
    const route: RouteObject = {
      path: node.path,
      element: (
        <Suspense fallback={<Loading />}>
          {/* 使用 React.createElement 动态渲染组件 */}
          {React.createElement(componentMap[componentName], { key: node.handle?.key })}
        </Suspense>
      ),
      handle: {
        label: node.handle?.label,
        key: node.handle?.key,
        type: node.handle?.type,
      },
    };

    if (node.children && node.children.length > 0) {
      route.children = generateRoutes(node.children); // 递归处理子路由
    }

    return { ...route };
  });
};
