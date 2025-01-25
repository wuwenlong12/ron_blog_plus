import React from "react";
import styles from "./About.module.scss";
import { FaGithub, FaTwitter, FaEnvelope, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import ProfileCard from "./components/ProfileCard";
import img from "../../assets/logo.png";
const About: React.FC = () => {
  return (
    <div className={styles.container}>
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
            你好，我是 <span className={styles.name}>你的名字</span> 👋
          </h1>
          <p>一名前端开发者，热爱 Web 技术，专注于打造优雅的用户体验。</p>
        </section>

        {/* 技术栈 */}
        <section className={styles.section}>
          <h2>🛠️ 技术栈</h2>
          <div className={styles.techStack}>
            {[
              "React",
              "TypeScript",
              "Next.js",
              "Vite",
              "Node.js",
              "MongoDB",
            ].map((tech) => (
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
            <a href="mailto:your@email.com">
              <FaEnvelope /> Email
            </a>
            <a href="https://github.com/yourgithub">
              <FaGithub /> GitHub
            </a>
          </div>
        </section>
      </div>

      <ProfileCard></ProfileCard>
    </div>
  );
};

export default About;
