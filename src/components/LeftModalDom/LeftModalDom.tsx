import React, { useState } from "react";
import styles from "./LeftModalDom.module.scss";
import { Button, Tooltip } from "antd";
import { FaGrinStars, FaTags } from "react-icons/fa";
import { TiStarFullOutline } from "react-icons/ti";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import Star from "./Star";
import Timeline from "./Timeline";
import Tag from "./Tag";

// 定义按钮数据结构
interface ButtonData {
  key: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode; // 按钮对应的内容
}

const buttonData: ButtonData[] = [
  {
    key: "star",
    title: "星标",
    icon: <TiStarFullOutline />,
    content: <Star />,
  },
  { key: "tag", title: "标签", icon: <FaTags />, content: <Tag /> },
  {
    key: "timeline",
    title: "时间轴",
    icon: <MdOutlineAccessTimeFilled />,
    content: <Timeline />,
  },
];

const LeftModalDom: React.FC = () => {
  const [selectedButton, setSelectedButton] = useState<string>("star");

  const handleButtonClick = (key: string) => {
    setSelectedButton(key); // 切换选中状态
  };

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        {buttonData.map((btn) => (
          <Tooltip key={btn.key} placement="bottom" title={btn.title}>
            <Button
              className={styles.btnItem}
              type={selectedButton === btn.key ? "primary" : "default"} // 动态设置按钮类型
              shape="circle"
              onClick={() => handleButtonClick(btn.key)} // 点击事件
              icon={React.cloneElement(btn.icon as React.ReactElement, {
                className: styles.btnItemIcon,
              })}
            />
          </Tooltip>
        ))}
      </div>

      {/* 动态内容区域 */}
      <div className={styles.content}>
        <AnimatePresence>
          {selectedButton && (
            <motion.div
              key={selectedButton}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {buttonData.find((btn) => btn.key === selectedButton)?.content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LeftModalDom;
