import React, { useEffect, useState } from "react";
import styles from "./Home.module.scss";
import favicon from "../../assets/logo.png";
import ParticlesBg from "particles-bg";
import { Card } from "antd";
import LeftModalDom from "../../components/LeftModalDom/LeftModalDom";
import { getArticleSummary } from "../../api/article";
import { PartialBlock } from "@blocknote/core";
import { Articles } from "../../api/article/type";
import Editor from "../../components/Editor/Editor";
import ChooseTag from "../../components/ChooseTag";
import DesField from "../ArticleMainContent/DesField";
import SelfInfoCard from "../../components/SelfInfoCard/SelfInfoCard";

const Main = () => {
  const [articles, setArticles] = useState<Articles[]>([]);
  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    const res = await getArticleSummary(0, 10);
    setArticles(res.data.articles);
  };
  return (
    <div className={styles.container}>
      <ParticlesBg color="#fff" num={100} type="color" bg={true} />
      <div className={styles.mainInfo}>
        <img className={styles.icon} src={favicon} alt="" />
        <div className={styles.title}>Ron Blog</div>
        <div className={styles.desc}>求offer！！！！</div>
      </div>
      <div className={styles.main}>
        <div className={styles.leftCardList}>
          {articles.map((item, index) => (
            <div key={item._id} className={styles.leftCard}>
              <div className={styles.cardTitle}>{item.title}</div>
              <hr className={styles.hr} />
              <Editor
                isSummary={true}
                initialContent={item.summary}
                editable={false}
              ></Editor>
              <DesField
                tags={item.tags}
                createdAt={item.createdAt}
                updatedAt={item.updatedAt}
              ></DesField>
            </div>
          ))}
        </div>
        <div className={styles.rightCardList}>
          <div className={styles.rightCardItem}>
            <SelfInfoCard></SelfInfoCard>
          </div>
          <div className={styles.rightCardItem}>
            <LeftModalDom></LeftModalDom>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
