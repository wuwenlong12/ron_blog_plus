import React from "react";
import { RouteObject } from "react-router-dom";
import { acticalDirectory } from "../api/actical/type";

const ArticleMainContent = React.lazy(() => import("../pages/ArticleMainContent/ArticleMainContent"));

export const generateRoutes = (nodes:acticalDirectory[]): RouteObject[] => {
  return nodes.map((node) => {
    // 根据类型映射到对应组件
    // const Component = componentMap[node.type] || EditFolderInfo;
    
    // 创建路由对象
    const route: RouteObject = {
      path: node.name, // 使用 `_id` 作为路径
      element: <ArticleMainContent motionKey={node._id} />,
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
