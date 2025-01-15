import React, { useEffect, useRef, useState } from "react";
import styles from "./Home.module.scss";
import favicon from "../../assets/logo.png";
import bg from "../../assets/bg.png";
import ParticlesBg from "particles-bg";
import { Button, Card, Pagination, PaginationProps } from "antd";
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
import Logo from "../../components/Logo";
import Coder from "../../assets/svg/Coder";
import Typist from "react-typist";
import "react-typist/dist/Typist.css";
import { FaArrowDown } from "react-icons/fa";
import DataCard from "./components/DateCard/DataCard";

const Main = () => {
  const [articles, setArticles] = useState<Articles[]>([]);
  const [pagination, setPagination] = useState<PaginationType>();
  const [currentPage, setCurrentPage] = useState(1);
  const articleRoutesMap = useSelector(
    (state: RootState) => state.routesMap.articleRoutesMap
  );
  const navigate = useNavigate();

  const mainContentRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    mainContentRef.current?.scrollIntoView({ behavior: "smooth" });
  };
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
      <div className={styles.bg}>
        <img className={styles.bgImg} src={bg} alt="" />
        <div className={styles.bgPar}>
          <ParticlesBg color="#fff" num={5} type="polygon" bg={false} />
        </div>
      </div>
      {/* <div className={styles.bg}></div> */}

      <div className={styles.mainInfo}>
        {/* <img className={styles.icon} src={favicon} alt="" /> */}
        <div className={styles.title}>
          <Logo></Logo>
        </div>
        <div className={styles.svgImg}>
          <Coder></Coder>
        </div>
        <div className={styles.desc}>
          <Typist
            avgTypingDelay={100}
            cursor={{
              show: true,
              blink: true,
              element: "_",
              hideWhenDone: false,
              hideWhenDoneDelay: 1000,
            }}
          >
            <p>把初心别在袖口，任世事如流。</p>
            <Typist.Delay ms={500} />
            <p>清风拂过，衣角翻卷间，那抹最初的颜色，永远醒目。</p>
          </Typist>
          <Button className={styles.rollBtn} onClick={scrollToContent}>
            <FaArrowDown className={styles.rollBtnIcon} />
          </Button>
        </div>
      </div>
      <div ref={mainContentRef} className={styles.main}>
        <DataCard></DataCard>
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
