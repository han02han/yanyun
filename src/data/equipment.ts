import type { SlotId } from './slots'
import type { Stats } from './types'

/**
 * 品阶（玩家确认）：只有 紫 / 金。
 * 品阶只影响**主词条**数值（主词条只跟槽位 + 紫金品质有关，与武器种类无关）。
 * 数据版本：110 级（玩家确认；100/105 级数值已不适用）。
 */
export type Quality = 'purple' | 'gold'

export const QUALITY_LABEL: Record<Quality, string> = {
  purple: '紫',
  gold: '金',
}

/** 武器种类（玩家确认，共 10 种） */
export const WEAPON_TYPES = ['拳甲', '陌刀', '双刀', '横刀', '鼓', '绳镖', '伞', '扇', '枪', '剑'] as const

/** 主词条数值（玩家确认，110 级装备；紫装差值来自 leoq7 purpleBaseAttackPenalty） */
const MAIN_AFFIX: Record<Quality, Partial<Stats>> = {
  // 金武器：100 小外 + 232 大外；紫武器：小外差 10、大外差 23
  gold: { minAtk: 100, maxAtk: 232 },
  purple: { minAtk: 90, maxAtk: 209 },
}

export interface EquipmentItem {
  id: string
  /** 可装备的槽位（武器可同时用于武器1/武器2） */
  slots: SlotId[]
  name: string
  /** 品阶（玩家确认：只有 紫/金；**弓不分金紫**，可缺省） */
  quality?: Quality
  level: number
  /** 武器种类（仅武器槽位装备） */
  weaponType?: string
  /** 主词条：无品阶装备（弓）直接给数值；有品阶按紫金取值；比率类为小数 */
  innate: Partial<Stats> | Partial<Record<Quality, Partial<Stats>>>
}

/** 取装备当前品阶的主词条（弓无品阶，直接返回数值） */
export const mainAffixOf = (item: EquipmentItem): Partial<Stats> | undefined => {
  if (!item.quality) return item.innate as Partial<Stats>
  return (item.innate as Partial<Record<Quality, Partial<Stats>>>)[item.quality]
}

/**
 * 装备库 —— 主词条为玩家确认值（110 级），其余为占位数据待校正。
 * 已确认：三把弓（饮羽/惊弦/追影）、武器主词条（100/232）、环（133小外）、佩（199大外）。
 */
