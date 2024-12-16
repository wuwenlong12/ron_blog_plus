import { RouteObject } from "react-router-dom";
import { componentKey } from "./utils/routerMap";
import { iconKey } from "./utils/iconMap";

export const StaticRoutesMap: RouteObject[] = [
  {
    path: "/",
    element: componentKey.Layout, // 用字符串表示组件
    children: [
      {
        index: true,
        element: componentKey.Home, // 用字符串表示组件
        handle: {
          key: "Home",
          label: "主页",
          Icon: iconKey.HomeOutlined, // 用字符串表示图标
          requiresAuth: false,
        },
      },
      {
        path: "diary",
        element: componentKey.Diary, // 用字符串表示组件
        handle: {
          key: "Diary",
          label: "日记",
          Icon: iconKey.HomeOutlined, // 用字符串表示图标
          requiresAuth: false,
        },
      },
      {
        path: "article",
        element: "Article", // 用字符串表示组件
        children: [
          {
            path: "",
            element: componentKey.ArticleMainContent, // 用字符串表示组件
            handle: {
              key: "MainPage",
              label: "主页",
              Icon: iconKey.HomeOutlined, // 用字符串表示图标
              requiresAuth: false,
            },
          },
        ],
        handle: {
          key: "Article",
          label: "文章",
          Icon: iconKey.HomeOutlined, // 用字符串表示图标
          requiresAuth: false,
        },
      },
      {
        path: "about",
        element: componentKey.About, // 用字符串表示组件
        handle: {
          key: "About",
          label: "关于",
          Icon: iconKey.HomeOutlined, // 用字符串表示图标
          requiresAuth: false,
        },
      },
    ],
  },
];
