import 'isomorphic-unfetch'
import { useState, useEffect } from 'react'
import { useWindowSize } from 'react-use'
import { find } from 'lodash'
import moment from 'moment'
import styled from '@emotion/styled'
import { UnitedStates } from '../components/UnitedStates'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Modal } from '../components/Modal'
import { initialize, logPageView } from '../lib/analytics'
import { nomalizeState, DataItem, Data } from '../lib/utils'
import { BREAKPOINTS, START_DATE, STATES } from '../consts'

const MapWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  right: 15%;

  @media (max-width: ${BREAKPOINTS[0]}px) {
    position: relative;
    bottom: 50px;
    right: initial;
  }
`

const Home = (props: { data: Data }) => {
  const [currentState, setCurrentState] = useState<string>('')
  const { width, height } = useWindowSize()

  useEffect(() => {
    initialize()
    logPageView()
    return () => {}
  }, [true])

  return (
    <div className="container">
      <div id="page-wrapper">
        <Header {...props.data.usa} />
        <MapWrapper>
          <UnitedStates
            data={props.data}
            width={width > BREAKPOINTS[0] ? width * 0.8 : width}
            height={height * 0.8}
            currentState={currentState}
            setCurrentState={setCurrentState}
          />
        </MapWrapper>
        <Footer />
      </div>
      <Modal currentState={currentState} clearState={() => setCurrentState('')} data={props.data} />
    </div>
  )
}

Home.getInitialProps = async () => {
  let mostInfected = 0
  const states = {} as { [key: string]: DataItem }
  const usaData = await fetch('https://corona.lmao.ninja/countries/USA').then(res => res.json())
  const statesData = await fetch('https://corona.lmao.ninja/states').then(res => res.json())
  const allHistorical = await fetch('https://corona.lmao.ninja/historical').then(res => res.json())
  const usaHistorical = await fetch('https://corona.lmao.ninja/historical/usa').then(res =>
    res.json()
  )
  const statesHistorical = allHistorical.filter(
    ({ country, province }) => country === 'usa' && STATES.indexOf(nomalizeState(province)) !== -1
  )
  const allDates = Object.keys(usaHistorical.timeline.cases).map(date =>
    moment(date, 'M/D/YY').valueOf()
  )
  const filteredDates = allDates.filter(d => d > moment(START_DATE, 'M/D/YY').valueOf())
  statesData
    .filter(({ state }) => STATES.indexOf(nomalizeState(state)) !== -1)
    .forEach(state => {
      const id = nomalizeState(state.state)
      const history = find(statesHistorical, ({ province }) => nomalizeState(province) === id)

      if (state.cases > mostInfected) {
        mostInfected = state.cases
      }

      states[id] = {
        ...state,
        name: state.state,
        timeline: filteredDates.map(d => {
          const date = moment(d).format('M/D/YY')
          return {
            date: d,
            confirmed: parseInt(history.timeline.cases[date], 10),
            deaths: parseInt(history.timeline.deaths[date], 10),
            recoveries: parseInt(history.timeline.recovered[date], 10),
          }
        }),
      } as DataItem
    })
  return {
    data: {
      mostInfected,
      usa: {
        ...usaData,
        name: usaData.country,
        timeline: filteredDates.map(d => {
          const date = moment(d).format('M/D/YY')
          return {
            date: d,
            confirmed: parseInt(usaHistorical.timeline.cases[date], 10),
            deaths: parseInt(usaHistorical.timeline.deaths[date], 10),
            recoveries: parseInt(usaHistorical.timeline.recovered[date], 10),
          }
        }),
      } as DataItem,
      states,
    } as Data,
  }
}

export default Home
