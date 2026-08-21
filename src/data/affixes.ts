import type { SlotId } from './slots'
import type { StatKey } from './types'
import type { AttrType } from './schools'

export type AffixCategory = '输出' | '防御' | '生存'

export interface AffixDef {
  id: string
  name: string
  category: AffixCategory
  /** 修正的面板键 */
  stat: StatKey
  /** 词条数值（满值，来源 leoq7 毕业率管理器 MAX_VALUES，110 阶参考） */
  value: number
  /** 部位限制；null 表示不限部位 */
  slotRestriction?: SlotId[]
  /** 属攻类型（决定本系 ×1.5 判定） */
  attrType?: AttrType
  /** 武器武学增效限定的武器种类（武器只出自己种类的增） */
  weaponType?: string
  /** 备注 */
  note?: string
}

/**
 * 调律词条库（玩家确认 + Temper/leoq7 核对数据，满值=110 阶调律满值，参考 reference/constants.json）。
 * 部位规则：武器→无相/本种类武学增效；环佩→全武学增效；冠胄/胸甲→单体类/群体类奇术增伤；
 * 胫甲/腕甲→对首领单位增伤/对玩家单位增效；六件→属攻（大小破竹/鸣金/牵丝/裂石）；
 * 无「武器增伤」词条（玩家确认），武器侧增伤只有武学增效。体/御满值同劲敏势（76.8）。
 */
