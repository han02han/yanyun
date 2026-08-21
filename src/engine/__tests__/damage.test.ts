import { describe, it, expect } from 'vitest'
import { expectedDamage } from '../damage'
import { zeroStats } from '../calculate'

describe('期望伤害', () => {
  it('百暴满精准：全为会心，伤害 = 平均攻 × 1.5', () => {
    const panel = {
      ...zeroStats(),
      minAtk: 1000, maxAtk: 1000,
      precise: 1, crit: 1, critLike: 0,
    }
    expect(expectedDamage({ panel })).toBeCloseTo(1000 * 1.5)
  })

  it('属攻并入攻击（panel 值已含本系 ×1.5 折算）', () => {
    const panel = {
      ...zeroStats(),
      minAtk: 1000, maxAtk: 1000,
      attrMinAtk: 100, attrMaxAtk: 100,
      precise: 1, crit: 0, critLike: 0,
    }
    expect(expectedDamage({ panel })).toBeCloseTo(1000 + 100)
  })

  it('小外流：小外 > 大外时，会心按小外×1.5 结算', () => {
    const panel = {
      ...zeroStats(),
      minAtk: 2000, maxAtk: 1000,
      precise: 1, crit: 1, critLike: 0,
    }
    expect(expectedDamage({ panel })).toBeCloseTo(2000 * 1.5)
  })

  it('小外流：会意也按小外×1.35 结算（不用大外）', () => {
    const panel = {
      ...zeroStats(),
      minAtk: 2000, maxAtk: 1000,
      precise: 0, crit: 0, critLike: 1,
    }
    expect(expectedDamage({ panel })).toBeCloseTo(2000 * 1.35)
  })

  it('未精准且无会意：全为擦伤，伤害 = 最小攻', () => {
    const panel = {
      ...zeroStats(),
      minAtk: 800, maxAtk: 1600,
      precise: 0, crit: 0, critLike: 0,
    }
    expect(expectedDamage({ panel })).toBeCloseTo(800)
  })

  it('全精准无会心会意：普通命中 = 平均攻', () => {
    const panel = {
      ...zeroStats(),
      minAtk: 1000, maxAtk: 2000,
      precise: 1, crit: 0, critLike: 0,
    }
    expect(expectedDamage({ panel })).toBeCloseTo(1500)
  })

  it('敌人防御按加减关系扣除（保底 0）', () => {
    const panel = {
      ...zeroStats(),
      minAtk: 1000, maxAtk: 1000,
      precise: 1, crit: 0, critLike: 0,
    }
    expect(expectedDamage({ panel, enemyDef: 400 })).toBeCloseTo(600)
    expect(expectedDamage({ panel, enemyDef: 9999 })).toBe(0)
  })

  it('增伤与技能倍率生效', () => {
    const panel = {
      ...zeroStats(),
      minAtk: 1000, maxAtk: 1000,
      precise: 1, crit: 0, critLike: 0,
      allSkillDmg: 0.08, weaponDmg: 0.08, bossDmg: 0.05,
    }
    const noBonus = expectedDamage({ panel: { ...panel, allSkillDmg: 0, weaponDmg: 0, bossDmg: 0 } })
    const withBonus = expectedDamage({ panel, skillMult: 1 })
    expect(withBonus).toBeCloseTo(noBonus * 1.21)
  })
})
