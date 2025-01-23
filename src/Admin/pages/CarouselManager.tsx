import React, { useState, useEffect } from "react";
import {
  Upload,
  Button,
  List,
  message,
  Form,
  Input,
  Modal,
  Space,
  Card,
  Popconfirm,
  ColorPicker,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import styles from "../styles/CarouselManager.module.scss";
import { uploadFileInChunks } from "../../utils/uploadFileInChunks";
import { CarouselItem } from "../../api/carouselManager/type";
import {
  addCarousel,
  deleteCarousel,
  getCarousel,
  updateCarousel,
} from "../../api/carouselManager";

const CarouselManager: React.FC = () => {
  const [carousels, setCarousels] = useState<CarouselItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<CarouselItem | null>(null);
  const [form] = Form.useForm();
  const [uploadUrl, setUploadUrl] = useState<string>("");

  useEffect(() => {
    fetchCarousels();
  }, []);

  const fetchCarousels = async () => {
    const res = await getCarousel();
    if (res.code === 0) {
      setCarousels(res.data);
    }
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
      const url = await uploadFileInChunks(file);
      setUploadUrl(url as string);
      form.setFieldValue("img_url", url);
      message.success("图片上传成功！");
      onSuccess(url);
    } catch (error) {
      message.error("图片上传失败，请重试！");
      onError(error);
    }
  };

  const handleUploadChange = (info: any) => {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      setUploadUrl(info.file.response);
      form.setFieldValue("img_url", info.file.response);
    }
  };

  const showModal = (item?: CarouselItem) => {
    if (item) {
      setEditingItem(item);
      form.setFieldsValue(item);
      setUploadUrl(item.img_url || "");
    } else {
      setEditingItem(null);
      form.resetFields();
      setUploadUrl("");
    }
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      // 处理按钮颜色值
      const processedValues = {
        ...values,
        buttons: values.buttons.map((btn: any) => ({
          ...btn,
          color:
            typeof btn.color === "string" ? btn.color : btn.color.toHexString(),
        })),
      };

      if (editingItem) {
        const res = await updateCarousel(editingItem._id, processedValues);
        if (res.code === 0) {
          message.success("轮播图更新成功！");
        }
      } else {
        const res = await addCarousel(processedValues);
        if (res.code === 0) {
          message.success("轮播图创建成功！");
        }
      }
      setIsModalVisible(false);
      fetchCarousels();
    } catch (error) {
      message.error("操作失败，请重试！");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: 调用删除API
      const res = await deleteCarousel(id);
      if (res.code === 0) {
        message.success("删除成功！");
        fetchCarousels();
      }
    } catch (error) {
      message.error("删除失败，请重试！");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          添加轮播图
        </Button>
      </div>

      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={carousels}
        renderItem={(item) => (
          <List.Item>
            <Card className={styles.carouselCard}>
              <div className={styles.cardContent}>
                <div className={styles.imageSection}>
                  {item.img_url ? (
                    <img
                      src={item.img_url}
                      alt={item.title}
                      className={styles.backgroundImage}
                    />
                  ) : (
                    <div className={styles.placeholderImage}>
                      <div className={styles.placeholderContent}>
                        <div className={styles.placeholderIcon}>
                          <PictureOutlined />
                        </div>
                        <span>暂无图片</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.infoSection}>
                  <h3>{item.title}</h3>
                  <h4>{item.subtitle}</h4>
                  <p>{item.desc}</p>
                  <div className={styles.buttons}>
                    {item.buttons.map((btn, index) => (
                      <Button
                        key={index}
                        style={{ backgroundColor: btn.color }}
                      >
                        {btn.text}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className={styles.actions}>
                  <Space>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => showModal(item)}
                    >
                      编辑
                    </Button>
                    <Popconfirm
                      title="确定要删除这个轮播图吗？"
                      onConfirm={() => handleDelete(item._id)}
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        删除
                      </Button>
                    </Popconfirm>
                  </Space>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title={editingItem ? "编辑轮播图" : "添加轮播图"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ buttons: [{ text: "", url: "", color: "#1677ff" }] }}
        >
          <Form.Item label="背景图片" name="img_url">
            <Upload
              beforeUpload={handleBeforeUpload}
              customRequest={handleCustomUpload}
              onChange={handleUploadChange}
              showUploadList={false}
            >
              <div className={styles.uploadArea}>
                {uploadUrl ? (
                  <img
                    src={uploadUrl}
                    alt="背景图"
                    className={styles.previewImage}
                  />
                ) : (
                  <div className={styles.placeholderContent}>
                    <div className={styles.placeholderIcon}>
                      <UploadOutlined />
                    </div>
                    <span>点击上传图片</span>
                  </div>
                )}
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入标题" }]}
          >
            <Input placeholder="请输入标题" />
          </Form.Item>

          <Form.Item
            label="副标题"
            name="subtitle"
            rules={[{ required: true, message: "请输入副标题" }]}
          >
            <Input placeholder="请输入副标题" />
          </Form.Item>

          <Form.Item
            label="描述"
            name="desc"
            rules={[{ required: true, message: "请输入描述" }]}
          >
            <Input.TextArea rows={4} placeholder="请输入描述" />
          </Form.Item>

          <Form.List name="buttons">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <div key={field.key} className={styles.buttonItem}>
                    <div className={styles.buttonHeader}>
                      <h4>按钮 {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(field.name)}
                        >
                          删除
                        </Button>
                      )}
                    </div>
                    <div className={styles.buttonForm}>
                      <Form.Item
                        name={[field.name, "text"]}
                        rules={[{ required: true, message: "请输入按钮文字" }]}
                      >
                        <Input placeholder="按钮文字" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, "url"]}
                        rules={[{ required: true, message: "请输入跳转链接" }]}
                      >
                        <Input placeholder="跳转链接" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, "color"]}
                        initialValue="#1677ff"
                        getValueFromEvent={(color) => color.toHexString()}
                      >
                        <ColorPicker />
                      </Form.Item>
                    </div>
                  </div>
                ))}
                {fields.length < 3 && (
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      className={styles.addButton}
                    >
                      添加按钮
                    </Button>
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default CarouselManager;
