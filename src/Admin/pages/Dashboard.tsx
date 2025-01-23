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
// import { getDashboardData } from "../../api/dashboard";

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
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboardData();
    // 每分钟更新一次系统信息
    const timer = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // TODO: 替换为实际的 API 调用
      // const res = await getDashboardData();
      // if (res.code === 0) {
      //   setData(res.data);
      // }

      // 暂时使用模拟数据
      setData(mockData);
    } catch (error) {
      console.error("获取仪表盘数据失败:", error);
    }
  };

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

  if (!data) return null;

  return (
    <div className={styles.dashboard}>
      {/* 第一行：访问统计 */}
      <Row gutter={[16, 24]}>
        <Col xs={24} sm={12}>
          <Card className={`${styles.statCard} ${styles.visitCard}`}>
            <div className={styles.iconWrapper}>
              <EyeOutlined />
            </div>
            <Statistic
              title="今日访问"
              value={data.todayVisits}
              valueStyle={{ color: "#1677ff" }}
            />
            <div className={styles.statTrend}>
              <span>实时</span>
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
              value={data.totalVisits}
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
              value={data.articlesCount}
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
              value={data.diariesCount}
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
              <div className={styles.tagCount}>{data.tagsCount}</div>
              <div className={styles.tagDesc}>当前使用的标签总数</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 第三行：系统信息 */}
      <Row gutter={[16, 24]} className={styles.secondRow}>
        <Col span={24}>
          <Card
            title={
              <div className={styles.systemHeader}>
                <DesktopOutlined />
                <span>系统信息</span>
              </div>
            }
            className={styles.systemCard}
          >
            <div className={styles.osInfo}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className={styles.osItem}>
                    <span className={styles.osLabel}>操作系统</span>
                    <span className={styles.osValue}>
                      {data.system.os.type}
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div className={styles.osItem}>
                    <span className={styles.osLabel}>系统版本</span>
                    <span className={styles.osValue}>
                      {data.system.os.version}
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div className={styles.osItem}>
                    <span className={styles.osLabel}>系统架构</span>
                    <span className={styles.osValue}>
                      {data.system.os.platform}
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div className={styles.osItem}>
                    <span className={styles.osLabel}>运行时间</span>
                    <span className={styles.osValue}>
                      {formatUptime(data.system.os.uptime)}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>

            <Divider style={{ margin: "24px 0" }} />

            <Row gutter={[16, 24]}>
              <Col span={24}>
                <Tooltip title={`CPU使用率: ${data.system.cpu}%`}>
                  <div className={styles.resourceItem}>
                    <div className={styles.resourceLabel}>
                      <DesktopOutlined />
                      <span>CPU</span>
                    </div>
                    <Progress
                      percent={data.system.cpu}
                      status={data.system.cpu > 80 ? "exception" : "normal"}
                      strokeColor={{
                        "0%": "#108ee9",
                        "100%": data.system.cpu > 80 ? "#ff4d4f" : "#87d068",
                      }}
                    />
                  </div>
                </Tooltip>
              </Col>
              <Col span={24}>
                <Tooltip
                  title={`内存使用: ${formatBytes(
                    data.system.memory.used
                  )} / ${formatBytes(data.system.memory.total)}`}
                >
                  <div className={styles.resourceItem}>
                    <div className={styles.resourceLabel}>
                      <DatabaseOutlined />
                      <span>内存</span>
                    </div>
                    <Progress
                      percent={Math.round(
                        (data.system.memory.used / data.system.memory.total) *
                          100
                      )}
                      status={
                        data.system.memory.used / data.system.memory.total > 0.8
                          ? "exception"
                          : "normal"
                      }
                      strokeColor={{
                        "0%": "#108ee9",
                        "100%":
                          data.system.memory.used / data.system.memory.total >
                          0.8
                            ? "#ff4d4f"
                            : "#87d068",
                      }}
                    />
                  </div>
                </Tooltip>
              </Col>
              <Col span={24}>
                <Tooltip
                  title={`硬盘使用: ${formatBytes(
                    data.system.disk.used
                  )} / ${formatBytes(data.system.disk.total)}`}
                >
                  <div className={styles.resourceItem}>
                    <div className={styles.resourceLabel}>
                      <HddOutlined />
                      <span>硬盘</span>
                    </div>
                    <Progress
                      percent={Math.round(
                        (data.system.disk.used / data.system.disk.total) * 100
                      )}
                      status={
                        data.system.disk.used / data.system.disk.total > 0.8
                          ? "exception"
                          : "normal"
                      }
                      strokeColor={{
                        "0%": "#108ee9",
                        "100%":
                          data.system.disk.used / data.system.disk.total > 0.8
                            ? "#ff4d4f"
                            : "#87d068",
                      }}
                    />
                  </div>
                </Tooltip>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
