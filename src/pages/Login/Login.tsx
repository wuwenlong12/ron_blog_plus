import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./Login.module.scss";
import img from "../../assets/bg.png";
import { login, register, getVerificationCode } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { checkLoginStatus } from "../../store/authSlice";
import { App } from "antd";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const { message } = App.useApp();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCodeSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsCodeSent(false);
      setCountdown(60);
    }
    return () => clearInterval(timer);
  }, [isCodeSent, countdown]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login(email, password);
    dispatch(checkLoginStatus());
    if (res.code === 0) {
      message.success("登陆成功");
      navigate(-1);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerPassword !== confirmPassword) {
      message.error("密码和确认密码不匹配");
      return;
    }
    const res = await register(
      nickname,
      registerEmail,
      registerPassword,
      verificationCode
    );
    if (res.code === 0) {
      message.success("注册成功，请登录");
      setIsRegistering(false);
    }
  };

  const handleGetVerificationCode = async () => {
    if (!registerEmail) {
      message.error("请先输入邮箱");
      return;
    }
    try {
      const res = await getVerificationCode(registerEmail);
      if (res.code === 0) {
        message.success("验证码已发送到您的邮箱");
        setIsCodeSent(true);
      }
    } catch (error) {
      message.error("获取验证码失败，请重试");
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.imageContainer}></div> {/* 图片容器 */}
      <motion.div
        className={styles.formContainer}
        animate={{ x: isRegistering ? "0%" : "calc(100vw - 380px)" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {isRegistering ? (
          <div className={styles.registerCard}>
            <h1 className={styles.title}>注册</h1>
            <form onSubmit={handleRegisterSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="nickname">昵称</label>
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                  placeholder="输入你的昵称"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="registerEmail">邮箱</label>
                <input
                  id="registerEmail"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  placeholder="输入你的邮箱"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="verificationCode">验证码</label>
                <div className={styles.verificationContainer}>
                  <input
                    id="verificationCode"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                    placeholder="输入验证码"
                  />
                  <button
                    type="button"
                    className={styles.getCodeButton}
                    onClick={handleGetVerificationCode}
                    disabled={isCodeSent}
                  >
                    {isCodeSent ? `${countdown}秒后重试` : "获取验证码"}
                  </button>
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="registerPassword">密码</label>
                <input
                  id="registerPassword"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  placeholder="输入你的密码"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword">确认密码</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="确认你的密码"
                />
              </div>
              <button type="submit" className={styles.submitButton}>
                注册
              </button>
            </form>
            <div className={styles.footer}>
              <p>
                已有账号？<a onClick={() => setIsRegistering(false)}>登录</a>
              </p>
            </div>
          </div>
        ) : (
          <div className={styles.loginCard}>
            <h1 className={styles.title}>登录</h1>
            <form onSubmit={handleLoginSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">邮箱</label>
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
                <label htmlFor="password">密码</label>
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
                登录
              </button>
            </form>
            <div className={styles.footer}>
              <p>
                没有账号？<a onClick={() => setIsRegistering(true)}>注册一个</a>
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
