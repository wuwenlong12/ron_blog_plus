import React, { useEffect, useState } from "react";
import { Card, Row, Col, List, Typography, Statistic, DatePicker } from "antd";
import { getRealtimeVisit, getVisitStats } from "../../api/site";
import { RealtimeVisitResponse, VisitStatsResponse } from "../../api/site/type";
import dayjs from "dayjs";
import styles from "../styles/VisitStats.module.scss";
import ReactECharts from "echarts-for-react";
import type { RangePickerProps } from "antd/es/date-picker";

const VisitStats: React.FC = () => {
  const [realtimeData, setRealtimeData] =
    useState<RealtimeVisitResponse["data"]>();
  const [visitStats, setVisitStats] = useState<VisitStatsResponse["data"]>();
  const [dateRange, setDateRange] = useState<[string, string]>([
    dayjs().subtract(7, "day").format("YYYY-MM-DD"),
    dayjs().format("YYYY-MM-DD"),
  ]);

  // 获取实时数据
  const fetchRealtimeData = async () => {
    try {
      const res = await getRealtimeVisit();
      if (res.code === 0) {
        setRealtimeData(res.data);
      }
    } catch (error) {
      console.error("获取实时访问数据失败:", error);
    }
  };

  // 获取历史统计数据
  const fetchVisitStats = async () => {
    try {
      const [startDate, endDate] = dateRange;
      const res = await getVisitStats({
        startDate,
        endDate,
      });

      if (res.code === 0) {
        setVisitStats(res.data);
      }
    } catch (error) {
      console.error("获取访问统计失败:", error);
    }
  };

  // 日期范围变化处理
  const handleRangeChange: RangePickerProps["onChange"] = (dates) => {
    if (dates) {
      const [start, end] = dates;
      setDateRange([start!.format("YYYY-MM-DD"), end!.format("YYYY-MM-DD")]);
    }
  };

  useEffect(() => {
    fetchRealtimeData();
    fetchVisitStats();

    // 实时数据每分钟更新
    const timer = setInterval(fetchRealtimeData, 60000);
    return () => clearInterval(timer);
  }, [dateRange]);

  // 处理访问趋势数据
  const trendData = React.useMemo(() => {
    if (!visitStats?.dailyStats) return [];

    const pvData = visitStats.dailyStats.map((item) => ({
      date: item.date,
      value: item.pv,
      category: "PV",
    }));

    const uvData = visitStats.dailyStats.map((item) => ({
      date: item.date,
      value: item.uv,
      category: "UV",
    }));

    return [...pvData, ...uvData];
  }, [visitStats?.dailyStats]);

  // 处理热门页面数据
  const topPathsData = React.useMemo(() => {
    if (!visitStats?.topPaths) return [];

    return visitStats.topPaths.map((item) => ({
      type: item._id,
      value: item.count,
    }));
  }, [visitStats?.topPaths]);

  // 处理来源网站数据
  const topReferersData = React.useMemo(() => {
    if (!visitStats?.topReferers) return [];

    return visitStats.topReferers.map((item) => ({
      type: item._id || "直接访问",
      value: item.count,
    }));
  }, [visitStats?.topReferers]);

  // 访问趋势图表配置
  const getTrendOption = (data: any[]) => ({
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderColor: "#f0f0f0",
      textStyle: {
        color: "#1f2937",
      },
    },
    legend: {
      data: ["PV", "UV"],
      top: 0,
      textStyle: {
        color: "#4b5563",
      },
    },
    grid: {
      top: 40,
      left: 50,
      right: 20,
      bottom: 40,
    },
    xAxis: {
      type: "category",
      data: data.map((item) => item.date),
      axisLine: {
        lineStyle: {
          color: "#e5e7eb",
        },
      },
      axisLabel: {
        color: "#6b7280",
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          color: "#f3f4f6",
        },
      },
      axisLabel: {
        color: "#6b7280",
      },
    },
    series: [
      {
        name: "PV",
        type: "line",
        data: data.map((item) => item.pv),
        smooth: true,
        symbolSize: 6,
        lineStyle: {
          width: 3,
        },
        itemStyle: {
          color: "#3b82f6",
        },
      },
      {
        name: "UV",
        type: "line",
        data: data.map((item) => item.uv),
        smooth: true,
        symbolSize: 6,
        lineStyle: {
          width: 3,
        },
        itemStyle: {
          color: "#10b981",
        },
      },
    ],
  });

  // 饼图配置
  const getPieOption = (data: any[], title: string) => ({
    title: {
      text: title,
      left: "center",
      top: 20,
      textStyle: {
        color: "#1f2937",
        fontSize: 16,
        fontWeight: 500,
      },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderColor: "#f0f0f0",
      textStyle: {
        color: "#1f2937",
      },
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "55%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 4,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: "{b}: {d}%",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: "bold",
          },
        },
        data: data.map((item) => ({
          name: item.type,
          value: item.value,
        })),
      },
    ],
  });

  return (
    <div className={styles.container}>
      <Row gutter={[16, 16]}>
        {/* 实时访问数据 */}
        <Col span={24}>
          <Card title="实时访问数据" className={styles.card}>
            <Row gutter={16} align="middle" justify="space-between">
              <Col>
                <Row gutter={16}>
                  <Col>
                    <Statistic
                      title="今日PV"
                      value={realtimeData?.today?.pv || 0}
                    />
                  </Col>
                  <Col>
                    <Statistic
                      title="今日UV"
                      value={realtimeData?.today?.uv || 0}
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <DatePicker.RangePicker
                  value={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
                  onChange={handleRangeChange}
                  allowClear={false}
                  className={styles.datePicker}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 最近访问记录 */}
        <Col span={24} lg={12}>
          <Card title="最近访问记录" className={styles.card}>
            <List
              dataSource={realtimeData?.recentVisits || []}
              renderItem={(item) => (
                <List.Item>
                  <div className={styles.visitItem}>
                    <div>
                      <Typography.Text strong>路径：</Typography.Text>
                      <Typography.Text>{item.path}</Typography.Text>
                    </div>
                    <div>
                      <Typography.Text strong>IP：</Typography.Text>
                      <Typography.Text>{item.ip}</Typography.Text>
                    </div>
                    <div>
                      <Typography.Text strong>浏览器：</Typography.Text>
                      <Typography.Text>{item.userAgent}</Typography.Text>
                    </div>
                    <div>
                      <Typography.Text strong>访问时间：</Typography.Text>
                      <Typography.Text>
                        {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                      </Typography.Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 访问趋势图表 */}
        <Col span={24}>
          <Card title="访问趋势" className={styles.card}>
            <ReactECharts
              option={getTrendOption(visitStats?.dailyStats || [])}
            />
          </Card>
        </Col>

        {/* 热门页面分布 */}
        <Col span={24} lg={12}>
          <Card title="热门页面分布" className={styles.card}>
            <ReactECharts option={getPieOption(topPathsData, "热门页面")} />
          </Card>
        </Col>

        {/* 访问来源分布 */}
        <Col span={24} lg={12}>
          <Card title="访问来源分布" className={styles.card}>
            <ReactECharts option={getPieOption(topReferersData, "访问来源")} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VisitStats;
