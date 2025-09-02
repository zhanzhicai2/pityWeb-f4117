import {message, notification} from 'antd';
import {listUsers} from '@/services/user';
import { stringify } from 'querystring';
import {history} from "umi";
// import {stringify} from "_querystring@0.2.1@querystring";

export default {
  headers: (json = true) => {
    const token = localStorage.getItem('pityToken');
    const headers = {token};
    if (json) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  },
  notificationResponse: (res, info = false, position = 'topRight') => {
    if (!res || res.code === undefined) {
      notification.error({message: "网络开小差了，请稍后重试", placement: position})
      return false;
    }
    if (res.code === 0) {
      if (info) {
        notification.success({
          message: res.msg,
          placement: position,
        });
      }
      return true;
    }
    if (res.code === 401) {
      // 说明用户未认证
      // message.info(res.msg);
      localStorage.setItem('pityToken', null);
      localStorage.setItem('pityUser', null);
      // if (window.location.href.indexOf("/user/login") === -1){
      //   history.replace({
      //     pathname: '/user/login',
      //     search: stringify({
      //       redirect: window.location.href,
      //     }),
      //   });
      // }

      const href = window.location.href;
      if (href.indexOf("/user/login") === -1) {
        const uri = href.split("redirect=")
        window.location.href = `/#/user/login?redirect=${uri[uri.length - 1]}`
        // window.open(`/#/user/login?redirect=${href}`)
      }

      notification.info({
        message: res.msg,
        placement: res.msg,
      });
      return false;
    }
    notification.error({message: res.msg, placement: position})
    return false;
  },
  response: (res, info = false) => {
    if (!res || res.code === undefined) {
      void message.error("网络开小差了，请稍后重试")
      return false;
    }
    if (res.code === 0) {
      if (info) {
        void message.success(res.msg);
      }
      return true;
    }
    if (res.code === 401) {
      // 说明用户未认证
      // message.info(res.msg);
      localStorage.setItem('pityToken', null);
      localStorage.setItem('pityUser', null);
      // window.location.href = '/user/login';

      // if (window.location.href.indexOf("/user/login") === -1) {
      //   history.replace({
      //     pathname: '/user/login',
      //     search: stringify({
      //       redirect: window.location.href,
      //     }),
      //   });
      const href = window.location.href;
      if (href.indexOf("/user/login") === -1) {
        const uri = href.split("redirect=")
        window.location.href = `/#/user/login?redirect=${uri[uri.length - 1]}`
        // window.open(`/#/user/login?redirect=${href}`)
      }

      // window.location.reload();
      // history.replace({
      //   pathname:'/user/login',
      //   search:stringify({
      //     redirect:window.location.href,
      //   })
      // });
      void message.info(res.msg);
      return false;
    }
    void message.error(res.msg);
    return false;
  },
  getUserMap: async () => {
    const user = await listUsers();
    const temp = {};
    user.forEach((item) => {
      temp[item.id] = item;
    });
    return temp;
  }
};
