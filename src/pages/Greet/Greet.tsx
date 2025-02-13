import React from "react";
import {
  Layout,
  Menu,
  Input,
  Button,
  Card,
  Typography,
  Avatar,
  Dropdown,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import styles from "./Greet.module.scss";
import ParticlesBg from "particles-bg";
import Typist from "react-typist";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { logoutHandle } from "../../store/authSlice";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const newsData = [
  {
    title: "个人知识库平台 V1.0 正式发布 🚀",
    date: "2025-02-13",
    description:
      "我们的个人知识库平台正式上线啦！你现在可以轻松创建、管理属于自己的知识库，并与他人分享交流！",
    tag: "HOT",
  },
  {
    title: "分站功能上线 🎉",
    date: "2025-02-10",
    description:
      "用户可以自选二级域名注册自己的分站，每个分站拥有独立的权限控制，用户体验大幅提升！",
  },
  {
    title: "支持深色模式 🌙",
    date: "2025-02-08",
    description:
      "全新上线的深色模式让你在夜间使用时更加舒适，赶快去设置体验吧！",
  },
  {
    title: "动态路由功能改进 🔄",
    date: "2025-02-05",
    description:
      "路由系统进行了优化，支持动态创建和删除文章的路由，提升了系统的灵活性和响应速度。",
  },
  {
    title: "日记功能更新 📝",
    date: "2025-02-02",
    description:
      "日记功能迎来了大更新，支持时间轴、拖拽排序和自动保存，让你记录每一天更加便捷。",
  },
];

const Greet: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    dispatch(logoutHandle());
  };

  const renderButtons = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Button type="primary" size="large" onClick={handleLogin}>
            创建专属知识库
          </Button>
          <Button
            size="large"
            onClick={() => window.open("http://vip.sxkjxy.cc")}
          >
            预览成品知识库
          </Button>
        </>
      );
    }

    if (!user?.role || !user?.managedSites) {
      return (
        <Button type="primary" size="large" onClick={() => navigate("/init")}>
          初始化站点
        </Button>
      );
    }

    return (
      <>
        <Button
          type="primary"
          size="large"
          onClick={() => window.open(user?.managedSites.site_url)}
        >
          访问我的前台
        </Button>
        <Button
          size="large"
          onClick={() => window.open(user?.managedSites.site_admin_url)}
        >
          访问我的后台
        </Button>
      </>
    );
  };

  const userMenuItems = [
    ...(user?.role && user?.managedSites
      ? [
          {
            key: "admin",
            label: "管理后台",
            onClick: () => window.open(user?.managedSites.site_admin_url),
          },
        ]
      : []),
    {
      key: "logout",
      label: "退出登录",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerRight}>
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className={styles.userInfo}>
                <Avatar
                  src={user?.imgurl}
                  icon={<UserOutlined />}
                  className={styles.avatar}
                />
                <span className={styles.userName}>{user?.username}</span>
              </div>
            </Dropdown>
          ) : (
            <Button type="link" onClick={handleLogin}>
              登录
            </Button>
          )}
        </div>
      </div>
      <div className={styles.bg}>
        {/* <img className={styles.bgImg} src={bg} alt="" /> */}
        <div className={styles.bgPar}>
          <ParticlesBg color="#fff" num={5} type="polygon" bg={false} />
        </div>
      </div>
      {/* 主要介绍 */}
      <Content className={styles.hero}>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Title level={1} className={styles.title}>
            Kubeo
          </Title>
          <Typist
            avgTypingDelay={100}
            cursor={{
              show: true,
              blink: true,
              element: "",
              hideWhenDone: false,
              hideWhenDoneDelay: 1000,
            }}
          >
            <div>
              <p className={styles.subtitle}>
                助力开发者「更方便」打造你的专属知识宇宙
              </p>
              <Typist.Delay ms={500} />
            </div>
          </Typist>

          <div className={styles.buttons}>{renderButtons()}</div>
        </motion.div>
      </Content>

      {/* 新闻卡片 */}
      <motion.div
        className={styles.newsContainer}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.2, duration: 0.6, staggerChildren: 0.2 },
          },
        }}
      >
        {newsData.map((news, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Card
              title={news.title}
              className={styles.card}
              extra={
                news.tag ? <span className={styles.tag}>{news.tag}</span> : null
              }
            >
              <Paragraph>{news.description}</Paragraph>
              <span className={styles.date}>{news.date}</span>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Layout>
  );
};

export default Greet;
