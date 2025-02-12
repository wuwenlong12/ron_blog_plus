import { PartialBlock } from "@blocknote/core";
import { ResponseBase } from "../type";

export interface ResponseRegisterSite extends ResponseBase {
  data: {
    site_url: string;
    site_admin_url: string;
  };
}

export interface RegisterSiteParams {
  siteName: string;
  subdomain: string;
  name: string;
  job: string;
}

// 站点信息响应类型
export interface SiteInfoResponse extends ResponseBase {
  data: {
    site_sub_url: string;
    site_name: string;
    is_core: boolean;
    is_pass: boolean;
    is_off: boolean;
    name: string;
    avatar: string;
    signatures: string[];
    homepage_signature: string[];
    tech_stack: string[];
    profession: string;
    github: string;
    email: string;
    wechat: string;
    card_signature: string;
    card_message: string;
    AboutContent: PartialBlock[];
  };
}

// 更新站点信息参数类型
export interface UpdateSiteParams {
  name?: string;
  avatar?: string;
  signatures?: string[];
  homepage_signature?: string[];
  tech_stack?: string[];
  wechat?: string;
  github?: string;
  email?: string;
  profession?: string;
  card_signature?: string;
  card_message?: string;
  AboutContent?: PartialBlock[];
}

export interface PageStatsResponse extends ResponseBase {
  data: PageStats;
}

export interface PageStats {
  todayPageView: number;
  todayUniqueView: number;
  totalPageView: number;
  articleCount: number;
  tagCount: number;
  diaryCount: number;
}

// 访问记录请求参数
export interface VisitRecordParams {
  ip: string;
  userAgent: string;
  path: string;
  referer?: string;
}

// 访问统计查询参数
export interface VisitStatsParams {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

// 每日统计数据
export interface DailyStats {
  date: string;
  pv: number;
  uv: number;
}

// 路径/来源统计
export interface TopStats {
  _id: string;
  count: number;
}

// 访问统计响应
export interface VisitStatsResponse extends ResponseBase {
  data: {
    dailyStats: DailyStats[];
    topPaths: TopStats[];
    topReferers: TopStats[];
  };
}

// 实时访问统计
export interface TodayStats {
  pv: number;
  uv: number;
}

// 最近访问记录
export interface RecentVisit {
  ip: string;
  path: string;
  userAgent: string;
  createdAt: string;
}

// 实时访问数据响应
export interface RealtimeVisitResponse extends ResponseBase {
  data: {
    today: TodayStats;
    recentVisits: RecentVisit[];
  };
}
