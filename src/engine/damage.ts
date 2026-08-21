import { FORMULAS } from '../data/formulas'
import type { Stats } from '../data/types'

export interface DamageInput {
  /** 最终面板 */
  panel: Stats
  /** 技能倍率（默认 1） */
  skillMult?: number
  /** 敌人外防（默认 0；只减免外功部分） */
  enemyDef?: number
  /** 额外乘区（如增益 buff，默认 1） */
  bonusMultiplier?: number
}

/**
 * 单次攻击的期望伤害。
 *
 * 结构参考 NGA 片雲《PVE数值系统与伤害公式解析》（开服实测帖，误差 <1%）：
 *  外功部分 = (外功倍率×(外功攻−敌防)+固伤) ×(1+外功穿透/200) ×(1+外伤加成)
 *  外系属攻 = 外功倍率×外系属攻 ×(1+属性穿透/200) ×(1+属性伤加成)   （不减防御）
 *  本系属攻 = 属性倍率×(本系属攻+补正) ×(1+属性穿透/200) ×(1+属性伤加成)（不减防御）
 *  整体    × 会意/会心倍率 × (1+增伤1+…+增伤n) × 特殊增伤 × (1+定音增伤)
 *
 * 简化/近似（MVP）：
 *  - 属性倍率 = 外功倍率 × 1.5（"本系额外 50% 倍率"）；本系补正 +80 未建模（110 级待确认）
 *  - 外系属攻与外功同倍率（×1）；本系属攻在 computePanel 已按 ×1.5 折算
 *  - 属性穿透用「无相穿透」近似；小外流规则只作用于外功部分
 *  - 技能倍率固定 1，无技能循环
 */
export function expectedDamage(input: DamageInput): number {
  const { panel: p, skillMult = 1, enemyDef = 0, bonusMultiplier = 1 } = input
  const { critMult, critLikeMult } = FORMULAS.damage
  const { precise, crit, critLike } = p

  // 外功（小外流：小外 > 大外时全部按小外结算）
  const wMin = p.minAtk
  const wMax = p.maxAtk
  const wHitMax = Math.max(wMin, wMax)
  const wAvg = wMax < wMin ? wMin : (wMin + wMax) / 2
  // 属攻（本系 ×1.5 已折算进 panel；不减防御）
  const aMin = p.attrMinAtk
  const aMax = p.attrMaxAtk
  const aHitMax = Math.max(aMin, aMax)
  const aAvg = aMax < aMin ? aMin : (aMin + aMax) / 2

  // 穿透乘区（独立乘区：1 + 穿透/200）
  const penMult = 1 + p.pierce / 200
  const attrPenMult = 1 + p.wuxiangPierce / 200

  // 会心/会意伤害 = 基础倍率 × (1 + 面板加成)
  const critDmgMult = critMult * (1 + p.critDmg)
  const critLikeDmgMult = critLikeMult * (1 + p.critLikeDmg)
  const hit = precise
  const miss = 1 - precise

  // 四分支：外功部分减防御，属攻部分不减
  // 擦伤（最小攻）
  const wScrape = Math.max(0, wMin - enemyDef) * penMult
  const missScrape = miss * (1 - critLike) * (wScrape + aMin * attrPenMult)
  // 会意（最大攻）
  const wCritLike = Math.max(0, wHitMax - enemyDef) * penMult
  const missCritLike = miss * critLike * (wCritLike + aHitMax * attrPenMult) * critLikeDmgMult
  const hitCritLike = hit * critLike * (wCritLike + aHitMax * attrPenMult) * critLikeDmgMult
  // 会心 / 普通（平均攻）
  const wAvgHit = Math.max(0, wAvg - enemyDef) * penMult
  const hitCrit = hit * (1 - critLike) * crit * (wAvgHit + aAvg * attrPenMult) * critDmgMult
  const hitNormal = hit * (1 - critLike) * (1 - crit) * (wAvgHit + aAvg * attrPenMult)

  const base = missCritLike + missScrape + hitCritLike + hitCrit + hitNormal
  const dmgBonus =
    1 + p.allSkillDmg + p.weaponDmg + p.bossDmg +
    p.singleQishuDmg + p.groupQishuDmg + p.playerDmg +
    p.attrDmgBonus + p.skillDmg + p.chargeDmg + p.specialDmg + p.specSkillDmg +
    p.swordDmg + p.spearDmg + p.umbrellaDmg + p.fanDmg + p.ropeDartDmg +
    p.twinBladeDmg + p.saberDmg + p.hengdaoDmg + p.fistDmg + p.drumDmg
  return base * skillMult * dmgBonus * bonusMultiplier
}
