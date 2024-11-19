import axios from 'axios';

// 创建axios实例
const http = axios.create({
  baseURL: 'http://127.0.0.1:3000',
  timeout: 3000,
  headers: {'Content-Type': 'application/json'}
});

// 添加请求拦截器
http.interceptors.request.use(
  function(config) {
    // 在发送请求之前做一些事情
    // 例如添加认证头
    // 注意：这里不需要直接使用 token，因为 token 会通过默认 header 动态更新
    
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    return response.data;
  },
  function(error) {
    // 对响应错误做点什么
    if (error.response) {
      // 请求已发出，并且服务器也响应了状态码，
      // 但它可能不是预期的成功的状态码
      if (error.response.status === 401) {
        // 处理未授权错误
        // 可能需要刷新令牌或重定向到登录页面
        // AsyncStorage.removeItem('token');
        // Toast.show({
        //   type: 'error',
        //   text1: '登录已失效,请重新登录！',
        //   text2: 'Please login again.'
        // });
        // router.replace('/user/login');
      } else {
        // Toast.show({
        //   type: 'error',
        //   text1: '请求失败！',
        //   text2: `Status code: ${error.response.status}`
        // });
        
      }
    } else if (error.request) {
      // 发出了请求，但没有收到响应
      // `error.request` 在底层响应对象上
    //   Toast.show({
    //     type: 'error',
    //     text1: '请求超时！',
    //     text2: 'Check your internet connection.'
    //   });
    } else {
      // 发生了一些设置请求时触发的错误
    //   Toast.show({
    //     type: 'error',
    //     text1: 'Error setting up request.',
    //     text2: error.message
    //   });
    }
    // return Promise.reject(error);
  }
);

export default http;