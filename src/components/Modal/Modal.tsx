import { motion, AnimatePresence, Transition } from 'framer-motion';
import React, { CSSProperties, ReactNode, useEffect } from 'react';
import styles from './Modal.module.scss';
import ThemeView from '../../themeComponent/themeView';

interface ModalProps {
  isShowModal: boolean;
  children: ReactNode; // 父组件传入的内容
  direction: 'top' | 'bottom' | 'left' | 'right'; // 弹窗滑动的方向
  onClose?: () => void; // 关闭弹窗的回调
  style?:CSSProperties;
  transition?: Transition | undefined
}

const Modal: React.FC<ModalProps> = ({ isShowModal, children, direction, onClose,style,transition }) => {
  // 定义不同方向的动画效果
  const directionVariants = {
    top: {
      initial: { opacity: 0, y: '-100%' },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: '-100%' },
    },
    bottom: {
      initial: { opacity: 0, y: '100%' },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: '100%' },
    },
    left: {
      initial: { opacity: 0, x: '-100%' },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: '-100%' },
    },
    right: {
      initial: { opacity: 0, x: '100%' },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: '100%' },
    },
  };

  // 关闭时恢复页面滚动
  useEffect(() => {
    if (isShowModal) {
      document.body.style.overflow = 'hidden'; // 禁止滚动
    } else {
      document.body.style.overflow = ''; // 恢复滚动
    }
  }, [isShowModal]);

  return (
    <AnimatePresence>
      {isShowModal && (
        <motion.div
          className={styles.container} // 遮罩层
          initial="initial"
          animate="animate"
          exit="exit"
          variants={directionVariants[direction]} // 根据传入的 direction 使用不同的动画
          transition={transition}
        >
          <ThemeView className={styles.content} style={style}>{children}</ThemeView>
        </motion.div>
      )}

     
    </AnimatePresence>
  );
};

export default Modal;
