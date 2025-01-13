import React, { useEffect, useState } from "react";
import {
  App,
  Button,
  FloatButton,
  Input,
  Pagination,
  PaginationProps,
  Tree,
} from "antd";
import ParticlesBg from "particles-bg";
import styles from "./Diary.module.scss";
import { IoIosAdd } from "react-icons/io";
import Modal from "../../components/Modal/Modal";
import Editor from "../../components/Editor/Editor";
import { PartialBlock } from "@blocknote/core";
import { FaCircleCheck } from "react-icons/fa6";
import {
  getAllDiary,
  getDiaryById,
  postDiary,
  updateDiary,
} from "../../api/diary";
import type { Diary, Pagination as PaginationType } from "../../api/diary/type";
import favicon from "../../assets/logo.png";
import {
  formatTimestampToDay,
  formatTimestampToFullDateTime,
  formatTimestampToTime,
} from "../../utils/date";
import ThemeView from "../../themeComponent/themeView";
import { is } from "@blocknote/core/types/src/i18n/locales";
import { log } from "console";
import ChooseTag from "../../components/ChooseTag";
import { tag } from "../../api/tag/type";
import Masonry from "react-masonry-css";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { debounce } from "../../utils/debounce";
import { motion, AnimatePresence } from "framer-motion";
const MyTree: React.FC = () => {
  const [diartes, setDiaries] = useState<Diary[]>([]);
  const [pagination, setPagination] = useState<PaginationType>();
  const [currentPage, setCurrentPage] = useState(1);
  const [diarty, setDiarty] = useState<Diary>();
  const [curOpenId, setCurOpenId] = useState("");
  const [tags, setTags] = useState<tag[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [isShowDiaryModal, setIsShowDiaryModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<PartialBlock[] | undefined>(undefined);
  const { message } = App.useApp();
  const EditorChange = (content: any) => {
    setContent(content);
    selfSaved();
    // if (isEdit) {
    //   if (!diarty) return;
    //   localStorage.setItem(
    //     diarty?._id,
    //     JSON.stringify({ title, tags, content })
    //   );
    // } else {
    //   localStorage.setItem("newDiary", JSON.stringify({ content }));
    // }
    // message.success("自动保存成功！");
  };
  const onEditClose = () => {
    setIsShowEditModal(false);
  };
  useEffect(() => {
    init();
  }, [currentPage]);
  const init = async () => {
    const res = await getAllDiary(currentPage);
    console.log(res.data.diaries);

    setDiaries(res.data.diaries);
    setPagination(res.data.pagination);
  };

  const publish = async () => {
    if (title && content) {
      if (isEdit) {
        if (!diarty?._id) return;
        const res = await updateDiary(diarty?._id, title, tags, content);
        if (res.code === 0) {
          setDiarty((prev) => {
            if (!prev) return prev; // 如果 prev 为 undefined，直接返回
            return {
              ...prev,
              title,
              content: content as PartialBlock[], // 确保 content 的类型正确
              tags,
            };
          });
          localStorage.removeItem(diarty._id);
          message.success("修改成功！");

          setIsShowEditModal(false);
          setIsShowDiaryModal(true);
          setTitle("");
        } else {
          message.error(res.message);
        }
      } else {
        const res = await postDiary(title, tags, content);
        if (res.code === 0) {
          localStorage.removeItem("newDiary");
          message.success("发布成功！");
          setIsShowEditModal(false);
          setTitle("");
          localStorage.removeItem("diary");
        } else {
          message.error(res.message);
        }
      }
      init();
    }
  };
  const diaryItemClick = async (id: string) => {
    const res = await getDiaryById(id);

    setDiarty(res.data);
    setIsShowDiaryModal(true);
  };
  const onDiaryClose = () => {
    setIsShowDiaryModal(false);
  };
  const addBtnClick = () => {
    let curJson = localStorage.getItem("newDiary");
    if (curJson) {
      message.success("已自动恢复上次编辑！");
      const obj = JSON.parse(curJson);
      setContent(obj.content);
    } else {
      setContent(undefined);
      setTitle("");
      setTags([]);
    }

    setIsEdit(false);
    setIsShowEditModal(true);
  };

  const diaryEditClick = () => {
    setIsEdit(true);
    setIsShowDiaryModal(false);
    setIsShowEditModal(true);
    if (!diarty) return;
    const savdDiaryJson = localStorage.getItem(diarty?._id);
    if (savdDiaryJson) {
      const savdDiary = JSON.parse(savdDiaryJson);
      message.success("已自动恢复上次编辑！");
      setTitle(savdDiary?.title || diarty?.title);
      setContent(savdDiary?.content || diarty?.content);
      setTags(savdDiary?.tags || diarty?.tags);
    } else {
      if (diarty?.title && diarty?.tags && diarty?.content) {
        setTitle(diarty?.title);
        setContent(diarty?.content);
        setTags(diarty?.tags);
      }
    }
  };

  const titleChange = debounce((e) => {
    setTitle(e.target.value);
    selfSaved();
  }, 1000);
  const onTagsChange = debounce((e) => {
    setTags(e);
    console.log("hhhhh");

    selfSaved();
  }, 1000);
  const selfSaved = () => {
    localStorage.setItem(
      isEdit ? (diarty?._id as string) : "newDiary",
      JSON.stringify({ title, tags, content })
    );
    message.success("自动保存成功");
  };

  const paginationChange: PaginationProps["onChange"] = (page) => {
    setCurrentPage(page);
    init();
  };
  return (
    <div
      className={styles.container}
      // lightStyle={{ backgroundColor: "#f2f0ea" }}
      // darkStyle={{}}
    >
      <div style={{ zIndex: "-1" }}>
        <ParticlesBg color=" #f2f0ea" num={300} type="custom" bg={true} />
      </div>
      <AnimatePresence>
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          // exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={styles.main}
        >
          <Masonry
            breakpointCols={{
              default: 4, // 默认列数
              1400: 3, // 屏幕宽度 ≤ 1100px 时列数
              1084: 2,
              730: 1,
            }}
            className={styles.diaryList}
          >
            {diartes.map((diary) => (
              <ThemeView
                key={diary._id}
                onClick={() => diaryItemClick(diary._id)}
                darkStyle={{ backgroundColor: "#1b1f21" }}
                lightStyle={{ backgroundColor: "#f2f0ea" }}
                className={styles.diaryItem}
              >
                <div className={styles.diaryItemTop}>
                  <img
                    className={styles.diaryItemImage}
                    src={diary.coverImage || favicon}
                    alt=""
                  />
                  <div className={styles.diaryItemLeftInfo}>
                    <div className={styles.diaryItemTitle}>{diary.title}</div>
                    <div className={styles.diaryItemTime}>
                      {formatTimestampToDay(diary.createdAt)}
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <ChooseTag initTags={diary?.tags || null}></ChooseTag>
                </div>

                <div className={styles.diaryItemSummary}>
                  <Editor
                    initialContent={diary.summary || undefined}
                    isSummary={true}
                    editable={false}
                  ></Editor>
                </div>
              </ThemeView>
            ))}
          </Masonry>
        </motion.div>
      </AnimatePresence>
      <Modal
        isShowModal={isShowEditModal}
        direction="center"
        onClose={onEditClose}
      >
        <ThemeView className={styles.modalCon}>
          <Input
            addonBefore={"标题"}
            className={styles.modalInput}
            showCount
            defaultValue={title}
            maxLength={20}
            onChange={titleChange}
          />
          <div style={{ marginBottom: 10 }}>
            <ChooseTag
              initTags={tags}
              onChange={onTagsChange}
              auth={true}
            ></ChooseTag>
          </div>
          <Editor
            editable={true}
            isSummary={true}
            onChange={EditorChange}
            initialContent={content}
          ></Editor>
        </ThemeView>
      </Modal>
      <Modal
        key={curOpenId}
        isShowModal={isShowDiaryModal}
        direction="center"
        onClose={onDiaryClose}
      >
        <ThemeView className={styles.modalCon}>
          <div className={styles.diaryTitle}>{diarty?.title}</div>
          <div className={styles.diaryDesc}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <ChooseTag
                initTags={diarty?.tags || null}
                onChange={onTagsChange}
                auth={false}
              ></ChooseTag>

              <div>{formatTimestampToFullDateTime(diarty?.createdAt)}</div>
            </div>
            <Button
              onClick={diaryEditClick}
              style={{ marginRight: 10 }}
              color="default"
              variant="solid"
              icon={<BiSolidMessageSquareEdit />}
            >
              编辑
            </Button>
          </div>
          <Editor
            editable={false}
            isSummary={true}
            onChange={EditorChange}
            initialContent={diarty?.content}
          ></Editor>
        </ThemeView>
      </Modal>
      <FloatButton
        icon={<IoIosAdd />}
        type="primary"
        onClick={addBtnClick}
        style={{ insetInlineEnd: 24 }}
      ></FloatButton>
      {isShowEditModal ? (
        <FloatButton
          icon={<FaCircleCheck />}
          type="primary"
          onClick={publish}
          style={{
            backgroundColor: "red !import",
            color: "red",
            insetInlineEnd: 80,
          }}
        ></FloatButton>
      ) : null}
      <Pagination
        style={{ position: "fixed", bottom: 20, left: 0, right: 0 }}
        align="center"
        onChange={paginationChange}
        defaultCurrent={1}
        total={pagination?.total}
      />
    </div>
  );
};

export default MyTree;
