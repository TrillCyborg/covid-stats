import { useState, useEffect } from 'react'
import { useWindowSize } from 'react-use'
import styled from '@emotion/styled'
import { UnitedStates } from '../components/UnitedStates'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Modal } from '../components/Modal'
import { initialize, logPageView } from '../lib/analytics'
import { Data } from '../lib/utils'
import { getData } from '../lib/api'
import { BREAKPOINTS } from '../consts'

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
  const { data } = props
  const [currentState, setCurrentState] = useState<string>('')
  const { width, height } = useWindowSize()

  useEffect(() => {
    initialize()
    logPageView()
    return () => {}
  }, [true])

  return data ? (
    <div className="container">
      <div id="page-wrapper">
        <Header {...data.usa} />
        <MapWrapper>
          <UnitedStates
            data={data}
            width={width > BREAKPOINTS[0] ? width * 0.8 : width}
            height={height * 0.8}
            currentState={currentState}
            setCurrentState={setCurrentState}
          />
        </MapWrapper>
        <Footer />
      </div>
      <Modal currentState={currentState} clearState={() => setCurrentState('')} data={data} />
    </div>
  ) : null
}

Home.getInitialProps = async () => {
  const data = await getData()
  return { data }
}

export default Home
