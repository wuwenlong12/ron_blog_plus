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
import { downloadMarkdown } from "../../utils/downloadMarkdown";
import TreeDoc from "./TreeDoc/TreeDoc";
import { upload } from "../../api/upload";
import { md5, Message } from "js-md5";
import { uploadFileInChunks } from "../../utils/uploadFileInChunks";

async function uploadFile(file: File) {
  const res = await uploadFileInChunks(file);
  console.log(res);

  return res as string;
}

interface HeadingNode {
  tag: string; // h1, h2, h3
  text: string; // 标题内容
  id: string; // 对应的 ID
  children: HeadingNode[]; // 子节点
}

interface EditorProps {
  initialContent?: PartialBlock[] | undefined;
  editable: boolean;
  isSummary?: boolean;
  onChange?: (document: unknown) => void;
}

export interface EditorRef {
  blocksToMarkdown: (name: string) => Promise<void>;
}

const Editor = forwardRef<EditorRef, EditorProps>(
  (
    {
      initialContent = [
        {
          id: "b7e79971-43cb-42d7-886c-5598f5c911fa",
          type: "paragraph",
          props: {
            textColor: "default",
            backgroundColor: "default",
            textAlignment: "left",
          },
          content: [
            {
              type: "text",
              text: "快开始分享你的知识吧～",
              styles: {
                italic: true,
                underline: true,
              },
            },
          ],
          children: [],
        },
      ],
      editable = false,
      onChange,
      isSummary = false,
    },
    ref
  ) => {
    const { isDarkMode } = useTheme(); // 获取当前主题状态
    const [markdownFromBlocks, setMarkdownFromBlocks] = useState<
      string | undefined
    >(undefined);
    const [html, setHTML] = useState<string>("");
    const editor = useCreateBlockNote({
      dictionary: locales.zh,
      initialContent,
      uploadFile,
    });

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
        {isSummary ? null : (
          <div className={styles.contentInPage}>
            <TreeDoc html={html}></TreeDoc>
          </div>
        )}

        {editable && onChange ? (
          <BlockNoteView
            style={{ fontSize: "1rem" }}
            editor={editor}
            editable={true}
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
