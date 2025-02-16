import React, { useEffect, useState } from "react";
import { Tag, Spin } from "antd";
import { getTag } from "../api/tag";
import { tag } from "../api/tag/type";
import styles from "./ChooseTag.module.scss";

interface ChooseTagProps {
  initTags?: tag[];
  onChange?: (tags: tag[]) => void;
  mode?: "select" | "display";
  maxCount?: number;
}

const ChooseTag: React.FC<ChooseTagProps> = ({
  initTags = [],
  onChange,
  mode = "display",
  maxCount = 3,
}) => {
  const [tags, setTags] = useState<tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<tag[]>(initTags);
  const [loading, setLoading] = useState(false);

  const fetchTags = async () => {
    if (mode === "display") return;
    setLoading(true);
    try {
      const res = await getTag();
      if (res.code === 0) {
        setTags(res.data);
      }
    } catch (error) {
      console.error("获取标签失败", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleTagClick = (tag: tag) => {
    if (mode !== "select") return;

    const isSelected = selectedTags.some((t) => t._id === tag._id);
    let newSelectedTags: tag[];

    if (isSelected) {
      newSelectedTags = selectedTags.filter((t) => t._id !== tag._id);
    } else {
      if (selectedTags.length >= maxCount) return;
      newSelectedTags = [...selectedTags, tag];
    }

    setSelectedTags(newSelectedTags);
    onChange?.(newSelectedTags);
  };

  if (loading) {
    return <Spin size="small" />;
  }

  if (mode === "display") {
    return (
      <div className={styles.tagContainer}>
        {initTags.map((tag) => (
          <Tag key={tag._id} color={tag.color} className={styles.tag}>
            {tag.name}
          </Tag>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.tagContainer}>
      {tags.map((tag) => (
        <Tag
          key={tag._id}
          color={tag.color}
          className={`${styles.tag} ${
            selectedTags.some((t) => t._id === tag._id) ? styles.selected : ""
          } ${styles.selectable}`}
          onClick={() => handleTagClick(tag)}
        >
          {tag.name}
        </Tag>
      ))}
    </div>
  );
};

export default ChooseTag;
