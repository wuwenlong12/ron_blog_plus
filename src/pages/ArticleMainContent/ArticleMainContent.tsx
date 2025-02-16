import { Input, Button, App, Tooltip, Modal, QRCode, FloatButton } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  RouteObject,
  useLocation,
  useMatches,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { MdDelete, MdUpdate } from "react-icons/md";
import { RiBook2Line, RiSendPlaneFill } from "react-icons/ri";
import styles from "./ArticleMainContent.module.scss";
import {
  deleteDirectoryInfoById,
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
import { findFullPathByKey } from "../../router/utils/findFullPathByKey";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";

import { Tree } from "antd";
import type { GetProps, TreeDataNode } from "antd";
import { loadArticleRoutes, setSelectedKey } from "../../store/routersMapSlice";
import {
  getArticleContentById,
  updateArticleContentById,
  updateArticleTagsById,
} from "../../api/article";
import Editor, { EditorRef } from "../../components/Editor/Editor";
import { PartialBlock } from "@blocknote/core";
import { FaClock, FaMarkdown, FaTags } from "react-icons/fa";
import { downloadMarkdown } from "../../utils/downloadMarkdown";
import { formatTimestampToDay, formatTimestampToTime } from "../../utils/date";
import { IoFolderOutline } from "react-icons/io5";
import { tag } from "../../api/tag/type";
import DesField from "./DesField";
import {
  findRouterMatches,
  parsePath,
} from "../../router/utils/findRouterMatches";
import { debounce } from "lodash";
import { de } from "@blocknote/core/types/src/i18n/locales";
import {
  FaDownload,
  FaShareAlt,
  FaEdit,
  FaPaperPlane,
  FaEllipsisV, // 替换 MoreOutlined
} from "react-icons/fa";
import ChooseTag from "../../components/ChooseTag";

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;

interface ArticleMainContentProps {
  id: string; // 使用 motionKey 来避免与 React 内置的 key 属性冲突
}

const ArticleMainContent: React.FC<ArticleMainContentProps> = ({ id }) => {
  const { message } = App.useApp();
  const breadcrumbRef = useRef<any>(null);
  const location = useLocation();
  const [currentId, setCurrentId] = useState("");
  const [currentType, setCurrentType] = useState<"article" | "folder">(
    "folder"
  );
  const [isEditNameing, setIsEditNameing] = useState(false);
  const [isEditDescing, setIsEditDescing] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [createdAt, setCreatedAt] = useState<Date>();
  const [updatedAt, setUpdatedAt] = useState<Date>();
  const [tags, setTags] = useState<tag[]>([]);

  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [initContent, setInitContent] = useState<PartialBlock[] | undefined>(
    undefined
  );
  const [content, setContent] = useState<PartialBlock[] | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const editorRef = useRef<EditorRef>(null);

  const dispatch = useDispatch<AppDispatch>();
  const articleRoutesMap = useSelector(
    (state: RootState) => state.routesMap.articleRoutesMap
  );
  const routesMap = useSelector(
    (state: RootState) => state.routesMap.routesMap
  );
  // const [folderTree,setFolderTree] = useState<TreeDataNode[]>([])
  const navigate = useNavigate();
  const [isButtonsVisible, setIsButtonsVisible] = useState(false);

  useEffect(() => {
    const pathArray = parsePath(location.pathname).slice(1);
    if (pathArray.length === 0) {
      setCurrentId("default-index");
      setCurrentType("folder");
      return;
    }
    const cur = findRouterMatches(pathArray, articleRoutesMap);
    const curItem = cur[cur.length - 1];
    setCurrentId(curItem.key);
    setCurrentType(curItem.type as "article" | "folder");
  }, [location]);
  // 当searchParams变化时，重新加载数据
  useEffect(() => {
    if (currentId) {
      initalizeData();
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
            Icon: <HomeOutlined />,
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
    const transformToTreeData = (
      node: RouteObject,
      level: number = 0 // 添加层级参数，默认为 0
    ): TreeDataNode => {
      return {
        title: (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {node.handle.type === "folder" ? (
                <IoFolderOutline style={{ marginRight: 10 }} />
              ) : (
                <RiBook2Line style={{ marginRight: 10 }} />
              )}
              <div
                style={{
                  fontSize: 18 - level, // 不同层级不同字体大小
                  // color: level === 0 ? "#000" : "#555", // 不同层级不同颜色
                  // borderBottom: level === 0 ? "1px solid #000" : "none",
                }}
              >
                {node.handle.label}
              </div>
            </div>
          </>
        ),
        key: node.handle?.key || "",
        isLeaf: !node.children || node.children.length === 0,
        children: node.children
          ? node.children.map((child) => transformToTreeData(child, level + 1)) // 递归传递层级
          : undefined,
      };
    };

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
    if (id === "default-index") {
      setName("欢迎来到我的个人知识库");
      setDesc(
        "这里是我珍藏的知识笔记，记录着我在学习和探索过程中积累的经验、见解和灵感。无论是技术要点、实践技巧，还是解决问题的思路，这里都承载着我的成长轨迹。希望这些笔记不仅能帮助我回顾和巩固知识，也能为未来的探索提供指引。"
      );
      return;
    }

    if (currentType === "folder") {
      const res = await getDirectoryInfoById(id);
      if (res.code === 0) {
        setName(res.data.name);
        setDesc(res.data.desc);
        setCreatedAt(res.data.createdAt);

        setUpdatedAt(res.data.updatedAt);
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
        setInitContent(res.data.content);

        setTags(res.data.tags || []);
        setCreatedAt(res.data.createdAt);

        setUpdatedAt(res.data.updatedAt);

        setIsLoadingContent(false);
        if (!curJson) setContent(res.data.content);
      } else {
        message.error("加载数据失败，请稍后重试");
      }
    }
  };

  const initalizeData = () => {
    setTags([]);
    setInitContent(undefined);
    setIsEditDescing(false);
    setIsEditNameing(false);
  };
  // 结束后更新数据
  const handleAnimationComplete = () => {
    if (breadcrumbRef.current) {
      breadcrumbRef.current.updateInfo(); // 调用子组件中的 updateInfo 方法
    }
  };

  const saveFoldName = async () => {
    try {
      const res = await patchFolderName(currentId, name, currentType);
      if (res.code === 0) {
        // 更新路由配置
        await dispatch(loadArticleRoutes);
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
        await dispatch(loadArticleRoutes);

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

  const EditorChange = debounce((content: any) => {
    if (isEditable) {
      setContent(content);
      localStorage.setItem(currentId, JSON.stringify({ content }));
      message.success("自动保存成功！");
    }
  }, 1000);

  const deleteFolderOrArticle = () => {};
  const publishArticle = async () => {
    const res = await updateArticleContentById({
      id: currentId,
      content,
    });

    if (res.code === 0) {
      setIsEditable(false);
      setInitContent(content);
      localStorage.removeItem(currentId);
    }
  };
  const blocksToMarkdown = () => {
    if (editorRef.current) {
      editorRef.current.blocksToMarkdown(name); // 调用 Editor 中暴露的方法
    }
  };
  const handleDelete = () => {
    setIsDeleteModalOpen(true); // 打开删除确认弹出框
  };

  const handleShare = () => {
    setIsShareModalOpen(true); // 打开分享弹出框
  };
  const handleDeleteOk = async () => {
    const res = await deleteDirectoryInfoById(currentId, currentType);
    if (res.code === 0) {
      navigate("/Article");
      setIsDeleteModalOpen(false);
      message.success("删除成功");
      dispatch(loadArticleRoutes);
    } else {
      message.error("删除失败");
    }
  };

  const handleShareOk = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        message.success("URL已复制到剪贴板");
      })
      .catch((err) => {
        message.error("复制失败：" + err);
      });
    setIsShareModalOpen(false);
  };
  const editTags = async (tags: tag[]) => {
    const res = await updateArticleTagsById({
      id: currentId,
      tags,
    });
    if (res.code === 0) {
      setTags(tags);
      message.success("保存成功");
    } else {
      message.error("保存失败");
    }
  };
  return (
    <AnimatePresence>
      <motion.div
        className={styles.container}
        key={currentId}
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
            {currentId !== "default-index" && isAuthenticated && (
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
            )}
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
              <span>{name ? name : "未命名"}</span>
            )}
          </div>
        </div>

        <FloatButton.Group
          trigger="hover"
          type="default"
          style={{ insetInlineEnd: 24, insetBlockEnd: 24 }}
          icon={<FaEllipsisV />}
          open={isButtonsVisible}
          onOpenChange={setIsButtonsVisible}
        >
          {currentType === "article" && (
            <FloatButton
              className={styles.downloadBtn}
              style={{ backgroundColor: "#52c41a" }}
              icon={<FaDownload />}
              onClick={blocksToMarkdown}
              tooltip="下载 Markdown"
            />
          )}
          <FloatButton
            className={styles.shareBtn}
            style={{ backgroundColor: "#722ed1" }}
            icon={<FaShareAlt />}
            onClick={handleShare}
            tooltip="分享文章"
          />
          {currentType === "article" &&
            isAuthenticated &&
            (isEditable ? (
              <FloatButton
                className={styles.publishBtn}
                style={{ backgroundColor: "#1890ff" }}
                onClick={publishArticle}
                icon={<FaPaperPlane />}
                tooltip="发布文章"
              />
            ) : (
              <FloatButton
                className={styles.editBtn}
                style={{ backgroundColor: "#fa8c16" }}
                onClick={() => setIsEditable(true)}
                icon={<FaEdit />}
                tooltip="编辑文章"
              />
            ))}
        </FloatButton.Group>

        {!isEditable ? (
          <DesField
            key={Math.random()}
            updatedAt={updatedAt}
            createdAt={createdAt}
            initTags={tags}
          ></DesField>
        ) : null}

        {isEditable ? (
          <ChooseTag mode="select" onChange={(e) => editTags(e)}></ChooseTag>
        ) : null}
        <hr className={styles.hr} />
        {currentType === "folder" ? (
          <div className={styles.desc}>
            {currentId !== "default-index" && isAuthenticated && (
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
            )}
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
                ref={editorRef}
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
                ref={editorRef}
                initialContent={content}
                onChange={EditorChange}
                editable={isEditable}
              />
            </motion.div>
          </AnimatePresence>
        ) : null}
        {/* <Modal
          title="确认删除"
          open={isDeleteModalOpen}
          onOk={handleDeleteOk}
          onCancel={() => setIsDeleteModalOpen(false)}
          okType="danger"
          okText="删除"
          cancelText="取消"
        >
          <p>你确定要删除这个项目吗？</p>
        </Modal> */}

        {/* 分享弹出框 */}
        <Modal
          title="分享"
          open={isShareModalOpen}
          onOk={handleShareOk}
          onCancel={() => setIsShareModalOpen(false)}
          okText="分享"
          cancelText="取消"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p>扫码或者点击分享复制链接</p>
            <QRCode
              errorLevel="H"
              value={window.location.href}
              icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            />
          </div>
        </Modal>
      </motion.div>
      {/* 删除确认弹出框 */}
    </AnimatePresence>
  );
};

export default ArticleMainContent;
