import React, { Key, useEffect, useState } from "react";
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
  DownOutlined,
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
import { Tree } from "antd";
import type { GetProps, TreeDataNode } from "antd";

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;

type MenuItem = Required<MenuProps>["items"][number];

const Actical = ({}) => {
  const { isDarkMode } = useTheme();
  const [directory, setDirectory] = useState<TreeDataNode[] | undefined>([]);
  const [isOpenMenu, setIsOpenMenu] = useState(true);
  const [isOpenAddFolder, setIsOpenAddFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [selectedKey, setSelectedKey] = useState<Key>("");
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
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    const savedSelectedKey = localStorage.getItem("selectedMenuKey");
    if (savedSelectedKey) {
      setSelectedKey(savedSelectedKey);
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

  const transformDataToMenuItems = (data: RouteObject[]): TreeDataNode[] => {
    return data.map((item) => ({
      key: item.handle.key,
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {item.handle.type === "folder" ? (
            <FolderOutlined style={{ marginRight: 10 }} />
          ) : (
            <ReadOutlined style={{ marginRight: 10 }} />
          )}
          <div>{item.handle.label}</div>
        </div>
      ),

      children: item.children
        ? transformDataToMenuItems(item.children)
        : undefined,
    }));
  };

  // 添加最外层文件夹
  const handleAddFolder = () => {
    if (!folderName.trim()) return;
    setIsOpenAddFolder(false);
    setFolderName("");
    console.log("New folder name:", folderName);
  };

  const onSelect: DirectoryTreeProps["onSelect"] = (keys, info) => {
    setSelectedKey(info.node.key);
    localStorage.setItem("selectedMenuKey", info.node.key as string);
    const path = findFullPathByKey(articleRoutesMap, info.node.key as string);
    console.log("path" + path);
    navigate(path || "");
  };
  const handleCloseAll = () => {
    setExpandedKeys([]); // 传入空数组，关闭所有节点
  };
  useEffect(() => {
    if (isOpenMenu === false) {
      handleCloseAll();
    }
  }, [isOpenMenu]);

  const onExpand: DirectoryTreeProps["onExpand"] = (keys, info) => {
    setExpandedKeys(keys);
    console.log("Trigger Expand", keys, info);
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
        {/* <Button
          style={isDarkMode ? { color: "#fff" } : { color: "#000" }}
          type="text"
          className={styles.add}
          onClick={() => setIsOpenAddFolder(!isOpenAddFolder)}
          icon={<FolderAddOutlined />}
        /> */}
        {isOpenAddFolder ? (
          <Input
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onBlur={handleAddFolder}
            onPressEnter={handleAddFolder}
          />
        ) : null}

        <DirectoryTree
          className={styles.menu}
          multiple
          defaultExpandAll
          onSelect={onSelect}
          onExpand={onExpand}
          showIcon={false}
          expandedKeys={expandedKeys} // 受控展开的节点
          draggable={{
            icon: false, // 关闭拖拽图标
          }}
          treeData={directory}
        />
      </div>
      <div className={styles.articleMainContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default Actical;
