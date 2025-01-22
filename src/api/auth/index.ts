import http from "..";
import { ResponseBase } from "../type";
import { ResponseCheckSystemInit, ResponseLogin } from "./type";

enum API {
  CHECK = "users/check",
  INIT = "users/init",
  LOGIN = "users/login",
  AUTH = "users/auth",
}

export const checkSystemInit = () =>
  http.get<any, ResponseCheckSystemInit>(API.CHECK, {});

export const systemInit = (username: string, email: string, password: string) =>
  http.post<any, ResponseBase>(API.INIT, {
    username,
    email,
    password,
  });

export const login = (email: string, password: string) =>
  http.post<any, ResponseLogin>(
    API.LOGIN,
    {
      email,
      password,
    },
    { withCredentials: true }
  );

export const auth = () =>
  http.get<any, ResponseLogin>(API.AUTH, { withCredentials: true });
