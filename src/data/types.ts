/** 五维属性键：体、御、劲、敏、势 */
export type WuxingKey = 'ti' | 'yu' | 'jin' | 'min' | 'shi'

/** 面板统计键（五维 + 战斗属性）。比率类（precise/crit/critLike 等）以小数 0-1 存储 */
export type StatKey =
  | WuxingKey
  | 'hp'        // 气血
  | 'def'       // 外功防御
  | 'minAtk'    // 最小外攻
  | 'maxAtk'    // 最大外攻
  | 'attrMinAtk' // 最小属攻（本系×1.5；无相视为本系属攻）
  | 'attrMaxAtk' // 最大属攻
  | 'precise'   // 精准率
  | 'crit'      // 会心率
  | 'critLike'  // 会意率
  | 'critDmg'   // 会心伤害加成（面板加成，装备词条不出）
  | 'critLikeDmg' // 会意伤害加成
  | 'attrDmgBonus' // 属性伤害加成（武学派生，按本系属攻触发）
  | 'directCrit'   // 直接会心率（白=黄，不衰减）
  | 'directCritLike' // 直接会意率（白=黄，不衰减）
  | 'allSkillDmg' // 全武学增伤
  | 'weaponDmg' // 武器增伤
  | 'bossDmg'   // 首领增伤
  | 'singleQishuDmg' // 单体奇术增伤（冠胄/胸甲词条）
  | 'groupQishuDmg'  // 群体奇术增伤（冠胄/胸甲词条）
  | 'playerDmg'      // 对玩家单位增效（胫甲/腕甲词条，PVP）
  | 'pierce'         // 外攻穿透（定音·左四件）
  | 'wuxiangPierce'  // 无相穿透（定音·左四件）
  | 'defResist'      // 外攻抗性（定音·左四件）
  | 'skillDmg'       // 指定武学技能增伤（定音·右四件，按流派武学）
  | 'chargeDmg'      // 蓄力技增伤（定音·右四件）
  | 'specialDmg'     // 特殊技增伤（定音·右四件）
  | 'specSkillDmg'   // 指定武学增效（调律词条）
  | 'swordDmg'       // 剑武学增效
  | 'spearDmg'       // 枪武学增效
  | 'umbrellaDmg'    // 伞武学增效
  | 'fanDmg'         // 扇武学增效
  | 'ropeDartDmg'    // 绳镖武学增效
  | 'twinBladeDmg'   // 双刀武学增效
  | 'saberDmg'       // 陌刀武学增效
  | 'hengdaoDmg'     // 横刀武学增效
  | 'fistDmg'        // 拳甲武学增效
  | 'drumDmg'        // 鼓武学增效

/** 完整面板统计 */
export interface Stats {
  ti: number
  yu: number
  jin: number
  min: number
  shi: number
  hp: number
  def: number
  minAtk: number
  maxAtk: number
  attrMinAtk: number
  attrMaxAtk: number
  precise: number
  crit: number
  critLike: number
  critDmg: number
  critLikeDmg: number
  attrDmgBonus: number
  directCrit: number
  directCritLike: number
  allSkillDmg: number
  weaponDmg: number
  bossDmg: number
  singleQishuDmg: number
  groupQishuDmg: number
  playerDmg: number
  pierce: number
  wuxiangPierce: number
  defResist: number
  skillDmg: number
  chargeDmg: number
  specialDmg: number
  specSkillDmg: number
  swordDmg: number
  spearDmg: number
  umbrellaDmg: number
  fanDmg: number
  ropeDartDmg: number
  twinBladeDmg: number
  saberDmg: number
  hengdaoDmg: number
  fistDmg: number
  drumDmg: number
}

/** 统计键显示名 */
export const STAT_LABEL: Record<StatKey, string> = {
  ti: '体', yu: '御', jin: '劲', min: '敏', shi: '势',
  hp: '气血', def: '外防',
  minAtk: '小外攻', maxAtk: '大外攻',
  attrMinAtk: '小属攻', attrMaxAtk: '大属攻',
  precise: '精准', crit: '会心', critLike: '会意',
  critDmg: '会心伤害加成', critLikeDmg: '会意伤害加成',
  attrDmgBonus: '属性伤害加成',
  directCrit: '直接会心', directCritLike: '直接会意',
  allSkillDmg: '全武学增效', weaponDmg: '武器增伤', bossDmg: '对首领单位增伤',
  singleQishuDmg: '单体类奇术增伤', groupQishuDmg: '群体类奇术增伤', playerDmg: '对玩家单位增效',
  pierce: '外攻穿透', wuxiangPierce: '无相穿透', defResist: '外攻抗性',
  skillDmg: '指定武学技能增伤', chargeDmg: '蓄力技增伤', specialDmg: '特殊技增伤',
  specSkillDmg: '指定武学增效',
  swordDmg: '剑武学增效', spearDmg: '枪武学增效', umbrellaDmg: '伞武学增效', fanDmg: '扇武学增效',
  ropeDartDmg: '绳镖武学增效', twinBladeDmg: '双刀武学增效', saberDmg: '陌刀武学增效',
  hengdaoDmg: '横刀武学增效', fistDmg: '拳甲武学增效', drumDmg: '鼓武学增效',
}

/** 是否为比率类（按百分比展示） */
export const RATE_KEYS: ReadonlySet<StatKey> = new Set([
  'precise', 'crit', 'critLike', 'critDmg', 'critLikeDmg', 'attrDmgBonus', 'directCrit', 'directCritLike',
  'allSkillDmg', 'weaponDmg', 'bossDmg',
  'singleQishuDmg', 'groupQishuDmg', 'playerDmg',
  'skillDmg', 'chargeDmg', 'specialDmg', 'specSkillDmg',
  'swordDmg', 'spearDmg', 'umbrellaDmg', 'fanDmg', 'ropeDartDmg',
  'twinBladeDmg', 'saberDmg', 'hengdaoDmg', 'fistDmg', 'drumDmg',
])
