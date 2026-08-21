# -*- coding: utf-8 -*-
"""从 WWM-METRICS skilldata/kongfu/*.json 生成 src/data/skills.ts（架子，数字待校正）"""
import json, os, urllib.request

BASE_URL = 'https://raw.githubusercontent.com/Sh1get0ra/WWM-METRICS/main/data/skilldata/kongfu/'
OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'skills.ts')

# 武学 id → 中文名（与 kongfu.ts 一致）
NAMES = {
    '10101': '积矩九剑', '10102': '无名剑法', '10201': '九曲惊神枪', '10202': '无名枪法',
    '10301': '千香引魂蛊', '10302': '青山执笔', '20103': '八方风雷枪', '20401': '嗟夫刀法',
    '20402': '十方破阵', '20501': '泥犁三垢', '20503': '断水双诀', '20601': '九重春色',
    '20602': '明川药典', '20603': '醉梦游春', '20701': '粟子游尘', '20702': '粟子行云',
    '20703': '千机索天', '20801': '斩雪刀法', '20901': '天志垂象', '20902': '悬身拳法',
}

TARGET_LV = 110


def fetch(kid):
    req = urllib.request.Request(BASE_URL + kid + '.json')
    return json.loads(urllib.request.urlopen(req, timeout=60).read().decode('utf-8'))


def at_level(byLevel, lv):
    """取指定等级的倍率（无该级则取最接近且 ≤lv 的档）"""
    lvs = byLevel.get('lv', [])
    if not lvs:
        return None
    i = -1
    for idx, L in enumerate(lvs):
        if L <= lv:
            i = idx
        else:
            break
    if i < 0:
        i = 0
    return {
        'phys': byLevel.get('physCoef', [0])[i],
        'elem': byLevel.get('elemCoefBase', [0])[i],
        'flat': byLevel.get('skillConst', [0])[i],
        'lv': lvs[i],
    }


L = []
L.append("import type { StatKey } from './types'")
L.append("")
L.append("/**")
L.append(" * 技能倍率数据（架子，数字待校正 —— 来源 WWM-METRICS skilldata，为 lv110 快照）")
L.append(" * 每技能一 hit：外功倍率 / 属性倍率 / 固伤。")
L.append(" * ⚠️ elemCoefBase 语义待确认（当前多为 1）；无帧数/攻击间隔，不能直接做轮转 DPS")
L.append(" */")
L.append("")
L.append("export interface SkillHit {")
L.append("  /** 技能名（中文，如 无名剑法-蓄力技-无以为家-1档） */")
L.append("  name: string")
L.append("  /** 类型：active/charged/special/light/heavy… */")
L.append("  type: string")
L.append("  /** 外功倍率 */")
L.append("  physCoef: number")
L.append("  /** 属性倍率（语义待确认） */")
L.append("  elemCoef: number")
L.append("  /** 固定伤害 */")
L.append("  flat: number")
L.append("  /** 数据对应等级 */")
L.append("  lv: number")
L.append("}")
L.append("")
L.append("export interface KongfuSkills {")
L.append("  id: string")
L.append("  name: string")
L.append("  skills: SkillHit[]")
L.append("}")
L.append("")
L.append("/** 技能库（lv110 快照，数字待校正） */")
L.append("export const SKILLS: Record<string, KongfuSkills> = {")
for kid in sorted(NAMES):
    try:
        d = fetch(kid)
    except Exception as e:
        print('跳过 %s: %s' % (kid, e))
        continue
    hits = []
    for sid, s in d.get('skills', {}).items():
        v = at_level(s.get('byLevel', {}), TARGET_LV)
        if not v:
            continue
        hits.append({
            'name': s.get('nameZh') or sid,
            'type': s.get('skillType') or '?',
            'phys': round(v['phys'], 4),
            'elem': round(v['elem'], 4),
            'flat': round(v['flat'], 2),
            'lv': v['lv'],
        })
    items = ',\n    '.join(
        "{ name: %r, type: %r, physCoef: %s, elemCoef: %s, flat: %s, lv: %d }"
        % (h['name'], h['type'], h['phys'], h['elem'], h['flat'], h['lv']) for h in hits
    )
    L.append("  %r: { id: %r, name: %r, skills: [\n    %s\n  ] }," % (kid, kid, NAMES[kid], items))
L.append("}")
L.append("")
L.append("/** 取某武学技能列表 */")
L.append("export const getSkills = (id: string | undefined): SkillHit[] =>")
L.append("  (id ? SKILLS[id]?.skills : undefined) ?? []")

with open(OUT, 'w', encoding='utf-8') as f:
    f.write('\n'.join(L))
print('生成完成:', OUT)
