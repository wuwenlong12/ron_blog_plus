import About from "../../pages/About/About";
import Actical from "../../pages/Actical/Actical";
import Diary from "../../pages/Diary/Diary";
import EditArticleInfo from "../../pages/EditArticleInfo/EditArticleInfo";
import EditFolderInfo from "../../pages/EditFolderInfo/EditFolderInfo";
import Home from "../../pages/Home/Home";
import {
  HomeOutlined,
  ReadOutlined,
  FolderOutlined,
  MailOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

export enum ComponentKey {
  Actical = "Actical",
  Home = "Home",
  About = "About",
  Diary = "Diary",
  EditArticleInfo = "EditArticleInfo",
  EditFolderInfo = "EditFolderInfo",
}

export enum IconKey {
  MailOutlined = "MailOutlined",
  SettingOutlined = "SettingOutlined",
  NotFound = "NotFound"
}

export const componentMap: Record<ComponentKey, React.ReactElement> = {
  [ComponentKey.Actical]: <Actical />,
  [ComponentKey.Home]: <Home />,
  [ComponentKey.About]: <About />,
  [ComponentKey.Diary]: <Diary />,
  [ComponentKey.EditArticleInfo]: <EditArticleInfo />,
  [ComponentKey.EditFolderInfo]: <EditFolderInfo />,
};
export const iconMap: Record<string, React.ReactNode> = {
  //   MailOutlined: <HomeOutlined />,
  //   ReadOutlined: <ReadOutlined />,
  //   FolderOutlined: <FolderOutlined />,
  MailOutlined: <MailOutlined />,
  SettingOutlined: <SettingOutlined />,
  NotFound:<ExclamationCircleOutlined/>
};


// 递归查找路径并拼接父路径的函数
export const findFullPathByKey = (routes: any[], key: string, parentPath: string = ''): string | null => {
  for (const route of routes) {
    // 确保路径拼接时使用 /，避免重复或遗漏 /
    let currentPath = route.path;

    // 如果 parentPath 有值，确保拼接时不会重复的 /
    if (parentPath) {
      // 如果当前路由的 path 以 / 开头，就直接拼接；否则加上 /
      currentPath = route.path.startsWith('/') ? `${parentPath}${route.path}` : `${parentPath}/${route.path}`;
    }

    // 如果找到匹配的 key，返回完整的路径
    if (route.meta.key === key) {
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
  return null; // 如果没有找到，返回 null
};

