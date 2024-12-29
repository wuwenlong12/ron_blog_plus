import React from "react";
import { RiBook2Line } from "react-icons/ri";
import styles from "./LeftModalDom.module.scss";
export default function Star() {
  return (
    <div className={styles.starContainer}>
      <div className={styles.middleInfo}>
        <RiBook2Line className={styles.middleIcon} />
        <div className={styles.middleNum}>{70}</div>
        <div className={styles.middleText}>文章</div>
      </div>
    </div>
  );
}
