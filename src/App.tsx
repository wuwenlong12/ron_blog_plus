// src/App.tsx
import React, { useEffect, useState } from "react";
import ThemeDiv from "./themeComponent/themeView";
import "./App.scss";
import Header from "./components/Header/Header";
import { BrowserRouter as Router, Routes, Route, useRoutes } from "react-router-dom";
import routes, { buildRoutes, staticRoutes } from "./router";
import IndexLayout from "./layout";
import { useDispatch } from "react-redux";
import { setStaticRoutes } from "./store/routesSlice";
const App: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    // 设置静态路由
    dispatch(setStaticRoutes(staticRoutes));
  }, [dispatch]);
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <IndexLayout></IndexLayout>
    </Router>
  );
};

export default App;
