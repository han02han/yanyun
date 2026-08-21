import type { StatKey } from './types'
import type { AttrType } from './schools'

/**
 * 武学数据（玩家确认中文名 ↔ 日服 WWM-METRICS 数据映射）。
 *
 * 每个流派 = 2 个武学；武学提供：
 *  - 固定加成：本系属攻 +80~160（110 级待校正）
 *  - 派生公式：linear_capped_rung —— 加成 = maxBoost × min(来源属性/阈值, 1)
 *    阈值常量：225 = 敏/势系；268 = 小本系属攻系；536 = 大本系属攻系
 *  - 对应武学增效词条（dmgStat：只有当前武学匹配的词条才生效）
 *  - 专属心法（部分已知：悬身拳法→一醉千秋、断水双诀→飞仙醉言）
 *
 * 数据来源：wwm_audit/data/kongfu.json + kongfu_derived.json（日服），
 * 中文名与流派归属由玩家提供（2026-08-21）。
 */

export interface DerivedFormula {
  /** 来源属性键（raw 聚合值）：agility=敏 / momentum=势 / power=劲 / body=体 / maxBellstrike=大鸣金… */
  from: string
  /** 目标面板键 */
  to: StatKey
  /** 阈值（cap） */
  cap: number
  /** 上限加成（maxBoost） */
  maxBoost: number
}

export interface KongfuDef {
  /** 日服 kongfu id */
  id: string
  /** 中文武学名（玩家确认） */
  name: string
  weaponType: string
  attrType: AttrType
  /** 对应武学增效词条的 stat */
  dmgStat: StatKey
  /** 固定加成：本系属攻（待校正） */
  fixedBonus: { min: number; max: number }
  derived: DerivedFormula[]
  /** 专属心法名（部分待确认） */
  xinfa?: string
}

/** 阈值常量（kongfu_derived._capConstants） */
export const KONGFU_CAPS = {
  stat225: 225,   // 敏/势系
  minAttr268: 268, // 小本系属攻系
  maxAttr536: 536, // 大本系属攻系
}

const B = (min: number, max: number) => ({ min, max })

