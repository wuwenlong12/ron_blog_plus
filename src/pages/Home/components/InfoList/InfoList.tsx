import React, { ReactElement } from "react";
import styles from "./Infolist.module.scss";
import { Button } from "antd";
import { FcLike } from "react-icons/fc";
type Project = {
  title: string;
  imgUrl: string;
  date: string;
  classify: string;
  like: number;
  clickUrl: string;
};

interface InfoListProps {
  title: string;
  desc: string;
  infos: Project[];
  style?: React.CSSProperties;
}
const InfoList: React.FC<InfoListProps> = ({ title, desc, infos, style }) => {
  return (
    <div style={style} className={styles.container}>
      <div className={styles.top}>
        <div className={styles.title}>{title}</div>
        <div className={styles.desc}>{desc}</div>
      </div>
      <div className={styles.list}>
        {infos.map((info) => (
          <div className={styles.projectCard}>
            <img className={styles.img} src={info.imgUrl} alt="" />
            <div className={styles.title}>{info.title}</div>
            <div className={styles.date}>{info.date}</div>
            <div className={styles.classify}>{info.classify}</div>
            <div className={styles.bottomBtn}>
              <Button icon={<FcLike />} className={styles.leftBtn}>
                {info.like}
              </Button>
              <Button className={styles.rightBtn}>瞧一瞧</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default InfoList;
