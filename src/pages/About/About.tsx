import React from "react";
import { Tree } from "antd";
import ParticlesBg from "particles-bg";
import styles from "./About.module.scss";

const MyTree: React.FC = () => {
  return (
    <div className={styles.container}>
      <ParticlesBg color="#fff" num={10} type="polygon" bg={true} />
    </div>
  );
};

export default MyTree;
