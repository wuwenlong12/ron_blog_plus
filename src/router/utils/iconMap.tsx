import {
  HomeOutlined,
  MailOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React from "react";
// componentKey.ts
// iconKey: 图标名称映射表
export const iconKey = {
  MailOutlined: "MailOutlined",
  HomeOutlined: "HomeOutlined",
  SettingOutlined: "SettingOutlined",
  UserOutlined: "UserOutlined",
  // 添加更多图标键名...
};

export const iconMap: Record<string, React.ReactNode> = {
  [iconKey.MailOutlined]: <MailOutlined />,
  [iconKey.HomeOutlined]: <HomeOutlined />,
  [iconKey.SettingOutlined]: <SettingOutlined />,
  [iconKey.UserOutlined]: <UserOutlined />,
  // 添加更多图标映射...
};
