import {
  HomeOutlined,
  MailOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React from "react";
import { FaHome, FaMeteor, FaRegSun, FaSun } from "react-icons/fa";
import { MdArticle } from "react-icons/md";
// componentKey.ts
// iconKey: 图标名称映射表
export const iconKey = {
  FaHome: "FaHome",
  FaSun: "FaSun",
  MdArticle: "MdArticle",
  FaMeteor: "FaMeteor",
  // 添加更多图标键名...
};

export const iconMap: Record<string, React.ReactNode> = {
  [iconKey.FaHome]: <FaHome />,
  [iconKey.FaSun]: <FaSun />,
  [iconKey.MdArticle]: <MdArticle />,
  [iconKey.FaMeteor]: <FaMeteor />,
  // 添加更多图标映射...
};
