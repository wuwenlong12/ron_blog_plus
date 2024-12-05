import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import styles from './Breadcrumb.module.scss';  // 导入 SCSS 模块
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface AppBreadcrumbProps {
  isDarkMode: boolean;  // 新增的 isDarkMode 参数
}

const AppBreadcrumb = forwardRef((props: AppBreadcrumbProps, ref) => {
  const { isDarkMode } = props;
  const location = useLocation();
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItemType[]>([]);
  const articleRoutesMap = useSelector((state: RootState) => state.articleRoutes.articleRoutesMap);
  // 父组件通过 ref 调用该方法
  useImperativeHandle(ref, () => ({
    updateInfo,
  }));

  // 更新 breadcrumb 信息
  function updateInfo() {
    const locations = location.pathname.split("/").slice(1);
    const breadcrumbItems = [{
      key: 'home',
      title: <Link to="/" className={styles.breadcrumbLink}>首页</Link>,
      className: `${styles.breadcrumbItem} ${isDarkMode ? styles.dark : styles.light}`,
    }, ...locations.map((item, index) => {
      const fullPath = `/${locations.slice(0, index + 1).join('/')}`; // 动态拼接完整路径
      return {
        key: fullPath,
        title: <Link to={fullPath} className={styles.breadcrumbLink}>{decodeURIComponent(item)}</Link>,
        className: `${styles.breadcrumbItem} ${isDarkMode ? styles.dark : styles.light}`,
      };
    })];
    setBreadcrumbItems(breadcrumbItems);
  }

  // 页面路径变化时更新 breadcrumb
  useEffect(() => {
    updateInfo();
  }, []);

  return (
    <Breadcrumb  items={breadcrumbItems} className={styles.breadcrumbContainer} />
  );
});

export default AppBreadcrumb;
