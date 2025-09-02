import {Col, Dropdown, Input, Row, Tree} from 'antd';
import React, {useState} from "react";
import './SearchTree.less';
import {
  FolderTwoTone,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined
} from "@ant-design/icons";
import {FolderCode} from "@icon-park/react";
// ... existing imports ...
import { getParentKey } from '@/utils/treeUtils'; // 根据子节点key查找父节点key

// 删除原有的getParentKey函数实现
// 直接使用导入的getParentKey

const dataList = []; // 存储扁平化的树节点数据

// 树搜索组件
export default ({treeData: gData, blockNode = true, onAddNode, menu, selectedKeys, onSelect,addDirectory}) => {
  // 递归生成扁平化节点列表
  const generateList = data => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const {key, title} = node;
      dataList.push({key, title});
      if (node.children) {
        generateList(node.children);
      }
    }
  };


  generateList(gData); // 初始化扁平化数据

  // 状态管理
  const [expandedKeys, setExpandedKeys] = useState([]); // 当前展开的节点keys
  const [searchValue, setSearchValue] = useState('');   // 搜索关键词
  const [autoExpandParent, setAutoExpandParent] = useState(true); // 是否自动展开父节点
  const [nodeKey, setNodeKey] = useState(null); // 当前hover的节点key

  // 处理节点展开/收起
  const onExpand = expandedKeys => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false); // 关闭自动展开
  };

  // 搜索框变化处理
  const onChange = e => {
    const {value} = e.target;
    // 查找匹配节点的父节点key
    const expandedKeys = dataList.map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, gData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true); // 搜索时自动展开
  };

  // 递归处理树数据，高亮搜索匹配项
  const loop = data =>
    data.map(item => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index); // 匹配前的文本
      const afterStr = item.title.substr(index + searchValue.length); // 匹配后的文本
      const title =
        index > -1 ? (
          <span>
              {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
            </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children) {
        return {title, key: item.key, children: loop(item.children)};
      }

      return {
        title,
        key: item.key,
      };
    });

  // 渲染组件
  return (
    <div>
      <Row gutter={8}>
        <Col span={18}>
          <Input
            size="small"
            className="treeSearch"
            placeholder="输入要查找的目录"
            onChange={onChange}
            prefix={<SearchOutlined/>}
          />
        </Col>
        <Col span={6}>
          {addDirectory}
        </Col>
      </Row>
      <Tree
        onExpand={onExpand}
        defaultExpandAll
        blockNode={blockNode}
        selectedKeys={selectedKeys}
        onSelect={onSelect}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={loop(gData)}
        titleRender={(node) => {
          return (
            <div onMouseOver={() => setNodeKey(node.key)} onMouseLeave={() => setNodeKey(null)}>
              {/*<FolderTwoTone className="folder" twoToneColor="rgb(255, 173, 210)"/>*/}
              <FolderCode theme="outline" size="15" className="folder"/>
              {node.title}
              {
                nodeKey === node.key ?
                  <span className="suffixButton">
                    <PlusOutlined
                      onClick={(event) =>{
                        event.stopPropagation();
                        onAddNode(node)}}
                      className="left"
                    />
                    <Dropdown overlay={menu(node)} trigger="click">
                      <MoreOutlined
                        className="right"
                        onClick={e => e.stopPropagation()}
                      />
                    </Dropdown>
                  </span>:null
              }
            </div>
          )
        }}
      />
    </div>
  );
}
