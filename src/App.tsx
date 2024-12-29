// src/App.tsx
import React, { useEffect, useMemo, useState } from "react";
import "./App.scss";
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { ConfigProvider, theme, ThemeConfig } from "antd";
import useTheme from "./hook/useTheme";
import Loading from "./components/loading/loading";
import { useDispatch, useSelector } from "react-redux";
import { setRoutesMap } from "./store/routersMapSlice";
import { StaticRoutesMap } from "./router";
import { selectRoutes } from "./store/routersMapSlice";
import useArticleRoutes from "./router/useArticleRoutes";
import { App as AntdApp } from "antd"; // 引入 Ant Design 的 App
import MouseParticles from "react-mouse-particles";
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
          // Button: {
          //   defaultBg: "#fff",
          // },
          Tree: {
            /* 这里是你的组件 token */
            directoryNodeSelectedBg: "rgba(9, 109, 217, .15)",
            directoryNodeSelectedColor: "#0a7bf4",
            nodeHoverColor: "#0a7bf4",
          },
        },
      });
    } else {
      setCurrentTheme({
        algorithm: theme.defaultAlgorithm,
        components: {
          Breadcrumb: {
            /* 这里是你的组件 token */
            itemColor: "#fff",
          },
          // Button: {
          //   defaultBg: "#fff",
          // },
          Tree: {
            /* 这里是你的组件 token */
            directoryNodeSelectedBg: "rgba(9, 109, 217, .15)",
            directoryNodeSelectedColor: "#0a7bf4",
            nodeHoverColor: "#0a7bf4",
          },
        },
      });
    }
  }, [isDarkMode]);

  // 创建静态路由
  useEffect(() => {
    dispatch(setRoutesMap(StaticRoutesMap));
  }, [dispatch]);

  // 缓冲路由结果
  const router = useMemo(() => {
    if (Routes.length === 0) return null;
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
      <AntdApp>
        {/* @ts-ignore */}
        <MouseParticles g={1} color="random" cull="col,image-wrapper" />
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
