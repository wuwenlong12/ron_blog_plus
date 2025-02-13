import React, { useEffect, useState, useCallback } from "react";
import { Button, Input, Form, message, Steps, Tooltip } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Init.module.scss";
// import { checkSubdomain, registerSite } from "../../api/site"; // API 请求
import { useNavigate } from "react-router-dom";
import { checkSubdomain, registerSite } from "../../api/site";
import { debounce } from "lodash";
import {
  RocketOutlined,
  CheckCircleOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const { Step } = Steps;

const InitPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const [isDomainAvailable, setIsDomainAvailable] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [siteUrls, setSiteUrls] = useState<{
    site_url: string;
    site_admin_url: string;
  } | null>(null);

  useEffect(() => {
    if (user && user.managedSites) {
      navigate("/admin");
    }
  }, []);

  useEffect(() => {
    const messages = [
      "请输入您的站点名称，它将展示在您的页面标题中",
      "请输入您的二级域名，我们会检测是否可用",
      "请输入您的姓名，它将展示在您的个人主页中",
      "请输入您的职业，我们会更好地定制您的体验",
    ];
    message.info(messages[currentStep], 5);
  }, [currentStep]);

  // 进入下一步
  const next = async () => {
    try {
      // 验证当前步骤的表单字段
      const currentFields =
        currentStep === 0
          ? ["siteName"]
          : currentStep === 1
          ? ["subdomain"]
          : currentStep === 2
          ? ["name"]
          : ["job"];

      await form.validateFields(currentFields);

      // 如果是第二步（域名检测），需要确认域名可用
      if (currentStep === 1 && !isDomainAvailable) {
        message.error("请确保域名可用后再继续！");
        return;
      }
      setCurrentStep((prev) => prev + 1);
    } catch (err) {
      console.log("表单验证失败", err);
    }
  };

  // 检测二级域名是否可用
  const checkDomain = async (subdomain: string) => {
    if (!subdomain) {
      setIsDomainAvailable(false);
      return;
    }
    setCheckingSubdomain(true);
    try {
      const res = await checkSubdomain(subdomain);
      if (subdomain) {
        if (res.code === 0) {
          setIsDomainAvailable(true);
        } else {
          message.error("域名已被占用，请更换！");
          setIsDomainAvailable(false);
        }
      }
    } catch (error) {
      message.error("检测失败，请稍后再试！");
      setIsDomainAvailable(false);
    } finally {
      setCheckingSubdomain(false);
    }
  };

  // 使用 useCallback 和 lodash 的 debounce 创建防抖函数
  const debouncedCheckDomain = useCallback(
    debounce((value: string) => {
      checkDomain(value);
    }, 500),
    []
  );

  // 处理域名输入变化
  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setFieldsValue({ subdomain: value });
    setIsDomainAvailable(false); // 重置域名可用状态

    if (value) {
      debouncedCheckDomain(value);
    }
  };

  // 提交最终表单
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const formData = {
        siteName: form.getFieldValue("siteName"),
        subdomain: form.getFieldValue("subdomain"),
        name: form.getFieldValue("name"),
        job: form.getFieldValue("job"),
      };

      const res = await registerSite(formData);
      if (res.code === 0) {
        setSiteUrls({
          site_url: res.data.site_url,
          site_admin_url: res.data.site_admin_url,
        });
        setCurrentStep(5); // 进入成功展示步骤
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error("初始化失败，请重试！");
    } finally {
      setLoading(false);
    }
  };

  // 添加复制函数
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        message.success("链接已复制到剪贴板");
      },
      () => {
        message.error("复制失败，请手动复制");
      }
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.bgAnimation}>
        <div className={styles.stars}></div>
        <div className={styles.twinkling}></div>
      </div>

      <motion.div
        className={styles.formContainer}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={styles.titleWrapper}
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <RocketOutlined className={styles.titleIcon} />
          <h1 className={styles.title}>站点初始化</h1>
        </motion.div>

        <Steps size="small" current={currentStep} className={styles.steps}>
          <Step title="站点名称" />
          <Step title="二级域名" />
          <Step title="姓名" />
          <Step title="职业" />
          <Step title="确认" />
          <Step title="完成" />
        </Steps>

        <Form form={form} onFinish={onFinish} className={styles.form}>
          <AnimatePresence mode="wait">
            {/* 步骤 1：输入站点名称 */}
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Form.Item
                  name="siteName"
                  rules={[{ required: true, message: "请输入站点名称！" }]}
                >
                  <Input placeholder="站点名称" className={styles.input} />
                </Form.Item>
                <Button
                  type="primary"
                  onClick={next}
                  className={styles.nextButton}
                >
                  下一步
                </Button>
              </motion.div>
            )}

            {/* 步骤 2：输入二级域名 */}
            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Form.Item
                  name="subdomain"
                  rules={[{ required: true, message: "请输入二级域名！" }]}
                >
                  <Input
                    placeholder="输入二级域名"
                    suffix={
                      "." +
                      process.env.REACT_APP_ENV_HOSTNAME +
                      (process.env.NODE_ENV === "development"
                        ? ":" + process.env.REACT_APP_ENV_PORT
                        : "")
                    }
                    className={styles.input}
                    onChange={handleSubdomainChange}
                    disabled={checkingSubdomain}
                  />
                </Form.Item>
                <div className={styles.domainStatus}>
                  {checkingSubdomain && <span>检测中...</span>}
                  {!checkingSubdomain && isDomainAvailable && (
                    <span className={styles.available}>域名可用</span>
                  )}
                  {!checkingSubdomain &&
                    !isDomainAvailable &&
                    form.getFieldValue("subdomain") && (
                      <span className={styles.unavailable}>域名不可用</span>
                    )}
                </div>
                <Button
                  type="default"
                  onClick={next}
                  className={styles.nextButton}
                  disabled={!isDomainAvailable || checkingSubdomain}
                >
                  下一步
                </Button>
              </motion.div>
            )}

            {/* 步骤 3：输入姓名 */}
            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: "请输入您的姓名！" }]}
                >
                  <Input placeholder="姓名" className={styles.input} />
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

            {/* 步骤 4：输入职业 */}
            {currentStep === 3 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
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

            {/* 步骤 4：确认信息 */}
            {currentStep === 4 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.summary}>
                  <p>站点名称：{form.getFieldValue("siteName")}</p>
                  <p>二级域名：{form.getFieldValue("subdomain")}</p>
                  <p>姓名：{form.getFieldValue("name")}</p>
                  <p>职业：{form.getFieldValue("job")}</p>
                </div>
                <Button
                  type="primary"
                  onClick={() => form.submit()}
                  className={styles.submitButton}
                  loading={loading}
                >
                  确认创建
                </Button>
              </motion.div>
            )}

            {/* 成功步骤 */}
            {currentStep === 5 && siteUrls && (
              <motion.div
                key="success"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.successContainer}>
                  <div className={styles.successIcon}>
                    <CheckCircleOutlined />
                  </div>
                  <h2 className={styles.successTitle}>
                    恭喜您，站点创建成功！
                  </h2>
                  <div className={styles.urlContainer}>
                    <div className={styles.urlItem}>
                      <div className={styles.urlLabel}>前台地址</div>
                      <div className={styles.urlRow}>
                        <span className={styles.urlText}>
                          {siteUrls.site_url}
                        </span>
                        <Tooltip title="复制链接">
                          <Button
                            type="text"
                            icon={<CopyOutlined />}
                            onClick={() => copyToClipboard(siteUrls.site_url)}
                            className={styles.copyButton}
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div className={styles.urlItem}>
                      <div className={styles.urlLabel}>后台地址</div>
                      <div className={styles.urlRow}>
                        <span className={styles.urlText}>
                          {siteUrls.site_admin_url}
                        </span>
                        <Tooltip title="复制链接">
                          <Button
                            type="text"
                            icon={<CopyOutlined />}
                            onClick={() =>
                              copyToClipboard(siteUrls.site_admin_url)
                            }
                            className={styles.copyButton}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="primary"
                    onClick={() => navigate("/admin")}
                    className={styles.enterButton}
                  >
                    进入后台
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Form>
      </motion.div>
    </div>
  );
};

export default InitPage;
