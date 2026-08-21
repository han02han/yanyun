import { FORMULAS } from '../data/formulas'
import type { SlotId } from '../data/slots'
import { getEquipment, mainAffixOf } from '../data/equipment'
import { getAffix } from '../data/affixes'
import { getSet, type SetDef } from '../data/sets'
import { getSchool, type SchoolDef } from '../data/schools'
import { getKongfu, SCHOOL_KONGFU } from '../data/kongfu'
import { getXinfaByName, XINFA_STAT_MAP } from '../data/xinfa'
import type { StatKey, Stats } from '../data/types'

/**
 * 当前配装：
 * - items：槽位 -> 装备 id
 * - chosenAffixes：每槽位调律后的 5 个词条
 * - affixRolls：词条滚动质量 0-1（默认 1=满值）
 * - dingyinAffixes：每槽位定音词条（每件 1 个）
 * - set：选用套装（选用制，无件数触发）
 * - school：当前流派（决定属攻本系 ×1.5）
 * - wuku：武库类型（通用=加大小外攻；流派=加对应属攻，数值固定）
 * - affixValues：调律词条实际数值（用户填写；缺省 = 满值，承音装备 = 满值×0.94；不可超上限）
 * - dingyinValues：定音词条实际数值（同上）
 * - chengyin：装备是否承音（词条上限 ×0.94）
 */
export interface Build {
  items: Partial<Record<SlotId, string>>
  chosenAffixes: Partial<Record<SlotId, string[]>>
  affixValues?: Partial<Record<SlotId, Partial<Record<string, number>>>>
  dingyinAffixes?: Partial<Record<SlotId, string[]>>
  dingyinValues?: Partial<Record<SlotId, Partial<Record<string, number>>>>
  set?: string
  school?: string
  /** 第 4 灵活位心法选择 */
  xinfaChoice?: string
  wuku?: string
  chengyin?: Partial<Record<SlotId, boolean>>
}

/** 武库类型：通用 + 4 种流派属攻 */
export type WukuType = 'tongyong' | 'pozhu' | 'mingjin' | 'qiansi' | 'lieshi'

/** 属攻按类型聚合（未乘本系倍率；wuxiang 恒 ×1.5） */
export interface AttrByType {
  pozhu: { min: number; max: number }
  mingjin: { min: number; max: number }
  qiansi: { min: number; max: number }
  lieshi: { min: number; max: number }
  wuxiang: { min: number; max: number }
}

/** 已激活的套装（选用制下为选中的那套） */
export interface ActiveSet {
  id: string
  name: string
  effect: string
}

export interface PanelResult {
  /** 最终面板（已应用五维换算 + 白→黄转换 + 三率截断 + 归一化） */
  panel: Stats
  /** 白字三率（装备/词条聚合值，未衰减） */
  whiteRates: { precise: number; crit: number; critLike: number }
  activeSets: ActiveSet[]
  capped: { precise: boolean; crit: boolean; critLike: boolean }
  /** 是否触发会心/会意 >100% 归一化 */
  normalized: boolean
}

const STAT_KEYS: StatKey[] = [
  'ti', 'yu', 'jin', 'min', 'shi',
  'hp', 'def', 'minAtk', 'maxAtk', 'attrMinAtk', 'attrMaxAtk',
  'precise', 'crit', 'critLike', 'critDmg', 'critLikeDmg', 'attrDmgBonus', 'globalDmg', 'directCrit', 'directCritLike',
  'allSkillDmg', 'weaponDmg', 'bossDmg',
  'singleQishuDmg', 'groupQishuDmg', 'playerDmg',
  'pierce', 'wuxiangPierce', 'defResist',
  'skillDmg', 'chargeDmg', 'specialDmg', 'specSkillDmg',
  'swordDmg', 'spearDmg', 'umbrellaDmg', 'fanDmg', 'ropeDartDmg',
  'twinBladeDmg', 'saberDmg', 'hengdaoDmg', 'fistDmg', 'drumDmg',
]

