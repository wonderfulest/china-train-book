import axios from 'axios';

// 创建axios实例
const service = axios.create({
  baseURL: '/api',  // 添加 baseURL
  timeout: 10000
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 这里可以添加token等通用请求头
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    console.log(res)
    // 判断返回值，code为0表示成功
    if (res.code == '0') {
      return {
        success: true,
        code: res.code,
        data: res.data
      };
    }
    // 非0表示失败，直接弹出错误消息
    return Promise.reject(new Error(res.message || '请求失败'));
  },
  error => {
    console.log('err' + error);
    // 网络错误也弹出提示
    return Promise.reject(error);
  }
);

export default service;
