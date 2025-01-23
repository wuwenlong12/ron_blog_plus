import React, { useState } from "react";
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Progress,
  Badge,
  Avatar,
  Dropdown,
} from "antd";
import { motion } from "framer-motion";
import {
  UserOutlined,
  DashboardOutlined,
  PictureOutlined,
  ShoppingOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import ProfileForm from "./pages/ProfileForm";
import CarouselManager from "./pages/CarouselManager";
import ProductManager from "./pages/ProductManager";
import Dashboard from "./pages/Dashboard";
import styles from "./styles/Admin.module.scss";

const { Header, Sider, Content } = Layout;

const Admin: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "仪表盘",
      component: <Dashboard />,
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人信息",
      component: <ProfileForm />,
    },
    {
      key: "carousel",
      icon: <PictureOutlined />,
      label: "主页轮播",
      component: <CarouselManager />,
    },
    {
      key: "products",
      icon: <ShoppingOutlined />,
      label: "产品列表",
      component: <ProductManager />,
    },
  ];

  const userMenuItems = [
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "设置",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
    },
  ];

  const getCurrentComponent = () => {
    return menuItems.find((item) => item.key === selectedKey)?.component;
  };

  return (
    <Layout className={styles.layout}>
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
          onClick={({ key }) => setSelectedKey(key)}
          items={menuItems}
        />
      </Sider>

      <Layout>
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
                首页 /{" "}
                {menuItems.find((item) => item.key === selectedKey)?.label}
              </span>
            </div>
          </div>
          <div className={styles.headerRight}>
            <Badge count={3} className={styles.notification}>
              <BellOutlined className={styles.icon} />
            </Badge>
            <Dropdown
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
            </Dropdown>
          </div>
        </Header>

        <Content className={styles.content}>
          <motion.div
            key={selectedKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={styles.contentInner}
          >
            {getCurrentComponent()}
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admin;
