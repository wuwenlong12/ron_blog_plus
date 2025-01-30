import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, Tabs, App } from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import styles from "../styles/AboutManager.module.scss";
import Editor from "../../components/Editor/Editor";
import { PartialBlock } from "@blocknote/core";

// 假设这些是你的 API 函数
// import { fetchAboutData, saveBasicInfo, saveSignatures, saveCardSettings, saveContactInfo, saveTechStack, saveAboutContent } from 'your-api-module';

// 假设这是你的富文本编辑器组件

const AboutManager: React.FC = () => {
  const [form] = Form.useForm();
  const [techStack, setTechStack] = useState<string[]>([""]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [aboutContent, setAboutContent] = useState<PartialBlock[]>(undefined);
  const { message } = App.useApp();
  useEffect(() => {
    // 初始化数据
    const initData = async () => {
      try {
        // const data = await fetchAboutData();
        // form.setFieldsValue(data);
        // setAvatarUrl(data.avatarUrl);
        // setTechStack(data.techStack || []);
        // setAboutContent(data.aboutContent || "");
        message.success("数据加载成功！");
      } catch (error) {
        message.error("数据加载失败，请重试！");
      }
    };
    initData();
  }, [form]);

  const handleFinish = async (values: any, tabKey: string) => {
    try {
      switch (tabKey) {
        case "基本信息":
          // await saveBasicInfo(values);
          break;
        case "个性签名":
          // await saveSignatures(values);
          break;
        case "Card 设置":
          // await saveCardSettings(values);
          break;
        case "联系方式":
          // await saveContactInfo(values);
          break;
        case "技术栈":
          // await saveTechStack(values);
          break;
        case "关于页面内容":
          // await saveAboutContent({ content: aboutContent });
          break;
        default:
          break;
      }
      message.success(`${tabKey} 信息已更新！`);
    } catch (error) {
      message.error(`${tabKey} 信息更新失败，请重试！`);
    }
  };

  const addTechStack = () => {
    setTechStack([...techStack, ""]);
  };

  const removeTechStack = (index: number) => {
    setTechStack(techStack.filter((_, i) => i !== index));
  };

  const updateTechStack = (value: string, index: number) => {
    const newTechStack = [...techStack];
    newTechStack[index] = value;
    setTechStack(newTechStack);
  };

  const handleBeforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("只能上传图片文件！");
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("图片大小不能超过 5MB！");
      return false;
    }
    return true;
  };

  const handleCustomUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      // 假设上传成功后返回的图片 URL
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      message.success("头像上传成功！");
      onSuccess(url);
    } catch (error) {
      message.error("头像上传失败，请重试！");
      onError(error);
    }
  };

  const handleAvatarChange = (info: any) => {
    if (info.file.status === "done") {
      setAvatarUrl(info.file.response);
    }
    setFileList(info.fileList);
  };

  const tabItems = [
    {
      key: "basic",
      label: "基本信息",
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => handleFinish(values, "基本信息")}
        >
          <Form.Item label="头像" name="avatar">
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={handleBeforeUpload}
              customRequest={handleCustomUpload}
              onChange={handleAvatarChange}
              fileList={fileList}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" style={{ width: "100%" }} />
              ) : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item label="姓名" name="name">
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item label="职业" name="profession">
            <Input placeholder="请输入职业" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "signatures",
      label: "个性签名",
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => handleFinish(values, "个性签名")}
        >
          <Form.List name="aboutSignatures">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Form.Item
                    key={key}
                    label={`关于页面个性签名 ${key + 1}`}
                    {...restField}
                  >
                    <Input
                      placeholder="请输入个性签名"
                      style={{ width: "calc(100% - 32px)", marginRight: "8px" }}
                    />
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{ color: "red" }}
                    />
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    添加个性签名
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.List name="homeSignatures">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Form.Item
                    key={key}
                    label={`首页个性签名 ${key + 1}`}
                    {...restField}
                  >
                    <Input
                      placeholder="请输入首页个性签名"
                      style={{ width: "calc(100% - 32px)", marginRight: "8px" }}
                    />
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{ color: "red" }}
                    />
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    添加首页个性签名
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "card",
      label: "Card 设置",
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => handleFinish(values, "Card 设置")}
        >
          <Form.Item label="Card 个性签名" name="cardSignature">
            <Input placeholder="请输入 Card 个性签名" />
          </Form.Item>

          <Form.Item label="Card 背面留言" name="cardBackMessage">
            <Input.TextArea placeholder="请输入 Card 背面留言" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "contact",
      label: "联系方式",
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => handleFinish(values, "联系方式")}
        >
          <Form.Item label="微信号" name="wechat">
            <Input placeholder="请输入微信号" />
          </Form.Item>

          <Form.Item label="GitHub 地址" name="github">
            <Input placeholder="请输入 GitHub 地址" />
          </Form.Item>

          <Form.Item label="邮箱地址" name="email">
            <Input placeholder="请输入邮箱地址" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "techStack",
      label: "技术栈",
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => handleFinish(values, "技术栈")}
        >
          {techStack.map((tech, index) => (
            <Form.Item key={index} label={`技术栈 ${index + 1}`}>
              <Input
                value={tech}
                onChange={(e) => updateTechStack(e.target.value, index)}
                placeholder="请输入技术栈"
                style={{ width: "calc(100% - 32px)", marginRight: "8px" }}
              />
              {techStack.length > 1 && (
                <MinusCircleOutlined
                  onClick={() => removeTechStack(index)}
                  style={{ color: "red" }}
                />
              )}
            </Form.Item>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={addTechStack}
              icon={<PlusOutlined />}
            >
              添加技术栈
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存
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
          onFinish={() => handleFinish({}, "关于页面内容")}
        >
          {/* 使用你的富文本编辑器 */}
          <Editor
            editable={true}
            isSummary={true}
            initialContent={aboutContent}
            onChange={setAboutContent}
          />
          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <h2>关于页面管理</h2>
      <Tabs defaultActiveKey="basic" items={tabItems} />
    </div>
  );
};

export default AboutManager;
