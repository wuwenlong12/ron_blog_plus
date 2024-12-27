import React, { useImperativeHandle, forwardRef } from "react";
import styles from "./Editor.module.scss";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import useTheme from "../../hook/useTheme";
import { PartialBlock, locales } from "@blocknote/core";
import { debounce } from "../../utils/debounce";
import { Button, Tooltip } from "antd";
import { downloadMarkdown } from "../../utils/downloadMarkdown";
import { FaBeer, FaMarkdown } from "react-icons/fa"; // 导入 FontAwesome 中的 FaBeer 图标

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

    const editor = useCreateBlockNote({
      dictionary: locales.zh,
      initialContent,
    });

    const blocksToMarkdown = async (name: string) => {
      const markdownFromBlocks = await editor.blocksToMarkdownLossy(
        editor.document
      );
      downloadMarkdown(markdownFromBlocks, name);
    };

    // 使用 useImperativeHandle 来暴露 blocksToMarkdown 方法
    useImperativeHandle(ref, () => ({
      blocksToMarkdown,
    }));

    return (
      <div className={styles.container}>
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
      </div>
    );
  }
);

export default Editor;
