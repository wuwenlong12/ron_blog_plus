// src/App.tsx
import React, { useEffect, useState } from "react";
import "./App.scss";
import { BrowserRouter as Router, Routes, Route, RouterProvider, createBrowserRouter } from "react-router-dom";
import useRoutes from "./router";
import { ConfigProvider, theme, ThemeConfig } from "antd";
import useTheme from "./hook/useTheme";


const App: React.FC = () => {
  const { routes, isloaded } = useRoutes(); // 使用 useRoutes 获取路由配置和加载状态
  const { isDarkMode } = useTheme();  // 确保在 Provider 内部
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>()

  useEffect(() => {
    if (isDarkMode) {
      setCurrentTheme({
        algorithm: theme.darkAlgorithm,
        token: {
        },
        components: {
          Breadcrumb: {
            /* 这里是你的组件 token */
            itemColor: "#fff"
          },
          Button:{
            defaultBg:'#fff'
          }
        },
      })
    } else {
      setCurrentTheme({
        algorithm: theme.defaultAlgorithm,
        token: {

        },
        components: {
          Breadcrumb: {
            /* 这里是你的组件 token */
            itemColor: "#fff"
          },
          Button:{
            defaultBg:'#fff'
          }
        },
      })
    }

  }, [isDarkMode])
  if (!isloaded ) {
    return <div>loading</div>
  }

  //todo： 视图可以响应式但是路由没有添加上
  useEffect(()=>{
    const router = createBrowserRouter(routes);
    console.log(router);
  })
  
  
  return (
    <ConfigProvider theme={currentTheme}>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </ConfigProvider>

  );
};

export default App;
