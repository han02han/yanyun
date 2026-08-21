/**
 * 公式常数 —— 版本差异集中在这一处修改。
 *
 * 五维换算来源：greydust/where-builds-meet 与 Phong940253/wwm-damage-calculator
 * 两个独立实现数值一致（Power 0.22/1.36、Agility 0.9+0.00076、Momentum 0.9+0.00038、
 * Body 60HP、Defense 17HP+0.57），可信度高。三率上限三家一致（会心 80%/会意 40%）。
 * 注意：110 阶五维换算系数社区仍标记为缺口，此处为 96-110 通用近似，待校正。
 */
export interface FormulaConfig {
  /** 当前依据的游戏版本说明 */
  version: string
  /** 五维换算 */
  wuxing: {
    /** 体：1 体 → 气血 */
    ti: { hp: number }
    /** 御：1 御 → 气血 + 外防 */
    yu: { hp: number; def: number }
    /** 劲：1 劲 → 小外攻 + 大外攻 */
    jin: { minAtk: number; maxAtk: number }
    /** 敏：1 敏 → 小外攻 + 会心率（小数） */
    min: { minAtk: number; crit: number }
    /** 势：1 势 → 大外攻 + 会意率（小数） */
    shi: { maxAtk: number; critLike: number }
  }
  /** 三率上限（小数，黄值上限） */
  caps: {
    precise: number // 精准 ≤ 100%
    crit: number    // 会心 ≤ 80%（需精准命中后触发）
    critLike: number // 会意 ≤ 40%（无视精准）
  }
  /** 白→黄转换（敌方"判定抵抗"）
   *  黄精准 = 白 < 基础命中 ? 白 : 基础命中 + (白−基础命中)/(1+抵抗)
   *  黄会心/会意 = 白/(1+抵抗)；直接会心/会意不衰减（白=黄）
   *  三个独立实现（wwm-dps / WWM-METRICS / where-builds-meet）数值一致。
   *  当前 0.65 = 突破 16/17（96-100 级）档；110 级副本抵抗待玩家查证 */
  judgementResistance: {
    resistance: number
    basePrecision: number
  }
  /** 伤害倍率 */
  damage: {
    critMult: number      // 会心基础 ×1.5（面板"会心伤害加成"为额外加算）
    critLikeMult: number  // 会意基础 ×1.35（按最大攻结算；"会意伤害加成"额外加算）
    selfAttrMult: number  // 本系/无相属性攻击 ×1.5（主路径倍率，外系 ×1）
  }
  /** 武库（玩家确认，110 级）：通用加大小外攻；4 种流派武库加对应属攻（数值相同） */
  wuku: {
    minAtk: number
    maxAtk: number
  }
  /** 承音（玩家确认）：承音装备词条上限 = 满值 × 0.94（如大外 121.4 → 114.12） */
  chengyin: number
}

export const FORMULAS: FormulaConfig = {
  version: '五维换算经双实现交叉验证（greydust/Phong940253），110 阶系数待校正',
  wuxing: {
    ti: { hp: 60 },
    yu: { hp: 17, def: 0.57 },
    jin: { minAtk: 0.22, maxAtk: 1.36 },
    min: { minAtk: 0.9, crit: 0.00076 },
    shi: { maxAtk: 0.9, critLike: 0.00038 },
  },
  caps: { precise: 1, crit: 0.8, critLike: 0.4 },
  judgementResistance: { resistance: 0.65, basePrecision: 0.65 },
  damage: { critMult: 1.5, critLikeMult: 1.35, selfAttrMult: 1.5 },
  wuku: { minAtk: 186, maxAtk: 373 },
  chengyin: 0.94,
}

/** 伤害判定顺序说明（用于 UI 展示） */
export const JUDGMENT_RULE = {
  order: ['精准', '会意', '会心'],
  preciseMiss: '未精准命中 → 仅可能触发会意（按最大攻×1.35）或擦伤（灰字，按最小攻结算）',
  preciseHit: '精准命中 → 先判会意（橙字，最大攻×1.35），未触发再判会心（黄字，攻击随机×1.5）',
  critCrowd: '会心+会意 >100% 时会意按比例挤占会心（对依赖会心的流派为负收益）',
}
