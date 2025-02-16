import React, { useState, useEffect } from "react";
import { Input, Tabs, Empty, Spin, Card } from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { searchArticleByTitle, searchArticleByTag } from "../../api/article";
import ChooseTag from "../../components/ChooseTag";
import { tag } from "../../api/tag/type";
import styles from "./Search.module.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { Articles } from "../../api/article/type";
import { findFullPathByKey } from "../../router/utils/findFullPathByKey";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Editor from "../../components/Editor/Editor";

const { TabPane } = Tabs;

const Search: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [selectedTag, setSelectedTag] = useState<tag[]>([]);
  const [articles, setArticles] = useState<Articles[]>([]);
  const [loading, setLoading] = useState(false);
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const articleRoutesMap = useSelector(
    (state: RootState) => state.routesMap.articleRoutesMap
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 从 URL 参数中获取 tagId 和 tagName
    const params = new URLSearchParams(location.search);
    const tagId = params.get("tagId");
    const tagName = params.get("tagName");

    if (tagId && tagName) {
      setSelectedTag([{ _id: tagId, name: tagName, color: "#2563eb" }]);
      // 自动切换到标签搜索 tab
      const tabElement = document.querySelector('[data-node-key="tag"]');
      if (tabElement) {
        (tabElement as HTMLElement).click();
      }
    }
  }, [location.search]);

  const handleSearch = async (value: string) => {
    if (!value.trim()) return;
    setLoading(true);
    try {
      const res = await searchArticleByTitle(value.trim());
      if (res.code === 0) {
        setArticles(res.data.list);
      }
    } catch (error) {
      console.error("搜索失败", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagSearch = async (tags: tag[]) => {
    if (tags.length === 0) {
      setArticles([]);
      return;
    }
    setLoading(true);
    try {
      const res = await searchArticleByTag(tags[0]._id);
      if (res.code === 0) {
        setArticles(res.data.list);
      }
    } catch (error) {
      console.error("标签搜索失败", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleTagSearch(selectedTag);
  }, [selectedTag]);

  const renderArticleList = () => {
    if (loading) {
      return (
        <div className={styles.loading}>
          <Spin />
        </div>
      );
    }

    if (articles.length === 0) {
      return <Empty description="暂无搜索结果" />;
    }

    return (
      <div className={styles.articleList}>
        {articles.map((article) => (
          <Card
            key={article._id}
            className={styles.articleCard}
            style={{ backgroundColor: isDarkMode ? "#1e1e1e" : "#fff" }}
            onClick={() =>
              navigate(
                `/article/${findFullPathByKey(articleRoutesMap, article._id)}`
              )
            }
          >
            <h3 className={styles.title}>{article.title}</h3>
            <div className={styles.tags}>
              <ChooseTag mode="display" initTags={article.tags || []} />
            </div>
            <Editor
              editable={false}
              initialContent={article.summary}
              isSummary={true}
            ></Editor>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.searchPage}>
      <div className={styles.backButton} onClick={() => navigate(-1)}>
        <CloseOutlined />
      </div>
      <Tabs defaultActiveKey="keyword" centered>
        <TabPane tab="关键词搜索" key="keyword">
          <div className={styles.searchBox}>
            <Input.Search
              placeholder="输入关键词搜索文章..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onSearch={handleSearch}
            />
          </div>
        </TabPane>
        <TabPane tab="标签搜索" key="tag">
          <div className={styles.tagSearch}>
            <ChooseTag
              mode="select"
              maxCount={1}
              initTags={selectedTag}
              onChange={setSelectedTag}
            />
          </div>
        </TabPane>
      </Tabs>
      <div className={styles.results}>{renderArticleList()}</div>
    </div>
  );
};

export default Search;
