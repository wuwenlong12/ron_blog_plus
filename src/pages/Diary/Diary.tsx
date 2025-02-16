import React, { useEffect, useState } from "react";
import {
  App,
  Button,
  Calendar,
  DatePicker,
  FloatButton,
  Input,
  Pagination,
  PaginationProps,
  Tag,
  theme,
  Timeline,
  Tree,
  Empty,
} from "antd";
import ParticlesBg from "particles-bg";
import styles from "./Diary.module.scss";
import { IoIosAdd } from "react-icons/io";
import Modal from "../../components/Modal/Modal";
import Editor from "../../components/Editor/Editor";
import { PartialBlock } from "@blocknote/core";
import { FaCircleCheck } from "react-icons/fa6";
import { LuCalendar1 } from "react-icons/lu";
import type { CalendarProps, DatePickerProps } from "antd";
import type { Dayjs } from "dayjs";
import {
  getAllDiary,
  getDiaryByDate,
  getDiaryById,
  getDiaryDates,
  getDiaryTimeLine,
  postDiary,
  updateDiary,
} from "../../api/diary";
import type {
  Diary,
  Pagination as PaginationType,
  TimelineData,
} from "../../api/diary/type";
import favicon from "../../assets/logo.png";
import {
  formatTimestampToDay,
  formatTimestampToFullDateTime,
  formatTimestampToTime,
} from "../../utils/date";
import ThemeView from "../../themeComponent/themeView";
import ChooseTag from "../../components/ChooseTag";
import { tag } from "../../api/tag/type";
import Masonry from "react-masonry-css";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { debounce } from "../../utils/debounce";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { RiSendPlaneFill } from "react-icons/ri";
import { FcTimeline } from "react-icons/fc";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
const MyTree: React.FC = () => {
  const [datePickerIsOpen, setDatePickerIsOpen] = useState(false); //是否为今日
  const [timelineOpen, setTimelineOpen] = useState(false); //是否为今日
  const [timelineData, setTimelineData] = useState<TimelineData>(); //是否为今日
  const [currentDate, setCurrentDate] = useState<number>(0); //当前选中时间
  const [isToday, setIsToday] = useState(false); //是否为今日
  const [diarty, setDiarty] = useState<Diary>(); //日记的数据
  const [isEdit, setIsEdit] = useState(false); // 是否为编辑模式
  const [dates, setDates] = useState<Dayjs[]>([]); //标签已写日记的日期
  const [title, setTitle] = useState(""); //输入的title
  const [tags, setTags] = useState<tag[]>([]); //输入的tags数据
  const [content, setContent] = useState<PartialBlock[] | undefined>(undefined); //输入的富文本内容
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const { message } = App.useApp();
  const { token } = theme.useToken();

  //富文本编辑器内容改变
  const EditorChange = (content: any) => {
    setContent(content);
  };

  useEffect(() => {
    setCurrentDate(dayjs().valueOf());
    init();
  }, []);

  //打开页面的初始化·刷新数据
  const init = async () => {
    //获取已写日记的日期
    const dates = (await getDiaryDates()).data;
    const formattedDates = dates.map((date) => dayjs(date)); // 转换字符串为 Dayjs
    setDates(formattedDates);
    //初始化当前日记  tip：dayjs不传参数会使用当前时间，适用于页面初始化获取当天日记
    initDiary(dayjs(currentDate || undefined));
    initTimeLine();
  };

  const initTimeLine = async () => {
    const res = await getDiaryTimeLine();
    setTimelineData(res.data);
  };

  //初始化日记信息
  const initDiary = async (date: Dayjs) => {
    const time = date.valueOf();
    const res = await getDiaryByDate(time);
    setCurrentDate(time);
    //是否为今天
    setIsToday(dayjs(Number(time)).isSame(dayjs(), "day"));

    //无论怎样都关闭编辑模式
    setIsEdit(false);
    //有日记数据设置到日记数据
    setDiarty(res.data);
  };
  const publish = async () => {
    const formattedDate = dayjs(currentDate).format("YYYY-MM-DD");
    if (title && content) {
      if (diarty) {
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

          localStorage.removeItem(formattedDate);
          message.success("修改成功！");

          setTitle("");
        } else {
          message.error(res.message);
        }
      } else {
        const res = await postDiary(title, tags, content, isToday, currentDate);
        if (res.code === 0) {
          localStorage.removeItem(formattedDate);
          message.success("发布成功！");
          setTitle("");
          localStorage.removeItem("diary");
        } else {
          message.error(res.message);
        }
      }
      init();
      setIsEdit(false);
    } else {
      message.error("标题和内容是必须字段");
    }
  };
  const diaryItemClick = async (id: string) => {
    const res = await getDiaryById(id);

    setDiarty(res.data);
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
  };

  useEffect(() => {
    console.log(dayjs(currentDate));
  }, [currentDate]);
  const diaryEditClick = () => {
    setTitle("");
    setTags([]);
    setContent(undefined);
    setIsEdit(true);
    const formattedDate = dayjs(currentDate).format("YYYY-MM-DD");

    const savdDiaryJson = localStorage.getItem(formattedDate);
    if (savdDiaryJson) {
      const savdDiary = JSON.parse(savdDiaryJson);
      message.success("已自动恢复上次编辑！");
      setTitle(savdDiary?.title || diarty?.title);
      setContent(savdDiary?.content || diarty?.content);
      setTags(savdDiary?.tags || diarty?.tags);
    } else {
      if (!diarty) return;
      if (diarty?.title && diarty?.tags && diarty?.content) {
        setTitle(diarty?.title);
        setContent(diarty?.content);
        setTags(diarty?.tags);
      }
    }
  };

  const titleChange = debounce((e) => {
    setTitle(e.target.value);
  }, 1000);

  const onTagsChange = debounce((e) => {
    setTags(e);
  }, 1000);

  useEffect(() => {
    if (!content) return;
    if (isEdit) {
      const formattedDate = dayjs(currentDate).format("YYYY-MM-DD");
      localStorage.setItem(
        formattedDate,
        JSON.stringify({ title, tags, content })
      );
      message.success("自动保存成功");
    }
  }, [title, tags, content, isEdit]);

  const onDateChange: DatePickerProps["onChange"] = async (
    date,
    dateString
  ) => {
    initDiary(date);
  };

  const style: React.CSSProperties = {
    border: `1px solid ${token.colorPrimary}`,
    borderRadius: "50%",
  };

  // 自定义日期渲染
  const cellRender: DatePickerProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type !== "date") {
      return info.originNode;
    }

    const currentDayjs = dayjs(current);
    // 确保 current 是 Dayjs 类型，并检查是否匹配标记日期
    const isMarked = dates.some((date) => date.isSame(current, "day"));

    return (
      <div className="ant-picker-cell-inner" style={isMarked ? style : {}}>
        {currentDayjs.date()}
      </div>
    );
  };

  const timeLineClick = async (date: Dayjs) => {
    initDiary(date);
    setTimelineOpen(false);
  };
  return (
    <div className={styles.container}>
      <div className={styles.calendar}>
        <DatePicker
          style={{ border: "none", color: "transparent" }}
          inputReadOnly={true} // 防止用户直接输入
          cellRender={cellRender}
          placement={"bottomRight"}
          open={datePickerIsOpen}
          onChange={onDateChange}
        />
      </div>

      <Timeline mode="left" className={styles.timeLine}>
        {timelineData && Object.keys(timelineData).length > 0 ? (
          Object.entries(timelineData).map(([year, entries]) => (
            <React.Fragment key={year}>
              <Timeline.Item color="red">
                <h3 style={{ fontWeight: "bold", color: "#555" }}>{year}</h3>
              </Timeline.Item>

              {entries.map((entry) => (
                <Timeline.Item
                  key={entry._id}
                  label={
                    <Tag
                      onClick={() => timeLineClick(dayjs(entry.createdAt))}
                      color="purple"
                    >
                      {dayjs(entry.createdAt).format("YYYY-MM-DD")}
                    </Tag>
                  }
                >
                  <Tag
                    onClick={() => timeLineClick(dayjs(entry.createdAt))}
                    color="cyan"
                  >
                    {entry.title}
                  </Tag>
                </Timeline.Item>
              ))}
            </React.Fragment>
          ))
        ) : (
          <div className={styles.emptyTimeline}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className={styles.emptyContent}>
                  <p className={styles.emptyText}>作者很懒，居然不写日记</p>
                  <p className={styles.emptySubText}>期待作者勤奋起来~</p>
                </div>
              }
            />
          </div>
        )}
      </Timeline>
      <div className={styles.calendarBtn}>
        <Button
          onClick={() => setTimelineOpen(!timelineOpen)}
          shape="circle"
          icon={<FcTimeline />}
        ></Button>
        <Button
          onClick={() => setDatePickerIsOpen(!datePickerIsOpen)}
          shape="circle"
          icon={<LuCalendar1 />}
        ></Button>
      </div>

      <div style={{ zIndex: "-1" }}>
        <ParticlesBg color=" #f2f0ea" num={300} type="custom" bg={true} />
      </div>
      <AnimatePresence>
        <motion.div
          className={styles.main}
          key={currentDate}
          initial={{ opacity: 0, y: timelineOpen ? 800 : 200 }}
          animate={{ opacity: 1, y: timelineOpen ? 400 : 0 }} // 根据 isExpanded 控制 y 轴// 根据 isExpanded 控制 y 轴
          // exit={{ opacity: 1, y: 200 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0, 0.71, 0.2, 1.01] }}
        >
          <ThemeView className={styles.diaryCon}>
            {isEdit ? (
              <>
                <Button
                  onClick={publish}
                  style={{ position: "absolute", right: 20 }}
                  color="primary"
                  variant="solid"
                  icon={<RiSendPlaneFill />}
                >
                  发布
                </Button>
                <Input
                  addonBefore={"标题"}
                  className={styles.modalInput}
                  showCount
                  defaultValue={title}
                  maxLength={20}
                  onChange={titleChange}
                />

                <div className={styles.diaryDesc}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <ChooseTag
                      mode="select"
                      initTags={tags}
                      onChange={onTagsChange}
                    ></ChooseTag>

                    {/* <div>
                      {formatTimestampToFullDateTime(diarty?.createdAt)}
                    </div> */}
                  </div>
                </div>
                <Editor
                  editable={true}
                  isSummary={true}
                  onChange={EditorChange}
                  initialContent={content}
                ></Editor>
              </>
            ) : (
              <>
                {diarty ? (
                  <>
                    <Button
                      onClick={diaryEditClick}
                      style={{ position: "absolute", right: 20 }}
                      color="default"
                      variant="solid"
                      icon={<BiSolidMessageSquareEdit />}
                    >
                      编辑
                    </Button>
                    <div className={styles.diaryTitle}>{diarty?.title}</div>
                    <div className={styles.diaryDesc}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <ChooseTag
                          initTags={diarty?.tags || null}
                          onChange={onTagsChange}
                        ></ChooseTag>

                        <div>
                          {formatTimestampToFullDateTime(diarty?.createdAt)}
                        </div>
                      </div>
                    </div>
                    <Editor
                      editable={false}
                      isSummary={true}
                      onChange={EditorChange}
                      initialContent={diarty?.content}
                    ></Editor>
                  </>
                ) : (
                  <>
                    <div>
                      {isToday
                        ? "作者今日未发布日记哦，可以右上角查看点击时间轴查看过去日记"
                        : "作者当天未发布日记，可以右上角查看点击时间轴查看过去日记"}
                    </div>
                    {isAuthenticated && (
                      <Button
                        onClick={diaryEditClick}
                        style={{ position: "absolute", right: 20 }}
                        color="default"
                        variant="solid"
                        icon={<BiSolidMessageSquareEdit />}
                      >
                        {isToday ? "签到" : "补签"}
                      </Button>
                    )}
                  </>
                )}
              </>
            )}
          </ThemeView>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MyTree;
