import React, { useEffect, useState } from "react";
import styles from "./LeftModalDom.module.scss";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { Timeline as TimelineApp } from "antd";
import { getAllArticleInfo } from "../../api/article";
import { Navigate, UIMatch, useMatches, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { findFullPathByKey } from "../../router/utils/findFullPathByKey";

export default function Timeline() {
  const [timelineItems, setTimelineItems] = useState<any[]>([]);
  const navigate = useNavigate();
  const articleRoutesMap = useSelector(
    (state: RootState) => state.routesMap.articleRoutesMap
  );
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const res = await getAllArticleInfo();
    const data = res.data; // 假设返回的数据按年份分组

    const navigateArticle = (id: string) => {
      const path = "/Article/" + findFullPathByKey(articleRoutesMap, id);
      navigate(path || "");
    };

    const items = Object.entries(data).flatMap(([year, articles]) => [
      {
        children: (
          <div style={{ fontSize: "1.5em", fontWeight: "bold" }}>{year}</div>
        ),
        color: "blue", // 年份节点颜色
      },
      ...articles.map(
        (article: { title: string; updatedAt: string; _id: string }) => {
          // 格式化日期为月日
          const formattedDate = new Date(article.updatedAt).toLocaleDateString(
            undefined,
            { month: "2-digit", day: "2-digit" }
          );

          return {
            children: (
              <div
                onClick={() => navigateArticle(article._id)}
                style={{ display: "flex" }}
              >
                <div style={{ marginRight: 10 }}> {formattedDate}</div>
                <span style={{ fontWeight: "bold" }}>{article.title}</span>
              </div>
            ),
            color: "#2c3e50", // 普通节点颜色
          };
        }
      ),
    ]);

    setTimelineItems(items);
  };

  return (
    <div className={styles.starContainer}>
      <div className={styles.middleInfo}>
        <MdOutlineAccessTimeFilled className={styles.middleIcon} />
        <div className={styles.middleNum}>{70}</div>
        <div className={styles.middleText}>时间轴</div>
      </div>
      <div className={styles.main}>
        <TimelineApp style={{ textAlign: "start" }} items={timelineItems} />
      </div>
    </div>
  );
}
