import React, { useState, useEffect } from 'react'
import { Bar } from '@vx/shape'
import { Group } from '@vx/group'
import { Grid } from '@vx/grid'
import { GradientTealBlue } from '@vx/gradient'
import { scaleTime, scaleLinear } from '@vx/scale'
import { AxisLeft } from '@vx/axis'
import { localPoint } from '@vx/event'
import { bisector, max, extent } from 'd3-array'
import { ChartTooltip } from './ChartTooltip'
import { DateItem } from '../lib/data'

// accessors
const xVal = d => d.date
const yVal = d => d.value

interface BarChartProps {
  width: number
  height: number
  color: string
  data: DateItem[]
  valueKey: 'confirmed' | 'deaths' | 'recoveries'
}

export const BarChart = (props: BarChartProps) => {
  const { width, height, color } = props
  const [ready, setReady] = useState(false)

  const data = props.data.map((d, i) => {
    const prevD = props.data[i - 1]
    return {
      date: new Date(d.date),
      value: !!prevD ? d[props.valueKey] - prevD[props.valueKey] : d[props.valueKey],
    }
  })

  useEffect(() => {
    setReady(true)
    return () => {}
  }, [true])

  const numTicksForHeight = h => {
    if (h <= 300) return 3
    if (300 < h && h <= 600) return 5
    return 10
  }

  const numTicksForWidth = w => {
    return data.length
  }

  // bounds
  const xMax = width * 0.94
  const yMax = height * 0.9

  const xScale = scaleTime({
    range: [0, xMax],
    domain: extent(data, xVal),
  })
  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, max(data, yVal)],
  })

  const bisectDate = bisector((d: any) => new Date(d.date)).left

  const handleTooltip = ({ event, setTooltip }) => {
    const { x } = localPoint(event)
    const x0 = xScale.invert(x) as any
    const index = bisectDate(data, x0, 1)
    const d0 = { ...data[index - 1] }
    const d1 = { ...data[index] }
    let d = d0
    if (d1 && d1.date) {
      d = x0 - xVal(d0.date) > xVal(d1.date) - x0 ? d1 : d0
    }
    setTooltip({
      tooltipData: d,
      tooltipLeft: x - 17,
      tooltipTop: yScale(d.value),
    })
  }

  return ready ? (
    <ChartTooltip
      width={width}
      height={height}
      xMax={xMax}
      yMax={yMax}
      xVal={xVal}
      yVal={yVal}
      color={color}
      handleTooltip={handleTooltip}
    >
      {({ tooltip }) => (
        <svg width={width} height={height}>
          {/* <GradientTealBlue id="teal" />
        <rect width={width} height={height} fill={'url(#teal)'} rx={14} /> */}
          <rect x={0} y={0} width={width} height={height} fill="#060606" rx={14} />
          <Group top={yMax * 0.05} left={xMax * 0.03}>
            {data.map((d, i) => {
              const y = yScale(yVal(d))
              const date = xVal(d)
              const barWidth = (xMax * 0.5) / data.length // xScale.bandwidth()
              const barHeight = yMax - y
              const barX = xScale(date) - 12
              const barY = yMax - barHeight
              return (
                <Bar
                  key={`bar-${date}`}
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  // onClick={event => {
                  //   alert(`clicked: ${JSON.stringify(Object.values(d))}`)
                  // }}
                />
              )
            })}
            <Grid
              xScale={xScale}
              yScale={yScale}
              stroke="rgba(255,255,255,0.15)"
              width={xMax}
              height={yMax}
              numTicksRows={numTicksForHeight(height)}
              numTicksColumns={numTicksForWidth(width)}
            />
            <AxisLeft
              left={34}
              scale={yScale}
              hideZero
              numTicks={numTicksForHeight(height)}
              tickStroke="transparent"
              tickLabelProps={(value, index) => ({
                fill: 'var(--accent)',
                textAnchor: 'start',
                fontSize: 10,
                dx: '-2.15em',
                dy: '1.25em',
              })}
            />
            {tooltip}
          </Group>
        </svg>
      )}
    </ChartTooltip>
  ) : null
}
