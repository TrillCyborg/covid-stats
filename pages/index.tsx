import { useState, useEffect, useMemo } from 'react'
import { useWindowSize } from 'react-use'
import useSWR from 'swr'
import styled from '@emotion/styled'
import { UnitedStatesMap } from '../components/UnitedStatesMap'
import { WorldMap } from '../components/WorldMap'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Modal } from '../components/Modal'
import { initialize, logPageView } from '../lib/analytics'
import { Data, DataItem } from '../lib/utils'
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

const Home = () => {
  const { data: globalData, error: globalDataError } = useSWR<Partial<DataItem>>('/global-data')
  const { data: worldData, error: worldDataError } = useSWR<Partial<Data>>('/world-data')
  const { data: worldChartData, error: worldChartDataError } = useSWR<Partial<Data>>('/world-chart-data')
  const { data: usChartData, error: usChartDataError } = useSWR<Partial<DataItem>>('/us-chart-data')
  const { data: statesData, error: statesDataError } = useSWR<Partial<Data>>('/state-data')
  const [currentState, setCurrentState] = useState<string>('')
  const [currentCountry, setCurrentCountry] = useState<string>('')
  const { width, height } = useWindowSize()

  const data = useMemo(() => {
    const data = {
      worldDataLoaded: !!worldData,
      usChartDataLoaded: !!usChartData,
      statesDataLoaded: !!statesData,
      items: {},
    } as Partial<Data>
    if (globalData) {
      data.global = globalData as DataItem
    }
    if (worldData) {
      data.mostInfected = worldData.mostInfected
      data.items = worldData.items
      if (worldChartData) {
        if (globalData) {
          data.global = {
            ...data.global,
            ...worldChartData.global,
          }
        } else {
          data.global = worldChartData.global
        }
        Object.keys(worldChartData.items).forEach(key => {
          data.items[key] = {
            ...data.items[key],
            timeline: worldChartData.items[key].timeline
          }
        })
      }
    }
    if (usChartData || statesData) {
      if (!data.items.usa) {
        data.items.usa = {} as DataItem
      }
      data.items.usa = {
        ...data.items.usa,
        ...(usChartData || {}),
        ...(statesData && statesData.items && statesData.items
          ? statesData.items.usa
          : {}),
      } as DataItem
    }
    return data
  }, [globalData, worldData, worldChartData, usChartData, statesData]) as Partial<Data>

  useEffect(() => {
    initialize()
    logPageView()
    return () => {}
  }, [true])

  return data ? (
    <div className="container">
      <div id="page-wrapper">
        <Header {...(currentCountry ? data.items[currentCountry] : data.global)} />
        <MapWrapper>
          {currentCountry === 'usa' ? (
            <UnitedStatesMap
              data={data}
              width={width > BREAKPOINTS[0] ? width * 0.8 : width}
              height={height * 0.8}
              currentState={currentState}
              setCurrentState={setCurrentState}
            />
          ) : (
            <WorldMap
              data={data}
              width={width > BREAKPOINTS[0] ? width * 0.8 : width}
              height={height * 0.8}
              currentCountry={currentCountry}
              setCurrentCountry={(country) => {
                setCurrentCountry(country)
                setCurrentState('')
              }}
            />
          )}
        </MapWrapper>
        {data && data.usDataLoaded && data.usChartDataLoaded ? <Footer /> : null}
      </div>
      <Modal
        currentState={currentState}
        clearState={() => setCurrentState('')}
        currentCountry={currentCountry}
        clearCountry={() => {
          setCurrentCountry('')
          setCurrentState('')
        }}
        data={data}
      />
    </div>
  ) : null
}

export default Home
