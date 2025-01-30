// import React, { useEffect, useState } from "react";
// import {
//   Form,
//   Input,
//   Button,
//   Upload,
//   Avatar,
//   Space,
//   Tabs,
//   Divider,
//   App,
// } from "antd";
// import {
//   UploadOutlined,
//   UserOutlined,
//   GithubOutlined,
//   WechatOutlined,
//   MailOutlined,
//   PlusOutlined,
//   DeleteOutlined,
//   LockOutlined,
//   ContactsOutlined,
//   EditOutlined,
// } from "@ant-design/icons";
// import type { UploadFile } from "antd/es/upload/interface";
// import styles from "../styles/ProfileForm.module.scss";
// import { getUserDetails, updateUserDetails } from "../../api/auth";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../store";
// import { upload } from "../../api/upload";
// import { uploadFileInChunks } from "../../utils/uploadFileInChunks";
// import { checkLoginStatus } from "../../store/authSlice";

// const ProfileForm: React.FC = () => {
//   const [userInfo, setUserInfo] = useState<string>();
//   const [avatarUrl, setAvatarUrl] = useState<string>();
//   const [signatures, setSignatures] = useState<string[]>([""]); // 个性签名列表
//   const [basicForm] = Form.useForm();
//   const [securityForm] = Form.useForm();
//   const [contactForm] = Form.useForm();
//   const [signatureForm] = Form.useForm();
//   const { user } = useSelector((state: RootState) => state.auth);
//   const dispatch = useDispatch<AppDispatch>();
//   const { message } = App.useApp();
//   useEffect(() => {
//     init();
//   }, []);

//   const init = async () => {
//     setSignatures(user.explain);
//   };
//   const handleBasicFinish = async (values: any) => {
//     const res = await updateUserDetails({
//       username: values.nickname,
//       email: values.email,
//       imgurl: avatarUrl,
//     });
//     if (res.code === 0) {
//       message.success("基本信息已更新！");
//       dispatch(checkLoginStatus());
//     } else {
//       message.error(res.message);
//     }
//   };

//   const handleSecurityFinish = async (values: any) => {
//     const { oldPassword, newPassword, confirmPassword } = values;
//     if (confirmPassword !== newPassword) {
//       message.error("两次密码输入不一致，请重新输入！");
//       return;
//     }
//     console.log(oldPassword, newPassword);

//     const res = await updateUserDetails({
//       oldPassword,
//       newPassword,
//     });
//     if (res.code === 0) {
//       message.success("密码修改成功！请重新登陆");
//       dispatch(checkLoginStatus());
//     }
//   };

//   const handleContactFinish = async (values: any) => {
//     const { github, wechat, email } = values;
//     const res = await updateUserDetails({
//       wx: wechat,
//       email: email,
//       github: github,
//     });
//     if (res.code === 0) {
//       message.success("联系方式已更新！");
//       dispatch(checkLoginStatus());
//     } else {
//       message.error(res.message);
//     }
//   };
//   //个性签名
//   const handleSignatureFinish = async (value) => {
//     console.log(value);

//     const res = await updateUserDetails({
//       explain: signatures,
//     });
//     if (res.code === 0) {
//       message.success("个性签名已更新！");
//       dispatch(checkLoginStatus());
//     } else {
//       message.error(res.message);
//     }
//   };
//   const signaturesChange = (e, index) => {
//     console.log(e.target.value, index);
//     setSignatures((prev) => {
//       const newState = [...prev];
//       newState[index] = e.target.value;
//       return newState;
//     });
//   };
//   const handleAvatarChange = (info: any) => {
//     if (info.file.status === "done") {
//       setAvatarUrl(info.file.response);
//       message.success("头像上传成功！");
//     }
//   };

//   const addSignature = () => {
//     setSignatures([...signatures, ""]);
//   };

//   const removeSignature = (index: number) => {
//     const newSignatures = signatures.filter((_, i) => i !== index);
//     setSignatures(newSignatures);
//   };

//   const beforeUpload = (file: File) => {
//     const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
//     if (!isJpgOrPng) {
//       message.error("只能上传 JPG/PNG 图片！");
//       return false;
//     }
//     const isLt2M = file.size / 1024 / 1024 < 2;
//     if (!isLt2M) {
//       message.error("图片大小不能超过 2MB！");
//       return false;
//     }
//     return true;
//   };