export function zeroStats(): Stats {
  return {
    ti: 0, yu: 0, jin: 0, min: 0, shi: 0,
    hp: 0, def: 0, minAtk: 0, maxAtk: 0, attrMinAtk: 0, attrMaxAtk: 0,
    precise: 0, crit: 0, critLike: 0, critDmg: 0, critLikeDmg: 0, attrDmgBonus: 0, globalDmg: 0,
    directCrit: 0, directCritLike: 0,
    allSkillDmg: 0, weaponDmg: 0, bossDmg: 0,
    singleQishuDmg: 0, groupQishuDmg: 0, playerDmg: 0,
    pierce: 0, wuxiangPierce: 0, defResist: 0,
    skillDmg: 0, chargeDmg: 0, specialDmg: 0, specSkillDmg: 0,
    swordDmg: 0, spearDmg: 0, umbrellaDmg: 0, fanDmg: 0, ropeDartDmg: 0,
    twinBladeDmg: 0, saberDmg: 0, hengdaoDmg: 0, fistDmg: 0, drumDmg: 0,
  }
}

/** 把部分统计累加到完整统计上（b 只含需要加的部分） */
export function addStats(a: Stats, b: Partial<Stats>): Stats {
  const out = { ...a }
  for (const k of STAT_KEYS) {
    const v = b[k]
    if (typeof v === 'number') out[k] += v
  }
  return out
}

const emptyAttr = (): AttrByType => ({
  pozhu: { min: 0, max: 0 },
  mingjin: { min: 0, max: 0 },
  qiansi: { min: 0, max: 0 },
  lieshi: { min: 0, max: 0 },
  wuxiang: { min: 0, max: 0 },
})

/**
 * 聚合：装备主词条（随紫金品质） + 调律词条 + 定音词条 + 武库 + 选用套装 → 原始统计
 */
