import React, { useEffect, useState } from "react";
import {
  Route,
  useNavigate,
  Outlet,
} from "react-router-dom";
import Header from "../components/Header/Header";
import { MenuProps } from "antd";
import useTheme from "../hook/useTheme";
import { setting } from "../setting";
import Modal from "../components/Modal/Modal";
import LeftModalDom from "../components/RightModalDom/RightModalDom";
import useRoutes from "../router";


const IndexLayout = () => {
  const { isDarkMode, handleToggleTheme } = useTheme();
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [current, setCurrent] = useState("main");

 

  // 递归渲染路由
  const renderRoutes = (routes: any[]) => {
    return routes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element}>
        {route.children && renderRoutes(route.children)} {/* 递归渲染子路由 */}
      </Route>
    ));
  };
  const { routes, isLoaded } = useRoutes();

  // todo
  const  lables = routes.routes[0]?.children || []

  const items: MenuProps["items"] = lables.map((item) => {
    return {
      label:item.handle.label,
      key:item.handle.key,
      icon: item.handle.Icon, // 映射为图标组件
    };
  });

 
 
  const handleNavigate = (key: string) => {
    console.log(key);
    
    setCurrent(key);
    navigate(key === "main" ? "/" : `/${key}`);
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
    <>
      <Header
        logoUrl={setting.BLOG_HERO_LOGO_URL}
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
      <Modal
        transition={{
          type: "spring",
          damping: 20, // 减少阻尼，让弹跳效果更强
          stiffness: 300, // 增加刚度，让弹跳更迅速
        }}
        isShowModal={isRightMenuOpen}
        direction="right"
      >
        <LeftModalDom
          menuItems={items}
          current={current}
          isDarkMode={isDarkMode}
          onNavigate={handleNavigate}
          onToggleTheme={handleToggleTheme}
        ></LeftModalDom>
      </Modal>
      <Modal
        transition={{
          type: "tween",
          ease: "easeInOut", // 可选 "easeIn", "easeOut", "easeInOut", "linear"
          duration: 0.5,
        }}
        isShowModal={isLeftMenuOpen}
        direction="left"
        style={{ width: "50%" }}
      >
        left
      </Modal>
    </>
  );
};

export default IndexLayout;