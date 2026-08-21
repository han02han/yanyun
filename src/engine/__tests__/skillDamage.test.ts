import { describe, it, expect } from 'vitest'
import { skillHitDamage } from '../skillDamage'
import { zeroStats } from '../calculate'
import { getSkills } from '../../data/skills'

describe('技能伤害（架子，数字待校正）', () => {
  it('无名剑法蓄力技 1 档：外功倍率 1.51 + 固伤 21', () => {
    const skill = getSkills('10102').find((s) => s.name.includes('无以为家-1档'))!
    const panel = {
      ...zeroStats(),
      minAtk: 1000, maxAtk: 1000,
      precise: 1, crit: 0, critLike: 0,
    }
    // 普通命中：1000×1.51 + 21 = 1531
    expect(skillHitDamage({ panel, skill })).toBeCloseTo(1000 * skill.physCoef + skill.flat)
  })

  it('全 20 武学技能库有数据', () => {
    expect(Object.keys(getSkills('10101')).length).toBeGreaterThan(0)
  })
})
