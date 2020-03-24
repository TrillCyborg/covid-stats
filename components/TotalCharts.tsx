import { capitalize } from 'lodash'
import { DateItem } from '../lib/utils'
import { AreaChart } from './AreaChart'
import { ChartLabel } from './ChartLabel'

const CHARTS = [
  { key: 'confirmed', color: 'var(--accent)' },
  { key: 'deaths', color: 'var(--danger)' },
  { key: 'recoveries', color: 'var(--success)' },
]

interface TotalChartsProps { 
  data: DateItem[]; width: number; height: number
}

export const TotalCharts = (props: TotalChartsProps) => (
  <div>
    {CHARTS.map(chart => {
      const hasData = props.data.some(data => !!data[chart.key])
      return hasData ? (
        <div key={chart.key}>
          <ChartLabel amount={props.data[props.data.length - 1][chart.key]}>
            Total {capitalize(chart.key)}
          </ChartLabel>
          <AreaChart
            width={props.width}
            height={props.height}
            data={props.data}
            valueKey={chart.key}
            color={chart.color}
          />
        </div>
      ) : null
    })}
  </div>
)
