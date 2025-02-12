import {
  HomeOutlined,
  MailOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React from "react";
import { TbBrandProducthunt } from "react-icons/tb";
import { BiSolidInfoCircle } from "react-icons/bi";
import { FaHome, FaMeteor, FaRegSun, FaSun } from "react-icons/fa";
import { MdArticle, MdOutlineSatelliteAlt } from "react-icons/md";
import { RiDashboard3Line } from "react-icons/ri";
import { IoLogoPolymer } from "react-icons/io";
import { FiActivity } from "react-icons/fi";
import { FcAbout } from "react-icons/fc";
// componentKey.ts
// iconKey: 图标名称映射表
export const iconKey = {
  FaHome: "FaHome",
  FaSun: "FaSun",
  MdArticle: "MdArticle",
  FaMeteor: "FaMeteor",
  RiDashboard3Line: "RiDashboard3Line",
  BsInfoCircle: "BsInfoCircle",
  MdOutlineSatelliteAlt: "MdOutlineSatelliteAlt",
  TbBrandProducthunt: "TbBrandProducthunt",
  IoLogoPolymer: "IoLogoPolymer",
  FiActivity: "FiActivity",
  FcAbout: "FcAbout",
};

export const iconMap: Record<string, React.ReactNode> = {
  [iconKey.FaHome]: <FaHome />,
  [iconKey.FaSun]: <FaSun />,
  [iconKey.MdArticle]: <MdArticle />,
  [iconKey.FaMeteor]: <FaMeteor />,
  [iconKey.RiDashboard3Line]: <RiDashboard3Line />,
  [iconKey.BsInfoCircle]: <BiSolidInfoCircle />,
  [iconKey.MdOutlineSatelliteAlt]: <MdOutlineSatelliteAlt />,
  [iconKey.TbBrandProducthunt]: <TbBrandProducthunt />,
  [iconKey.IoLogoPolymer]: <IoLogoPolymer />,
  [iconKey.FiActivity]: <FiActivity />,
  [iconKey.FcAbout]: <FcAbout />,
};
