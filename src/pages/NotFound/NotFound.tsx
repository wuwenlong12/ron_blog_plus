import React from "react";
import "./NotFound.module.scss"; // 引入样式文件

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-subtitle">页面未找到</p>
        <p className="not-found-description">
          哎呀，您访问的页面似乎已经消失。您可以返回首页或者浏览其他页面。
        </p>
        <a href="/" className="not-found-button">
          返回首页
        </a>
      </div>
    </div>
  );
};

export default NotFound;
