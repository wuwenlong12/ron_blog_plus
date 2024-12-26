import { Input, Button, App } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { RouteObject, useMatches, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./ArticleMainContent.module.scss";
import {
  getDirectoryInfoById,
  patchFolderDesc,
  patchFolderName,
} from "../../api/folder";
import AppBreadcrumb from "../../components/Breadcrumb/Breadcrumb";
import {
  EditFilled,
  FolderOutlined,
  HomeOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import useArticleRoutes from "../../router/useArticleRoutes";
import { findFullPathByKey } from "../../router/utils/findFullPathByKey";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";

import { Tree } from "antd";
import type { GetProps, TreeDataNode } from "antd";
import { setSelectedKey } from "../../store/routersMapSlice";
import {
  getArticleContentById,
  updateArticleContentById,
} from "../../api/article";
import Editor from "../../components/Editor/Editor";
import { PartialBlock } from "@blocknote/core";

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;

interface ArticleMainContentProps {
  id: string; // 使用 motionKey 来避免与 React 内置的 key 属性冲突
}

const ArticleMainContent: React.FC<ArticleMainContentProps> = ({ id }) => {
  const { message } = App.useApp();
  const breadcrumbRef = useRef<any>(null);
  const matches = useMatches();
  const [currentId, setCurrentId] = useState("");
  const [currentType, setCurrentType] = useState<"article" | "folder">(
    "folder"
  );
  const [isEditNameing, setIsEditNameing] = useState(false);
  const [isEditDescing, setIsEditDescing] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [initContent, setInitContent] = useState<PartialBlock[] | undefined>(
    undefined
  );
  const [content, setContent] = useState<PartialBlock[] | undefined>(undefined);
  const { loadArticleRoutes } = useArticleRoutes();
  const dispatch = useDispatch();
  const articleRoutesMap = useSelector(
    (state: RootState) => state.routesMap.articleRoutesMap
  );
  // const [folderTree,setFolderTree] = useState<TreeDataNode[]>([])
  const navigate = useNavigate();
  useEffect(() => {
    const cur: any = matches[matches.length - 1];
    setCurrentId(cur.handle.key);
    setCurrentType(cur.handle.type);
  }, [matches]);
  // 当searchParams变化时，重新加载数据
  useEffect(() => {
    if (currentId) {
      setInitContent(undefined);
      init(currentId);
    }
  }, [currentId]);

  const folderTree: TreeDataNode[] | undefined = useMemo(() => {
    // 递归查找目标节点
    const findNode = (nodes: RouteObject[]): RouteObject | null => {
      if (currentId === "default-index")
        return {
          path: "/",
          handle: {
            key: "default-index",
            label: "index",
            type: "folder",
            Icon: <HomeOutlined />, // 用字符串表示图标
            requiresAuth: false,
          },
          children: nodes,
        };
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
        title: (
          <div
            style={{
              display: "flex",
            }}
          >
            {node.handle.type === "folder" ? (
              <FolderOutlined style={{ marginRight: 10 }} />
            ) : (
              <ReadOutlined style={{ marginRight: 10 }} />
            )}
            <div>{node.handle.label}</div>
          </div>
        ),
        key: node.handle?.key || "",
        isLeaf: !node.children || node.children.length === 0,
        children: node.children
          ? node.children.map((child) => transformToTreeData(child))
          : undefined,
      };
    };

    const targetNode = findNode(articleRoutesMap);
    console.log(targetNode);

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
    if (id === "default-index") {
      setName("首页");
      setDesc("描述");
      return;
    }
    if (currentType === "folder") {
      const res = await getDirectoryInfoById(id);
      if (res.code === 0) {
        setName(res.data.name);
        setDesc(res.data.desc);
        setIsLoadingContent(false);
      } else {
        message.error("加载数据失败，请稍后重试");
      }
    } else {
      setIsEditable(false);
      const curJson = localStorage.getItem(currentId);
      if (curJson) {
        const obj = JSON.parse(curJson);

        setContent(obj.content);
      }

      const res = await getArticleContentById(id);
      if (res.code === 0) {
        setName(res.data.title);
        const content = fixStyles(res.data.content);

        setInitContent(content);
        if (!curJson) setContent(content);
      } else {
        message.error("加载数据失败，请稍后重试");
      }
    }
  };
  // 修复后端序列号空styles丢失问题
  function fixStyles(content: any) {
    // 遍历每个 item
    return content.map((item: any) => {
      // 如果 item 有 content 字段且是数组
      if (Array.isArray(item.content)) {
        // 遍历每个 content 项
        item.content = item.content.map((cur: any) => {
          // 如果 type 为 text 且没有 styles 字段（即 undefined 或 null），则补全
          if (cur.type === "text" && !cur.hasOwnProperty("styles")) {
            cur.styles = {}; // 补全空的 styles
          }
          return cur;
        });
      }
      return item;
    });
  }

  // 结束后更新数据
  const handleAnimationComplete = () => {
    if (breadcrumbRef.current) {
      breadcrumbRef.current.updateInfo(); // 调用子组件中的 updateInfo 方法
    }
  };

  const saveFoldName = async () => {
    try {
      const res = await patchFolderName(currentId, name);
      if (res.code === 0) {
        // 更新路由配置
        await loadArticleRoutes();

        // navigate(path || "");
        message.success("保存成功！");
      } else {
        message.error("保存失败，请稍后重试");
      }
    } catch (error) {
      console.error("保存失败:", error);
      message.error("保存失败，请稍后重试");
    }
    setIsEditNameing(false);
  };
  const saveFoldDesc = async () => {
    try {
      const res = await patchFolderDesc(currentId, desc);

      if (res.code === 0) {
        // 更新路由配置
        await loadArticleRoutes();

        // navigate(path || "");
        message.success("保存成功！");
      } else {
        message.error("保存失败，请稍后重试");
      }
    } catch (error) {
      console.error("保存失败:", error);
      message.error("保存失败，请稍后重试");
    }
    setIsEditDescing(false);
  };

  const onSelect: DirectoryTreeProps["onSelect"] = (keys, info) => {
    dispatch(setSelectedKey(info.node.key));
    localStorage.setItem("selectedMenuKey", info.node.key as string);
    const path = findFullPathByKey(articleRoutesMap, info.node.key as string);
    navigate("/Article/" + path || "");
  };
  const onExpand: DirectoryTreeProps["onExpand"] = (keys, info) => {
    console.log("Trigger Expand", keys, info);
  };

  const EditorChange = (content: any) => {
    if (isEditable) {
      setContent(content);
      localStorage.setItem(currentId, JSON.stringify({ content }));
      message.success("自动保存成功！");
    }
  };

  const deleteFolderOrArticle = () => {};
  const publishArticle = async () => {
    const res = await updateArticleContentById(currentId, content);
    console.log(res);

    if (res.code === 0) {
      console.log("发布成功");
      setIsEditable(false);
      setInitContent(content);
      localStorage.removeItem(currentId);
    } else {
      console.log("发布失败");
    }
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
              <span> {name ? name : "未命名"}</span>
            )}
          </div>
          <div>
            {isEditable ? (
              <Button
                onClick={publishArticle}
                style={{ marginRight: 20 }}
                color="primary"
                variant="solid"
              >
                发布
              </Button>
            ) : (
              <Button
                onClick={() => setIsEditable(true)}
                style={{ marginRight: 20 }}
                color="default"
                variant="solid"
              >
                编辑
              </Button>
            )}
            <Button
              onClick={deleteFolderOrArticle}
              color="danger"
              variant="solid"
            >
              删除
            </Button>
          </div>
        </div>

        {currentType === "folder" ? (
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
        ) : null}

        {currentType === "folder" ? (
          <>
            <div className={styles.catalTitle}>目录</div>
            <hr className={styles.hr} />

            <DirectoryTree
              multiple
              // draggable
              defaultExpandAll
              showIcon={false}
              onSelect={onSelect}
              onExpand={onExpand}
              treeData={folderTree}
              rootStyle={{ fontSize: 20 }}
            />
          </>
        ) : null}

        {/* 编辑器部分，包裹进 AnimatePresence 和 motion.div */}
        {currentType === "article" &&
        isLoadingContent === false &&
        initContent !== undefined &&
        !isEditable ? (
          <AnimatePresence>
            <motion.div
              key="editor-view-only"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Editor
                key={222}
                initialContent={initContent}
                onChange={EditorChange}
                editable={false}
              />
            </motion.div>
          </AnimatePresence>
        ) : null}

        {currentType === "article" &&
        isLoadingContent === false &&
        content !== undefined &&
        isEditable ? (
          <AnimatePresence>
            <motion.div
              key="editor-editing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Editor
                key={111}
                initialContent={content}
                onChange={EditorChange}
                editable={isEditable}
              />
            </motion.div>
          </AnimatePresence>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
};

export default ArticleMainContent;
