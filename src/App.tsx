// src/App.tsx
import React, { useEffect, useMemo, useState } from "react";
import "./App.scss";
import {
  RouteObject,
  BrowserRouter as Router,
  RouterProvider,
  createBrowserRouter,
  useLocation,
  useMatches,
} from "react-router-dom";
import { ConfigProvider, theme, ThemeConfig } from "antd";
import useTheme from "./hook/useTheme";
import Loading from "./components/loading/loading";
import { useDispatch, useSelector } from "react-redux";
import { setRoutesMap, setCurrentPath } from "./store/routersMapSlice";
import { StaticRoutesMap } from "./router";
import { RootState } from "./store";
import { selectRoutes } from "./store/routersMapSlice";
import useArticleRoutes from "./router/useArticleRoutes";

const App: React.FC = () => {
  const { isDarkMode } = useTheme(); // 确保在 Provider 内部
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>();
  const dispatch = useDispatch();
  const Routes: RouteObject[] = useSelector(selectRoutes);
  const { isLoaded, loadArticleRoutes } = useArticleRoutes();
  useEffect(() => {
    if (isDarkMode) {
      setCurrentTheme({
        algorithm: theme.darkAlgorithm,
        token: {},
        components: {
          Breadcrumb: {
            /* 这里是你的组件 token */
            itemColor: "#fff",
          },
          Button: {
            defaultBg: "#fff",
          },
        },
      });
    } else {
      setCurrentTheme({
        algorithm: theme.defaultAlgorithm,
        token: {},
        components: {
          Breadcrumb: {
            /* 这里是你的组件 token */
            itemColor: "#fff",
          },
          Button: {
            defaultBg: "#fff",
          },
        },
      });
    }
  }, [isDarkMode]);

  // 创建静态路由
  useEffect(() => {
    dispatch(setRoutesMap(StaticRoutesMap));
  }, []);

  // 缓冲路由结果
  const router = useMemo(() => {
    if (Routes.length === 0) return null;
    console.log(Routes);

    return createBrowserRouter(Routes);
  }, [Routes]);

  useEffect(() => {
    loadArticleRoutes();
  }, []);

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <ConfigProvider theme={currentTheme}>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </ConfigProvider>
  );
};

export default App;
