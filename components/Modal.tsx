import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import moment from 'moment'
import { useWindowSize } from 'react-use'
import { logExitStateClick } from '../lib/analytics'
import { Data } from '../lib/utils'
import { AreaChart } from './AreaChart'
import { BarChart } from './BarChart'
import { ChartLabel } from './ChartLabel'
import { ToggleChartButton, ChartMode } from './ToggleChartButton'
import { BREAKPOINTS } from '../consts'

const Wrapper = styled.div`
  position: absolute;
  top: 0px;
  right: 30px;
  padding: 25px 30px;
  margin: 30px 0px;
  width: 30%;
  height: calc(100% - 60px);
  /* height: auto; */
  border-radius: 39px;
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  z-index: 1;
  overflow: auto;

  @media (max-width: ${BREAKPOINTS[0]}px) {
    overflow: hidden;
    width: 100%;
    height: auto;
    margin: 0px;
    position: absolute;
    transform: translateX(0);
    left: 0;
    right: 0;
    top: 80vh;
  }

  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);

  scrollbar-width: thin;
  scrollbar-color: var(--accent) transparent;

  &::-webkit-scrollbar-track {
    /* border-radius: 10px; */
    background-color: transparent;
    margin: 13px 0px;
    width: 12px;
    /* overflow: hidden; */
  }

  &::-webkit-scrollbar {
    /* width: 9px; */
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--accent);
    /* border-right: 3px hidden #4f4f4f; */
    border-radius: 30px;
  }
`
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

const LastUpdated = (props: { date: number }) => (
  <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 15, textAlign: 'center' }}>
    Last Updated: {moment(props.date).format('MM/DD/YYYY')}
  </div>
)

interface ModalProps {
  data: Data
  currentState: string
  clearState: () => void
}

export const Modal = (props: ModalProps) => {
  const [ready, setReady] = useState(false)
  const [mode, setMode] = useState<ChartMode>('total')
  const dimentions = useWindowSize()
  const state = props.data.states[props.currentState]
  const data = !!state ? state : props.data.usa
  const width =
    dimentions.width > BREAKPOINTS[0] ? dimentions.width * 0.3 - 60 : dimentions.width - 60
  const height =
    dimentions.width > BREAKPOINTS[1]
      ? (dimentions.height - (!!state ? 387 : 364)) / 3
      : dimentions.width > BREAKPOINTS[0]
      ? (dimentions.height - 400) / 3
      : 200

  useEffect(() => {
    setReady(true)
    return () => {}
  }, [true])

  return ready ? (
    <Wrapper id="info-modal">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ color: 'var(--accent)', textAlign: 'left' }}>
          {!!state ? state.name : 'United States'}
        </h1>
        <TogglaWrapper>
          <ToggleChartButton value={mode} onClick={setMode} />
        </TogglaWrapper>
      </div>
      <MobileTogglaWrapper>
        <ToggleChartButton value={mode} onClick={setMode} />
        {!!state ? <BackButton onClick={props.clearState}>United States</BackButton> : null}
      </MobileTogglaWrapper>
      {!!state ? (
        <TogglaWrapper>
          <BackButton style={{ marginTop: 6 }} onClick={() => {
            logExitStateClick()
            props.clearState()
          }}>
            United States
          </BackButton>
        </TogglaWrapper>
      ) : null}
      {mode === 'total' ? (
        <>
          <ChartLabel amount={data.timeline[data.timeline.length - 1].confirmed}>
            Total Confirmed
          </ChartLabel>
          <AreaChart
            width={width}
            height={height}
            data={data.timeline}
            valueKey="confirmed"
            color="var(--accent)"
          />

          <ChartLabel amount={data.timeline[data.timeline.length - 1].deaths}>
            Total Deaths
          </ChartLabel>
          <AreaChart
            width={width}
            height={height}
            data={data.timeline}
            valueKey="deaths"
            color="var(--danger)"
          />

          <ChartLabel amount={data.timeline[data.timeline.length - 1].recoveries}>
            Total Recoveries
          </ChartLabel>
          <AreaChart
            width={width}
            height={height}
            data={data.timeline}
            valueKey="recoveries"
            color="var(--success)"
          />
        </>
      ) : (
        <>
          <ChartLabel
            amount={
              data.timeline[data.timeline.length - 1].confirmed -
              data.timeline[data.timeline.length - 2].confirmed
            }
          >
            Daily Confirmed
          </ChartLabel>
          <BarChart
            width={width}
            height={height}
            data={data.timeline}
            valueKey="confirmed"
            color="var(--accent)"
          />

          <ChartLabel
            amount={
              data.timeline[data.timeline.length - 1].deaths -
              data.timeline[data.timeline.length - 2].deaths
            }
          >
            Daily Deaths
          </ChartLabel>
          <BarChart
            width={width}
            height={height}
            data={data.timeline}
            valueKey="deaths"
            color="var(--danger)"
          />

          <ChartLabel
            amount={
              data.timeline[data.timeline.length - 1].recoveries -
              data.timeline[data.timeline.length - 2].recoveries
            }
          >
            Daily Recoveries
          </ChartLabel>
          <BarChart
            width={width}
            height={height}
            data={data.timeline}
            valueKey="recoveries"
            color="var(--success)"
          />
        </>
      )}
      <LastUpdated date={data.timeline[data.timeline.length - 1].date} />
    </Wrapper>
  ) : null
}
