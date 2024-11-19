import React from 'react';
import { Button, Menu, MenuProps } from 'antd';
import {
  CloseOutlined, CompassOutlined, GithubOutlined, MenuOutlined,
  MoonOutlined, SunOutlined
} from '@ant-design/icons';
import styles from './Header.module.scss';

type MenuItem = Required<MenuProps>['items'][number];

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
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    onNavigate(e.key); // 调用父组件传入的 onNavigate
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerLeft}>
        <Button
          type="text"
          className={isDarkMode ? styles.BtnDark : styles.BtnLight}
          onClick={onClickLeftMenu}
          icon={isLeftMenuOpen ? <CloseOutlined className="close-icon" /> : <MenuOutlined className="menu-icon" />}
        />
        <img className={styles.navLogo} src={logoUrl} alt="Logo" />
        <div className={styles.siteName}>{siteName}</div>
      </div>
      <Menu
        style={{ background: 'transparent', border: 'none' }}
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
          icon={<GithubOutlined style={{ fontSize: '20px' }} />}
        />
        <Button
          type="text"
          className={isDarkMode ? styles.BtnDark : styles.BtnLight}
          onClick={onClickRightMenu}
          icon={isRightMenuOpen ? <CloseOutlined /> : <CompassOutlined style={{ fontSize: '20px' }} />}
        />
        <Button
          type="text"
          className={`${isDarkMode ? styles.BtnDark : styles.BtnLight} ${styles.isDarkBtn}`}
          onClick={onToggleTheme}
          icon={isDarkMode ? <MoonOutlined style={{ fontSize: '20px' }} /> : <SunOutlined style={{ fontSize: '20px' }} />}
        />
      </div>
    </div>
  );
};

export default Header;
