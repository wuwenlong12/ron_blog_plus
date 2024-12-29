import React, { useState } from "react";
import "antd/dist/reset.css"; // 引入 antd 样式
import { Collapse } from "antd"; // 导入 antd 的 Collapse 组件

interface HeadingNode {
  tag: string; // h1, h2, h3
  text: string; // 标题内容
  id: string; // 对应的 ID
  children: HeadingNode[]; // 子节点
}

// 从 HTML 提取标题树
const extractHeadingsToTree = (html: string): HeadingNode[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const headings = Array.from(doc.querySelectorAll("h1, h2, h3"));

  const tree: HeadingNode[] = [];
  const stack: HeadingNode[] = [];

  headings.forEach((heading) => {
    const tag = heading.tagName.toLowerCase();
    const text = heading.textContent?.trim() || "";
    const id = heading.id || text.toLowerCase().replace(/\s+/g, "-");

    const node: HeadingNode = { tag, text, id, children: [] };

    while (
      stack.length > 0 &&
      parseInt(stack[stack.length - 1].tag[1]) >= parseInt(tag[1])
    ) {
      stack.pop();
    }

    if (stack.length === 0) {
      tree.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push(node);
  });

  return tree;
};

// 渲染目录项
const renderTree = (
  tree: HeadingNode[],
  level: number = 0
): React.ReactNode => {
  return (
    <>
      {tree.map((node) => (
        <div
          key={node.tag + node.id}
          style={{ marginLeft: level === 0 ? 0 : 10 }}
        >
          <a href={`#${node.id}`}>{node.text}</a>
          {node.children.length > 0 && renderTree(node.children, level + 1)}
        </div>
      ))}
    </>
  );
};

// 封装好的目录组件
const TableOfContents: React.FC<{ html: string }> = ({ html }) => {
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined); // 控制折叠面板的展开/折叠
  const headingsTree = extractHeadingsToTree(html);

  return (
    <div>
      <Collapse
        bordered={false}
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key as unknown as string)}
        accordion
        style={{ background: "#f7f7f7", borderRadius: 6, border: "none" }}
      >
        <Collapse.Panel header="此页内容" key="1">
          {renderTree(headingsTree)}
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default TableOfContents;
