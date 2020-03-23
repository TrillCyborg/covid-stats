import React, { useState, useEffect } from 'react'
import { Group } from '@vx/group'
import { AreaClosed, Line, Bar } from '@vx/shape'
import { GridRows, GridColumns, Grid } from '@vx/grid'
import { curveMonotoneX } from '@vx/curve'
import { scaleTime, scaleLinear } from '@vx/scale'
import { localPoint } from '@vx/event'
// import { RadialGradient } from '@vx/gradient';
import { AxisLeft, AxisRight, AxisBottom } from '@vx/axis'
import { extent, max } from 'd3-array'
import { bisector } from 'd3-array'
import { ChartTooltip } from './ChartTooltip'
import { DateItem } from '../lib/data'

// accessors
const xVal = d => d.date
const yVal = d => d.value

interface AreaChartProps {
  width: number
  height: number
  color: string
  data: DateItem[]
  valueKey: 'confirmed' | 'deaths' | 'recoveries'
}

export const AreaChart = (props: AreaChartProps) => {
  const { width, height, color } = props
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
    return () => {}
  }, [true])

  const data = props.data.map(d => ({
    date: new Date(d.date),
    value: d[props.valueKey],
  }))

  // bounds
  const xMax = width * 0.95
  const yMax = height * 0.9

  const numTicksForHeight = h => {
    if (h <= 300) return 3
    if (300 < h && h <= 600) return 5
    return 10
  }

  const numTicksForWidth = w => {
    return data.length
  }

  // scales
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
    const d0 = data[index - 1]
    const d1 = data[index]
    let d = d0
    if (d1 && d1.date) {
      d = x0 - xVal(d0.date) > xVal(d1.date) - x0 ? d1 : d0
    }
    setTooltip({
      tooltipData: d,
      tooltipLeft: x - 5,
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
          {/* <RadialGradient from="var(--background)" to="var(--danger)" id="Radial" r={'350%'} />
          <rect width={width} height={height} fill={"url(#Radial)"} rx={14} /> */}
          <rect x={0} y={0} width={width} height={height} fill="#060606" rx={14} />
          <defs>
            <linearGradient id={`gradient-${props.valueKey}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity={1} />
              <stop offset="100%" stopColor={color} stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <Group top={yMax * 0.05} left={xMax * 0.025}>
            {/* <GridRows
            lineStyle={{ pointerEvents: 'none' }}
            scale={yScale}
            width={xMax}
            strokeDasharray="2,2"
            stroke="rgba(255,255,255,0.15)"
          />
          <GridColumns
            lineStyle={{ pointerEvents: 'none' }}
            scale={xScale}
            height={yMax}
            strokeDasharray="2,2"
            stroke="rgba(255,255,255,0.15)"
          /> */}
            <AreaClosed
              data={data}
              x={d => xScale(xVal(d))}
              y={d => yScale(yVal(d))}
              yScale={yScale}
              strokeWidth={1}
              stroke={`url(#gradient-${props.valueKey})`}
              fill={`url(#gradient-${props.valueKey})`}
              curve={curveMonotoneX}
            />
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
              // top={margin.top}
              // label="Axis Left Label"
              // labelProps={{
              //   fill: '#8e205f',
              //   textAnchor: 'middle',
              //   fontSize: 12,
              //   fontFamily: 'Arial',
              // }}
              // stroke="#1b1a1e"
              // tickComponent={({ formattedValue, ...tickProps }) => (
              //   <text {...tickProps}>{formattedValue}</text>
              // )}
            />
            {/* <LinePath
              data={data}
              x={d => xScale(x(d))}
              y={d => yScale(y(d))}
              stroke={'#ffffff'}
              strokeWidth={1}
              curve={1 % 2 == 0 ? curveMonotoneX : undefined}
            /> */}
            {tooltip}
          </Group>
        </svg>
      )}
    </ChartTooltip>
  ) : null
}
