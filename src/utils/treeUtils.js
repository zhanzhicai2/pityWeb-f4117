/**
 * 根据子节点key查找父节点key
 * @param {string} key - 子节点key
 * @param {Array} tree - 树数据
 * @returns {string|null} 父节点key
 */
export const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};