import http from "..";
import { ResponseBase } from "../type";
import { ProjectItem, ResponseGetProject } from "./type";

enum API {
  BASE_PROJECT = "base/project",
  BASE_PROJECT_LIKE = "base/project/like",
}

export const getProject = () =>
  http.get<any, ResponseGetProject>(API.BASE_PROJECT, {
    withCredentials: true,
  });

export const addProject = (value: ProjectItem) =>
  http.post<any, ResponseBase>(API.BASE_PROJECT, value, {
    withCredentials: true,
  });

export const deleteProject = (id: string) =>
  http.delete<any, ResponseBase>(API.BASE_PROJECT, {
    params: { id },
    withCredentials: true,
  });

export const updateProject = (id: string, updateValue: ProjectItem) =>
  http.put<any, ResponseBase>(
    API.BASE_PROJECT,
    { id, ...updateValue },
    {
      withCredentials: true,
    }
  );

export const likeProject = (id: string) =>
  http.patch<any, ResponseBase>(API.BASE_PROJECT_LIKE, { id });
