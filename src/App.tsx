import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import type { SlotId } from './data/slots'
import { loadableSchools, SCHOOLS, type SchoolDef } from './data/schools'
import { buildFromPreset, computePanel, type Build } from './engine/calculate'
import { buildFromHash, buildUrlWithBuild, parseBuildJson } from './utils/serialize'
import EquipmentSlots from './components/EquipmentSlots'
import EquipmentPicker from './components/EquipmentPicker'
import AffixEditor from './components/AffixEditor'
import PanelDisplay from './components/PanelDisplay'
import SetBonusPanel from './components/SetBonusPanel'
import AffixContribution from './components/AffixContribution'
import GraduationPanel from './components/GraduationPanel'
import CompareView, { type Scheme } from './components/CompareView'
import PresetLoader from './components/PresetLoader'

const BUILD_KEY = 'yanyun-builds:main'
const SCHEMES_KEY = 'yanyun-builds:schemes'

const isBuild = (b: unknown): b is Build =>
  !!b && typeof (b as Build).items === 'object' && typeof (b as Build).chosenAffixes === 'object'

function loadSaved(): Build {
  try {
    const raw = localStorage.getItem(BUILD_KEY)
    if (raw) {
      const b = JSON.parse(raw) as unknown
      if (isBuild(b)) return b
    }
  } catch {
    /* 忽略损坏数据 */
  }
  const s = loadableSchools()[0]
  return { ...buildFromPreset(s), school: s.id }
}

function loadSchemes(): Scheme[] {
  try {
    const raw = localStorage.getItem(SCHEMES_KEY)
    if (raw) {
      const arr = JSON.parse(raw) as Scheme[]
      if (Array.isArray(arr)) return arr
    }
  } catch {
    /* 忽略损坏数据 */
  }
  return []
}

