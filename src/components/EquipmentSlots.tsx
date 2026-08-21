import { SLOTS, type SlotId } from '../data/slots'
import { getEquipment, mainAffixOf, QUALITY_LABEL, type EquipmentItem } from '../data/equipment'
import { RATE_KEYS, STAT_LABEL, type StatKey } from '../data/types'
import type { Build } from '../engine/calculate'

interface Props {
  build: Build
  selected: SlotId | null
  onSelect: (slot: SlotId) => void
  /** 打开选装弹层（更换装备） */
  onChange: (slot: SlotId) => void
  onRemove: (slot: SlotId) => void
}

/** 槽位总览：空槽位点击选装；已装备槽位点击切调律，悬停可更换/卸下 */
/** 主词条实际加的属性文案 */
const innateText = (item: EquipmentItem): string => {
  const innate = mainAffixOf(item)
  if (!innate) return ''
  return Object.entries(innate)
    .map(([k, v]) => {
      const key = k as StatKey
      const val = RATE_KEYS.has(key) ? `${(v * 100).toFixed(2)}%` : String(v)
      return `${STAT_LABEL[key]} +${val}`
    })
    .join('，')
}

export default function EquipmentSlots({ build, selected, onSelect, onChange, onRemove }: Props) {
  return (
    <div className="slot-grid">
      {SLOTS.map((slot) => {
        const item = getEquipment(build.items[slot.id])
        const tunedCount = build.chosenAffixes[slot.id]?.length ?? 0
        return (
          <div
            key={slot.id}
            className={`slot-card ${item ? 'equipped' : 'empty'} ${tunedCount > 0 ? 'tuned' : ''} ${selected === slot.id ? 'selected' : ''}`}
            onClick={() => onSelect(slot.id)}
          >
            <div className="slot-name">{slot.name}</div>
            {item ? (
              <>
                <div className="item-name" title={item.name}>{item.name}</div>
                <div className="quality">{item.quality ? `${QUALITY_LABEL[item.quality]}·Lv${item.level}` : `Lv${item.level}`}</div>
                {item.weaponType && <div style={{ fontSize: 11, color: 'var(--gold)' }}>{item.weaponType}</div>}
                {innateText(item) && <div className="slot-innate">{innateText(item)}</div>}
                {tunedCount > 0
                  ? <div className="tuned-badge">已调律 {tunedCount}/5</div>
                  : <div className="untuned-badge">未调律</div>}
                <div className="slot-actions">
                  <button className="change-btn" onClick={(e) => { e.stopPropagation(); onChange(slot.id) }}>更换</button>
                  <button className="remove-btn" onClick={(e) => { e.stopPropagation(); onRemove(slot.id) }}>卸下</button>
                </div>
              </>
            ) : (
              <div className="item-name">空</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
