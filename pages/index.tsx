import 'isomorphic-unfetch'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import ReactGA from 'react-ga'
import { useWindowSize } from 'react-use'
import { find } from 'lodash'
import moment from 'moment'
import styled from '@emotion/styled'
import { UnitedStates } from '../components/UnitedStates'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Modal } from '../components/Modal'
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
    ReactGA.initialize('UA-161595327-1')
    ReactGA.pageview(window.location.pathname + window.location.search)
    return () => {}
  }, [true])

  return (
    <div className="container">
      <Head>
        <title>COVID-19 Stats</title>
        <link rel="icon" href="/favicon.ico" />
        {/* <link href="https://fonts.googleapis.com/css2?family=Quantico:wght@400;700&display=swap" rel="stylesheet"/> */}
        {/* <link href="https://fonts.googleapis.com/css2?family=Aldrich&display=swap" rel="stylesheet"/> */}
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" sizes="57x57" href="/favicon/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/favicon/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/favicon/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/favicon/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/favicon/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192"  href="/favicon/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#060606" />
        <meta name="msapplication-TileImage" content="/favicon/ms-icon-144x144.png" />
        <meta name="theme-color" content="#af0404" />
      </Head>
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

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: Open Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
          background-color: #030303;
          overflow-x: hidden;

          scrollbar-width: thin;
          scrollbar-color: var(--accent) transparent;
        }

        body::-webkit-scrollbar-track {
          background-color: transparent;
          width: 12px;
        }

        body::-webkit-scrollbar {
          width: 6px;
        }

        body::-webkit-scrollbar-thumb {
          background-color: var(--accent);
          border-radius: 30px;
        }

        * {
          box-sizing: border-box;
        }

        h1,
        h2 {
          font-family: Orbitron;
          margin: 0;
        }

        .map-path {
          transition: stroke-width 0.2s ease-in-out, opacity 0.2s ease-in-out;
          opacity: 1;
        }

        .map-path.animation-done {
          cursor: pointer;
        }

        .map-path.animation-done:hover {
          stroke-width: 2px;
          stroke: var(--accent);
        }

        .map-path.active {
          stroke-width: 2px;
          stroke: var(--accent);
        }

        @media (max-width: ${BREAKPOINTS[0]}px) {
          #page-wrapper {
            position: fixed;
          }
        }

        :root {
          --background: #060606;
          --danger: #af0404;
          --success: #2eb354;
          --clear: #060606;
          --accent: #b3b3b3;
        }
      `}</style>
    </div>
  )
}

Home.getInitialProps = async () => {
  let mostInfected = 0
  const states = {} as { [key: string]: DataItem }
  const usaData = await fetch('https://corona.lmao.ninja/countries/USA').then(res => res.json())
  const statesData = await fetch('https://corona.lmao.ninja/states').then(res => res.json())
  const allHistorical = await fetch('https://corona.lmao.ninja/historical').then(res => res.json())
  const usaHistorical = await fetch('https://corona.lmao.ninja/historical/usa').then(res =>res.json())
  const statesHistorical = allHistorical.filter(
    ({ country, province }) =>
      country === 'usa' && STATES.indexOf(nomalizeState(province)) !== -1
  )
  const allDates = Object.keys(usaHistorical.timeline.cases).map(date => moment(date, 'M/D/YY').valueOf())
  const filteredDates = allDates.filter(d => d > moment(START_DATE, 'M/D/YY').valueOf())
  statesData
    .filter(({ state }) => STATES.indexOf(nomalizeState(state)) !== -1)
    .forEach(state => {
      const id = nomalizeState(state.state)
      const history = find(
        statesHistorical,
        ({ province }) => nomalizeState(province) === id
      )
      
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
            recoveries: parseInt(history.timeline.recovered[date], 10)
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
            recoveries: parseInt(usaHistorical.timeline.recovered[date], 10)
          }
        }),
      } as DataItem,
      states,
    } as Data,
  }
}

export default Home
