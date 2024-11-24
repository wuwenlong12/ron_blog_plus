import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Header from "../components/Header/Header";
import routes, { staticRoutes } from "../router";
import { MenuProps } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import useTheme from "../hook/useTheme";
import { setting } from "../setting";
import Modal from "../components/Modal/Modal";
import LeftModalDom from "../components/RightModalDom/RightModalDom";
import { getActicalDirectory } from "../api/actical/actical";
import { generateRoutes } from "../router/generaterRoutes";
import { useDispatch, useSelector } from "react-redux";
import { setDynamicRoutes, updateArticalChildren } from "../store/routesSlice";
import AppRouter from "../router/AppRouter";
import { RootState } from "../store";
import { IconKey, iconMap } from "../router/utils";

// 递归渲染路由
const renderRoutes = (routes: any[]) => {
  return routes.map((route, index) => (
    <Route key={index} path={route.path} element={route.element}>
      {route.children && renderRoutes(route.children)} {/* 递归渲染子路由 */}
    </Route>
  ));
};

const IndexLayout = () => {
  const { isDarkMode, handleToggleTheme } = useTheme();
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [current, setCurrent] = useState("main");
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const staticRoutes = useSelector(
    (state: RootState) => state.routes.staticRoutes
  );
  const items: MenuProps["items"] = staticRoutes.map((item) => {
    const iconKey = item.meta.icon && IconKey[item.meta.icon] ? item.meta.icon : IconKey.NotFound;
    return {
      label:item.meta.label,
      key:item.meta.key,
      icon: iconMap[iconKey], // 映射为图标组件
    };
  });

  useEffect(() => {
    // console.log("当前的路由结构:", staticRoutes);
  }, [staticRoutes]);
  useEffect(() => {
    const loadDynamicRoutes = async () => {
      try {
        const res = await getActicalDirectory(); // 获取动态路由数据
        const backendData = res.data;

        // 生成动态子路由
        const articalChildren = generateRoutes(backendData);

        // 更新 `/artical` 的 `children`
        dispatch(updateArticalChildren(articalChildren));
      } catch (error) {
        console.error("加载动态路由失败:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDynamicRoutes();
  }, []);
  const handleNavigate = (key: string) => {
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
      <AppRouter></AppRouter>
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