//   const handleCustomUpload = async (options: any) => {
//     const { file, onSuccess, onError } = options;

//     const url = await uploadFileInChunks(file);
//     // message.success("头像上传成功！");
//     onSuccess(url, file);
//   };

//   // 基本信息表单
//   const BasicInfoForm = (
//     <div className={styles.tabContent}>
//       <Form
//         form={basicForm}
//         layout="vertical"
//         onFinish={handleBasicFinish}
//         initialValues={{
//           nickname: user.username,
//           email: user.email,
//         }}
//       >
//         <>
//           <div className={styles.avatarSection}>
//             <div className={styles.avatarWrapper}>
//               <Avatar
//                 size={120}
//                 icon={<UserOutlined />}
//                 src={user.imgurl || avatarUrl}
//                 className={styles.avatar}
//               />
//               <div className={styles.avatarMask}>
//                 <Upload
//                   onChange={handleAvatarChange}
//                   beforeUpload={beforeUpload}
//                   showUploadList={false}
//                   customRequest={handleCustomUpload}
//                 >
//                   <Button type="link" icon={<UploadOutlined />}>
//                     更换头像
//                   </Button>
//                 </Upload>
//               </div>
//             </div>
//             <div className={styles.userTitle}>
//               <div className={styles.userName}>{user.username}</div>
//               <div className={styles.userRole}>超级管理员</div>
//             </div>
//           </div>

//           <div className={styles.formGrid}>
//             <Form.Item
//               label="昵称"
//               name="nickname"
//               rules={[{ required: true, message: "请输入昵称" }]}
//             >
//               <Input prefix={<UserOutlined />} placeholder="请输入昵称" />
//             </Form.Item>

//             <Form.Item
//               label="邮箱"
//               name="email"
//               rules={[
//                 { required: true, message: "请输入邮箱" },
//                 { type: "email", message: "请输入有效的邮箱地址" },
//               ]}
//             >
//               <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
//             </Form.Item>
//           </div>

//           <div className={styles.formActions}>
//             <Button type="primary" htmlType="submit" size="large">
//               保存基本信息
//             </Button>
//           </div>
//         </>
//       </Form>
//     </div>
//   );

//   // 账户安全表单
//   const SecurityForm = (
//     <div className={styles.tabContent}>
//       <Form
//         form={securityForm}
//         layout="vertical"
//         onFinish={handleSecurityFinish}
//       >
//         <>
//           <div className={styles.securitySection}>
//             <h3 className={styles.sectionTitle}>修改密码</h3>
//             <div className={styles.formGrid}>
//               <Form.Item
//                 label="当前密码"
//                 name="oldPassword"
//                 rules={[{ required: true, message: "请输入当前密码" }]}
//               >
//                 <Input.Password
//                   prefix={<LockOutlined />}
//                   placeholder="请输入当前密码"
//                   autoComplete="current-password"
//                 />
//               </Form.Item>

//               <Form.Item
//                 label="新密码"
//                 name="newPassword"
//                 rules={[
//                   { required: true, message: "请输入新密码" },
//                   { min: 6, message: "密码长度不能小于6位" },
//                 ]}
//               >
//                 <Input.Password
//                   prefix={<LockOutlined />}
//                   placeholder="请输入新密码"
//                   autoComplete="new-password"
//                 />
//               </Form.Item>

//               <Form.Item
//                 label="确认新密码"
//                 name="confirmPassword"
//                 dependencies={["newPassword"]}
//                 rules={[
//                   { required: true, message: "请确认新密码" },
//                   ({ getFieldValue }) => ({
//                     async validator(_, value) {
//                       if (!value) {
//                         return;
//                       }
//                       if (value === getFieldValue("newPassword")) {
//                         return Promise.resolve();
//                       }
//                       throw new Error("两次输入的密码不一致！");
//                     },
//                   }),
//                 ]}
//               >
//                 <Input.Password
//                   prefix={<LockOutlined />}
//                   placeholder="请再次输入新密码"
//                   autoComplete="new-password"
//                 />
//               </Form.Item>
//             </div>
//           </div>
//           <div className={styles.formActions}>
//             <Button type="primary" htmlType="submit" size="large">
//               修改密码
//             </Button>
//           </div>
//         </>
//       </Form>
//     </div>
//   );

