import { SETS } from '../data/sets'

interface Props {
  /** 选中的套装 id；null = 不使用套装 */
  value: string | null
  onChange: (id: string | null) => void
}

/** 套装选择（选用制：选哪套生效哪套，无件数触发） */
export default function SetBonusPanel({ value, onChange }: Props) {
  return (
    <div className="card">
      <div className="card-title">套装选择 <span className="hint">9 种 · 选用即生效</span></div>
      <div className="set-grid">
        <button className={`set-pick ${value === null ? 'on' : ''}`} onClick={() => onChange(null)}>
          <span className="name">不使用</span>
          <span className="effect">—</span>
        </button>
        {SETS.map((s) => (
          <button
            key={s.id}
            className={`set-pick ${value === s.id ? 'on' : ''}`}
            onClick={() => onChange(s.id)}
            title={s.effect}
          >
            <span className="name">{s.name}</span>
            <span className="effect">{s.effect}</span>
          </button>
        ))}
      </div>
      <div className="note">套装效果直接计入面板（如飞套 = 会意率 +7%，斗套 = 大外攻 +121）。</div>
    </div>
  )
}
