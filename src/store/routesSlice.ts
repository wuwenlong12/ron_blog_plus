// src/store/slices/routesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Route } from "../router/type";
import { get } from "https";
import { getActicalDirectory } from "../api/actical/actical";





interface RoutesState {
  staticRoutes: Route[]; // 静态路由
  dynamicRoutes: Route[]; // 动态路由
}

const initialState: RoutesState = {
  staticRoutes: [], // 初始化为空
  dynamicRoutes: [],
};

const routesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {
    setStaticRoutes(state, action: PayloadAction<Route[]>) {
      state.staticRoutes = action.payload;
    },
    setDynamicRoutes(state, action: PayloadAction<Route[]>) {
      state.dynamicRoutes = action.payload;
    },
    updateArticalChildren(state, action: PayloadAction<Route[]>) {
      state.staticRoutes = state.staticRoutes.map((route) =>
        route.path === "/artical"
          ? { ...route, children: action.payload } // 更新 children
          : route
      );
    },
    getActicalChildren(){

    },
    clearDynamicRoutes(state) {
      state.dynamicRoutes = [];
    },
  },
});

export const { setStaticRoutes, setDynamicRoutes,updateArticalChildren, clearDynamicRoutes } =
  routesSlice.actions;

export default routesSlice.reducer; 

// Selector 获取 `/artical` 的子路由
export const selectActicalChildren = (state: { routes: RoutesState }): Route[] => {
  const articalRoute = state.routes.staticRoutes.find(
    (route) =>{ return route.path === "/artical"}
  );
  return articalRoute?.children || []; // 如果没有子路由，返回空数组
};