//   // 联系方式表单
//   const ContactForm = (
//     <div className={styles.tabContent}>
//       <Form
//         form={contactForm}
//         layout="vertical"
//         onFinish={handleContactFinish}
//         initialValues={{
//           github: user.github,
//           wechat: user.wx,
//         }}
//       >
//         <>
//           <div className={styles.contactSection}>
//             <h3 className={styles.sectionTitle}>社交账号</h3>
//             <div className={styles.formGrid}>
//               <Form.Item label="GitHub" name="github">
//                 <Input
//                   prefix={<GithubOutlined />}
//                   placeholder="请输入GitHub地址"
//                 />
//               </Form.Item>
//               <Form.Item label="微信号" name="wechat">
//                 <Input prefix={<WechatOutlined />} placeholder="请输入微信号" />
//               </Form.Item>
//             </div>
//           </div>
//           <div className={styles.formActions}>
//             <Button type="primary" htmlType="submit" size="large">
//               保存联系方式
//             </Button>
//           </div>
//         </>
//       </Form>
//     </div>
//   );

//   // 个性签名表单
//   const SignatureForm = (
//     <div className={styles.tabContent}>
//       <div>{user.explain}</div>
//       <Form
//         form={signatureForm}
//         layout="vertical"
//         onFinish={handleSignatureFinish}
//       >
//         <>
//           <div className={styles.signatureSection}>
//             <h3 className={styles.sectionTitle}>个性签名</h3>
//             <div className={styles.signatures}>
//               {signatures.map((_, index) => (
//                 <Form.Item
//                   key={index}
//                   label={`签名 ${index + 1}`}
//                   name={["signatures", index]}
//                 >
//                   <div className={styles.signatureItem}>
//                     <Input.TextArea
//                       rows={2}
//                       placeholder="写下你的个性签名"
//                       className={styles.signatureInput}
//                       defaultValue={signatures[index]}
//                       onChange={(e) => signaturesChange(e, index)}
//                     />
//                     {signatures.length > 1 && (
//                       <Button
//                         type="text"
//                         danger
//                         icon={<DeleteOutlined />}
//                         onClick={() => removeSignature(index)}
//                       />
//                     )}
//                   </div>
//                 </Form.Item>
//               ))}
//             </div>
//             {signatures.length < 3 && (
//               <Button
//                 type="dashed"
//                 block
//                 icon={<PlusOutlined />}
//                 onClick={addSignature}
//                 className={styles.addSignatureBtn}
//               >
//                 添加签名
//               </Button>
//             )}
//           </div>
//           <div className={styles.formActions}>
//             <Button type="primary" htmlType="submit" size="large">
//               保存个性签名
//             </Button>
//           </div>
//         </>
//       </Form>
//     </div>
//   );

//   const items = [
//     {
//       key: "1",
//       label: (
//         <span className={styles.tabLabel}>
//           <UserOutlined />
//           基本信息
//         </span>
//       ),
//       children: BasicInfoForm,
//     },
//     {
//       key: "2",
//       label: (
//         <span className={styles.tabLabel}>
//           <LockOutlined />
//           账户安全
//         </span>
//       ),
//       children: SecurityForm,
//     },
//     {
//       key: "3",
//       label: (
//         <span className={styles.tabLabel}>
//           <ContactsOutlined />
//           联系方式
//         </span>
//       ),
//       children: ContactForm,
//     },
//     {
//       key: "4",
//       label: (
//         <span className={styles.tabLabel}>
//           <EditOutlined />
//           个性签名
//         </span>
//       ),
//       children: SignatureForm,
//     },
//   ];

//   return (
//     <div className={styles.profileContainer}>
//       <Tabs
//         defaultActiveKey="1"
//         items={items}
//         className={styles.tabs}
//         animated={{ tabPane: true }}
//       />
//     </div>
//   );
// };

// export default ProfileForm;
import React from "react";

export default function ProfileForm() {
  return <div>ProfileForm</div>;
}
