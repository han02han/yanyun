/** 0-1 比率 → 百分比字符串 */
export const pct = (v: number, digits = 1): string => `${(v * 100).toFixed(digits)}%`

/** 数值取整 + 千分位 */
export const int = (v: number): string => Math.round(v).toLocaleString('zh-CN')

/** 期望伤害取整 */
export const dmg = (v: number): string => Math.round(v).toLocaleString('zh-CN')
