import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./Login.module.scss";
import img from "../../assets/bg.png";
import { login } from "../../api/auth";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { checkLoginStatus } from "../../store/authSlice";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log("Email:", email);
    console.log("Password:", password);
    const res = await login(email, password);
    if (res.code === 0) {
      message.success("登陆成功，跳转到个人设置页面");
      navigate("/admin");
    }
  };
  return (
    <div className={styles.loginPage}>
      <div className={styles.imageContainer}></div> {/* 图片容器 */}
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="输入你的邮箱"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="输入你的密码"
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Log In
          </button>
        </form>
        <div className={styles.footer}>
          <p>此系统目前只支持管理员登陆...</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
