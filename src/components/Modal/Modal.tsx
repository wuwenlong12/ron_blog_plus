import { motion, AnimatePresence, Transition } from "framer-motion";
import React, { CSSProperties, ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.scss";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { closeModal } from "../../store/modalSlice";

interface ModalProps {
  isShowModal: boolean;
  children: ReactNode; // 父组件传入的内容
  direction: "top" | "bottom" | "left" | "right"; // 弹窗滑动的方向
  onClose?: () => void; // 关闭弹窗的回调
  style?: CSSProperties;
  transition?: Transition | undefined;
}

const Modal: React.FC<ModalProps> = ({
  isShowModal,
  children,
  direction,
  onClose,
  transition,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const modalContainer = document.getElementById("modal-root");

  useEffect(() => {
    if (isShowModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isShowModal]);

  if (!modalContainer) {
    return null;
  }

  const dispatchEvent = () => {
    dispatch(closeModal());
  };

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

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isShowModal && (
        <>
          {/* 遮罩层移到外面，确保不受动画影响 */}
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dispatchEvent}
          />

          {/* 内容区域 */}
          <motion.div
            className={styles.container}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={directionVariants[direction]}
            transition={transition}
          >
            <div className={styles.content}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    modalContainer
  );
};

export default Modal;
