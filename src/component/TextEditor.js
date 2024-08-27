import React, {useState, useEffect} from 'react';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from 'axios';

const TextEditor = () => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    useEffect(() => {
        const sendContent = async () => {
            const rawContentState = convertToRaw(editorState.getCurrentContent());
            const text = rawContentState.blocks.map(block => block.text).join('\n');
            try {
                await axios.post('http://localhost:8000/update', { text});
            } catch (error) {
                console.error('エラー:', error);
            }
        };

        const debounce = setTimeout(() => {
            sendContent();
        }, 500);

        return () => clearTimeout(debounce);
    }, [editorState]);

    return <div>
        <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={setEditorState}
        />
    </div>;
};

export default TextEditor;