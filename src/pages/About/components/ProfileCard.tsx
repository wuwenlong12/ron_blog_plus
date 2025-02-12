import React from "react";
import styles from "./ProfileCard.module.scss";
import { FaGithub, FaTwitter, FaEnvelope, FaLinkedin } from "react-icons/fa";
import img from "../../../assets/logo.png";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
const ProfileCard: React.FC = () => {
  const { siteInfo } = useSelector((state: RootState) => state.site);
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card}>
        {/* 正面 */}
        <div className={styles.front}>
          <img className={styles.img} src={img} alt="" />
          <h1>Mr.Ron</h1>
          <h2>{siteInfo && siteInfo.profession}</h2>
          <p>{siteInfo && siteInfo.card_message}</p>
        </div>

        {/* 背面 */}
        <div className={styles.back}>
          <h2>联系我</h2>
          <p>{siteInfo && siteInfo.card_signature}</p>
          <div className={styles.icons}>
            <a
              href={siteInfo && siteInfo.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub />
            </a>

            <a href={`mailto:${siteInfo && siteInfo.email}`}>
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
