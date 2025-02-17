import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, Tabs, App, message } from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  LoadingOutlined,
  UserOutlined,
  WechatOutlined,
  GithubOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { BsBriefcase } from "react-icons/bs";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { uploadFileInChunks } from "../../utils/uploadFileInChunks";
import styles from "../styles/AboutManager.module.scss";
import Editor from "../../components/Editor/Editor";
import { PartialBlock } from "@blocknote/core";
import { getSiteInfo, updateSite } from "../../api/site";
import { UpdateSiteParams } from "../../api/site/type";
import { motion } from "framer-motion";

const SettingManager: React.FC = () => {
  const [form] = Form.useForm();
  const [aboutContent, setAboutContent] = useState<PartialBlock[]>(undefined);
  const { message: appMessage } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    init();
  }, []);

  // 初始化获取站点信息
  const init = async () => {
    const res = await getSiteInfo();
    if (res.code === 0) {
      const { data } = res;
      setAvatarUrl(data.avatar || "");

      form.setFieldsValue({
        name: data.name,
        profession: data.profession,
        github: data.github,
        email: data.email,
        wechat: data.wechat,
        avatar: data.avatar,
        card_signature: data.card_signature,
        card_message: data.card_message,
        // 为 Form.List 组件准备数据结构
        signatures: data.signatures?.map((item) => ({ value: item })) || [],
        homepage_signature:
          data.homepage_signature?.map((item) => ({ value: item })) || [],
        tech_stack: data.tech_stack || [""],
      });
      console.log(data.AboutContent);

      setAboutContent(
        data.AboutContent.length <= 0 ? undefined : data.AboutContent
      );
    }
  };

  // 处理表单提交，根据不同的 tabKey 处理不同的数据
  const handleFinish = async (values: any, tabKey: string) => {
    try {
      setLoading(true);
      let params: UpdateSiteParams = {};

      switch (tabKey) {
        case "basic":
          params = {
            name: values.name,
            profession: values.profession,
            avatar: values.avatar,
            wechat: values.wechat,
            github: values.github,
            email: values.email,
          };
          break;

        case "signatures":
          params = {
            signatures: values.signatures
              ?.map((item) => item.value)
              .filter(Boolean),
          };
          break;

        case "homepage_signature":
          params = {
            homepage_signature: values.homepage_signature
              ?.map((item) => item.value)
              .filter(Boolean),
          };
          break;

        case "tech_stack":
          params = {
            tech_stack: values.tech_stack?.filter(Boolean),
          };
          break;

        case "card_signature":
          params = {
            card_signature: values.card_signature,
            card_message: values.card_message,
          };
          break;

        case "aboutContent":
          params = {
            AboutContent: aboutContent,
          };
          break;

        default:
          break;
      }

      const res = await updateSite(params);
      if (res.code === 0) {
        appMessage.success("更新成功");
      } else {
        appMessage.error(res.message || "更新失败");
      }
    } catch (error) {
      console.error(error);
      appMessage.error("保存失败");
    } finally {
      setLoading(false);
    }
  };

  // 处理头像上传前的检查
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("只能上传 JPG/PNG 格式的图片！");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片必须小于 2MB！");
      return false;
    }
    return true;
  };

  // 处理头像变更
  const handleAvatarChange: UploadProps["onChange"] = async (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setAvatarLoading(true);
      return;
    }

    try {
      const file = info.file.originFileObj;
      if (!file) return;

      const url = await uploadFileInChunks(file);
      setAvatarLoading(false);

      // 更新头像 URL 状态和表单值
      setAvatarUrl(url);
      form.setFieldValue("avatar", url);
    } catch (error) {
      setAvatarLoading(false);
      message.error("上传失败，请重试");
    }
  };

  // 添加自定义上传函数
  const customRequest = async (options: any) => {
    // 阻止默认上传行为
    options.onSuccess();
  };

  const tabItems = [
    {
      key: "basic",
      label: "基本信息",
      icon: <UserOutlined />,
      children: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => handleFinish(values, "basic")}
            initialValues={{ avatar: form.getFieldValue("avatar") }}
          >
            <div className={styles.formSection}>
              <div className={styles.avatarSection}>
                <Form.Item label="头像" name="avatar">
                  <Upload
                    name="avatar"
                    listType="picture-circle"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleAvatarChange}
                    customRequest={customRequest}
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div>
                        {avatarLoading ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{ marginTop: 8 }}>上传头像</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </div>

              <div className={styles.formGrid}>
                <Form.Item label="姓名" name="name">
                  <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
                </Form.Item>

                <Form.Item label="职业" name="profession">
                  <Input
                    prefix={<BsBriefcase className={styles.reactIcon} />}
                    placeholder="请输入职业"
                  />
                </Form.Item>

                <Form.Item label="微信号" name="wechat">
                  <Input
                    prefix={<WechatOutlined />}
                    placeholder="请输入微信号"
                  />
                </Form.Item>

                <Form.Item label="GitHub" name="github">
                  <Input
                    prefix={<GithubOutlined />}
                    placeholder="请输入 GitHub 地址"
                  />
                </Form.Item>

                <Form.Item
                  label="邮箱"
                  name="email"
                  rules={[{ type: "email", message: "请输入有效的邮箱地址" }]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="请输入邮箱地址"
                  />
                </Form.Item>
              </div>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存基本信息
              </Button>
            </Form.Item>
          </Form>
        </motion.div>
      ),
    },
    {
      key: "signatures",
      label: "个性签名",
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => handleFinish(values, "signatures")}
        >
          <Form.List name="signatures" initialValue={[{ value: "" }]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Form.Item key={key} label={`个性签名 ${name + 1}`}>
                    <Form.Item {...restField} name={[name, "value"]} noStyle>
                      <Input
                        placeholder="请输入个性签名"
                        style={{
                          width: "calc(100% - 32px)",
                          marginRight: "8px",
                        }}
                      />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        style={{ color: "red" }}
                      />
                    )}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add({ value: "" })}
                    icon={<PlusOutlined />}
                  >
                    添加个性签名
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存个性签名
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "homepage_signature",
      label: "首页签名",
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => handleFinish(values, "homepage_signature")}
        >
          <Form.List name="homepage_signature" initialValue={[{ value: "" }]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Form.Item key={key} label={`首页签名 ${name + 1}`}>
                    <Form.Item {...restField} name={[name, "value"]} noStyle>
                      <Input
                        placeholder="请输入首页签名"
                        style={{
                          width: "calc(100% - 32px)",
                          marginRight: "8px",
                        }}
                      />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        style={{ color: "red" }}
                      />
                    )}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add({ value: "" })}
                    icon={<PlusOutlined />}
                  >
                    添加首页签名
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存首页签名
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "tech_stack",
      label: "技术栈",
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => handleFinish(values, "tech_stack")}
        >
          <Form.List name="tech_stack" initialValue={[""]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Form.Item key={key} label={`技术栈 ${name + 1}`}>
                    <Form.Item {...restField} name={name} noStyle>
                      <Input
                        placeholder="请输入技术栈"
                        style={{
                          width: "calc(100% - 32px)",
                          marginRight: "8px",
                        }}
                      />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        style={{ color: "red" }}
                      />
                    )}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    添加技术栈
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存技术栈
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "card_signature",
      label: "名片签名",
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => handleFinish(values, "card_signature")}
        >
          <Form.Item label="名片签名" name="card_signature">
            <Input placeholder="请输入名片签名" />
          </Form.Item>

          <Form.Item label="名片留言" name="card_message">
            <Input.TextArea placeholder="请输入名片留言" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存名片签名
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "aboutContent",
      label: "关于页面内容",
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => handleFinish(values, "aboutContent")}
        >
          <Editor
            editable={true}
            isSummary={true}
            initialContent={aboutContent}
            onChange={setAboutContent}
          />
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存关于页面内容
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2>个人信息设置</h2>
        <p className={styles.subtitle}>管理您的个人信息和偏好设置</p>
      </motion.div>

      <Tabs
        defaultActiveKey="basic"
        items={tabItems}
        className={styles.tabs}
        tabBarGutter={32}
      />
    </div>
  );
};

export default SettingManager;