export const EQUIPMENT: EquipmentItem[] = [
  // ================= 弓（玩家确认的真实数据；弓不分金紫） =================
  {
    id: 'bow_yinyu', slots: ['bow'], name: '饮羽', level: 110,
    innate: { precise: 0.062 },
  },
  {
    id: 'bow_jingxian', slots: ['bow'], name: '惊弦', level: 110,
    innate: { crit: 0.07 },
  },
  {
    id: 'bow_zhuijing', slots: ['bow'], name: '追影', level: 110,
    innate: { critLike: 0.035 },
  },

  // ================= 武器（10 种；主词条只跟位置+品质有关，与种类无关） =================
  { id: 'wp_quanjia',   slots: ['weapon1', 'weapon2'], name: '拳甲', weaponType: '拳甲', quality: 'gold', level: 110, innate: MAIN_AFFIX, },
  { id: 'wp_modao',     slots: ['weapon1', 'weapon2'], name: '陌刀', weaponType: '陌刀', quality: 'gold', level: 110, innate: MAIN_AFFIX, },
  { id: 'wp_shuangdao', slots: ['weapon1', 'weapon2'], name: '双刀', weaponType: '双刀', quality: 'gold', level: 110, innate: MAIN_AFFIX, },
  { id: 'wp_hengdao',   slots: ['weapon1', 'weapon2'], name: '横刀', weaponType: '横刀', quality: 'gold', level: 110, innate: MAIN_AFFIX, },
  { id: 'wp_gu',        slots: ['weapon1', 'weapon2'], name: '鼓',   weaponType: '鼓', quality: 'gold', level: 110, innate: MAIN_AFFIX, },
  { id: 'wp_shengbiao', slots: ['weapon1', 'weapon2'], name: '绳镖', weaponType: '绳镖', quality: 'gold', level: 110, innate: MAIN_AFFIX, },
  { id: 'wp_san',       slots: ['weapon1', 'weapon2'], name: '伞',   weaponType: '伞', quality: 'gold', level: 110, innate: MAIN_AFFIX, },
  { id: 'wp_shan',      slots: ['weapon1', 'weapon2'], name: '扇',   weaponType: '扇', quality: 'gold', level: 110, innate: MAIN_AFFIX, },
  { id: 'wp_qiang',     slots: ['weapon1', 'weapon2'], name: '枪',   weaponType: '枪', quality: 'gold', level: 110, innate: MAIN_AFFIX, },
  { id: 'wp_jian',      slots: ['weapon1', 'weapon2'], name: '剑',   weaponType: '剑', quality: 'gold', level: 110, innate: MAIN_AFFIX, },
  { id: 'wp_quanjia_p', slots: ['weapon1', 'weapon2'], name: '拳甲', weaponType: '拳甲', quality: 'purple', level: 110, innate: MAIN_AFFIX, },
  { id: 'wp_modao_p', slots: ['weapon1', 'weapon2'], name: '陌刀', weaponType: '陌刀', quality: 'purple', level: 110, innate: MAIN_AFFIX, },
  { id: 'wp_shuangdao_p', slots: ['weapon1', 'weapon2'], name: '双刀', weaponType: '双刀', quality: 'purple', level: 110, innate: MAIN_AFFIX, },
  { id: 'wp_hengdao_p', slots: ['weapon1', 'weapon2'], name: '横刀', weaponType: '横刀', quality: 'purple', level: 110, innate: MAIN_AFFIX, },
  { id: 'wp_gu_p', slots: ['weapon1', 'weapon2'], name: '鼓', weaponType: '鼓', quality: 'purple', level: 110, innate: MAIN_AFFIX, },
  { id: 'wp_shengbiao_p', slots: ['weapon1', 'weapon2'], name: '绳镖', weaponType: '绳镖', quality: 'purple', level: 110, innate: MAIN_AFFIX, },
  { id: 'wp_san_p', slots: ['weapon1', 'weapon2'], name: '伞', weaponType: '伞', quality: 'purple', level: 110, innate: MAIN_AFFIX, },
  { id: 'wp_shan_p', slots: ['weapon1', 'weapon2'], name: '扇', weaponType: '扇', quality: 'purple', level: 110, innate: MAIN_AFFIX, },
  { id: 'wp_qiang_p', slots: ['weapon1', 'weapon2'], name: '枪', weaponType: '枪', quality: 'purple', level: 110, innate: MAIN_AFFIX, },
  { id: 'wp_jian_p', slots: ['weapon1', 'weapon2'], name: '剑', weaponType: '剑', quality: 'purple', level: 110, innate: MAIN_AFFIX, },

  // ================= 环 / 佩（主词条玩家确认：环 133 小外、佩 199 大外） =================
  {
    id: 'armor_ring', slots: ['ring'], name: '环', quality: 'gold', level: 110,
    innate: { gold: { minAtk: 133 }, purple: { minAtk: 120 } },
  },
  {
    id: 'armor_ring_p', slots: ['ring'], name: '环', quality: 'purple', level: 110,
    innate: { gold: { minAtk: 133 }, purple: { minAtk: 120 } },
  },
  {
    id: 'armor_pendant', slots: ['pendant'], name: '佩', quality: 'gold', level: 110,
    innate: { gold: { maxAtk: 199 }, purple: { maxAtk: 179 } },
  },
  {
    id: 'armor_pendant_p', slots: ['pendant'], name: '佩', quality: 'purple', level: 110,
    innate: { gold: { maxAtk: 199 }, purple: { maxAtk: 179 } },
  },

  // ================= 右边四件（冠胄/胸甲/胫甲/腕甲：气血防御类，数值玩家确认） =================
  {
    id: 'armor_helm', slots: ['helm'], name: '冠胄', quality: 'gold', level: 110,
    innate: { gold: { hp: 8225, def: 29 }, purple: { hp: 7402, def: 27 } },
  },
  {
    id: 'armor_helm_p', slots: ['helm'], name: '冠胄', quality: 'purple', level: 110,
    innate: { gold: { hp: 8225, def: 29 }, purple: { hp: 7402, def: 27 } },
  },
  {
    id: 'armor_chest', slots: ['chest'], name: '胸甲', quality: 'gold', level: 110,
    innate: { gold: { hp: 16449, def: 29 }, purple: { hp: 14804, def: 27 } },
  },
  {
    id: 'armor_chest_p', slots: ['chest'], name: '胸甲', quality: 'purple', level: 110,
    innate: { gold: { hp: 16449, def: 29 }, purple: { hp: 14804, def: 27 } },
  },
  {
    id: 'armor_legs', slots: ['legs'], name: '胫甲', quality: 'gold', level: 110,
    innate: { gold: { hp: 8225, def: 58 }, purple: { hp: 7402, def: 53 } },
  },
  {
    id: 'armor_legs_p', slots: ['legs'], name: '胫甲', quality: 'purple', level: 110,
    innate: { gold: { hp: 8225, def: 58 }, purple: { hp: 7402, def: 53 } },
  },
  {
    id: 'armor_wrist_g', slots: ['wrist'], name: '腕甲', quality: 'gold', level: 110,
    innate: { gold: { hp: 8225, def: 29 }, purple: { hp: 7402, def: 27 } },
  },
  {
    id: 'armor_wrist', slots: ['wrist'], name: '腕甲', quality: 'purple', level: 110,
    innate: { gold: { hp: 8225, def: 29 }, purple: { hp: 7402, def: 27 } },
  },
]

export const getEquipment = (id: string | undefined): EquipmentItem | undefined =>
  EQUIPMENT.find((e) => e.id === id)

/** 按槽位取可用装备 */
export const equipmentBySlot = (slot: SlotId): EquipmentItem[] =>
  EQUIPMENT.filter((e) => e.slots.includes(slot))
