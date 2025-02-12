import React from "react";
import styles from "./NotFound.module.scss";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { RiHomeSmileLine } from "react-icons/ri";

const NotFound = () => {
  const goToMainSite = () => {
    window.location.href = `${process.env.REACT_APP_ENV_CLIENT_PROTOCOL}${process.env.REACT_APP_ENV_CLIENT_HOSTNAME}:${process.env.REACT_APP_ENV_CLIENT_PORT}/greet`;
  };

  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundContent}>
        <h1 className={styles.notFoundTitle}>站点未注册</h1>
        <p className={styles.notFoundSubtitle}>
          抱歉，您访问的站点尚未被注册或已被停用
        </p>
        <p className={styles.notFoundDescription}>
          您可以访问我们的主站，了解如何创建属于自己的个人站点
        </p>
        <Button
          type="primary"
          size="large"
          icon={<RiHomeSmileLine />}
          onClick={goToMainSite}
          className={styles.notFoundButton}
        >
          前往主站
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
