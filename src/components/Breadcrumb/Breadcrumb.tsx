import React from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import routes from '../../router/index';  // 引入路由配置文件
import styles from './Breadcrumb.module.scss';  // 导入 SCSS 模块

interface AppBreadcrumbProps {
  isDarkMode: boolean;  // 新增的 isDarkMode 参数
}

const AppBreadcrumb: React.FC<AppBreadcrumbProps> = ({ isDarkMode }) => {
  const location = useLocation();
  const locations = location.pathname.split("/").slice(1)
  const breadcrumbItems = locations.map((item, index) => {
    const fullPath = `/${locations.slice(0, index + 1).join('/')}`; // 动态拼接完整路径
    return {
      key: fullPath,
      title: <Link to={fullPath} className={styles.breadcrumbLink}>{item}</Link>,
      className: `${styles.breadcrumbItem} ${isDarkMode ? styles.dark : styles.light}`,
    };
  });



  
  // 设置首页的面包屑项
  const items = [
    {
      key: 'home',
      title: <Link to="/" className={styles.breadcrumbLink}>首页</Link>,
      className: `${styles.breadcrumbItem} ${isDarkMode ? styles.dark : styles.light}`,
    },
    ...breadcrumbItems
  ];

  return (
    <Breadcrumb items={items} className={`${styles.breadcrumbContainer} ${isDarkMode ? styles.dark : styles.light}`} />
  );
};

export default AppBreadcrumb;
