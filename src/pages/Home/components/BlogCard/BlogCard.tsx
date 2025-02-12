import React, { ReactElement, useEffect, useState } from "react";
import styles from "./BlogCard.module.scss";
import { Button, Pagination, PaginationProps, Empty } from "antd";
import { Articles } from "../../../../api/article/type";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { Pagination as PaginationType } from "../../../../api/diary/type";
import { AnimatePresence, motion } from "framer-motion";
import { getArticleSummary } from "../../../../api/article";
import { findFullPathByKey } from "../../../../router/utils/findFullPathByKey";
import DesField from "../../../ArticleMainContent/DesField";
import Editor from "../../../../components/Editor/Editor";
import { useNavigate } from "react-router-dom";
import { TiStarFullOutline } from "react-icons/ti";

interface InfoListProps {
  title: string;
  desc: string;
  style?: React.CSSProperties;
}
const BlogCard: React.FC<InfoListProps> = ({ title, desc, style }) => {
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
  const navigateArticle = (id: string) => {
    const path = "/Article/" + findFullPathByKey(articleRoutesMap, id);
    navigate(path || "");
  };
  const paginationChange: PaginationProps["onChange"] = (page) => {
    setCurrentPage(page);
    init();
  };
  return (
    <div style={style} className={styles.container}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.title}>{title}</div>
          <div className={styles.desc}>{desc}</div>
        </div>
        {articles.length > 0 && (
          <Button className={styles.rightBtn}>更多</Button>
        )}
      </div>

      <AnimatePresence>
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          // exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={styles.cardList}
        >
          {articles.length > 0 ? (
            articles.map((item, index) => (
              <div
                key={item._id}
                className={styles.card}
                onClick={() => navigateArticle(item._id)}
              >
                <div className={styles.cardTopImage}></div>
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
                <div className={styles.bottomBtn}>
                  <Button
                    icon={<TiStarFullOutline />}
                    className={styles.leftBtn}
                  >
                    星标
                  </Button>
                  <Button className={styles.rightBtn}>阅读/复习</Button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyContainer}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className={styles.emptyContent}>
                    <p className={styles.emptyText}>作者还没有发布任何文章</p>
                    <p className={styles.emptySubText}>先去看看其他内容吧~</p>
                  </div>
                }
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* {articles.length > 0 && (
        <Pagination
          style={{ marginTop: 30 }}
          align="center"
          onChange={paginationChange}
          defaultCurrent={1}
          total={pagination?.total}
        />
      )} */}
    </div>
  );
};
export default BlogCard;
