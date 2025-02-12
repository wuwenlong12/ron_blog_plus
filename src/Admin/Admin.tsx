import React, { useEffect, useState } from "react";
import { Layout, Menu, Badge, MenuProps, Button } from "antd";
import { motion } from "framer-motion";
import {
  DashboardOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import styles from "./styles/Admin.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { checkLoginStatus } from "../store/authSlice";
import { Outlet, useNavigate } from "react-router-dom";
import { loadAdminRoutes } from "../store/routersMapSlice";
import { iconMap } from "../router/utils/iconMap";
import { MenuItemType } from "antd/es/menu/interface";
import { logout as clearUser } from "../store/authSlice";
import { logout } from "../api/auth";
type MenuItem = Required<MenuProps>["items"][number];
const { Header, Sider, Content } = Layout;

const Admin: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  // const [isShowCreateSizemodal, SetIsShowCreateSizemodal] = useState(false);
  const navigator = useNavigate();
  const { adminRoutesMap } = useSelector((state: RootState) => state.routesMap);
  const { user, isAuthenticated, status } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(checkLoginStatus);
    const savedSelectedKey = localStorage.getItem("selectedMenuKey");
    if (savedSelectedKey) {
      setSelectedKey(savedSelectedKey);
    }
  }, []);

  useEffect(() => {
    if (status !== "succeeded") return;
    if (isAuthenticated) {
      if (!user.role || !user.managedSites) {
        navigator("/init");
        return;
      }
      dispatch(loadAdminRoutes(user.role, user.role.permissions));
    } else {
      navigator("/login");
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

  const menuClickHandler = ({ key }) => {
    // const savedSelectedKey = localStorage.getItem("selectedMenuKey");
    setSelectedKey(key);
    localStorage.setItem("selectedMenuKey", key);
    navigator("/admin/" + key);
  };

  const handleLogout = async () => {
    try {
      const res = await logout();
      if (res.code === 0) {
        dispatch(clearUser());
        navigate("/login");
      }
    } catch (error) {
      console.error("登出失败:", error);
    }
  };

  return (
    <Layout className={styles.adminLayout}>
      <Header className={styles.header}>
        <div className={styles.headerLeft}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: styles.trigger,
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div className={styles.pageInfo}>
            <h2 className={styles.pageTitle}>
              {menuItems.find((item) => item.key === selectedKey)?.label}
            </h2>
            <span className={styles.breadcrumb}>
              首页 / {menuItems.find((item) => item.key === selectedKey)?.label}
            </span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <Badge count={3} className={styles.notification}>
            <BellOutlined className={styles.icon} />
          </Badge>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className={styles.logoutBtn}
          >
            退出登录
          </Button>
          {/* <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                <Avatar icon={<UserOutlined />} />
                <span className={styles.userStatus} />
              </div>
              <div className={styles.userMeta}>
                <span className={styles.userName}>Admin User</span>
                <span className={styles.userRole}>超级管理员</span>
              </div>
            </div>
          </Dropdown> */}
        </div>
      </Header>

      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          trigger={null}
          className={styles.sider}
          width={260}
        >
          <div className={styles.logo}>
            <span className={styles.logoText}>ADMIN</span>
            {!collapsed && <span className={styles.logoVersion}>v2.0</span>}
          </div>
          <Menu
            theme="light"
            selectedKeys={[selectedKey]}
            mode="inline"
            className={styles.menu}
            onClick={menuClickHandler}
            items={menuItems}
          />
        </Sider>

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
      </Layout>
    </Layout>
  );
};

export default Admin;
