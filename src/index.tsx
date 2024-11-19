import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { setRem } from './utils/setRem';
import { Provider } from 'react-redux';
import store from './store/index';
import { ConfigProvider } from 'antd';
import useTheme from './hook/useTheme';
import { theme } from 'antd';
import 'remixicon/fonts/remixicon.css';
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css"
// 适配移动端
setRem();

const Root = () => {
  const { isDarkMode } = useTheme();  // 确保在 Provider 内部
  const currentTheme = isDarkMode
    ? {
      algorithm: theme.darkAlgorithm,
      token: {
        colorPrimary: '#1DA57A', // 设置主要颜色
        colorTextBase: '#fff',    // 设置文字颜色为白色
        colorBackground: '#000',  // 设置背景色为黑色
        colorButtonPrimaryBg: '#333', // 修改按钮的背景色
        colorButtonPrimaryHover: '#444', // 修改按钮的 hover 背景色
      },
      components: {
        Button: {
          // 使用 colorBgTextActive 来修改按钮的激活状态背景色
          colorBgTextActive: '#000', // 设置按钮激活状态背景色
          defaultBg: "#fff"
        },
      },
    }
    : {
      algorithm: theme.defaultAlgorithm,
      token: {
        colorPrimary: '#1890ff', // 设置主要颜色
        colorTextBase: '#000',   // 设置文字颜色为黑色
        colorBackground: '#fff', // 设置背景色为白色
        colorButtonPrimaryBg: '#1890ff', // 设置按钮的背景色
        colorButtonPrimaryHover: '#40a9ff', // 设置按钮的 hover 背景色
      },
      components: {
        Button: {
          // 使用 colorBgTextActive 来修改按钮的激活状态背景色
          colorBgTextActive: '#666', // 设置按钮激活状态背景色
          defaultBg: "#fff"
        },
      },
    };

  return (
    <ConfigProvider theme={currentTheme}>
      <App />
    </ConfigProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <Root />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
