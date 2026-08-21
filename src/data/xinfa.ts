import type { StatKey } from './types'

/**
 * 心法数据（自动生成：wwm_audit/data/xinfa.json + game.json，勿手改）
 * 常驻面板属性 = 各 tier（t0-t6）无条件效果合并；命中触发/叠层机制记入 mechanism，不进面板
 */

export interface XinfaTierEffect {
  stat: string
  value: number
}

export interface XinfaDef {
  id: number
  name: string
  /** 常驻面板属性（全部 tier 合并去重） */
  stats: XinfaTierEffect[]
  /** 机制说明（命中触发/叠层等，不进入面板） */
  mechanism: string
}

/** 心法键 → 面板键映射（属攻类走 attrByType，见 calculate.applyXinfaStat） */
export const XINFA_STAT_MAP: Record<string, StatKey> = {
  addCritRate: 'directCrit',
  addSympathyRate: 'directCritLike',
  critBoost: 'critDmg',
  sympathyBoost: 'critLikeDmg',
  outerPen: 'pierce',
  outerPenAdd: 'pierce',
  bellstrikePen: 'wuxiangPierce',
  stonesplitPen: 'wuxiangPierce',
  silkbindPen: 'wuxiangPierce',
  bamboocutPen: 'wuxiangPierce',
  voidPen: 'wuxiangPierce',
  elemPen: 'wuxiangPierce',
  globalDmgBoost: 'globalDmg',
  physDmgBoost: 'globalDmg',
  hitRate: 'precise',
  critRate: 'crit',
  sympathyRate: 'critLike',
  minPhysATKAdd: 'minAtk',
  maxPhysATKAdd: 'maxAtk',
  physDef: 'def',
  maxHp: 'hp',
}

const E = (stat: string, value: number): XinfaTierEffect => ({ stat, value })

