import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, theme, Avatar, Tooltip } from "antd";
import { motion } from "framer-motion";
import {
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styles from "./styles/Admin.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { checkLoginStatus, logoutHandle } from "../store/authSlice";
import { Outlet, useNavigate } from "react-router-dom";
import { loadAdminRoutes } from "../store/routersMapSlice";
import { iconMap } from "../router/utils/iconMap";
import { MenuItemType } from "antd/es/menu/interface";
import { toggleTheme } from "../store/themeSlice";

const { Content } = Layout;

const Admin: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const navigate = useNavigate();
  const { adminRoutesMap } = useSelector((state: RootState) => state.routesMap);
  const { user, isAuthenticated, status, siteIsInit } = useSelector(
    (state: RootState) => state.auth
  );
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const { token } = theme.useToken();

  useEffect(() => {
    dispatch(checkLoginStatus);
    if (localStorage.getItem("isDarkMode") === "true") {
      dispatch(toggleTheme());
    }
    const savedSelectedKey = localStorage.getItem("selectedMenuKey");
    if (savedSelectedKey) {
      setSelectedKey(savedSelectedKey);
    }
  }, []);

  useEffect(() => {
    if (status !== "succeeded") return;
    if (isAuthenticated) {
      if (!user.role || !user.managedSites || !siteIsInit) {
        navigate("/init");
        return;
      }
      dispatch(loadAdminRoutes(user.role, user.role.permissions));
    } else {
      navigate("/login");
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    console.log(adminRoutesMap);
    const menu: MenuItemType[] = adminRoutesMap.map((item) => {
      if (!item.handle.key || !item.handle.label) return null; // 确保 key 和 label 存在
      return {
        key: item.handle.key,
        icon: iconMap[item.handle.Icon] || <DashboardOutlined />,
        label: item.handle.label || "未命名",
      };
    });
    setMenuItems(menu);
  }, [adminRoutesMap]);

  const handleLogout = async () => {
    try {
      dispatch(logoutHandle());
      navigate("/login");
    } catch (error) {
      console.error("登出失败:", error);
    }
  };

  const renderMobileNav = () => {
    return (
      <div className={styles.mobileNav}>
        <div className={styles.navContent}>
          {menuItems.map((item: any) => (
            <div
              key={item.key}
              className={`${styles.navItem} ${
                selectedKey === item.key ? styles.active : ""
              }`}
              onClick={() => {
                setSelectedKey(item.key);
                localStorage.setItem("selectedMenuKey", item.key);
                if (item.key === "dashboard") {
                  navigate("/admin");
                } else {
                  navigate("/admin/" + item.key);
                }
              }}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout className={styles.layout}>
      <div className={`${styles.sider} ${collapsed ? styles.collapsed : ""}`}>
        <div className={styles.siderTop}>
          <div className={styles.logo}>
            <span className={styles.logoText}>KUBEO</span>
            {!collapsed && <span className={styles.logoVersion}>1.0</span>}
          </div>
          <div className={styles.userInfo}>
            <Avatar
              src={user?.imgurl}
              icon={<UserOutlined />}
              className={styles.avatar}
            />
            {!collapsed && (
              <div className={styles.userMeta}>
                <span className={styles.userName}>{user?.username}</span>
                <span className={styles.userRole}>管理员</span>
              </div>
            )}
          </div>
        </div>

        <Menu
          theme="light"
          selectedKeys={[selectedKey]}
          mode="inline"
          className={styles.menu}
          onClick={({ key }) => {
            setSelectedKey(key);
            localStorage.setItem("selectedMenuKey", key);
            if (key === "dashboard") {
              navigate("/admin");
            } else {
              navigate("/admin/" + key);
            }
          }}
          items={menuItems}
          inlineCollapsed={collapsed}
        />

        <div className={styles.siderBottom}>
          <Tooltip
            title={collapsed ? "展开菜单" : "收起菜单"}
            placement="right"
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className={styles.collapseBtn}
            />
          </Tooltip>
          <Tooltip title="退出登录" placement="right">
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className={styles.logoutBtn}
            />
          </Tooltip>
        </div>
      </div>

      <div
        className={`${styles.mainContent} ${collapsed ? styles.expanded : ""}`}
      >
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            {menuItems.find((item) => item.key === selectedKey)?.label}
          </h1>
          <div className={styles.breadcrumb}>
            首页 / {menuItems.find((item) => item.key === selectedKey)?.label}
          </div>
        </div>

        <Content className={styles.content}>
          <motion.div
            key={selectedKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={styles.contentInner}
          >
            <Outlet />
          </motion.div>
        </Content>
      </div>

      {renderMobileNav()}
    </Layout>
  );
};

export default Admin;
