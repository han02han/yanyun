import { useMemo } from 'react'
import { AFFIXES, affixAllowedIn, FIRST_AFFIX_POOLS, getAffix } from '../data/affixes'
import { getEquipment, mainAffixOf, QUALITY_LABEL } from '../data/equipment'
import { type SlotId, slotName } from '../data/slots'
import { FORMULAS } from '../data/formulas'
import type { Build } from '../engine/calculate'
import { RATE_KEYS, STAT_LABEL, type StatKey } from '../data/types'

interface Props {
  slot: SlotId
  build: Build
  onSetAffixes: (slot: SlotId, affixIds: string[]) => void
  /** 填写词条实际数值；null = 恢复默认（满值/承音满值） */
  onSetAffixValue: (slot: SlotId, affixId: string, value: number | null) => void
  onSetChengyin: (slot: SlotId, chengyin: boolean) => void
  onSetDingyin: (slot: SlotId, affixId: string | null) => void
  /** 填写定音词条实际数值；null = 恢复默认（满值/承音满值） */
  onSetDingyinValue: (slot: SlotId, affixId: string, value: number | null) => void
}

/** 调律词条上限（玩家确认：一个装备 = 主词条 + 5 个调律词条 + 1 个定音词条） */
const MAX_AFFIXES = 5

/** 神力类词条（增伤：全武学增效/对首领单位增伤/武器武学增效；玩家确认优先级很高） */
const POWER_STATS: ReadonlySet<StatKey> = new Set([
  'allSkillDmg', 'bossDmg',
  'swordDmg', 'spearDmg', 'umbrellaDmg', 'fanDmg', 'ropeDartDmg',
  'twinBladeDmg', 'saberDmg', 'hengdaoDmg', 'fistDmg', 'drumDmg',
])

/** 词条上限（承音装备 = 满值×0.94） */
const maxRefOf = (affixValue: number, chengyin: boolean): number =>
  chengyin ? affixValue * FORMULAS.chengyin : affixValue

const fmtVal = (stat: StatKey, v: number): string =>
  RATE_KEYS.has(stat) ? `${(v * 100).toFixed(2)}%` : v.toFixed(2)

/** 输入值统一保留两位小数（百分比按百分数两位，数值按两位） */
const roundStored = (isRate: boolean, num: number): number =>
  isRate ? Math.round(num * 10000) / 10000 : Math.round(num * 100) / 100

const dispVal = (isRate: boolean, val: number): number =>
  isRate ? +(val * 100).toFixed(2) : +val.toFixed(2)