export const KONGFU: Record<string, KongfuDef> = {
  // ========== 鸣金虹：无名剑法 + 无名枪法 ==========
  '10102': {
    id: '10102', name: '无名剑法', weaponType: '剑', attrType: 'mingjin', dmgStat: 'swordDmg',
    fixedBonus: B(80, 160),
    derived: [
      { from: 'momentum', to: 'maxAtk', cap: KONGFU_CAPS.stat225, maxBoost: 59.4 },
      { from: 'maxMingjin', to: 'wuxiangPierce', cap: KONGFU_CAPS.maxAttr536, maxBoost: 18 },
    ],
  },
  '10202': {
    id: '10202', name: '无名枪法', weaponType: '枪', attrType: 'mingjin', dmgStat: 'spearDmg',
    fixedBonus: B(80, 160),
    derived: [
      { from: 'momentum', to: 'critLike', cap: KONGFU_CAPS.stat225, maxBoost: 0.0337 },
      { from: 'maxMingjin', to: 'attrDmgBonus', cap: KONGFU_CAPS.maxAttr536, maxBoost: 0.09 },
    ],
  },
  // ========== 鸣金影：积矩九剑 + 九曲惊神枪 ==========
  '10101': {
    id: '10101', name: '积矩九剑', weaponType: '剑', attrType: 'mingjin', dmgStat: 'swordDmg',
    fixedBonus: B(80, 160),
    derived: [
      { from: 'power', to: 'critLike', cap: KONGFU_CAPS.stat225, maxBoost: 0.0337 },
      { from: 'maxMingjin', to: 'wuxiangPierce', cap: KONGFU_CAPS.maxAttr536, maxBoost: 18 },
    ],
  },
  '10201': {
    id: '10201', name: '九曲惊神枪', weaponType: '枪', attrType: 'mingjin', dmgStat: 'spearDmg',
    fixedBonus: B(80, 160),
    derived: [
      { from: 'power', to: 'maxAtk', cap: KONGFU_CAPS.stat225, maxBoost: 59.4 },
      { from: 'maxMingjin', to: 'attrDmgBonus', cap: KONGFU_CAPS.maxAttr536, maxBoost: 0.09 },
    ],
  },
  // ========== 牵丝玉：九重春色 + 青山执笔 ==========
  '20601': {
    id: '20601', name: '九重春色', weaponType: '伞', attrType: 'qiansi', dmgStat: 'umbrellaDmg',
    fixedBonus: B(80, 160),
    derived: [
      { from: 'agility', to: 'crit', cap: KONGFU_CAPS.stat225, maxBoost: 0.068 },
      { from: 'minQiansi', to: 'wuxiangPierce', cap: KONGFU_CAPS.minAttr268, maxBoost: 18 },
    ],
  },
  '10302': {
    id: '10302', name: '青山执笔', weaponType: '扇', attrType: 'qiansi', dmgStat: 'fanDmg',
    fixedBonus: B(80, 160),
    derived: [
      { from: 'agility', to: 'minAtk', cap: KONGFU_CAPS.stat225, maxBoost: 59.4 },
      { from: 'minQiansi', to: 'attrDmgBonus', cap: KONGFU_CAPS.minAttr268, maxBoost: 0.09 },
    ],
  },
  // ========== 牵丝霖：明川药典 + 千香引魂蛊（治疗向，固定/派生待校正） ==========
  '20602': {
    id: '20602', name: '明川药典', weaponType: '伞', attrType: 'qiansi', dmgStat: 'umbrellaDmg',
    fixedBonus: B(80, 160),
    derived: [
      { from: 'agility', to: 'minAtk', cap: KONGFU_CAPS.stat225, maxBoost: 59.4 },
      { from: 'minQiansi', to: 'wuxiangPierce', cap: KONGFU_CAPS.minAttr268, maxBoost: 18 },
    ],
  },
  '10301': {
    id: '10301', name: '千香引魂蛊', weaponType: '扇', attrType: 'qiansi', dmgStat: 'fanDmg',
    fixedBonus: B(80, 160),
    derived: [
      { from: 'agility', to: 'crit', cap: KONGFU_CAPS.stat225, maxBoost: 0.068 },
      { from: 'minQiansi', to: 'attrDmgBonus', cap: KONGFU_CAPS.minAttr268, maxBoost: 0.09 },
    ],
  },
  // ========== 裂石威：嗟夫刀法 + 八方风雷枪 ==========
  '20401': {
    id: '20401', name: '嗟夫刀法', weaponType: '陌刀', attrType: 'lieshi', dmgStat: 'saberDmg',
    fixedBonus: B(80, 160),
    derived: [
      { from: 'maxBodyPower', to: 'maxAtk', cap: KONGFU_CAPS.stat225, maxBoost: 59.4 },
      { from: 'minLieshi', to: 'wuxiangPierce', cap: KONGFU_CAPS.minAttr268, maxBoost: 18 },
    ],
  },
  '20103': {
    id: '20103', name: '八方风雷枪', weaponType: '枪', attrType: 'lieshi', dmgStat: 'spearDmg',
    fixedBonus: B(80, 160),
    derived: [
      { from: 'maxBodyPower', to: 'hp', cap: KONGFU_CAPS.stat225, maxBoost: 2250, },
      { from: 'minLieshi', to: 'attrDmgBonus', cap: KONGFU_CAPS.minAttr268, maxBoost: 0.09 },
    ],
  },
  // ========== 裂石钧：斩雪刀法 + 十方破阵 ==========
  '20801': {
    id: '20801', name: '斩雪刀法', weaponType: '横刀', attrType: 'lieshi', dmgStat: 'hengdaoDmg',
    fixedBonus: B(80, 160),
    derived: [
      { from: 'agility', to: 'minAtk', cap: KONGFU_CAPS.stat225, maxBoost: 59.4 },
      { from: 'minLieshi', to: 'attrDmgBonus', cap: KONGFU_CAPS.minAttr268, maxBoost: 0.09 },
    ],
  },
  '20402': {
    id: '20402', name: '十方破阵', weaponType: '陌刀', attrType: 'lieshi', dmgStat: 'saberDmg',
    fixedBonus: B(80, 160),
    derived: [
      { from: 'agility', to: 'crit', cap: KONGFU_CAPS.stat225, maxBoost: 0.068 },
      { from: 'minLieshi', to: 'wuxiangPierce', cap: KONGFU_CAPS.minAttr268, maxBoost: 18 },
    ],
  },
  // ========== 破竹尘：醉梦游春 + 粟子行云 ==========
  '20603': {
    id: '20603', name: '醉梦游春', weaponType: '伞', attrType: 'pozhu', dmgStat: 'umbrellaDmg',
    fixedBonus: B(80, 160),
    derived: [
      { from: 'agility', to: 'minAtk', cap: KONGFU_CAPS.stat225, maxBoost: 59.4 },
      { from: 'minPozhu', to: 'wuxiangPierce', cap: KONGFU_CAPS.minAttr268, maxBoost: 18 },
    ],
  },
  '20702': {
    id: '20702', name: '粟子行云', weaponType: '绳镖', attrType: 'pozhu', dmgStat: 'ropeDartDmg',
    fixedBonus: B(80, 160),
    derived: [
      { from: 'agility', to: 'crit', cap: KONGFU_CAPS.stat225, maxBoost: 0.068 },
      { from: 'minPozhu', to: 'attrDmgBonus', cap: KONGFU_CAPS.minAttr268, maxBoost: 0.09 },
    ],
  },
  // ========== 破竹风：泥犁三垢 + 粟子游尘 ==========
  '20501': {
    id: '20501', name: '泥犁三垢', weaponType: '双刀', attrType: 'pozhu', dmgStat: 'twinBladeDmg',
    fixedBonus: B(80, 160),
    derived: [
      { from: 'agility', to: 'minAtk', cap: KONGFU_CAPS.stat225, maxBoost: 59.4 },
      { from: 'minPozhu', to: 'wuxiangPierce', cap: KONGFU_CAPS.minAttr268, maxBoost: 18 },
    ],
  },
  '20701': {
    id: '20701', name: '粟子游尘', weaponType: '绳镖', attrType: 'pozhu', dmgStat: 'ropeDartDmg',
    fixedBonus: B(80, 160),
    derived: [
      { from: 'agility', to: 'crit', cap: KONGFU_CAPS.stat225, maxBoost: 0.068 },
      { from: 'minPozhu', to: 'attrDmgBonus', cap: KONGFU_CAPS.minAttr268, maxBoost: 0.09 },
    ],
  },
  // ========== 破竹鸢：天志垂象 + 千机索天 ==========
  '20901': {
    id: '20901', name: '天志垂象', weaponType: '拳甲', attrType: 'pozhu', dmgStat: 'fistDmg',
    fixedBonus: B(80, 160),
    derived: [
      { from: 'agility', to: 'minAtk', cap: KONGFU_CAPS.stat225, maxBoost: 59.4 },
      { from: 'minPozhu', to: 'attrDmgBonus', cap: KONGFU_CAPS.minAttr268, maxBoost: 0.09 },
    ],
  },
  '20703': {
    id: '20703', name: '千机索天', weaponType: '绳镖', attrType: 'pozhu', dmgStat: 'ropeDartDmg',
    fixedBonus: B(80, 160),
    derived: [
      { from: 'agility', to: 'crit', cap: KONGFU_CAPS.stat225, maxBoost: 0.068 },
      { from: 'minPozhu', to: 'wuxiangPierce', cap: KONGFU_CAPS.minAttr268, maxBoost: 18 },
    ],
  },
  // ========== 破竹樽：悬身拳法 + 断水双诀 ==========
  '20902': {
    id: '20902', name: '悬身拳法', weaponType: '拳甲', attrType: 'pozhu', dmgStat: 'fistDmg',
    fixedBonus: B(80, 160),
    derived: [
      { from: 'agility', to: 'minAtk', cap: KONGFU_CAPS.stat225, maxBoost: 59.4 },
      { from: 'minPozhu', to: 'attrDmgBonus', cap: KONGFU_CAPS.minAttr268, maxBoost: 0.09 },
    ],
    xinfa: '一醉千秋',
  },
  '20503': {
    id: '20503', name: '断水双诀', weaponType: '双刀', attrType: 'pozhu', dmgStat: 'twinBladeDmg',
    fixedBonus: B(80, 160),
    derived: [
      { from: 'agility', to: 'crit', cap: KONGFU_CAPS.stat225, maxBoost: 0.068 },
      { from: 'minPozhu', to: 'wuxiangPierce', cap: KONGFU_CAPS.minAttr268, maxBoost: 18 },
    ],
    xinfa: '飞仙醉言',
  },
}

/** 流派 → 两个武学 id（牵丝翊：文动霓裳/杏游草野 无数据，待补） */
export const SCHOOL_KONGFU: Record<string, { k1: string; k2: string }> = {
  'mingjin-hong': { k1: '10102', k2: '10202' },
  'mingjin-ying': { k1: '10101', k2: '10201' },
  'qiansi-yu': { k1: '20601', k2: '10302' },
  'qiansi-lin': { k1: '20602', k2: '10301' },
  'qiansi-yi': { k1: '', k2: '' }, // 文动霓裳（鼓）+ 杏游草野（扇）：数据待补
  'lieshi-wei': { k1: '20401', k2: '20103' },
  'lieshi-jun': { k1: '20801', k2: '20402' },
  'pozhu-chen': { k1: '20603', k2: '20702' },
  'pozhu-feng': { k1: '20501', k2: '20701' },
  'pozhu-yuan': { k1: '20901', k2: '20703' },
  'pozhu-zun': { k1: '20902', k2: '20503' },
}

export const getKongfu = (id: string | undefined): KongfuDef | undefined =>
  (id ? KONGFU[id] : undefined)
