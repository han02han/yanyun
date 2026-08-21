import { computePanel, type Build } from './calculate'
import { expectedDamage } from './damage'
import type { SlotId } from '../data/slots'

export interface DamageSettings {
  skillMult?: number
  enemyDef?: number
}

/** 当前配装的期望伤害（默认技能倍率 1、敌人防御 0） */
export function buildDamage(build: Build, settings: DamageSettings = {}): number {
  return expectedDamage({ panel: computePanel(build).panel, ...settings })
}

/**
 * 词条边际收益：移除该词条前后期望伤害之差（对当前配装而言）。
 * 用于词条收益排序与「单件/词条」对比。
 */
export function affixContribution(build: Build, slot: SlotId, affixId: string): number {
  const base = build.chosenAffixes[slot] ?? []
  const removed = base.filter((a) => a !== affixId)
  const mod: Build = {
    ...build,
    chosenAffixes: { ...build.chosenAffixes, [slot]: removed },
  }
  return buildDamage(build) - buildDamage(mod)
}

/**
 * 词条洗入收益：把该词条加入当前槽位后的期望伤害增量。
 * 用于「可洗入词条」排序，标出最优先调律的词条。
 */
export function affixAddContribution(build: Build, slot: SlotId, affixId: string): number {
  const base = build.chosenAffixes[slot] ?? []
  const mod: Build = {
    ...build,
    chosenAffixes: { ...build.chosenAffixes, [slot]: [...base, affixId] },
  }
  return buildDamage(mod) - buildDamage(build)
}

/**
 * 装备替换收益：把 slot 换成候选装备后的期望伤害增量。
 * 换成不同装备时清空该槽位调律词条（新装备词条由用户重洗）；同装备收益为 0。
 */
export function equipDelta(build: Build, slot: SlotId, candidateId: string): number {
  const base = buildDamage(build)
  const mod: Build = {
    ...build,
    items: { ...build.items, [slot]: candidateId },
    chosenAffixes: { ...build.chosenAffixes },
  }
  if (build.items[slot] !== candidateId) delete mod.chosenAffixes[slot]
  return buildDamage(mod) - base
}
