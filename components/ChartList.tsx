import { capitalize } from 'lodash'
import { DateItem } from '../lib/utils'
import { AreaChart } from './AreaChart'
import { BarChart } from './BarChart'
import { ChartLabel } from './ChartLabel'
import { ChartMode } from './ToggleChartButton'

const CHARTS = [
  { key: 'confirmed', color: 'var(--accent)' },
  { key: 'deaths', color: 'var(--danger)' },
  { key: 'recoveries', color: 'var(--success)' },
]

const CHART_TYPES = {
  total: {
    title: 'Total',
    Chart: AreaChart,
    amount: (data: DateItem[], key: string) => data[data.length - 1][key],
  },
  daily: {
    title: 'Daily',
    Chart: BarChart,
    amount: (data: DateItem[], key: string) =>
      data[data.length - 1][key] - data[data.length - 2][key],
  },
}

interface ChartListProps {
  data: DateItem[]
  width: number
  height: number
  mode: ChartMode
}

export const ChartList = (props: ChartListProps) => {
  const { title, amount, Chart } = CHART_TYPES[props.mode]
  return (
    <div>
      {CHARTS.map(chart => {
        const hasData = props.data.some(data => !!data[chart.key])
        return hasData ? (
          <div key={chart.key}>
            <ChartLabel amount={amount(props.data, chart.key)}>
              {title} {capitalize(chart.key)}
            </ChartLabel>
            <div style={{ minHeight: props.height }}>
              <Chart
                width={props.width}
                height={props.height}
                data={props.data}
                valueKey={chart.key}
                color={chart.color}
              />
            </div>
          </div>
        ) : null
      })}
    </div>
  )
}
