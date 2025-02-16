import React, { useEffect, useState } from "react";
import { RiBook2Line } from "react-icons/ri";
import { TiStarFullOutline } from "react-icons/ti";
import { Button, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { findFullPathByKey } from "../../router/utils/findFullPathByKey";
import styles from "./LeftModalDom.module.scss";

interface FavoriteArticle {
  _id: string;
  title: string;
}

const FAVORITES_KEY = "article_favorites";

export default function Star() {
  const [favorites, setFavorites] = useState<FavoriteArticle[]>([]);
  const navigate = useNavigate();
  const articleRoutesMap = useSelector(
    (state: RootState) => state.routesMap.articleRoutesMap
  );

  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const navigateArticle = (id: string) => {
    const path = "/article/" + findFullPathByKey(articleRoutesMap, id);
    navigate(path || "");
  };

  const removeFavorite = (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation();
    const newFavorites = favorites.filter((fav) => fav._id !== articleId);
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  return (
    <div className={styles.starContainer}>
      <div className={styles.starHeader}>
        <div className={styles.middleInfo}>
          <TiStarFullOutline className={styles.middleIcon} />
          <div className={styles.middleNum}>{favorites.length}</div>
          <div className={styles.middleText}>收藏</div>
        </div>
      </div>

      <div className={styles.starList}>
        {favorites.length > 0 ? (
          favorites.map((article) => (
            <div
              key={article._id}
              className={styles.starItem}
              onClick={() => navigateArticle(article._id)}
            >
              <div className={styles.starItemTitle}>
                <RiBook2Line className={styles.articleIcon} />
                <span>{article.title}</span>
              </div>
              <Button
                type="text"
                className={styles.removeBtn}
                onClick={(e) => removeFavorite(e, article._id)}
              >
                取消收藏
              </Button>
            </div>
          ))
        ) : (
          <div className={styles.emptyContainer}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className={styles.emptyContent}>
                  <p className={styles.emptyText}>暂无收藏文章</p>
                  <p className={styles.emptySubText}>快去收藏感兴趣的文章吧~</p>
                </div>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
