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
    Last Updated: {moment(props.date).tz('Etc/GMT').format('MM/DD/YYYY')}
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
    setReady(true)
    return () => {}
  }, [true])

  return ready ? (
    <Wrapper id="info-modal">
      <ModalHeader state={state} mode={mode} setMode={setMode} clearState={props.clearState} />
      <ChartList data={data.timeline} width={width} height={height} mode={mode} />
      <LastUpdated date={data.timeline[data.timeline.length - 1].date} />
    </Wrapper>
  ) : null
}
