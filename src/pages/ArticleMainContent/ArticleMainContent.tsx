import {
  Input,
  Form,
  Button,
  Space,
  message,
  Breadcrumb,
  Card,
  Flex,
} from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Navigate,
  RouteObject,
  useLocation,
  useMatches,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./ArticleMainContent.module.scss";
import {
  getDirectoryInfoById,
  patchFolderDesc,
  patchFolderName,
} from "../../api/actical/actical";
import AppBreadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { log } from "console";
import useTheme from "../../hook/useTheme";
import { EditFilled, EditOutlined, FolderAddOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import useArticleRoutes from "../../router/useArticleRoutes";
import { findFullPathByKey } from "../../router/utils/findFullPathByKey";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

import { Tree } from "antd";
import type { GetProps, TreeDataNode } from "antd";

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;

interface ArticleMainContentProps {
  id: string; // 使用 motionKey 来避免与 React 内置的 key 属性冲突
}

const treeData: TreeDataNode[] = [
  {
    title: "parent 0",
    key: "0-0",
    children: [
      { title: "leaf 0-0", key: "0-0-0", isLeaf: true },
      { title: "leaf 0-1", key: "0-0-1", isLeaf: true },
    ],
  },
  {
    title: "parent 1",
    key: "0-1",
    children: [
      { title: "leaf 1-0", key: "0-1-0", isLeaf: true },
      { title: "leaf 1-1", key: "0-1-1", isLeaf: true },
    ],
  },
];

const ArticleMainContent: React.FC<ArticleMainContentProps> = ({ id }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const breadcrumbRef = useRef<any>(null);
  const matches = useMatches();
  const [currentId, setCurrentId] = useState("");
  const [isEditNameing, setIsEditNameing] = useState(false);
  const [isEditDescing, setIsEditDescing] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const { loadArticleRoutes } = useArticleRoutes();
  const articleRoutesMap = useSelector(
    (state: RootState) => state.routesMap.articleRoutesMap
  );
  // const [folderTree,setFolderTree] = useState<TreeDataNode[]>([])
  const navigate = useNavigate();
  useEffect(() => {
    const cur: any = matches[matches.length - 1];
    setCurrentId(cur.handle.key);
  }, [matches]);
  // 当searchParams变化时，重新加载数据
  useEffect(() => {
    init(currentId);
  }, [currentId]);

  const folderTree: TreeDataNode[] | undefined = useMemo(() => {
    // 递归查找目标节点
    const findNode = (nodes: RouteObject[]): RouteObject | null => {
      for (const node of nodes) {
        if (node.handle?.key === currentId) {
          return node;
        }
        if (node.children && node.children.length > 0) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    // 将 RouteObject 转换为 TreeDataNode 格式
    const transformToTreeData = (node: RouteObject): TreeDataNode => {
      return {
        title: node.handle?.label || "未命名节点",
        key: node.handle?.key || "",
        isLeaf: !node.children || node.children.length === 0,
        children: node.children
          ? node.children.map((child) => transformToTreeData(child))
          : undefined,
      };
    };

    // 调用查找函数
    const targetNode = findNode(articleRoutesMap);

    // 如果找到节点，将其转换为 TreeDataNode 格式
    if (targetNode) {
      return targetNode.children
        ? targetNode.children.map((child) => transformToTreeData(child))
        : [];
    }

    return undefined; // 没找到返回 null
  }, [articleRoutesMap, currentId]);

  // 初始化目录信息
  const init = async (id: string) => {
    try {
      const res = await getDirectoryInfoById(id);
      if (res.code === 0) {
        console.log(res);
        setName(res.data.name);
        setDesc(res.data.desc);
      } else {
        messageApi.error("加载数据失败，请稍后重试");
      }
    } catch (error) {
      messageApi.error("网络错误，请稍后再试");
    }
  };

  // 结束后更新数据
  const handleAnimationComplete = () => {
    if (breadcrumbRef.current) {
      breadcrumbRef.current.updateInfo(); // 调用子组件中的 updateInfo 方法
    }
  };

  const saveFoldName = async () => {
    try {
      const res = await patchFolderName(id, name);
      console.log(res);

      if (res.code === 0) {
        // 更新路由配置
        await loadArticleRoutes();

        // navigate(path || "");
        messageApi.success("保存成功！");
      } else {
        messageApi.error("保存失败，请稍后重试");
      }
    } catch (error) {
      console.error("保存失败:", error);
      messageApi.error("保存失败，请稍后重试");
    }
    setIsEditNameing(false);
  };
  const saveFoldDesc = async () => {
    try {
      const res = await patchFolderDesc(id, desc);
      console.log(res);

      if (res.code === 0) {
        // 更新路由配置
        await loadArticleRoutes();

        // navigate(path || "");
        messageApi.success("保存成功！");
      } else {
        messageApi.error("保存失败，请稍后重试");
      }
    } catch (error) {
      console.error("保存失败:", error);
      messageApi.error("保存失败，请稍后重试");
    }
    setIsEditDescing(false);
  };

  const onSelect: DirectoryTreeProps["onSelect"] = (keys, info) => {
    console.log("Trigger Select", keys, info);
  };

  const onExpand: DirectoryTreeProps["onExpand"] = (keys, info) => {
    console.log("Trigger Expand", keys, info);
  };
  return (
    <AnimatePresence>
      <motion.div
        className={styles.container}
        key={currentId} // 使用 motionKey 来确保动态变化时触发组件重新渲染
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onAnimationComplete={handleAnimationComplete}
      >
        {contextHolder}
        <AppBreadcrumb isDarkMode={true}></AppBreadcrumb>
        <div className={styles.title}>
          <div style={{ display: "flex" }}>
            <Button
              type="text"
              className={styles.Btn}
              onClick={() => setIsEditNameing(true)}
              icon={
                <EditFilled
                  className={styles.editIcon}
                  style={{ fontSize: 28 }}
                />
              }
            />
            {isEditNameing ? (
              <Input
                showCount
                maxLength={20}
                value={name}
                onBlur={saveFoldName}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入名称"
              />
            ) : (
              <span> {name}</span>
            )}
          </div>
          <Button color="danger" variant="solid">
            删除
          </Button>
        </div>

        <div className={styles.desc}>
          <Button
            type="text"
            className={styles.Btn}
            onClick={() => setIsEditDescing(true)}
            icon={
              <EditFilled
                className={styles.editIcon}
                style={{ fontSize: 22 }}
              />
            }
          />
          {isEditDescing ? (
            <TextArea
              showCount
              maxLength={100}
              value={desc}
              onBlur={saveFoldDesc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="请输入描述"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          ) : (
            <span> {desc ? desc : "此文档没有描述"}</span>
          )}
        </div>
        <div className={styles.catalTitle}>目录</div>
        <hr className={styles.hr} />
        <DirectoryTree
          multiple
          draggable
          defaultExpandAll
          onSelect={onSelect}
          onExpand={onExpand}
          treeData={folderTree}
          rootStyle={{ fontSize: 20 }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ArticleMainContent;
