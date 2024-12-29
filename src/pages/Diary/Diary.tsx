import React from "react";
import { Tree } from "antd";
import ParticlesBg from "particles-bg";
import styles from "./Diary.module.scss";
const { TreeNode } = Tree;

const MyTree: React.FC = () => {
  return (
    <div className={styles.container}>
      <ParticlesBg color="#fff" num={300} type="custom" />
    </div>
  );
};

export default MyTree;
