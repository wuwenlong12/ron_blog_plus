import http from "..";
import { ResponseBase } from "../type";
import { ResponseCheckSystemInit, ResponseLogin, User } from "./type";

enum API {
  USERS_CHECK = "users/check",
  USERS_INIT = "users/init",
  USERS_LOGIN = "users/login",
  USERS_AUTH = "users/auth",
  USERS_DETAILS = "users/details",
}

export const checkSystemInit = () =>
  http.get<any, ResponseCheckSystemInit>(API.USERS_CHECK, {});

export const systemInit = (username: string, email: string, password: string) =>
  http.post<any, ResponseBase>(API.USERS_INIT, {
    username,
    email,
    password,
  });

export const login = (email: string, password: string) =>
  http.post<any, ResponseLogin>(
    API.USERS_LOGIN,
    {
      email,
      password,
    },
    { withCredentials: true }
  );

export const auth = () =>
  http.get<any, ResponseLogin>(API.USERS_AUTH, { withCredentials: true });

export const getUserDetails = () =>
  http.get<any, ResponseBase>(API.USERS_DETAILS, { withCredentials: true });

export const updateUserDetails = ({
  username,
  email,
  oldPassword,
  newPassword,
  github,
  wx,
  school,
  explain,
  imgurl,
}: User) =>
  http.patch<any, ResponseBase>(
    API.USERS_DETAILS,
    {
      username,
      email,
      oldPassword,
      newPassword,
      github,
      wx,
      school,
      explain,
      imgurl,
    },
    { withCredentials: true }
  );
