import React, { useEffect, useState } from "react";
import styles from "./Article.module.scss";
import useTheme from "../../hook/useTheme";
import { Menu, MenuProps, Button, Input } from "antd";
import {
  RightOutlined,
  LeftOutlined,
  FolderAddOutlined,
  FolderOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { Outlet, RouteObject, useLoaderData, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectActicalChildren } from "../../store/routesSlice";
import { Route } from "../../router/type";
import { findFullPathByKey } from "../../router/utils";
import { RootState } from "../../store";

type MenuItem = Required<MenuProps>["items"][number];

const Actical = ({}) => {
  const { isDarkMode } = useTheme();
  const [directory, setDirectory] = useState<MenuItem[] | null>([]);
  const [isOpenMenu, setIsOpenMenu] = useState(true);
  const [isOpenAddFolder, setIsOpenAddFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [openKeys, setOpenKeys] = useState<string[]>([]); // Manage open keys of SubMenu
  const [currentMenu, setCurrentMenu] = useState<string>(""); // Track the current menu clicked
  const navigate = useNavigate();
  const articalChildren = useLoaderData();
  const staticRoutes = useSelector(
    (state: RootState) => state.routes.staticRoutes
  );

  useEffect(() => {
    const items = transformDataToMenuItems((articalChildren) as RouteObject[]);
    setDirectory(items);
  }, [articalChildren]);

  // Transform API data into Antd Menu item format
  const transformDataToMenuItems = (data: RouteObject[]): MenuItem[] => {
    return data.map((item) => ({
      key: item.handle.key,
      label: item.path,
      icon: item.handle.type === "folder" ? <FolderOutlined /> : <ReadOutlined />,
      children: item.children
        ? transformDataToMenuItems(item.children)
        : undefined,
    }));
  };

  // Handle menu item click
  const handleMenuClick = (e: any) => {
    console.log("Clicked menu item:", e);
    const { key } = e; // Get clicked item's key
    const path = findFullPathByKey(staticRoutes, key);
    console.log("path" + path);
    setCurrentMenu(key); // Set current clicked menu
    navigate(path || ""); // Navigate to specific folder
  };



  // Handle adding a folder
  const handleAddFolder = () => {
    if (!folderName.trim()) return;
    setIsOpenAddFolder(false);
    setFolderName("");
    console.log("New folder name:", folderName);
  };

  const test = (e: React.MouseEvent<HTMLElement>): void => {
    // 将 e.target 断言为 HTMLElement，以便访问 closest 方法
    const submenu = (e.target as HTMLElement).closest(
      ".ant-menu-submenu-title"
    ) as HTMLElement | null;

    if (submenu) {
      // 获取自定义属性 data-menu-id 的值
      const attributeValue = submenu.getAttribute("data-menu-id");

      if (attributeValue) {
        // 分割字符串并获取最后一部分
        const key = attributeValue.split("-").pop();
        if (!key) return;
        const path = findFullPathByKey(staticRoutes, key);
        navigate(path || ""); // Navigate to specific folder
      }
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={
          isOpenMenu ? styles.menuContainerOpen : styles.menuContainerClose
        }
      >
        {isOpenMenu ? (
          <Button
            type="text"
            className={styles.menuControlBtn}
            onClick={() => setIsOpenMenu(!isOpenMenu)}
            icon={<RightOutlined />}
          />
        ) : (
          <Button
            type="text"
            className={styles.menuControlBtn}
            onClick={() => setIsOpenMenu(!isOpenMenu)}
            icon={<LeftOutlined />}
          />
        )}
        <Button
          style={isDarkMode ? { color: "#fff" } : { color: "#000" }}
          type="text"
          className={styles.add}
          onClick={() => setIsOpenAddFolder(!isOpenAddFolder)}
          icon={<FolderAddOutlined />}
        />
        {isOpenAddFolder ? (
          <Input
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onBlur={handleAddFolder}
            onPressEnter={handleAddFolder}
          />
        ) : null}
        <div onClick={test}>
          <Menu
            className={styles.menu}
            onClick={handleMenuClick} // Trigger handleMenuClick on item click
            mode="inline"
            inlineCollapsed={!isOpenMenu}
            inlineIndent={24}
            items={directory || []}
          />
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Actical;
