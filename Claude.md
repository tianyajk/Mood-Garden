# Mood Garden（AI 情绪花园）

> 结合 AI 与沉浸式 3D 视觉的情绪记录平台。用户每天记录情绪，系统据此生成一片独一无二、会随时间成长的数字花园。
>
> 核心理念：**每一种情绪都值得被看见。**
>
> 配套文档：[需求文档.md](需求文档.md) · [架构设计.md](架构设计.md) · [视觉设计.md](视觉设计.md) · [低保真原型.md](低保真原型.md)

---

## 技术栈

- **框架**：React 18 + TypeScript（strict，禁隐式 any）
- **构建**：Vite（别名 `@/` → `src`）
- **样式**：TailwindCSS（design token 化）
- **动效**：Framer Motion
- **3D**：Three.js
- **存储**：LocalStorage（比赛版无后端）
- **AI**：大模型调用，**支持无 Key 时 mock 降级**

### 常用命令

> 代码尚未初始化（无 `package.json`）。脚手架建好后预期：

```bash
npm install        # 安装依赖
npm run dev        # 本地开发（Vite）
npm run build      # 生产构建（含 tsc 类型检查）
npm run lint       # 代码检查
npm run typecheck  # 仅类型检查（tsc --noEmit）
```

---

## 开发规范（强约束，优先级高于一切）

1. **禁止修改已有功能**：不改动已实现、可正常运行的逻辑与界面。
2. **新增功能必须独立**：用独立文件、独立组件、独立 hooks，不侵入原有代码。
3. **禁止重构整个项目**：不做架构级调整、不重写目录、不批量修改原有逻辑。
4. **改前先评估影响范围**：确认不会破坏页面、组件、状态、3D 场景、AI 服务。
5. **优先复用已有组件**：先用项目内现有 UI 组件 / hooks / 工具函数，不重复造轮子。
6. **组件 ≤ 300 行**：超行必须拆分为更小组件，或把逻辑抽到 hooks。
7. **复杂逻辑放进 hooks**：状态管理、业务流程、3D 通信、AI 调用全部在 hooks 中。
8. **页面只负责展示与布局**：`pages/` 不写业务逻辑，只引入组件、调用 hooks（预期 < 120 行）。
9. **禁止 `any`**：必须用 TypeScript 明确类型，类型集中在 `types/`。
10. **改后必须编译通过**：无 TS 错误、无语法错误、无运行时报错，可正常启动。
11. **代码风格统一**：遵循现有格式、注释风格、命名规范。
12. **3D 引擎与 React 严格解耦**：`garden/` 不依赖 React 组件，只通过描述数据通信。
13. **AI 服务必须支持降级**：无 API Key 时自动 mock，不影响核心功能。

---

## 架构（四层单向依赖）

```
展示层 Pages / Components（只渲染，无逻辑）
   ↓
逻辑层 Hooks / Context（状态 + 业务编排）
   ↓
数据层 Services / Storage（持久化 + AI 调用）
   ↓
引擎层 Garden Engine（Three.js 渲染）
```

### 关键原则

- **引擎与 React 解耦**：Three.js 封装在 `garden/`，React 仅通过 `useGardenScene` 通信。
- **AI 可降级**：所有 AI 调用走 `services/ai/`，提供 mock，无 key 也能演示。
- **单一数据源**：八情绪配置集中在 `config/emotions.ts`，新增/调整情绪只改这一处。
- **派生而非存储**：成长阶段、花园元素、统计由记录计算得出，避免数据不一致。

### 目录结构

```
src/
├── pages/          ① 页面：只布局 + 组合（HomePage / RecordPage / GardenPage / TimelinePage）
├── components/     ② 组件：≤300 行，按领域分组 ui/ · mood/ · feedback/ · timeline/
├── hooks/          ③ 业务逻辑（useMoodForm / useMoodRecords / useAiFeedback /
│                      useGardenScene / useDayCycle / useTimeline / useGardenStage）
├── garden/         ④ 花园引擎：Three.js，独立于 React（core/ elements/ effects/ factory/）
├── services/       ⑤ 数据层：ai/（aiClient · prompts · mockAi）、storage/（moodStorage）
├── context/        ⑥ 全局状态：GardenContext（Context + useReducer，唯一真相源）
├── config/         ⑦ 单一数据源：emotions.ts · growth.ts · theme.ts
├── types/          ⑧ 全局类型，杜绝 any：mood.ts · garden.ts · ai.ts
└── utils/          ⑨ 纯函数工具：date.ts · validators.ts
```

### 页面与路由

| 路由 | 页面 | 核心 Hook |
|---|---|---|
| `/` | HomePage（Logo / 标题 / 入口 / 入场动画） | — |
| `/record` | RecordPage（日期 + 情绪选择 + 描述 + 提交） | `useMoodForm` `useMoodRecords` |
| `/garden` | GardenPage（3D 场景 + AI 反馈 + 陪伴语 + 昼夜/天气） | `useGardenScene` `useAiFeedback` `useDayCycle` |
| `/timeline` | TimelinePage（时间线 + 搜索 + 筛选 + 详情） | `useTimeline` `useMoodRecords` |

