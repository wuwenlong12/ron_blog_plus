import React, { useEffect, useState } from "react";
import { Button, Input, Form, message, Steps } from "antd";
import { motion } from "framer-motion";
import styles from "./Init.module.scss";
// import { checkSubdomain, registerSite } from "../../api/site"; // API 请求
import { useNavigate } from "react-router-dom";

const { Step } = Steps;

const InitPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkingSubdomain, setCheckingSubdomain] = useState(false); // 域名检测状态
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const messages = [
      "请输入您的站点名称，它将展示在您的页面标题中",
      "请输入您的二级域名，我们会检测是否可用",
      "请输入您的职业，我们会更好地定制您的体验",
    ];
    message.info(messages[currentStep], 5);
  }, [currentStep]);

  // 进入下一步
  const next = async () => {
    try {
      await form.validateFields();
      setCurrentStep((prev) => prev + 1);
    } catch (err) {
      console.log("表单验证失败", err);
    }
  };

  // 检测二级域名是否可用
  const checkDomain = async () => {
    // const subdomain = form.getFieldValue("subdomain");
    // if (!subdomain) {
    //   message.error("请输入二级域名！");
    //   return;
    // }
    // setCheckingSubdomain(true);
    // try {
    //   const res = await checkSubdomain(subdomain);
    //   if (res.available) {
    //     message.success("域名可用！");
    //   } else {
    //     message.error("域名已被占用，请更换！");
    //   }
    // } catch (error) {
    //   message.error("检测失败，请稍后再试！");
    // } finally {
    //   setCheckingSubdomain(false);
    // }
  };

  // 提交最终表单
  const onFinish = async (values: any) => {
    // setLoading(true);
    // try {
    //   const res = await registerSite(values.siteName, values.subdomain, values.job);
    //   if (res.success) {
    //     message.success(`初始化成功！您的站点地址是：${res.siteUrl}`);
    //     navigate(`/dashboard`);
    //   } else {
    //     message.error(res.message);
    //   }
    // } catch (error) {
    //   message.error("初始化失败，请重试！");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          站点初始化
        </motion.h1>

        <Steps size="small" current={currentStep} className={styles.steps}>
          <Step title="站点名称" />
          <Step title="二级域名" />
          <Step title="职业" />
          <Step title="完成" />
        </Steps>

        <Form form={form} onFinish={onFinish} className={styles.form}>
          {/* 步骤 1：输入站点名称 */}
          {currentStep === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Form.Item
                name="siteName"
                rules={[{ required: true, message: "请输入站点名称！" }]}
              >
                <Input placeholder="站点名称" className={styles.input} />
              </Form.Item>
              <Button
                type="default"
                onClick={next}
                className={styles.nextButton}
              >
                下一步
              </Button>
            </motion.div>
          )}

          {/* 步骤 2：输入二级域名 */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Form.Item
                name="subdomain"
                rules={[{ required: true, message: "请输入二级域名！" }]}
              >
                <Input
                  placeholder="输入二级域名"
                  suffix=".example.com"
                  className={styles.input}
                />
              </Form.Item>
              <Button
                type="primary"
                loading={checkingSubdomain}
                onClick={checkDomain}
                className={styles.checkButton}
              >
                检测域名可用性
              </Button>
              <Button
                type="default"
                onClick={next}
                className={styles.nextButton}
              >
                下一步
              </Button>
            </motion.div>
          )}

          {/* 步骤 3：输入职业 */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Form.Item
                name="job"
                rules={[{ required: true, message: "请输入您的职业！" }]}
              >
                <Input placeholder="职业" className={styles.input} />
              </Form.Item>
              <Button
                type="default"
                onClick={next}
                className={styles.nextButton}
              >
                下一步
              </Button>
            </motion.div>
          )}

          {/* 步骤 4：完成 */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.submitButton}
                loading={loading}
              >
                完成初始化
              </Button>
            </motion.div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default InitPage;
