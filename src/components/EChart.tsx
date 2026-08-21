import { useEffect, useRef, type CSSProperties } from 'react'
import * as echarts from 'echarts'

interface Props {
  option: echarts.EChartsOption
  height?: number
  style?: CSSProperties
}

/** 轻量 ECharts 封装：自动初始化 / 更新 / resize / 销毁 */
export default function EChart({ option, height = 280, style }: Props) {
  const divRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!divRef.current) return
    const chart = echarts.init(divRef.current)
    chartRef.current = chart
    const ro = new ResizeObserver(() => chart.resize())
    ro.observe(divRef.current)
    return () => {
      ro.disconnect()
      chart.dispose()
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    chartRef.current?.setOption(option, true)
  }, [option])

  return <div ref={divRef} style={{ height, width: '100%', ...style }} />
}