export const AFFIXES: AffixDef[] = [
  // 通用输出
  { id: 'allSkillDmg', name: '全武学增效',   category: '输出', stat: 'allSkillDmg', value: 0.049, slotRestriction: ['ring', 'pendant'], note: '满值 4.9%（Temper 08-14 核对）' },
  { id: 'bossDmg',     name: '对首领单位增伤', category: '输出', stat: 'bossDmg', value: 0.051, slotRestriction: ['legs', 'wrist'], note: '满值 5.1%（Temper 08-14 核对）' },
  { id: 'singleQishu', name: '单体类奇术增伤', category: '输出', stat: 'singleQishuDmg', value: 0.154, slotRestriction: ['helm', 'chest'], note: '满值 15.4%（Temper 08-14 核对）' },
  { id: 'groupQishu',  name: '群体类奇术增伤', category: '输出', stat: 'groupQishuDmg',  value: 0.154, slotRestriction: ['helm', 'chest'], note: '满值 15.4%（Temper 08-14 核对）' },
  { id: 'playerDmg',   name: '对玩家单位增效', category: '输出', stat: 'playerDmg', value: 0.051, slotRestriction: ['legs', 'wrist'], note: '满值 5.1%（PVP，Temper 08-14）' },
  // 指定武学增效 + 武器武学增效（按武器种类）
  { id: 'wSwordDmg',   name: '剑武学增效',   category: '输出', stat: 'swordDmg',   weaponType: '剑', value: 0.098, note: '满值 9.8%（Temper 08-14 核对）' },
  { id: 'wSpearDmg',   name: '枪武学增效',   category: '输出', stat: 'spearDmg',   weaponType: '枪', value: 0.098, note: '满值 9.8%（Temper 08-14 核对）' },
  { id: 'wUmbrellaDmg', name: '伞武学增效',  category: '输出', stat: 'umbrellaDmg', weaponType: '伞', value: 0.098, note: '满值 9.8%（Temper 08-14 核对）' },
  { id: 'wFanDmg',     name: '扇武学增效',   category: '输出', stat: 'fanDmg',     weaponType: '扇', value: 0.098, note: '满值 9.8%（Temper 08-14 核对）' },
  { id: 'wRopeDartDmg', name: '绳镖武学增效', category: '输出', stat: 'ropeDartDmg', weaponType: '绳镖', value: 0.098, note: '满值 9.8%（Temper 08-14 核对）' },
  { id: 'wTwinBladeDmg', name: '双刀武学增效', category: '输出', stat: 'twinBladeDmg', weaponType: '双刀', value: 0.098, note: '满值 9.8%（Temper 08-14 核对）' },
  { id: 'wSaberDmg',   name: '陌刀武学增效', category: '输出', stat: 'saberDmg',   weaponType: '陌刀', value: 0.098, note: '满值 9.8%（Temper 08-14 核对）' },
  { id: 'wHengdaoDmg', name: '横刀武学增效', category: '输出', stat: 'hengdaoDmg', weaponType: '横刀', value: 0.098, note: '满值 9.8%（Temper 08-14 核对）' },
  { id: 'wFistDmg',    name: '拳甲武学增效', category: '输出', stat: 'fistDmg',    weaponType: '拳甲', value: 0.098, note: '满值 9.8%（Temper 08-14 核对）' },
  { id: 'wDrumDmg',    name: '鼓武学增效',   category: '输出', stat: 'drumDmg',    weaponType: '鼓', value: 0.098, note: '满值 9.8%（Temper 08-14 核对）' },
  // 无相（武器专属，等于本系属攻，恒 ×1.5）
  { id: 'bigWuxiang',   name: '最大无相攻击', category: '输出', stat: 'attrMaxAtk', value: 68.8, slotRestriction: ['weapon1', 'weapon2'], note: '满值 68.8，等于本系属攻' },
  { id: 'smallWuxiang', name: '最小无相攻击', category: '输出', stat: 'attrMinAtk', value: 68.8, slotRestriction: ['weapon1', 'weapon2'], note: '满值 68.8，等于本系属攻' },
  // 属攻（六件防具/饰品：冠胄/胸甲/环/佩/胫甲/腕甲）
  { id: 'attrPozhuBig',   name: '最大破竹攻击', category: '输出', stat: 'attrMaxAtk', value: 68.8, attrType: 'pozhu', slotRestriction: ['helm', 'chest', 'ring', 'pendant', 'legs', 'wrist'], note: '满值 68.8' },
  { id: 'attrPozhuSmall', name: '最小破竹攻击', category: '输出', stat: 'attrMinAtk', value: 68.8, attrType: 'pozhu', slotRestriction: ['helm', 'chest', 'ring', 'pendant', 'legs', 'wrist'], note: '满值 68.8' },
  { id: 'attrMingjinBig',   name: '最大鸣金攻击', category: '输出', stat: 'attrMaxAtk', value: 68.8, attrType: 'mingjin', slotRestriction: ['helm', 'chest', 'ring', 'pendant', 'legs', 'wrist'], note: '满值 68.8' },
  { id: 'attrMingjinSmall', name: '最小鸣金攻击', category: '输出', stat: 'attrMinAtk', value: 68.8, attrType: 'mingjin', slotRestriction: ['helm', 'chest', 'ring', 'pendant', 'legs', 'wrist'], note: '满值 68.8' },
  { id: 'attrQiansiBig',   name: '最大牵丝攻击', category: '输出', stat: 'attrMaxAtk', value: 68.8, attrType: 'qiansi', slotRestriction: ['helm', 'chest', 'ring', 'pendant', 'legs', 'wrist'], note: '满值 68.8' },
  { id: 'attrQiansiSmall', name: '最小牵丝攻击', category: '输出', stat: 'attrMinAtk', value: 68.8, attrType: 'qiansi', slotRestriction: ['helm', 'chest', 'ring', 'pendant', 'legs', 'wrist'], note: '满值 68.8' },
  { id: 'attrLieshiBig',   name: '最大裂石攻击', category: '输出', stat: 'attrMaxAtk', value: 68.8, attrType: 'lieshi', slotRestriction: ['helm', 'chest', 'ring', 'pendant', 'legs', 'wrist'], note: '满值 68.8' },
  { id: 'attrLieshiSmall', name: '最小裂石攻击', category: '输出', stat: 'attrMinAtk', value: 68.8, attrType: 'lieshi', slotRestriction: ['helm', 'chest', 'ring', 'pendant', 'legs', 'wrist'], note: '满值 68.8' },
  // 三率 / 外攻 / 五维（满值来源 MAX_VALUES）
  { id: 'critLike',    name: '会意率',     category: '输出', stat: 'critLike', value: 0.07, note: '满值 7%（Temper 08-14 核对）' },
  { id: 'crit',        name: '会心率',     category: '输出', stat: 'crit',     value: 0.14, note: '满值 14%（Temper 08-14 核对）' },
  { id: 'precise',     name: '精准率',     category: '输出', stat: 'precise',  value: 0.124, note: '满值 12.4%（Temper 08-14 核对）' },
  { id: 'maxAtk',      name: '最大外功攻击', category: '输出', stat: 'maxAtk', value: 121.4, note: '满值 121.4（Temper 08-14 核对）' },
  { id: 'minAtk',      name: '最小外功攻击', category: '输出', stat: 'minAtk', value: 121.4, note: '满值 121.4（Temper 08-14 核对）' },
  { id: 'jin',         name: '劲', category: '输出', stat: 'jin', value: 76.8, note: '满值 76.8（Temper 08-14 核对）' },
  { id: 'min',         name: '敏', category: '输出', stat: 'min', value: 76.8, note: '满值 76.8（Temper 08-14 核对）' },
  { id: 'shi',         name: '势', category: '输出', stat: 'shi', value: 76.8, note: '满值 76.8（Temper 08-14 核对）' },
  // 生存/防御（玩家确认在调律池；数值占位待校正）
  { id: 'hp',          name: '气血上限',   category: '生存', stat: 'hp', value: 300, note: '数值待校正' },
  { id: 'def',         name: '外功防御',   category: '防御', stat: 'def', value: 12,  note: '数值待校正' },
  { id: 'ti',          name: '体',         category: '生存', stat: 'ti', value: 76.8, note: '满值同劲敏势 76.8' },
  { id: 'yu',          name: '御',         category: '防御', stat: 'yu', value: 76.8, note: '满值同劲敏势 76.8' },
  // 定音·通用（左四件：武器1/武器2/环/佩）
  { id: 'dyPierce',      name: '外攻穿透', category: '输出', stat: 'pierce', value: 16.8, slotRestriction: ['weapon1', 'weapon2', 'ring', 'pendant'], note: '定音满值 16.8' },
  { id: 'dyWuxiangPierce', name: '无相穿透', category: '输出', stat: 'wuxiangPierce', value: 17.4, slotRestriction: ['weapon1', 'weapon2', 'ring', 'pendant'], note: '定音满值 17.4' },
  { id: 'dyDefResist',   name: '外攻抗性', category: '防御', stat: 'defResist', value: 16.8, slotRestriction: ['weapon1', 'weapon2', 'ring', 'pendant'], note: '定音词条' },
  // 定音·流派（右四件：冠胄/胸甲/胫甲/腕甲，仅「指定武学技能增伤」，玩家确认）
  { id: 'dySkillDmg',    name: '指定武学技能增伤', category: '输出', stat: 'skillDmg', value: 0.092, slotRestriction: ['helm', 'chest', 'legs', 'wrist'], note: '定音满值 9.2%（按流派武学）' },
]

