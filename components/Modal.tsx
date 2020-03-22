import { useState } from 'react'
import styled from '@emotion/styled'
import { useWindowSize } from 'react-use'
import { Data } from '../lib/data'
import { AreaChart } from './AreaChart'
import { BarChart } from './BarChart'
import { ChartLabel } from './ChartLabel'
import { ToggleChartButton, ChartMode } from './ToggleChartButton'

const Wrapper = styled.div`
  position: absolute;
  top: 30px;
  /* right: 30px; */
  right: calc(-30% - 0px);
  padding: 15px 30px;
  width: 30%;
  height: calc(100% - 60px);
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transform: translateX(100%);
  z-index: 1;
  overflow: auto;

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

interface ModalProps {
  data: Data
  currentState: string
}

export const Modal = (props: ModalProps) => {
  const [mode, setMode] = useState<ChartMode>('total')
  const dimentions = useWindowSize()
  const width = dimentions.width * 0.3 - 60
  const state = props.data.states[props.currentState]
  const data = !!state ? state : props.data
  console.log('DATA', data)
  return (
    <Wrapper id="info-modal">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ color: 'var(--accent)', textAlign: 'left' }}>
          {!!state ? state.state : 'National'}
        </h1>
        <ToggleChartButton value={mode} onClick={setMode} />
      </div>
      {mode === 'total' ? (
        <>
          <ChartLabel amount={data.totalCases}>Total Confirmed</ChartLabel>
          <AreaChart
            width={width}
            height={200}
            data={data.dates}
            valueKey="confirmed"
            color="var(--accent)"
          />

          <ChartLabel amount={data.totalDeaths}>Total Deaths</ChartLabel>
          <AreaChart
            width={width}
            height={200}
            data={data.dates}
            valueKey="deaths"
            color="var(--danger)"
          />

          <ChartLabel amount={data.totalRecoveries}>Total Recoveries</ChartLabel>
          <AreaChart
            width={width}
            height={200}
            data={data.dates}
            valueKey="recoveries"
            color="var(--success)"
          />
        </>
      ) : (
        <>
          <ChartLabel
            amount={
              data.dates[data.dates.length - 1].confirmed -
              data.dates[data.dates.length - 2].confirmed
            }
          >
            Daily Confirmed
          </ChartLabel>
          <BarChart
            width={width}
            height={200}
            data={data.dates}
            valueKey="confirmed"
            color="var(--accent)"
          />

          <ChartLabel
            amount={
              data.dates[data.dates.length - 1].deaths - data.dates[data.dates.length - 2].deaths
            }
          >
            Daily Deaths
          </ChartLabel>
          <BarChart
            width={width}
            height={200}
            data={data.dates}
            valueKey="deaths"
            color="var(--danger)"
          />

          <ChartLabel
            amount={
              data.dates[data.dates.length - 1].recoveries -
              data.dates[data.dates.length - 2].recoveries
            }
          >
            Daily Recoveries
          </ChartLabel>
          <BarChart
            width={width}
            height={200}
            data={data.dates}
            valueKey="recoveries"
            color="var(--success)"
          />
        </>
      )}
    </Wrapper>
  )
}
