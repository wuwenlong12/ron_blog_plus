import axios from "axios";
import { message } from "antd";
const host = window.location.hostname;

function removeText(input: string, textToRemove: string): string {
  const regex = new RegExp(textToRemove, "g"); // 创建一个全局匹配的正则表达式
  return input.replace(regex, ""); // 替换掉指定的文字
}

console.log(host, process.env.REACT_APP_ENV_HOSTNAME);

// 获取 subdomain，返回空字符串或二级域名
const getSubdomain = () => {
  return removeText(host, process.env.REACT_APP_ENV_HOSTNAME);
};
console.log(getSubdomain());
const baseURL = `${process.env.REACT_APP_ENV_PROTOCOL}${getSubdomain()}${
  process.env.REACT_APP_ENV_HOSTNAME
}:${process.env.REACT_APP_ENV_PORT}${process.env.REACT_APP_ENV_PATH}`;

console.log(baseURL);

// 创建 axios 实例
const http = axios.create({
  baseURL: baseURL, // 使用拼接后的 baseURL
  timeout: 10000, // 请求超时时间
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    // 请求成功，直接返回数据
    return response.data;
  },
  (error) => {
    // 处理响应错误，错误不会向外抛出
    if (error.response) {
      const { status, data } = error.response;
      let errorMessage = data?.message || "请求失败";

      // 根据 HTTP 状态码不同，做不同的提示
      switch (status) {
        case 400:
          message.error(`请求错误：${errorMessage}`);
          break;
        case 401:
          message.error("未授权，请登录");
          break;
        case 403:
          // if (error.response?.data?.code === 1) {
          //   message.error(error.response?.data?.message);
          //   const redirectUrl = error.response?.data?.data?.url;
          //   if (redirectUrl) {
          //     console.log(redirectUrl);
          //     window.location.href = redirectUrl; // 在本窗口打开
          //   } else {
          //     console.warn("403 发生，但没有提供跳转 URL");
          //   }
          // }

          break;
        case 404:
          if (data?.code === 2) {
            // message.error(data.message);
          } else {
            message.error("请求资源未找到");
          }
          break;
        case 500:
          message.error("服务器内部错误");
          break;
        default:
          message.error(`请求失败，状态码：${status}`);
          break;
      }
    } else if (error.request) {
      // 请求已经发出，但没有收到响应
      message.error("请求超时，请检查网络");
    } else {
      // 发生在设置请求时的错误
      message.error(`请求配置错误：${error.message}`);
    }
    console.log(error);

    // 阻止错误继续传播，避免触发 React 错误边界
    return Promise.resolve(error.response.data); // 这里返回一个 resolved promise，避免抛出错误
  }
);

export default http;
