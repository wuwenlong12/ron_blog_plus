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

interface FavoriteArticle {
  _id: string;
  title: string;
}

const FAVORITES_KEY = "article_favorites";

const BlogCard: React.FC<InfoListProps> = ({ title, desc, style }) => {
  const [articles, setArticles] = useState<Articles[]>([]);
  const [favorites, setFavorites] = useState<FavoriteArticle[]>([]);
  const [pagination, setPagination] = useState<PaginationType>();
  const [currentPage, setCurrentPage] = useState(1);
  const articleRoutesMap = useSelector(
    (state: RootState) => state.routesMap.articleRoutesMap
  );
  const navigate = useNavigate();
  useEffect(() => {
    init();
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, [currentPage]);
  const init = async () => {
    const res = await getArticleSummary(currentPage);
    setArticles(res.data.articles);
    setPagination(res.data.pagination);
  };
  const navigateArticle = (id: string) => {
    const path = "/article/" + findFullPathByKey(articleRoutesMap, id);
    navigate(path || "");
  };
  const paginationChange: PaginationProps["onChange"] = (page) => {
    setCurrentPage(page);
    init();
  };

  // 处理收藏/取消收藏
  const handleFavorite = (e: React.MouseEvent, article: Articles) => {
    e.stopPropagation(); // 阻止冒泡，避免触发卡片点击

    const newFavorite = {
      _id: article._id,
      title: article.title,
    };

    let newFavorites: FavoriteArticle[];

    if (favorites.some((fav) => fav._id === article._id)) {
      // 取消收藏
      newFavorites = favorites.filter((fav) => fav._id !== article._id);
    } else {
      // 添加收藏
      newFavorites = [...favorites, newFavorite];
    }

    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  // 检查文章是否已收藏
  const isFavorited = (articleId: string) => {
    return favorites.some((fav) => fav._id === articleId);
  };

  return (
    <div style={style} className={styles.container}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.title}>{title}</div>
          <div className={styles.desc}>{desc}</div>
        </div>
        {articles.length > 0 && (
          <Button
            className={styles.rightBtn}
            onClick={() => navigate("/article")}
          >
            更多
          </Button>
        )}
      </div>

      <AnimatePresence>
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <div className={styles.cardMeta}>
                    <DesField
                      initTags={item.tags}
                      createdAt={item.createdAt}
                      updatedAt={item.updatedAt}
                    />
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <Editor
                    isSummary={true}
                    initialContent={item.summary}
                    editable={false}
                  />
                </div>

                <div className={styles.cardFooter}>
                  <Button
                    icon={<TiStarFullOutline />}
                    className={`${styles.actionBtn} ${
                      isFavorited(item._id) ? styles.favorited : ""
                    }`}
                    onClick={(e) => handleFavorite(e, item)}
                  >
                    {isFavorited(item._id) ? "已收藏" : "收藏"}
                  </Button>
                  <Button className={styles.readBtn}>阅读全文</Button>
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
