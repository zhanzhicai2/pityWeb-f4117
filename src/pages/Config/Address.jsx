import { memo, useEffect, useState } from 'react';
import {connect} from "@umijs/max";
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Col, Divider, Form, Input, message, Row, Select, Table, Tag } from 'antd';
import CONFIG from "@/consts/config";
import TooltipTextIcon from '@/components/Icon/TooltipTextIcon';
import FormForModal from '@/components/PityForm/FormForModal';
import { PlusOutlined } from '@ant-design/icons';
import PityPopConfirm from '@/components/Confirm/PityPopConfirm';

const {Option} = Select;


const Address = ({loading, gconfig, dispatch}) => {
  const [form] = Form.useForm();
  const {envList, envMap, addressList} = gconfig;
  const [modal, setModal] = useState(false);
  const [item, setItem] = useState({});

  const fetchEnvList =()=>{
    dispatch({
      type:'gconfig/fetchEnvList',
      payload: {
        page: 1,
        size: 1000,
        exactly: true
      }
    })
  }

  const fetchAddress = () =>{
    const values = form.getFieldsValue()
    dispatch({
      type: 'gconfig/fetchAddress',
      payload: values,
    })
  }

  const isLoading = loading.effects['gconfig/fetchAddress'] || loading.effects['gconfig/fetchEnvList']

  useEffect(() => {
    fetchEnvList()
    fetchAddress()
  }, []);

  const columns = [
    {
      title: '环境',
      key: 'env',
      dataIndex: 'env',
      render: env => <Tag>{envMap[env]}</Tag>,
    },
    {
      title: '地址名称',
      key: 'env',
      dataIndex: 'env',
      render: env => envMap[env],
    },
    {
      title: <TooltipTextIcon title="地址一般是服务的基础地址，比如https://api.baidu.com, 用例中的地址简写即可" text="地址"/>,
      key: 'host',
      dataIndex: 'host',
      render: text => <a href={text}>{text}</a>,
      ellipsis: true
    },
    {
      title: '操作',
      key: 'operation',
      render: (_, record) =>
        <>
          <a  onClick={() => {
            setItem(record)
            setModal(true) }}>编辑</a>
          <Divider type="vertical"/>
          <PityPopConfirm text="删除" title="你确定要删除这个地址吗?" onConfirm={async () => {
            await onDelete(record)
          }}/>
        </>
    }
  ];

  // ... existing code ...

const onDelete = async (record) => {
  try {
    await dispatch({
      type: 'gconfig/deleteAddress',
      payload: { id: record.id }
    });
    message.success('删除成功');
    // 刷新地址列表
    dispatch({
      type: 'gconfig/fetchAddress'
    });
  } catch (error) {
    message.error('删除失败');
    console.error(error);
  }
};

// ... rest of code ...

  const fields = [
    {
      name: 'env',
      label: '环境',
      required: true,
      message: '请选择对应环境',
      type: 'select',
      component: <Select placeholder="请选择对应环境">
        {envList.map(v => <Option key={v.id} value={v.id}>{v.name}</Option>)}
      </Select>,
    },
    {
      name: 'name',
      label: '地址名称',
      required: true,
      message: '请输入地址名称',
      type: 'input',
      placeholder: '请输入地址名称',
    },
    {
      name: 'gateway',
      label: '服务地址',
      required: true,
      message: '请输入服务地址',
      type: 'input',
      placeholder: '请输入服务地址',
    }
  ];
  // 新增/修改地
  const onSubmit= async (values)=>{
    let ans;
    if (item.id) {
      ans = await dispatch({
        type: 'gconfig/updateAddress',
        payload: {
          ...values,
          id: item.id,
        }
      })
    } else {
      ans = await dispatch({
        type: 'gconfig/insertAddress',
        payload: values
      })
    }
    if (ans) {
      setModal(false)
      fetchAddress()
    }
  }
  return (
    <PageContainer title="请求质地管理" breadcrumb={null}>
      <Card>
        <FormForModal open={modal} fields={fields} title={item.id ? "修改地址":"添加地址"}left={6} right={18} record={item}
                      onFinish={onSubmit} onCancel={() => setModal(false)}/>
        <Form form={form} {...CONFIG.LAYOUT} onVolumeChange={fetchAddress}>
          <Row gutter={12}>
            <Col span={3}>
              <Form.Item>
                <Button type="primary" onClick={() =>{ setModal(true)
                  setItem({})}}><PlusOutlined/>添加地址</Button>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="环境" name="env">
                <Select allowClear showSearch placeholder="选择对应的环境">
                  {
                    envList.map(item => <Option value={item.id} key={item.id}>{item.name}</Option>)
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="名称" name="name">
                <Input placeholder="输入对应的地址名称"/>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="地址" name="url">
                <Input placeholder="输入对应的url"/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table columns={columns} loading={isLoading} rowKey={record => record.id} dataSource={addressList}/>
      </Card>
    </PageContainer>
  )
}
export default connect(({gconfig, user, loading}) => ({gconfig, user, loading}))(memo(Address));