import React, { useEffect, useState } from "react";
import styles from "./Article.module.scss";
import { Button, Input, Empty, App } from "antd";
import Icon, {
  RightOutlined,
  LeftOutlined,
  FolderOutlined,
  ReadOutlined,
  DownOutlined,
  FolderAddOutlined,
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
import { motion } from "framer-motion";
import { closeModal, toggleModal } from "../../store/modalSlice";
type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;
const Article = () => {
  const { isArticleLeftModalOpen } = useSelector(
    (state: RootState) => state.modal
  );
  const [directory, setDirectory] = useState<TreeDataNode[] | undefined>([]);
  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        // 768px 是常用的移动端断点
        // dispatch(closeModal());
      }
    };

    // 初始检查
    handleResize();

    // 添加监听器
    window.addEventListener("resize", handleResize);

    // 清理监听器
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

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

  const { modal } = App.useApp();

  // 添加一个状态来追踪是否已经显示过弹窗
  const [hasShownGuide, setHasShownGuide] = useState(false);

  useEffect(() => {
    const savedSelectedKey = localStorage.getItem("selectedMenuKey");
    console.log("savedSelectedKey", savedSelectedKey);

    if (savedSelectedKey) {
      setSelectedKey(savedSelectedKey);
    }
  }, []);

  useEffect(() => {
    console.log(articleRoutesMap);

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
    if (isArticleLeftModalOpen === false) {
      handleCloseAll();
    }
  }, [isArticleLeftModalOpen]);

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
      y: event.pageY,
      node: null,
    });
  };

  useEffect(() => {
    // 在目录为空且有权限时显示引导，并且只显示一次
    if (directory?.length === 0 && isAuthenticated && !hasShownGuide) {
      setHasShownGuide(true); // 标记已经显示过弹窗
      modal.info({
        title: "开始创建你的第一篇文章",
        content: (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ padding: "20px 0" }}
          >
            <div
              style={{
                background: "#f8fafc",
                padding: "24px",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <DownOutlined
                  style={{
                    fontSize: "24px",
                    color: "#3b82f6",
                    background: "#eef2ff",
                    padding: "8px",
                    borderRadius: "12px",
                  }}
                />
                <span
                  style={{
                    fontSize: "15px",
                    color: "#1e293b",
                    fontWeight: 500,
                  }}
                >
                  右键点击空白处
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <FolderAddOutlined
                  style={{
                    fontSize: "24px",
                    color: "#3b82f6",
                    background: "#eef2ff",
                    padding: "8px",
                    borderRadius: "12px",
                  }}
                />
                <span
                  style={{
                    fontSize: "15px",
                    color: "#1e293b",
                    fontWeight: 500,
                  }}
                >
                  选择"新建目录"或"新建文章"
                </span>
              </div>
            </div>
            <div
              style={{
                marginTop: "16px",
                color: "#64748b",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              你可以通过目录来组织你的文章，创建一个清晰的内容结构。
            </div>
          </motion.div>
        ),
        width: 480,
        icon: null,
        maskClosable: true,
        okText: "知道了",
        okButtonProps: {
          style: {
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            border: "none",
            height: "40px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
            padding: "0 24px",
          },
        },
        afterClose: () => {
          // 可选：如果你想在弹窗关闭后重置状态，以便将来可能再次显示
          // setHasShownGuide(false);
        },
      });
    }
  }, [directory, isAuthenticated, hasShownGuide]); // 添加 hasShownGuide 到依赖数组

  return (
    <div className={styles.container}>
      <div
        className={
          isArticleLeftModalOpen ? styles.sidebarOpen : styles.sidebarClosed
        }
      >
        {/* 控制按钮 */}
        <Button
          type="text"
          className={styles.toggleBtn}
          onClick={() => dispatch(toggleModal("articleLeft"))}
          icon={isArticleLeftModalOpen ? <LeftOutlined /> : <RightOutlined />}
        />

        {/* 侧边栏内容 */}
        <div
          className={styles.sidebarContent}
          onContextMenu={onContextMenu}
          style={{ background: isDarkMode ? "#111827" : "#fff" }}
        >
          <DirectoryTree
            className={styles.menu}
            style={{
              color: isDarkMode ? "#fff" : "#000",
              opacity: isArticleLeftModalOpen ? 1 : 0,
            }}
            multiple
            defaultExpandAll={true}
            onSelect={onSelect}
            selectedKeys={[selectedKey]}
            switcherIcon={
              <Icon
                component={
                  FaChevronDown as React.ForwardRefExoticComponent<any>
                }
              />
            }
            onExpand={onExpand}
            showIcon={false}
            onRightClick={isAuthenticated ? onRightClick : null}
            expandedKeys={expandedKeys} // 受控展开的节点
            draggable={{
              icon: false, // 关闭拖拽图标
              nodeDraggable: () => isAuthenticated, // 只有有权限的用户才能拖拽
            }}
            allowDrop={allowDrop}
            treeData={directory}
            onDrop={isAuthenticated ? onDrop : null}
          />
        </div>
      </div>
      <RightMenu
        contextMenu={contextMenu}
        setContextMenu={setContextMenu}
      ></RightMenu>
      {/* 主内容区 */}
      <div className={styles.mainContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default Article;
