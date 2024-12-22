import React, { useEffect, useState } from "react";
import styles from "./Article.module.scss";
import useTheme from "../../hook/useTheme";
import { MenuProps, Button, Input } from "antd";
import {
  RightOutlined,
  LeftOutlined,
  FolderOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { Outlet, RouteObject, useNavigate } from "react-router-dom";
import { findFullPathByKey } from "../../router/utils/findFullPathByKey";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { Tree } from "antd";
import type { GetProps, TreeDataNode, TreeProps } from "antd";
import { setSelectedKey } from "../../store/routersMapSlice";
import { patchFolderOrder } from "../../api/folder";
import { DataNode } from "antd/es/tree";
import useArticleRoutes from "../../router/useArticleRoutes";

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;

const Actical = ({}) => {
  const { isDarkMode } = useTheme();
  const [directory, setDirectory] = useState<TreeDataNode[] | undefined>([]);
  const [isOpenMenu, setIsOpenMenu] = useState(true);
  const [isOpenAddFolder, setIsOpenAddFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { articleRoutes } = useRoutes();
  const articleRoutesMap = useSelector(
    (state: RootState) => state.routesMap.articleRoutesMap
  );
  const selectedKey = useSelector(
    (state: RootState) => state.routesMap.selectedKey
  );
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const { loadArticleRoutes } = useArticleRoutes();
  useEffect(() => {
    const savedSelectedKey = localStorage.getItem("selectedMenuKey");
    if (savedSelectedKey) {
      setSelectedKey(savedSelectedKey);
    }
  }, []);

  useEffect(() => {
    const items = transformDataToMenuItems(articleRoutesMap as RouteObject[]);
    // 删除第一条数据
    const updatedItems = items.slice(1);
    // 更新目录
    setDirectory(updatedItems);
  }, [articleRoutesMap]);

  const transformDataToMenuItems = (
    data: RouteObject[],
    parentId: string | null = null // 新增 parentId 参数，根节点默认为 null
  ): TreeDataNode[] => {
    return data.map((item) => ({
      key: item.handle.key,
      type: item.handle.type,
      parentId, // 添加 parentId
      title: (
        <div
          style={{
            display: "flex",
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
        ? transformDataToMenuItems(item.children, item.handle.key) // 递归传递当前节点的 key 作为子节点的 parentId
        : undefined,
    }));
  };

  // 添加最外层文件夹
  const handleAddFolder = () => {
    if (!folderName.trim()) return;
    setIsOpenAddFolder(false);
    setFolderName("");
  };

  const onSelect: DirectoryTreeProps["onSelect"] = (keys, info) => {
    dispatch(setSelectedKey(info.node.key));
    localStorage.setItem("selectedMenuKey", info.node.key as string);
    const path = findFullPathByKey(articleRoutesMap, info.node.key as string);
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
  };

  interface TreeNode extends DataNode {
    type: "folder" | "article"; // 定义 type
  }

  // 定义自定义的 TreeNode 类型
  interface TreeNode extends DataNode {
    type: "folder" | "article";
  }

  const onDrop: TreeProps["onDrop"] = async (info) => {
    const { dropPosition, dropToGap, dragNode, node } = info;

    const itemId = dragNode.key as string; // 拖动节点的 ID
    const type = (dragNode as unknown as TreeNode).type; // 拖动节点的类型

    let newParentFolderId: string;
    let newOrder: number;

    if (dropToGap) {
      // 放到上下间隙，需要获取目标节点的父节点 ID
      newParentFolderId = (node as any).parentId || null; // 如果树节点没有 parentId 属性，请确保在初始化时生成它
      newOrder = dropPosition; // 按间隙顺序
    } else {
      // 放到目标节点内部
      newParentFolderId = node.key as string;
      newOrder = node.children ? node.children.length : 0; // 插入到子节点的末尾
    }

    console.log("New Parent Folder ID:", newParentFolderId);
    console.log("Item ID:", itemId);
    console.log("New Order:", newOrder);

    // 调用更新 API
    await patchFolderOrder(itemId, type, newOrder, newParentFolderId);

    // 重新加载
    loadArticleRoutes();
  };
  const allowDrop = ({
    dropNode,
    dropPosition,
  }: {
    dropNode: any;
    dropPosition: number;
  }) => {
    // 如果目标节点是 "article"，不允许放置到其内部 (dropPosition === 0)
    if (dropNode.type === "article" && dropPosition === 0) {
      return false;
    }
    // 允许放置到间隙 (上方或下方)
    return true;
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
          selectedKeys={[selectedKey]}
          onExpand={onExpand}
          showIcon={false}
          expandedKeys={expandedKeys} // 受控展开的节点
          draggable={{
            icon: false, // 关闭拖拽图标
          }}
          allowDrop={allowDrop}
          treeData={directory}
          onDrop={onDrop}
        />
      </div>
      <div className={styles.articleMainContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default Actical;