export function aggregateBuild(build: Build): { raw: Stats; attrByType: AttrByType; selectedSet: SetDef | null } {
  let s = zeroStats()
  const attrByType = emptyAttr()

  for (const slot of Object.keys(build.items) as SlotId[]) {
    const item = getEquipment(build.items[slot])
    if (!item) continue

    // 主词条（只跟槽位 + 紫金品质有关；弓无品阶直接取数值）
    const innate = mainAffixOf(item)
    if (innate) s = addStats(s, innate)

    // 调律词条（最多 5 个，全部由用户添加）；数值缺省 = 满值（承音装备 = 满值×0.94）
    const affixIds = build.chosenAffixes[slot] ?? []
    for (const aid of affixIds) {
      const aff = getAffix(aid)
      if (!aff) continue
      // 武学增效只有装备对应武器时才生效
      if (aff.weaponType) {
        const equipped = Object.values(build.items)
          .map((i) => getEquipment(i))
          .filter((x): x is NonNullable<typeof x> => !!x)
          .map((x) => x.weaponType)
        if (!aff.weaponType || !equipped.includes(aff.weaponType)) continue
      }
      const maxRef = aff.value * (build.chengyin?.[slot] ? FORMULAS.chengyin : 1)
      const val = build.affixValues?.[slot]?.[aid] ?? maxRef
      if (aff.stat === 'attrMinAtk' || aff.stat === 'attrMaxAtk') {
        const bucket = attrByType[aff.attrType ?? 'wuxiang']
        if (aff.stat === 'attrMinAtk') bucket.min += val
        else bucket.max += val
      } else {
        s = addStats(s, { [aff.stat]: val })
      }
    }

    // 定音词条（每件 1 个，数值可手动填写；不受承音限制，上限恒为满值）
    const dingyinIds = build.dingyinAffixes?.[slot] ?? []
    for (const did of dingyinIds) {
      const aff = getAffix(did)
      if (!aff) continue
      const val = build.dingyinValues?.[slot]?.[did] ?? aff.value
      s = addStats(s, { [aff.stat]: val })
    }
  }

  // 武库（玩家确认数值：通用 186 小外/373 大外；流派武库同数值加对应属攻，×1.5 在 computePanel 生效）
  const wuku = build.wuku
  if (typeof wuku === 'string') {
    const w = FORMULAS.wuku
    if (wuku === 'tongyong') {
      s = addStats(s, { minAtk: w.minAtk, maxAtk: w.maxAtk })
    } else if (wuku in attrByType) {
      attrByType[wuku as keyof AttrByType].min += w.minAtk
      attrByType[wuku as keyof AttrByType].max += w.maxAtk
    }
  }

  // 选用套装（无件数触发，直接生效）
  const selectedSet = build.set ? getSet(build.set) ?? null : null
  if (selectedSet?.stats) s = addStats(s, selectedSet.stats)

  // 武学（按当前流派）：固定加成（本系属攻）+ 派生公式（linear_capped_rung）
  const kongfuIds = build.school ? SCHOOL_KONGFU[build.school] : undefined
  if (kongfuIds) {
    for (const kid of [kongfuIds.k1, kongfuIds.k2]) {
      const kf = getKongfu(kid)
      if (!kf) continue
      const bucket = attrByType[kf.attrType]
      bucket.min += kf.fixedBonus.min
      bucket.max += kf.fixedBonus.max
      for (const d of kf.derived) {
        if (d.to === 'hp') continue // 气血 PVE 无用，不计
        const src = kongfuSource(d.from, s, attrByType)
        if (src === undefined) continue
        s = addStats(s, { [d.to]: d.maxBoost * Math.min(src / d.cap, 1) })
      }
    }
  }

  // 心法（3 固定 + 第 4 灵活位）：常驻面板属性（机制不进面板）
  const schoolDef = build.school ? getSchool(build.school) : undefined
  if (schoolDef?.xinfa?.length) {
    const names = [...schoolDef.xinfa]
    const choice = build.xinfaChoice ?? schoolDef.xinfaOptions?.[0]
    if (choice) names.push(choice)
    for (const n of names) {
      const x = getXinfaByName(n)
      if (!x) continue
      for (const eff of x.stats) applyXinfaStat(s, attrByType, eff)
    }
  }

  return { raw: s, attrByType, selectedSet }
}

/** 心法常驻属性应用（属攻走 attrByType，保持本系 ×1.5 判定） */
function applyXinfaStat(s: Stats, attr: AttrByType, eff: { stat: string; value: number }): void {
  const { stat, value } = eff
  const attrMap: Record<string, keyof AttrByType> = {
    minBellstrike: 'mingjin', maxBellstrike: 'mingjin',
    minStonesplit: 'lieshi', maxStonesplit: 'lieshi',
    minSilkbind: 'qiansi', maxSilkbind: 'qiansi',
    minBamboocut: 'pozhu', maxBamboocut: 'pozhu',
    minVoid: 'wuxiang', maxVoid: 'wuxiang',
  }
  const bucketKey = attrMap[stat]
  if (bucketKey) {
    const bucket = attr[bucketKey]
    if (stat.startsWith('min')) bucket.min += value
    else bucket.max += value
    return
  }
  const key = XINFA_STAT_MAP[stat]
  if (key) s = addStats(s, { [key]: value })
}

/** 武学派生公式的来源属性解析（raw 聚合值） */
function kongfuSource(from: string, s: Stats, attr: AttrByType): number | undefined {
  switch (from) {
    case 'agility': return s.min
    case 'momentum': return s.shi
    case 'power': return s.jin
    case 'maxBodyPower': return Math.max(s.ti, s.jin)
    case 'maxMingjin': return attr.mingjin.max
    case 'minMingjin': return attr.mingjin.min
    case 'maxPozhu': return attr.pozhu.max
    case 'minPozhu': return attr.pozhu.min
    case 'maxQiansi': return attr.qiansi.max
    case 'minQiansi': return attr.qiansi.min
    case 'maxLieshi': return attr.lieshi.max
    case 'minLieshi': return attr.lieshi.min
    default: return undefined
  }
}

