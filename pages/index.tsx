import { useState } from 'react'
import Head from 'next/head'
import { useWindowSize } from 'react-use'
import styled from '@emotion/styled'
import { UnitedStates } from '../components/UnitedStates'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Modal } from '../components/Modal'
import { covidData } from '../lib/data'
import { BREAKPOINTS } from '../consts'

const MapWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${BREAKPOINTS[0]}px) {
    position: relative;
    bottom: 50px;
  }
`

const Home = () => {
  const [currentState, setCurrentState] = useState<string>('')
  const { width, height } = useWindowSize()
  return (
    <div className="container">
      <Head>
        <title>COVID-19</title>
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
      </Head>
      <div id="page-wrapper">
        <Header {...covidData} />
        <MapWrapper>
          <UnitedStates
            data={covidData}
            width={width > BREAKPOINTS[0] ? width * 0.8 : width}
            height={height * 0.8}
            currentState={currentState}
            setCurrentState={setCurrentState}
          />
        </MapWrapper>
        <Footer />
      </div>
      <Modal currentState={currentState} clearState={() => setCurrentState('')} data={covidData} />

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: Open Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
          background-color: #030303;
          overflow-x: hidden;
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

// Home.getInitialProps = () => {
//   return {}
// }

export default Home
