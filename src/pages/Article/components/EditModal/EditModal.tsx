import { Button, Input, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import {
  getDirectoryInfoById,
  patchFolderName,
} from "../../../../api/actical/actical";
import { DirectoryInfoById } from "../../../../api/actical/type";
import TextArea from "antd/es/input/TextArea";
import useRoutes from "../../../../router/useArticleRoutes";
import { RouteObject } from "react-router-dom";

interface EditModalProps {
  id: string;
  type: "article" | "folder";
  isShowfolderOrActicleInfoForm: boolean;
  setIsShowfolderOrActicleInfoForm: (value: boolean) => void;
  onSuccess: (name: string) => void;
}

const EditModal: React.FC<EditModalProps> = ({
  id,
  type,
  isShowfolderOrActicleInfoForm,
  setIsShowfolderOrActicleInfoForm,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [initInfo, setInitInfo] = useState<DirectoryInfoById | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const { loadArticleRoutes } = useRoutes();

  useEffect(() => {
    if (id) {
      init();
    }
  }, [id]);

  const init = async () => {
    setIsLoading(true);
    try {
      const res = await getDirectoryInfoById(id);
      setIsLoading(false);
      setInitInfo(res.data);
      setName(res.data.name); // 初始化名称
      setDesc(res.data.desc || ""); // 初始化描述
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to fetch directory info:", error);
    }
  };

  const handleSave = async () => {
    try {
      const res = await patchFolderName(id, name);
      console.log(res);

      if (res.code === 0) {
        // 更新路由配置
        await loadArticleRoutes();
        messageApi.success("保存成功！");
        onSuccess(name);
      } else {
        messageApi.error("保存失败，请稍后重试");
      }
    } catch (error) {
      console.error("保存失败:", error);
      messageApi.error("保存失败，请稍后重试");
    }

    // 假设我们保存成功后关闭 modal
    setIsShowfolderOrActicleInfoForm(false);
  };

  const handleCancel = () => {
    // 取消时关闭 modal
    setIsShowfolderOrActicleInfoForm(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDesc(e.target.value);
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={<p>{initInfo?.name}</p>}
        footer={
          <>
            <Button type="primary" onClick={handleSave} loading={isLoading}>
              保存
            </Button>
            <Button type="default" onClick={handleCancel}>
              取消
            </Button>
          </>
        }
        open={isShowfolderOrActicleInfoForm}
        onCancel={handleCancel}
        loading={isLoading}
      >
        <p>id: {id}</p>
        <Input
          style={{ marginTop: 10 }}
          showCount
          maxLength={20}
          value={name}
          onChange={handleNameChange}
          placeholder="请输入名称"
        />
        <TextArea
          style={{ marginTop: 10 }}
          showCount
          maxLength={100}
          value={desc}
          onChange={handleDescChange}
          placeholder="请输入描述"
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
        <div style={{ height: 20 }}></div>
      </Modal>
    </>
  );
};

export default EditModal;