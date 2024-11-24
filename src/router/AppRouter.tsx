// src/router/AppRouter.tsx
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getActicalDirectory } from "../api/actical/actical";
import { RootState } from "../store";
import { generateRoutes } from "./generaterRoutes";
import { setDynamicRoutes } from "../store/routesSlice";
import Actical from "../pages/Actical/Actical";
import { componentMap } from "./utils/index";
import Icon from "@ant-design/icons";
import { Route as RouteType } from "./type";



const AppRouter = () => {
  const dispatch = useDispatch();
  const staticRoutes = useSelector((state: RootState) => state.routes.staticRoutes);
  const dynamicRoutes = useSelector((state: RootState) => state.routes.dynamicRoutes);
 useEffect(()=>{
  console.log(staticRoutes);
  
 },[staticRoutes])
  useEffect(() => {
    const loadDynamicRoutes = async () => {
      try {
        const res = await getActicalDirectory();
        const backendData = res.data;

        const generatedRoutes = generateRoutes(backendData);

        dispatch(setDynamicRoutes(generatedRoutes)); // 保存动态路由到 Redux
      } catch (error) {
        console.error("加载动态路由失败:", error);
      }
    };

    loadDynamicRoutes();
  }, [dispatch]);

  const allRoutes = [...staticRoutes, ...dynamicRoutes]; // 合并静态和动态路由

  // 递归渲染路由
  const renderRoutes = (routes: RouteType[]) => {
    return routes.map((route, index) => (
      <Route
        key={route.meta.key}
        path={route.path}
        element={componentMap[route.element]}
      >
        {/* 如果有子路由，递归调用 */}
        {route.children && renderRoutes(route.children)}
      </Route>
    ));
  };
  
  return <Routes>{renderRoutes(staticRoutes)}</Routes>;
};

export default AppRouter;