import { useMemo } from 'react'
import type { EChartsOption } from 'echarts'
import type { Build } from '../engine/calculate'
import { affixContribution } from '../engine/contribution'
import { getAffix } from '../data/affixes'
import { getEquipment } from '../data/equipment'
import type { SlotId } from '../data/slots'
import { dmg } from '../utils/format'
import EChart from './EChart'

interface Props {
  build: Build
}

/** 词条收益条形图：直观比较当前配装中各词条对期望伤害的贡献 */
export default function AffixContribution({ build }: Props) {
  const rows = useMemo(() => {
    const list: { name: string; value: number }[] = []
    for (const slot of Object.keys(build.items) as SlotId[]) {
      const item = getEquipment(build.items[slot])
      if (!item) continue
      const ids = build.chosenAffixes[slot] ?? []
      for (const id of ids) {
        const a = getAffix(id)
        if (!a) continue
        const c = affixContribution(build, slot, id)
        if (c > 0) list.push({ name: a.name, value: c })
      }
    }
    return list.sort((a, b) => b.value - a.value).slice(0, 12)
  }, [build])

  if (rows.length === 0) {
    return (
      <div className="card">
        <div className="card-title">词条收益</div>
        <div className="note">装备词条后，这里会按「期望伤害边际贡献」从高到低排序展示。</div>
      </div>
    )
  }

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#262119',
      borderColor: '#453c30',
      textStyle: { color: '#ece5d6', fontSize: 12 },
      axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(255,255,255,0.04)' } },
      formatter: (params: any) => {
        const p = params[0]
        return `${p.name}<br/>期望伤害贡献：<b style="color:#e07a5f">+${dmg(p.value)}</b>`
      },
    },
    grid: { left: 10, right: 24, top: 10, bottom: 10, containLabel: true },
    xAxis: {
      type: 'value',
      axisLabel: { color: '#a89b8a', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(92,82,67,0.4)' } },
    },
    yAxis: {
      type: 'category',
      data: rows.map((r) => r.name).reverse(),
      axisLabel: { color: '#c4b8a4', fontSize: 12 },
      axisLine: { lineStyle: { color: '#453c30' } },
    },
    series: [{
      type: 'bar',
      data: rows.map((r) => r.value).reverse(),
      barWidth: 14,
      itemStyle: { color: '#c02a1f', borderRadius: [0, 3, 3, 0] },
    }],
  }

  return (
    <div className="card">
      <div className="card-title">词条收益 <span className="hint">按期望伤害边际贡献排序</span></div>
      <EChart option={option} height={Math.max(200, rows.length * 26)} />
    </div>
  )
}
