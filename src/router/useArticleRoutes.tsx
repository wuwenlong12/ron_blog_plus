import { RouteObject } from "react-router-dom";
import { useState } from "react";
import { getActicalDirectory } from "../api/folder";
import { generateRoutesMap } from "./generaterRoutes";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { setArticleRoutesMap } from "../store/routersMapSlice";

const useArticleRoutes = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const loadArticleRoutes = async () => {
    try {
      const res = await getActicalDirectory(); // 获取动态路由数据
      if (res.code !== 0) {
        dispatch(setArticleRoutesMap([]));
        setIsLoaded(true);
        return;
      }
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

  return { isLoaded, loadArticleRoutes };
};

export default useArticleRoutes;
