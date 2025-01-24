import React, { useEffect, useState } from "react";
import {
  Route,
  useNavigate,
  Outlet,
  useLocation,
  useMatches,
} from "react-router-dom";
import Header from "../components/Header/Header";
import { MenuProps, message } from "antd";
import useTheme from "../hook/useTheme";
import { setting } from "../setting";
import Modal from "../components/Modal/Modal";
import RightModalDom from "../components/RightModalDom/RightModalDom";
import { useDispatch, useSelector } from "react-redux";
import { selectRoutes, setCurrentPath } from "../store/routersMapSlice";
import LeftModalDom from "../components/LeftModalDom/LeftModalDom";
import { checkSystemInit } from "../api/auth";
import { AppDispatch, RootState } from "../store";
import { checkLoginStatus } from "../store/authSlice";

const IndexLayout = () => {
  const { isDarkMode, handleToggleTheme } = useTheme();
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);
  const [systemIsInit, setSystemIsInit] = useState(false);
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");
  const { pathname } = useLocation();

  const location = useLocation();

  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, status } = useSelector(
    (state: RootState) => state.auth
  );

  //检查系统初始化
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const res = await checkSystemInit();
    if (!res.data.initialized) {
      navigate("Init");
      return;
    } else {
      setSystemIsInit(true);
      // navigate("/");
    }
  };

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

  //未初始化
  if (!systemIsInit) return;

  const handleNavigate = (key: string) => {
    console.log(key);
    setCurrent(key);
    navigate(key === "Home" ? "/" : `/${key}`);
    setIsRightMenuOpen(false);
  };

  const handleLeftMenu = () => {
    if (isRightMenuOpen) {
      setIsRightMenuOpen(false);
    }
    setIsLeftMenuOpen(!isLeftMenuOpen);
  };

  const handleRightMenu = () => {
    if (isLeftMenuOpen) {
      setIsLeftMenuOpen(false);
    }
    setIsRightMenuOpen(!isRightMenuOpen);
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <Header
        logoUrl={user?.imgurl || setting.BLOG_HERO_DEFAULT_LOGO_URL}
        siteName="Ron 个人博客"
        menuItems={items}
        isDarkMode={isDarkMode}
        isLeftMenuOpen={isLeftMenuOpen}
        isRightMenuOpen={isRightMenuOpen}
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
