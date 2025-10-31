# 🌊 海洋保护互动艺术展

探索海洋之美，感受生命的韵律 - 一个结合音乐、视觉和交互的 p5.js 艺术项目

## 🎯 项目简介

这是一个以**海洋保护**为主题的交互式艺术作品集，使用 p5.js 创建，包含三个独立的视觉作品：

1. **水母粒子系统** - 20,000 个粒子构成的生命之舞
2. **珊瑚礁生态** - 色彩斑斓的海底花园
3. **海浪韵律** - 潮起潮落的永恒节奏

每个作品都支持：
- 🎵 **音乐可视化** - 音频频谱驱动视觉效果
- 🖱️ **实时交互** - 鼠标和键盘控制
- 🎨 **动态生成** - 每次体验都独一无二

## 🎨 特色功能

### 音频系统
- ✅ 程序生成的深海氛围音乐（多层振荡器合成）
- ✅ 实时 FFT 频谱分析
- ✅ 低频/中频/高频分离处理
- ✅ 交互音效（水滴、气泡）
- ✅ 音量控制和播放/暂停

### 视觉效果
- ✅ 全屏沉浸式展示（100vh）
- ✅ 音频驱动的颜色变化
- ✅ 粒子系统和生成艺术
- ✅ 流畅的动画和过渡效果
- ✅ 响应式设计（桌面/平板/手机）

### 交互设计
- ✅ 鼠标移动影响视觉
- ✅ 点击触发音效
- ✅ 键盘快捷键
- ✅ 触摸滑动导航（移动端）
- ✅ 底部导航栏切换作品

## 📁 项目结构

```
coding-mid/
├── index.html              # 主页面
├── css/
│   └── style.css          # 海洋主题样式
├── js/
│   ├── audio.js           # 音频管理系统
│   └── navigation.js      # 导航和作品切换
├── sketches/
│   ├── jellyfish/         # 水母粒子系统
│   │   └── sketch.js
│   ├── coral/             # 珊瑚礁生态
│   │   └── sketch.js
│   └── ocean-waves/       # 海浪韵律
│       └── sketch.js
├── data/
│   └── sketches.json      # 作品配置和元数据
└── README.md              # 项目文档
```

## 🚀 快速开始

### 1. 本地运行

由于浏览器安全限制，需要使用本地服务器运行：

**使用 Python（推荐）:**
```bash
# Python 3
cd coding-mid
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**使用 Node.js:**
```bash
npx http-server coding-mid -p 8000
```

**使用 PHP:**
```bash
cd coding-mid
php -S localhost:8000
```

然后在浏览器访问：`http://localhost:8000`

### 2. 在线部署

可以部署到以下平台：

- **GitHub Pages** - 免费托管静态网站
- **Netlify** - 拖拽式部署
- **Vercel** - 自动化部署

## 🎮 交互指南

### 通用控制

- **鼠标移动** - 影响视觉效果
- **点击屏幕** - 触发音效
- **侧边按钮（☰）** - 打开/关闭控制面板
- **← →** - 切换作品（键盘或底部按钮）
- **音量滑块** - 调节音量

### 各作品专属控制

**水母粒子系统:**
- `空格键` - 切换颜色模式（白色/青色/紫色/音频驱动）

**珊瑚礁生态:**
- `按住鼠标` - 吸引鱼群

**海浪韵律:**
- `拖动鼠标` - 创造涟漪
- `R 键` - 重置波浪

## 🎵 音频说明

由于浏览器限制无法直接加载外部音频文件，本项目使用 **p5.sound.js** 生成程序音乐：

### 音频架构
- 4 层正弦/三角波振荡器
- 实时频率调制（模拟海浪）
- 混响效果（营造深海氛围）
- FFT 分析（512 点）

### 如何添加自己的音乐

1. 准备音频文件（MP3 或 WAV 格式）
2. 放入 `assets/audio/` 文件夹
3. 修改 `js/audio.js` 中的 `createGenerativeMusic()` 函数：

```javascript
// 替换生成式音乐为文件加载
this.bgMusic = loadSound('assets/audio/your-music.mp3');
this.bgMusic.loop();
```

### 推荐免费音频资源

- [Freesound.org](https://freesound.org/) - 搜索 "ocean ambience"
- [Pixabay Music](https://pixabay.com/music/) - 无版权音乐
- [ccMixter](https://ccmixter.org/) - CC 授权音乐

## 🌍 海洋保护

> 海洋覆盖地球表面的71%，是地球生命的摇篮。
> 保护海洋生态，就是保护我们自己。

### 了解更多

- [世界自然基金会 - 海洋保护](https://www.worldwildlife.org/initiatives/oceans)
- [联合国可持续发展目标 - 水下生物](https://sdgs.un.org/goals/goal14)

## 🛠️ 技术栈

- **p5.js 1.9.0** - 创意编程框架
- **p5.sound.js** - 音频处理库
- **HTML5 / CSS3** - 现代网页技术
- **原生 JavaScript** - 无需框架

## 🎨 自定义配色

在 `css/style.css` 中修改 CSS 变量：

```css
:root {
  --ocean-deep: #0a1128;      /* 深海色 */
  --cyan-bright: #00d9ff;     /* 青色 */
  --purple-glow: #b388ff;     /* 紫色 */
  /* ... */
}
```

## 📱 浏览器兼容性

✅ Chrome 90+ (推荐)
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
⚠️ 移动端浏览器（性能较弱设备可能卡顿）

### 性能建议

- 桌面端推荐：水母粒子系统（20,000 粒子）
- 移动端推荐：珊瑚礁或海浪作品
- 如遇卡顿，可在 `sketches/jellyfish/sketch.js` 中减少 `POINT_COUNT`

## 📝 License

本项目使用 MIT License 开源。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

可以贡献的方向：
- 新的海洋主题作品
- 更多交互方式
- 性能优化
- 音频效果增强
- 多语言支持

## 📧 联系方式

如有问题或建议，欢迎通过以下方式联系：
- GitHub Issues
- Email: [你的邮箱]

---

**用艺术的方式，唤醒海洋保护意识** 🌊💙
