import React, { useState } from "react";
import { Tree } from "antd";

const { TreeNode } = Tree;

interface TreeNodeData {
  title: string;
  key: string;
  type: "folder" | "article"; // 节点类型
  children?: TreeNodeData[];
}

interface FindNodeResult {
  parent: TreeNodeData[];
  node: TreeNodeData;
  index: number;
}

const initialData: TreeNodeData[] = [
  {
    title: "Parent 1",
    key: "0-0",
    type: "folder",
    children: [
      { title: "Child 1", key: "0-0-0", type: "article" },
      { title: "Child 2", key: "0-0-1", type: "article" },
    ],
  },
  {
    title: "Parent 2",
    key: "0-1",
    type: "folder",
    children: [],
  },
];

const App = () => {
  const [treeData, setTreeData] = useState<TreeNodeData[]>(initialData);

  const onDragEnter = (info: any) => {
    console.log("onDragEnter:", info);
  };

  const onDrop = async (info: any) => {
    const { dragNode, node, dropPosition } = info;
    console.log(
      "dragNode:",
      dragNode,
      "node:",
      node,
      "dropPosition:",
      dropPosition
    );

    const updatedData = [...treeData];

    const findNode = (
      data: TreeNodeData[],
      key: string
    ): FindNodeResult | null => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key)
          return { parent: data, node: data[i], index: i };
        if (data[i].children) {
          const result = findNode(data[i].children as TreeNodeData[], key);
          if (result) return result;
        }
      }
      return null;
    };

    const moveNode = (dragKey: string, targetKey: string) => {
      const dragNode = findNode(updatedData, dragKey);
      const targetNode = findNode(updatedData, targetKey);

      if (dragNode && targetNode) {
        dragNode.parent.splice(dragNode.index, 1); // 从原位置移除拖拽节点
        if (!targetNode.node.children) {
          targetNode.node.children = [];
        }
        targetNode.node.children.push(dragNode.node); // 添加到目标节点的 children 中
      }
    };

    moveNode(dragNode.key, node.key);
    setTreeData(updatedData);

    // 提取后端需要的数据
    const requestData = {
      itemId: dragNode.key,
      type: dragNode.type,
      newOrder: dropPosition,
      parentFolderId: node.key === dragNode.key ? null : node.key,
    };

    // try {
    //   const response = await fetch(
    //     "https://example.com/api/update-item-order",
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(requestData),
    //     }
    //   );

    //   if (response.ok) {
    //     console.log("排序更新成功");
    //   } else {
    //     console.error("排序更新失败", await response.json());
    //   }
    // } catch (error) {
    //   console.error("网络请求失败", error);
    // }
    console.log(requestData);
  };

  const renderTreeNodes = (data: TreeNodeData[]) =>
    data.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode title={item.title} key={item.key}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.title} key={item.key} />;
    });

  return (
    <Tree
      style={{ padding: 300 }}
      draggable
      onDragEnter={onDragEnter}
      onDrop={onDrop}
      defaultExpandedKeys={["0-0", "0-1"]}
    >
      {renderTreeNodes(treeData)}
    </Tree>
  );
};

export default App;
