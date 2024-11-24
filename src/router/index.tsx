import Home from '../pages/Home/Home';
import Diary from '../pages/Diary/Diary';
import { MailOutlined, SettingOutlined } from '@ant-design/icons';
import Actical from '../pages/Actical/Actical';
import About from '../pages/About/About';
import EditArticleInfo from '../pages/EditArticleInfo/EditArticleInfo'; // 引入编辑组件
import EditFolderInfo from '../pages/EditFolderInfo/EditFolderInfo'; // 引入编辑组件
import { generateRoutes } from './generaterRoutes';
import { getActicalDirectory } from '../api/actical/actical';
import { Route } from './type';
import { ComponentKey, IconKey } from './utils';


export const staticRoutes:Route[] = [
  {
    path: "/", 
    element: ComponentKey.Home,
    meta: {
      label: 'Ron', 
      key: 'main', 
      icon: IconKey.MailOutlined,
    },
  },
  {
    path: "/diary", 
    element:ComponentKey.Diary,
    meta: {
      label: '日记', 
      key: 'diary', 
      icon: IconKey.MailOutlined,
    },
  },
  {
    path: "/artical",
    element: ComponentKey.Actical,
    meta: {
      label: '文章', 
      key: 'artical', 
      icon: IconKey.MailOutlined,
    },
    children: [],  //后端返回异步路由
  },
  {
    path: "/about",
    element: ComponentKey.About,
    meta: {
      label: '关于我',
      key: 'about',
      icon: IconKey.MailOutlined,
    },
  },
];

// 动态生成路由
export const buildRoutes = async (): Promise<Route[]> => {
  const res = await getActicalDirectory();
  const backendRoutes = res.data
  const dynamicRoutes = generateRoutes(backendRoutes);

  // 将动态路由注入到 `/artical` 的 `children` 中 
  const routes = staticRoutes.map((route) => {
    if (route.path === '/artical') {
      return { ...route, children: dynamicRoutes };
    }
    return route;
  });

  return routes;
};
export default buildRoutes;
