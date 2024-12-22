import React, { useState, useEffect } from "react";
import { Breadcrumb } from "antd";
import { Link, useMatches } from "react-router-dom";
import styles from "./Breadcrumb.module.scss"; // 导入 SCSS 模块
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { UIMatch } from "react-router-dom";

interface CustomHandle {
  label?: string; // 定义 handle.label
}

type CustomRouteMatch = UIMatch<string, CustomHandle>;
interface AppBreadcrumbProps {
  isDarkMode: boolean; // 是否使用深色模式
}

const AppBreadcrumb: React.FC<AppBreadcrumbProps> = ({ isDarkMode }) => {
  const matches = useMatches() as CustomRouteMatch[];
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItemType[]>(
    []
  );

  // 当路由匹配项变化时更新 breadcrumb
  useEffect(() => {
    updateBreadcrumb();
  }, []);

  const updateBreadcrumb = () => {
    const items = matches
      .filter((item) => item.handle?.label) // 仅对定义了 handle.label 的路由生成面包屑
      .map((item) => ({
        // key: item.id, // 唯一标识
        title: (
          <Link to={item.pathname || ""} className={`${styles.breadcrumbLink}`}>
            {item.handle?.label}
          </Link>
        ), // 显示面包屑文字，并添加链接
      }));
    setBreadcrumbItems(items);
  };

  return (
    <Breadcrumb
      items={breadcrumbItems}
      className={`${styles.breadcrumbContainer}`} // 根据模式动态设置样式
    />
  );
};

export default AppBreadcrumb;
