import React, { useState } from 'react';
import { Button, Drawer, Form } from 'antd';
import CaseDetail from '@/components/Drawer/CaseDetail';


export default ({ title, width, left, right, formName, record, onFinish, loading, fields, open, onCancel }) => {
  const [form] = Form.useForm();
  const [headers, setHeaders] = useState([]);
  const [body, setBody] = useState('');

  const onOk = () => {
    form.validateFields().then((values) => {
      onFinish({ ...values, request_headers: translateHeaders(), body });
    });
  };

  const translateHeaders = () => {
    const hd = {};
    for (const header of headers) {
      hd[header.key] = header.value;
    }
    return JSON.stringify(hd, null, 2);
  };

  const layout = {
    labelCol: { span: left },
    wrapperCol: { span: right },
  };
  return (
    <Drawer
      destroyOnClose confirmLoading={loading}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={() => {
            onCancel();
            form.resetFields();
          }} style={{ marginRight: 8 }}>

            取消
          </Button>
          <Button onClick={onOk} type='primary'>
            提交
          </Button>
        </div>
      }
      title={title} width={width} open={open} onOk={onOk} onCancel={() => {
      onCancel();
      form.resetFields();
    }} onClose={() => {
      onCancel();
      form.resetFields();
    }}>
      <CaseDetail form={form} layout={layout} formName={formName} record={record}
                  onFinish={onFinish} fields={fields} body={body} setBody={setBody} headers={headers}
                  setHeaders={setHeaders} />
    </Drawer>
  );

}
