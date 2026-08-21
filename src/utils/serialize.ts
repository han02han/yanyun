import type { Build } from '../engine/calculate'

/** 配装 → URL 安全字符串 */
export function serializeBuild(build: Build): string {
  return encodeURIComponent(JSON.stringify(build))
}

/** URL 安全字符串 → 配装（解析失败返回 null） */
export function deserializeBuild(str: string): Build | null {
  try {
    const b = JSON.parse(decodeURIComponent(str)) as Build
    if (b && typeof b.items === 'object' && typeof b.chosenAffixes === 'object') return b
  } catch {
    /* 忽略损坏数据 */
  }
  return null
}

/** 带当前配装的分享链接（hash 携带） */
export function buildUrlWithBuild(build: Build): string {
  const url = new URL(window.location.href)
  url.hash = `b=${serializeBuild(build)}`
  return url.toString()
}

/** 从 URL hash 读取分享的配装（无则返回 null） */
export function buildFromHash(): Build | null {
  const m = window.location.hash.match(/[#&]b=([^&]+)/)
  return m ? deserializeBuild(m[1]) : null
}

/** 校验导入的 JSON 文本是否为合法配装 */
export function parseBuildJson(text: string): Build | null {
  try {
    const b = JSON.parse(text) as Build
    if (b && typeof b.items === 'object' && typeof b.chosenAffixes === 'object') return b
  } catch {
    /* 忽略损坏数据 */
  }
  return null
}
