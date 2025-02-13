import http from "..";
import { ResponseBase } from "../type";
import {
  PageStatsResponse,
  RegisterSiteParams,
  ResponseRegisterSite,
  SiteInfoResponse,
  UpdateSiteParams,
  VisitRecordParams,
  VisitStatsParams,
  VisitStatsResponse,
  RealtimeVisitResponse,
} from "./type";

export enum API {
  CHECK = "/site/check",
  INIT = "/site/init",
  CHECK_SUBDOMAIN = "/site/check-subdomain",
  INFO = "/site/info",
  UPDATE = "/site", // 基础路径，实际调用时拼接 site_id
  PAGE_STATS = "/site/stats",
  RECORD_VISIT = "/site/visit",
  VISIT_STATS = "/site/visit/stats",
  REALTIME_VISIT = "/site/visit/realtime",
}

//检查二级域名重复
export const checkSubdomain = (subdomain: string) =>
  http.post<any, ResponseBase>(API.CHECK, { subdomain });

// 注册站点
export const registerSite = (parmas: RegisterSiteParams) => {
  return http.post<any, ResponseRegisterSite>(API.INIT, parmas);
};

// 获取站点信息
export const getSiteInfo = () => {
  return http.get<any, SiteInfoResponse>(API.INFO);
};

// 更新站点信息
export const updateSite = (params: UpdateSiteParams) => {
  return http.put<any, ResponseBase>(API.UPDATE, params);
};

// 记录访问统计
export const recordVisit = (params: VisitRecordParams) => {
  return http.post<VisitRecordParams, ResponseBase>(API.RECORD_VISIT, params);
};

// 获取页面访问量
export const getPageStats = () => {
  return http.get<any, PageStatsResponse>(API.PAGE_STATS);
};

// 获取访问统计
export const getVisitStats = (params?: VisitStatsParams) => {
  return http.get<VisitStatsParams, VisitStatsResponse>(API.VISIT_STATS, {
    params,
  });
};

// 获取实时访问数据
export const getRealtimeVisit = () => {
  return http.get<null, RealtimeVisitResponse>(API.REALTIME_VISIT);
};
