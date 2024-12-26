# 使用 Nginx 官方镜像作为基础镜像
FROM nginx:alpine

# 复制本地构建好的静态文件到 Nginx 的 HTML 目录
COPY ./build /usr/share/nginx/html

# 将 Nginx 配置文件复制到容器中
COPY ./nginx.conf /etc/nginx/nginx.conf

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]