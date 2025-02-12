import { RouteObject } from "react-router-dom";

export const parsePath = (location: string) => {
  return location.split("/").filter(Boolean); // 去除空字符串
};
export const findRouterMatches = (
  pathArray: string[],
  routes: RouteObject[],
  currentPath = ""
) => {
  const result: {
    pathname: string;
    label?: string;
    type?: string;
    key?: string;
  }[] = [];

  //   // 第一级路径需要处理
  //   if (currentPath === "") {
  //     result.push({ pathname: "/", label: "主页" }); // 假设首页的label为主页
  //   }

  // 获取当前路径部分
  const currentSegment = pathArray[0];

  for (const route of routes) {
    let fullPath = currentPath;

    // 拼接路径
    if (route.path) {
      fullPath = `${currentPath}/${route.path}`.replace(/\/+/g, "/");
    }

    // 判断当前路径是否匹配
    if (route.path && route.path === currentSegment) {
      result.push({
        pathname: fullPath,
        label: route.handle?.label,
        type: route.handle?.type,
        key: route.handle?.key,
      });

      // 如果匹配到路径且路径数组中还有其他部分，继续递归查找子路由
      if (pathArray.length > 1 && route.children) {
        result.push(
          ...findRouterMatches(pathArray.slice(1), route.children, fullPath)
        );
      }

      // 如果路径数组处理完了，返回结果
      if (pathArray.length === 1) {
        return result;
      }
    }
  }

  return result;
};
