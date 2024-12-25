#!/bin/bash

# 配置
SERVER_USER="root"                # 服务器用户
SERVER_HOST="1.92.89.240"         # 服务器 IP 地址
DEPLOY_DIR="/root/webhook-deploy/dist" # 部署服务器目标目录
LOCAL_BUILD_DIR="build"           # 本地构建目录
TAR_FILE="build.tar.gz"           # 压缩文件名
LOG_FILE="deploy.log"             # 日志文件

# 记录日志
exec > >(tee -a $LOG_FILE) 2>&1

# 1. 拉取最新代码
echo "Pulling latest code..."
git pull origin main || exit 1

# 2. 安装依赖
echo "Installing dependencies..."
pnpm install || exit 1

# 3. 构建项目
echo "Building the project..."
pnpm build || exit 1

# 4. 压缩构建文件
echo "Compressing build files..."
tar -czf $TAR_FILE -C $LOCAL_BUILD_DIR . || exit 1

# 5. 上传到服务器
echo "Uploading build files to server..."
ssh $SERVER_USER@$SERVER_HOST "mkdir -p $DEPLOY_DIR"
scp $TAR_FILE $SERVER_USER@$SERVER_HOST:$DEPLOY_DIR || exit 1

# 6. 解压并部署
echo "Deploying on server..."
ssh $SERVER_USER@$SERVER_HOST << EOF
cd $DEPLOY_DIR
tar -xzf $TAR_FILE -C $DEPLOY_DIR
rm -f $TAR_FILE
echo "Deployment completed successfully!"
EOF

echo "Build and deploy finished!"