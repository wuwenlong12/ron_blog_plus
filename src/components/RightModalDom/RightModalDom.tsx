import React from "react";
import styles from "./RightModalDom.module.scss";
import { Button, Menu, MenuProps } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
type MenuItem = Required<MenuProps>["items"][number];
interface RightModalDomProps {
  menuItems?: MenuItem[];
  current: string; // 父组件传入的当前选中菜单项
  isDarkMode: boolean;
  onNavigate: (key: string) => void;
  onToggleTheme: () => void;
}

const RightModalDom: React.FC<RightModalDomProps> = ({
  menuItems,
  current,
  isDarkMode,
  onNavigate,
  onToggleTheme,
}) => {
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    onNavigate(e.key); // 调用父组件传入的 onNavigate
  };

  return (
    <div
      className={styles.container}
      style={
        isDarkMode
          ? { backgroundColor: "#141414" }
          : { backgroundColor: "#ffffff" }
      }
    >
      <Menu
        style={{ background: "transparent", border: "none", textAlign: "left" }}
        className={styles.menu}
        onClick={handleMenuClick}
        selectedKeys={[current]} // 使用父组件传入的 current
        mode="vertical"
        items={menuItems}
      />
      <div className={styles.theme}>
        <div className={styles.text}>外观</div>
        <Button
          type="text"
          className={`${isDarkMode ? styles.BtnDark : styles.BtnLight} ${
            styles.isDarkBtn
          }`}
          onClick={onToggleTheme}
          icon={
            isDarkMode ? (
              <MoonOutlined style={{ fontSize: "1rem" }} />
            ) : (
              <SunOutlined style={{ fontSize: "1rem" }} />
            )
          }
        />
      </div>
    </div>
  );
};

export default RightModalDom;
