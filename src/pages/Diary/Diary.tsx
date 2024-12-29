import React from "react";
import { Tree } from "antd";
import ParticlesBg from "particles-bg";
import styles from "./Diary.module.scss";
const { TreeNode } = Tree;

const MyTree: React.FC = () => {
  return (
    <div className={styles.container}>
      <ParticlesBg color="#fff" num={100} type="color" />
    </div>
  );
};

export default MyTree;
