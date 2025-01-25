import React from "react";
import styles from "./ProfileCard.module.scss";
import { FaGithub, FaTwitter, FaEnvelope, FaLinkedin } from "react-icons/fa";
import img from "../../../assets/logo.png";
const ProfileCard: React.FC = () => {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card}>
        {/* 正面 */}
        <div className={styles.front}>
          <img className={styles.img} src={img} alt="" />
          <h1>Mr.Ron</h1>
          <h2>前端开发工程师</h2>
          <p>热爱 Web 技术，致力于打造高质量应用</p>
        </div>

        {/* 背面 */}
        <div className={styles.back}>
          <h2>联系我</h2>
          <p>欢迎交流前端开发、技术架构、开源项目等内容！</p>
          <div className={styles.icons}>
            <a
              href="https://github.com/your-profile"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub />
            </a>
            <a
              href="https://linkedin.com/in/your-profile"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://twitter.com/your-profile"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
            <a href="mailto:your.email@example.com">
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
