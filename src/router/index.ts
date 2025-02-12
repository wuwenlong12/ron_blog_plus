import { RouteObject } from "react-router-dom";
import { componentKey } from "./utils/routerMap";
import { iconKey } from "./utils/iconMap";

export const StaticRoutesMap: RouteObject[] = [
  {
    path: "/",
    element: componentKey.Layout, // 用字符串表示组件
    handle: {
      key: "Home",
      label: "主页",
      Icon: iconKey.FaHome, // 用字符串表示图标
      requiresAuth: false,
    },
    children: [
      {
        index: true,
        element: componentKey.Home, // 用字符串表示组件
        handle: {
          key: "Home",
          label: "主页",
          Icon: iconKey.FaHome, // 用字符串表示图标
          requiresAuth: false,
        },
      },
      {
        path: "diary",
        element: componentKey.Diary, // 用字符串表示组件
        handle: {
          key: "Diary",
          label: "日记",
          Icon: iconKey.FaSun, // 用字符串表示图标
          requiresAuth: false,
        },
      },
      {
        path: "article",
        element: componentKey.Article, // 用字符串表示组件
        children: [
          {
            path: ":id",
            element: componentKey.ArticleMainContent, // 用字符串表示组件
            handle: {
              key: "article",
              label: "知识库",
              Icon: iconKey.FaHome, // 用字符串表示图标
              requiresAuth: false,
            },
          },
        ],
        handle: {
          key: "article",
          label: "文章",
          Icon: iconKey.MdArticle, // 用字符串表示图标
          requiresAuth: false,
        },
      },
      {
        path: "about",
        element: componentKey.About, // 用字符串表示组件
        handle: {
          key: "About",
          label: "关于",
          Icon: iconKey.FaMeteor, // 用字符串表示图标
          requiresAuth: false,
        },
      },
    ],
  },
  {
    path: "login",
    element: componentKey.Login, // 用字符串表示组件
    handle: {
      key: "Login",
      label: "登陆",
      Icon: iconKey.FaMeteor, // 用字符串表示图标
      requiresAuth: false,
    },
  },

  {
    path: "admin/*", // 需要使用 * 处理子路由
    element: componentKey.Admin, // 默认渲染的 admin 页面组件
    handle: {
      key: "Admin",
      label: "管理",
      Icon: iconKey.FaMeteor,
      requiresAuth: true,
    },
    children: [], // 动态加载后会被填充
  },
  {
    path: "*",
    element: componentKey.NotFound, // 用字符串表示组件
    handle: {
      key: "404",
      label: "404",
      Icon: iconKey.FaMeteor, // 用字符串表示图标
      requiresAuth: false,
    },
  },
];

export const DynamicRoutes: RouteObject[] = [
  {
    index: true,
    path: "dashboard",
    element: componentKey.Dashboard,
    handle: {
      key: "dashboard",
      label: "仪表盘",
      Icon: iconKey.RiDashboard3Line,
      requiresAuth: true,
    },
  },
  {
    path: "visit-stats",
    element: componentKey.VisitStats,
    handle: {
      key: "visit-stats",
      label: "访问统计",
      Icon: iconKey.FiActivity,
      requiresAuth: true,
    },
  },
  {
    path: "setting",
    element: componentKey.SettingManager,
    handle: {
      key: "setting",
      label: "全局设置",
      Icon: iconKey.BsInfoCircle,
      requiresAuth: true,
    },
  },
  {
    path: "carousel",
    element: componentKey.CarouselManager,
    handle: {
      key: "Carousel",
      label: "主页轮播",
      Icon: iconKey.MdOutlineSatelliteAlt,
      requiresAuth: true,
    },
  },

  {
    path: "product",
    element: componentKey.ProductManager,
    handle: {
      key: "Product",
      label: "产品管理",
      Icon: iconKey.TbBrandProducthunt,
      requiresAuth: true,
    },
  },
  {
    path: "about",
    element: componentKey.AboutManager,
    handle: {
      key: "about",
      label: "关于",
      Icon: iconKey.IoLogoPolymer,
      requiresAuth: true,
    },
  },
];

export const StaticMainSiteRoutesMap: RouteObject[] = [
  {
    path: "/",
    element: componentKey.Greet, // 用字符串表示组件
    handle: {
      key: "greet",
      label: "greet",
      Icon: iconKey.FaMeteor, // 用字符串表示图标
      requiresAuth: false,
    },
  },
  {
    path: "login",
    element: componentKey.Login, // 用字符串表示组件
    handle: {
      key: "Login",
      label: "登陆",
      Icon: iconKey.FaMeteor, // 用字符串表示图标
      requiresAuth: false,
    },
  },
  {
    path: "init",
    element: componentKey.Init, // 用字符串表示组件
    handle: {
      key: "Init",
      label: "初始化",
      Icon: iconKey.FaMeteor, // 用字符串表示图标
      requiresAuth: false,
    },
  },

  {
    path: "admin/*", // 需要使用 * 处理子路由
    element: componentKey.Admin, // 默认渲染的 admin 页面组件
    handle: {
      key: "Admin",
      label: "管理",
      Icon: iconKey.FaMeteor,
      requiresAuth: true,
    },
    children: [], // 动态加载后会被填充
  },
  {
    path: "*",
    element: componentKey.NotFound, // 用字符串表示组件
    handle: {
      key: "404",
      label: "404",
      Icon: iconKey.FaMeteor, // 用字符串表示图标
      requiresAuth: false,
    },
  },
];
