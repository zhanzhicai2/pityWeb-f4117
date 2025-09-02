import {
  GithubOutlined,
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Alert, Space, Tabs } from 'antd';
import React, {useRef, useState } from 'react';
import ProForm, { ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { connect, FormattedMessage, useIntl } from 'umi';
import styles from './index.less';

const clientId = `Ov23liVwVosaCVRmkjg2`;
const secret = `490e04ca7426209c0b43b4ae4884a70e01c7c785`;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const formRef = useRef();
  const [type, setType] = useState('account');
  const intl = useIntl();
  const {dispatch} = props;

  // const handleSubmit = (values) => {
  //   const { dispatch } = props;
  //   dispatch({
  //     type: 'login/login',
  //     payload: { ...values, type },
  //   });
  // };
  const handleSubmit = (values) => {
    if (type === 'account') {
      dispatch({
        type: 'login/login',
        payload: { username: values.username, password: values.password },
      });
    } else {
      dispatch({
        type: 'login/register',
        payload: { ...values, setType },
      });
    }
  };
  const redirectToGithub = () => {
    // const current = window.location.href
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}`;
  };

  const handleEnterKey = (e) => {
    if (e.nativeEvent.keyCode === 13) {
      //e.nativeEvent获取原生的事件对像
      handleSubmit();
    }
  };

  return (
    <div className={styles.main}>
      <ProForm
        formRef={formRef}
        initialValues={{
          autoLogin: true,
        }}
        isKeyPressSubmit
        submitter={{
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '100%',
              borderRadius: '32px',
            },
          },
        }}
        onFinish={(values) => {
          handleSubmit(values);
          return Promise.resolve();
        }}
      >
        <Tabs activeKey={type} onChange={setType}>
          <Tabs.TabPane
            key="account"
            tab={intl.formatMessage({
              id: 'pages.login.accountLogin.tab',
              defaultMessage: '账户密码登录',
            })}
          />
          <Tabs.TabPane
            // key="mobile"
            // tab={intl.formatMessage({
            //   id: 'pages.login.phoneLogin.tab',
            //   defaultMessage: '手机号登录',
            // })}
            key="register"
            tab="注册"
          />
        </Tabs>

        {status === 'error' && loginType === 'account' && !submitting && (
          <LoginMessage
            content={intl.formatMessage({
              id: 'pages.login.accountLogin.errorMessage',
              defaultMessage: '账户或密码错误（admin/ant.design)',
            })}
          />
        )}
        {type === 'account' && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                style: { borderRadius: '24px' },
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.username.placeholder',
                // defaultMessage: '用户名: admin or user',
                defaultMessage: '请输入用户名',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.username.required"
                      defaultMessage="请输入用户名!"
                    />
                  ),
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                style: { borderRadius: '24px' },
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.password.placeholder',
                // defaultMessage: '密码: ant.design',
                defaultMessage: '请输入密码',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.password.required"
                      defaultMessage="请输入密码！"
                    />
                  ),
                },
              ]}
            />
          </>
        )}

        {status === 'error' && loginType === 'mobile' && !submitting && (
          <LoginMessage content="验证码错误" />
        )}
        {type === 'register' && (
          <>
            <ProFormText
              fieldProps={{
                size: 'large',
                style: { borderRadius: '24px' },
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              name="username"
              placeholder="请输入用户名"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            />
            <ProFormText
              fieldProps={{
                size: 'large',
                style: { borderRadius: '24px' },
                prefix: <MobileOutlined className={styles.prefixIcon} />,
              }}
              name="name"
              placeholder="请输入姓名"
              rules={[
                {
                  required: true,
                  message: '请输入姓名',
                },
              ]}
            />
            <ProFormText
              fieldProps={{
                size: 'large',
                style: { borderRadius: '24px' },
                prefix: <MailOutlined className={styles.prefixIcon} />,
              }}
              name="email"
              placeholder="请输入用户邮箱"
              rules={[
                {
                  type: 'email',
                  required: true,
                  message: '请输入合法用户邮箱',
                },
              ]}
            />
            <ProFormText.Password
              fieldProps={{
                size: 'large',
                style: { borderRadius: '24px' },
                prefix: <LockOutlined className={styles.prefixIcon} />,
                type: 'password',
              }}
              name="password"
              placeholder="请输入用户密码"
              rules={[
                {
                  required: true,
                  message: '请输入用户密码',
                },
              ]}
            />
          </>
        )}
        {/*{type === 'mobile' && (*/}
        {/*  <>*/}
        {/*    <ProFormText*/}
        {/*      fieldProps={{*/}
        {/*        size: 'large',*/}
        {/*        prefix: <MobileOutlined className={styles.prefixIcon} />,*/}
        {/*      }}*/}
        {/*      name="mobile"*/}
        {/*      placeholder={intl.formatMessage({*/}
        {/*        id: 'pages.login.phoneNumber.placeholder',*/}
        {/*        defaultMessage: '手机号',*/}
        {/*      })}*/}
        {/*      rules={[*/}
        {/*        {*/}
        {/*          required: true,*/}
        {/*          message: (*/}
        {/*            <FormattedMessage*/}
        {/*              id="pages.login.phoneNumber.required"*/}
        {/*              defaultMessage="请输入手机号！"*/}
        {/*            />*/}
        {/*          ),*/}
        {/*        },*/}
        {/*        {*/}
        {/*          pattern: /^1\d{10}$/,*/}
        {/*          message: (*/}
        {/*            <FormattedMessage*/}
        {/*              id="pages.login.phoneNumber.invalid"*/}
        {/*              defaultMessage="手机号格式错误！"*/}
        {/*            />*/}
        {/*          ),*/}
        {/*        },*/}
        {/*      ]}*/}
        {/*    />*/}
        {/*    <ProFormCaptcha*/}
        {/*      fieldProps={{*/}
        {/*        size: 'large',*/}
        {/*        prefix: <MailOutlined className={styles.prefixIcon} />,*/}
        {/*      }}*/}
        {/*      captchaProps={{*/}
        {/*        size: 'large',*/}
        {/*      }}*/}
        {/*      placeholder={intl.formatMessage({*/}
        {/*        id: 'pages.login.captcha.placeholder',*/}
        {/*        defaultMessage: '请输入验证码',*/}
        {/*      })}*/}
        {/*      captchaTextRender={(timing, count) => {*/}
        {/*        if (timing) {*/}
        {/*          return `${count} ${intl.formatMessage({*/}
        {/*            id: 'pages.getCaptchaSecondText',*/}
        {/*            defaultMessage: '获取验证码',*/}
        {/*          })}`;*/}
        {/*        }*/}

        {/*        return intl.formatMessage({*/}
        {/*          id: 'pages.login.phoneLogin.getVerificationCode',*/}
        {/*          defaultMessage: '获取验证码',*/}
        {/*        });*/}
        {/*      }}*/}
        {/*      name="captcha"*/}
        {/*      rules={[*/}
        {/*        {*/}
        {/*          required: true,*/}
        {/*          message: (*/}
        {/*            <FormattedMessage*/}
        {/*              id="pages.login.captcha.required"*/}
        {/*              defaultMessage="请输入验证码！"*/}
        {/*            />*/}
        {/*          ),*/}
        {/*        },*/}
        {/*      ]}*/}
        {/*      onGetCaptcha={async (mobile) => {*/}
        {/*        const result = await getFakeCaptcha(mobile);*/}

        {/*        if (result === false) {*/}
        {/*          return;*/}
        {/*        }*/}

        {/*        message.success('获取验证码成功！验证码为：1234');*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </>*/}
        {/*)}*/}
        <div
          style={{
            marginBottom: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
          </ProFormCheckbox>
          <a
            onClick={() =>{
              if(type === 'account'){
                if(formRef?.current?.getFieldValues("username")=== ''){
                  message.info("请在用户名处输入你的邮箱")
                  return;
              }
                dispatch({
                  type: 'login/resetPwd',
                  payload: formRef?.current?.getFieldValue("username")
                })
              } else {
                if (formRef?.current?.getFieldValue("email") === '') {
                  message.info("请在邮箱处输入你的邮箱")
                  return;
                }
                dispatch({
                  type: 'login/resetPwd',
                  payload: formRef?.current?.getFieldValue("email")
                })
              }
            }}
            style={{
              float: 'right',
            }}
          >
            <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
          </a>
        </div>
      </ProForm>
      <Space className={styles.other}>
        <FormattedMessage id="pages.login.loginWith" defaultMessage="其他登录方式" />
        {/*<AlipayCircleOutlined className={styles.icon}/>*/}
        {/*<TaobaoCircleOutlined className={styles.icon}/>*/}
        {/*<WeiboCircleOutlined className={styles.icon}/>*/}
        <GithubOutlined className={styles.icon} onClick={redirectToGithub} />
      </Space>
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
