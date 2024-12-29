import React from "react";
import styles from "./Home.module.scss";
import favicon from "../../assets/logo.png";
import ParticlesBg from "particles-bg";
const Main = () => {
  return (
    <div className={styles.container}>
      <ParticlesBg color="#fff" num={100} type="color" bg={true} />
      <div className={styles.mainInfo}>
        <img className={styles.icon} src={favicon} alt="" />
        <div className={styles.title}>Ron Blog</div>
        <div className={styles.desc}>求offer！！！！</div>
      </div>
    </div>
  );
};

export default Main;
