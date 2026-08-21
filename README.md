# 燕云配装 · 《燕云十六声》配装模拟器

水墨武侠风的装备配装模拟器 + 数据可视化网页（110 级版本）。

> 📋 **团队协作数据文档：[docs/DATA.md](docs/DATA.md)** —— 公式、数据来源、毕业轴、更新指引、已知缺口都在里面。
> 🗺️ **项目状态与路线图：[docs/ROADMAP.md](docs/ROADMAP.md)**

## 功能

- **配装模拟**：9 槽位（武器1/武器2/冠胄/胸甲/环/佩/胫甲/腕甲/弓），金/紫双变体，选装收益徽标
- **调律系统**：第 1 条部位池限制、2-5 条可与第 1 条重复且互不重复、主调律锁定、承音（上限×0.94）、数值自填 +「满」一键、定音不受承音限制
- **面板计算**（NGA 开服帖权威公式）：
  - 五维换算（双实现交叉验证）→ 白→黄三率（判定抵抗）→ 上限截断/归一化
  - 伤害公式：外功减防 + 属攻不减防、穿透乘区 (1+穿透/200)、四分支判定、小外流规则（外功/属攻各自）
  - 增伤全加算、本系属攻×1.5 折算、外系×1.0
- **毕业率**：六维雷达（精准/会心/会意/外功/神力/属攻）+ 当前 DPS（按 110 阶轴基线校准）
- **武学系统**：20 个武学（中文名映射），重1 派生公式（linear_capped_rung）+ 固定加成进面板；武学增效只按装备武器生效
- **心法表**：11 流派固定 3 本 + 第 4 灵活位可选
- **配装管理**：方案库、导出/导入 JSON、URL 分享、清空配装
- **数据可视化**：六维雷达、词条收益图、3 套配装对比

## 运行

```bash
npm install
npm run dev      # 开发，http://localhost:5173
npm test         # 计算引擎单测（Vitest）
npm run build    # 生产构建 → dist/
```

## 目录

```
src/
├── data/          # 数据层（填真实数据改这里）
│   ├── formulas.ts    # 公式常数（五维/三率/抵抗/倍率/武库/承音）——版本更新优先改这里
│   ├── affixes.ts     # 词条库（满值/部位规则/第1条池）
│   ├── equipment.ts   # 装备（主词条紫金/弓）
│   ├── sets.ts        # 套装
│   ├── schools.ts     # 流派（毕业轴/基线/武器/心法表）
│   └── kongfu.ts      # 武学（20 个：派生公式/固定加成/专属心法）
├── engine/        # 计算引擎（纯函数，可单测）
│   ├── calculate.ts   # 聚合 → 五维换算 → 白黄转换 → 面板
│   ├── damage.ts      # 期望伤害（NGA 公式）
│   ├── contribution.ts # 词条/装备边际收益
│   ├── graduation.ts  # 毕业率/六维/DPS 校准
│   └── __tests__/     # Vitest 单测（42 项）
├── utils/         # format / radar / serialize
├── components/    # React 组件
├── reference/     # 原始数据（Temper constants/flow-inputs）
├── wwm_audit/     # WWM-METRICS 日服原始数据
└── docs/          # 团队文档（DATA.md / ROADMAP.md）
```

## 团队工作流

1. 改数据前先读 `docs/DATA.md`（口径/来源/待确认项）
2. 改 `src/data/` 或 `src/data/formulas.ts`
3. `npm test`（42 项）+ `npm run build` 验证
4. 版本更新时优先检查 `formulas.ts` 的版本注释
