import React, { memo, useEffect, useState } from 'react';
import {PageContainer} from '@ant-design/pro-components';
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Empty,
  Input,
  Menu,
  Modal,
  Pagination,
  Popover,
  Row,
  Select, Spin,
  Tooltip,
} from 'antd';
import {
  AliwangwangOutlined,
  DeleteTwoTone,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  SearchOutlined
} from '@ant-design/icons';
import FormForModal from '@/components/PityForm/FormForModal';
import {connect, history} from 'umi';
import {insertProject, listProject} from '@/services/project';
import auth from '@/utils/auth';
import {process} from '@/utils/utils';
import {listUsers} from '@/services/user';
import noRecord from '@/assets/no_record.svg'
import UserLink from "@/components/Button/UserLink";
import CONFIG from "@/consts/config";
import styles from './Project.less';
import UserSelect from "@/components/User/UserSelect";
import {IconFont} from "@/components/Icon/IconFont";

const {Search} = Input;
const {Option} = Select;

const Project = ({dispatch, project, loading}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({current: 1, pageSize: 8, total: 0,showTotal: count => `共${count}个项目`});
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [spinning, setSpinning] = useState(false);

  const fetchData = async (current = pagination.current, size = pagination.pageSize) => {
    setSpinning(true)
    const res = await listProject({page: current, size});
    setSpinning(false)
    if (auth.response(res)) {
      setData(res.data);
      setPagination({...pagination, current, total: res.total});
    }
  };

  const getUsers = async () => {
    const user = await listUsers();
    const temp = {};
    user.forEach((item) => {
      temp[item.id] = item;
    });
    setUsers(user);
    setUserMap(temp);
  };

  const onDeleteProject = async projectId => {
    const res = await dispatch({
      type: 'project/deleteProject',
      payload: {
        projectId,
      },
    });
    if (res) {
      fetchData();
    }
  }

  useEffect( () => {
     getUsers();
     fetchData();
  }, []);

  const onSearchProject = async e => {
    const projectName = e.target.value;
    const res = await listProject({page:1,size:pagination.PageSize, name:projectName});
    if(auth.response(res)){
      setData(res.data);
      setPagination({...pagination,current: 1,total: res.total})
    }

    // await process(async () => {
    //   const res = await listProject({page: 1, size: pagination.size, name: projectName});
    //   if (auth.response(res)) {
    //     setData(res.data);
    //     setPagination({...pagination, current: 1, total: res.total});
    //   }
    // });
  };

  const onHandleCreate = async (values) => {
    const res = await insertProject(values);
    if (auth.response(res, true)) {
      setVisible(false);
      // 创建成功后自动获取第一页的数据, 因为项目会按创建时间排序
      await fetchData(1);
    }
  };

  const fields = [
    {
      name: 'name',
      label: '项目名称',
      required: true,
      message: '请输入项目名称',
      type: 'input',
      placeholder: '请输入项目名称',
    },
    {
      name: 'app',
      label: '服务名',
      required: true,
      message: '请输入项目对应服务名称',
      type: 'input',
      placeholder: '请输入项目对应服务名称',
      component: null,
    },
    {
      name: 'owner',
      label: '项目负责人',
      required: true,
      component: <UserSelect users={users} placeholder="选择项目负责人"/>,
      type: 'select',
    },
    {
      name: 'description',
      label: '项目描述',
      required: false,
      message: '请输入项目描述',
      type: 'textarea',
      placeholder: '请输入项目描述',
    },
    {
      name: 'dingtalkurl',
      label: '钉钉通知openapi',
      required: false,
      message: '请输入项目对应钉钉群机器人api',
      type: 'input',
      placeholder: '请输入项目对应钉钉群机器人api',
    },
    {
      name: 'private',
      label: '是否私有',
      required: true,
      message: '请选择项目是否私有',
      type: 'switch',
      valuePropName: 'checked',
    },
  ];

  const menu = item => <Menu>
    <Menu.Item icon={<AliwangwangOutlined/>}>
      <a>
        申请权限
      </a>
    </Menu.Item>
    <Menu.Item icon={<DeleteTwoTone twoToneColor="red"/>}>
      <a onClick={e => {
        e.stopPropagation();
        Modal.confirm({
          title: '你确定要删除此项目吗?',
          icon: <ExclamationCircleOutlined/>,
          content: '删除后不可恢复，请谨慎~',
          okText: '确定',
          okType: 'danger',
          cancelText: '点错了',
          onOk: async () => {
            await onDeleteProject(item.id);
          },
        });
      }}>
        删除项目
      </a>
    </Menu.Item>
  </Menu>;

  const CardTitle = ({item}) => (
    <div style={{fontSize: 16, fontWeight: 'bold', color: 'rgb(65, 74, 105)',overflow: 'hidden',textOverflow: 'ellipsis',}}>
      {item.name}
      <span style={{float: 'right', lineHeight: '24px', fontSize: 24, marginRight: 4}}>
          <Dropdown overlay={menu(item)} onClick={e => {
            e.stopPropagation();
          }}>
            <IconFont type="icon-more1" style={{cursor: 'pointer'}}/>
          </Dropdown>
        </span>
    </div>
  )

  return (
    <PageContainer title={false} breadcrumb={null}>
      <FormForModal
        width={600}
        title="添加项目"
        left={6}
        right={18}
        record={{private: false}}
        open={visible}
        onCancel={() => setVisible(false)}
        fields={fields}
        onFinish={onHandleCreate}
      />
      <Spin spinning={spinning}>
        <Card style={{marginBottom: 12}}>
          <Row gutter={8}>
            <Col span={18}>
              <Button type="primary" onClick={() => setVisible(true)}>
                创建项目
                <Tooltip title="只有超级管理员可以创建项目">
                  <QuestionCircleOutlined/>
                </Tooltip>
              </Button>
            </Col>
            <Col span={6}>
              <Input
                className="borderSearch"
                prefix={<SearchOutlined/>}
                onPressEnter={onSearchProject}
                style={{float: 'right'}}
                placeholder="请输入项目名称"
              />
            </Col>
          </Row>
        </Card>
        <Row gutter={24}>
          {data.length === 0 ? (
            <Col span={24} style={{textAlign: 'center', marginBottom: 12}}>
              <Card>
                <Empty description="暂无项目, 快点击『创建项目』创建一个吧!" image={noRecord} imageStyle={{height: 220}}/>
              </Card>
            </Col>
          ) : (
            data.map((item) => (
              <Col key={item.id} span={6} style={{marginBottom: 24}}>
                <Popover
                                    content={
                                      <div style={{ maxWidth: 300 }}>
                                        <p><strong>描述：</strong> {item.description || '无'}</p>
                                        <p><strong>负责人：</strong> <UserLink user={userMap[item.owner]} /></p>
                                        <p><strong>更新时间：</strong> {item.updated_at}</p>
                                      </div>
                                    }
                                    trigger="hover"
                                    placement="topLeft"
                                  >
                <Card hoverable className={styles.card}>
                  <Card.Meta
                    avatar={<Avatar src={item.avatar || CONFIG.PROJECT_AVATAR_URL} size={48}/>}
                    title={<CardTitle item={item}/>}
                    description={<div style={{ width: '100%', minWidth: 0 }}>
                      <p className={styles.description}>描述:{item.description || '无'}</p>
                      <p className={styles.description}>负责人: {<UserLink user={userMap[item.owner]}/>}</p>
                      <p className={styles.description}>更新时间:{item.updated_at}</p>
                    </div>}
                    onClick={() => {
                      history.push(`/project/${item.id}`);
                    }}
                  />
                </Card>
                </Popover>
              </Col>
            ))
          )}
        </Row>
        <Row gutter={8}>
          <Col span={24}>
            <Pagination {...pagination} style={{float: 'right'}} position="bottomRight" onChange={pg => {
              fetchData(pg).then(r => {})
            }}/>
          </Col>
        </Row>
      </Spin>
    </PageContainer>
  );
};


export default connect(({loading, project}) => ({loading, project}))(memo(Project));