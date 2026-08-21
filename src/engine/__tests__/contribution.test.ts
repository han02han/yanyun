import { describe, it, expect } from 'vitest'
import { buildFromPreset } from '../calculate'
import { affixAddContribution, affixContribution, buildDamage, equipDelta } from '../contribution'
import { SCHOOLS } from '../../data/schools'

const POZHU = SCHOOLS.find((s) => s.id === 'pozhu-chen')!
const build = () => buildFromPreset(POZHU)

describe('词条边际收益', () => {
  it('移除大外攻词条会降低期望伤害', () => {
    expect(affixContribution(build(), 'weapon1', 'maxAtk')).toBeGreaterThan(0)
  })

  it('洗入劲词条能提升期望伤害', () => {
    expect(affixAddContribution(build(), 'weapon1', 'jin')).toBeGreaterThan(0)
  })

  it('换上与当前相同的装备收益为 0', () => {
    expect(equipDelta(build(), 'weapon1', 'wp_shengbiao')).toBe(0)
  })

  it('buildDamage 为正值', () => {
    expect(buildDamage(build())).toBeGreaterThan(0)
  })
})
