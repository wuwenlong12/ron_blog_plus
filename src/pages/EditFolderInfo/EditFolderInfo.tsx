import { Input, Typography, Form, Button, Space, message } from 'antd';
import React, { useState } from 'react';
import styles from './EditFolderInfo.module.scss';
import { patchFolderInfo } from '../../api/actical/actical';
import { useSearchParams } from 'react-router-dom';

const EditFolderInfo = () => {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [searchParams] = useSearchParams();
    const [messageApi, contextHolder] = message.useMessage();
    // 为文件名的 onChange 事件处理函数
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    // 为描述的 onChange 事件处理函数
    const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDesc(e.target.value);
    };

    const handleSubmit = async() => {
        // 提交处理逻辑
        const id = searchParams.get('id')
        if (!id) return
        console.log("文件名:", name);
        console.log("描述:", desc);
        const res = await patchFolderInfo(id, name, desc)
        
        
        if (res.code === 0) {
            console.log("fuck");
            messageApi.open({
                type: 'success',
                content: '修改成功',
              });
        }
    };

    return (
        <div className={styles.container}>
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="文件名" name="name" rules={[{ required: true, message: '请输入文件名!' }]}>
                    <Input
                        showCount
                        maxLength={20}
                        value={name}
                        onChange={handleNameChange}
                        placeholder="请输入文件名"
                    />
                </Form.Item>

                <Form.Item label="描述" name="desc" rules={[{ required: true, message: '请输入描述!' }]}>
                    <Input.TextArea
                        showCount
                        maxLength={100}
                        value={desc}
                        onChange={handleDescChange} // 确保使用对应的类型
                        placeholder="请输入描述"
                        rows={4}
                    />
                </Form.Item>

                <Space>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                </Space>
            </Form>
        </div>
    );
};

export default EditFolderInfo;
