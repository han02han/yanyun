import type { StatKey } from './types'

/**
 * 心法数据（中文名来自 WWM-METRICS i18n zh，效果来自 xinfa.json + xinfa_effects.json）。
 *
 * 每本心法结构（六重）：
 *  - t0/t1：常驻加成（多数 globalDmgBoost 0.01~0.013）
 *  - t2：世界等级门控属性加成（当前记录 WL15 档参考值；按世界等级细表见 wwm_audit/data/xinfa_effects.json）
 *  - t5：效果加成（直接会心/会意、会伤、增伤、穿透等）
 *
 * 验证：易水歌 t5 addCritRate 0.046 = 直接会心 4.6%（玩家确认一致）
 * 待补：相和歌（651）xinfa.json 无数据；t2 在 110 级对应的世界等级待确认
 */

export interface XinfaTierEffect {
  /** 目标面板键（部分为心法专用键，映射见 XINFA_STAT_MAP） */
  stat: string
  value: number
}

export interface XinfaDef {
  id: number
  name: string
  /** 常驻加成（t0/t1 合并） */
  t0: XinfaTierEffect[]
  /** 世界等级属性加成（WL15 档参考值） */
  t2: XinfaTierEffect[]
  /** 效果加成（t5） */
  t5: XinfaTierEffect[]
}

/** 心法专用键 → 面板键映射 */
export const XINFA_STAT_MAP: Record<string, StatKey> = {
  globalDmgBoost: 'bossDmg',   // 全局增伤（近似映射到面板增伤）
  minPhysATKAdd: 'minAtk',
  maxPhysATKAdd: 'maxAtk',
  minBellstrike: 'attrMinAtk', // 鸣金属攻
  maxBellstrike: 'attrMaxAtk',
  minStonesplit: 'attrMinAtk', // 裂石
  maxStonesplit: 'attrMaxAtk',
  minSilkbind: 'attrMinAtk',   // 牵丝
  maxSilkbind: 'attrMaxAtk',
  minBamboocut: 'attrMinAtk',  // 破竹
  maxBamboocut: 'attrMaxAtk',
  minVoid: 'attrMinAtk',       // 无相
  maxVoid: 'attrMaxAtk',
  critRate: 'crit',            // 会心率
  hitRate: 'precise',          // 精准率
  sympathyRate: 'critLike',    // 会意率
  addCritRate: 'directCrit',   // 直接会心
  addSympathyRate: 'directCritLike', // 直接会意
  critBoost: 'critDmg',        // 会心伤害
  sympathyBoost: 'critLikeDmg', // 会意伤害
  physDmgBoost: 'attrDmgBonus', // 外攻增伤（近似）
  outerPenAdd: 'pierce',       // 外攻穿透
  bellstrikePen: 'wuxiangPierce', // 鸣金穿透（近似）
  stonesplitPen: 'wuxiangPierce',
  silkbindPen: 'wuxiangPierce',
  bamboocutPen: 'wuxiangPierce',
  voidPen: 'wuxiangPierce',
  elemPen: 'wuxiangPierce',    // 属性穿透（近似）
  physDef: 'def',
  maxHp: 'hp',
}

const E = (stat: string, value: number): XinfaTierEffect => ({ stat, value })

