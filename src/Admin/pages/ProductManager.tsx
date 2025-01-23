import React, { useState } from "react";
import { Table, Button, Form, Input, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import styles from "../styles/ProductManager.module.scss";

interface Product {
  key: string;
  name: string;
  price: number;
}

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [form] = Form.useForm();

  const handleAddProduct = (values: any) => {
    const newProduct = {
      key: Date.now().toString(),
      name: values.name,
      price: values.price,
    };
    setProducts([...products, newProduct]);
    message.success("产品已添加！");
    form.resetFields();
  };

  const handleDelete = (key: string) => {
    setProducts(products.filter((p) => p.key !== key));
    message.success("已删除产品");
  };

  return (
    <div className={styles.container}>
      <Form layout="inline" form={form} onFinish={handleAddProduct}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: "请输入产品名称" }]}
        >
          <Input placeholder="产品名称" />
        </Form.Item>
        <Form.Item
          name="price"
          rules={[{ required: true, message: "请输入价格" }]}
        >
          <Input placeholder="价格" type="number" />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          添加产品
        </Button>
      </Form>
      <Table
        dataSource={products}
        columns={[
          { title: "名称", dataIndex: "name" },
          { title: "价格", dataIndex: "price" },
          {
            title: "操作",
            render: (_, record) => (
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.key)}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default ProductManager;
