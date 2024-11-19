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

  // 根据路径查找对应的路由信息
  const breadcrumbItems = location.pathname.split('/').filter(Boolean).map((path, index, arr) => {
    const fullPath = `/${arr.slice(0, index + 1).join('/')}`;
    const route = routes.find(route => route.path === fullPath);

    if (route) {
      return {
        key: fullPath,
        title: (
          <Link to={fullPath} className={styles.breadcrumbLink}>
            {route.meta?.icon && <span style={{ marginRight: 8 }}>{route.meta.icon}</span>}
            {route.meta?.label}
          </Link>
        ),
        className: `${styles.breadcrumbItem} ${isDarkMode ? styles.dark : styles.light}`,
      };
    }
    return null;
  }).filter((item): item is NonNullable<typeof item> => item !== null); // 使用类型保护确保不包含 null

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
