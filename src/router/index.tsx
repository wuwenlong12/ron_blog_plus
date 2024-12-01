import Layout from "../layout";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import React, { Suspense, useEffect, useState } from "react";
import { MailOutlined } from "@ant-design/icons";
import { getActicalDirectory } from "../api/actical/actical";
import { generateRoutes } from "./generaterRoutes";

// 加载动态路由
const loadArticleRoutes = async () => {
  try {
    const res = await getActicalDirectory(); // 获取动态路由数据
    const backendData = res.data;
    // 生成动态子路由
    const articalChildren = generateRoutes(backendData);
    return articalChildren;
  } catch (error) {
    console.error("加载文章动态路由失败:", error);
    return []; // 如果失败，返回空数组
  }
};

// 懒加载页面组件
const Home = React.lazy(() => import("../pages/Home/Home"));
const Diary = React.lazy(() => import("../pages/Diary/Diary"));
const Article = React.lazy(() => import("../pages/Article/Article"));
const About = React.lazy(() => import("../pages/About/About"));

const useRoutes = () => {
  const [ArticleRoutes, setArticleRoutes] = useState<RouteObject[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchRoutes = async () => {
      const routes = await loadArticleRoutes();
      setArticleRoutes(routes); // 更新动态路由
      setIsLoaded(true);
    };

    fetchRoutes(); // 异步加载路由数据
  }, []);

  // 当路由加载完成时，使用 createBrowserRouter 创建路由配置
  const routes = isLoaded
    ? [
        {
          path: "/",
          element: <Layout />, // 使用 element 而不是 Component
          children: [
            {
              path: "home",
              element: (
                <Suspense fallback={<div>Loading...</div>}>
                  <Home />
                </Suspense>
              ),
              handle: {
                key: "Home",
                label: "主页",
                Icon: <MailOutlined />,
                requiresAuth: false,
              },
            },
            {
              path: "diary",
              element: (
                <Suspense fallback={<div>Loading...</div>}>
                  <Diary />
                </Suspense>
              ),
              handle: {
                key: "Diary",
                label: "日记",
                Icon: <MailOutlined />,
                requiresAuth: false,
              },
            },
            {
              path: "article", // :id 是动态路径参数
              element: (
                <Suspense fallback={<div>Loading...</div>}>
                  <Article />
                </Suspense>
              ),
              loader: loadArticleRoutes, // 异步加载子路由
              children: ArticleRoutes, // 动态加载的子路由
              handle: {
                key: "Article",
                label: "文章",
                Icon: <MailOutlined />,
                requiresAuth: false,
              },
            },
            {
              path: "about",
              element: (
                <Suspense fallback={<div>Loading...</div>}>
                  <About />
                </Suspense>
              ),
              handle: {
                key: "About",
                label: "关于",
                Icon: <MailOutlined />,
                requiresAuth: false,
              },
            },
          ],
        },
      ]
    : []; // 在加载前返回空数组，避免渲染

  return { routes, isLoaded };
};

export default useRoutes;