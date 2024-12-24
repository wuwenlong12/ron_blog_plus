import React, { useEffect, useState } from "react";
import styles from "./Editor.module.scss";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import useTheme from "../../hook/useTheme";
import { PartialBlock, locales } from "@blocknote/core";
import { debounce } from "../../utils/debounce";

interface EditorProps {
  initialContent: PartialBlock[] | undefined;
  editable: boolean;
  onChange: (document: unknown) => void;
}

const Editor: React.FC<EditorProps> = ({
  initialContent,
  editable = false,
  onChange,
}) => {
  const { isDarkMode } = useTheme(); // 获取当前主题状态

  const editor = useCreateBlockNote({
    dictionary: locales.zh,
    initialContent,
  });

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
};

export default Editor;
