import styled from '@emotion/styled'
import { logTotalTabClick, logDailyTabClick } from '../lib/analytics'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  left: 5px;
  cursor: pointer;
`
const Button = styled.div<{ active: boolean }>`
  padding: 5px;
  color: var(--accent);
  font-weight: bold;
  font-family: Orbitron;

  opacity: ${props => (props.active ? 1 : 0.4)};
`

const Divider = () => (
  <div style={{ opacity: 0.4, color: 'var(--accent)', position: 'relative', bottom: 2 }}>|</div>
)

export type ChartMode = 'total' | 'daily'

interface ToggleChartButtonProps {
  value: ChartMode
  onClick: (mode: ChartMode) => void
}

export const ToggleChartButton = (props: ToggleChartButtonProps) => {
  const { value, onClick } = props
  return (
    <Wrapper>
      <Button
        active={value === 'total'}
        onClick={() => {
          logTotalTabClick()
          onClick('total')
        }}
        style={{ marginRight: 5 }}
      >
        TOTAL
      </Button>
      <Divider />
      <Button
        active={value === 'daily'}
        onClick={() => {
          logDailyTabClick()
          onClick('daily')
        }}
        style={{ marginLeft: 5 }}
      >
        DAILY
      </Button>
    </Wrapper>
  )
}
