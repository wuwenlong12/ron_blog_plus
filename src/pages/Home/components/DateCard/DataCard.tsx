import React from "react";
import styles from "./CataCard.module.scss";
import { Carousel } from "antd";
import test from "../../../../assets/test.png";
export default function DataCard() {
  return (
    <div className={styles.container}>
      <div className={styles.cardList}>
        <div className={`${styles.card} ${styles.first}`}>
          <div className={styles.num}>213323</div>
          <div className={styles.desc}>总访问量</div>
        </div>
        <div className={`${styles.card} ${styles.second}`}>
          <div className={styles.num}>213323</div>
          <div className={styles.desc}>今日访问</div>
        </div>
      </div>
      <div className={styles.slider}>
        <Carousel dotPosition={"bottom"} autoplay>
          <div className={styles.sliderItem}>
            <div className={styles.title}>RON个人博客</div>
            <div className={styles.subTitle}>
              优雅的页面，功能完整，让知识更易浮现脑中
            </div>
            <div className={styles.desc}>
              首页，日记，文章，tag，树状文章路由，分享，基于BlockNode的富文本编辑...
            </div>
            {/* <img
              style={{
                width: "200px",
              }}
              src={test}
              alt=""
            /> */}
          </div>
          {/* <div className={styles.sliderItem}>2</div> */}
        </Carousel>
      </div>
    </div>
  );
}
