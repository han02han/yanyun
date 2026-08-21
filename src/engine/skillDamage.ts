import { FORMULAS } from '../data/formulas'
import type { SkillHit } from '../data/skills'
import type { Stats } from '../data/types'

export interface SkillDamageInput {
  panel: Stats
  skill: SkillHit
  /** 敌人外防（只减免外功部分） */
  enemyDef?: number
  /** 额外乘区（buff 等） */
  bonusMultiplier?: number
}

/**
 * 单技能单 hit 期望伤害（NGA 公式结构）：
 *  外功部分 = (外功倍率×外功攻 − 敌防) + 固伤 → ×(1+外攻穿透/200)
 *  属攻部分 = 属性倍率×属攻（本系×1.5 已折算） → ×(1+属性穿透/200)
 *  四分支判定（擦伤=最小攻 / 会意=最大攻×1.35×会意伤 / 会心=平均×1.5×会心伤 / 普通=平均）
 *  × 增伤区（加算）× 定音
 *
 * ⚠️ 架子：elemCoef 语义待确认、固伤是否吃会意/会心倍率待验证、数字待校正。
 */
export function skillHitDamage({ panel: p, skill, enemyDef = 0, bonusMultiplier = 1 }: SkillDamageInput): number {
  const { critMult, critLikeMult } = FORMULAS.damage
  const { precise, crit, critLike } = p
  const hit = precise
  const miss = 1 - precise

  // 外功（小外流规则）与属攻各自的分支数值
  const physMin = Math.max(0, p.minAtk * skill.physCoef - enemyDef) + skill.flat
  const physMax = Math.max(0, p.maxAtk * skill.physCoef - enemyDef) + skill.flat
  const physHitMax = Math.max(physMin, physMax)
  const physAvg = physMax < physMin ? physMin : (physMin + physMax) / 2
  const attrMin = p.attrMinAtk * skill.elemCoef
  const attrMax = p.attrMaxAtk * skill.elemCoef
  const attrHitMax = Math.max(attrMin, attrMax)
  const attrAvg = attrMax < attrMin ? attrMin : (attrMin + attrMax) / 2

  const penMult = 1 + p.pierce / 200
  const attrPenMult = 1 + p.wuxiangPierce / 200
  const critDmgMult = critMult * (1 + p.critDmg)
  const critLikeDmgMult = critLikeMult * (1 + p.critLikeDmg)

  // 四分支
  const scrape = (physMin * penMult + attrMin * attrPenMult) * miss * (1 - critLike)
  const critLikeHit = (physHitMax * penMult + attrHitMax * attrPenMult) * critLikeDmgMult * critLike
  const critHit = (physAvg * penMult + attrAvg * attrPenMult) * critDmgMult * hit * (1 - critLike) * crit
  const normalHit = (physAvg * penMult + attrAvg * attrPenMult) * hit * (1 - critLike) * (1 - crit)

  const dmgBonus =
    1 + p.allSkillDmg + p.weaponDmg + p.bossDmg +
    p.singleQishuDmg + p.groupQishuDmg + p.playerDmg +
    p.attrDmgBonus + p.globalDmg + p.skillDmg + p.chargeDmg + p.specialDmg + p.specSkillDmg +
    p.swordDmg + p.spearDmg + p.umbrellaDmg + p.fanDmg + p.ropeDartDmg +
    p.twinBladeDmg + p.saberDmg + p.hengdaoDmg + p.fistDmg + p.drumDmg

  return (scrape + critLikeHit + critHit + normalHit) * dmgBonus * bonusMultiplier
}
