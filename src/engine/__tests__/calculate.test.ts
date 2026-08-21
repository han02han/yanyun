import { describe, it, expect } from 'vitest'
import { zeroStats, addStats, aggregateBuild, toPanel, computePanel } from '../calculate'
import { FORMULAS } from '../../data/formulas'

const { wuxing: w } = FORMULAS

describe('零值与累加', () => {
  it('zeroStats 全为 0', () => {
    const s = zeroStats()
    expect(s.ti).toBe(0)
    expect(s.maxAtk).toBe(0)
    expect(s.critLike).toBe(0)
    expect(s.attrMaxAtk).toBe(0)
  })

  it('addStats 只累加存在的键', () => {
    const s = addStats(zeroStats(), { hp: 100, maxAtk: 50 })
    expect(s.hp).toBe(100)
    expect(s.maxAtk).toBe(50)
    expect(s.def).toBe(0)
  })
})

const jr = FORMULAS.judgementResistance
const jrDiv = 1 + jr.resistance

describe('五维换算', () => {
  it('体/御不换算气血防御（PVE 无用，玩家确认不计）', () => {
    const { panel } = toPanel({ ...zeroStats(), ti: 10, yu: 10, hp: 100 })
    expect(panel.hp).toBe(100) // 原始气血保留，体/御不追加
    expect(panel.def).toBe(0)
  })

  it('劲/敏 → 大小外攻；敏 → 会心；势 → 大攻与会意（白值再衰减为黄值）', () => {
    const { panel, whiteRates } = toPanel({ ...zeroStats(), jin: 100, min: 100, shi: 100 })
    expect(panel.minAtk).toBeCloseTo(100 * w.jin.minAtk + 100 * w.min.minAtk)
    expect(panel.maxAtk).toBeCloseTo(100 * w.jin.maxAtk + 100 * w.shi.maxAtk)
    // 白值 = 五维换算值；黄值 = 白值 / (1+判定抵抗)
    expect(whiteRates.crit).toBeCloseTo(100 * w.min.crit)
    expect(panel.crit).toBeCloseTo((100 * w.min.crit) / jrDiv)
    expect(whiteRates.critLike).toBeCloseTo(100 * w.shi.critLike)
    expect(panel.critLike).toBeCloseTo((100 * w.shi.critLike) / jrDiv)
  })
})

describe('白→黄三率转换', () => {
  it('精准低于基础命中(65%)不衰减，超出部分打折', () => {
    const low = toPanel({ ...zeroStats(), precise: 0.6 })
    expect(low.panel.precise).toBeCloseTo(0.6)
    const high = toPanel({ ...zeroStats(), precise: 1.0 })
    expect(high.panel.precise).toBeCloseTo(jr.basePrecision + (1 - jr.basePrecision) / jrDiv)
  })

  it('直接会心/会意不衰减（白=黄）', () => {
    const { panel } = toPanel({ ...zeroStats(), crit: 0.66, directCrit: 0.1 })
    expect(panel.crit).toBeCloseTo(0.66 / jrDiv + 0.1)
  })
})

describe('三率上限截断', () => {
  it('黄值超限截断（会心白 1.35 → 黄 0.818 → 截 0.8）', () => {
    const { panel, capped } = toPanel({ ...zeroStats(), precise: 1.2, crit: 1.35, critLike: 0.16 })
    expect(panel.precise).toBeCloseTo(jr.basePrecision + (1.2 - jr.basePrecision) / jrDiv)
    expect(panel.crit).toBe(0.8)
    expect(panel.critLike).toBeCloseTo(0.16 / jrDiv)
    expect(capped).toEqual({ precise: false, crit: true, critLike: false })
  })

  it('未超限时不标记', () => {
    const { capped } = toPanel({ ...zeroStats(), precise: 0.9, crit: 0.5, critLike: 0.3 })
    expect(capped).toEqual({ precise: false, crit: false, critLike: false })
  })
})

describe('会心+会意归一化', () => {
  it('黄值两者和 >1 时按比例缩放（会意挤占会心）', () => {
    const { panel, normalized } = toPanel({ ...zeroStats(), crit: 1.32, critLike: 0.5 })
    // 黄：0.8 + 0.303 = 1.103 > 1 → 归一化
    expect(normalized).toBe(true)
    const sum = 0.8 + 0.5 / jrDiv
    expect(panel.crit).toBeCloseTo(0.8 / sum)
    expect(panel.critLike).toBeCloseTo(0.5 / jrDiv / sum)
  })

  it('和 ≤1 时不归一化', () => {
    const { panel, normalized } = toPanel({ ...zeroStats(), crit: 0.5, critLike: 0.3 })
    expect(normalized).toBe(false)
    expect(panel.crit).toBeCloseTo(0.5 / jrDiv)
    expect(panel.critLike).toBeCloseTo(0.3 / jrDiv)
  })
})

