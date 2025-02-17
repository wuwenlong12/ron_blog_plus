import React, { useRef } from "react";
import styles from "./Home.module.scss";
import bg from "../../assets/bg.png";
import ParticlesBg from "particles-bg";
import { Button } from "antd";
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
  const siteInfo = useSelector((state: RootState) => state.site.siteInfo);
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
      <div className={styles.mainInfo}>
        <div className={styles.title}>
          <Logo></Logo>
        </div>
        <div className={styles.svgImg}>
          <Coder style={{ width: "clamp(400px, 50.2vw, 800px)" }}></Coder>
        </div>
        <div className={styles.desc}>
          {siteInfo && siteInfo.homepage_signature.length > 0 && (
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
              {siteInfo.homepage_signature.map((message, index) => (
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
        <InfoList style={{ marginTop: 40 }}></InfoList>
        <BlogCard
          title="博客文章"
          desc="我的所思、所想，像模像样的文章..."
        ></BlogCard>
      </div>
    </div>
  );
};

export default Main;
