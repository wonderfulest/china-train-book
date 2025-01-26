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
    return res;
  },
  error => {
    console.log('err' + error);
    return Promise.reject(error);
  }
);

export default service;
