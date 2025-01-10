import React from "react";
import styles from "./SelfInfoCard.module.scss";
import favicon from "../../assets/logo.png";
import { Button, Card, Tooltip } from "antd";
import { FaGithub, FaWeixin, FaEnvelope, FaQq } from "react-icons/fa";

const SelfInfoCard: React.FC = () => {
  const handleButtonClick = (key: string) => {
    switch (key) {
      case "github":
        window.open("https://github.com/your-github-username", "_blank");
        break;
      case "email":
        window.location.href = "mailto:your-email@example.com";
        break;
      case "wechat":
        // 微信跳转的逻辑，可能需要展示二维码或其他方式
        alert("请扫描微信二维码添加好友！");
        break;
      case "qq":
        window.location.href =
          "https://wpa.qq.com/msgrd?v=3&uin=your-qq-number&site=qq&menu=yes";
        break;
      default:
        console.warn("未定义的跳转类型");
    }
  };

  const buttons = [
    {
      key: "github",
      icon: <FaGithub />,
      tooltip: "GitHub",
    },
    {
      key: "email",
      icon: <FaEnvelope />,
      tooltip: "邮箱",
    },
    {
      key: "wechat",
      icon: <FaWeixin />,
      tooltip: "微信",
    },
    {
      key: "qq",
      icon: <FaQq />,
      tooltip: "QQ",
    },
  ];

  return (
    <Card className={styles.container}>
      <img className={styles.icon} src={favicon} alt="logo" />
      <div className={styles.name}>Mr.Ron</div>
      <div className={styles.description}>武文龙的个人知识库</div>
      <div className={styles.buttons}>
        {buttons.map((btn) => (
          <Tooltip key={btn.key} title={btn.tooltip} className={styles.buttons}>
            <Button
              className={styles.btnItem}
              shape="circle"
              onClick={() => handleButtonClick(btn.key)} // 点击事件
              icon={React.cloneElement(btn.icon as React.ReactElement, {
                className: styles.btnItemIcon,
              })}
            />
          </Tooltip>
        ))}
      </div>
    </Card>
  );
};

export default SelfInfoCard;
