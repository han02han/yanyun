import { useMemo } from 'react'
import type { EChartsOption } from 'echarts'
import { getSchool, SCHOOLS } from '../data/schools'
import { axisDamage, computeGraduation, cultivationSuggestions, gradLevel } from '../engine/graduation'
import { buildDamage } from '../engine/contribution'
import type { Build } from '../engine/calculate'
import { pct, int } from '../utils/format'
import EChart from './EChart'

interface Props {
  build: Build
}

/** 毕业率：六维（精准/会心/会意/外功/神力/属攻）达标度雷达 + 差距建议；目标流派 = 当前流派 */
export default function GraduationPanel({ build }: Props) {
  const target = getSchool(build.school) ?? SCHOOLS[0]

  const result = useMemo(() => computeGraduation(build, target), [build, target])
  const currentDmg = useMemo(() => buildDamage(build), [build])
  const axisDmg = useMemo(() => axisDamage(build, target), [build, target])
  const suggestions = useMemo(() => cultivationSuggestions(result), [result])

  // 社区 110 阶竞速轴基线秒伤为权威参考；当前 DPS 按「当前期望/轴期望」比例校准，
  // 面板达到毕业轴时正好等于基线秒伤；无轴时显示占位
  const curDps = target.baselineDps && axisDmg > 0
    ? Math.round(target.baselineDps * (currentDmg / axisDmg))
    : null

  const option: EChartsOption = useMemo(() => ({
    tooltip: {
      trigger: 'item',
      backgroundColor: '#262119',
      borderColor: '#453c30',
      textStyle: { color: '#ece5d6', fontSize: 12 },
      formatter: () => {
        const rows = result.sixDims.map(
          (d) => `${d.name}：${d.rate ? pct(d.current) : int(d.current)} / ${d.rate ? pct(d.target) : int(d.target)}`,
        )
        return `<b>毕业轴达标度</b><br/>${rows.join('<br/>')}`
      },
    },
    radar: {
      indicator: result.sixDims.map((d) => ({ name: d.name, max: 1 })),
      radius: '62%',
      splitNumber: 4,
      axisName: { color: '#a89b8a', fontSize: 12 },
      splitLine: { lineStyle: { color: 'rgba(92,82,67,0.5)' } },
      splitArea: { areaStyle: { color: ['rgba(38,33,25,0.2)', 'rgba(38,33,25,0.05)'] } },
      axisLine: { lineStyle: { color: '#453c30' } },
    },
    series: [{
      type: 'radar',
      symbolSize: 3,
      data: [{
        name: '当前',
        value: result.sixDims.map((d) => d.ratio),
        lineStyle: { color: '#c02a1f', width: 2 },
        itemStyle: { color: '#c02a1f' },
        areaStyle: { color: 'rgba(192,42,31,0.25)' },
      }],
    }],
  }), [result])

  return (
    <div className="card">
      <div className="card-title">
        毕业率 <span className="hint">对照毕业轴 · {target.name}{target.xiaoWai ? ' · 小外流' : ''}</span>
      </div>

      {!build.school && (
        <div className="note" style={{ marginTop: 0, marginBottom: 14 }}>先在左侧选择当前流派，毕业率对照该流派的毕业轴。</div>
      )}

      <div className="grad-hero">
        <span className="num">{pct(result.overall, 0)}</span>
        <span className="meta">
          {gradLevel(result.overall)}
          <br />
          词条命中 {result.affixHit.matched}/{result.affixHit.total}
          {target.set !== undefined && <> · 套装一致 {pct(result.setMatch, 0)}</>}
          <br />
          词条质量 {pct(result.affixQuality, 0)}
        </span>
      </div>

      <div className="stat-block" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 6 }}>
        <div className="stat-item">
          <div className="k">当前 DPS</div>
          <div className="v cinnabar">{curDps !== null ? int(curDps) : '暂无轴数据'}</div>
        </div>
        <div className="stat-item">
          <div className="k">毕业轴 DPS（110 阶基线）</div>
          <div className="v gold">{target.baselineDps ? int(target.baselineDps) : '暂无轴数据'}</div>
        </div>
      </div>

      <EChart option={option} height={280} />

      {suggestions.length > 0 && (
        <>
          <div className="stat-section-label">培养建议（差距最大）</div>
          <ul className="suggest">
            {suggestions.map((s) => (
              <li key={s.stat}>
                <b>{s.stat}</b>：当前 {s.rate ? pct(s.current) : int(s.current)} / 目标 {s.rate ? pct(s.target) : int(s.target)}
                <span className="hint"> — {s.hint}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
