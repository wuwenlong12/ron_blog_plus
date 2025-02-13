import React, { useRef } from "react";
import styles from "./About.module.scss";
import {
  FaGithub,
  FaTwitter,
  FaEnvelope,
  FaLinkedin,
  FaArrowDown,
  FaWeixin,
} from "react-icons/fa";
import { motion } from "framer-motion";
import ProfileCard from "./components/ProfileCard";
import img from "../../assets/logo.png";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Typist from "react-typist";
import Editor from "../../components/Editor/Editor";
import { Button } from "antd";
const About: React.FC = () => {
  const siteInfo = useSelector((state: RootState) => state.site.siteInfo);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const scrollToContent = () => {
    mainContentRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className={styles.container}>
      <div className={styles.topInfo}>
        <div className={styles.left}>
          {/* 个人简介 */}
          <section className={styles.hero}>
            <motion.img
              src={img}
              alt="Avatar"
              className={styles.avatar}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <h1>
              你好，我是
              <span className={styles.name}>
                {siteInfo && siteInfo.name}
              </span>{" "}
              👋
            </h1>
            {siteInfo && siteInfo.signatures.length > 0 && (
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
                {siteInfo.signatures.map((signature, index) => (
                  <div key={index}>
                    <p>{signature}</p>
                    <Typist.Delay ms={500} />
                  </div>
                ))}
              </Typist>
            )}
          </section>

          {/* 技术栈 */}
          <section className={styles.section}>
            <h2>🛠️ 技术栈</h2>
            <div className={styles.techStack}>
              {siteInfo &&
                siteInfo.tech_stack.map((tech) => (
                  <motion.div
                    key={tech}
                    className={styles.techItem}
                    whileHover={{ scale: 1.1 }}
                  >
                    {tech}
                  </motion.div>
                ))}
            </div>
          </section>
          {/* 联系方式 */}
          <section className={styles.section}>
            <h2>📬 联系方式</h2>
            <div className={styles.contact}>
              <a href={`mailto:${siteInfo && siteInfo.email}`}>
                <FaEnvelope /> Email
              </a>
              <a
                href={siteInfo && siteInfo.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub /> GitHub
              </a>
              {siteInfo?.wechat && (
                <a>
                  <FaWeixin /> {siteInfo.wechat}
                </a>
              )}
            </div>
          </section>
        </div>
        <div className={styles.right}>
          <ProfileCard></ProfileCard>
          <Button className={styles.rollBtn} onClick={scrollToContent}>
            <FaArrowDown className={styles.rollBtnIcon} />
          </Button>
        </div>
      </div>
      <div ref={mainContentRef} className={styles.bottomInfo}>
        {siteInfo && siteInfo.AboutContent.length > 0 && (
          <Editor
            initialContent={siteInfo && siteInfo.AboutContent}
            editable={false}
            isSummary={true}
          ></Editor>
        )}
      </div>
    </div>
  );
};

export default About;
