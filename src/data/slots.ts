/**
 * 装备槽位 —— 共 9 个：
 * 武器1 / 武器2 / 冠胄 / 胸甲 / 环 / 佩 / 胫甲 / 腕甲 / 弓
 *
 * 弓槽位点开后可选三把弓之一：饮羽（精准 6.2%）、惊弦（会心 7%）、追影（会意 3.5%）
 */
export type SlotId =
  | 'weapon1' | 'weapon2'
  | 'helm' | 'chest' | 'ring' | 'pendant' | 'legs' | 'wrist'
  | 'bow'

export interface SlotDef {
  id: SlotId
  name: string
  group: '武器' | '防具' | '饰品' | '弓'
}

export const SLOTS: SlotDef[] = [
  { id: 'weapon1',      name: '武器1',   group: '武器' },
  { id: 'weapon2',      name: '武器2',   group: '武器' },
  { id: 'helm',         name: '冠胄',   group: '防具' },
  { id: 'chest',        name: '胸甲',   group: '防具' },
  { id: 'ring',         name: '环',     group: '饰品' },
  { id: 'pendant',      name: '佩',     group: '饰品' },
  { id: 'legs',         name: '胫甲',   group: '防具' },
  { id: 'wrist',        name: '腕甲',   group: '防具' },
  { id: 'bow', name: '弓', group: '弓' },
]

export const slotName = (id: SlotId): string =>
  SLOTS.find((s) => s.id === id)?.name ?? id

export const slotGroup = (id: SlotId): string =>
  SLOTS.find((s) => s.id === id)?.group ?? '装备'