/** 调律编辑器：5 个调律词条（数值自填，不可超上限）+ 定音词条 + 承音开关 */
export default function AffixEditor({ slot, build, onSetAffixes, onSetAffixValue, onSetChengyin, onSetDingyin, onSetDingyinValue }: Props) {
  const item = getEquipment(build.items[slot])
  const chengyin = !!build.chengyin?.[slot]

  const currentIds = item ? (build.chosenAffixes[slot] ?? []) : []
  const innate = item ? mainAffixOf(item) : undefined
  const innateText = innate
    ? Object.entries(innate).map(([k, v]) => `${STAT_LABEL[k as StatKey]} +${v}`).join('，')
    : ''
  const qualityLabel = item?.quality ? QUALITY_LABEL[item.quality] : '—'
  const dingyin = build.dingyinAffixes?.[slot] ?? []

  const addable = useMemo(() => {
    if (!item) return []
    // 生成规则（玩家确认）：
    //  第 1 条（主调律）受部位池限制（FIRST_AFFIX_POOLS）
    //  第 2-5 条从完整池洗入：可与第 1 条重复，彼此不能重复
    const firstId = currentIds[0]
    const firstPool = FIRST_AFFIX_POOLS[slot]
    const allowed = AFFIXES.filter((a) => {
      if (currentIds.length === 0 && firstPool && !firstPool.includes(a.id)) return false
      if (a.id.startsWith('dy')) return false // 定音词条不出在调律池
      return affixAllowedIn(a.id, slot) &&
        (!a.weaponType || a.weaponType === item.weaponType) &&
        (a.id === firstId || !currentIds.slice(1).includes(a.id))
    })
    // 神力（增伤）词条优先，其余保持词条库顺序；不做收益排序
    return [
      ...allowed.filter((a) => POWER_STATS.has(a.stat)),
      ...allowed.filter((a) => !POWER_STATS.has(a.stat)),
    ]
  }, [build, slot, item, currentIds])

  const dingyinPool = useMemo(
    () => (item ? AFFIXES.filter((a) => a.id.startsWith('dy') && affixAllowedIn(a.id, slot)) : []),
    [item, slot],
  )

  if (!item) {
    return (
      <div className="card">
        <div className="card-title">调律 · {slotName(slot)}</div>
        <div className="note">上方选择一个已装备部位，即可调律（洗）词条、定音、填写词条数值。</div>
      </div>
    )
  }

  // 按位置删除（重复词条时只删点中的那一条）
  const remove = (idx: number) => onSetAffixes(slot, currentIds.filter((_, i) => i !== idx))
  const add = (id: string) => {
    if (currentIds.length >= MAX_AFFIXES) return
    onSetAffixes(slot, [...currentIds, id])
  }

  return (
    <div className="card">
      <div className="card-title">
        调律 · {slotName(slot)}
        <span className="hint">{item.name} · {qualityLabel}</span>
      </div>

      <label className="chengyin-box">
        <input
          type="checkbox"
          checked={chengyin}
          onChange={(e) => onSetChengyin(slot, e.target.checked)}
        />
        承音
      </label>

      <div className="stat-section-label">调律词条（{currentIds.length}/{MAX_AFFIXES}）</div>
      <div className="affix-chips">
        {currentIds.map((id, i) => {
          const a = getAffix(id)
          if (!a) return null
          const maxRef = maxRefOf(a.value, chengyin)
          const stored = build.affixValues?.[slot]?.[id]
          const val = stored ?? maxRef
          const isRate = RATE_KEYS.has(a.stat)
          return (
            <span key={`${id}-${i}`} className="affix-chip">
              <span className="cat">{a.category}</span>
              {a.name}
              <input
                type="number"
                className="affix-val"
                step="0.01"
                min={0}
                max={isRate ? +(maxRef * 100).toFixed(2) : maxRef}
                // 百分比词条按 % 前的数字填（4% 填 4），内部按小数存；不可超上限；统一两位小数
                value={dispVal(isRate, val)}
                onChange={(e) => {
                  const v = e.target.value
                  if (v === '') {
                    onSetAffixValue(slot, id, null)
                    return
                  }
                  let num = isRate ? Number(v) / 100 : Number(v)
                  if (num > maxRef) num = maxRef
                  onSetAffixValue(slot, id, roundStored(isRate, num))
                }}
              />
              {isRate && <span className="affix-max">%</span>}
              <span className="affix-max">上限 {fmtVal(a.stat, maxRef)}</span>
              <button className="full-btn" onClick={() => onSetAffixValue(slot, id, maxRef)} title="一键填满">满</button>
              <button
                className="x"
                disabled={i === 0 && currentIds.length > 1}
                onClick={() => remove(i)}
                title={i === 0 && currentIds.length > 1 ? '主调律（第 1 条）不可删除' : '移除词条'}
              >×</button>
            </span>
          )
        })}
        {currentIds.length === 0 && <span className="note" style={{ marginTop: 0 }}>无调律词条</span>}
      </div>

      {addable.length > 0 && currentIds.length < MAX_AFFIXES && (
        <>
          <div className="stat-section-label">可洗入词条（神力类优先）</div>
          <div className="affix-pool">
            {addable.map((affix) => (
              <button
                key={affix.id}
                className={`affix-opt ${POWER_STATS.has(affix.stat) ? 'power' : ''}`}
                onClick={() => add(affix.id)}
                title={`${affix.stat} 满值 ${fmtVal(affix.stat, affix.value)}`}
              >
                {POWER_STATS.has(affix.stat) && <span className="badge">神力</span>}
                {affix.name}
              </button>
            ))}
          </div>
        </>
      )}
      {currentIds.length >= MAX_AFFIXES && (
        <div className="note">已达 5 个调律词条上限，先移除一个再洗入。</div>
      )}

      <div className="stat-section-label">定音词条（每件 1 个，数值自填）</div>
      <div className="affix-chips">
        {dingyin.map((id) => {
          const a = getAffix(id)
          if (!a) return null
          const maxRef = a.value // 定音不受承音 ×0.94 限制
          const isRate = RATE_KEYS.has(a.stat)
          const stored = build.dingyinValues?.[slot]?.[id]
          const val = stored ?? maxRef
          return (
            <span key={id} className="affix-chip">
              <span className="cat">定音</span>
              {a.name}
              <input
                type="number"
                className="affix-val"
                step="0.01"
                min={0}
                max={isRate ? +(maxRef * 100).toFixed(2) : maxRef}
                value={dispVal(isRate, val)}
                onChange={(e) => {
                  const v = e.target.value
                  if (v === '') {
                    onSetDingyinValue(slot, id, null)
                    return
                  }
                  let num = isRate ? Number(v) / 100 : Number(v)
                  if (num > maxRef) num = maxRef
                  onSetDingyinValue(slot, id, roundStored(isRate, num))
                }}
              />
              {isRate && <span className="affix-max">%</span>}
              <span className="affix-max">上限 {fmtVal(a.stat, maxRef)}</span>
              <button className="full-btn" onClick={() => onSetDingyinValue(slot, id, maxRef)} title="一键填满">满</button>
              <button className="x" onClick={() => onSetDingyin(slot, null)} title="取消定音">×</button>
            </span>
          )
        })}
        {dingyin.length === 0 && <span className="note" style={{ marginTop: 0 }}>未定音</span>}
      </div>
      {dingyin.length === 0 && dingyinPool.length > 0 && (
        <div className="affix-pool">
          {dingyinPool.map((a) => (
            <button key={a.id} className="affix-opt" onClick={() => onSetDingyin(slot, a.id)} title={a.note}>
              {a.name}
            </button>
          ))}
        </div>
      )}

      <div className="note">
        主词条（{qualityLabel}）：{innateText || '无'}
      </div>
    </div>
  )
}
