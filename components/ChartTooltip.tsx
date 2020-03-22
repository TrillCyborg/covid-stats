import React, { useState, useEffect, useRef } from 'react'
import numeral from 'numeral'
import { Line, Bar } from '@vx/shape'
import { Tooltip } from '@vx/tooltip'
import { timeFormat } from 'd3-time-format'

const formatDate = timeFormat("%b %d, '%y")

interface ChartTooltipProps {
  width: number
  height: number
  xMax: number
  yMax: number
  xVal: (d: any) => Date
  yVal: (d: any) => number
  color: string
  children: (args: { tooltip: JSX.Element }) => JSX.Element
  handleTooltip: (args: { event: any, setTooltip: React.Dispatch<any> }) => void
}

export const ChartTooltip = (props: ChartTooltipProps) => {
  const { height, xMax, yMax, children, xVal, yVal, handleTooltip } = props

  const [tooltip, setTooltip] = useState(null)
  const [topOffset, setTopOffset] = useState(0)
  const chartRef = useRef<HTMLDivElement>()

  useEffect(() => {
    if (chartRef.current) {
      setTopOffset(chartRef.current.offsetTop)
    }
    return () => {}
  }, [chartRef.current])

  const hideTooltip = () => setTooltip({})

  return (
    <div ref={chartRef}>
      {children({
        tooltip: (
          <>
            <Bar
              x={0}
              y={0}
              width={xMax}
              height={yMax}
              fill="transparent"
              rx={14}
              onTouchStart={event => handleTooltip({ event, setTooltip })}
              onTouchMove={event => handleTooltip({ event, setTooltip })}
              onMouseMove={event => handleTooltip({ event, setTooltip })}
              onMouseLeave={() => hideTooltip()}
            />
            {tooltip && tooltip.tooltipData && (
              <g>
                <Line
                  from={{ x: tooltip.tooltipLeft, y: 0 }}
                  to={{ x: tooltip.tooltipLeft, y: yMax }}
                  stroke="#fff"
                  strokeWidth={2}
                  style={{ pointerEvents: 'none' }}
                  strokeDasharray="2,2"
                />
                <circle
                  cx={tooltip.tooltipLeft}
                  cy={tooltip.tooltipTop + 1}
                  r={4}
                  fill="black"
                  fillOpacity={0.1}
                  stroke="black"
                  strokeOpacity={0.1}
                  strokeWidth={2}
                  style={{ pointerEvents: 'none' }}
                />
                <circle
                  cx={tooltip.tooltipLeft}
                  cy={tooltip.tooltipTop}
                  r={4}
                  fill="rgba(92, 119, 235, 1.000)"
                  stroke="white"
                  strokeWidth={2}
                  style={{ pointerEvents: 'none' }}
                />
              </g>
            )}
          </>
        ),
      })}
      {tooltip && tooltip.tooltipData && (
        <div>
          <Tooltip
            top={height / 2 + topOffset - 20}
            left={tooltip.tooltipLeft + 5}
            style={{
              backgroundColor: props.color,
              fontSize: 16,
              color: 'white',
            }}
          >
            {numeral(yVal(tooltip.tooltipData)).format('0,0')}
          </Tooltip>
          <Tooltip
            top={height + topOffset + 1}
            left={tooltip.tooltipLeft}
            style={{
              transform: 'translateX(-50%)',
            }}
          >
            {formatDate(xVal(tooltip.tooltipData))}
          </Tooltip>
        </div>
      )}
    </div>
  )
}
