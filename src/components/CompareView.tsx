import { useState } from 'react'
import { computePanel, buildFromPreset, type Build } from '../engine/calculate'
import { buildDamage } from '../engine/contribution'
import { axisDamage } from '../engine/graduation'
import { getSchool, loadableSchools } from '../data/schools'
import { pct, int } from '../utils/format'
import StatRadar, { type RadarSeries } from './StatRadar'

export interface Scheme {
  id: string
  name: string
  build: Build
}

interface Props {
  current: Build
  schemes: Scheme[]
}

/** 单侧面板速览：三率 / 外功范围 / 属攻范围 / 期望 DPS（按该配装的流派基线校准） */
function CompactPanel({ build }: { build: Build }) {
  const { panel: p } = computePanel(build)
  const school = getSchool(build.school)
  const curExp = buildDamage(build)
  const axisExp = school ? axisDamage(build, school) : 0
  const dps = school?.baselineDps && axisExp > 0
    ? Math.round(school.baselineDps * (curExp / axisExp))
    : Math.round(curExp)
  return (
    <div className="stat-block" style={{ gridTemplateColumns: '1fr 1fr' }}>
      <div className="stat-item"><div className="k">精准</div><div className="v">{pct(p.precise)}</div></div>
      <div className="stat-item"><div className="k">会心</div><div className="v">{pct(p.crit)}</div></div>
      <div className="stat-item"><div className="k">会意</div><div className="v">{pct(p.critLike)}</div></div>
      <div className="stat-item"><div className="k">外功</div><div className="v">{int(p.minAtk)} ~ {int(p.maxAtk)}</div></div>
      <div className="stat-item"><div className="k">属攻</div><div className="v">{int(p.attrMinAtk)} ~ {int(p.attrMaxAtk)}</div></div>
      <div className="stat-item"><div className="k">期望 DPS</div><div className="v cinnabar">{int(dps)}</div></div>
    </div>
  )
}

/** 多配装对比：当前 + 最多 2 个参考（预设 / 方案 / 复制当前），雷达叠加 */
export default function CompareView({ current, schemes }: Props) {
  const [refs, setRefs] = useState<(Build | null)[]>([null, null])

  const setRef = (i: number, b: Build | null) => {
    setRefs((prev) => {
      const n = [...prev]
      n[i] = b
      return n
    })
  }

  const options = [
    { label: '— 不设置 —', value: 'none' },
    { label: '复制当前配装', value: 'copy' },
    ...loadableSchools().map((s) => ({ label: `示例·${s.name}`, value: `school:${s.id}` })),
    ...schemes.map((s) => ({ label: `方案·${s.name}`, value: `scheme:${s.id}` })),
  ]

  const resolve = (v: string): Build | null => {
    if (v === 'none') return null
    if (v === 'copy') return structuredClone(current)
    if (v.startsWith('school:')) {
      const s = loadableSchools().find((x) => x.id === v.slice(7))
      return s ? { ...buildFromPreset(s), school: s.id } : null
    }
    if (v.startsWith('scheme:')) {
      const s = schemes.find((x) => x.id === v.slice(7))
      return s ? structuredClone(s.build) : null
    }
    return null
  }

  const cur = computePanel(current)
  const series: RadarSeries[] = [{ name: '当前', stats: cur.panel }]
  refs.forEach((r, i) => {
    if (r) series.push({ name: `参考${i + 1}`, stats: computePanel(r).panel })
  })
  const colCount = 1 + refs.filter(Boolean).length

  return (
    <div className="card">
      <div className="card-title">配装对比 <span className="hint">参考可来自预设 / 方案 / 复制当前</span></div>
      <div className="compare-refs">
        {[0, 1].map((i) => (
          <label key={i} className="ref-sel">
            参考{i + 1}：
            <select onChange={(e) => setRef(i, resolve(e.target.value))} defaultValue="none">
              {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        ))}
        <button
          className="btn small ghost"
          onClick={() => {
            setRef(0, structuredClone(current))
            setRef(1, schemes[0] ? structuredClone(schemes[0].build) : null)
          }}
        >
          快速：当前 vs 首个方案
        </button>
      </div>
      <div className="compare-grid" style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)` }}>
        <div className="compare-col">
          <span className="tag current">当前配装</span>
          <CompactPanel build={current} />
        </div>
        {refs.map((r, i) => (
          <div className="compare-col" key={i}>
            <span className="tag ref">参考{i + 1}</span>
            {r ? <CompactPanel build={r} /> : <div className="note">未设置参考{i + 1}</div>}
          </div>
        ))}
      </div>
      <StatRadar series={series} />
    </div>
  )
}
