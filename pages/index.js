import Head from "next/head";
import { useWindowSize } from 'react-use'
import styled from '@emotion/styled'
import { UnitedStates } from "../components/UnitedStates"

const Title = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  padding: 30px;
  color: #797979;
  font-size: 30px;
  font-weight: bold;
  letter-spacing: 6px;

  opacity: 0;
`
const Modal = styled.div`
  position: absolute;
  top: 30px;
  /* right: 30px; */
  right: calc(-30% - 0px);
  padding: 30px;
  width: 30%;
  height: calc(100% - 60px);
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  transform: translateX(100%)

  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
`

const Home = () => {
  const { width, height } = useWindowSize()
  return (
    <div className="container">
      <Head>
        <title>COVID-19</title>
        <link rel="icon" href="/favicon.ico" />
        {/* <link href="https://fonts.googleapis.com/css2?family=Quantico:wght@400;700&display=swap" rel="stylesheet"/> */}
        {/* <link href="https://fonts.googleapis.com/css2?family=Aldrich&display=swap" rel="stylesheet"/> */}
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      </Head>
      <Title id="page-title">COVID-19</Title>
      <Modal id="info-modal">this is text</Modal>
      <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <UnitedStates width={width*0.8} height={height*0.8} />
      </div>
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: Orbitron, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
          background-color: #030303;
          overflow: hidden;
        }
  
        * {
          box-sizing: border-box;
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
          stroke: #797979;
        }
  
        .map-path.inactive {
          opacity: 0;
        }
      `}</style>
    </div>
  )
}

export default Home;