export default function App() {
  const [build, setBuild] = useState<Build>(loadSaved)
  const [schemes, setSchemes] = useState<Scheme[]>(loadSchemes)
  const [pickerSlot, setPickerSlot] = useState<SlotId | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<SlotId | null>(null)
  const [schemeName, setSchemeName] = useState('')
  const [copied, setCopied] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // URL 分享：打开带 #b= 的链接直接还原配装
  useEffect(() => {
    const fromUrl = buildFromHash()
    if (fromUrl) setBuild(fromUrl)
  }, [])

  useEffect(() => {
    try { localStorage.setItem(BUILD_KEY, JSON.stringify(build)) } catch { /* 忽略 */ }
  }, [build])
  useEffect(() => {
    try { localStorage.setItem(SCHEMES_KEY, JSON.stringify(schemes)) } catch { /* 忽略 */ }
  }, [schemes])

  const result = useMemo(() => computePanel(build), [build])

  const equip = (slot: SlotId, itemId: string) =>
    setBuild((b) => ({ ...b, items: { ...b.items, [slot]: itemId } }))

  const removeItem = (slot: SlotId) =>
    setBuild((b) => {
      const items = { ...b.items }
      const chosenAffixes = { ...b.chosenAffixes }
      const affixValues = { ...(b.affixValues ?? {}) }
      const chengyin = { ...(b.chengyin ?? {}) }
      const dingyinAffixes = { ...(b.dingyinAffixes ?? {}) }
      const dingyinValues = { ...(b.dingyinValues ?? {}) }
      delete items[slot]
      delete chosenAffixes[slot]
      delete affixValues[slot]
      delete chengyin[slot]
      delete dingyinAffixes[slot]
      delete dingyinValues[slot]
      return { ...b, items, chosenAffixes, affixValues, chengyin, dingyinAffixes, dingyinValues }
    })

  const setAffixes = (slot: SlotId, affixIds: string[]) =>
    setBuild((b) => ({ ...b, chosenAffixes: { ...b.chosenAffixes, [slot]: affixIds } }))

  const setAffixValue = (slot: SlotId, affixId: string, value: number | null) =>
    setBuild((b) => {
      const slotVals = { ...(b.affixValues?.[slot] ?? {}) }
      if (value === null) delete slotVals[affixId]
      else slotVals[affixId] = value
      return { ...b, affixValues: { ...(b.affixValues ?? {}), [slot]: slotVals } }
    })

  const setChengyin = (slot: SlotId, chengyin: boolean) =>
    setBuild((b) => ({ ...b, chengyin: { ...(b.chengyin ?? {}), [slot]: chengyin } }))

  const loadPreset = (s: SchoolDef) =>
    setBuild({ ...buildFromPreset(s), school: s.id, wuku: s.attrType })

  const setSet = (id: string | null) =>
    setBuild((b) => ({ ...b, set: id ?? undefined }))
  const setSchool = (id: string) =>
    setBuild((b) => ({ ...b, school: id }))
  const setWuku = (type: string) =>
    setBuild((b) => ({ ...b, wuku: type }))
  const setDingyin = (slot: SlotId, affixId: string | null) =>
    setBuild((b) => {
      const dingyinAffixes = { ...(b.dingyinAffixes ?? {}) }
      const dingyinValues = { ...(b.dingyinValues ?? {}) }
      if (affixId === null) {
        delete dingyinAffixes[slot]
        delete dingyinValues[slot]
      } else {
        dingyinAffixes[slot] = [affixId]
        delete dingyinValues[slot] // 新选定音默认满值（不受承音 ×0.94 影响）
      }
      return { ...b, dingyinAffixes, dingyinValues }
    })

  const setDingyinValue = (slot: SlotId, affixId: string, value: number | null) =>
    setBuild((b) => {
      const slotVals = { ...(b.dingyinValues?.[slot] ?? {}) }
      if (value === null) delete slotVals[affixId]
      else slotVals[affixId] = value
      return { ...b, dingyinValues: { ...(b.dingyinValues ?? {}), [slot]: slotVals } }
    })

  // ---- 方案库 ----
  const saveScheme = () => {
    const name = schemeName.trim()
    if (!name) return
    setSchemes((prev) => [...prev, { id: `s${Date.now()}`, name, build: structuredClone(build) }])
    setSchemeName('')
  }
  const loadScheme = (s: Scheme) => setBuild(structuredClone(s.build))
  const deleteScheme = (id: string) => setSchemes((prev) => prev.filter((s) => s.id !== id))

  // ---- 导出 / 导入 / 分享 ----
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(build, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'yanyun-build.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const onImportFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const b = parseBuildJson(String(reader.result ?? ''))
      if (b) setBuild(b)
      else alert('导入失败：不是有效的配装 JSON')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const clearBuild = () => {
    if (!window.confirm('确定清空当前配装？（流派与武库保留）')) return
    setBuild((b) => ({
      items: {},
      chosenAffixes: {},
      affixValues: {},
      dingyinAffixes: {},
      dingyinValues: {},
      chengyin: {},
      set: undefined,
      school: b.school,
      wuku: b.wuku,
    }))
  }

  const copyLink = async () => {
    const link = buildUrlWithBuild(build)
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      window.prompt('复制分享链接', link)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="seal">燕</div>
        <div>
          <h1>燕云配装</h1>
          <div className="sub">《燕云十六声》配装模拟器 · 110 级数据 · 词条可调 · 面板实时计算 · 毕业率 · 配装对比</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
          <div className="header-actions">
            <input ref={fileRef} type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={onImportFile} />
            <button className="btn small" onClick={() => fileRef.current?.click()}>导入 JSON</button>
            <button className="btn small" onClick={exportJson}>导出 JSON</button>
            <button className="btn small" onClick={copyLink}>{copied ? '已复制 ✓' : '复制分享链接'}</button>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--paper-faint)' }}>示例配装：</span>
            <PresetLoader onLoad={loadPreset} />
            <button className="btn small" onClick={clearBuild}>清空配装</button>
          </div>
        </div>
      </header>

      <div className="layout">
        <div>
          <div className="card">
            <div className="card-title">
              流派与武库
            </div>
            <div className="wuku-row">
              <label>
                当前流派：
                <select value={build.school ?? ''} onChange={(e) => setSchool(e.target.value)}>
                  <option value="">未选择</option>
                  {SCHOOLS.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}（{s.weapons.join('/')}）</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="wuku-row" style={{ marginTop: 10 }}>
              <label>
                武库：
                <select
                  value={typeof build.wuku === 'string' ? build.wuku : 'tongyong'}
                  onChange={(e) => setWuku(e.target.value)}
                >
                  <option value="tongyong">通用武库（小外 +186 / 大外 +373）</option>
                  <option value="pozhu">破竹武库（小属攻 +186 / 大属攻 +373）</option>
                  <option value="mingjin">鸣金武库（小属攻 +186 / 大属攻 +373）</option>
                  <option value="qiansi">牵丝武库（小属攻 +186 / 大属攻 +373）</option>
                  <option value="lieshi">裂石武库（小属攻 +186 / 大属攻 +373）</option>
                </select>
              </label>
              
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              配装 <span className="hint">点击槽位选择装备</span>
            </div>
            <EquipmentSlots
              build={build}
              selected={selectedSlot}
              onSelect={(s) => {
                setSelectedSlot(s)
                // 已装备的槽位只切调律面板，不再弹选装；空槽位才打开选装
                if (!build.items[s]) setPickerSlot(s)
              }}
              onChange={(s) => { setSelectedSlot(s); setPickerSlot(s) }}
              onRemove={removeItem}
            />
          </div>
          <AffixEditor
            slot={selectedSlot ?? 'weapon1'}
            build={build}
            onSetAffixes={setAffixes}
            onSetAffixValue={setAffixValue}
            onSetChengyin={setChengyin}
            onSetDingyin={setDingyin}
            onSetDingyinValue={setDingyinValue}
          />

          <div className="card">
            <div className="card-title">方案库 <span className="hint">保存当前配装，便于对比/回访</span></div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="text-input"
                value={schemeName}
                onChange={(e) => setSchemeName(e.target.value)}
                placeholder="方案名称"
                onKeyDown={(e) => { if (e.key === 'Enter') saveScheme() }}
              />
              <button className="btn primary small" onClick={saveScheme}>保存当前</button>
            </div>
            {schemes.length === 0 && <div className="note">还没有保存的方案</div>}
            <div className="scheme-list">
              {schemes.map((s) => (
                <div key={s.id} className="scheme-row">
                  <span className="scheme-name">{s.name}</span>
                  <button className="btn small ghost" onClick={() => loadScheme(s)}>载入</button>
                  <button className="btn small ghost" onClick={() => deleteScheme(s.id)}>删除</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <GraduationPanel build={build} />
          <PanelDisplay result={result} />
          <SetBonusPanel value={build.set ?? null} onChange={setSet} />
          <AffixContribution build={build} />
        </div>
      </div>

      <CompareView current={build} schemes={schemes} />

      {pickerSlot && (
        <EquipmentPicker slot={pickerSlot} build={build} onEquip={equip} onClose={() => setPickerSlot(null)} />
      )}
    </div>
  )
}
