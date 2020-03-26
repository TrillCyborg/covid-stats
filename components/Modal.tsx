import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import moment from 'moment-timezone'
import { useWindowSize } from 'react-use'
import { Data } from '../lib/utils'
import { ChartMode } from './ToggleChartButton'
import { ModalHeader } from './ModalHeader'
import { ChartList } from './ChartList'
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
  animation: var(--fade-in);

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

const LastUpdated = (props: { date: number }) => (
  <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 15, textAlign: 'center' }}>
    Last Updated:{' '}
    {moment(props.date)
      .tz('Etc/GMT')
      .format('MM/DD/YYYY')}
  </div>
)

interface ModalProps {
  data: Partial<Data>
  currentState: string
  clearState: () => void
  currentCountry: string
  clearCountry: () => void
}

export const Modal = (props: ModalProps) => {
  const [ready, setReady] = useState(false)
  const [mode, setMode] = useState<ChartMode>('total')
  const dimentions = useWindowSize()
  const country =
    props.currentCountry && props.data && props.data.items
      ? props.data.items[props.currentCountry]
      : undefined
  const state =
    props.currentState && country && country.states ? country.states[props.currentState] : undefined
  const data = !!country
    ? !!state
      ? state
      : country
    : props.data && props.data.global
    ? props.data.global
    : undefined
  const width =
    dimentions.width > BREAKPOINTS[0] ? dimentions.width * 0.3 - 60 : dimentions.width - 60
  const height =
    dimentions.height < 670 && dimentions.width > BREAKPOINTS[0]
      ? 100
      : dimentions.width > BREAKPOINTS[1]
      ? (dimentions.height - (!!state ? 387 : 364)) / 3
      : dimentions.width > BREAKPOINTS[0]
      ? (dimentions.height - 400) / 3
      : 200
  // const height =
  //   dimentions.height < 670 && dimentions.width > BREAKPOINTS[0]
  //     ? 100
  //     : dimentions.width > BREAKPOINTS[1]
  //     ? (dimentions.height - (!!state ? 323 : 300)) / 2
  //     : dimentions.width > BREAKPOINTS[0]
  //     ? (dimentions.height - (!!state ? 340 : 336)) / 2
  //     : 300

  useEffect(() => {
    if (data && data.timeline && !ready) setReady(true)
    return () => {}
  }, [data, ready])

  return ready ? (
    <Wrapper id="info-modal">
      <ModalHeader
        data={data}
        isCountry={!!country}
        isState={!!state}
        countryName={!!country ? country.name : undefined}
        mode={mode}
        setMode={setMode}
        clear={!!state ? props.clearState : props.clearCountry}
      />
      {data.timeline ? (
        <>
          <ChartList data={data.timeline} width={width} height={height} mode={mode} />
          <LastUpdated date={data.timeline[data.timeline.length - 1].date} />
        </>
      ) : null}
    </Wrapper>
  ) : null
}
