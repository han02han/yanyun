import { computePanel, type Build } from './calculate'
import { expectedDamage } from './damage'
import { FORMULAS } from '../data/formulas'
import { getEquipment } from '../data/equipment'
import { AFFIXES, getAffix } from '../data/affixes'
import type { SchoolDef } from '../data/schools'
import { type SlotId, slotName } from '../data/slots'
import type { StatKey, Stats } from '../data/types'

/** 毕业率对照目标：流派（学校）或任意含 targetStats/affixes/items/set/xiaoWai 的结构 */
export type GraduationTarget = Pick<SchoolDef, 'name' | 'targetStats' | 'affixes' | 'items' | 'set' | 'xiaoWai'>

/** 六维达标情况 */
export interface SixDim {
  key: string
  name: string
  /** 毕业轴目标值 */
  target: number
  /** 当前面板值 */
  current: number
  /** 达标度 min(1, current/target) */
  ratio: number
  /** 是否按百分比展示 */
  rate: boolean
}

export interface GraduationResult {
  /** 毕业率（六维达标度均值，0-1） */
  overall: number
  /** 六维明细：精准/会心/会意/外功/神力/属攻 */
  sixDims: SixDim[]
  /** 词条命中（对照目标流派的理想词条） */
  affixHit: { matched: number; total: number }
  /** 已命中理想词条的平均数值质量（0-1） */
  affixQuality: number
  /** 套装一致率（目标流派有推荐套装时） */
  setMatch: number
}

/** 六维：精准/会心/会意/外功（小外流取小外）/神力（武增+全武增+首领增）/属攻（大属攻） */
export function computeSixDims(build: Build, preset: GraduationTarget): SixDim[] {
  const { panel } = computePanel(build)
  const t = preset.targetStats ?? {}
  const useMin = preset.xiaoWai === true

  const dims: SixDim[] = []
  const push = (key: string, name: string, target: number | undefined, current: number, rate: boolean) => {
    if (!(target !== undefined && target > 0)) return
    dims.push({
      key, name, target, current,
      ratio: Math.min(1, current / target),
      rate,
    })
  }

  push('precise', '精准', t.precise, panel.precise, true)
  push('crit', '会心', t.crit, panel.crit, true)
  push('critLike', '会意', t.critLike, panel.critLike, true)
  // 外功：小外流流派看小外攻，其余看大外攻
  push(useMin ? 'minAtk' : 'maxAtk', useMin ? '小外攻' : '大外攻',
    useMin ? t.minAtk : t.maxAtk, useMin ? panel.minAtk : panel.maxAtk, false)
  // 神力 = 全武学增效 + 对首领单位增伤 + 指定/武器武学增效（加算）
  const W_STATS = ['swordDmg', 'spearDmg', 'umbrellaDmg', 'fanDmg', 'ropeDartDmg',
    'twinBladeDmg', 'saberDmg', 'hengdaoDmg', 'fistDmg', 'drumDmg'] as const
  const curDmg = panel.allSkillDmg + panel.bossDmg +
    W_STATS.reduce((s, k) => s + (panel[k] ?? 0), 0)
  const tgtDmg = (t.allSkillDmg ?? 0) + (t.bossDmg ?? 0) +
    W_STATS.reduce((s, k) => s + ((t as Record<string, number | undefined>)[k] ?? 0), 0)
  push('power', '神力', tgtDmg > 0 ? tgtDmg : undefined, curDmg, true)
  // 属攻：大属攻
  push('attrMaxAtk', '属攻', t.attrMaxAtk, panel.attrMaxAtk, false)

  return dims
}

/**
 * 毕业率：六维（精准/会心/会意/外功/神力/属攻）达标度均值。
 * 附加词条命中 / 词条质量 / 套装一致率三个辅助指标。
 */
export function computeGraduation(build: Build, preset: GraduationTarget): GraduationResult {
  const sixDims = computeSixDims(build, preset)
  const overall = sixDims.length ? sixDims.reduce((s, d) => s + d.ratio, 0) / sixDims.length : 0

  // 词条命中 + 滚动质量：与目标流派理想词条对比
  let matched = 0
  let total = 0
  let qualitySum = 0
  let qualityN = 0
  for (const entry of Object.entries(preset.affixes ?? {})) {
    const slot = entry[0] as SlotId
    const ideal = entry[1]
    const item = getEquipment(build.items[slot])
    if (!item) continue
    const current = build.chosenAffixes[slot] ?? []
    total += ideal.length
    for (const id of ideal) {
      if (current.includes(id)) {
        matched++
        const aff = getAffix(id)
        // 词条质量 = 实际数值 / 上限（承音装备上限 = 满值×0.94）
        const maxRef = aff ? aff.value * (build.chengyin?.[slot] ? FORMULAS.chengyin : 1) : 1
        const entered = build.affixValues?.[slot]?.[id] ?? maxRef
        qualitySum += Math.min(1, entered / maxRef)
        qualityN++
      }
    }
  }

  // 套装一致：目标流派有推荐套装时比较（选用制，无推荐则为 0）
  const setMatch = preset.set ? (build.set === preset.set ? 1 : 0) : 0

  return {
    overall,
    sixDims,
    affixHit: { matched, total },
    affixQuality: qualityN ? qualitySum / qualityN : 0,
    setMatch,
  }
}

/** 把毕业轴目标覆盖到当前面板，得「毕业面板」（未定义的目标沿用当前值） */
export function axisPanel(current: Stats, preset: GraduationTarget): Stats {
  const t = preset.targetStats ?? {}
  const panel = { ...current }
  for (const entry of Object.entries(t) as [StatKey, number][]) {
    const [key, val] = entry
    panel[key] = val
  }
  return panel
}

/** 毕业轴期望伤害：达到毕业轴目标后的期望输出 */
export function axisDamage(build: Build, preset: GraduationTarget): number {
  const { panel } = computePanel(build)
  return expectedDamage({ panel: axisPanel(panel, preset) })
}

/** 差距最大的 3 项属性及其提升建议 */
export interface CultivationSuggestion {
  stat: string
  current: number
  target: number
  rate: boolean
  hint: string
}

export function cultivationSuggestions(result: GraduationResult): CultivationSuggestion[] {
  const worst = result.sixDims.filter((s) => s.ratio < 1).slice(0, 3)
  return worst.map((s) => {
    const affixes = AFFIXES.filter((a) => a.stat === s.key)
    let hint: string
    if (affixes.length > 0) {
      const slots = new Set<string>()
      for (const a of affixes) {
        if (!a.slotRestriction) slots.add('任意部位')
        else a.slotRestriction.forEach((id) => slots.add(slotName(id)))
      }
      hint = `可洗「${affixes.map((a) => a.name).join(' / ')}」于 ${[...slots].join('、')}`
    } else {
      hint = '该属性主要来自装备基础/套装，优先换装或堆对应五维'
    }
    return { stat: s.name, current: s.current, target: s.target, rate: s.rate, hint }
  })
}

/** 毕业率等级说明 */
export function gradLevel(rate: number): string {
  if (rate >= 0.95) return '毕业'
  if (rate >= 0.8) return '接近毕业'
  if (rate >= 0.6) return '小成'
  if (rate >= 0.4) return '初成'
  return '起步'
}
