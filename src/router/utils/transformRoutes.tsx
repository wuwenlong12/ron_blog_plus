import React, { Suspense, ReactNode } from "react";
import { RouteObject } from "react-router-dom";
import { componentMap } from "./routerMap"; // 组件映射表
import { iconMap } from "./iconMap"; // 图标映射表
import Loading from "../../components/loading/loading";

// 递归转换函数
export const transformRoutes = (routes: RouteObject[]): RouteObject[] => {
  return routes.map((route) => {
    const element = route.element;
    const key = route.handle ? route.handle.key : "";
    const transformedRoute: RouteObject = {
      ...route,
      element:
        typeof element === "string" && componentMap[element] ? (
          <Suspense fallback={<Loading />}>
            {React.createElement(componentMap[element], {
              motionKey: key,
            })}
          </Suspense>
        ) : (
          (element as ReactNode)
        ), // 如果已经是组件，直接使用
      handle: route.handle
        ? {
            ...route.handle,
            Icon: route.handle.Icon
              ? iconMap[route.handle.Icon as string] || undefined // 映射图标
              : undefined,
          }
        : undefined,
    };

    // 递归处理子路由
    if (route.children) {
      transformedRoute.children = transformRoutes(route.children);
    }

    return transformedRoute;
  });
};
