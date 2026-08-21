import type { StatKey } from './types'

/**
 * 套装共 9 种（玩家确认），**用户选用制**：选哪套就生效哪套的效果，无件数触发。
 * 倾、撼、归、星、云（小外攻 +121）；斗（大外攻 +121）；
 * 烟、雨（精准率 +12.5%）；飞（会意率 +7%）。
 */
export interface SetDef {
  id: string
  name: string
  /** 效果文字 */
  effect: string
  /** 静态属性加成 */
  stats?: Partial<Record<StatKey, number>>
}

export const SETS: SetDef[] = [
  { id: 'qing', name: '倾', effect: '小外攻 +121', stats: { minAtk: 121 } },
  { id: 'han', name: '撼', effect: '小外攻 +121', stats: { minAtk: 121 } },
  { id: 'gui', name: '归', effect: '小外攻 +121', stats: { minAtk: 121 } },
  { id: 'xing', name: '星', effect: '小外攻 +121', stats: { minAtk: 121 } },
  { id: 'yun', name: '云', effect: '小外攻 +121', stats: { minAtk: 121 } },
  { id: 'dou', name: '斗', effect: '大外攻 +121', stats: { maxAtk: 121 } },
  { id: 'yan', name: '烟', effect: '精准率 +12.5%', stats: { precise: 0.125 } },
  { id: 'yu', name: '雨', effect: '精准率 +12.5%', stats: { precise: 0.125 } },
  { id: 'fei', name: '飞', effect: '会意率 +7%', stats: { critLike: 0.07 } },
  { id: 'duanyue', name: '断岳', effect: '效果数值待玩家查证', stats: {} },
]

export const getSet = (id: string | undefined): SetDef | undefined =>
  SETS.find((s) => s.id === id)
