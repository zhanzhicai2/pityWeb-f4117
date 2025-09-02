import { Card, Col, List, Input, Menu, Row, Select, Switch, Tabs, Tooltip, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import UserLink from '@/components/Button/UserLink';
import { CloseOutlined, EyeTwoTone, NodeCollapseOutlined } from '@ant-design/icons';
import TooltipIcon from '@/components/Icon/TooltipIcon';
import Markdown from "@/components/CodeEditor/Markdown";


const Notification=({global,user,dispatch, loading}) =>{

  const [current, setCurrent] = useState("0");
  const [activeTab, setActiveTab] = useState("1");
  const [title, setTitle] = useState("");
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState("");

  const {userMap} = user;

  const {notices} = global;

  const tabListNoTitle = [
    {
      key: "1",
      tab: '未读消息',
    },
    {
      key: "2",
      tab: '已读消息',
    }
  ];

  useEffect(async () => {
    await dispatch({
      type: 'global/fetchNotices',
      payload: {
        msg_status: activeTab,
        msg_type: current,
      }
    });
    if (activeTab === "1") {
      await dispatch({
        type: 'global/readNotices',
      })
      await dispatch({
        type: 'global/save',
        payload: {
          noticeCount: 0,
        }
      })
    }
  },[activeTab, current])

  const handlerClick = e =>{
    setCurrent(e.key);
  };

  const onDelete = async id =>{
    await dispatch({
      type: 'global/deleteNotice',
      payload: {
        idList: [id]
      }
    })
    await dispatch({
      type: 'global/fetchNotices',
      payload: {
        msg_statue: activeTab,
        msg_type: current,
      }
    });
  }

  return (
    <div>临时用 Notification
      <PageContainer breadcrumb={null} title="消息中心">
        <Modal title={title} visible={visible} footer={null} onCancel={() => {
          setVisible(false)
        }}>
          <Markdown value={content}/>
        </Modal>
        <Row gutter={18}>
          <Col span={1}/>
          <Col span={5}>
            <div style={{minHeight:480, background:'#ffff'}}>
              <Menu
                theme='light'
                mode= "inline"
                onClick = {handlerClick}
                defaultOpenKeys={[current]}
                selectedKeys={[current]}
              >
                <Menu.Item key="0">全部消息</Menu.Item>
                <Menu.Item key="1">系统通知</Menu.Item>
                <Menu.Item key="2">用户消息</Menu.Item>
              </Menu>
            </div>
          </Col>
          <Col span={16}>
            <Card
              style={{width:'100%'}}
              bodyStyle={{minHeight:500}}
              tabList={tabListNoTitle}
              activeTabKey={activeTab}
              onTabChange={key => {
                setActiveTab(key)
              }}
            >
              <List
                itemLayout="horizontal"
                dataSource={notices}
                renderItem = {item => (
                  <List.Item >
                    <List.Item.Meta
                      avatar={<UserLink user={userMap[item.sender]}/>}
                      title={<a href={item.link}>{item.msg_title}</a>}
                      description={item.created_at}
                    />
                    <div style={{marginRight:12}}>
                      {/*<TooltipIcon title="点击已读" font={16} icon={<CheckOutlined style={{color: '#22ff22'}}/>}/>*/}
                      {
                        item.msg_content ? <TooltipIcon title="查看更多" style={{marginLeft:8}} font={16} icon = {<EyeTwoTone/>}
                                                    onClick ={() => {
                                                      if (item.msg_content){
                                                        setContent(item.msg_content)
                                                        setVisible(true)
                                                        setTitle(item.msg_title)
                                                      }
                                                    }} /> :null
                      }
                      {
                        item.msg_type !== 1 ? <TooltipIcon title="删除该消息" style={{marginLeft: 8}} font={16}
                                                           onClick={async () => {
                                                             await onDelete(item.id)
                                                           }}
                                                           icon={<CloseOutlined style={{color: '#ff3b3b'}}/>}/> : null
                      }
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </PageContainer>

    </div>
  );
}

export default connect(({global,user,loading}) =>({
  global: global,
  loading: loading,
  user: user,
}))(Notification)