/** 五维换算 + 白→黄三率转换 + 三率截断 + 会心/会意归一化 → 最终面板 */
export function toPanel(raw: Stats): Omit<PanelResult, 'activeSets'> {
  const p = { ...raw }
  const w = FORMULAS.wuxing
  const jr = FORMULAS.judgementResistance

  // 五维 → 面板（五维加的是白字）
  // 体/御只影响气血与防御，PVE 无用不计入（玩家确认）；只换算攻击三围
  p.minAtk += raw.jin * w.jin.minAtk + raw.min * w.min.minAtk
  p.maxAtk += raw.jin * w.jin.maxAtk + raw.shi * w.shi.maxAtk
  p.crit += raw.min * w.min.crit
  p.critLike += raw.shi * w.shi.critLike

  // 白→黄：装备/词条/五维加的都是白字，经敌方判定抵抗衰减后才是生效黄字
  const whiteRates = { precise: p.precise, crit: p.crit, critLike: p.critLike }
  const r = jr.resistance
  const baseP = jr.basePrecision
  p.precise = p.precise < baseP ? p.precise : baseP + (p.precise - baseP) / (1 + r)
  p.crit = p.crit / (1 + r)
  p.critLike = p.critLike / (1 + r)
  // 直接会心/会意不衰减（白=黄）
  p.crit += raw.directCrit
  p.critLike += raw.directCritLike

  // 三率截断（黄值上限）
  const caps = FORMULAS.caps
  const capped = {
    precise: p.precise > caps.precise,
    crit: p.crit > caps.crit,
    critLike: p.critLike > caps.critLike,
  }
  p.precise = Math.min(p.precise, caps.precise)
  p.crit = Math.min(p.crit, caps.crit)
  p.critLike = Math.min(p.critLike, caps.critLike)

  // 会心 + 会意 >100% 时按比例归一化（对应"会意挤占会心"）
  let normalized = false
  if (p.crit + p.critLike > 1) {
    const sum = p.crit + p.critLike
    p.crit = p.crit / sum
    p.critLike = p.critLike / sum
    normalized = true
  }

  return { panel: p, whiteRates, capped, normalized }
}

/** 一次配装的完整面板计算入口 */
export function computePanel(build: Build): PanelResult {
  const { raw, attrByType, selectedSet } = aggregateBuild(build)

  // 属攻本系判定：本系/无相 ×1.5，外系 ×1
  const targetType = getSchool(build.school)?.attrType
  const selfMult = FORMULAS.damage.selfAttrMult
  let aMin = 0
  let aMax = 0
  for (const entry of Object.entries(attrByType)) {
    const [t, v] = entry as [keyof AttrByType, { min: number; max: number }]
    const mult = t === 'wuxiang' ? selfMult : t === targetType ? selfMult : 1
    aMin += v.min * mult
    aMax += v.max * mult
  }
  raw.attrMinAtk += aMin
  raw.attrMaxAtk += aMax

  const { panel, whiteRates, capped, normalized } = toPanel(raw)
  const activeSets: ActiveSet[] = selectedSet
    ? [{ id: selectedSet.id, name: selectedSet.name, effect: selectedSet.effect }]
    : []
  return { panel, whiteRates, activeSets, capped, normalized }
}

/** 流派示例配装 → 配装（用于载入示例/对比基准） */
export function buildFromPreset(p: Pick<SchoolDef, 'items' | 'affixes'>): Build {
  return {
    items: { ...(p.items ?? {}) },
    chosenAffixes: { ...(p.affixes ?? {}) },
  }
}
