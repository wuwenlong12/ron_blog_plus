import { Input, Typography, Form, Button, Space, message } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './EditFolderInfo.module.scss';
import { getDirectoryInfoById, patchFolderInfo } from '../../api/actical/actical';
import { useSearchParams } from 'react-router-dom';

const EditFolderInfo = () => {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [searchParams] = useSearchParams();
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(()=>{
        init()
    },[searchParams])
    const init = async () => {
        const id = searchParams.get('id');
        if (!id) return;
        try {
            const res = await getDirectoryInfoById(id);
            console.log(res); // 调试 API 响应
            if (res.data) {
                setName(res.data.name);
                setDesc(res.data.desc);
            }
        } catch (error) {
            console.error("请求失败:", error);
        }
    };
    // 为文件名的 onChange 事件处理函数
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("我执行了");
        
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
                    defaultValue={name}
                    key={name}
                        showCount
                        maxLength={20}
                        value={name}
                        onChange={handleNameChange}
                        placeholder="请输入文件名"
                    />
                </Form.Item>

                <Form.Item label="描述" name="desc" rules={[{ required: true, message: '请输入描述!' }]}>
                    <Input.TextArea
                       defaultValue={desc}
                      key={desc}
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
