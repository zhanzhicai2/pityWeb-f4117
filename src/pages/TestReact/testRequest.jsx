// import React from "react";


//  实例一
// export default () =>{
//   return (
//     <TestPostman />
//   );
// }

// 实例二
// import { useState } from 'react';
//
// export default function Accordion() {
//   const [activeIndex, setActiveIndex] = useState(0);
//   return (
//       <>
//         <h2>哈萨克斯坦，阿拉木图</h2>
//         <Panel
//             title="关于"
//             isActive={activeIndex === 0}
//             onShow={() => setActiveIndex(0)}
//         >
//           阿拉木图人口约200万，是哈萨克斯坦最大的城市。它在 1929 年到 1997 年间都是首都。
//         </Panel>
//         <Panel
//             title="词源"
//             isActive={activeIndex === 1}
//             onShow={() => setActiveIndex(1)}
//         >
//           这个名字来自于 <span lang="kk-KZ">алма</span>，哈萨克语中“苹果”的意思，经常被翻译成“苹果之乡”。事实上，阿拉木图的周边地区被认为是苹果的发源地，<i lang="la">Malus sieversii</i> 被认为是现今苹果的祖先。
//         </Panel>
//       </>
//   );
// }

// function Panel({
//                  title,
//                  children,
//                  isActive,
//                  onShow
//                }) {
//   return (
//       <section className="panel">
//         <h3>{title}</h3>
//         {isActive ? (
//             <p>{children}</p>
//         ) : (
//             <button onClick={onShow}>
//               显示
//             </button>
//         )}
//       </section>
//   );
// }
//
//
// // 实例三
//
// function ProductCategoryRow({ category }) {
//     return (
//         <tr>
//             <th colSpan="2">
//                 {category}
//             </th>
//         </tr>
//     );
// }
//
// function ProductRow({ product }) {
//     const name = product.stocked ? product.name :
//         <span style={{ color: 'red' }}>
//       {product.name}
//     </span>;
//
//     return (
//         <tr>
//             <td>{name}</td>
//             <td>{product.price}</td>
//         </tr>
//     );
// }
//
// function ProductTable({ products }) {
//     const rows = [];
//     let lastCategory = null;
//
//     products.forEach((product) => {
//         if (product.category !== lastCategory) {
//             rows.push(
//                 <ProductCategoryRow
//                     category={product.category}
//                     key={product.category} />
//             );
//         }
//         rows.push(
//             <ProductRow
//                 product={product}
//                 key={product.name} />
//         );
//         lastCategory = product.category;
//     });
//
//     return (
//         <table>
//             <thead>
//             <tr>
//                 <th>Name</th>
//                 <th>Price</th>
//             </tr>
//             </thead>
//             <tbody>{rows}</tbody>
//         </table>
//     );
// }
//
// function SearchBar() {
//     return (
//         <form>
//             <input type="text" placeholder="Search..." />
//             <label>
//                 <input type="checkbox" />
//                 {' '}
//                 Only show products in stock
//             </label>
//         </form>
//     );
// }
//
// function FilterableProductTable({ products }) {
//     return (
//         <div>
//             <SearchBar />
//             <ProductTable products={products} />
//         </div>
//     );
// }
//
// const PRODUCTS = [
//     {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
//     {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
//     {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
//     {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
//     {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
//     {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
// ];
//
// export default function App() {
//     return(
//
//         <><FilterableProductTable products={PRODUCTS} />
//
//             <CustomEventExample/></>
//     )
// }
//
//
//
// function CustomEventExample() {
//     const handleClick = () => {
//         // 创建一个自定义事件
//         const event = new CustomEvent('myCustomEvent', {
//             detail: { message: 'Hello from custom event!' }
//         });
//
//         // 触发这个事件
//         window.dispatchEvent(event);
//
//         // 监听这个自定义事件
//         window.addEventListener('myCustomEvent', function (e) {
//             console.log(e.detail.message);
//         }, { once: true }); // 使用 {once: true} 确保只监听一次
//     };
//
//     return (
//         <button onClick={handleClick}>
//             Trigger Custom Event
//         </button>
//     );
// }

// 实例四


