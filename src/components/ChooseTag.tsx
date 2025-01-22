import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Flex, Input, Tag, theme, Tooltip } from "antd";
import { debounce } from "../utils/debounce";
import type { tag } from "../api/tag/type";

// TagInput 样式
const tagInputStyle: React.CSSProperties = {
  width: 64,
  height: 22,
  marginInlineEnd: 8,
  verticalAlign: "top",
};

// 随机颜色生成函数
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

interface ChooseTagProps {
  initTags: tag[] | null;
  auth?: boolean;
  onChange?: (tags: tag[]) => void;
}

const ChooseTag: React.FC<ChooseTagProps> = ({
  initTags,
  auth = false,
  onChange,
}) => {
  const { token } = theme.useToken();
  const [tags, setTags] = useState(initTags || []);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  if (!tags) return null;
  const handleClose = (removedTag: string) => {
    if (!setTags) return;
    const newTags = tags.filter((tag) => tag.name !== removedTag);
    setTags(newTags);
    if (!onChange || !tags) return;
    onChange(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (!setTags) return;
    let newTags;
    if (inputValue && !tags.some((tag) => tag.name === inputValue) && auth) {
      newTags = [...tags, { name: inputValue, color: getRandomColor() }];
      setTags(newTags);
    }
    setInputVisible(false);
    setInputValue("");
    if (!onChange || !tags) return;
    onChange(newTags as tag[]);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!auth) return;
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    if (!setTags) return;
    const newTags = [...tags];
    newTags[editInputIndex].name = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue("");
  };

  const tagPlusStyle: React.CSSProperties = {
    height: 22,
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };

  const handleTagClick = (index: number) => {
    if (!setTags) return;
    if (!auth) return;
    const newTags = [...tags];
    newTags[index].color = getRandomColor(); // 更新该 tag 的背景色
    setTags(newTags);
    if (!onChange || !tags) return;
    onChange(newTags);
  };

  return (
    <Flex gap="4px 0" wrap>
      {tags.map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <Input
              ref={editInputRef}
              key={tag.name}
              size="small"
              style={tagInputStyle}
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }
        const isLongTag = tag.name.length > 20;
        const tagElem = (
          <Tag
            key={tag.name}
            closable={auth}
            style={{
              userSelect: "none",
              backgroundColor: tag.color,
              border: "none",
              color: "#fff",
              fontWeight: "500",
            }}
            onClose={() => handleClose(tag.name)}
            onClick={() => handleTagClick(index)} // 点击时改变背景色
          >
            <span
              onDoubleClick={(e) => {
                if (auth) {
                  setEditInputIndex(index);
                  setEditInputValue(tag.name);
                  e.preventDefault();
                }
              }}
            >
              {isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag.name} key={tag.name}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={tagInputStyle}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : tags.length < 3 && auth ? (
        <Tag style={tagPlusStyle} icon={<PlusOutlined />} onClick={showInput}>
          New Tag
        </Tag>
      ) : null}
    </Flex>
  );
};

export default ChooseTag;
