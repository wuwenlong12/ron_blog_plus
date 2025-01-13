import React, { useEffect, useState } from "react";
import styles from "./Home.module.scss";
import favicon from "../../assets/logo.png";
import ParticlesBg from "particles-bg";
import { Card, Pagination, PaginationProps } from "antd";
import LeftModalDom from "../../components/LeftModalDom/LeftModalDom";
import { getArticleSummary } from "../../api/article";
import { PartialBlock } from "@blocknote/core";
import { Articles } from "../../api/article/type";
import Editor from "../../components/Editor/Editor";
import ChooseTag from "../../components/ChooseTag";
import DesField from "../ArticleMainContent/DesField";
import SelfInfoCard from "../../components/SelfInfoCard/SelfInfoCard";
import { Pagination as PaginationType } from "../../api/diary/type";
import { AnimatePresence, motion } from "framer-motion";
import { findFullPathByKey } from "../../router/utils/findFullPathByKey";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Main = () => {
  const [articles, setArticles] = useState<Articles[]>([]);
  const [pagination, setPagination] = useState<PaginationType>();
  const [currentPage, setCurrentPage] = useState(1);
  const articleRoutesMap = useSelector(
    (state: RootState) => state.routesMap.articleRoutesMap
  );
  const navigate = useNavigate();
  useEffect(() => {
    init();
  }, [currentPage]);
  const init = async () => {
    const res = await getArticleSummary(currentPage);
    setArticles(res.data.articles);
    setPagination(res.data.pagination);
  };
  const paginationChange: PaginationProps["onChange"] = (page) => {
    setCurrentPage(page);
    init();
  };
  const navigateArticle = (id: string) => {
    const path = "/Article/" + findFullPathByKey(articleRoutesMap, id);
    navigate(path || "");
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
        <AnimatePresence>
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            // exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={styles.leftCardList}
          >
            {articles.map((item, index) => (
              <div
                key={item._id}
                className={styles.leftCard}
                onClick={() => navigateArticle(item._id)}
              >
                <div className={styles.leftCardTopImage}></div>
                <div style={{ padding: 20 }}>
                  <div className={styles.cardTitle}>{item.title}</div>
                  <hr className={styles.hr} />
                  <Editor
                    isSummary={true}
                    initialContent={item.summary}
                    editable={false}
                  ></Editor>
                  <DesField
                    initTags={item.tags}
                    createdAt={item.createdAt}
                    updatedAt={item.updatedAt}
                  ></DesField>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className={styles.rightCardList}>
          <div className={styles.rightCardItem}>
            <SelfInfoCard></SelfInfoCard>
          </div>
          <div className={styles.rightCardItem}>
            <LeftModalDom></LeftModalDom>
          </div>
        </div>
      </div>
      <Pagination
        style={{ marginBottom: 20 }}
        align="center"
        onChange={paginationChange}
        defaultCurrent={1}
        total={pagination?.total}
      />
    </div>
  );
};

export default Main;
