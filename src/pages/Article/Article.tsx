import React, { useEffect, useState } from "react";
import styles from "./Article.module.scss";
import useTheme from "../../hook/useTheme";
import { Menu, MenuProps, Button, Input, Modal } from "antd";
import {
  RightOutlined,
  LeftOutlined,
  FolderAddOutlined,
  FolderOutlined,
  ReadOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Outlet, RouteObject, useNavigate } from "react-router-dom";
import { findFullPathByKey } from "../../router/utils/findFullPathByKey";
import { RootState } from "../../store";
import useRoutes from "../../router/useArticleRoutes";
import { getDirectoryInfoById } from "../../api/actical/actical";
import EditModal from "./components/EditModal/EditModal";
import { useSelector } from "react-redux";
import useArticleRoutes from "../../router/useArticleRoutes";
import { log } from "node:console";
import Loading from "../../components/loading/loading";
type MenuItem = Required<MenuProps>["items"][number];

const Actical = ({}) => {
  const { isDarkMode } = useTheme();
  const [directory, setDirectory] = useState<MenuItem[] | null>([]);
  const [isOpenMenu, setIsOpenMenu] = useState(true);
  const [isOpenAddFolder, setIsOpenAddFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const navigate = useNavigate();
  // const { articleRoutes } = useRoutes();
  const articleRoutesMap = useSelector(
    (state: RootState) => state.routesMap.articleRoutesMap
  );
  const [isShowfolderOrActicleInfoForm, setIsShowfolderOrActicleInfoForm] =
    useState<boolean>(false);
  const [folderOrActicleInfoFormLoading, setFolderOrActicleInfoFormLoading] =
    useState<boolean>(true);
  const [EditKey, setEditKey] = useState("");
  const [EditType, setEditType] = useState<"folder" | "article">("article");

  useEffect(() => {
    const savedSelectedKey = localStorage.getItem("selectedMenuKey");
    if (savedSelectedKey) {
      setSelectedKeys([savedSelectedKey]);
    }
  }, []);

  useEffect(() => {
    console.log("已更新");

    const items = transformDataToMenuItems(articleRoutesMap as RouteObject[]);

    // 删除第一条数据
    const updatedItems = items.slice(1);

    // 更新目录
    setDirectory(updatedItems);
  }, [articleRoutesMap]);

  const transformDataToMenuItems = (data: RouteObject[]): MenuItem[] => {
    return data.map((item) => ({
      key: item.handle.key,
      label: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>{item.path}</div>
          <Button
            className={isDarkMode ? styles.BtnDark : styles.BtnLight}
            type="text"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              setFolderOrArticleInfo(e, item.handle.type, item.handle.key)
            }
            icon={<SettingOutlined />}
          />
        </div>
      ),
      icon:
        item.handle.type === "folder" ? <FolderOutlined /> : <ReadOutlined />,
      children: item.children
        ? transformDataToMenuItems(item.children)
        : undefined,
    }));
  };

  // 文章点击
  const handleActicleClick = (e: any) => {
    console.log("Clicked menu item:", e);
    const { key } = e;
    setSelectedKeys([key]);
    localStorage.setItem("selectedMenuKey", key);
    const path = findFullPathByKey(articleRoutesMap, key);
    console.log("path" + path);
    navigate(path || "");
  };

  // 文件夹点击
  const handleFolderClick = (e: React.MouseEvent<HTMLElement>): void => {
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
        const path = findFullPathByKey(articleRoutesMap, key);
        navigate(path || ""); // Navigate to specific folder
      }
    }
  };

  // 添加最外层文件夹
  const handleAddFolder = () => {
    if (!folderName.trim()) return;
    setIsOpenAddFolder(false);
    setFolderName("");
    console.log("New folder name:", folderName);
  };

  const setFolderOrArticleInfo = async (
    e: React.MouseEvent<HTMLButtonElement>,
    type: "folder" | "article",
    key: string
  ) => {
    e.stopPropagation(); // 阻止事件冒泡
    setEditKey(key);
    setEditType(type);
    setIsShowfolderOrActicleInfoForm(true);
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
        <div onClick={handleFolderClick}>
          <Menu
            style={{ background: "transparent", border: "none" }}
            className={styles.menu}
            onClick={handleActicleClick}
            selectedKeys={selectedKeys}
            mode="inline"
            inlineCollapsed={!isOpenMenu}
            inlineIndent={24}
            items={directory || []}
          />
        </div>
      </div>
      <div className={styles.articleMainContent}>
        <Outlet />
      </div>
      <EditModal
        id={EditKey}
        type={EditType}
        isShowfolderOrActicleInfoForm={isShowfolderOrActicleInfoForm}
        setIsShowfolderOrActicleInfoForm={setIsShowfolderOrActicleInfoForm}
        // onSuccess={SaveFolderInfoSuccessfully}
      ></EditModal>
    </div>
  );
};

export default Actical;
