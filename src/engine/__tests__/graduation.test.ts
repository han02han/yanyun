import { describe, it, expect } from 'vitest'
import { axisDamage, computeGraduation, gradLevel, type GraduationTarget } from '../graduation'
import { buildFromPreset } from '../calculate'
import { buildDamage } from '../contribution'
import { SCHOOLS } from '../../data/schools'

const POZHU = SCHOOLS.find((s) => s.id === 'pozhu-chen')!

const presetToBuild = (p: GraduationTarget) => ({
  items: { ...(p.items ?? {}) },
  chosenAffixes: { ...(p.affixes ?? {}) },
})

describe('毕业率', () => {
  it('目标流派自身对照：词条全命中', () => {
    const r = computeGraduation(presetToBuild(POZHU), POZHU)
    expect(r.affixHit.matched).toBe(r.affixHit.total)
    expect(r.overall).toBeGreaterThan(0)
    expect(r.overall).toBeLessThanOrEqual(1)
  })

  it('达标度取 min(1, 当前/目标)，超出按 100% 计', () => {
    const preset: GraduationTarget = {
      name: 'T',
      targetStats: { maxAtk: 1, crit: 0.001 },
    }
    const r = computeGraduation({ items: { weapon1: 'wp_modao' }, chosenAffixes: { weapon1: ['crit'] } }, preset)
    expect(r.overall).toBe(1)
  })

  it('缺少理想词条会降低命中数', () => {
    const base = presetToBuild(POZHU)
    const modified = { ...base, chosenAffixes: { ...base.chosenAffixes, weapon1: ['maxAtk'] } }
    const r = computeGraduation(modified, POZHU)
    // 武器理想词条 4 个，只留 1 个 → 少命中 3 个
    expect(r.affixHit.matched).toBe(r.affixHit.total - 3)
  })

  it('空配装毕业率很低', () => {
    const r = computeGraduation({ items: {}, chosenAffixes: {} }, POZHU)
    expect(r.overall).toBeLessThan(0.3)
  })

  it('毕业率等级划分', () => {
    expect(gradLevel(0.97)).toBe('毕业')
    expect(gradLevel(0.85)).toBe('接近毕业')
    expect(gradLevel(0.7)).toBe('小成')
    expect(gradLevel(0.5)).toBe('初成')
    expect(gradLevel(0.1)).toBe('起步')
  })

  it('默认满滚动时词条质量为 100%', () => {
    const r = computeGraduation(buildFromPreset(POZHU), POZHU)
    expect(r.affixQuality).toBe(1)
  })

  it('填写低于上限的数值会拉低词条质量', () => {
    const b = buildFromPreset(POZHU)
    // 武器增伤满值 0.049，只填一半 → 该词条质量 0.5
    b.affixValues = { weapon1: { maxAtk: 121.4 / 2 } }
    const r = computeGraduation(b, POZHU)
    expect(r.affixQuality).toBeLessThan(1)
    expect(r.affixQuality).toBeGreaterThan(0)
  })

  it('毕业轴期望伤害高于当前（目标普遍更高）', () => {
    const b = buildFromPreset(POZHU)
    expect(axisDamage(b, POZHU)).toBeGreaterThan(buildDamage(b))
  })
})