describe('聚合：装备 + 词条 + 套装', () => {
  it('金装主词条计入；调律词条默认空（用户添加）', () => {
    const { raw } = aggregateBuild({ items: { weapon1: 'wp_modao' }, chosenAffixes: {} })
    // wp_modao 金主词条: minAtk 100 / maxAtk 232；无默认调律词条
    expect(raw.minAtk).toBe(100)
    expect(raw.maxAtk).toBe(232)
    expect(raw.weaponDmg).toBe(0)
    expect(raw.crit).toBe(0)
  })

  it('紫装主词条数值低于金装；无默认词条', () => {
    const { raw } = aggregateBuild({ items: { wrist: 'armor_wrist' }, chosenAffixes: {} })
    // armor_wrist 为紫装：主词条 hp 7402 / def 27；无默认调律词条
    expect(raw.hp).toBe(7402)
    expect(raw.def).toBe(27)
    expect(raw.bossDmg).toBe(0)
    expect(raw.playerDmg).toBe(0)
  })

  it('调律词条覆盖装备默认词条', () => {
    const { raw } = aggregateBuild({
      items: { weapon1: 'wp_modao' },
      chosenAffixes: { weapon1: ['maxAtk'] },
    })
    // 只剩 maxAtk(121.4 满值)，默认词条被替换
    expect(raw.maxAtk).toBeCloseTo(232 + 121.4)
    expect(raw.weaponDmg).toBe(0)
  })

  it('用户填写的词条数值直接生效', () => {
    const { raw } = aggregateBuild({
      items: { weapon1: 'wp_modao' },
      chosenAffixes: { weapon1: ['maxAtk'] },
      affixValues: { weapon1: { maxAtk: 100 } },
    })
    expect(raw.maxAtk).toBeCloseTo(232 + 100)
  })

  it('承音装备词条缺省值 = 满值×0.94（大外 121.4 → 114.12）', () => {
    const { raw } = aggregateBuild({
      items: { weapon1: 'wp_modao' },
      chosenAffixes: { weapon1: ['maxAtk'] },
      chengyin: { weapon1: true },
    })
    expect(raw.maxAtk).toBeCloseTo(232 + 121.4 * 0.94)
  })

  it('选用套装直接生效（飞套 → 会意率 +7%）', () => {
    const { raw, selectedSet } = aggregateBuild({ items: {}, chosenAffixes: {}, set: 'fei' })
    expect(raw.critLike).toBeCloseTo(0.07)
    expect(selectedSet?.id).toBe('fei')
  })

  it('未选用套装无套装加成', () => {
    const { raw } = aggregateBuild({ items: {}, chosenAffixes: {} })
    expect(raw.critLike).toBe(0)
  })

  it('武库：通用加 186/373 大小外攻；流派武库加对应属攻', () => {
    const tong = aggregateBuild({ items: {}, chosenAffixes: {}, wuku: 'tongyong' })
    expect(tong.raw.minAtk).toBe(186)
    expect(tong.raw.maxAtk).toBe(373)

    const schoolWuku = aggregateBuild({ items: {}, chosenAffixes: {}, wuku: 'mingjin' })
    expect(schoolWuku.attrByType.mingjin.min).toBe(186)
    expect(schoolWuku.attrByType.mingjin.max).toBe(373)
    // 只加对应一系
    expect(schoolWuku.attrByType.pozhu.min).toBe(0)
  })
})

describe('属攻本系判定', () => {
  it('本系属攻 ×1.5，外系 ×1，无相恒 ×1.5', () => {
    const build = (school: string | undefined) => ({
      items: { ring: 'armor_ring' },
      chosenAffixes: { ring: ['attrPozhuBig', 'attrMingjinBig'] },
      school,
    })
    // 无流派：全按外系 ×1
    expect(computePanel(build(undefined)).panel.attrMaxAtk).toBeCloseTo(68.8 * 2)
    // 破竹本系：大破竹 ×1.5，大鸣金 ×1；破竹尘两个武学固定加成 +160×2 本系属攻（×1.5）
    expect(computePanel(build('pozhu-chen')).panel.attrMaxAtk).toBeCloseTo((68.8 + 320) * 1.5 + 68.8)
    // 鸣金本系：大鸣金 ×1.5，大破竹 ×1；鸣金虹武学固定加成同 +320
    expect(computePanel(build('mingjin-hong')).panel.attrMaxAtk).toBeCloseTo(68.8 + (68.8 + 320) * 1.5)
  })

  it('无相恒 ×1.5（无论流派；含武学固定加成）', () => {
    const b = { items: { weapon1: 'wp_modao' }, chosenAffixes: { weapon1: ['bigWuxiang'] }, school: 'lieshi-jun' }
    // 无相 68.8×1.5 + 裂石钧两武学固定加成 320×1.5（本系）
    expect(computePanel(b).panel.attrMaxAtk).toBeCloseTo(68.8 * 1.5 + 320 * 1.5)
  })

  it('武学派生公式：linear_capped_rung（悬身拳法 敏→小外攻 cap 59.4）', () => {
    const b = {
      items: { ring: 'armor_ring' },
      // 用词条堆敏 300（超过阈值 225 → 满加成）
      chosenAffixes: { ring: ['min'] },
      affixValues: { ring: { min: 300 } },
      school: 'pozhu-zun',
    }
    const p = computePanel(b).panel
    // 环主词条 133 小外 + 敏五维换算 0.9×300=270 + 悬身拳法派生 59.4（敏 300/阈值225 → 满）
    expect(p.minAtk).toBeCloseTo(133 + 270 + 59.4)
    // 白会心 = 敏五维 0.228 + 断水双诀派生 0.068 → 黄值 ÷1.65
    expect(p.crit).toBeCloseTo((300 * 0.00076 + 0.068) / 1.65)
  })
})

describe('完整面板计算', () => {
  it('computePanel 返回面板、套装与标记', () => {
    const r = computePanel({ items: { helm: 'armor_helm' }, chosenAffixes: {}, set: 'fei' })
    expect(r.panel.hp).toBeGreaterThan(0)
    expect(r.activeSets.length).toBe(1)
    expect(r.activeSets[0].id).toBe('fei')
    expect(typeof r.normalized).toBe('boolean')
  })
})