/**
 * 第 1 条调律词条（主调律）的部位池（玩家确认）：
 * 武器1/2：大小外、大小无相、敏、势
 * 环/佩：大小外
 * 头（冠胄）/胸（胸甲）：三率、气血、外防、体、御
 * 手（腕甲）/腿（胫甲）：同头胸 + 劲
 * 第 2-5 条从完整词条池洗入（可与第 1 条重复，彼此不能重复）。
 */
export const FIRST_AFFIX_POOLS: Partial<Record<SlotId, string[]>> = {
  weapon1: ['maxAtk', 'minAtk', 'bigWuxiang', 'smallWuxiang', 'min', 'shi'],
  weapon2: ['maxAtk', 'minAtk', 'bigWuxiang', 'smallWuxiang', 'min', 'shi'],
  ring: ['maxAtk', 'minAtk'],
  pendant: ['maxAtk', 'minAtk'],
  helm: ['crit', 'critLike', 'precise', 'hp', 'def', 'ti', 'yu'],
  chest: ['crit', 'critLike', 'precise', 'hp', 'def', 'ti', 'yu'],
  wrist: ['crit', 'critLike', 'precise', 'hp', 'def', 'ti', 'yu', 'jin'],
  legs: ['crit', 'critLike', 'precise', 'hp', 'def', 'ti', 'yu', 'jin'],
}

export const getAffix = (id: string): AffixDef | undefined =>
  AFFIXES.find((a) => a.id === id)

/** 词条在指定槽位是否可用（受部位限制约束） */
export const affixAllowedIn = (affixId: string, slot: SlotId): boolean => {
  const a = getAffix(affixId)
  if (!a) return false
  if (!a.slotRestriction) return true
  return a.slotRestriction.includes(slot)
}