export const XINFA: Record<number, XinfaDef> = {
  1: { id: 1, name: '生龙活虎', stats: [E('globalDmgBoost', 0.0325), E('maxHp', 1941)], mechanism: '-40% Endurance dash cost / +30% Movement (3s) / +1% Max HP +1000 HP per kill。汎用 移動/回復系。' },
  2: { id: 2, name: '晚雪间', stats: [E('globalDmgBoost', 0.0325), E('maxHp', 1941)], mechanism: '戦闘開始後12s 気血60%未満で 4s雪見効果、 毎秒気血 2%+600回復 (300s CD)。 汎用 回復系。' },
  3: { id: 3, name: '铁身诀', stats: [E('globalDmgBoost', 0.0325), E('physDef', 25.5)], mechanism: '攻撃を受ける時 硬直が出にくくなる (首領/プレイヤー攻撃では非発動)。 汎用 行動妨害軽減系。' },
  4: { id: 4, name: '山月无影', stats: [E('globalDmgBoost', 0.0325), E('minPhysATKAdd', 56.8), E('physDmgBoost', 0.022)], mechanism: '命門一閃 奇襲距離+1.5m + 与ダメ+10%、 奇襲成功で気血5%回復。 汎用。' },
  5: { id: 5, name: '极乐泣血', stats: [E('critBoost', 0.035), E('globalDmgBoost', 0.0325), E('maxPhysATKAdd', 56.8)], mechanism: '10%確率で泣血付与、 5stack蓄積→刺傷ダメ。 汎用攻撃系 (少し強め)。' },
  6: { id: 6, name: '沙摆尾', stats: [E('globalDmgBoost', 0.0325), E('physDef', 25.5)], mechanism: '鱗舞追月 ニシキゴイ変身中 突進/跳躍消費-50%、 形態終了で気血シールド1生成。 汎用。' },
  41: { id: 41, name: '征人归', stats: [E('globalDmgBoost', 0.05), E('minPhysATKAdd', 63.9), E('outerPenAdd', 5.1)], mechanism: '+5% all damage/healing / -5s cooldown after hit / +5% damage taken (Cage)' },
  42: { id: 42, name: '所恨年年', stats: [E('globalDmgBoost', 0.04), E('hitRate', 0.066), E('outerPen', 5), E('physDmgBoost', 0.025)], mechanism: '毒スタック → 敵 外功防御/耐性 デバフ。 汎用。' },
  43: { id: 43, name: '归燕经', stats: [E('globalDmgBoost', 0.05), E('maxHp', 2184)], mechanism: 'とどめ技で 与ダメ基準 気血回復。 汎用 (吸血/真気系)。' },
  44: { id: 44, name: '怒斩马', stats: [E('globalDmgBoost', 0.05), E('physDef', 28.7)], mechanism: '奇術精気リソース系 (精気回復/獲得)。 汎用。' },
  45: { id: 45, name: '长生无相', stats: [E('globalDmgBoost', 0.05), E('maxPhysATKAdd', 63.9), E('outerPenAdd', 5.1)], mechanism: '受け流し成功で長生バフ (与ダメ+10%/確定会心/確定会意 1択、10s、30sCD)。 汎用。' },
  46: { id: 46, name: '婆娑影', stats: [E('globalDmgBoost', 0.05), E('hitRate', 0.066)], mechanism: '完全回避で消費気力返還/被ダメ減/回避強化。 汎用。' },
  47: { id: 47, name: '明晦同尘', stats: [E('globalDmgBoost', 0.05), E('maxPhysATKAdd', 42.5), E('minPhysATKAdd', 21.3), E('outerPenAdd', 5.1)], mechanism: '帰義/鏖戦 効果 (直接ダメ+/被ダメ- + 敵/自気血欠損で追加上昇)。 汎用。' },
  48: { id: 48, name: '丹心篆', stats: [E('globalDmgBoost', 0.05), E('maxHp', 2184)], mechanism: '気血<30%で警戒/惕心バフ (回復+被ダメ減)、詰問デバフで敵与ダメ減。 汎用。' },
  81: { id: 81, name: '易水歌', stats: [E('addCritRate', 0.046), E('globalDmgBoost', 0.052), E('maxPhysATKAdd', 47.2222), E('minPhysATKAdd', 23.6667), E('outerPen', 10)], mechanism: '5 stack × (+2 物理貫通, +1% damage·heal, 12s)。衰弱中 stack/効果 倍 (Tier3)。Tier5 +4.6% 直接会心率' },
  82: { id: 82, name: '四时无常', stats: [E('globalDmgBoost', 0.05), E('maxPhysATKAdd', 47.2222), E('minPhysATKAdd', 23.6667), E('physDmgBoost', 0.028)], mechanism: '武変技発動完了時 春/夏/秋/冬 1効果ランダム獲得、 30s/10s稼働' },
  101: { id: 101, name: '千山法', stats: [E('addSympathyRate', 0.03), E('bellstrikePen', 6), E('globalDmgBoost', 0.04), E('maxBellstrike', 24.1111), E('minBellstrike', 12.1111)], mechanism: '無銘の槍専用 — 乾坤定/長風効果強化、山移/真気不均衡 関連。 紫。' },
  102: { id: 102, name: '燎原星火', stats: [E('globalDmgBoost', 0.05), E('maxPhysATKAdd', 42.5), E('minPhysATKAdd', 21.3), E('physDmgBoost', 0.025)], mechanism: '気力消費返還/星火スタック。 汎用扱い (kongfuRequiredなし)。' },
  103: { id: 103, name: '威猛歌', stats: [E('globalDmgBoost', 0.05), E('sympathyBoost', 0.052), E('sympathyRate', 0.036)], mechanism: '溜め技ダメ強化 (対Boss/低気力プレイヤー)。無銘の剣/断魂の刀/破陣の刀で100%、他武器で50%。' },
  104: { id: 104, name: '无名心法', stats: [E('addSympathyRate', 0.023), E('globalDmgBoost', 0.065), E('maxPhysATKAdd', 71)], mechanism: '無銘の剣 専用心法。 複数剣気 + 気湧効果。' },
  151: { id: 151, name: '逐狼心经', stats: [E('globalDmgBoost', 0.05), E('sympathyBoost', 0.052), E('sympathyRate', 0.036)], mechanism: '蛇神の槍専用 — 六酔槍連撃数短縮 + 無愁酒/急流バフ + 呪い酒デバフ。 紫。' },
  152: { id: 152, name: '移经易武', stats: [E('bellstrikeDmgBoost', 0.03), E('globalDmgBoost', 0.05), E('maxBellstrike', 36.2222)], mechanism: '近接武器(剣/槍/双剣/斬馬刀/横刀)武芸効果 + 武変技強化。 紫。 ※横刀IDは未マッピングのため除外。' },
  153: { id: 153, name: '凝神章', stats: [E('addSympathyRate', 0.03), E('globalDmgBoost', 0.04), E('maxPhysATKAdd', 42.5), E('minPhysATKAdd', 21.3), E('outerPenAdd', 5.1)], mechanism: '鋼鳴系剣/槍専用 — 会意で集中値→看破状態 (会意ダメ+/被ダメ-/付加会意率+/持続ダメ+)。 紫。' },
  154: { id: 154, name: '剑气纵横', stats: [E('addSympathyRate', 0.023), E('globalDmgBoost', 0.065), E('maxPhysATKAdd', 71)], mechanism: '九変の剣 専用心法。 縦横の剣追撃 + 流血バースト。' },
  301: { id: 301, name: '葫芦飞飞', stats: [E('globalDmgBoost', 0.05), E('hitRate', 0.066), E('silkbindPen', 6)], mechanism: '墨筆の扇専用 — 春尽山空 CD/ダメ強化、無頼の浮名 連携。 紫。' },
  302: { id: 302, name: '春雷篇', stats: [E('globalDmgBoost', 0.05), E('maxPhysATKAdd', 42.5), E('minPhysATKAdd', 21.3), E('physDmgBoost', 0.025)], mechanism: '墨筆の扇/千紅の傘専用 — 武術技後 春雷stack (重/重追/軽/弾道 +15%気血ダメ消費)。 紫。' },
  303: { id: 303, name: '纵地摘星', stats: [E('maxPhysATKAdd', 42.5), E('minPhysATKAdd', 21.3), E('outerPenAdd', 5.1), E('physDmgBoost', 0.075)], mechanism: '墨筆の扇専用 — 滞骨/浮遊で外功攻撃力上昇 (条件分岐多)。 紫。' },
  304: { id: 304, name: '花上月令', stats: [E('addCritRate', 0.046), E('critRate', 0.082), E('globalDmgBoost', 0.065)], mechanism: '千紅の傘 専用心法。 春恨み連続命中効果 + 弾道技ダメ強化。' },
  351: { id: 351, name: '君臣药', stats: [E('addCritRate', 0.046), E('critRate', 0.082), E('globalDmgBoost', 0.065)], mechanism: '薬川の扇 専用心法。 ヒーラー支援/回復系。' },
  352: { id: 352, name: '杏花不见', stats: [E('globalDmgBoost', 0.05), E('minSilkbind', 36.2222)], mechanism: '薬川の扇/誘魂の傘専用 — 会心治療で養心/凝心 (治療量+)。 紫。' },
  353: { id: 353, name: '指玄篇注', stats: [E('critRate', 0.074), E('globalDmgBoost', 0.05)], mechanism: '薬川の扇専用 — 復活感知技 (貴き朝玉) 強化 (回復+/被ダメ-/分担)。 紫。' },
  354: { id: 354, name: '千丝蛊', stats: [E('globalDmgBoost', 0.05), E('maxPhysATKAdd', 42.5), E('minPhysATKAdd', 21.3)], mechanism: '誘魂の傘専用 — 千水余韻 露水リソース回復/治療強化。 紫。' },
  401: { id: 401, name: '山河绝韵', stats: [E('critBoost', 0.044), E('critRate', 0.082), E('globalDmgBoost', 0.065)], mechanism: '断魂の刀 専用心法。 防御カウンター + 重撃溜め技バースト。' },
  402: { id: 402, name: '困兽心经', stats: [E('globalDmgBoost', 0.05), E('maxHp', 2184)], mechanism: '断魂の刀専用 — 気血<30%でシールド (困獣の闘い)。 紫。' },
  403: { id: 403, name: '抗造大法', stats: [E('globalDmgBoost', 0.05), E('maxStonesplit', 24.1111), E('minStonesplit', 12.1111), E('stonesplitPen', 6)], mechanism: '断魂の刀専用 — 気血シールド+4秒/吸収量+10%/保護時与ダメ+5%等' },
  404: { id: 404, name: '磐石诀', stats: [E('globalDmgBoost', 0.05), E('maxHp', 2184)], mechanism: '嵐雷の槍専用 — 挑発で風雷の嘯きDR+20/5% (max20%)、効果時 与ダメ-10%' },
  451: { id: 451, name: '忘川绝响', stats: [E('critBoost', 0.044), E('critRate', 0.082), E('globalDmgBoost', 0.065)], mechanism: 'ignore 10% Physical Defense and 10% Bamboocut Resistance。物理防御無視 (Bamboocut 武術専用)' },
  452: { id: 452, name: '心弥泥鱼', stats: [E('globalDmgBoost', 0.05), E('minPhysATKAdd', 63.9), E('outerPenAdd', 5.1)], mechanism: '浮塵の縄 鼠召喚強化心法。 鼠ダメ = 与ダメ50%想定。' },
  453: { id: 453, name: '断石之构', stats: [E('addCritRate', 0.041), E('globalDmgBoost', 0.05), E('hitRate', 0.066)], mechanism: '汎用 — 力尽き敵会心で崩解1stack、stack毎+5外功貫通/+5%会心ダメ (T0最大3、T4で5)、3秒持続' },
  454: { id: 454, name: '沧浪剑诀', stats: [E('bamboocutPen', 6), E('globalDmgBoost', 0.05), E('minBamboocut', 36.2222)], mechanism: '浮塵の縄/墨筆の扇/千紅の傘専用 — 妨害系命中で現武術CD-1s (10s毎1回)' },
  501: { id: 501, name: '千营一呼', stats: [E('critRate', 0.082), E('globalDmgBoost', 0.052), E('outerPen', 5), E('physDmgBoost', 0.028)], mechanism: '醉夢の傘 専用心法。 紅綃香断 幻影傘召喚+共鳴ダメ。' },
  502: { id: 502, name: '绳舟行木', stats: [E('globalDmgBoost', 0.05), E('minPhysATKAdd', 63.9), E('outerPenAdd', 5.1)], mechanism: '浮雲の縄専用 — 浄虚一掃後恩文字+50、貫穿の鏢失魂付与、初段引き寄せ' },
  503: { id: 503, name: '灯儿亮', stats: [E('bamboocutPen', 6), E('globalDmgBoost', 0.05), E('minBamboocut', 36.2222)], mechanism: '汎用 — 3体以上同時命中で燭影付与、stack毎 移動-4%/被ダメ+2%、最大5' },
  504: { id: 504, name: '大唐歌', stats: [E('critBoost', 0.04), E('globalDmgBoost', 0.05), E('hitRate', 0.066)], mechanism: '誘魂の傘専用 — 武術技ダメで唐歌、HP≥50%時 stack毎 critBoost+2% (最大5)' },
  551: { id: 551, name: '霜天白夜', stats: [E('addCritRate', 0.046), E('globalDmgBoost', 0.065), E('minPhysATKAdd', 71)], mechanism: '斬雪の刀 専用心法。 受け流し→雪払いバースト + 忘機効果。' },
  552: { id: 552, name: '孤忠不辞', stats: [E('critBoost', 0.04), E('critRate', 0.074), E('globalDmgBoost', 0.05)], mechanism: '破陣の刀専用 — 焚此心3段溜め、鉄衣成魂中 斬馬刀安西軍出現+跳び斬り' },
  553: { id: 553, name: '穿喉诀', stats: [E('critBoost', 0.15), E('globalDmgBoost', 0.02), E('maxStonesplit', 24.1111), E('minStonesplit', 12.1111), E('outerPen', 15), E('stonesplitPen', 6)], mechanism: '斬雪・断魂30%/墨筆・千紅15%/他0% — 軽重撃派生で穿喉8s/最大3 (T4で5)、stack毎 outerRes無視2/critBoost+2%' },
  554: { id: 554, name: '燎原踏', stats: [E('globalDmgBoost', 0.05), E('maxPhysATKAdd', 42.5), E('minPhysATKAdd', 21.3), E('physDmgBoost', 0.025)], mechanism: '汎用 — 強靭時 全ダメ+4%、周囲3m(T1で5m)内 敵1体毎+1%(最大+3%)' },
  601: { id: 601, name: '扶摇直上', stats: [E('addCritRate', 0.046), E('globalDmgBoost', 0.065), E('minPhysATKAdd', 71)], mechanism: "天志拳 専用 — Heaven's Will 3 bars で Charged Heavy → Vile Condemned: End 進化。 2026-07 実装予定 (新 BambooCut – Kite path)" },
  602: { id: 602, name: '擒天势', stats: [E('critBoost', 0.04), E('critRate', 0.074), E('globalDmgBoost', 0.05)], mechanism: "千機の縄 専用 — Heaven's Might / Falcon's Pursuit / Snaring Lash 関連。 2026-07 実装予定 (新 BambooCut – Kite path)" },
  603: { id: 603, name: '三穷致知', stats: [E('elemPen', 5), E('globalDmgBoost', 0.02), E('maxPhysATKAdd', 42.5), E('minPhysATKAdd', 21.3), E('outerPen', 5), E('physDmgBoost', 0.025)], mechanism: '汎用 — Cognition(格物) stack。 T0/T3/T6 = 貫通系、 T1/T4 = globalDmgBoost。 T2/T5 以外の全 tier に発動条件 kongfuRequired = 天志の拳(20901) or 浮塵の縄(20701) 装備 (不一致 → 該当 tier effects 全 skip、 globalDmgBoost 分も含む)。 維持は可能だが適用範囲 (武術発動効果ダメージ限定) が狭いため貫通は生値の 0.5× を計上。 天志の追加+2 分は貫通 tier のみ synergyMultiplier 2.0 で表現 (T1/T4 の globalDmgBoost には synergy を掛けない) → 非天志 外功5/属性5、 天志 外功10/属性10' },
  604: { id: 604, name: '天行健', stats: [E('globalDmgBoost', 0.05), E('maxVoid', 24.1111), E('minVoid', 12.1111), E('voidPen', 6)], mechanism: '汎用 — Ceaseless stack。 T2 無相攻撃 / T5 無相貫通。 2026-07 実装予定 (新 BambooCut – Kite path)' },
  701: { id: 701, name: '一醉千秋', stats: [E('addCritRate', 0.046), E('globalDmgBoost', 0.065), E('minPhysATKAdd', 71)], mechanism: '一酔千秋 (瞬嵐・樽、懸身の拳20902専属)。2026-08-20パッチ新規。' },
  702: { id: 702, name: '飞仙醉言', stats: [E('critBoost', 0.04), E('critRate', 0.074), E('globalDmgBoost', 0.05)], mechanism: '飛仙酔言 (瞬嵐・樽、断水双訣20503専属)。2026-08-20パッチ新規。' },
  703: { id: 703, name: '燕别云岫', stats: [E('globalDmgBoost', 0.02), E('maxPhysATKAdd', 42.5), E('minPhysATKAdd', 21.3), E('outerPen', 21), E('physDmgBoost', 0.025)], mechanism: '燕別雲岫 (瞬嵐・樽、汎用・外功貫通特化)。2026-08-20パッチ新規。' },
  704: { id: 704, name: '大卷微身', stats: [E('globalDmgBoost', 0.05), E('maxVoid', 24.1111), E('minVoid', 12.1111), E('voidPen', 6)], mechanism: '大巻微身 (瞬嵐・樽、汎用・酔飲状態調整)。2026-08-20パッチ新規。' },
}


/** 按心法名取 */
export const getXinfaByName = (name: string): XinfaDef | undefined =>
  Object.values(XINFA).find((x) => x.name === name)