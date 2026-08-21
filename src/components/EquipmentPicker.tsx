import { useState } from 'react'
import { type SlotId, slotName } from '../data/slots'
import { equipmentBySlot, mainAffixOf, QUALITY_LABEL, type EquipmentItem, type Quality } from '../data/equipment'
import { RATE_KEYS, STAT_LABEL, type StatKey } from '../data/types'
import { getSet } from '../data/sets'
import { equipDelta } from '../engine/contribution'
import type { Build } from '../engine/calculate'

interface Props {
  slot: SlotId
  build: Build
  onEquip: (slot: SlotId, itemId: string) => void
  onClose: () => void
}

/** 装备选择弹层：按槽位列出可选装备，按品阶筛选，并显示替换当前装备后的期望伤害增量 */
/** 主词条实际加的属性文案（如 精准 +6.2%） */
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

export default function EquipmentPicker({ slot, build, onEquip, onClose }: Props) {
  // 金/紫筛选只在武器槽显示；其他部位就两件，直接全列
  const isWeaponSlot = slot === 'weapon1' || slot === 'weapon2'
  const [filter, setFilter] = useState<Quality | 'all'>('all')
  const items = equipmentBySlot(slot).filter((i) => filter === 'all' || i.quality === filter)
  const qualities: Quality[] = ['gold', 'purple']
  const set = build.set ? getSet(build.set) : undefined

  return (
    <div className="modal-mask" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>选择 · {slotName(slot)}</h3>
        {set && (
          <div className="note" style={{ marginTop: 0, marginBottom: 12 }}>
            当前套装：<b style={{ color: 'var(--gold)' }}>{set.name}</b> —— {set.effect}
          </div>
        )}
        {isWeaponSlot && (
          <div className="filter-row">
            <button className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>全部</button>
            {qualities.map((q) => (
              <button key={q} className={filter === q ? 'on' : ''} onClick={() => setFilter(q)}>
                {QUALITY_LABEL[q]}
              </button>
            ))}
          </div>
        )}
        <div className="equip-list">
          {items.map((item) => {
            const delta = equipDelta(build, slot, item.id)
            return (
              <div key={item.id} className="equip-card" onClick={() => { onEquip(slot, item.id); onClose() }}>
                <div className="e-name">
                  {item.name}
                  <span className={`equip-delta ${delta > 0.5 ? 'up' : delta < -0.5 ? 'down' : 'eq'}`}>
                    {delta > 0.5 ? '+' : delta < -0.5 ? '−' : '—'}
                  </span>
                </div>
                <div className="e-meta">
                  {item.quality ? QUALITY_LABEL[item.quality] : '—'} · Lv{item.level}
                  {item.weaponType && <span> · {item.weaponType}</span>}
                </div>
                <div className="e-meta e-innate">{innateText(item)}</div>
              </div>
            )
          })}
          {items.length === 0 && <div className="note">该品阶暂无装备</div>}
        </div>
        <div className="note" style={{ marginTop: 12 }}>+ / − = 换上该装备后更强 / 更弱（按期望伤害比较）</div>
      </div>
    </div>
  )
}
