#!/bin/bash

# 海洋保护互动艺术展 - 启动脚本

echo "🌊 启动海洋保护互动艺术展..."
echo ""
echo "正在启动本地服务器..."
echo ""

# 检测 Python 版本
if command -v python3 &> /dev/null; then
    echo "✓ 使用 Python 3"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✓ 使用 Python 2"
    python -m SimpleHTTPServer 8000
else
    echo "❌ 未找到 Python，请安装 Python 或使用其他方式启动服务器"
    echo ""
    echo "替代方案："
    echo "1. Node.js: npx http-server -p 8000"
    echo "2. PHP: php -S localhost:8000"
    exit 1
fi
