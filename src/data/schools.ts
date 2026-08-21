import type { SlotId } from './slots'
import type { StatKey } from './types'

/**
 * 流派（共 11 个，玩家确认）：
 * 裂石：裂石威、裂石钧 ｜ 鸣金：鸣金虹、鸣金影
 * 牵丝：牵丝玉、牵丝霖、牵丝翊 ｜ 破竹：破竹尘、破竹风、破竹鸢、破竹樽
 *
 * 各流派两把武器（玩家提供）：
 * 鸣金虹/影：剑、枪 ｜ 裂石钧：横刀、陌刀 ｜ 裂石威：陌刀、枪
 * 牵丝玉/霖：伞、扇 ｜ 牵丝翊：鼓、扇 ｜ 破竹尘：绳镖、伞 ｜ 破竹风：双刀、绳镖
 * 破竹鸢：拳甲、绳镖 ｜ 破竹樽：拳甲、双刀
 *
 * 属攻本系：4 系属攻（鸣金/破竹/牵丝/裂石）中，当前流派对应的一系按 ×1.5；
 * 无相视为本系（×1.5）。毕业轴目标目前仅破竹尘、牵丝玉有示例数据，其余待补充。
 */

/** 属攻类型（决定 ×1.5 本系判定） */
export type AttrType = 'pozhu' | 'mingjin' | 'qiansi' | 'lieshi'

export const ATTR_TYPE_LABEL: Record<AttrType, string> = {
  pozhu: '破竹',
  mingjin: '鸣金',
  qiansi: '牵丝',
  lieshi: '裂石',
}

export interface SchoolDef {
  id: string
  name: string
  /** 所属武学分支 */
  branch: string
  /** 本系属攻类型 */
  attrType: AttrType
  /** 该流派的两把武器 */
  weapons: string[]
  desc?: string
  /** 理想配装（槽位 -> 装备 id；有数据时可用于载入示例配装） */
  items?: Partial<Record<SlotId, string>>
  /** 理想词条（槽位 -> 词条 id；用于词条命中/质量） */
  affixes?: Partial<Record<SlotId, string[]>>
  /** 毕业轴目标属性（对照面板计算毕业率） */
  targetStats?: Partial<Record<StatKey, number>>
  /** 推荐套装（毕业率"套装一致"对照；来源 leoq7 BEST40 映射，待校正） */
  set?: string
  /** 小外流流派（玩家确认：小外>大外时所有伤害按小外结算，小外攻优先） */
  xiaoWai?: boolean
  /** 推荐心法（玩家确认 + BEST40 数据） */
  xinfa?: string[]
  /** 第 4 灵活位的可选心法 */
  xinfaOptions?: string[]
  /** 最佳弓（leoq7 BEST40 数据） */
  bestBow?: string
  /** 毕业轴基线总伤害（110 阶竞速轴，Temper 核对 Violetta 数据，对应其版本） */
  axisDps?: number
  /** 毕业轴基线每秒秒伤 */
  baselineDps?: number
  /** 流派定音提示（leoq7 数据） */
  dingyinHint?: string
}

/** 有示例配装数据（items 非空）的流派 —— 用于「载入示例配装」 */
export const loadableSchools = (): SchoolDef[] =>
  SCHOOLS.filter((s) => s.items && Object.keys(s.items).length > 0)