// function TreeNode({node, children}) {
//   console.log('Rendering node:', node);
//   return (
//     <li>
//       <span>{node.name}</span>
//       {node.children && node.children.length > 0 && (
//         <ul>
//           {node.children.map((child) => (
//             <TreeNode key={child.id} node={child}/>
//           ))}
//         </ul>
//       )}
//     </li>
//   );
// }
//
// const treeData = [
//   {
//     id: 1,
//     name: 'Root',
//     children: [
//       {id: 2, name: 'Child 1'},
//       {id: 3, name: 'Child 2', children: [{id: 4, name: 'Grandchild'}]}
//     ]
//   }
// ];
// const treeData2 = {
//   name: "根节点",
//   children: [
//     {
//       name: "子节点1",
//       children: [
//         {name: "孙节点1-1", children: []},
//         {name: "孙节点1-2", children: []},
//       ],
//     },
//     {
//       name: "子节点2",
//       children: [{name: "孙节点2-1", children: []}],
//     },
//   ],
// };
//
// function TreeNode2({node}) {
//   // 终止条件：无子节点时停止递归
//   if (!node.children || node.children.length === 0) {
//     return <li>{node.name}</li>;
//   }
//
//   // 递归渲染子节点
//   return (
//     <li>
//       {node.name}
//       <ul>
//         {node.children.map((child) => (
//           <TreeNode2
//             key={child.name}  // 必须提供唯一 key
//             node={child}
//           />
//         ))}
//       </ul>
//     </li>
//   );
// }
//
// // 使用组件
// function Tree() {
//   return (
//     <div>
//       <h2>递归树形组件</h2>
//       <ul>
//         <TreeNode2 node={treeData2}/>
//       </ul>
//     </div>
//   );
// }
//
// export default function App() {
//   return (
//     <ul>
//       {treeData.map(node => (
//         <TreeNode key={node.id} node={node}/>
//       ))}
//       <Tree/>
//     </ul>
//
//   );
// }

// 实例六
//
// import React, { Component } from 'react';
//
// class MyComponent extends Component {
//     constructor(props) {
//         super(props);
//         this.state = { count: 0 };
//     }
//
//     static getDerivedStateFromProps(props, state) {
//         // 根据 props 更新 state 的示例
//         // 此处为示例，实际使用中应根据具体需求来判断是否需要更新 state
//         return null; // 不需要更新 state 时返回 null
//     }
//
//     componentDidMount() {
//         // 组件挂载后执行副作用的示例
//         console.log('Component mounted');
//     }
//
//     shouldComponentUpdate(nextProps, nextState) {
//         // 判断组件是否需要更新的示例
//         // 此处为示例，实际使用中应根据具体需求来判断是否需要更新组件
//         return true; // 默认返回 true，表示组件需要更新
//     }
//
//     componentDidUpdate(prevProps, prevState) {
//         // 组件更新后执行的示例
//         console.log('Component updated');
//     }
//
//     componentWillUnmount() {
//         // 组件卸载前执行清理操作的示例
//         console.log('Component will unmount');
//     }
//
//     render() {
//         return (
//             <div>
//                 <p>Count: {this.state.count}</p>
//                 <button onClick={() => this.setState({ count: this.state.count + 1 })}>
//                     Increment
//                 </button>
//             </div>
//         );
//     }
// }
//
// export default MyComponent;


// 实例七：递归调用
// 示例案例八 学习动画、css

// src/App.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Radio, Select, Slider } from 'antd';
import './testRequest.css';

const { Meta } = Card;

