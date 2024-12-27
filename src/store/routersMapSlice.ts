import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RouteObject } from "react-router-dom";
import { transformRoutes } from "../router/utils/transformRoutes";
import { Key } from "react";

// 定义状态的类型
interface RoutesState {
  isLoaded: boolean; // 动态路由是否已加载
  routesMap: RouteObject[]; // 静态路由映射
  articleRoutesMap: RouteObject[]; // 动态路由映射
  currentPath: string;
  selectedKey: Key;
}

// 初始化状态
const initialState: RoutesState = {
  isLoaded: false,
  routesMap: [],
  articleRoutesMap: [],
  currentPath: "/", // 默认首页路径
  selectedKey: "",
};

// 创建 slice，确保 state 的类型被正确推断
const RoutesSlice = createSlice({
  name: "Routes",
  initialState,
  reducers: {
    // 设置动态文章路由映射
    setArticleRoutesMap(state, action: PayloadAction<RouteObject[]>) {
      state.articleRoutesMap = action.payload;

      // 将动态路由添加到 routesMap 中的 `article` 路由的子路由
      const articleRoute = state.routesMap
        .find(
          (route) => route.path === "/" // 找到根路径
        )
        ?.children?.find((route) => route.path === "article"); // 找到 article 路由

      if (articleRoute) {
        if (!articleRoute.children) {
          articleRoute.children = [];
        }
        articleRoute.children = [
          // ...(articleRoute.children ?? []), // 保留原来的子路由
          ...action.payload, // 添加动态路由
        ];
      }
    },

    // 设置静态路由映射
    setRoutesMap(state, action: PayloadAction<RouteObject[]>) {
      state.routesMap = action.payload;
      state.isLoaded = true;
    },

    // 设置加载状态
    setIsLoaded(state, action: PayloadAction<boolean>) {
      state.isLoaded = action.payload;
    },
    // 更新当前路径
    setCurrentPath(state, action: PayloadAction<string>) {
      state.currentPath = action.payload;
    },
    setSelectedKey(state, action: PayloadAction<Key>) {
      state.selectedKey = action.payload;
    },
    //  // 重置状态
    //  resetRoutesState(state) {
    //   state.isLoaded = false;
    //   state.RoutesMap = [];
    //   state.articleRoutesMap = [];
    //   state.currentPath = "/";
    // },
  },
});

// 导出 actions
export const {
  setArticleRoutesMap,
  setRoutesMap,
  setIsLoaded,
  // resetRoutesState,
  setCurrentPath,
  setSelectedKey,
} = RoutesSlice.actions;

// 导出 reducer
export default RoutesSlice.reducer;

export const selectRoutes = createSelector(
  // 第一个参数是依赖项，这里是 routesMap
  (state: { routesMap: RoutesState }) => state.routesMap.routesMap,

  // 第二个参数是计算函数，只有在 routesMap.routesMap 变化时才会重新执行
  (routesMap) => {
    return transformRoutes(routesMap); // 返回处理后的结果
  }
);