/** 示例配装数据（待校正，仅供演示机制） */
const SAMPLE_ITEMS = {
  pozhu: {
    items: {
      weapon1: 'wp_shengbiao',
      weapon2: 'wp_san',
      helm: 'armor_helm',
      chest: 'armor_chest',
      ring: 'armor_ring',
      pendant: 'armor_pendant',
      legs: 'armor_legs',
      wrist: 'armor_wrist',
      bow: 'bow_jingxian',
    },
    affixes: {
      weapon1: ['maxAtk', 'crit', 'bigWuxiang', 'precise'],
      weapon2: ['crit', 'smallWuxiang'],
      ring: ['allSkillDmg', 'critLike', 'attrPozhuBig'],
      pendant: ['allSkillDmg', 'crit', 'attrPozhuBig'],
      helm: ['singleQishu', 'hp', 'crit'],
      chest: ['groupQishu', 'def', 'precise'],
      wrist: ['bossDmg', 'playerDmg'],
      legs: ['bossDmg', 'attrPozhuBig'],
    },
  },
  qiansi: {
    items: {
      weapon1: 'wp_san',
      weapon2: 'wp_shan',
      helm: 'armor_helm',
      chest: 'armor_chest',
      ring: 'armor_ring',
      pendant: 'armor_pendant',
      legs: 'armor_legs',
      wrist: 'armor_wrist',
      bow: 'bow_jingxian',
    },
    affixes: {
      weapon1: ['crit', 'precise', 'bigWuxiang'],
      weapon2: ['crit', 'smallWuxiang'],
      ring: ['allSkillDmg', 'crit', 'attrQiansiBig'],
      pendant: ['allSkillDmg', 'min', 'attrQiansiBig'],
      helm: ['singleQishu', 'hp', 'crit'],
      chest: ['groupQishu', 'def', 'precise'],
      wrist: ['bossDmg', 'def'],
      legs: ['bossDmg', 'hp', 'attrQiansiBig'],
    },
  },
}

