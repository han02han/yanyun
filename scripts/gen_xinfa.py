# -*- coding: utf-8 -*-
"""从 wwm_audit/data/xinfa.json + game.json 生成 src/data/xinfa.ts"""
import json, os

BASE = os.path.join(os.path.dirname(__file__), '..', 'wwm_audit', 'data')
OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'xinfa.ts')

game = json.load(open(os.path.join(BASE, 'game.json'), encoding='utf-8'))
xf = json.load(open(os.path.join(BASE, 'xinfa.json'), encoding='utf-8'))
names = game['xinfa']

MAP = {
    'addCritRate': 'directCrit', 'addSympathyRate': 'directCritLike',
    'critBoost': 'critDmg', 'sympathyBoost': 'critLikeDmg',
    'outerPen': 'pierce', 'outerPenAdd': 'pierce',
    'bellstrikePen': 'wuxiangPierce', 'stonesplitPen': 'wuxiangPierce',
    'silkbindPen': 'wuxiangPierce', 'bamboocutPen': 'wuxiangPierce',
    'voidPen': 'wuxiangPierce', 'elemPen': 'wuxiangPierce',
    'globalDmgBoost': 'globalDmg', 'physDmgBoost': 'globalDmg',
    'hitRate': 'precise', 'critRate': 'crit', 'sympathyRate': 'critLike',
    'minPhysATKAdd': 'minAtk', 'maxPhysATKAdd': 'maxAtk',
    'physDef': 'def', 'maxHp': 'hp',
}

L = []
L.append("import type { StatKey } from './types'")
L.append("")
L.append("/**")
L.append(" * 心法数据（自动生成：wwm_audit/data/xinfa.json + game.json，勿手改）")
L.append(" * 常驻面板属性 = 各 tier（t0-t6）无条件效果合并；命中触发/叠层机制记入 mechanism，不进面板")
L.append(" */")
L.append("")
L.append("export interface XinfaTierEffect {")
L.append("  stat: string")
L.append("  value: number")
L.append("}")
L.append("")
L.append("export interface XinfaDef {")
L.append("  id: number")
L.append("  name: string")
L.append("  /** 常驻面板属性（全部 tier 合并去重） */")
L.append("  stats: XinfaTierEffect[]")
L.append("  /** 机制说明（命中触发/叠层等，不进入面板） */")
L.append("  mechanism: string")
L.append("}")
L.append("")
L.append("/** 心法键 → 面板键映射（属攻类走 attrByType，见 calculate.applyXinfaStat） */")
L.append("export const XINFA_STAT_MAP: Record<string, StatKey> = {")
for k, v in MAP.items():
    L.append(f"  {k}: '{v}',")
L.append("}")
L.append("")
L.append("export const XINFA: Record<number, XinfaDef> = {")
for kid in sorted(names, key=lambda x: int(x)):
    v = xf.get(kid)
    if not isinstance(v, dict):
        continue
    nm = names[kid].get('zh', '?')
    desc = (v.get('description') or '').strip()
    ab = v.get('attributeBuff', {})
    merged = {}
    for t in range(7):
        tier = ab.get('tier%d' % t, {})
        for k2, val in (tier.get('effects') or {}).items():
            if k2 == 'fixedScoreBonus':
                continue
            if k2 not in merged:
                merged[k2] = 0
            merged[k2] += val
    stats = ['E(%s, %s)' % (repr(k2), repr(round(v2, 4))) for k2, v2 in sorted(merged.items())]
    L.append("  %s: { id: %s, name: %r, stats: [%s], mechanism: %r }," % (kid, kid, nm, ', '.join(stats), desc))
L.append("}")
L.append("")
L.append("const E = (stat: string, value: number): XinfaTierEffect => ({ stat, value })")
L.append("")
L.append("/** 按心法名取 */")
L.append("export const getXinfaByName = (name: string): XinfaDef | undefined =>")
L.append("  Object.values(XINFA).find((x) => x.name === name)")

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, 'w', encoding='utf-8') as f:
    f.write('\n'.join(L))
print('生成完成:', OUT)
print('心法数:', len([k for k in names if isinstance(xf.get(k), dict)]))
