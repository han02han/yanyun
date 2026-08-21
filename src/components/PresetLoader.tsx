import { loadableSchools, type SchoolDef } from '../data/schools'

interface Props {
  onLoad: (s: SchoolDef) => void
  activeId?: string
}

/** 载入示例配装（仅列出有示例装备数据的流派） */
export default function PresetLoader({ onLoad, activeId }: Props) {
  const schools = loadableSchools()
  return (
    <div className="preset-row">
      {schools.map((s) => (
        <button
          key={s.id}
          className="preset-chip"
          style={activeId === s.id ? { borderColor: 'var(--cinnabar)' } : undefined}
          onClick={() => onLoad(s)}
          title={s.desc}
        >
          <div className="p-name">{s.name}</div>
          <div className="p-school">示例配装</div>
        </button>
      ))}
    </div>
  )
}
