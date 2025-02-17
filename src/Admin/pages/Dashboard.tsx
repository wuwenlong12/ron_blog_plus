import React, { useEffect, useState } from "react";
import { DatePicker, Typography, Spin } from "antd";
import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";
import dayjs, { Dayjs } from "dayjs";
import {
  LineChartOutlined,
  UserOutlined,
  FileTextOutlined,
  TagsOutlined,
  BookOutlined,
} from "@ant-design/icons";
import styles from "../styles/VisitStats.module.scss";
import { getPageStats, getVisitStats, getRealtimeVisit } from "../../api/site";
import type {
  PageStatsResponse,
  VisitStatsResponse,
  RealtimeVisitResponse,
} from "../../api/site/type";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const VisitStats: React.FC = () => {
  const [pageStats, setPageStats] = useState<PageStatsResponse["data"]>(null);
  const [visitStats, setVisitStats] =
    useState<VisitStatsResponse["data"]>(null);
  const [realtimeStats, setRealtimeStats] =
    useState<RealtimeVisitResponse["data"]>(null);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(7, "day"),
    dayjs(),
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pageStatsRes, visitStatsRes, realtimeRes] = await Promise.all([
        getPageStats(),
        getVisitStats({
          startDate: dateRange[0].format("YYYY-MM-DD"),
          endDate: dateRange[1].format("YYYY-MM-DD"),
        }),
        getRealtimeVisit(),
      ]);
      setPageStats(pageStatsRes.data);
      setVisitStats(visitStatsRes.data);
      setRealtimeStats(realtimeRes.data);
    } catch (error) {
      console.error("获取统计数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 定时刷新实时数据
  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 30000); // 每30秒刷新一次
    return () => clearInterval(timer);
  }, [dateRange]);

  const statsCards = [
    {
      title: "今日访问量",
      value: realtimeStats?.today?.pv || 0,
      icon: <LineChartOutlined className={styles.icon} />,
    },
    {
      title: "独立访客数",
      value: realtimeStats?.today?.uv || 0,
      icon: <UserOutlined className={styles.icon} />,
    },
    {
      title: "总访问量",
      value: pageStats?.totalPageView || 0,
      icon: <LineChartOutlined className={styles.icon} />,
    },
    {
      title: "文章总数",
      value: pageStats?.articleCount || 0,
      icon: <FileTextOutlined className={styles.icon} />,
    },
    {
      title: "标签总数",
      value: pageStats?.tagCount || 0,
      icon: <TagsOutlined className={styles.icon} />,
    },
    {
      title: "日记总数",
      value: pageStats?.diaryCount || 0,
      icon: <BookOutlined className={styles.icon} />,
    },
  ];

  const getChartOption = () => ({
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderColor: "#f1f5f9",
      textStyle: { color: "#1e293b" },
      borderWidth: 1,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: visitStats?.dailyStats?.map((item) => item.date) || [],
      axisLine: { lineStyle: { color: "#e2e8f0" } },
      axisLabel: { color: "#64748b" },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#f1f5f9" } },
      axisLabel: { color: "#64748b" },
    },
    series: [
      {
        name: "访问量",
        type: "line",
        smooth: true,
        data: visitStats?.dailyStats?.map((item) => item.pv) || [],
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(59, 130, 246, 0.2)" },
              { offset: 1, color: "rgba(59, 130, 246, 0.02)" },
            ],
          },
        },
        lineStyle: { color: "#3b82f6", width: 2 },
        itemStyle: { color: "#3b82f6" },
      },
      {
        name: "访客数",
        type: "line",
        smooth: true,
        data: visitStats?.dailyStats?.map((item) => item.uv) || [],
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(16, 185, 129, 0.2)" },
              { offset: 1, color: "rgba(16, 185, 129, 0.02)" },
            ],
          },
        },
        lineStyle: { color: "#10b981", width: 2 },
        itemStyle: { color: "#10b981" },
      },
    ],
  });

  const renderVisitList = () => {
    if (!visitStats?.dailyStats?.length) return null;

    return visitStats.dailyStats.map((stat, index) => (
      <motion.div
        key={stat.date}
        className={styles.dailyStats}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
      >
        <div>
          <Text strong>{stat.date}</Text>
          <Text type="secondary">访问量: {stat.pv}</Text>
          <Text type="secondary">访客数: {stat.uv}</Text>
          <Text type="secondary">IP数: {stat.ip}</Text>
        </div>
      </motion.div>
    ));
  };

  const renderRecentVisits = () => {
    if (!realtimeStats?.recentVisits?.length) return null;

    return (
      <div className={styles.recentVisits}>
        <Typography.Title level={5}>最近访问记录</Typography.Title>
        {realtimeStats.recentVisits.map((visit, index) => (
          <motion.div
            key={index}
            className={styles.visitItem}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <div>
              <Text strong>{visit.path}</Text>
              <div className={styles.visitInfo}>
                <span className={styles.label}>IP 地址：</span>
                <span className={styles.value}>{visit.ip}</span>
                <span className={styles.label}>User Agent：</span>
                <span className={styles.value}>{visit.userAgent}</span>
              </div>
            </div>
            <div className={styles.visitMeta}>
              <span>
                {dayjs(visit.createdAt).format("YYYY-MM-DD HH:mm:ss")}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <Spin spinning={loading}>
      <div className={styles.container}>
        <motion.div
          className={styles.statsGrid}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              className={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {stat.icon}
              <div className={styles.statTitle}>{stat.title}</div>
              <div className={styles.statValue}>{stat.value}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <div className={styles.title}>访问趋势</div>
            <RangePicker
              value={dateRange}
              onChange={(dates) => {
                if (dates) {
                  setDateRange(dates as [Dayjs, Dayjs]);
                }
              }}
              className={styles.datePicker}
            />
          </div>
          <ReactECharts option={getChartOption()} />
        </div>

        <div className={styles.visitList}>
          <div className={styles.listHeader}>
            <div className={styles.title}>访问记录</div>
          </div>
          {renderVisitList()}
          {renderRecentVisits()}
        </div>
      </div>
    </Spin>
  );
};

export default VisitStats;
