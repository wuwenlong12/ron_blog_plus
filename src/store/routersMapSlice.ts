import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RouteObject } from "react-router-dom";
import { transformRoutes } from "../router/utils/transformRoutes";
import { Key } from "react";
import { AppDispatch } from ".";
import { getActicalDirectory } from "../api/folder";

// 定义状态的类型
interface RoutesState {
  isLoaded: boolean; // 动态路由是否已加载
  articleRouterIsLoaded: boolean; //article 动态路由是否已加载
  routesMap: RouteObject[]; // 静态路由映射
  articleRoutesMap: RouteObject[]; // 动态路由映射
  currentPath: string;
  selectedKey: Key;
}

// 初始化状态
const initialState: RoutesState = {
  isLoaded: false,
  articleRouterIsLoaded: false,
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
    // 设置article动态路由加载状态
    setArticleRouterIsLoaded(state, action: PayloadAction<boolean>) {
      state.articleRouterIsLoaded = action.payload;
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
  setArticleRouterIsLoaded,
  // resetRoutesState,
  setCurrentPath,
  setSelectedKey,
} = RoutesSlice.actions;

export const selectRoutes = createSelector(
  // 第一个参数是依赖项，这里是 routesMap
  (state: { routesMap: RoutesState }) => state.routesMap.routesMap,

  // 第二个参数是计算函数，只有在 routesMap.routesMap 变化时才会重新执行
  (routesMap) => {
    return transformRoutes(routesMap); // 返回处理后的结果
  }
);

//加载文章router
export const loadArticleRoutes = () => async (dispatch: AppDispatch) => {
  dispatch(setArticleRouterIsLoaded(false)); // 请求开始时设置为加载中
  try {
    const res = await getActicalDirectory(); // 获取动态路由数据
    if (res.code === 0) {
      dispatch(setArticleRoutesMap(res.data));
    } else if (res.code === 1) {
      dispatch(setArticleRoutesMap([])); // 如果没有数据，清空动态路由
    }
  } catch (error) {
    console.error("加载文章路由失败:", error); // 捕获并输出错误
    dispatch(setArticleRoutesMap([])); // 如果出错，清空动态路由
  } finally {
    dispatch(setArticleRouterIsLoaded(true)); // 无论成功与否，标记加载结束
  }
};

// 导出 reducer
export default RoutesSlice.reducer;
