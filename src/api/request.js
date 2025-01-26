import axios from 'axios';
import { getApiConfig } from './config';

// 创建axios实例
const service = axios.create(getApiConfig());

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 这里可以添加token等通用请求头
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    console.error('Response error:', error);
    return Promise.reject(error);
  }
);

export default service;
