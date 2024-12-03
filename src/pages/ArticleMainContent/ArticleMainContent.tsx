import { Input, Form, Button, Space, message, Breadcrumb } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';
import styles from "./ArticleMainContent.module.scss";
import { getDirectoryInfoById, patchFolderInfo } from "../../api/actical/actical";
import AppBreadcrumb from "../../components/Breadcrumb/Breadcrumb";

interface ArticleMainContentProps {
  motionKey: string; // 使用 motionKey 来避免与 React 内置的 key 属性冲突
}

const ArticleMainContent: React.FC<ArticleMainContentProps> = ({ motionKey }) => {
  const [searchParams] = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [directoryInfo, setDirectoryInfo] = useState<{ name: string; desc: string } | null>(null);
  const breadcrumbRef = useRef<any>(null);
  // 当searchParams变化时，重新加载数据
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      init(id);
    }
  }, [searchParams]);

  // 初始化目录信息
  const init = async (id: string) => {
    try {
      const res = await getDirectoryInfoById(id);
      if (res.code === 0) {
        setDirectoryInfo({ name: res.data.name, desc: res.data.desc });
      } else {
        messageApi.error("加载数据失败，请稍后重试");
      }
    } catch (error) {
      messageApi.error("网络错误，请稍后再试");
    }
  };

  const handleSubmit = async (values: { name: string; desc: string }) => {
    const id = searchParams.get("id");
    if (!id) return;

    try {
      const res = await patchFolderInfo(id, values.name, values.desc);
      if (res.code === 0) {
        messageApi.success("修改成功");
        // 更新数据以触发动画
        setDirectoryInfo({ name: values.name, desc: values.desc });
      } else {
        messageApi.error("修改失败，请稍后重试");
      }
    } catch (error) {
      messageApi.error("网络错误，请稍后再试");
    }
  };
  // 动画结束后更新数据
  const handleAnimationComplete = () => {
    if (breadcrumbRef.current) {
      breadcrumbRef.current.updateInfo();  // 调用子组件中的 updateInfo 方法
    }
   
  };
  return (
    <AnimatePresence>
      <motion.div
        className={styles.container}
        key={motionKey}  // 使用 motionKey 来确保动态变化时触发组件重新渲染
        layout
        initial={{ opacity: 0,  }}
        animate={{ opacity: 1,  }}
        exit={{ opacity: 0,  }}
        transition={{ duration: 0.5 }}
        onAnimationComplete={handleAnimationComplete}
      >
        {contextHolder}
        <AppBreadcrumb isDarkMode={true}></AppBreadcrumb> 
        

      </motion.div>
    </AnimatePresence>
  );
};

export default ArticleMainContent;
