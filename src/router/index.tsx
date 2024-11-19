import Home from '../pages/Main/Main';
import Diary from '../pages/Diary/Diary';
import { MailOutlined, SettingOutlined } from '@ant-design/icons';
import Actical from '../pages/Actical/Actical';
import About from '../pages/About/About';
import EditArticleInfo from '../pages/EditArticleInfo/EditArticleInfo'; // 引入编辑组件
import EditFolderInfo from '../pages/EditFolderInfo/EditFolderInfo'; // 引入编辑组件

export const routes = [
  {
    path: "/", 
    element: <Home />,
    meta: {
      label: 'Ron', 
      key: 'main', 
      icon: <MailOutlined />,
    },
  },
  {
    path: "/diary", 
    element: <Diary />,
    meta: {
      label: '日记', 
      key: 'diary', 
      icon: <MailOutlined />,
    },
  },
  {
    path: "/artical",
    element: <Actical />,
    meta: {
      label: '文章', 
      key: 'artical', 
      icon: <SettingOutlined />,
    },
    children: [
      {
        path: "info", // 子路由不需要 /artical 前缀
        element: <EditFolderInfo />,
        meta: {
          label: '编辑文件夹',
          key: 'artical-info',
        },
      },
      {
        path: "edit", // 子路由路径相对于父路由 /artical
        element: <EditArticleInfo />,
        meta: {
          label: '编辑文章',
          key: 'artical-edit',
        },
      },
    ],
  },
  {
    path: "/about",
    element: <About />,
    meta: {
      label: '关于我',
      key: 'about',
      icon: <SettingOutlined />,
    },
  },
];

export default routes;