export const XINFA: Record<number, XinfaDef> = {
  81: { id: 81, name: '易水歌', t0: [E('globalDmgBoost', 0.013)], t2: [E('minPhysATKAdd', 23.67), E('maxPhysATKAdd', 47.22)], t5: [E('addCritRate', 0.046)] },
  101: { id: 101, name: '千山法', t0: [E('globalDmgBoost', 0.01)], t2: [E('minBellstrike', 12.11), E('maxBellstrike', 24.11)], t5: [E('bellstrikePen', 6)] },
  102: { id: 102, name: '燎原星火', t0: [E('globalDmgBoost', 0.01)], t2: [E('minPhysATKAdd', 21.3), E('maxPhysATKAdd', 42.5)], t5: [E('physDmgBoost', 0.025)] },
  103: { id: 103, name: '威猛歌', t0: [E('globalDmgBoost', 0.01)], t2: [E('sympathyRate', 0.036)], t5: [E('sympathyBoost', 0.052)] },
  104: { id: 104, name: '无名心法', t0: [E('globalDmgBoost', 0.013)], t2: [E('maxPhysATKAdd', 71)], t5: [E('addSympathyRate', 0.023)] },
  151: { id: 151, name: '逐狼心经', t0: [E('globalDmgBoost', 0.01)], t2: [E('sympathyRate', 0.036)], t5: [E('sympathyBoost', 0.052)] },
  153: { id: 153, name: '凝神章', t0: [E('globalDmgBoost', 0.01)], t2: [E('minPhysATKAdd', 21.3), E('maxPhysATKAdd', 42.5)], t5: [E('outerPenAdd', 5.1)] },
  154: { id: 154, name: '剑气纵横', t0: [E('globalDmgBoost', 0.013)], t2: [E('maxPhysATKAdd', 71)], t5: [E('addSympathyRate', 0.023)] },
  302: { id: 302, name: '春雷篇', t0: [E('globalDmgBoost', 0.01)], t2: [E('minPhysATKAdd', 21.3), E('maxPhysATKAdd', 42.5)], t5: [E('physDmgBoost', 0.025)] },
  303: { id: 303, name: '纵地摘星', t0: [E('physDmgBoost', 0.025)], t2: [E('minPhysATKAdd', 21.3), E('maxPhysATKAdd', 42.5)], t5: [E('outerPenAdd', 5.1)] },
  304: { id: 304, name: '花上月令', t0: [E('globalDmgBoost', 0.013)], t2: [E('critRate', 0.082)], t5: [E('addCritRate', 0.046)] },
  351: { id: 351, name: '君臣药', t0: [E('globalDmgBoost', 0.013)], t2: [E('critRate', 0.082)], t5: [E('addCritRate', 0.046)] },
  352: { id: 352, name: '杏花不见', t0: [E('globalDmgBoost', 0.01)], t2: [E('minSilkbind', 36.22)], t5: [] },
  354: { id: 354, name: '千丝蛊', t0: [E('globalDmgBoost', 0.01)], t2: [E('minPhysATKAdd', 21.3), E('maxPhysATKAdd', 42.5)], t5: [] },
  401: { id: 401, name: '山河绝韵', t0: [E('globalDmgBoost', 0.013)], t2: [E('critRate', 0.082)], t5: [E('critBoost', 0.044)] },
  403: { id: 403, name: '抗造大法', t0: [E('globalDmgBoost', 0.01)], t2: [E('minStonesplit', 12.11), E('maxStonesplit', 24.11)], t5: [E('stonesplitPen', 6)] },
  451: { id: 451, name: '忘川绝响', t0: [E('globalDmgBoost', 0.013)], t2: [E('critRate', 0.082)], t5: [E('critBoost', 0.044)] },
  452: { id: 452, name: '心弥泥鱼', t0: [E('globalDmgBoost', 0.01)], t2: [E('minPhysATKAdd', 63.9)], t5: [E('outerPenAdd', 5.1)] },
  453: { id: 453, name: '断石之构', t0: [E('globalDmgBoost', 0.01)], t2: [E('hitRate', 0.066)], t5: [E('addCritRate', 0.041)] },
  501: { id: 501, name: '千营一呼', t0: [E('globalDmgBoost', 0.013)], t2: [E('critRate', 0.082)], t5: [E('physDmgBoost', 0.028)] },
  502: { id: 502, name: '绳舟行木', t0: [E('globalDmgBoost', 0.01)], t2: [E('minPhysATKAdd', 63.9)], t5: [E('outerPenAdd', 5.1)] },
  503: { id: 503, name: '灯儿亮', t0: [E('globalDmgBoost', 0.01)], t2: [E('minBamboocut', 36.22)], t5: [E('bamboocutPen', 6)] },
  504: { id: 504, name: '大唐歌', t0: [E('globalDmgBoost', 0.01)], t2: [E('hitRate', 0.066)], t5: [E('critBoost', 0.04)] },
  551: { id: 551, name: '霜天白夜', t0: [E('globalDmgBoost', 0.013)], t2: [E('minPhysATKAdd', 71)], t5: [E('addCritRate', 0.046)] },
  552: { id: 552, name: '孤忠不辞', t0: [E('globalDmgBoost', 0.01)], t2: [E('critRate', 0.074)], t5: [E('critBoost', 0.04)] },
  553: { id: 553, name: '穿喉诀', t0: [E('globalDmgBoost', 0.01)], t2: [E('minStonesplit', 12.11), E('maxStonesplit', 24.11)], t5: [E('stonesplitPen', 6)] },
  554: { id: 554, name: '燎原踏', t0: [E('globalDmgBoost', 0.01)], t2: [E('minPhysATKAdd', 21.3), E('maxPhysATKAdd', 42.5)], t5: [E('physDmgBoost', 0.025)] },
  601: { id: 601, name: '扶摇直上', t0: [E('globalDmgBoost', 0.013)], t2: [E('minPhysATKAdd', 71)], t5: [E('addCritRate', 0.046)] },
  602: { id: 602, name: '擒天势', t0: [E('globalDmgBoost', 0.01)], t2: [E('critRate', 0.074)], t5: [E('critBoost', 0.04)] },
  603: { id: 603, name: '三穷致知', t0: [E('elemPen', 3)], t2: [E('minPhysATKAdd', 21.3), E('maxPhysATKAdd', 42.5)], t5: [E('physDmgBoost', 0.025)] },
  604: { id: 604, name: '天行健', t0: [E('globalDmgBoost', 0.01)], t2: [E('minVoid', 12.11), E('maxVoid', 24.11)], t5: [E('voidPen', 6)] },
  701: { id: 701, name: '一醉千秋', t0: [E('globalDmgBoost', 0.013)], t2: [E('minPhysATKAdd', 71)], t5: [E('addCritRate', 0.046)] },
  702: { id: 702, name: '飞仙醉言', t0: [E('globalDmgBoost', 0.01)], t2: [E('critRate', 0.074)], t5: [E('critBoost', 0.04)] },
  703: { id: 703, name: '燕别云岫', t0: [E('globalDmgBoost', 0.01)], t2: [E('minPhysATKAdd', 21.3), E('maxPhysATKAdd', 42.5)], t5: [E('physDmgBoost', 0.025)] },
  41: { id: 41, name: '征人归', t0: [E('globalDmgBoost', 0.01)], t2: [E('minPhysATKAdd', 63.9)], t5: [E('outerPenAdd', 5.1)] },
  42: { id: 42, name: '所恨年年', t0: [E('globalDmgBoost', 0.01)], t2: [E('hitRate', 0.066)], t5: [E('physDmgBoost', 0.025)] },
  44: { id: 44, name: '怒斩马', t0: [E('globalDmgBoost', 0.01)], t2: [E('physDef', 28.7)], t5: [] },
  82: { id: 82, name: '四时无常', t0: [E('globalDmgBoost', 0.01)], t2: [E('minPhysATKAdd', 23.67), E('maxPhysATKAdd', 47.22)], t5: [E('physDmgBoost', 0.028)] },
}

/** 按心法名取（学校心法表按名字引用） */
export const getXinfaByName = (name: string): XinfaDef | undefined =>
  Object.values(XINFA).find((x) => x.name === name)
