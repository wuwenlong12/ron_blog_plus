import React, { useEffect, useState } from "react";
import { Card, Row, Col, Progress, Statistic, Tooltip, Divider } from "antd";
import {
  UserOutlined,
  EyeOutlined,
  FileTextOutlined,
  BookOutlined,
  TagsOutlined,
  DesktopOutlined,
  HddOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import styles from "../styles/Dashboard.module.scss";
import { getPageStats } from "../../api/site";
import { PageStats } from "../../api/site/type";

interface SystemInfo {
  cpu: number;
  memory: {
    total: number;
    used: number;
    free: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
  };
  os: {
    type: string;
    platform: string;
    version: string;
    uptime: number;
  };
}

interface DashboardData {
  todayVisits: number;
  totalVisits: number;
  articlesCount: number;
  diariesCount: number;
  tagsCount: number;
  system: SystemInfo;
}

// 模拟数据
const mockData: DashboardData = {
  todayVisits: 156,
  totalVisits: 25678,
  articlesCount: 42,
  diariesCount: 18,
  tagsCount: 24,
  system: {
    cpu: 45,
    memory: {
      total: 16 * 1024 * 1024 * 1024, // 16GB
      used: 8 * 1024 * 1024 * 1024, // 8GB
      free: 8 * 1024 * 1024 * 1024, // 8GB
    },
    disk: {
      total: 512 * 1024 * 1024 * 1024, // 512GB
      used: 200 * 1024 * 1024 * 1024, // 200GB
      free: 312 * 1024 * 1024 * 1024, // 312GB
    },
    os: {
      type: "Linux",
      platform: "x64",
      version: "Ubuntu 20.04 LTS",
      uptime: 1234567, // 示例运行时间
    },
  },
};

const Dashboard: React.FC = () => {
  const [pageStats, setPageStats] = useState<PageStats | null>(null);

  const fetchPageStats = async () => {
    try {
      const res = await getPageStats();
      if (res.code === 0) {
        setPageStats(res.data);
      }
    } catch (error) {
      console.error("获取页面统计失败:", error);
    }
  };

  useEffect(() => {
    fetchPageStats();
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    return `${days}天 ${hours}小时 ${minutes}分钟`;
  };

  return (
    <div className={styles.dashboard}>
      {/* 第一行：访问统计 */}
      <Row gutter={[16, 24]} className={styles.firstRow}>
        <Col xs={24} sm={12}>
          <Card className={`${styles.statCard} ${styles.visitCard}`}>
            <div className={styles.iconWrapper}>
              <EyeOutlined />
            </div>
            <Statistic
              title="今日访问"
              value={pageStats?.todayPageView || 0}
              valueStyle={{ color: "#1890ff" }}
            />
            <div className={styles.statTrend}>
              <span>UV: {pageStats?.todayUniqueView || 0}</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card className={`${styles.statCard} ${styles.totalCard}`}>
            <div className={styles.iconWrapper}>
              <UserOutlined />
            </div>
            <Statistic
              title="总访问量"
              value={pageStats?.totalPageView || 0}
              valueStyle={{ color: "#52c41a" }}
            />
            <div className={styles.statTrend}>
              <span>累计</span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 第二行：内容统计 */}
      <Row gutter={[16, 24]} className={styles.secondRow}>
        <Col xs={24} sm={8}>
          <Card className={`${styles.statCard} ${styles.articleCard}`}>
            <div className={styles.iconWrapper}>
              <FileTextOutlined />
            </div>
            <Statistic
              title="文章数量"
              value={pageStats?.articleCount || 0}
              valueStyle={{ color: "#722ed1" }}
            />
            <div className={styles.statTrend}>
              <span>总计</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className={`${styles.statCard} ${styles.diaryCard}`}>
            <div className={styles.iconWrapper}>
              <BookOutlined />
            </div>
            <Statistic
              title="日记数量"
              value={pageStats?.diaryCount || 0}
              valueStyle={{ color: "#eb2f96" }}
            />
            <div className={styles.statTrend}>
              <span>总计</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className={`${styles.tagCard} ${styles.gradientBg}`}>
            <div className={styles.tagHeader}>
              <TagsOutlined />
              <span>标签统计</span>
            </div>
            <div className={styles.tagContent}>
              <div className={styles.tagCount}>{pageStats?.tagCount || 0}</div>
              <div className={styles.tagDesc}>当前使用的标签总数</div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
