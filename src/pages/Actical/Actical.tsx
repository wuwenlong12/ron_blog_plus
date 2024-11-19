import React, { useEffect, useState } from 'react';
import styles from './Actical.module.scss';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import useTheme from '../../hook/useTheme';
import { getActicalDirectory } from '../../api/actical/actical';
import { Menu, MenuProps, Dropdown, Button, Input } from 'antd';
import {
    AppstoreOutlined,
    FolderOpenOutlined,
    ReadOutlined,
    EditOutlined,
    RightOutlined,
    LeftOutlined,
    FolderAddOutlined,
    FolderOutlined,
} from '@ant-design/icons';
import Editor from '../../components/Editor/Editor';
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import routes from '../../router';

type MenuItem = Required<MenuProps>['items'][number];

const Actical = () => {
    const { isDarkMode } = useTheme();
    const [directory, setDirectory] = useState<MenuItem[] | null>([]);
    const [isOpenMenu, setIsOpenMenu] = useState(true);
    const [isOpenAddFolder, setIsOpenAddFolder] = useState(false);
    const [folderName, setFolderName] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const res = await getActicalDirectory();
        const data = res.data; // 后端返回的数据格式
        const items = transformDataToMenuItems(data);
        setDirectory(items);
    };

    // 递归转换数据为 Antd Menu 的格式
    const transformDataToMenuItems = (data: any[]): MenuItem[] => {
        return data.map((item) => ({
            key: item._id,
            label: item.name,
            icon: item.type === 'folder' ? <Dropdown
                menu={{
                    items: [
                        {
                            key: 'read',
                            label: '编辑',
                            icon: <ReadOutlined />,
                            onClick: (e) => {
                                e.domEvent.stopPropagation(); // 阻止冒泡
                                handleEdit(item._id,item.type,e)
                            },
                        },
                    ],
                }}
                trigger={['click']}
            >
                <FolderOutlined />
            </Dropdown> : <Dropdown
                menu={{
                    items: [
                        {
                            key: 'read',
                            label: '编辑',
                            icon: <ReadOutlined />,
                            onClick: (e) => {
                                e.domEvent.stopPropagation(); // 阻止冒泡
                                handleEdit(item._id,item.type,e)
                            },
                        },
                    ],
                }}
                trigger={['click']}
            >
                <ReadOutlined />
            </Dropdown>,
            children: item.children ? transformDataToMenuItems(item.children) : undefined,
        }));
    };

 

    const handleEdit = (folder: string, type: string, e: any) => {
        if (e && e.domEvent) {
            e.domEvent.stopPropagation(); // 阻止事件冒泡
        }
    
        // 拼接导航参数
        const queryParams = new URLSearchParams({
            id: folder,
            type: type,
        });
    
        // 导航到指定页面
        navigate(`/artical/info?${queryParams.toString()}`);
    };
    const onClick: MenuProps['onClick'] = (e) => {
        console.log('Menu item clicked:', e.key);
    };

    const newFolder = () => {
        if (!folderName.trim()) return;
        setIsOpenAddFolder(false);
        setFolderName('');
        console.log('New folder name:', folderName);
        // 添加新文件夹逻辑可以在此处实现
    };

    return (
        <div className={styles.container}>
            <div className={isOpenMenu ? styles.menuContainerOpen : styles.menuContainerClose}>
                {isOpenMenu ? (
                    <Button
                        type="text"
                        className={styles.menuControlBtn}
                        onClick={() => setIsOpenMenu(!isOpenMenu)}
                        icon={<RightOutlined />}
                    />
                ) : (
                    <Button
                        type="text"
                        className={styles.menuControlBtn}
                        onClick={() => setIsOpenMenu(!isOpenMenu)}
                        icon={<LeftOutlined />}
                    />
                )}
                <Button
                    style={isDarkMode ? { color: '#fff' } : { color: '#000' }}
                    type="text"
                    className={styles.add}
                    onClick={() => setIsOpenAddFolder(!isOpenAddFolder)}
                    icon={<FolderAddOutlined />}
                />
                {isOpenAddFolder ? (
                    <Input
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        onBlur={newFolder}
                        onPressEnter={newFolder}
                    />
                ) : null}
                <Menu
                    className={styles.menu}
                    onClick={onClick}
                    mode="inline"
                    inlineCollapsed={!isOpenMenu}
                    inlineIndent={24}
                    items={directory || []}
                />
            </div>
            <Outlet></Outlet>
            {/* <Editor /> */}
        </div>
    );
};

export default Actical;
