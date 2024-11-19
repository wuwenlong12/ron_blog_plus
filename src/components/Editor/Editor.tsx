// Editor.tsx
import React, { useState } from 'react';
import styles from './Editor.module.scss';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import useTheme from '../../hook/useTheme';
import { locales } from '@blocknote/core';


const Editor: React.FC = () => {
    const editor = useCreateBlockNote({
        dictionary: locales.zh,
    });
    const [editable,setEditable] = useState(true)
    const { isDarkMode, handleToggleTheme } = useTheme();
    const onChange = ()=>{

    }
    return (
        
        <div className={styles.container}>
           <BlockNoteView 
           style={{fontSize:'150px'}}
           editor={editor} 
           editable={editable} 
           onChange={onChange} 
           theme={isDarkMode?'dark':'light'}
           formattingToolbar={true}
           linkToolbar={true}
           sideMenu={true}
           slashMenu={true}
           emojiPicker={true}
           filePanel={true}
           tableHandles={true}
           />
        </div>
    );
};

export default Editor;
