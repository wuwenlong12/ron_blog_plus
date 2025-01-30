import React, { useEffect, useState } from "react";
import styles from "./Article.module.scss";
import useTheme from "../../hook/useTheme";
import { Button, Input } from "antd";
import Icon, {
  RightOutlined,
  LeftOutlined,
  FolderOutlined,
  ReadOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Outlet, RouteObject, useNavigate } from "react-router-dom";
import { findFullPathByKey } from "../../router/utils/findFullPathByKey";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { Tree } from "antd";
import type { GetProps, TreeDataNode, TreeProps } from "antd";
import { loadArticleRoutes, setSelectedKey } from "../../store/routersMapSlice";
import { patchFolderOrder } from "../../api/folder";
import RightMenu from "./components/RightMenu/RightMenu";
import { FaAngleDown, FaChevronDown, FaFolderMinus } from "react-icons/fa";
import { IoFolderOutline } from "react-icons/io5";
import { RiBook2Line } from "react-icons/ri";
import { AppDispatch } from "../../store";
type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;

const Actical = ({}) => {
  const [directory, setDirectory] = useState<TreeDataNode[] | undefined>([]);
  const [isOpenMenu, setIsOpenMenu] = useState(true);
  const [isOpenAddFolder, setIsOpenAddFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const articleRoutesMap = useSelector(
    (state: RootState) => state.routesMap.articleRoutesMap
  );
  const selectedKey = useSelector(
    (state: RootState) => state.routesMap.selectedKey
  );
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    node: any | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    node: null,
  });

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

  interface CustomTreeDataNode extends TreeDataNode {
    type: string; // 添加自定义属性
    parentId: string | null;
  }
  const transformDataToMenuItems = (
    data: RouteObject[],
    parentId: string | null = null // 新增 parentId 参数，根节点默认为 null
  ): CustomTreeDataNode[] => {
    return data.map((item) => ({
      key: item.handle.key,
      type: item.handle.type,
      parentId, // 添加 parentId
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {item.handle.type === "folder" ? (
            <IoFolderOutline style={{ marginRight: 10 }} />
          ) : (
            <RiBook2Line style={{ marginRight: 10 }} />
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

  const onDrop: TreeProps["onDrop"] = async (info) => {
    const { dropPosition, dropToGap, dragNode, node } = info;

    const dragNodeId = dragNode.key as string; // 拖动节点的 ID
    const dragNodeType = (dragNode as unknown as CustomTreeDataNode).type; // 拖动节点的类型
    let newParentFolderId: string | null;
    let gapPosition: number;

    if (dragNodeId === selectedKey) {
      navigate("/Article");
    }
    if (dropToGap) {
      // 放到上下间隙，需要获取目标节点的父节点 ID
      console.log("放到上下间隙");
      console.log(node);

      newParentFolderId =
        (node as unknown as CustomTreeDataNode).parentId || null; // 如果树节点没有 parentId 属性，请确保在初始化时生成它
      gapPosition = dropPosition; // 按间隙顺序
    } else {
      // 放到目标节点内部
      console.log(" 放到目标节点内部");

      newParentFolderId = node.key as string;
      console.log(node);

      if (
        (dragNode as unknown as CustomTreeDataNode).parentId ===
        newParentFolderId
      ) {
        gapPosition = 0; // 插入到子节点的末尾
        // return;
      } else {
        gapPosition = node.children ? node.children.length : 0; // 插入到子节点的末尾
      }
    }

    console.log("New Parent Folder ID:", newParentFolderId);
    console.log("Item ID:", dragNodeId);
    console.log("dropPosition", dropPosition);

    console.log("New Order:", gapPosition);

    //  调用更新 API
    await patchFolderOrder(
      dragNodeId,
      dragNodeType,
      gapPosition,
      newParentFolderId
    );

    // 重新加载
    dispatch(loadArticleRoutes());
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

  const onRightClick: TreeProps["onRightClick"] = ({ event, node }) => {
    event.preventDefault();
    event.stopPropagation(); // 阻止事件冒泡
    console.log(111);

    setContextMenu({
      visible: true,
      x: event.pageX, // 使用全局坐标
      y: event.pageY - 60,
      node,
    });
  };

  const onContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log(222);

    setContextMenu({
      visible: true,
      x: event.pageX, // 使用全局坐标
      y: event.pageY - 60,
      node: null,
    });
  };

  return (
    <div className={styles.container}>
      <div
        className={
          isOpenMenu ? styles.menuContainerOpen : styles.menuContainerClose
        }
        onContextMenu={onContextMenu}
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
          style={{ opacity: isOpenMenu ? 1 : 0 }}
          multiple
          defaultExpandAll
          onSelect={onSelect}
          selectedKeys={[selectedKey]}
          switcherIcon={
            <Icon
              component={FaChevronDown as React.ForwardRefExoticComponent<any>}
            />
          }
          onExpand={onExpand}
          showIcon={false}
          onRightClick={onRightClick}
          expandedKeys={expandedKeys} // 受控展开的节点
          draggable={{
            icon: false, // 关闭拖拽图标
          }}
          allowDrop={allowDrop}
          treeData={directory}
          onDrop={onDrop}
        />

        <RightMenu
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
        ></RightMenu>
      </div>
      <div className={styles.articleMainContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default Actical;
