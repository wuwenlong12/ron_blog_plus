import React from "react";
import { Button, Menu, MenuProps } from "antd";
import {
  CloseOutlined,
  CompassOutlined,
  GithubOutlined,
  MenuOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import styles from "./Header.module.scss";
import LeftModalDom from "../LeftModalDom/LeftModalDom";
import Modal from "../Modal/Modal";
import RightModalDom from "../RightModalDom/RightModalDom";

type MenuItem = Required<MenuProps>["items"][number];

interface HeaderProps {
  logoUrl: string;
  siteName: string;
  menuItems: MenuItem[];
  isDarkMode: boolean;
  isLeftMenuOpen: boolean;
  isRightMenuOpen: boolean;
  current: string; // 父组件传入的当前选中菜单项
  onToggleTheme: () => void;
  onNavigate: (key: string) => void;
  onClickLeftMenu: () => void;
  onClickRightMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({
  logoUrl,
  siteName,
  menuItems,
  isDarkMode,
  isLeftMenuOpen,
  isRightMenuOpen,
  current,
  onToggleTheme,
  onNavigate,
  onClickLeftMenu,
  onClickRightMenu,
}) => {
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    onNavigate(e.key); // 调用父组件传入的 onNavigate
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerLeft}>
        <Button
          type="text"
          className={isDarkMode ? styles.BtnDark : styles.BtnLight}
          onClick={onClickLeftMenu}
          icon={
            isLeftMenuOpen ? (
              <CloseOutlined className="close-icon" />
            ) : (
              <MenuOutlined className="menu-icon" />
            )
          }
        />
        <img className={styles.navLogo} src={logoUrl} alt="Logo" />
        <div className={styles.siteName}>{siteName}</div>
      </div>
      <Menu
        style={{ background: "transparent", border: "none" }}
        className={styles.menu}
        onClick={handleMenuClick}
        selectedKeys={[current]} // 使用父组件传入的 current
        mode="horizontal"
        items={menuItems}
      />
      <div className={styles.containerRight}>
        <Button
          type="text"
          className={isDarkMode ? styles.BtnDark : styles.BtnLight}
          icon={<GithubOutlined style={{ fontSize: "20px" }} />}
        />
        <Button
          type="text"
          className={isDarkMode ? styles.BtnDark : styles.BtnLight}
          onClick={onClickRightMenu}
          icon={
            isRightMenuOpen ? (
              <CloseOutlined />
            ) : (
              <CompassOutlined style={{ fontSize: "20px" }} />
            )
          }
        />
        <Button
          type="text"
          className={`${isDarkMode ? styles.BtnDark : styles.BtnLight} ${
            styles.isDarkBtn
          }`}
          onClick={onToggleTheme}
          icon={
            isDarkMode ? (
              <MoonOutlined style={{ fontSize: "20px" }} />
            ) : (
              <SunOutlined style={{ fontSize: "20px" }} />
            )
          }
        />
      </div>
      <Modal
        transition={{
          type: "spring",
          damping: 20, // 减少阻尼，让弹跳效果更强
          stiffness: 300, // 增加刚度，让弹跳更迅速
        }}
        isShowModal={isRightMenuOpen}
        direction="top"
        style={{ width: "100vw" }}
      >
        <RightModalDom
          menuItems={menuItems}
          current={current}
          isDarkMode={isDarkMode}
          onNavigate={onNavigate}
          onToggleTheme={onToggleTheme}
        ></RightModalDom>
      </Modal>
      <Modal
        transition={{
          type: "tween",
          ease: "easeInOut", // 可选 "easeIn", "easeOut", "easeInOut", "linear"
          duration: 0.5,
        }}
        isShowModal={isLeftMenuOpen}
        direction="left"
        style={{ width: "50vw", height: "100vh" }}
      >
        <LeftModalDom></LeftModalDom>
      </Modal>
    </div>
  );
};

export default Header;
