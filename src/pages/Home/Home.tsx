import React from "react";
import styles from "./Home.module.scss";
import favicon from "../../assets/logo512.png";
const Main = () => {
  return (
    <div className={styles.container}>
      <div className={styles.mainInfo}>
        <img className={styles.icon} src={favicon} alt="" />
        <div className={styles.title}>Ron Blog</div>
        <div className={styles.desc}>走着走着天就亮了</div>
      </div>
    </div>
  );
};

export default Main;
