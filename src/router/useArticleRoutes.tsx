import Layout from "../layout";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { MailOutlined } from "@ant-design/icons";
import { getActicalDirectory } from "../api/actical/actical";
import { generateRoutesMap } from "./generaterRoutes";
import Loading from "../components/loading/loading";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { setArticleRoutesMap } from "../store/routersMapSlice";

const useArticleRoutes = () => {
  const dispatch: AppDispatch = useDispatch();

  const [articleRoutes, setArticleRoutes] = useState<RouteObject[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadArticleRoutes = async () => {
    try {
      const res = await getActicalDirectory(); // 获取动态路由数据
      const backendData = res.data;
      // 生成动态子路由
      const articalChildren = generateRoutesMap(backendData);

      dispatch(setArticleRoutesMap(articalChildren));
      setIsLoaded(true);
    } catch (error) {
      console.error("加载文章动态路由失败:", error);
      dispatch(setArticleRoutesMap([])); // 如果失败，设置空数组
    }
  };

  return { isLoaded, articleRoutes, loadArticleRoutes };
};

export default useArticleRoutes;
