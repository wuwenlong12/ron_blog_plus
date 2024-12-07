// src/App.tsx
import React, { useEffect, useState } from "react";
import "./App.scss";
import { BrowserRouter as Router, Routes, Route, RouterProvider, createBrowserRouter } from "react-router-dom";
import useRoutes from "./router";
import { ConfigProvider, theme, ThemeConfig } from "antd";
import useTheme from "./hook/useTheme";
import Loading from "./components/loading/loading";


const App: React.FC = () => {
  const {isloaded, routes } = useRoutes(); // 使用 useRoutes 获取路由配置和加载状态
  const { isDarkMode } = useTheme();  // 确保在 Provider 内部
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>()
  // const [router, setRouter] = useState<any>([]);
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

    // 创建 router 实例，仅在 routes 或 isloaded 变化时触发
    // useEffect(() => {
    //   if (isloaded) {
    //     const newRouter = createBrowserRouter(routes);
    //     console.log(newRouter);
        
    //     setRouter(newRouter);
    //   }
    // }, [routes, isloaded]);


   
 
   
  
  if (!isloaded ) {
    return <Loading />;
  }

  const router = createBrowserRouter(routes);
  
  
  return (
    <ConfigProvider theme={currentTheme}>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </ConfigProvider>

  );
};

export default App;
