import styled from '@emotion/styled'
import { logExitStateClick } from '../lib/analytics'
import { DataItem } from '../lib/utils'
import { ToggleChartButton, ChartMode } from './ToggleChartButton'
import { BREAKPOINTS } from '../consts'

const TogglaWrapper = styled.div`
  @media (max-width: ${BREAKPOINTS[1]}px) {
    display: none;
  }
`
const MobileTogglaWrapper = styled.div`
  display: none;

  @media (max-width: ${BREAKPOINTS[1]}px) {
    margin-top: 6px;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
  }
`
const BackButton = styled.div`
  color: var(--accent);
  text-decoration: underline;
  font-family: Orbitron;
  font-size: 14px;
  cursor: pointer;
`

interface ModalHeaderProps {
  state: DataItem
  mode: ChartMode
  setMode: (mode: ChartMode) => void
  clearState: () => void
}

export const ModalHeader = (props: ModalHeaderProps) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h1 style={{ color: 'var(--accent)', textAlign: 'left' }}>
        {!!props.state ? props.state.name : 'United States'}
      </h1>
      <TogglaWrapper>
        <ToggleChartButton value={props.mode} onClick={props.setMode} />
      </TogglaWrapper>
    </div>
    <MobileTogglaWrapper>
      <ToggleChartButton value={props.mode} onClick={props.setMode} />
      {!!props.state ? <BackButton onClick={props.clearState}>United States</BackButton> : null}
    </MobileTogglaWrapper>
    {!!props.state ? (
      <TogglaWrapper>
        <BackButton
          style={{ marginTop: 6 }}
          onClick={() => {
            logExitStateClick()
            props.clearState()
          }}
        >
          United States
        </BackButton>
      </TogglaWrapper>
    ) : null}
  </div>
)
