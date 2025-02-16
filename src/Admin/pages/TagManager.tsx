import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Tag,
  Input,
  Button,
  message,
  Popconfirm,
  ColorPicker,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "../styles/TagManager.module.scss";
import { getTag, postTag, deleteTag } from "../../api/tag";
import { tag } from "../../api/tag/type";

const { Title } = Typography;

const TagManager: React.FC = () => {
  const [tags, setTags] = useState<tag[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedColor, setSelectedColor] = useState("#1890ff");

  const fetchTags = async () => {
    try {
      const res = await getTag();
      if (res.code === 0) {
        setTags(res.data);
      }
    } catch (error) {
      message.error("获取标签失败");
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleClose = async (id: string) => {
    try {
      const res = await deleteTag(id);
      if (res.code === 0) {
        message.success("标签删除成功");
        fetchTags();
      }
    } catch (error) {
      message.error("删除标签失败");
    }
  };

  const handleInputConfirm = async () => {
    if (inputValue.trim()) {
      try {
        const res = await postTag(inputValue.trim(), selectedColor);
        if (res.code === 0) {
          message.success("标签创建成功");
          fetchTags();
        }
      } catch (error) {
        message.error("创建标签失败");
      }
      setSelectedColor("#1890ff");
    }
    setInputVisible(false);
    setInputValue("");
  };

  return (
    <div className={styles.tagManager}>
      <Card>
        <Title level={2}>标签管理</Title>
        <div className={styles.tagContainer}>
          {tags.map((tag) => (
            <Tag
              key={tag._id}
              color={tag.color}
              closable
              onClose={() => handleClose(tag._id)}
              style={{
                margin: "8px 8px",
                fontSize: "14px",
                padding: "4px 8px",
              }}
            >
              {tag.name}
            </Tag>
          ))}
          {inputVisible ? (
            <div className={styles.editingTag}>
              <Input
                size="small"
                className={styles.tagInput}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleInputConfirm}
                onPressEnter={handleInputConfirm}
                placeholder="输入标签名称"
              />
              <ColorPicker
                size="small"
                value={selectedColor}
                onChange={(color) => setSelectedColor(color.toHexString())}
              />
            </div>
          ) : (
            <Button
              className={styles.newTagBtn}
              size="small"
              type="dashed"
              onClick={() => setInputVisible(true)}
              icon={<PlusOutlined />}
            >
              新建标签
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TagManager;
