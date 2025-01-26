import request from '../request';

// 用户相关接口示例
export const userApi = {
  // 获取用户信息
  getUserInfo: (userId) => {
    return request({
      url: `/user/${userId}`,
      method: 'get'
    });
  },
  
  // 用户登录
  login: (data) => {
    return request({
      url: '/user/login',
      method: 'post',
      data
    });
  }
};
