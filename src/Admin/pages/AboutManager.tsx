import React from "react";
import { Card, Typography, Space, Divider, Alert } from "antd";
import styles from "./AboutManager.module.scss";

const { Title, Paragraph, Text, Link } = Typography;

const AboutManager: React.FC = () => {
  return (
    <div className={styles.aboutManager}>
      <Card>
        <Typography>
          <Title level={2}>关于本站</Title>
          <Alert
            message="小贴士"
            description={
              <Text>
                只要在你的分站登录了账号，就可以在前台页面直接编辑文章和日记了！
                在文章和日记页面会看到编辑按钮，点击即可进入编辑模式。
              </Text>
            }
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
            className={styles.tipAlert}
          />
          <Paragraph>
            这是一个基于 React + TypeScript
            开发的个人（全民）博客系统，提供文章发布、日记记录、数据统计等功能
          </Paragraph>

          <Title level={3}>技术栈</Title>
          <Space direction="vertical">
            <Text>
              前端：React + TypeScript + Ant Design + Redux Toolkit+ SCSS
              Modules
            </Text>
            <Text> 服务端：Express + MongoDB + Redis</Text>
          </Space>

          <Divider />

          <Title level={3}>主要功能</Title>
          <Space direction="vertical">
            <Text>
              •
              鉴权：采用邮箱+验证码登录方式，利用host字段获取二级域名，cookie分站间不共享，数据不互通。
            </Text>
            <Text>
              •
              文章管理：基于BlockNode富文本编辑器，支持Markdown导出,文章路由采用路由映射+动态路由方法，实现文章树状管理，可以拖拽排序，右键菜单管理
            </Text>
            <Text>• 日记系统：记录日常想法和心得，时间轴，日历获取日记</Text>
            <Text>
              • 数据统计：uv pv 访问量统计，看看用户都喜欢你哪些文章？
            </Text>
            <Text>• 系统设置：个性化设置，包括个人信息、站点信息等</Text>
            <Text>• 用户体验：客户端全局适配手机端，pc端，支持深色模式</Text>
          </Space>

          <Divider />

          <Title level={3}>联系方式</Title>
          <Space direction="vertical">
            <Text>
              GitHub：
              <Link href="https://github.com" target="_blank">
                https://github.com
              </Link>
            </Text>
            <Text>Email：773314621@qq.com</Text>
          </Space>

          <Divider />

          <Title level={3}>更新日志</Title>
          <Space direction="vertical">
            <Text>
              <Text strong>v1.0.0 (2024-02-12)</Text>
              <br />• 初始版本发布
              <br />• 完成基础功能开发
            </Text>
          </Space>
        </Typography>
      </Card>
    </div>
  );
};

export default AboutManager;
