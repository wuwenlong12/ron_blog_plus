import About from "../../pages/About/About";
import Actical from "../../pages/Article/Article";
import Diary from "../../pages/Diary/Diary";
import ArticleMainContent from "../../pages/ArticleMainContent/ArticleMainContent";
import Home from "../../pages/Home/Home";
import {
  HomeOutlined,
  ReadOutlined,
  FolderOutlined,
  MailOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import React from "react";
import { RouteObject } from "react-router-dom";


// 递归查找路径并拼接父路径的函数
export const findFullPathByKey = (routes: RouteObject[], key: string, parentPath: string = ''): string | undefined => {
  for (const route of routes) {
    // 确保路径拼接时使用 /，避免重复或遗漏 /
    let currentPath = route.path;

    // 如果 parentPath 有值，确保拼接时不会重复的 /
    if (parentPath) {
      // 如果当前路由的 path 以 / 开头，就直接拼接；否则加上 /
      currentPath = route.path?.startsWith('/') ? `${parentPath}${route.path}` : `${parentPath}/${route.path}`;
    }

    // 如果找到匹配的 key，返回完整的路径
    if (route.handle.key === key) {
      return currentPath; // 返回拼接后的完整路径
    }

    // 如果有子路由，递归查找
    if (route.children && route.children.length > 0) {
      const childPath = findFullPathByKey(route.children, key, currentPath);
      if (childPath) {
        return childPath; // 如果在子路由中找到，返回完整路径
      }
    }
  }
  return undefined; // 如果没有找到，返回 null
};

