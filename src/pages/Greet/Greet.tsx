import React from "react";
import { Layout, Menu, Input, Button, Card, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import styles from "./Greet.module.scss";
import ParticlesBg from "particles-bg";
import Typist from "react-typist";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const newsData = [
  {
    title: "Ant Design X 1.0 发布🚀",
    date: "2024-11-22",
    description: "Ant Design X 是遵循 Ant Design 设计体系的一个 React UI 库...",
    tag: "HOT",
  },
  {
    title: "PeterCat 🐱 外滩发布",
    date: "2024-09-06",
    description: "PeterCat 是专为社区开发者打造的智能客服机器人解决方案...",
  },
  {
    title: "Mako 正式开源！",
    date: "2024-06-28",
    description: "Mako 是基于 Rust 的「极快」和「生产级」的前端智能构建工具...",
  },
];

const Greet: React.FC = () => {
  const navigate = useNavigate();

  const createKubeo = () => {
    navigate("/login");
  };
  return (
    <Layout className={styles.container}>
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

          <div className={styles.buttons}>
            <Button type="primary" size="large" onClick={createKubeo}>
              创建专属知识库
            </Button>
            <Button size="large">预览成品知识库</Button>
          </div>
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
