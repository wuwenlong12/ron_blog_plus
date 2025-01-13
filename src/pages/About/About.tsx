import React from "react";
import { Tree } from "antd";
import ParticlesBg from "particles-bg";
import styles from "./About.module.scss";
import SelfInfoCard from "../../components/SelfInfoCard/SelfInfoCard";
import { RiBook2Line } from "react-icons/ri";

const MyTree: React.FC = () => {
  return (
    <div className={styles.container}>
      <ParticlesBg color="#fff" num={10} type="polygon" bg={true} />
      <div className={styles.leftNav}>
        <SelfInfoCard></SelfInfoCard>
      </div>
      <div className={styles.main}>
        <div className={styles.title}>About me</div>
        <div className={styles.introList}>
          <div className={styles.intro}>📚正在学习的独立开发者</div>
          <div className={styles.intro}>🪁有创意点子就会尝试</div>
          <div className={styles.intro}>🚗分享日常博客</div>
        </div>
        <hr />
        <div className={styles.projects}>
          <div className={styles.subTitle}>Project</div>
          <div className={styles.projectList}>
            <div className={styles.projectItem}>
              <RiBook2Line className={styles.leftIcon} />
              <div className={styles.projectInfo}>
                <div className={styles.projectTitle}>个人知识库</div>
                <div className={styles.desc}>
                  个人知识库是一个个人知识库是一个个人知识库是一个个人知识库是一个
                </div>
              </div>
            </div>
            <div className={styles.projectItem}>
              <RiBook2Line className={styles.leftIcon} />
              <div className={styles.projectInfo}>
                <div className={styles.projectTitle}>个人知识库</div>
                <div className={styles.desc}>
                  个人知识库是一个个人知识库是一个个人知识库是一个个人知识库是一个
                </div>
              </div>
            </div>
            <div className={styles.projectItem}>
              <RiBook2Line className={styles.leftIcon} />
              <div className={styles.projectInfo}>
                <div className={styles.projectTitle}>个人知识库</div>
                <div className={styles.desc}>
                  个人知识库是一个个人知识库是一个个人知识库是一个个人知识库是一个
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTree;
