import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"
import Header from '../components/Header/Header';
import routes from '../router';
import { MenuProps } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import useTheme from '../hook/useTheme';
import { setting } from '../setting';
import Modal from '../components/Modal/Modal';
import LeftModalDom from '../components/RightModalDom/RightModalDom'


const items: MenuProps['items'] = routes.map(item => item.meta)
const IndexLayout = () => {
    const { isDarkMode, handleToggleTheme } = useTheme();
    const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
    const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);
    const navigate = useNavigate();
    const [current, setCurrent] = useState('main');

    const handleNavigate = (key: string) => {
        setCurrent(key)
        navigate(key === 'main' ? '/' : `/${key}`);
        setIsRightMenuOpen(false)
    };
    const handleLeftMenu = () => {
        if (isRightMenuOpen) {
            setIsRightMenuOpen(false)
        }
        setIsLeftMenuOpen(!isLeftMenuOpen)
    }
    const handleRightMenu = () => {
        if (isLeftMenuOpen) {
            setIsLeftMenuOpen(false)
        }
        setIsRightMenuOpen(!isRightMenuOpen)
    }
    return (
        <>
            <Header logoUrl={setting.BLOG_HERO_LOGO_URL}
                siteName="Ron 个人博客"
                menuItems={items}
                isDarkMode={isDarkMode}
                isLeftMenuOpen={isLeftMenuOpen}
                isRightMenuOpen={isRightMenuOpen}
                onToggleTheme={handleToggleTheme}
                onNavigate={handleNavigate}
                onClickLeftMenu={handleLeftMenu}
                onClickRightMenu={handleRightMenu}
                current={current} // 传递当前选中的菜单项
            ></Header>
            <Routes>
                {routes.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        element={route.element}
                    >
                        {/* 渲染子路由 */}
                        {route.children && route.children.map((childRoute, childIndex) => (
                            <Route
                                key={childIndex}
                                path={childRoute.path}
                                element={childRoute.element}
                            />
                        ))}
                    </Route>
                ))}
            </Routes>
            <Modal transition={{
                type: "spring",
                damping: 20,    // 减少阻尼，让弹跳效果更强
                stiffness: 300 // 增加刚度，让弹跳更迅速
            }} isShowModal={isRightMenuOpen} direction='right'>
                <LeftModalDom menuItems={items} current={current} isDarkMode={isDarkMode} onNavigate={handleNavigate} onToggleTheme={handleToggleTheme}></LeftModalDom>
            </Modal>
            <Modal transition={{
                type: "tween",
                ease: "easeInOut", // 可选 "easeIn", "easeOut", "easeInOut", "linear"
                duration: 0.5
            }} isShowModal={isLeftMenuOpen} direction='left' style={{ width: '50%' }}>left</Modal>
        </>


    );
}

export default IndexLayout;
