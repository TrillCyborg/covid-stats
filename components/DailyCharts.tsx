import { capitalize } from 'lodash'
import { DateItem } from '../lib/utils'
import { BarChart } from './BarChart'
import { ChartLabel } from './ChartLabel'

const CHARTS = [
  { key: 'confirmed', color: 'var(--accent)' },
  { key: 'deaths', color: 'var(--danger)' },
  { key: 'recoveries', color: 'var(--success)' },
]

interface DailyChartsProps { 
  data: DateItem[]; width: number; height: number
}

export const DailyCharts = (props: DailyChartsProps) => (
  <div>
    {CHARTS.map(chart => {
      const hasData = props.data.some(data => !!data[chart.key])
      return hasData ? (
        <div key={chart.key}>
          <ChartLabel
              amount={
                props.data[props.data.length - 1][chart.key] -
                props.data[props.data.length - 2][chart.key]
              }
            >
              Daily {capitalize(chart.key)}
            </ChartLabel>
            <BarChart
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
