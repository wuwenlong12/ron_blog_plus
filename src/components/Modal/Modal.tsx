import { motion, AnimatePresence, Transition } from "framer-motion";
import React, { CSSProperties, ReactNode, useEffect } from "react";
import styles from "./Modal.module.scss";
import ThemeView from "../../themeComponent/themeView";
import { IoIosCloseCircle } from "react-icons/io";
import { Button } from "antd";

interface ModalProps {
  isShowModal: boolean;
  children: ReactNode; // 父组件传入的内容
  direction: "top" | "bottom" | "left" | "right" | "center"; // 弹窗滑动的方向
  onClose?: () => void; // 关闭弹窗的回调
  style?: CSSProperties;
  transition?: Transition | undefined;
}

const Modal: React.FC<ModalProps> = ({
  isShowModal,
  children,
  direction,
  onClose,
  style,
  transition,
}) => {
  // 定义不同方向的动画效果
  const directionVariants = {
    top: {
      initial: { y: "-100%" },
      animate: { y: 60 },
      exit: { y: "-100%" },
    },
    bottom: {
      initial: { opacity: 0, y: "100%" },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: "100%" },
    },
    left: {
      initial: { opacity: 0, x: "-100%", y: 60 },
      animate: { opacity: 1, x: 0, y: 60 },
      exit: { opacity: 0, x: "-100%", y: 60 },
    },
    right: {
      initial: { opacity: 0, x: "100%" },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: "100%" },
    },
    center: {
      initial: { opacity: 0, scale: 0.5 }, // 初始缩小且透明
      animate: { opacity: 1, scale: 1 }, // 放大到正常大小
      exit: { opacity: 0, scale: 0.5 }, // 缩小并淡出
    },
  };

  // 关闭时恢复页面滚动
  useEffect(() => {
    if (isShowModal) {
      document.body.style.overflow = "hidden"; // 禁止滚动
    } else {
      document.body.style.overflow = ""; // 恢复滚动
    }
  }, [isShowModal]);

  return (
    <AnimatePresence>
      <>
        {isShowModal ? (
          <motion.div
            className={styles.container}
            style={
              direction === "center"
                ? {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                  }
                : {}
            }
            initial="initial"
            animate="animate"
            exit="exit"
            variants={directionVariants[direction]} // 根据传入的 direction 使用不同的动画
            transition={transition}
          >
            <div className={styles.content} style={{ ...style }}>
              {direction === "center" ? (
                <>
                  <ThemeView
                    style={{
                      height: 32,
                      position: "relative",
                      borderRadius: "10px 10px 0 0",
                    }}
                    lightStyle={{
                      backgroundColor: "#eee",
                    }}
                    darkStyle={{
                      backgroundColor: "#1f1f1f",
                    }}
                  >
                    <Button
                      onClick={onClose}
                      style={{ position: "absolute", right: 0, zIndex: 10 }}
                      shape="circle"
                    >
                      <IoIosCloseCircle color="red" size={30} />
                    </Button>
                  </ThemeView>
                </>
              ) : null}

              {children}
            </div>
          </motion.div>
        ) : null}
      </>
    </AnimatePresence>
  );
};

export default Modal;
