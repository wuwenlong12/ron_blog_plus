import React, { useEffect, useRef, useState } from "react";
import styles from "./RightMenu.module.scss";
import { Menu, MenuProps, Modal, Input, QRCode, App } from "antd";
import {
  DeleteOutlined,
  FolderOutlined,
  ReadOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import {
  deleteDirectoryInfoById,
  postDirectoryInfoById,
} from "../../../../api/folder";
import useArticleRoutes from "../../../../router/useArticleRoutes";

type content = {
  visible: boolean;
  x: number;
  y: number;
  node: any | null;
};

interface RightMenuProps {
  contextMenu: content;
  setContextMenu: (content: content) => void;
}

const RightMenu: React.FC<RightMenuProps> = ({
  contextMenu,
  setContextMenu,
}) => {
  const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [newFolderName, setNewFolderName] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [QRurl, setQRurl] = useState("234243");
  const { loadArticleRoutes } = useArticleRoutes();
  const { message } = App.useApp();
  const menuItems = [
    {
      key: "create-folder",
      label: "新建文件夹",
      icon: <FolderOutlined />,
    },
    {
      key: "create-file",
      label: "新建文件",
      icon: <ReadOutlined />,
    },
    {
      key: "delete",
      label: "删除",
      icon: <DeleteOutlined />,
    },
    {
      key: "share",
      label: "分享",
      icon: <ShareAltOutlined />,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    setContextMenu({ ...contextMenu, visible: false });

    switch (e.key) {
      case "create-folder":
        handleCreateFolder();
        break;
      case "create-file":
        handleCreateFile();
        break;
      case "delete":
        handleDelete();
        break;
      case "share":
        handleShare();
        break;
      default:
        break;
    }
  };

  const handleCreateFolder = () => {
    setIsAddFolderModalOpen(true); // 打开新建文件夹弹出框
  };

  const handleCreateFile = () => {
    setIsAddFileModalOpen(true); // 打开新建文件弹出框
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true); // 打开删除确认弹出框
  };

  const handleShare = () => {
    setIsShareModalOpen(true); // 打开分享弹出框
  };

  const handleAddFolderOk = async () => {
    if (!newFolderName.trim()) {
      message.error("文件夹名称不能为空");
      return;
    }
    const parentFolderId = contextMenu.node ? contextMenu.node.key : null;

    const res = await postDirectoryInfoById(
      newFolderName.trim(),
      parentFolderId,
      "folder"
    );

    if (res.code === 0) {
      setIsAddFolderModalOpen(false);
      setNewFolderName(""); // 清空输入框
      message.success("文件夹已创建");
      loadArticleRoutes();
    } else {
      message.error("文件创建失败");
    }
  };

  const handleAddFileOk = async () => {
    if (!newFileName.trim()) {
      message.error("文件名称不能为空");
      return;
    }
    console.log(contextMenu);

    const parentFolderId = contextMenu.node ? contextMenu.node.key : null;

    const res = await postDirectoryInfoById(
      newFileName.trim(),
      parentFolderId,
      "article"
    );

    if (res.code === 0) {
      setIsAddFileModalOpen(false);
      setNewFileName(""); // 清空输入框
      message.success("文件已创建");
      loadArticleRoutes();
    } else {
      message.error("创建失败");
    }
  };

  const handleDeleteOk = async () => {
    const res = await deleteDirectoryInfoById(
      contextMenu.node.key,
      contextMenu.node.type
    );
    if (res.code === 0) {
      setIsDeleteModalOpen(false);
      message.success("删除成功");
      loadArticleRoutes();
    } else {
      message.error("删除失败");
    }
  };

  const handleShareOk = () => {
    setIsShareModalOpen(false);
    message.success("分享成功");
  };

  const closeAllModals = () => {
    setIsAddFolderModalOpen(false);
    setIsAddFileModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsShareModalOpen(false);
  };

  const menuRef = useRef<HTMLDivElement>(null);
  // 添加全局点击事件监听器
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu, setContextMenu]);

  return (
    <div
      className={`${styles.rightMenu}`}
      ref={menuRef}
      style={{
        top: `${contextMenu.y}px`,
        left: `${contextMenu.x}px`,
        display: contextMenu.visible ? "block" : "none",
      }}
    >
      <Menu
        onClick={handleMenuClick}
        selectable={false}
        items={menuItems.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
        }))}
      />

      {/* 新建文件夹弹出框 */}
      <Modal
        title="新建文件夹"
        open={isAddFolderModalOpen}
        onOk={handleAddFolderOk}
        onCancel={closeAllModals}
        okText="创建"
        cancelText="取消"
      >
        <Input
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="请输入文件夹名称"
        />
      </Modal>

      {/* 新建文件弹出框 */}
      <Modal
        title="新建文件"
        open={isAddFileModalOpen}
        onOk={handleAddFileOk}
        onCancel={closeAllModals}
        okText="创建"
        cancelText="取消"
      >
        <Input
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          placeholder="请输入文件名称"
        />
      </Modal>

      {/* 删除确认弹出框 */}
      <Modal
        title="确认删除"
        open={isDeleteModalOpen}
        onOk={handleDeleteOk}
        onCancel={closeAllModals}
        okType="danger"
        okText="删除"
        cancelText="取消"
      >
        <p>你确定要删除这个项目吗？</p>
      </Modal>

      {/* 分享弹出框 */}
      <Modal
        title="分享"
        open={isShareModalOpen}
        onOk={handleShareOk}
        onCancel={closeAllModals}
        okText="分享"
        cancelText="取消"
      >
        <p>请输入分享链接或进行其他分享操作</p>
        <QRCode
          errorLevel="H"
          value={QRurl}
          icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        />
      </Modal>
    </div>
  );
};

export default RightMenu;