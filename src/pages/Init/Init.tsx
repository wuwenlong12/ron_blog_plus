import React, { useEffect, useState } from "react";
import { Button, Input, Form, message, Steps } from "antd";
import { motion } from "framer-motion";
import styles from "./Init.module.scss";
import { systemInit } from "../../api/auth";
import { useNavigate } from "react-router-dom";

const { Step } = Steps;

const InitPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  // 进入下一步
  const next = async () => {
    // await form.validateFields(); // 校验当前步骤的输入
    setCurrentStep((prev) => prev + 1);
  };

  useEffect(() => {
    switch (currentStep) {
      case 0:
        message.info("请输入您的昵称，这将用于您发布文章、日记等的名字", 5);
        break;
      case 1:
        message.info("请输入您的邮箱地址，用于登录和获取超级管理员权限", 5);
        break;
      case 2:
        message.info("请输入您的密码，用于登录和获取超级管理员权限", 5);
        break;

      default:
        break;
    }
  }, [currentStep]);

  // 提交表单数据
  const onFinish = async (values: any) => {
    console.log("最终提交数据:", values);
    const res = await systemInit(
      values.username,
      values.email,
      values.password
    );
    if (res.code === 0) {
      message.success("初始化成功！请登陆");
      navigate("/login");
    } else {
      message.error(res.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          初始化
        </motion.h1>

        <Steps size="small" current={currentStep} className={styles.steps}>
          <Step title="昵称" />
          <Step title="邮箱" />
          <Step title="密码" />
          <Step title="完成" />
        </Steps>

        <Form form={form} onFinish={onFinish} className={styles.form}>
          {/* 步骤 1：输入昵称 */}
          <div style={{ display: currentStep === 0 ? "block" : "none" }}>
            <Form.Item
              name="username"
              rules={[{ required: true, message: "请输入您的昵称！" }]}
            >
              <Input placeholder="昵称" className={styles.input} />
            </Form.Item>
          </div>

          {/* 步骤 2：输入邮箱 */}
          <div style={{ display: currentStep === 1 ? "block" : "none" }}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "请输入您的邮箱！" },
                { type: "email", message: "请输入有效的邮箱地址！" },
              ]}
            >
              <Input placeholder="邮箱" type="email" className={styles.input} />
            </Form.Item>
          </div>

          {/* 步骤 3：输入密码 */}
          <div style={{ display: currentStep === 2 ? "block" : "none" }}>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "请输入您的密码！" }]}
            >
              <Input.Password placeholder="密码" className={styles.input} />
            </Form.Item>
          </div>

          {/* 步骤 4：完成 */}
          <div style={{ display: currentStep === 3 ? "block" : "none" }}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.submitButton}
              loading={loading}
            >
              完成初始化
            </Button>
          </div>

          {/* “下一步” 按钮 */}
          {currentStep < 3 && (
            <Button type="default" onClick={next} className={styles.nextButton}>
              下一步
            </Button>
          )}
        </Form>
      </div>
    </div>
  );
};

export default InitPage;