### 数据流

```
用户操作 → Hook 编排（useMoodForm → useMoodRecords）
                ├→ services/ai      情绪分析 / 陪伴语（可 mock 降级）
                ├→ services/storage 写 LocalStorage（mood_records）
                ↓
          GardenContext（当天情绪 + 历史记录 + 成长阶段）
                ├→ GardenPage → useGardenScene → garden 引擎
                └→ TimelinePage / 统计（订阅同一份记录）
```

---

## 核心领域模型

### 八情绪 → 花园元素（单一数据源 `config/emotions.ts`）

| 情绪 | key | emoji | 植物 | 特效 | 昼夜 |
|---|---|---|---|---|---|
| 开心 | `happy` | 😊 | 向日葵 | 金色光点、蝴蝶 | day |
| 平静 | `calm` | 🍃 | 白色小花、草地 | 微风粒子 | day |
| 兴奋 | `excited` | ✨ | 烟花花朵 | 彩虹光效、闪烁 | dusk |
| 焦虑 | `anxious` | 🌧️ | 蓝色荆棘 | 雨滴、雾气 | overcast |
| 迷茫 | `confused` | 🌫️ | 紫色花海 | 漂浮云层 | dusk |
| 难过 | `sad` | 🌙 | 月光花 | 萤火虫 | night |
| 愤怒 | `angry` | ⚡ | 红色彼岸花 | 火焰粒子 | dusk |
| 孤独 | `lonely` | ❄️ | 冬雪树 | 冷色光效、飘雪 | night |

- **多选**：花园元素叠加渲染；主配色取第一个选中情绪；天气取强度最高者。
- 场景 3D 用饱和原色，UI 用 `视觉设计.md` 的低饱和柔化版。

### 成长阶段（由累计记录天数派生 `config/growth.ts`）

`seed`（1 天）→ `small`（7 天，小花园）→ `sea`（30 天，花海）→ `forest`（100 天，情绪森林）

### 关键类型（`src/types/`）

```typescript
type EmotionKey = 'happy'|'calm'|'excited'|'anxious'|'confused'|'sad'|'angry'|'lonely';

interface MoodRecord {        // 持久化单元，每天唯一
  id: string; date: string;   // YYYY-MM-DD
  emotions: EmotionKey[];     // 单选/多选
  description: string;        // ≤300 字
  aiAnalysis: AiAnalysis | null;
  createdAt: number;
}

interface AiAnalysis { keywords: string[]; intensity: 'low'|'medium'|'high'; feedback: string; }
interface AiResult<T> { data: T; source: 'api'|'mock'; }  // mock = 降级
```

---

## 设计语言（落到 `tailwind.config.ts` + `config/theme.ts`）

> 一句话：**米白底 + 自然绿到蓝紫渐变 + 毛玻璃玻璃岛 + 柔润衬线标题 + 慢呼吸动效**。安静、高级、会随情绪呼吸。

三条铁律：**柔但不糊**（圆角/低饱和/毛玻璃，但层级对齐精准）· **静才显贵**（动效仅在交互/转场，宁慢勿快）· **色随情绪走**（UI 主色中性，强调色由当天情绪注入）。

- **中性色**：背景 `#FAF8F5`、卡片 `#FFFFFF`、主文字 `#2B2A28`（暖黑非纯黑）。
- **品牌色**：森林绿 `#7FB89B`、蓝紫 `#A99BD4`、暖黄光晕 `#F6E7C1`；核心渐变 `linear-gradient(135deg,#7FB89B,#8FA8CF,#A99BD4)`。
- **圆角**：sm 12 / md 20 / lg 28 / full 9999——绝不用直角。
- **间距**：8pt 栅格（4·8·12·16·24·32·48·64），卡片内边距 24，区块间距 48。
- **毛玻璃**（高级感核心，抽成 `ui/Card` 的 `glass` 变体复用）：`rgba(255,255,255,.18)` + `blur(16px) saturate(120%)` + 1px 高光描边；夜晚切深色玻璃。
- **动效**：`ease/soft`(300ms) · `ease/gentle`(500ms) · `ease/breathe`(4–6s loop) · `spring/soft`(stiffness 120, damping 18)。尊重 `prefers-reduced-motion`，移动端粒子/阴影自动降级，目标 60fps。
- **文案**：克制、温柔、第二人称，避免感叹号轰炸与营销腔。

---

## 写代码前自检

- [ ] 是否触碰了已有可运行的功能？（应避免）
- [ ] 新逻辑是否放进了 hooks，而非堆在页面/组件？
- [ ] 组件是否 ≤ 300 行？
- [ ] 有没有用 `any`？类型是否在 `types/` 定义？
- [ ] 情绪相关改动是否只动了 `config/emotions.ts` 单一数据源？
- [ ] AI 调用是否走 `services/ai/` 且有 mock 降级路径？
- [ ] `garden/` 是否仍未依赖任何 React 组件？
- [ ] 改完 `tsc` 是否通过、能否正常启动？
