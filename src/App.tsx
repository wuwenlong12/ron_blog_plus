// src/App.tsx
import React, { useEffect, useState } from "react";
import ThemeDiv from "./themeComponent/themeView";
import "./App.scss";
import Header from "./components/Header/Header";
import { BrowserRouter as Router, Routes, Route, RouterProvider, createBrowserRouter } from "react-router-dom";
import    useRoutes  from "./router";
import IndexLayout from "./layout";
import { useDispatch } from "react-redux";
import { setStaticRoutes } from "./store/routesSlice";
import nProgress from "nprogress";

const App: React.FC = () => {
  const { routes, isLoaded } = useRoutes(); // 使用 useRoutes 获取路由配置和加载状态

  if (!isLoaded) {
    return <div>Loading routes...</div>; // 如果路由还未加载，展示加载指示器
  }
  const router = createBrowserRouter(routes);


  return (
    <RouterProvider router={router} future={{ v7_startTransition: true }}/>
  );
};

export default App;