const AnimatedCards = () => {
  // 状态管理
  const [animationType, setAnimationType] = useState('fadeIn');
  const [hoverEffect, setHoverEffect] = useState(true);
  const [borderStyle, setBorderStyle] = useState('solid');
  const [borderColor, setBorderColor] = useState('#1890ff');
  const [borderWidth, setBorderWidth] = useState(2);
  const [scaleFactor, setScaleFactor] = useState(1.05);
  const [cards, setCards] = useState([]);

  // 卡片数据
  const cardData = [
    {
      id: 1,
      title: '设计模式',
      description: '使用伪元素创建精美的视觉元素，无需额外HTML标签。',
      color: '#ff9a9e',
      icon: '🎨'
    },
    {
      id: 2,
      title: '动态交互',
      description: '通过JS切换类名，实时改变伪元素的样式和动画效果。',
      color: '#a1c4fd',
      icon: '💻'
    },
    {
      id: 3,
      title: '性能优化',
      description: '伪元素由浏览器高效渲染，结合CSS动画提供流畅体验。',
      color: '#d4fc79',
      icon: '🚀'
    }
  ];

  // 初始化卡片
  useEffect(() => {
    setCards(cardData);
  }, []);

  // 应用动画类名
  const getAnimationClass = () => {
    return `card-animation ${animationType}`;
  };

  // 应用边框样式
  const getBorderStyle = () => {
    return {
      '--border-style': borderStyle,
      '--border-color': borderColor,
      '--border-width': `${borderWidth}px`
    };
  };

  // 应用悬停效果
  const getHoverStyle = () => {
    return hoverEffect ? { '--scale-factor': scaleFactor } : {};
  };

  // 重置所有设置
  const resetSettings = () => {
    setAnimationType('fadeIn');
    setHoverEffect(true);
    setBorderStyle('solid');
    setBorderColor('#1890ff');
    setBorderWidth(2);
    setScaleFactor(1.05);
  };

  return (
    <div className="app-container">
      <h1 className="main-title">
        React + Ant Design 动画与伪元素交互案例
        <span className="subtitle">通过JavaScript控制CSS伪元素和动画效果</span>
      </h1>

      {/* 控制面板 */}
      <Card className="control-panel">
        <h2 className="panel-title">动画与伪元素控制面板</h2>

        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div className="control-group">
              <h3>动画效果</h3>
              <Radio.Group
                value={animationType}
                onChange={(e) => setAnimationType(e.target.value)}
              >
                <Radio.Button value="fadeIn">淡入</Radio.Button>
                <Radio.Button value="slideIn">滑入</Radio.Button>
                <Radio.Button value="zoom">缩放</Radio.Button>
                <Radio.Button value="rotate">旋转</Radio.Button>
              </Radio.Group>
            </div>
          </Col>

          <Col span={8}>
            <div className="control-group">
              <h3>悬停效果</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>启用:</span>
                <Radio.Group
                  value={hoverEffect}
                  onChange={(e) => setHoverEffect(e.target.value)}
                >
                  <Radio.Button value={true}>是</Radio.Button>
                  <Radio.Button value={false}>否</Radio.Button>
                </Radio.Group>

                {hoverEffect && (
                  <div style={{ flex: 1 }}>
                    <Slider
                      min={1}
                      max={1.5}
                      step={0.05}
                      value={scaleFactor}
                      onChange={setScaleFactor}
                      tipFormatter={value => `x${value}`}
                    />
                  </div>
                )}
              </div>
            </div>
          </Col>

          <Col span={8}>
            <div className="control-group">
              <h3>伪元素边框</h3>
              <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <Select
                  value={borderStyle}
                  onChange={setBorderStyle}
                  style={{ width: 100 }}
                >
                  <Select.Option value="solid">实线</Select.Option>
                  <Select.Option value="dashed">虚线</Select.Option>
                  <Select.Option value="dotted">点线</Select.Option>
                </Select>

                <Select
                  value={borderColor}
                  onChange={setBorderColor}
                  style={{ width: 120 }}
                >
                  <Select.Option value="#1890ff">蓝色</Select.Option>
                  <Select.Option value="#52c41a">绿色</Select.Option>
                  <Select.Option value="#faad14">黄色</Select.Option>
                  <Select.Option value="#ff4d4f">红色</Select.Option>
                </Select>

                <Slider
                  min={1}
                  max={10}
                  value={borderWidth}
                  onChange={setBorderWidth}
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button type="primary" onClick={resetSettings}>重置设置</Button>
        </div>
      </Card>

      {/* 卡片展示区域 */}
      <div className="cards-container">
        <Row gutter={[24, 24]} justify="center">
          {cards.map(card => (
            <Col key={card.id} xs={24} sm={12} md={8} lg={8}>
              <Card
                className={`animated-card ${getAnimationClass()}`}
                style={{
                  ...getBorderStyle(),
                  ...getHoverStyle(),
                  '--card-color': card.color
                }}
                cover={
                  <div
                    className="card-image"
                    style={{ backgroundColor: card.color }}
                  >
                    <div className="card-icon">{card.icon}</div>
                  </div>
                }
              >
                <Meta
                  title={card.title}
                  description={card.description}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 技术说明 */}
      <Card className="info-card">
        <h2>技术实现说明</h2>
        <p>
          此案例展示了如何通过 <strong>React状态管理</strong> 和 <strong>CSS变量</strong> 控制伪元素样式和动画效果。
        </p>
        <ul>
          <li>使用CSS伪元素(::before, ::after)创建装饰性元素</li>
          <li>通过React状态控制CSS变量实现动态样式</li>
          <li>使用Ant Design组件构建控制面板</li>
          <li>实现多种CSS动画效果(fadeIn, slideIn, zoom, rotate)</li>
          <li>动态调整悬停动画效果</li>
        </ul>
      </Card>
    </div>
  );
};

export default AnimatedCards;
