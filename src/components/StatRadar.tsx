import type { EChartsOption } from 'echarts'
import type { Stats } from '../data/types'
import { RADAR_DIMS, radarValues } from '../utils/radar'
import { pct, int } from '../utils/format'
import EChart from './EChart'

export interface RadarSeries {
  name: string
  stats: Stats
}

/** 系列配色（固定顺序，≥2 系列用图例区分）：朱砂 / 金 / 青 */
const COLORS = ['#c02a1f', '#c9a86a', '#7f9bb0']

const alpha = (hex: string, a: number): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

const fmt = (dim: (typeof RADAR_DIMS)[number], v: number): string =>
  dim.pct ? pct(v) : int(v)

/** 属性雷达图：多套配装叠加（固定 max 归一化，跨配装可比） */
export default function StatRadar({ series }: { series: RadarSeries[] }) {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#262119',
      borderColor: '#453c30',
      textStyle: { color: '#ece5d6', fontSize: 12 },
      formatter: (p: any) => {
        const rows = RADAR_DIMS.map((d, i) => `${d.name}：${fmt(d, p.value[i] * d.max)}`)
        return `<b>${p.name}</b><br/>${rows.join('<br/>')}`
      },
    },
    legend: {
      bottom: 0,
      textStyle: { color: '#c4b8a4' },
      itemWidth: 14,
      itemHeight: 2,
    },
    radar: {
      indicator: RADAR_DIMS.map((d) => ({ name: d.name, max: 1 })),
      radius: '65%',
      splitNumber: 4,
      axisName: { color: '#a89b8a', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(92,82,67,0.5)' } },
      splitArea: { areaStyle: { color: ['rgba(38,33,25,0.2)', 'rgba(38,33,25,0.05)'] } },
      axisLine: { lineStyle: { color: '#453c30' } },
    },
    series: [
      {
        type: 'radar',
        symbolSize: 3,
        data: series.map((s, i) => {
          const c = COLORS[i % COLORS.length]
          return {
            name: s.name,
            value: radarValues(s.stats),
            lineStyle: { color: c, width: 2 },
            itemStyle: { color: c },
            areaStyle: { color: alpha(c, i === 0 ? 0.25 : 0.12) },
          }
        }),
      },
    ],
  }

  return (
    <div className="card">
      <div className="card-title">属性对比 <span className="hint">{series.length} 套配装</span></div>
      <EChart option={option} height={300} />
    </div>
  )
}
