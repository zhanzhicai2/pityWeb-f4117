import {Badge, Button, Card, Col, Modal, Row, Switch, Tabs, Tag, Timeline} from "antd";
import {IconFont} from "@/components/Icon/IconFont";
import TooltipIcon from "@/components/Icon/TooltipIcon";
import {
  DeleteTwoTone,
  EditTwoTone,
  ExclamationCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SaveOutlined
} from "@ant-design/icons";
import TestcaseData from "@/components/TestCase/TestcaseData";
import NoRecord2 from "@/components/NotFound/NoRecord2";
import NoRecord from "@/components/NotFound/NoRecord";
import SortedTable from "@/components/Table/SortedTable";
import PostmanForm from "@/components/Postman/PostmanForm";
import TestCaseAssert from "@/components/TestCase/TestCaseAssert";
import React from "react";
import {CONFIG} from "@/consts/config";
import {connect} from 'umi';
import TestCaseOutParameters from "@/components/TestCase/TestCaseOutParameters";
import common from '@/utils/common';

const {TabPane} = Tabs

const TestCaseBottom = ({
  dispatch,
  testcase,
  case_id,
  setSuffix,
  body,
  setBody,
  formData,
  setFormData,
  gconfig,
  onSubmit,
  form,
  createMode = false,
  headers,
  setHeaders,
  bodyType,
  setBodyType,
  loading,
}) => {
  const { preConstructor,postConstructor, activeKey, constructors_case, envActiveKey, asserts, caseInfo } = testcase;
  const { envList } = gconfig;


  const onCreateConstructor = () => {
    dispatch({
      type: 'testcase/save',
      payload: {
        constructorModal: true,
        testCaseConstructorData: {
          public: true,
          enable: true,
        },
        currentStep: 0,
        constructRecord: {}
      },
    });
    dispatch({
      type: 'construct/save',
      payload: { currentStep: 0 },
    });
  };

  // 删除数据构造器
  const onDeleteConstructor = async (record,suffix=false) => {
    const res = await dispatch({
      type: 'construct/delete',
      payload: { id: record.id },
    });
    if (res) {
      let newData;
      if (suffix){
        newData = postConstructor.filter((v) => v.id !== record.id);

      }else {
        newData = preConstructor.filter(v => v.id !== record.id)
      }
      dispatch({
        type: 'testcase/save',
        payload: { [!suffix ? "preConstructor" : "postConstructor"]: newData },
      });
    }
  };

  // 删除本地数据构造器
  const onDeleteConstructorLocal = async (record, suffix) => {
    const newData = [...(!suffix ? preConstructor : postConstructor)];
    newData.splice(record.index, 1)
    dispatch({
      type: 'testcase/save',
      payload: {[!suffix ? "preConstructor" : "postConstructor"]: newData.map((v, index) => ({...v, index}))}
    })
  }

  const getJson = (record, json_data) => {
    if (record.type === 4) {
      return {
        body: json_data.body,
        headers: common.parseHeaders(json_data.headers),
        base_path: json_data.base_path,
        url: json_data.url,
        request_method: json_data.request_method,
        body_type: json_data.body_type,
      }
    }
    return json_data
  }

  // 编辑数据构造器
  const onEditConstructor = (record) => {
    const dt = JSON.parse(record.constructor_json);
    dispatch({
      type: 'construct/save',
      payload: {
        currentStep: 1,
        testCaseConstructorData: { ...record, ...getJson(record, dt) },
        constructorType: record.type,
      },
    });
    dispatch({
      type: 'testcase/save',
      payload: { constructorModal: true, constructRecord: record },
    });
  };

  const onSwitchConstructor = async (record, value,suffix=false) => {
    let res;
    const newData = [...(!suffix ? preConstructor : postConstructor)]
    if(createMode){
      res =true;
    }else {
       res = await dispatch({
        type: 'construct/update',
        payload: {
          ...record,
          enable: value,
        },
      });
    }
    if (res) {
      if(createMode){
        newData.forEach((v, index) => {
          if (index === record.index) {
            v.enable = value
          }
        })
      } else {
        newData.forEach(v => {
          if (v.id === record.id) {
            v.enable = value
          }
        })
      }
      dispatch({
        type: 'testcase/save',
        payload: { [!suffix ? "preConstructor" : "postConstructor"]: newData },
      });
    }
  };

  const getDesc = (item) => {
    const data = JSON.parse(item.constructor_json);
    if (item.type === 0) {
      const result = constructors_case[data.case_id];
      if (!result) {
        return null;
      }
      return (
        <div>
          用例:{' '}
          <a
            href={`/#/apiTest/testcase/${result.directory_id}/${result.id}`}
            target="_blank"
            rel="noreferrer"
          >
            {result.name}
          </a>
        </div>
      );
    }
    if (item.type === 1) {
      return <code>{data.sql}</code>;
    }

    if (item.type === 2) {
      return (
        <code>
          <pre>{data.command}</pre>
        </code>
      );
    }
    if (item.type === 3) {
      return (
        <code>
          <pre>{data.command}</pre>
        </code>
      );
    }
  };
  const BadgeButton = ({number,bgColor,color,style}) => {
    if (number === 0) {
      return null;
    }
    return <div style={{
      display: 'inline-block',
      marginLeft: '2',
      textAlign: 'center',
      width: '24',
      borderRadius:10,
      backgroundColor:color,
      color,
      ...style,

    }}>{number}</div>;
  }

  const columns = [
    {
      title: '名称',
      key: 'name',
      dataIndex: 'name',
      render: (text, record,index) => (
        <a
          onClick={() => {
            onEditConstructor({...record, tempIndex: index});
          }}
        >
          {text}
        </a>
      ),
      className: 'drag-visible',
    },
    {
      title: '类型',
      key: 'type',
      dataIndex: 'type',
      render: (tag) => (
        <Tag color={CONFIG.CASE_CONSTRUCTOR_COLOR[tag]}>{CONFIG.CASE_CONSTRUCTOR[tag]}</Tag>
      ),
      className: 'drag-visible',
    },
    {
      title: '状态',
      key: 'enable',
      dataIndex: 'enable',
      className: 'drag-visible',
      render: (enable, record) => (
        <Switch
          defaultChecked={record.enable}
          onChange={async (value) => {
            await onSwitchConstructor(record, value);
          }}
        />
      ),
    },
    {
      title: '返回值',
      key: 'value',
      dataIndex: 'value',
      className: 'drag-visible',
    },
    {
      title: '操作',
      key: 'ops',
      className: 'drag-visible',
      render: (_, record,index) => (
        <>
          <a
            onClick={() => {
              onEditConstructor({...record, tempIndex: index});
            }}
          >
            <EditTwoTone />
          </a>
          <a
            style={{ marginLeft: 8 }}
            onClick={() => {
              Modal.confirm({
                title: '你确定要删除这个数据构造器吗?',
                icon: <ExclamationCircleOutlined />,
                content: '如果只是暂时不开启，可以先暂停它~',
                okText: '确定',
                okType: 'danger',
                cancelText: '点错了',
                onOk: async () => {
                  if(createMode){
                    await onDeleteConstructorLocal(record)
                  }else {
                    await onDeleteConstructor(record)
                  }
                },
              });
            }}
          >
            <DeleteTwoTone twoToneColor="red" />
          </a>
        </>
      ),
    },
  ];

  return (
    <Row gutter={8} style={{ marginTop: 36, minHeight: 500 }}>
      <Col span={24}>
        <Tabs
          activeKey={activeKey}
          onChange={(key) => {
            dispatch({
              type: 'testcase/save',
              payload: { activeKey: key },
            })
            setSuffix(key === '6')
            if (key === '1' && envList.length > 0) {
              dispatch({
                type: 'testcase/save',
                payload: {
                  envActiveKey: envList[0].id.toString(),
                },
              });
            }
          }} tabBarExtraContent={createMode ? null: <Button style={{marginRight: 8}} onClick={()=>{
            onSubmit(false)
        }}><SaveOutlined/>保存</Button>}>
          <TabPane key="5" tab={<span><IconFont type="icon-shujuqudong1" />数据管理
                <TooltipIcon
                  onClick={() => {
                    window.open(
                      `${CONFIG.DOCUMENT_URL}/%E4%BD%BF%E7%94%A8%E6%96%87%E6%A1%A3/%E6%A6%82%E5%BF%B5/%E6%95%B0%E6%8D%AE%E7%AE%A1%E7%90%86`,
                    );
                  }}
                  icon={<QuestionCircleOutlined />}
                  title="在这里你可以对多套环境的测试数据进行管理，从而达到数据驱动的目的~"
                />
              </span>
            }
          >
            {envList.length > 0 ? (
              <Tabs
                tabPosition="left"
                activeKey={envActiveKey}
                onChange={(key) => {
                  dispatch({
                    type: 'testcase/save',
                    payload: { envActiveKey: key },
                  });
                }}
              >
                {envList.map((item) => (
                  <TabPane key={item.id} tab={item.name}>
                    <TestcaseData caseId={case_id} currentEnv={envActiveKey} createMode={createMode} />
                  </TabPane>
                ))}
              </Tabs>
            ) : (
              <NoRecord2
                height={280}
                desc={
                  <span>
                    没有任何环境信息,{' '}
                    {
                      <a href="/#/config/environment" target="_blank">
                        去添加
                      </a>
                    }
                  </span>
                }
              />
            )}
          </TabPane>
          <TabPane
            key="2"
            tab={
              <div>
                <IconFont type="icon-DependencyGraph_16x" />
                前置条件
                <BadgeButton number={preConstructor.length} bgColor="rgb(237,242,251)" color="rgb(29,98,203)"/>
              </div>
            }
          >
            {preConstructor.length === 0 ? (
              <NoRecord
                height={180}
                desc={
                  <div>
                    还没有前置条件, 这不 <a onClick={onCreateConstructor}>添加一个</a>?
                  </div>
                }
              />
            ) : (
              <Row gutter={12}>
                <Col span={16}>
                  <Row>
                    <Col span={24}>
                      <Button
                        type="dashed"
                        block
                        style={{
                          marginBottom: 16,
                        }}
                        onClick={onCreateConstructor}
                      >
                        <PlusOutlined />
                        添加
                      </Button>
                    </Col>
                  </Row>
                  <SortedTable
                    columns={columns}
                    dataSource={preConstructor}
                    setDataSource={(data) => {
                      dispatch({
                        type: 'testcase/save',
                        payload: { preConstructor: data },
                      });
                    }}
                    loading={
                      loading.effects['construct/delete'] || loading.effects['construct/update']
                    }
                    dragCallback={async (newData) => {
                      if(createMode) {
                        return true;
                      }
                      return await dispatch({
                        type: 'construct/orderConstructor',
                        payload: newData.map((v, index) => ({ id: v.id, index })),
                      });
                    }}
                  />
                </Col>
                <Col span={8}>
                  <Card style={{ height: 400, overflow: 'auto' }} hoverable bordered={false}>
                    {
                      preConstructor.filter(item => item.enable).length === 0 ? <NoRecord2 desc="暂无开启的前置条件"/> : <Timeline>
                        {
                          preConstructor.map((item, index) =>
                          item.enable ?
                            <Timeline.Item key={index}>
                              <div key={index}>
                                <Badge
                                  count={index + 1}
                                  key={index}
                                  style={{ backgroundColor: '#a6d3ff' }}
                                />{' '}
                                名称:{' '}
                                {item.type === 0 ? <a key={item.name}>{item.name}</a> : item.name}
                              </div>
                              {getDesc(item)}
                            </Timeline.Item> : null )
                        }
                      </Timeline>
                    }
                  </Card>
                </Col>
              </Row>
            )}
          </TabPane>
          <TabPane
            key="3"
            tab={
              <span>
                <IconFont type="icon-qingqiu" />
                接口请求
              </span>
            }
          >
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <PostmanForm
                  form={form}
                  body={body}
                  setBody={setBody}
                  headers={headers}
                  formData={formData}
                  setFormData={setFormData}
                  caseInfo={caseInfo}
                  setHeaders={setHeaders}
                  bodyType={bodyType}
                  setBodyType={setBodyType}
                  bordered={false}
                  save={onSubmit}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane key="4" tab={<span><IconFont type="icon-canshu2"/>出参提取
            <TooltipIcon icon={<QuestionCircleOutlined/>} title="通过管理请求产生的参数，帮助我们更好地改善【断言】"/></span>}>
            <TestCaseOutParameters caseId={case_id} createMode={createMode} dispatch={dispatch} testcase={testcase}/>
          </TabPane>
          <TabPane key="5" tab={<div><IconFont type="icon-duanyan" />
                断言
              <BadgeButton number={asserts.length} bgColor="rgb(233, 249, 245)"
                           color="rgb(40, 195, 151)"/>
              </div>
            }
          >
            <TestCaseAssert asserts={asserts} caseId={case_id} createMode={createMode} />
          </TabPane>
          <TabPane
            key="6"
            tab={
              <div>
                <IconFont type="icon-qingliwuliuliang" />
                后置条件
                <BadgeButton number={postConstructor.length} bgColor="rgb(255, 238, 239)"
                             color="rgb(255, 87, 95)"/>
              </div>
            }
          >
            {postConstructor.length === 0 ? (
              <NoRecord
                height={180}
                desc={
                  <div>
                    还没有后置条件, 这不 <a onClick={onCreateConstructor}>添加一个</a>?
                  </div>
                }
              />
            ) : (
              <Row gutter={12}>
                <Col span={16}>
                  <Row>
                    <Col span={24}>
                      <Button
                        type="dashed"
                        block
                        style={{
                          marginBottom: 16,
                        }}
                        onClick={onCreateConstructor}
                      >
                        <PlusOutlined />
                        添加
                      </Button>
                    </Col>
                  </Row>
                  <SortedTable
                    columns={columns}
                    dataSource={postConstructor}
                    setDataSource={(data) => {
                      dispatch({
                        type: 'testcase/save',
                        payload: { postConstructor: data },
                      });
                    }}
                    loading={
                      loading.effects['construct/delete'] || loading.effects['construct/update']
                    }
                    dragCallback={async (newData) => {
                      if (createMode) {
                        return true;
                      }
                      return await dispatch({
                        type: 'construct/orderConstructor',
                        payload: newData.map((v, index) => ({ id: v.id, index })),
                      });
                    }}
                  />
                </Col>
                <Col span={8}>
                  <Card style={{ height: 400, overflow: 'auto' }} hoverable bordered={false}>
                    {
                      postConstructor.filter(item => item.enable).length === 0 ? <NoRecord desc="暂无开启的后置条件"/> :
                        <Timeline>
                          {postConstructor.map((item, index) =>
                            item.enable ? (
                              <Timeline.Item key={index}>
                                <div key={index}>
                                  <Badge
                                    count={index + 1}
                                    key={index}
                                    style={{ backgroundColor: '#a6d3ff' }}
                                  />{' '}
                                  名称:{' '}
                                  {item.type === 0 ? <a key={item.name}>{item.name}</a> : item.name}
                                </div>
                                {getDesc(item)}
                              </Timeline.Item>
                            ) : null,
                          )}
                        </Timeline>
                    }
                  </Card>
                </Col>
              </Row>
            )}
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default connect(({testcase, gconfig, loading}) => ({testcase, gconfig, loading}))(TestCaseBottom);
