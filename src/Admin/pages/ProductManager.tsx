import React, { useState, useEffect } from "react";
import { Table, Button, Form, Input, Modal, message, Upload } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import styles from "../styles/ProductManager.module.scss";
import Editor from "../../components/Editor/Editor";
import {
  addProject,
  deleteProject,
  getProject,
  updateProject,
} from "../../api/project";
import { ProjectItem } from "../../api/project/type";
import { uploadFileInChunks } from "../../utils/uploadFileInChunks";

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<ProjectItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProjectItem | null>(
    null
  );
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [editorKey, setEditorKey] = useState<number>(0); // 用于强制重建 Editor
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await getProject();
    if (res.code === 0) {
      setProducts(res.data);
    }
  };

  const handleAddOrEditProduct = async (values: any) => {
    const newProduct: ProjectItem = {
      _id: editingProduct ? editingProduct._id : Date.now().toString(),
      title: values.title,
      category: values.category,
      content: values.content,
      img_url: uploadedImageUrl || values.img_url,
      button_url: values.button_url,
    };

    if (editingProduct) {
      await updateProject(editingProduct._id, newProduct);
      message.success("产品已更新！");
    } else {
      await addProject(newProduct);
      message.success("产品已添加！");
    }

    setIsModalOpen(false);
    form.resetFields();
    setUploadedImageUrl(null); // 重置上传的图片 URL
    fetchProducts(); // 重新获取产品列表
  };

  const handleDelete = async (key: string) => {
    await deleteProject(key);
    setProducts(products.filter((p) => p._id !== key));
    message.success("已删除产品");
    fetchProducts(); // 重新获取产品列表
  };

  const showEditModal = (product?: ProjectItem) => {
    setEditingProduct(product || null);
    setIsModalOpen(true);
    setEditorKey((prevKey) => prevKey + 1); // 更新 Editor 的 key
    if (product) {
      form.setFieldsValue(product);
      setUploadedImageUrl(product.img_url); // 设置当前编辑产品的图片 URL
    } else {
      form.resetFields();
      setUploadedImageUrl(null);
    }
  };

  const handleCustomUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      const url = await uploadFileInChunks(file);
      setUploadedImageUrl(url); // 更新上传的图片 URL
      form.setFieldsValue({ img_url: url });
      message.success("图片上传成功！");
      onSuccess(url);
    } catch (error) {
      message.error("图片上传失败，请重试！");
      onError(error);
    }
  };

  return (
    <div className={styles.container}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showEditModal()}
        className={styles.addButton}
      >
        添加产品
      </Button>
      <Table
        dataSource={products}
        columns={[
          {
            title: "图片",
            dataIndex: "img_url",
            render: (url) => (
              <img src={url} alt="产品图片" className={styles.productImage} />
            ),
            key: "img_url",
          },
          { title: "标题", dataIndex: "title", key: "title" },
          { title: "分类", dataIndex: "category", key: "category" },
          {
            title: "操作",
            key: "action",
            render: (_, record) => (
              <span>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => showEditModal(record)}
                  className={styles.editButton}
                />
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record._id)}
                  className={styles.deleteButton}
                />
              </span>
            ),
          },
        ]}
        className={styles.productTable}
        rowKey="_id"
      />

      <Modal
        title={editingProduct ? "编辑产品" : "添加产品"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        className={styles.modal}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrEditProduct}>
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入产品标题" }]}
          >
            <Input placeholder="产品标题" />
          </Form.Item>
          <Form.Item
            label="分类"
            name="category"
            rules={[{ required: true, message: "请输入产品分类" }]}
          >
            <Input placeholder="产品分类" />
          </Form.Item>
          <Form.Item
            label="主要内容"
            name="content"
            rules={[{ required: true, message: "请输入产品内容" }]}
          >
            <Editor
              key={editorKey} // 使用动态 key 强制重建
              isSummary={true}
              editable={true}
              onChange={(val) => {
                form.setFieldsValue({ content: val });
              }}
              initialContent={form.getFieldValue("content")}
            ></Editor>
          </Form.Item>
          <Form.Item
            label="按钮链接"
            name="button_url"
            rules={[{ required: true, message: "请输入按钮链接" }]}
          >
            <Input placeholder="按钮链接" />
          </Form.Item>
          <Form.Item label="图片" name="img_url">
            <Upload
              name="image"
              listType="picture-card"
              maxCount={1}
              customRequest={handleCustomUpload}
              showUploadList={false}
            >
              {uploadedImageUrl ? (
                <img
                  src={uploadedImageUrl}
                  alt="产品图片"
                  style={{ width: "100%" }}
                />
              ) : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManager;
