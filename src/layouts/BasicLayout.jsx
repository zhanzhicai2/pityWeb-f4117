/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 *
 * @see You can view component api by: https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter, getMenuData, ProBreadcrumb } from '@ant-design/pro-layout';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect, history, Link, useIntl } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Empty, notification, Result, Spin } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getMatchMenu } from '@umijs/route-utils';
import logo from '../assets/logo.svg';
import { CONFIG } from '@/consts/config';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { IconFont } from '@/components/Icon/IconFont';
import NoTableData from '@/assets/NoSearch.svg';
import "@icon-park/react/styles/index.less"
import {Loading} from "@icon-park/react";

// Spin.setDefaultIndicator(<IconFont type="icon-icon-1" spin style={{ fontSize: 36 }} />);
// Spin.setDefaultIndicator(<IconFont type="icon-icon-1" spin style={{fontSize: 36}}/>)
Spin.setDefaultIndicator(<Loading theme="filled" size="32" fill="#74aeff" strokeLinecap="square" spin={true} />)

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
NProgress.configure({ showSpinner: true });

/** Use Authorized check all menu item */
const menuDataRender = (menuList) =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null);
  });

const defaultFooterDom = (
  <DefaultFooter
    copyright={
      <span>
        {new Date().getFullYear()} woody个人出品{' '}
        <a href="https://beian.miit.gov.cn">鄂ICP备20001602号</a>
      </span>
    }
    links={[
      {
        key: 'Pity Web',
        title: 'Pity Web',
        // href: 'https://pro.ant.design',
        href: 'http://127.0.0.1:8010/user/login',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/ant-design/ant-design-pro',
        // href: 'https://github.com/wuranxu/pityWeb',
        blankTarget: true,
      },
      {
        key: 'Pity',
        title: 'Pity',
        href: 'https://ant.design',
        // href: 'https://github.com/wuranxu/pity',
        blankTarget: true,
      },
    ]}
  />
);

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    recorder,
    settings,
    location = {
      pathname: '/',
    },
    noticeCount,
  } = props;
  const menuDataRef = useRef([]);
  const { currentUser } = props.user;
  const [currentHref, setCurrentHref] = useState('');
  // const ws = new WebSocket('ws://localhost:8080/ws');
  //   ws.onmessage = function (event) {
  //       console.log('Basiclayout message', event.data);
  //   };

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
    if (currentUser && currentUser.id) {
      const ws = new WebSocket(`${CONFIG.WS_URL}/${currentUser.id}`);
      ws.onmessage = function (event) {
        event.preventDefault();
        const message = event.data;
        const msg = JSON.parse(message);
        if (msg.type === 0) {
          dispatch({
            type: 'global/save',
            payload: {
              noticeCount: msg.total ? msg.count : msg.count + noticeCount,
            },
          });
        } else if (msg.type === 1) {
          notification.info({
            message: msg.title,
            description: msg.content,
          });
        } else if (msg.type === 2) {
          // 说明是录制消息
          dispatch({
            type: 'recorder/readRecord',
            payload: {
              data: JSON.parse(msg.record_msg),
            },
          });
        } else if (msg.type === 3) {
          // 心跳包，忽略
        }
      };
    }
  }, []);
  /** Init variables */

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const { route = { routes: [] } } = props;
  const { routes = [] } = route;
  const menu = getMenuData(routes);

  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || '/', menu.menuData).pop() || {
        authority: undefined,
      },
    [location.pathname],
  );
  const { formatMessage } = useIntl();
  const { ld } = props;
  const { href } = window.location;
  if (currentHref !== href) {
    NProgress.start();
    if (!ld.global) {
      NProgress.done();
      setCurrentHref(href);
    }
  }
  return (
    <ConfigProvider
      renderEmpty={() => (
        <Empty image={NoTableData} imageStyle={{ height: 160 }} description="暂无数据" />
      )}
    >
      <ProLayout
        logo={logo}
        // layout='top'
        SiderMenuProps={{ mode: 'horizontal' }}
        // formatMessage={formatMessage}
        {...props}
        {...settings}
        onCollapse={handleMenuCollapse}
        onMenuHeaderClick={() => history.push('/')}
        headerContentRender={() => {
          return <ProBreadcrumb />;
        }}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (
            menuItemProps.isUrl ||
            !menuItemProps.path ||
            location.pathname === menuItemProps.path
          ) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.home',
            }),
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        footerRender={() => {
          if (settings.footerRender || settings.footerRender === undefined) {
            return defaultFooterDom;
          }

          return null;
        }}
        menuDataRender={menuDataRender}
        rightContentRender={() => <RightContent />}
        postMenuData={(menuData) => {
          menuDataRef.current = menuData || [];
          return menuData || [];
        }}
        // iconfontUrl="//at.alicdn.com/t/font_915840_xhupy1nll7.js"
        // iconfontUrl="//at.alicdn.com/t/font_915840_2ne958vidtk.js"
        iconfontUrl={CONFIG.ICONFONT}
        // layout='top'  // 上中下顶部布局，取消就是左右布局
      >
        <Authorized authority={authorized.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>
    </ConfigProvider>
  );
};

export default connect(({ user, global, settings, recorder, loading }) => ({
  collapsed: global.collapsed,
  noticeCount: global.noticeCount,
  settings,
  user,
  recorder,
  ld: loading,
}))(BasicLayout);