export const SCHOOLS: SchoolDef[] = [
  {
    id: 'pozhu-chen', name: '破竹尘', branch: '破竹', attrType: 'pozhu', weapons: ['绳镖', '伞'],
    desc: '示例配装与毕业轴（待校正）', ...SAMPLE_ITEMS.pozhu,
    set: 'xing', xinfa: ['千营一呼', '绳舟行木', '易水歌'], xinfaOptions: ['大唐歌', '断石之构', '征人归'], bestBow: '会心弓',
    axisDps: 13394742, baselineDps: 132621, dingyinHint: '指定武学技能增伤（按流派武学）',
    targetStats: {
      precise: 0.981,
      crit: 0.8049,
      critLike: 0.0929,
      minAtk: 3982.6,
      maxAtk: 3071.9,
      pierce: 63.5,
      attrMinAtk: 856.8,
      attrMaxAtk: 2096.7,
      allSkillDmg: 0.0852,
      bossDmg: 0.0887,
      critLikeDmg: 0.35,
      skillDmg: 0.32,
      umbrellaDmg: 0.0852,
    },
  },
  {
    id: 'pozhu-feng', name: '破竹风', branch: '破竹', attrType: 'pozhu', weapons: ['双刀', '绳镖'],
    desc: '毕业轴待补充', set: 'gui', xinfa: ['忘川绝响', '心弥泥鱼', '断石之构', '易水歌'], bestBow: '精准弓',
    axisDps: 14311682, baselineDps: 131059,
    targetStats: {
      precise: 0.9965,
      crit: 0.7046,
      critLike: 0.0895,
      minAtk: 3903.8,
      maxAtk: 2944.8,
      pierce: 63.5,
      attrMinAtk: 807.0,
      attrMaxAtk: 2036.7,
      allSkillDmg: 0.0852,
      bossDmg: 0.0887,
      critDmg: 0.544,
      critLikeDmg: 0.35,
      skillDmg: 0.32,
      twinBladeDmg: 0.0852,
    },
  },
  {
    id: 'pozhu-yuan', xiaoWai: true, name: '破竹鸢', branch: '破竹', attrType: 'pozhu', weapons: ['拳甲', '绳镖'],
    desc: '毕业轴待补充', set: 'han', xinfa: ['扶摇直上', '擒天势', '易水歌'], xinfaOptions: ['断石之构', '三穷致知'], bestBow: '精准弓',
    axisDps: 14482689, baselineDps: 143677, dingyinHint: '天志垂象·蓄力技增伤',
    targetStats: {
      precise: 1.0063,
      crit: 0.7706,
      critLike: 0.0929,
      minAtk: 3994.7,
      maxAtk: 3071.9,
      attrMinAtk: 856.8,
      attrMaxAtk: 2096.7,
      allSkillDmg: 0.0852,
      bossDmg: 0.0887,
      critDmg: 0.54,
      critLikeDmg: 0.35,
      skillDmg: 0.32,
      fistDmg: 0.0852,
    },
  },
  {
    id: 'pozhu-zun', xiaoWai: true, name: '破竹樽', branch: '破竹', attrType: 'pozhu', weapons: ['拳甲', '双刀'],
    desc: '毕业轴待补充', set: 'qing', xinfa: ['一醉千秋', '飞仙醉言', '燕别云岫', '易水歌'], bestBow: '会心弓',
    axisDps: 14970844, baselineDps: 148520, dingyinHint: '酩酊技定音',
    targetStats: {
      precise: 0.9859,
      crit: 0.7992,
      critLike: 0.0929,
      minAtk: 4031.1,
      maxAtk: 3144.7,
      attrMinAtk: 856.8,
      attrMaxAtk: 1890.3,
      allSkillDmg: 0.0852,
      bossDmg: 0.0887,
      critDmg: 0.54,
      critLikeDmg: 0.35,
      skillDmg: 0.32,
      fistDmg: 0.0852,
    },
  },
  {
    id: 'qiansi-yu', name: '牵丝玉', branch: '牵丝', attrType: 'qiansi', weapons: ['伞', '扇'],
    desc: '示例配装与毕业轴（待校正）', ...SAMPLE_ITEMS.qiansi,
    set: 'yan', xinfa: ['花上月令', '纵地摘星', '易水歌'], xinfaOptions: ['断石之构', '所恨年年', '春雷篇', '征人归'], bestBow: '精准弓',
    axisDps: 15919658, baselineDps: 156075, dingyinHint: '九重春色·特殊技增伤',
    targetStats: {
      precise: 1,
      crit: 0.7715,
      critLike: 0.0929,
      minAtk: 2155.4,
      maxAtk: 5646,
      pierce: 63.5,
      attrMinAtk: 856.8,
      attrMaxAtk: 1616.1,
      allSkillDmg: 0.0852,
      bossDmg: 0.0887,
      critLikeDmg: 0.35,
      skillDmg: 0.32,
      umbrellaDmg: 0.0852,
    },
  },
  {
    id: 'qiansi-lin', name: '牵丝霖', branch: '牵丝', attrType: 'qiansi', weapons: ['伞', '扇'],
    desc: '毕业轴待补充', set: 'han', axisDps: 1519700, baselineDps: 101313, dingyinHint: '明川药典·治疗技增疗',
    xinfa: ['君臣药', '四时无常', '易水歌'], xinfaOptions: ['征人归', '怒斩马', '杏花不见', '千丝蛊'],
    targetStats: {
      precise: 0.9859,
      crit: 0.8049,
      critLike: 0.0929,
      attrMinAtk: 738.0,
      attrMaxAtk: 2096.7,
      bossDmg: 0.0887,
      critLikeDmg: 0.35,
      skillDmg: 0.32,
      umbrellaDmg: 0.0887,
    },
  },
  {
    id: 'qiansi-yi', xiaoWai: true, name: '牵丝翊', branch: '牵丝', attrType: 'qiansi', weapons: ['鼓', '扇'],
    desc: '毕业轴待补充', set: 'yun', xinfa: ['相和歌', '风知意', '易水歌'], xinfaOptions: ['断石之构', '弦墨篇'], bestBow: '会心弓',
    axisDps: 10763814, baselineDps: 106784, dingyinHint: '鼓特殊技',
    targetStats: {
      precise: 0.9859,
      crit: 0.7992,
      critLike: 0.0929,
      minAtk: 4031.1,
      maxAtk: 3144.7,
      pierce: 58.4,
      attrMinAtk: 856.8,
      attrMaxAtk: 1993.5,
      allSkillDmg: 0.0852,
      bossDmg: 0.0887,
      critLikeDmg: 0.35,
      skillDmg: 0.32,
      drumDmg: 0.0852,
    },
  },
  {
    id: 'mingjin-hong', name: '鸣金虹', branch: '鸣金', attrType: 'mingjin', weapons: ['剑', '枪'],
    desc: '毕业轴待补充', set: 'dou', xinfa: ['无名心法', '千山法', '威猛歌'], xinfaOptions: ['易水歌', '凝神章'], bestBow: '会意弓',
    axisDps: 13154257, baselineDps: 120571,
    targetStats: {
      precise: 0.8271,
      crit: 0.1789,
      critLike: 0.3929,
      minAtk: 1722.4,
      maxAtk: 6332.4,
      pierce: 63.5,
      attrMinAtk: 835.9,
      attrMaxAtk: 1574.2,
      allSkillDmg: 0.0852,
      bossDmg: 0.0887,
      critDmg: 0.5,
      critLikeDmg: 0.402,
      skillDmg: 0.32,
      swordDmg: 0.0852,
    },
  },
  {
    id: 'mingjin-ying', name: '鸣金影', branch: '鸣金', attrType: 'mingjin', weapons: ['剑', '枪'],
    desc: '毕业轴待补充', set: 'fei', xinfa: ['剑气纵横', '凝神章', '逐狼心经', '易水歌'], bestBow: '会意弓',
    axisDps: 15082271, baselineDps: 136863,
    targetStats: {
      precise: 0.8271,
      crit: 0.1789,
      critLike: 0.3929,
      minAtk: 1743.2,
      maxAtk: 6189.6,
      pierce: 63.5,
      attrMinAtk: 807.0,
      attrMaxAtk: 1516.5,
      allSkillDmg: 0.0852,
      bossDmg: 0.0887,
      critDmg: 0.5,
      critLikeDmg: 0.402,
      skillDmg: 0.32,
      swordDmg: 0.0852,
    },
  },
  {
    id: 'lieshi-wei', name: '裂石威', branch: '裂石', attrType: 'lieshi', weapons: ['陌刀', '枪'],
    desc: '毕业轴待补充', set: 'yu', xinfa: ['山河绝韵', '穿喉诀', '抗造大法', '易水歌'], bestBow: '精准弓',
    axisDps: 14350166, baselineDps: 141520, dingyinHint: '嗟夫刀法·蓄力技增伤',
    targetStats: {
      precise: 1.0116,
      crit: 0.5524,
      critLike: 0.1524,
      minAtk: 1858.7,
      maxAtk: 6040.8,
      attrMinAtk: 918.9,
      attrMaxAtk: 1740.2,
      allSkillDmg: 0.0852,
      bossDmg: 0.0887,
      critLikeDmg: 0.35,
      skillDmg: 0.32,
      saberDmg: 0.0852,
    },
  },
  {
    id: 'lieshi-jun', xiaoWai: true, name: '裂石钧', branch: '裂石', attrType: 'lieshi', weapons: ['横刀', '陌刀'],
    desc: '毕业轴待补充', set: 'duanyue',
    xinfa: ['霜天白夜', '孤忠不辞', '穿喉诀', '易水歌'], bestBow: '会心弓',
    axisDps: 13645386, baselineDps: 134173,
    targetStats: {
      precise: 0.9859,
      crit: 0.7992,
      critLike: 0.0929,
      minAtk: 3994.7,
      maxAtk: 3071.9,
      attrMinAtk: 887.9,
      attrMaxAtk: 2055.4,
      allSkillDmg: 0.0852,
      bossDmg: 0.0887,
      critDmg: 0.54,
      critLikeDmg: 0.35,
      skillDmg: 0.32,
      saberDmg: 0.0852,
    },
  },
]

export const getSchool = (id: string | undefined): SchoolDef | undefined =>
  SCHOOLS.find((s) => s.id === id)
