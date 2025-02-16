import React, { useEffect, useState } from "react";
import { Route, useNavigate, Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header/Header";
import { App, MenuProps } from "antd";
import useTheme from "../hook/useTheme";
import { setting } from "../setting";
import Modal from "../components/Modal/Modal";
import RightModalDom from "../components/RightModalDom/RightModalDom";
import { useDispatch, useSelector } from "react-redux";
import {
  loadArticleRoutes,
  selectRoutes,
  setCurrentPath,
} from "../store/routersMapSlice";
import LeftModalDom from "../components/LeftModalDom/LeftModalDom";
import { checkSystemInit } from "../api/auth";
import { AppDispatch, RootState } from "../store";
import { checkLoginStatus } from "../store/authSlice";
import { fetchSiteInfo } from "../store/siteSlice";
import { toggleModal } from "../store/modalSlice";

const IndexLayout = () => {
  const { isDarkMode, handleToggleTheme } = useTheme();
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);
  const [systemIsInit, setSystemIsInit] = useState(false);
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");
  const { pathname } = useLocation();
  const siteInfo = useSelector((state: RootState) => state.site.siteInfo);
  const location = useLocation();

  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, status } = useSelector(
    (state: RootState) => state.auth
  );
  const { isLeftModalOpen, isTopModalOpen, isArticleLeftModalOpen } =
    useSelector((state: RootState) => state.modal);

  const { siteIsOpen } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    console.log(siteIsOpen);

    if (!siteIsOpen) {
      navigate("404");
    }
  }, [siteIsOpen]);
  const { message } = App.useApp();
  //检查系统初始化
  useEffect(() => {
    dispatch(fetchSiteInfo());
  }, []);

  useEffect(() => {
    if (systemIsInit === true && status === "succeeded") {
      if (isAuthenticated) {
        message.success("你好" + user?.username);
        console.log(123123);
      } else {
        message.success("你好游客,欢迎来到我的博客");
      }
    }
  }, [dispatch, isAuthenticated, systemIsInit]);

  // 路由持久化
  useEffect(() => {
    const currentPath = location.pathname;
    dispatch(setCurrentPath(currentPath));
    setCurrent(pathname.split("/")[1] || "");
    // 持久化到 localStorage
    localStorage.setItem("currentPath", currentPath);
  }, [location, dispatch]);

  // 递归渲染路由
  const renderRoutes = (routes: any[]) => {
    return routes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element}>
        {route.children && renderRoutes(route.children)} {/* 递归渲染子路由 */}
      </Route>
    ));
  };
  const routes = useSelector(selectRoutes);
  const lables = routes[0]?.children || [];
  const items: MenuProps["items"] = lables.map((item) => {
    return {
      label: item.handle.label,
      key: item.handle.key,
      icon: item.handle.Icon, // 映射为图标组件
    };
  });

  const handleNavigate = (key: string) => {
    console.log(key);
    setCurrent(key);
    navigate(key === "Home" ? "/" : `/${key}`);
    setIsRightMenuOpen(false);
  };

  const handleLeftMenu = () => {
    dispatch(toggleModal("left"));
  };

  const handleRightMenu = () => {
    dispatch(toggleModal("top"));
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <Header
        logoUrl={siteInfo?.avatar || setting.BLOG_HERO_DEFAULT_LOGO_URL}
        siteName={siteInfo?.site_name || "个人知识库"}
        menuItems={items}
        isDarkMode={isDarkMode}
        isLeftMenuOpen={isLeftModalOpen}
        isRightMenuOpen={isTopModalOpen}
        onToggleTheme={handleToggleTheme}
        onNavigate={handleNavigate}
        onClickLeftMenu={handleLeftMenu}
        onClickRightMenu={handleRightMenu}
        current={current} // 传递当前选中的菜单项
      ></Header>
      <Outlet />
    </div>
  );
};

export default IndexLayout;
