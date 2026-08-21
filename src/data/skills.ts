
/**
 * 技能倍率数据（架子，数字待校正 —— 来源 WWM-METRICS skilldata，为 lv110 快照）
 * 每技能一 hit：外功倍率 / 属性倍率 / 固伤。
 * ⚠️ elemCoefBase 语义待确认（当前多为 1）；无帧数/攻击间隔，不能直接做轮转 DPS
 */

export interface SkillHit {
  /** 技能名（中文，如 无名剑法-蓄力技-无以为家-1档） */
  name: string
  /** 类型：active/charged/special/light/heavy… */
  type: string
  /** 外功倍率 */
  physCoef: number
  /** 属性倍率（语义待确认） */
  elemCoef: number
  /** 固定伤害 */
  flat: number
  /** 数据对应等级 */
  lv: number
}

export interface KongfuSkills {
  id: string
  name: string
  skills: SkillHit[]
}

/** 技能库（lv110 快照，数字待校正） */
export const SKILLS: Record<string, KongfuSkills> = {
  '10101': { id: '10101', name: '积矩九剑', skills: [
    { name: '积矩九剑-蓄力技-次二衡径数', type: 'charged', physCoef: 2.6872, elemCoef: 1, flat: 33.7, lv: 110 },
    { name: '积矩九剑-特殊技-次三衡径数', type: 'special', physCoef: 0.9828, elemCoef: 1, flat: 11.9, lv: 110 },
    { name: '积矩九剑-主动技-内一衡径数-1段', type: 'active', physCoef: 0.5443, elemCoef: 1, flat: 34.8, lv: 110 },
    { name: '积矩九剑-主动技-内一衡径数-2段', type: 'active', physCoef: 0.5443, elemCoef: 1, flat: 34.8, lv: 110 },
    { name: '积矩九剑-主动技-内一衡径数-3段', type: 'active', physCoef: 0.4082, elemCoef: 1, flat: 34.8, lv: 110 },
    { name: '积矩九剑-主动技-内一衡径数-4段', type: 'active', physCoef: 0.4082, elemCoef: 1, flat: 34.8, lv: 110 },
    { name: '积矩九剑-主动技-内一衡径数-5段', type: 'active', physCoef: 0.8164, elemCoef: 1, flat: 34.8, lv: 110 },
    { name: '积矩九剑-蓄力技-次二衡径数', type: 'charged', physCoef: 1.881, elemCoef: 1, flat: 33.7, lv: 110 },
    { name: '通用流血爆炸单次结算', type: 'bleed', physCoef: 2.4, elemCoef: 1, flat: 0, lv: 110 },
    { name: '通用流血DOT单跳结算-1层', type: 'bleed', physCoef: 0.132, elemCoef: 1, flat: 0, lv: 110 },
    { name: '通用流血DOT单跳结算-2层', type: 'bleed', physCoef: 0.165, elemCoef: 1, flat: 0, lv: 110 },
    { name: '通用流血DOT单跳结算-3层', type: 'bleed', physCoef: 0.198, elemCoef: 1, flat: 0, lv: 110 },
    { name: '通用流血DOT单跳结算-4层', type: 'bleed', physCoef: 0.264, elemCoef: 1, flat: 0, lv: 110 },
    { name: '通用流血DOT单跳结算-5层', type: 'bleed', physCoef: 0.33, elemCoef: 1, flat: 0, lv: 110 }
  ] },
  '10102': { id: '10102', name: '无名剑法', skills: [
    { name: '无名剑法-蓄力技-无以为家-1档', type: 'charged', physCoef: 1.5113, elemCoef: 1, flat: 21, lv: 110 },
    { name: '无名剑法-特殊技-退亦有方-剑气', type: 'special', physCoef: 1.7685, elemCoef: 1, flat: 22.2, lv: 110 },
    { name: '无名剑法-特殊技-退亦有方-突进', type: 'special', physCoef: 1.086, elemCoef: 1, flat: 13.6, lv: 110 },
    { name: '无名剑法-主动技-出畏之-三连-1段', type: 'active', physCoef: 1.0255, elemCoef: 1, flat: 64.2, lv: 110 },
    { name: '无名剑法-主动技-出畏之-三连-2段', type: 'active', physCoef: 1.5383, elemCoef: 1, flat: 64.2, lv: 110 },
    { name: '无名剑法-主动技-出畏之-三连-3段', type: 'active', physCoef: 2.5638, elemCoef: 1, flat: 64.2, lv: 110 },
    { name: '无名剑法-蓄力技-无以为家-2档-1段', type: 'charged', physCoef: 3.2674, elemCoef: 1, flat: 46.6, lv: 110 },
    { name: '无名剑法-蓄力技-无以为家-2档-2段', type: 'charged', physCoef: 1.307, elemCoef: 1, flat: 46.6, lv: 110 },
    { name: '无名剑法-蓄力技-无以为家-2档-3段', type: 'charged', physCoef: 1.5684, elemCoef: 1, flat: 46.6, lv: 110 },
    { name: '无名剑法-蓄力技-无以为家-2档-4段', type: 'charged', physCoef: 1.8297, elemCoef: 1, flat: 46.6, lv: 110 }
  ] },
  '10201': { id: '10201', name: '九曲惊神枪', skills: [
    { name: '九曲-主动技-愁无酒-1段', type: 'active', physCoef: 0.3212, elemCoef: 1, flat: 20.5, lv: 110 },
    { name: '九曲-主动技-愁无酒-2段', type: 'active', physCoef: 0.5353, elemCoef: 1, flat: 20.5, lv: 110 },
    { name: '九曲-蓄力技-断蓬飞-1段', type: 'charged', physCoef: 3.7532, elemCoef: 1, flat: 76.2, lv: 110 },
    { name: '九曲-蓄力技-断蓬飞-2段', type: 'charged', physCoef: 6.2554, elemCoef: 1, flat: 76.2, lv: 110 },
    { name: '九曲-特殊技-扫千军-1段', type: 'special', physCoef: 1.713, elemCoef: 1, flat: 20.5, lv: 110 },
    { name: '九曲-特殊技-扫千军-2段', type: 'special', physCoef: 2.1412, elemCoef: 1, flat: 20.5, lv: 110 },
    { name: '九曲-特殊技-扫千军-3段', type: 'special', physCoef: 2.5695, elemCoef: 1, flat: 20.5, lv: 110 }
  ] },
  '10202': { id: '10202', name: '无名枪法', skills: [
    { name: '无名枪法-主动技-乾坤定', type: 'active', physCoef: 0.5742, elemCoef: 1, flat: 7.3, lv: 110 },
    { name: '无名枪法-蓄力技-扫连山-1档', type: 'charged', physCoef: 0.5011, elemCoef: 1, flat: 22.8, lv: 110 },
    { name: '无名枪法-突刺技-PLUS', type: 'other', physCoef: 0.9868, elemCoef: 1, flat: 12.4, lv: 110 },
    { name: '无名枪法-特殊技-万军破', type: 'special', physCoef: 0.9207, elemCoef: 1, flat: 11.6, lv: 110 },
    { name: '无名枪法-蓄力技-扫连山-2档-1段', type: 'charged', physCoef: 0.2253, elemCoef: 1, flat: 130.4, lv: 110 },
    { name: '无名枪法-蓄力技-扫连山-2档-2段', type: 'charged', physCoef: 1.0241, elemCoef: 1, flat: 130.4, lv: 110 },
    { name: '无名枪法-蓄力技-扫连山-2档-3段', type: 'charged', physCoef: 2.0483, elemCoef: 1, flat: 130.4, lv: 110 }
  ] },
  '10301': { id: '10301', name: '千香引魂蛊', skills: [
    { name: '跳劈', type: 'heavy', physCoef: 1.8418, elemCoef: 1, flat: 23.1, lv: 110 },
    { name: '轻击', type: 'light', physCoef: 1.9787, elemCoef: 1, flat: 24.4, lv: 110 },
    { name: '突进', type: 'other', physCoef: 1.0059, elemCoef: 1, flat: 12.6, lv: 110 }
  ] },
  '10302': { id: '10302', name: '青山执笔', skills: [
    { name: '武器技-扇.空中轻击', type: 'light', physCoef: 1.1614, elemCoef: 1, flat: 29.2, lv: 110 },
    { name: '武器技-扇.易武', type: 'weapon', physCoef: 1.0836, elemCoef: 1, flat: 22.7, lv: 110 },
    { name: '青山执笔-特殊技-突进上挑', type: 'special', physCoef: 1.2808, elemCoef: 1, flat: 16.1, lv: 110 },
    { name: '青山执笔-重击感知-强化浮空连击', type: 'variedCombo', physCoef: 3.0195, elemCoef: 1, flat: 37.8, lv: 110 },
    { name: '青山执笔-重击蓄力技-横扫', type: 'heavyCharged', physCoef: 2.4506, elemCoef: 1, flat: 42.6, lv: 110 },
    { name: '青山执笔-重击感知-浮空连击', type: 'variedCombo', physCoef: 1.2488, elemCoef: 1, flat: 15.7, lv: 110 },
    { name: '青山执笔-轻击蓄力技-龙卷风', type: 'lightCharged', physCoef: 1.9054, elemCoef: 1, flat: 23.9, lv: 110 },
    { name: '青山执笔-主动技-风墙', type: 'active', physCoef: 0.9281, elemCoef: 1, flat: 11.7, lv: 110 },
    { name: '武器技-扇.轻击-1段', type: 'light', physCoef: 0.5103, elemCoef: 1, flat: 46.3, lv: 110 },
    { name: '武器技-扇.轻击-2段', type: 'light', physCoef: 0.5103, elemCoef: 1, flat: 46.3, lv: 110 },
    { name: '武器技-扇.轻击-3段', type: 'light', physCoef: 0.4083, elemCoef: 1, flat: 46.3, lv: 110 },
    { name: '武器技-扇.轻击-4段', type: 'light', physCoef: 0.6124, elemCoef: 1, flat: 46.3, lv: 110 },
    { name: '武器技-扇.重击-1段', type: 'heavy', physCoef: 0.5502, elemCoef: 1, flat: 56.9, lv: 110 },
    { name: '武器技-扇.重击-2段', type: 'heavy', physCoef: 0.8803, elemCoef: 1, flat: 56.9, lv: 110 },
    { name: '武器技-扇.重击-3段', type: 'heavy', physCoef: 0.7703, elemCoef: 1, flat: 56.9, lv: 110 },
    { name: '跳劈', type: 'heavy', physCoef: 1.8418, elemCoef: 1, flat: 23.1, lv: 110 },
    { name: '轻击', type: 'light', physCoef: 1.9787, elemCoef: 1, flat: 24.4, lv: 110 },
    { name: '突进', type: 'other', physCoef: 1.0059, elemCoef: 1, flat: 12.6, lv: 110 }
  ] },
  '20103': { id: '20103', name: '八方风雷枪', skills: [
    { name: '八方风雷枪-主动技-风雷啸-嘲讽', type: 'active', physCoef: 0.3161, elemCoef: 1, flat: 5, lv: 110 },
    { name: '八方风雷枪-蓄力技-战八方', type: 'charged', physCoef: 2.5933, elemCoef: 1, flat: 38.4, lv: 110 },
    { name: '八方风雷枪-特殊技-惊雷震', type: 'special', physCoef: 1.0678, elemCoef: 1, flat: 13.5, lv: 110 },
    { name: '八方风雷枪-特殊技-惊雷震', type: 'special', physCoef: 1.6017, elemCoef: 1, flat: 13.5, lv: 110 }
  ] },
  '20401': { id: '20401', name: '嗟夫刀法', skills: [
    { name: '嗟夫刀法-特殊技-逐日追风', type: 'special', physCoef: 2.1352, elemCoef: 1, flat: 26.8, lv: 110 },
    { name: '嗟夫刀法-轻击蓄力技-风卷残云-1段', type: 'lightCharged', physCoef: 2.2866, elemCoef: 1, flat: 64.3, lv: 110 },
    { name: '嗟夫刀法-轻击蓄力技-风卷残云-2段', type: 'lightCharged', physCoef: 3.2012, elemCoef: 1, flat: 64.3, lv: 110 },
    { name: '嗟夫刀法-轻击蓄力技-风卷残云-3段', type: 'lightCharged', physCoef: 3.8872, elemCoef: 1, flat: 64.3, lv: 110 },
    { name: '嗟夫刀法-轻击蓄力技-风卷残云-4段', type: 'lightCharged', physCoef: 4.6646, elemCoef: 1, flat: 64.3, lv: 110 },
    { name: '嗟夫刀法-轻击蓄力技-风卷残云-5段', type: 'lightCharged', physCoef: 5.8307, elemCoef: 1, flat: 64.3, lv: 110 },
    { name: '嗟夫刀法-重击蓄力技-山崩地裂-1段', type: 'heavyCharged', physCoef: 2.7839, elemCoef: 1, flat: 73.5, lv: 110 },
    { name: '嗟夫刀法-重击蓄力技-山崩地裂-2段', type: 'heavyCharged', physCoef: 3.8975, elemCoef: 1, flat: 73.5, lv: 110 },
    { name: '嗟夫刀法-重击蓄力技-山崩地裂-3段', type: 'heavyCharged', physCoef: 4.8256, elemCoef: 1, flat: 73.5, lv: 110 },
    { name: '嗟夫刀法-重击蓄力技-山崩地裂-4段', type: 'heavyCharged', physCoef: 5.7905, elemCoef: 1, flat: 73.5, lv: 110 },
    { name: '嗟夫刀法-重击蓄力技-山崩地裂-5段', type: 'heavyCharged', physCoef: 7.2381, elemCoef: 1, flat: 73.5, lv: 110 },
    { name: '嗟夫刀法-轻击蓄力派生-1段', type: 'lightVariedCombo', physCoef: 2.5455, elemCoef: 1, flat: 32.1, lv: 110 },
    { name: '嗟夫刀法-轻击蓄力派生-2段', type: 'lightVariedCombo', physCoef: 3.1819, elemCoef: 1, flat: 32.1, lv: 110 },
    { name: '嗟夫刀法-重击蓄力派生-1段', type: 'variedCombo', physCoef: 3.4259, elemCoef: 1, flat: 32.4, lv: 110 },
    { name: '嗟夫刀法-重击蓄力派生-2段', type: 'variedCombo', physCoef: 4.2823, elemCoef: 1, flat: 32.4, lv: 110 }
  ] },
  '20402': { id: '20402', name: '十方破阵', skills: [
    { name: '狂澜陌刀-蓄力技-一蓄下劈', type: 'charged', physCoef: 1.3251, elemCoef: 1, flat: 25.4, lv: 110 },
    { name: '狂澜陌刀-主动技.横扫旋风', type: 'active', physCoef: 1.8958, elemCoef: 1, flat: 36.7, lv: 110 },
    { name: '狂澜陌刀-主动技.强化横扫旋风', type: 'active', physCoef: 3.5266, elemCoef: 1, flat: 44.1, lv: 110 },
    { name: '狂澜陌刀-蓄力技-二蓄下劈', type: 'charged', physCoef: 2.9434, elemCoef: 1, flat: 46, lv: 110 },
    { name: '狂澜陌刀-蓄力技-三蓄跳劈-1段', type: 'charged', physCoef: 5.7339, elemCoef: 1, flat: 76, lv: 110 },
    { name: '狂澜陌刀-蓄力技-三蓄跳劈-2段', type: 'charged', physCoef: 7.5688, elemCoef: 1, flat: 76, lv: 110 }
  ] },
  '20501': { id: '20501', name: '泥犁三垢', skills: [
    { name: '轻击1', type: 'light', physCoef: 0.4215, elemCoef: 1, flat: 5.2, lv: 110 },
    { name: '轻击2', type: 'light', physCoef: 0.4518, elemCoef: 1, flat: 5.7, lv: 110 },
    { name: '轻击3', type: 'light', physCoef: 0.5782, elemCoef: 1, flat: 7.3, lv: 110 },
    { name: '轻击4', type: 'light', physCoef: 0.5092, elemCoef: 1, flat: 6.4, lv: 110 },
    { name: '强化轻击1', type: 'lightEnhanced', physCoef: 0.6482, elemCoef: 1, flat: 8.04, lv: 110 },
    { name: '强化轻击2', type: 'lightEnhanced', physCoef: 0.9022, elemCoef: 1, flat: 12.48, lv: 110 },
    { name: '强化轻击3', type: 'lightEnhanced', physCoef: 1.4465, elemCoef: 1, flat: 14.9, lv: 110 },
    { name: '强化轻击4', type: 'lightEnhanced', physCoef: 1.7368, elemCoef: 1, flat: 17.9, lv: 110 },
    { name: '强化轻击5', type: 'lightEnhanced', physCoef: 2.5352, elemCoef: 1, flat: 22.7, lv: 110 },
    { name: '跳劈', type: 'heavy', physCoef: 1.0059, elemCoef: 1, flat: 12.6, lv: 110 },
    { name: '突进', type: 'other', physCoef: 0.7726, elemCoef: 1, flat: 9.7, lv: 110 },
    { name: '武器技-双刀.易武', type: 'weapon', physCoef: 0.7339, elemCoef: 1, flat: 9.2, lv: 110 },
    { name: '双刀-单人反击技', type: 'other', physCoef: 0.4136, elemCoef: 1, flat: 5.2, lv: 110 },
    { name: '泥犁三垢-主动技.痴障', type: 'active', physCoef: 1.3558, elemCoef: 1, flat: 14.5, lv: 110 },
    { name: '泥犁三垢-特殊技.贪祸', type: 'special', physCoef: 0.8115, elemCoef: 1, flat: 10.2, lv: 110 },
    { name: '泥犁三垢-特殊技.贪祸挥刀横砍（非完美）', type: 'special', physCoef: 1.8094, elemCoef: 1, flat: 22.32, lv: 110 },
    { name: '泥犁三垢-特殊技.贪祸断水（完美）', type: 'special', physCoef: 2.4771, elemCoef: 1, flat: 31.08, lv: 110 }
  ] },
  '20503': { id: '20503', name: '断水双诀', skills: [
    { name: '醉双刀-醉双刀.重击一段', type: 'heavy', physCoef: 0.3574, elemCoef: 1, flat: 5, lv: 110 },
    { name: '醉双刀-醉双刀.重击二段', type: 'heavy', physCoef: 0.5782, elemCoef: 1, flat: 7.3, lv: 110 },
    { name: '醉双刀-醉双刀.武学技', type: 'active', physCoef: 1.0571, elemCoef: 1, flat: 13.3, lv: 110 },
    { name: '醉双刀-醉双刀.武学技二段', type: 'active', physCoef: 0.805, elemCoef: 1, flat: 10.1, lv: 110 },
    { name: '醉双刀-醉双刀.特殊技', type: 'special', physCoef: 0.6597, elemCoef: 1, flat: 8.3, lv: 110 },
    { name: '醉双刀-醉双刀.强化特殊技（奥义）', type: 'special', physCoef: 6.799, elemCoef: 1, flat: 72.1, lv: 110 },
    { name: '醉双刀-醉双刀.轻击派生', type: 'lightVariedCombo', physCoef: 1.0525, elemCoef: 1, flat: 13.2, lv: 110 },
    { name: '醉双刀-醉双刀.重击派生', type: 'variedCombo', physCoef: 0.7337, elemCoef: 1, flat: 9.2, lv: 110 },
    { name: '醉双刀-醉双刀.强化重击一段', type: 'heavyEnhanced', physCoef: 0.5004, elemCoef: 1, flat: 6.3, lv: 110 },
    { name: '醉双刀-醉双刀.强化重击二段', type: 'heavyEnhanced', physCoef: 0.481, elemCoef: 1, flat: 6.1, lv: 110 },
    { name: '醉双刀-醉双刀.重击循环', type: 'heavy', physCoef: 1.1614, elemCoef: 1, flat: 15.6, lv: 110 },
    { name: '醉双刀-醉双刀.强化重击循环', type: 'heavyEnhanced', physCoef: 1.453, elemCoef: 1, flat: 24.3, lv: 110 }
  ] },
  '20601': { id: '20601', name: '九重春色', skills: [
    { name: '突进', type: 'other', physCoef: 0.8791, elemCoef: 1, flat: 11.1, lv: 110 },
    { name: '九重春色-重击连招派生B', type: 'variedCombo', physCoef: 1.1614, elemCoef: 1, flat: 17, lv: 110 },
    { name: '九重春色-轻击连招派生A', type: 'lightVariedCombo', physCoef: 0.9962, elemCoef: 1, flat: 9.7, lv: 110 },
    { name: '跳劈', type: 'heavy', physCoef: 0.4538, elemCoef: 1, flat: 5.7, lv: 110 },
    { name: '空中轻击', type: 'light', physCoef: 0.5004, elemCoef: 1, flat: 6.3, lv: 110 },
    { name: '九重春色-袖剑.空中轻击', type: 'light', physCoef: 0.7885, elemCoef: 1, flat: 9.9, lv: 110 },
    { name: '九重春色-袖剑.跳劈', type: 'heavy', physCoef: 2.011, elemCoef: 1, flat: 25.2, lv: 110 },
    { name: '九重春色-重击蓄力技-杏花天-1档-1段', type: 'heavyCharged', physCoef: 0.6262, elemCoef: 1, flat: 115.7, lv: 110 },
    { name: '九重春色-重击蓄力技-杏花天-1档-2段', type: 'heavyCharged', physCoef: 1.5656, elemCoef: 1, flat: 115.7, lv: 110 },
    { name: '九重春色-重击蓄力技-杏花天-1档-3段', type: 'heavyCharged', physCoef: 2.505, elemCoef: 1, flat: 115.7, lv: 110 },
    { name: '九重春色-轻击蓄力技-浮空炮-1段', type: 'lightCharged', physCoef: 0.2863, elemCoef: 1, flat: 65.1, lv: 110 },
    { name: '九重春色-轻击蓄力技-浮空炮-2段', type: 'lightCharged', physCoef: 1.7177, elemCoef: 1, flat: 65.1, lv: 110 },
    { name: '九重春色-主动技-眩晕炮-1段', type: 'active', physCoef: 1.4912, elemCoef: 1, flat: 20.3, lv: 110 },
    { name: '九重春色-主动技-眩晕炮-2段', type: 'active', physCoef: 2.3413, elemCoef: 1, flat: 20.3, lv: 110 },
    { name: '九重春色-袖剑.轻击-1段', type: 'light', physCoef: 0.2692, elemCoef: 1, flat: 27, lv: 110 },
    { name: '九重春色-袖剑.轻击-2段', type: 'light', physCoef: 0.5921, elemCoef: 1, flat: 27, lv: 110 },
    { name: '九重春色-袖剑.轻击-3段', type: 'light', physCoef: 0.646, elemCoef: 1, flat: 27, lv: 110 },
    { name: '九重春色-袖剑.轻击-4段', type: 'light', physCoef: 0.646, elemCoef: 1, flat: 27, lv: 110 },
    { name: '九重春色-袖剑.重击-1段', type: 'heavy', physCoef: 0.4795, elemCoef: 1, flat: 30, lv: 110 },
    { name: '九重春色-袖剑.重击-2段', type: 'heavy', physCoef: 0.7192, elemCoef: 1, flat: 30, lv: 110 },
    { name: '九重春色-袖剑.重击-3段', type: 'heavy', physCoef: 1.1987, elemCoef: 1, flat: 30, lv: 110 },
    { name: '轻击-1段', type: 'light', physCoef: 0.3049, elemCoef: 1, flat: 21.9, lv: 110 },
    { name: '轻击-2段', type: 'light', physCoef: 0.6859, elemCoef: 1, flat: 21.9, lv: 110 },
    { name: '轻击-3段', type: 'light', physCoef: 0.5335, elemCoef: 1, flat: 21.9, lv: 110 },
    { name: '九重春色-特殊技-变形-1段', type: 'special', physCoef: 0.125, elemCoef: 1, flat: 21.7, lv: 110 },
    { name: '九重春色-特殊技-变形-2段', type: 'special', physCoef: 0.25, elemCoef: 1, flat: 21.7, lv: 110 }
  ] },
  '20602': { id: '20602', name: '明川药典', skills: [
    { name: '突进', type: 'other', physCoef: 0.8791, elemCoef: 1, flat: 11.1, lv: 110 },
    { name: '九重春色-袖剑.空中轻击', type: 'light', physCoef: 0.7885, elemCoef: 1, flat: 9.9, lv: 110 },
    { name: '九重春色-袖剑.跳劈', type: 'heavy', physCoef: 2.011, elemCoef: 1, flat: 25.2, lv: 110 },
    { name: '奶伞-奶伞.易武', type: 'weapon', physCoef: 0.6218, elemCoef: 1, flat: 7.8, lv: 110 },
    { name: '重击1', type: 'heavy', physCoef: 0.5782, elemCoef: 1, flat: 7.3, lv: 110 },
    { name: '千香引魂蛊-奶伞.蓄力技-1段', type: 'charged', physCoef: 0.2425, elemCoef: 1, flat: 24.3, lv: 110 },
    { name: '千香引魂蛊-奶伞.蓄力技-2段', type: 'charged', physCoef: 0.0485, elemCoef: 1, flat: 24.3, lv: 110 },
    { name: '千香引魂蛊-奶伞.蓄力技-3段', type: 'charged', physCoef: 0.2425, elemCoef: 1, flat: 24.3, lv: 110 },
    { name: '千香引魂蛊-奶伞.蓄力技-4段', type: 'charged', physCoef: 0.0727, elemCoef: 1, flat: 24.3, lv: 110 },
    { name: '千香引魂蛊-奶伞.蓄力技-5段', type: 'charged', physCoef: 0.97, elemCoef: 1, flat: 24.3, lv: 110 },
    { name: '轻击-1段', type: 'light', physCoef: 0.3049, elemCoef: 1, flat: 21.9, lv: 110 },
    { name: '轻击-2段', type: 'light', physCoef: 0.6859, elemCoef: 1, flat: 21.9, lv: 110 },
    { name: '轻击-3段', type: 'light', physCoef: 0.5335, elemCoef: 1, flat: 21.9, lv: 110 },
    { name: '跳劈', type: 'heavy', physCoef: 0.4538, elemCoef: 1, flat: 5.7, lv: 110 },
    { name: '空中轻击', type: 'light', physCoef: 0.5004, elemCoef: 1, flat: 6.3, lv: 110 },
    { name: '九重春色-袖剑.轻击-1段', type: 'light', physCoef: 0.2692, elemCoef: 1, flat: 27, lv: 110 },
    { name: '九重春色-袖剑.轻击-2段', type: 'light', physCoef: 0.5921, elemCoef: 1, flat: 27, lv: 110 },
    { name: '九重春色-袖剑.轻击-3段', type: 'light', physCoef: 0.646, elemCoef: 1, flat: 27, lv: 110 },
    { name: '九重春色-袖剑.轻击-4段', type: 'light', physCoef: 0.646, elemCoef: 1, flat: 27, lv: 110 },
    { name: '九重春色-袖剑.重击-1段', type: 'heavy', physCoef: 0.4795, elemCoef: 1, flat: 30, lv: 110 },
    { name: '九重春色-袖剑.重击-2段', type: 'heavy', physCoef: 0.7192, elemCoef: 1, flat: 30, lv: 110 },
    { name: '九重春色-袖剑.重击-3段', type: 'heavy', physCoef: 1.1987, elemCoef: 1, flat: 30, lv: 110 }
  ] },
  '20603': { id: '20603', name: '醉梦游春', skills: [
    { name: '突进', type: 'other', physCoef: 0.8791, elemCoef: 1, flat: 11.1, lv: 110 },
    { name: '跳劈', type: 'heavy', physCoef: 0.4538, elemCoef: 1, flat: 5.7, lv: 110 },
    { name: '空中轻击', type: 'light', physCoef: 0.5004, elemCoef: 1, flat: 6.3, lv: 110 },
    { name: '醉梦游春-特殊技.流风回雪-持续2.8s', type: 'special', physCoef: 2.5352, elemCoef: 1, flat: 22.7, lv: 110 },
    { name: '醉梦游春-蓄力技.玲珑泡影', type: 'charged', physCoef: 1.6798, elemCoef: 1, flat: 16.2, lv: 110 },
    { name: '醉梦游春-主动技.回旋伞1', type: 'active', physCoef: 1.8094, elemCoef: 1, flat: 20.3, lv: 110 },
    { name: '轻击-1段', type: 'light', physCoef: 0.3049, elemCoef: 1, flat: 21.9, lv: 110 },
    { name: '轻击-2段', type: 'light', physCoef: 0.6859, elemCoef: 1, flat: 21.9, lv: 110 },
    { name: '轻击-3段', type: 'light', physCoef: 0.5335, elemCoef: 1, flat: 21.9, lv: 110 }
  ] },
  '20701': { id: '20701', name: '粟子游尘', skills: [
    { name: '绳镖-绳镖蓄力攻击-勾取', type: 'variedCombo', physCoef: 0.5983, elemCoef: 1, flat: 5, lv: 110 },
    { name: '粟子游尘-主动技.牵绳引刃', type: 'active', physCoef: 0.2495, elemCoef: 1, flat: 5, lv: 110 },
    { name: '粟子游尘-姿态技.龙蛰蠖屈', type: 'lightVariedCombo', physCoef: 0.337, elemCoef: 1, flat: 13.8, lv: 110 },
    { name: '空中轻击', type: 'light', physCoef: 0.5187, elemCoef: 1, flat: 6.4, lv: 110 },
    { name: '跳劈', type: 'heavy', physCoef: 1.9787, elemCoef: 1, flat: 27, lv: 110 },
    { name: '突进', type: 'other', physCoef: 0.7928, elemCoef: 1, flat: 10, lv: 110 }
  ] },
  '20702': { id: '20702', name: '粟子行云', skills: [
    { name: '粟子行云-主动技.履虚扫尘', type: 'active', physCoef: 3.1438, elemCoef: 1, flat: 39.4, lv: 110 },
    { name: '粟子行云-特殊技.引爆-1段', type: 'special', physCoef: 1.38, elemCoef: 1, flat: 19.2, lv: 110 },
    { name: '粟子行云-特殊技.引爆-2段', type: 'special', physCoef: 2.3, elemCoef: 1, flat: 19.2, lv: 110 },
    { name: '空中轻击', type: 'light', physCoef: 0.5187, elemCoef: 1, flat: 6.4, lv: 110 },
    { name: '跳劈', type: 'heavy', physCoef: 1.9787, elemCoef: 1, flat: 27, lv: 110 },
    { name: '突进', type: 'other', physCoef: 0.7928, elemCoef: 1, flat: 10, lv: 110 },
    { name: '粟子行云-蓄力姿态.蓄力攻击-合并', type: 'charged', physCoef: 3.6248, elemCoef: 1, flat: 17.9, lv: 110 }
  ] },
  '20703': { id: '20703', name: '千机索天', skills: [
    { name: '绳镖新武学-绳镖.武学技-地面新', type: 'active', physCoef: 1.6594, elemCoef: 1, flat: 18.4, lv: 110 },
    { name: '绳镖新武学-绳镖.武学技.半气竭处决', type: 'active', physCoef: 2.911, elemCoef: 1, flat: 32.1, lv: 110 },
    { name: '绳镖新武学-绳镖·特殊技新', type: 'special', physCoef: 1.2513, elemCoef: 1, flat: 15.7, lv: 110 },
    { name: '空中轻击', type: 'light', physCoef: 0.5187, elemCoef: 1, flat: 6.4, lv: 110 },
    { name: '跳劈', type: 'heavy', physCoef: 1.9787, elemCoef: 1, flat: 27, lv: 110 },
    { name: '突进', type: 'other', physCoef: 0.7928, elemCoef: 1, flat: 10, lv: 110 },
    { name: '绳镖新武学-绳镖.蓄力技新-1段', type: 'heavy', physCoef: 0.2537, elemCoef: 1, flat: 40.1, lv: 110 },
    { name: '绳镖新武学-绳镖.蓄力技新-2段', type: 'heavy', physCoef: 1.184, elemCoef: 1, flat: 40.1, lv: 110 }
  ] },
  '20801': { id: '20801', name: '斩雪刀法', skills: [
    { name: '横刀新武学-横刀.突进', type: 'other', physCoef: 0.4382, elemCoef: 1, flat: 5.5, lv: 110 },
    { name: '横刀新武学-横刀.空中轻击', type: 'light', physCoef: 0.3449, elemCoef: 1, flat: 5, lv: 110 },
    { name: '横刀新武学-横刀.跳劈', type: 'heavy', physCoef: 0.5393, elemCoef: 1, flat: 6.8, lv: 110 },
    { name: '横刀新武学-主动技.滑铲突击', type: 'active', physCoef: 1.2348, elemCoef: 1, flat: 15.5, lv: 110 },
    { name: '横刀新武学-主动技.滑铲突击2', type: 'active', physCoef: 1.2348, elemCoef: 1, flat: 15.5, lv: 110 },
    { name: '横刀新武学-主动技.旋风斩', type: 'active', physCoef: 1.4919, elemCoef: 1, flat: 16.8, lv: 110 },
    { name: '横刀新武学-主动技.背刺', type: 'active', physCoef: 2.1334, elemCoef: 1, flat: 26.7, lv: 110 },
    { name: '横刀新武学-特殊技.次元斩', type: 'special', physCoef: 3.7807, elemCoef: 1, flat: 37.9, lv: 110 },
    { name: '横刀新武学-横刀.易武', type: 'weapon', physCoef: 0.6496, elemCoef: 1, flat: 8.2, lv: 110 },
    { name: '横刀-单人反击', type: 'other', physCoef: 0.4136, elemCoef: 1, flat: 5.2, lv: 110 },
    { name: '横刀新武学-横刀.轻击反击', type: 'lightVariedCombo', physCoef: 0.3838, elemCoef: 1, flat: 5, lv: 110 },
    { name: '横刀新武学-横刀.轻击-1段', type: 'light', physCoef: 0.3658, elemCoef: 1, flat: 30.5, lv: 110 },
    { name: '横刀新武学-横刀.轻击-2段', type: 'light', physCoef: 0.3658, elemCoef: 1, flat: 30.5, lv: 110 },
    { name: '横刀新武学-横刀.轻击-3段', type: 'light', physCoef: 0.8536, elemCoef: 1, flat: 30.5, lv: 110 },
    { name: '横刀新武学-横刀.轻击-4段', type: 'light', physCoef: 0.8536, elemCoef: 1, flat: 30.5, lv: 110 },
    { name: '横刀新武学-横刀.重击-1段', type: 'heavy', physCoef: 0.4049, elemCoef: 1, flat: 25.4, lv: 110 },
    { name: '横刀新武学-横刀.重击-2段', type: 'heavy', physCoef: 0.5061, elemCoef: 1, flat: 25.4, lv: 110 },
    { name: '横刀新武学-横刀.重击-3段', type: 'heavy', physCoef: 0.4049, elemCoef: 1, flat: 25.4, lv: 110 },
    { name: '横刀新武学-横刀.重击-4段', type: 'heavy', physCoef: 0.7086, elemCoef: 1, flat: 25.4, lv: 110 },
    { name: '横刀新武学-横刀.重击压制-1段', type: 'variedCombo', physCoef: 2.0779, elemCoef: 1, flat: 23, lv: 110 },
    { name: '横刀新武学-横刀.重击压制-2段', type: 'variedCombo', physCoef: 2.8259, elemCoef: 1, flat: 23, lv: 110 },
    { name: '横刀新武学-横刀.重击压制-3段', type: 'variedCombo', physCoef: 3.657, elemCoef: 1, flat: 23, lv: 110 },
    { name: '横刀新武学-横刀.轻击蓄力', type: 'lightCharged', physCoef: 2.4506, elemCoef: 1, flat: 30, lv: 110 }
  ] },
  '20901': { id: '20901', name: '天志垂象', skills: [
    { name: '手甲新武学-手甲.轻击1', type: 'light', physCoef: 0.3574, elemCoef: 1, flat: 5, lv: 110 },
    { name: '手甲新武学-手甲.轻击2', type: 'light', physCoef: 0.3931, elemCoef: 1, flat: 5, lv: 110 },
    { name: '手甲新武学-手甲.轻击3', type: 'light', physCoef: 0.2539, elemCoef: 1, flat: 5, lv: 110 },
    { name: '手甲新武学-手甲.轻击4', type: 'light', physCoef: 0.3193, elemCoef: 1, flat: 5, lv: 110 },
    { name: '手甲新武学-手甲.轻击6', type: 'light', physCoef: 0.8212, elemCoef: 1, flat: 9.1, lv: 110 },
    { name: '手甲新武学-手甲.重击1', type: 'heavy', physCoef: 0.4359, elemCoef: 1, flat: 5.5, lv: 110 },
    { name: '手甲新武学-手甲.重击2', type: 'heavy', physCoef: 0.3247, elemCoef: 1, flat: 5, lv: 110 },
    { name: '手甲新武学-手甲.重击3', type: 'heavy', physCoef: 0.6373, elemCoef: 1, flat: 8, lv: 110 },
    { name: '手甲新武学-手甲.重击4', type: 'heavy', physCoef: 0.5782, elemCoef: 1, flat: 7.3, lv: 110 },
    { name: '手甲新武学-手甲.突进', type: 'other', physCoef: 0.3449, elemCoef: 1, flat: 5, lv: 110 },
    { name: '手甲新武学-手甲.空中轻击', type: 'light', physCoef: 0.306, elemCoef: 1, flat: 5, lv: 110 },
    { name: '手甲新武学-手甲.跳劈', type: 'heavy', physCoef: 0.3187, elemCoef: 1, flat: 5, lv: 110 },
    { name: '手甲新武学-手甲.武学技一段-近距离', type: 'active', physCoef: 1.1015, elemCoef: 1, flat: 13.8, lv: 110 },
    { name: '手甲新武学-手甲.武学技二段-唤鸟术', type: 'active', physCoef: 1.5297, elemCoef: 1, flat: 20.7, lv: 110 },
    { name: '手甲新武学-手甲.特殊技', type: 'special', physCoef: 2.0362, elemCoef: 1, flat: 18.7, lv: 110 },
    { name: '手甲新武学-手甲.易武', type: 'weapon', physCoef: 0.7726, elemCoef: 1, flat: 9.7, lv: 110 },
    { name: '手甲-单人反击', type: 'other', physCoef: 0.4136, elemCoef: 1, flat: 5.2, lv: 110 },
    { name: '手甲新武学-手甲.闪避反击', type: 'lightVariedCombo', physCoef: 1.21, elemCoef: 1, flat: 9.1, lv: 110 },
    { name: '手甲新武学-手甲.轻击5', type: 'light', physCoef: 0.4684, elemCoef: 1, flat: 5.9, lv: 110 },
    { name: '手甲新武学-手甲.重击蓄力', type: 'heavyCharged', physCoef: 1.8139, elemCoef: 1, flat: 22.7, lv: 110 },
    { name: '手甲新武学-手甲.奥义-1段', type: 'heavyCharged', physCoef: 4.2468, elemCoef: 0.5, flat: 53.3, lv: 110 },
    { name: '手甲新武学-手甲.奥义-2段', type: 'heavyCharged', physCoef: 7.6442, elemCoef: 0.5, flat: 53.3, lv: 110 },
    { name: '手甲新武学-手甲.奥义（三格）-1段', type: 'heavyCharged', physCoef: 6.9143, elemCoef: 0.5, flat: 84, lv: 110 },
    { name: '手甲新武学-手甲.奥义（三格）-2段', type: 'heavyCharged', physCoef: 12.4458, elemCoef: 0.5, flat: 84, lv: 110 },
    { name: '手甲新武学-手甲.奥义（四格）-1段', type: 'heavyCharged', physCoef: 8.9901, elemCoef: 0.5, flat: 110, lv: 110 },
    { name: '手甲新武学-手甲.奥义（四格）-2段', type: 'heavyCharged', physCoef: 16.1823, elemCoef: 0.5, flat: 110, lv: 110 }
  ] },
  '20902': { id: '20902', name: '悬身拳法', skills: [
    { name: '醉拳-醉拳·醉拳轻击一段', type: 'light', physCoef: 0.3449, elemCoef: 1, flat: 5, lv: 110 },
    { name: '醉拳-醉拳·醉拳轻击二段', type: 'light', physCoef: 0.2283, elemCoef: 1, flat: 5, lv: 110 },
    { name: '醉拳-醉拳·醉拳轻击三段', type: 'light', physCoef: 0.3683, elemCoef: 1, flat: 5, lv: 110 },
    { name: '醉拳-醉拳·醉拳轻击四段', type: 'light', physCoef: 0.3309, elemCoef: 1, flat: 5, lv: 110 },
    { name: '醉拳-醉拳·醉拳轻击五段', type: 'light', physCoef: 0.4654, elemCoef: 1, flat: 5.9, lv: 110 },
    { name: '醉拳-醉拳·醉拳轻击六段', type: 'light', physCoef: 0.656, elemCoef: 1, flat: 8.3, lv: 110 },
    { name: '醉拳-醉拳·普通武学技一段', type: 'active', physCoef: 0.9203, elemCoef: 1, flat: 11.6, lv: 110 },
    { name: '醉拳-醉拳·普通武学技二段', type: 'active', physCoef: 1.2333, elemCoef: 1, flat: 15.5, lv: 110 },
    { name: '醉拳-醉拳·醉态武学技一段', type: 'active', physCoef: 1.5766, elemCoef: 1, flat: 19.8, lv: 110 },
    { name: '醉拳-醉拳·醉态武学技二段', type: 'active', physCoef: 2.5424, elemCoef: 1, flat: 31.8, lv: 110 },
    { name: '醉拳-醉拳·特殊技起手', type: 'special', physCoef: 0.9454, elemCoef: 1, flat: 11.9, lv: 110 },
    { name: '醉拳-醉拳特殊技追击', type: 'special', physCoef: 2.2889, elemCoef: 1, flat: 28.7, lv: 110 },
    { name: '醉拳-醉拳特殊技破防', type: 'special', physCoef: 0.6466, elemCoef: 1, flat: 8.1, lv: 110 },
    { name: '醉拳-醉拳特殊技破防强化', type: 'special', physCoef: 2.6062, elemCoef: 1, flat: 32.6, lv: 110 },
    { name: '醉拳-醉拳·奥义一段', type: 'other', physCoef: 0.6891, elemCoef: 0.65, flat: 9.5, lv: 110 },
    { name: '醉拳-醉拳·奥义二段', type: 'other', physCoef: 0.6624, elemCoef: 0.65, flat: 9.2, lv: 110 },
    { name: '醉拳-醉拳·奥义三段', type: 'other', physCoef: 0.808, elemCoef: 0.65, flat: 10.3, lv: 110 },
    { name: '醉拳-醉拳·奥义四段', type: 'other', physCoef: 1.8224, elemCoef: 0.65, flat: 22.9, lv: 110 }
  ] },
}

/** 取某武学技能列表 */
export const getSkills = (id: string | undefined): SkillHit[] =>
  (id ? SKILLS[id]?.skills : undefined) ?? []