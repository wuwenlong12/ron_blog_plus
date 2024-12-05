import Layout from "../layout";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import React, { Suspense, useEffect, useState } from "react";
import { MailOutlined } from "@ant-design/icons";
import { getActicalDirectory } from "../api/actical/actical";
import { componentKey, componentMap, generateRoutes, generateRoutesMap } from "./generaterRoutes";
import Loading from "../components/loading/loading";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {  setArticleRoutesMap } from "../store/articleRoutesSlice";

// 懒加载页面组件
const Home = React.lazy(() => import("../pages/Home/Home"));
const Diary = React.lazy(() => import("../pages/Diary/Diary"));
const Article = React.lazy(() => import("../pages/Article/Article"));
const About = React.lazy(() => import("../pages/About/About"));
const ArticleMainContent = React.lazy(() => import("../pages/ArticleMainContent/ArticleMainContent"));


const useRoutes = () => {
  const dispatch: AppDispatch = useDispatch();
  const articleRoutesMap = useSelector((state: RootState) => state.articleRoutes.articleRoutesMap);
  const [articleRoutes,setArticleRoutes] = useState<RouteObject[]>([])
  const [isloaded, setIsloaded] = useState(false);
  const [routes,setRoutes] =useState<RouteObject[]>()
  // 加载动态路由



  useEffect(() => {
    loadArticleRoutes()
  }, [])

  const loadArticleRoutes = async () => {
    try {
      const res = await getActicalDirectory(); // 获取动态路由数据
      const backendData = res.data;
      // 生成动态子路由
      const articalChildren = generateRoutesMap(backendData);
      const articleRoutes = generateRoutes(articalChildren)
      setArticleRoutes(articleRoutes)
      dispatch(setArticleRoutesMap(articalChildren))
      setIsloaded(true);
    } catch (error) {
      console.error("加载文章动态路由失败:", error);
      dispatch(setArticleRoutesMap([])) // 如果失败，设置空数组
    }
  };
  // 当路由加载完成时，使用 createBrowserRouter 创建路由配置
 
  const routesObj: RouteObject[] =  [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "home",
            element: (
              <Suspense fallback={<Loading />}>
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
              <Suspense fallback={<Loading />}>
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
            path: "article",
            element: (
              <Suspense fallback={<Loading />}>
                <Article />
              </Suspense>
            ),
            children: [
              {
                path: "",
                element: (
                  <Suspense fallback={<div>Loading...</div>}>
                    <ArticleMainContent motionKey={"mainContent"} />
                  </Suspense>
                ),
                handle: {
                  key: "MainPage",
                  label: "主页",
                  Icon: <MailOutlined />,
                  requiresAuth: false,
                },
              },
              ...articleRoutes, // 动态加载的子路由
            ],
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
              <Suspense fallback={<Loading />}>
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
    ];
    setRoutes(routesObj)

  return { isloaded, routes, articleRoutes, loadArticleRoutes };
};

export default useRoutes;


