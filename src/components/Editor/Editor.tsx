import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
} from "react";
import styles from "./Editor.module.scss";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import useTheme from "../../hook/useTheme";
import { PartialBlock, locales } from "@blocknote/core";
import { debounce } from "../../utils/debounce";
import { Affix, Button, Card, Collapse, Tooltip } from "antd";
import { downloadMarkdown } from "../../utils/downloadMarkdown";
import { FaBeer, FaMarkdown } from "react-icons/fa"; // 导入 FontAwesome 中的 FaBeer 图标
import { AiOutlineOrderedList } from "react-icons/ai";
import Toc from "react-toc";
import TreeDoc from "./TreeDoc/TreeDoc";

interface HeadingNode {
  tag: string; // h1, h2, h3
  text: string; // 标题内容
  id: string; // 对应的 ID
  children: HeadingNode[]; // 子节点
}

interface EditorProps {
  initialContent: PartialBlock[] | undefined;
  editable: boolean;
  onChange: (document: unknown) => void;
}

export interface EditorRef {
  blocksToMarkdown: (name: string) => Promise<void>;
}

const Editor = forwardRef<EditorRef, EditorProps>(
  ({ initialContent, editable = false, onChange }, ref) => {
    const { isDarkMode } = useTheme(); // 获取当前主题状态
    const [markdownFromBlocks, setMarkdownFromBlocks] = useState<
      string | undefined
    >(undefined);
    const [html, setHTML] = useState<string>("");
    const editor = useCreateBlockNote({
      dictionary: locales.zh,
      initialContent,
    });

    function extractHeadingsToTree(html: string): HeadingNode[] {
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
          tree.push(node); // 栈为空，添加到根节点
        } else {
          stack[stack.length - 1].children.push(node); // 添加为父节点的子节点
        }

        stack.push(node); // 将当前节点加入栈中
      });

      return tree;
    }

    function addIdsToHeadings(html: string): string {
      // 正则匹配h1, h2, h3，并提取其文本内容
      return html.replace(
        /<(h[1-3])[^>]*>(.*?)<\/\1>/g,
        (match: string, tag: string, content: string): string => {
          // 去除 HTML 标签，保留纯文本
          const textContent: string = content.replace(/<[^>]*>/g, "").trim();
          // 生成 ID：将文本内容去除空格并转换为小写
          const id: string = textContent.replace(/\s+/g, "-").toLowerCase();
          // 返回带有 ID 的标签
          return `<${tag} id="${id}">${content}</${tag}>`;
        }
      );
    }
    useEffect(() => {
      init();
    }, []);

    const init = async () => {
      const html = await editor.blocksToHTMLLossy(editor.document);
      setHTML(html);

      const markdownFromBlocks = await editor.blocksToMarkdownLossy(
        editor.document
      );

      setMarkdownFromBlocks(markdownFromBlocks);
    };

    const blocksToMarkdown = async (name: string) => {
      if (!markdownFromBlocks) return;
      downloadMarkdown(markdownFromBlocks, name);
    };

    // 使用 useImperativeHandle 来暴露 blocksToMarkdown 方法
    useImperativeHandle(ref, () => ({
      blocksToMarkdown,
    }));

    return (
      <div className={styles.container}>
        <div className={styles.contentInPage}>
          <TreeDoc html={html}></TreeDoc>
        </div>

        {editable ? (
          <BlockNoteView
            style={{ fontSize: "1rem" }}
            editor={editor}
            editable={editable}
            onChange={debounce(() => onChange(editor.document), 3000)}
            theme={isDarkMode ? "dark" : "light"}
            formattingToolbar
            linkToolbar
            sideMenu
            slashMenu
            emojiPicker
            filePanel
            tableHandles
          />
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: addIdsToHeadings(html) }}
            className={styles.htmlContent}
          />
        )}
      </div>
    );
  }
);

export default Editor;
