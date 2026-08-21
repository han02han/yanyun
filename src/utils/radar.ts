import type { StatKey, Stats } from '../data/types'

export interface RadarDim {
  key: StatKey
  name: string
  /** 归一化分母（雷达图上满值） */
  max: number
  /** 是否按百分比显示 */
  pct?: boolean
}

/** 雷达图对比维度（固定 max，保证跨配装可比） */
export const RADAR_DIMS: RadarDim[] = [
  { key: 'maxAtk', name: '大外攻', max: 4000 },
  { key: 'minAtk', name: '小外攻', max: 2500 },
  { key: 'attrMaxAtk', name: '大属攻', max: 1500 },
  { key: 'hp', name: '气血', max: 18000 },
  { key: 'def', name: '外防', max: 500 },
  { key: 'precise', name: '精准', max: 1, pct: true },
  { key: 'crit', name: '会心', max: 0.8, pct: true },
  { key: 'critLike', name: '会意', max: 0.4, pct: true },
]

export const radarValues = (stats: Stats): number[] =>
  RADAR_DIMS.map((d) => stats[d.key as keyof Stats] / d.max)
