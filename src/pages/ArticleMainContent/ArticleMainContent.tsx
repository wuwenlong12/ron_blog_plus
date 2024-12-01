import { Input, Form, Button, Space, message } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./ArticleMainContent.module.scss";
import { getDirectoryInfoById, patchFolderInfo } from "../../api/actical/actical";
import { useSearchParams } from "react-router-dom";
import AppBreadcrumb from "../../components/Breadcrumb/Breadcrumb";

const EditFolderInfo = () => {
  const [searchParams] = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    init();
  }, [searchParams]);

  const init = async () => {
    const id = searchParams.get("id");
    if (!id) return;
      const res = await getDirectoryInfoById(id);
  };

  const handleSubmit = async (values: { name: string; desc: string }) => {
    const id = searchParams.get("id");
    if (!id) return;

    try {
      const res = await patchFolderInfo(id, values.name, values.desc);
      if (res.code === 0) {
        messageApi.success("修改成功");
      } else {
        messageApi.error("修改失败，请稍后重试");
      }
    } catch (error) {
      messageApi.error("网络错误，请稍后再试");
    }
  };

  return (
    <div className={styles.container}>
      {contextHolder}
      <AppBreadcrumb isDarkMode={true}></AppBreadcrumb>
    </div>
  );
};

export default EditFolderInfo;