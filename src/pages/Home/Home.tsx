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
import InfoList from "./components/InfoList/InfoList";
import BlogCard from "./components/BlogCard/BlogCard";

const Main = () => {
  const mainContentRef = useRef<HTMLDivElement>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const scrollToContent = () => {
    mainContentRef.current?.scrollIntoView({ behavior: "smooth" });
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
          <Coder style={{ width: "clamp(400px, 50.2vw, 800px)" }}></Coder>
        </div>
        <div className={styles.desc}>
          {user.explain.length > 0 && (
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
              {user.explain.map((message, index) => (
                <div key={index}>
                  <p>{message}</p>
                  <Typist.Delay ms={500} />
                </div>
              ))}
            </Typist>
          )}
          <Button className={styles.rollBtn} onClick={scrollToContent}>
            <FaArrowDown className={styles.rollBtnIcon} />
          </Button>
        </div>
      </div>

      <div ref={mainContentRef} className={styles.main}>
        <DataCard></DataCard>
        <InfoList
          title="项目产品"
          desc="设计及开发项目总结，不限于开发完成的项目，包括一些产品概念..."
          infos={[
            {
              title: "RONBLOG1.0",
              imgUrl: "https://huohuo90.com:3001/files/1730124974492.jpg",
              date: " 2024-10-28",
              classify: " react/express",
              like: 28,
              clickUrl: "www.baidu.com",
            },
            {
              title: "RONBLOG1.0",
              imgUrl: "https://huohuo90.com:3001/files/1730124514106.jpg",
              date: " 2024-10-28",
              classify: " react/express",
              like: 28,
              clickUrl: "www.baidu.com",
            },
            {
              title: "RONBLOG1.0",
              imgUrl: "https://huohuo90.com:3001/files/1730124514106.jpg",
              date: " 2024-10-28",
              classify: " react/express",
              like: 28,
              clickUrl: "www.baidu.com",
            },
          ]}
          style={{ marginTop: 40 }}
        ></InfoList>
        <BlogCard
          title="博客文章"
          desc="我的所思、所想，像模像样的文章..."
        ></BlogCard>

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
