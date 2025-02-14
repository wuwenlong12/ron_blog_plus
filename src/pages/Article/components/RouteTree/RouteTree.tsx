import React from "react";
import { Tree } from "antd";
import type { TreeProps } from "antd";
import { useDispatch } from "react-redux";
import { RouteObject } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IoFolderOutline } from "react-icons/io5";
import { RiBook2Line } from "react-icons/ri";
import { loadArticleRoutes } from "../../../../store/routersMapSlice";
import { patchFolderOrder } from "../../../../api/folder";
import { AppDispatch } from "../../../../store";
import styles from "./RouteTree.module.scss";

interface CustomTreeDataNode {
  type: string;
  parentId: string | null;
}

interface RouteTreeProps {
  routes: RouteObject[];
  isAuthenticated?: boolean;
}

const RouteTree: React.FC<RouteTreeProps> = ({ routes, isAuthenticated }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // 转换路由数据为树形数据
  const transformToTreeData = (
    routes: RouteObject[],
    parentId: string | null = null
  ): any[] => {
    return routes.map((route) => ({
      key: route.handle?.key || route.path,
      title: (
        <div className={styles.nodeTitle}>
          {route.handle?.type === "folder" ? (
            <IoFolderOutline style={{ marginRight: 10 }} />
          ) : (
            <RiBook2Line style={{ marginRight: 10 }} />
          )}
          <span>{route.handle?.label || "Unnamed"}</span>
        </div>
      ),
      type: route.handle?.type,
      parentId,
      children: route.children
        ? transformToTreeData(route.children, route.handle?.key)
        : undefined,
    }));
  };

  const onDrop: TreeProps["onDrop"] = async (info) => {
    const { dropPosition, dropToGap, dragNode, node } = info;

    const dragNodeId = dragNode.key as string;
    const dragNodeType = (dragNode as unknown as CustomTreeDataNode).type;
    let newParentFolderId: string | null;
    let gapPosition: number;

    if (dropToGap) {
      newParentFolderId =
        (node as unknown as CustomTreeDataNode).parentId || null;
      gapPosition = dropPosition;
    } else {
      newParentFolderId = node.key as string;
      if (
        (dragNode as unknown as CustomTreeDataNode).parentId ===
        newParentFolderId
      ) {
        gapPosition = 0;
      } else {
        gapPosition = node.children ? node.children.length : 0;
      }
    }

    await patchFolderOrder(
      dragNodeId,
      dragNodeType,
      gapPosition,
      newParentFolderId
    );

    dispatch(loadArticleRoutes());
  };

  const allowDrop = ({ dropNode, dropPosition }: any) => {
    if (dropNode.type === "article" && dropPosition === 0) {
      return false;
    }
    return true;
  };

  const onSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const path = `/article/${selectedKeys[0]}`;
      navigate(path);
    }
  };

  return (
    <Tree
      className={styles.treeContainer}
      treeData={transformToTreeData(routes)}
      draggable={
        isAuthenticated
          ? {
              icon: false,
              nodeDraggable: () => true,
            }
          : false
      }
      allowDrop={allowDrop}
      onDrop={isAuthenticated ? onDrop : undefined}
      onSelect={onSelect}
      showIcon={false}
    />
  );
};

export default RouteTree;
