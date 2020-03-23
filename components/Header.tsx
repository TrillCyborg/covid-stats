import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import numeral from 'numeral'
import { DataItem } from '../lib/utils'
import { BREAKPOINTS } from '../consts'

const Wrapper = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  padding: 30px;
  display: flex;
  width: calc(70% - 30px);
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${BREAKPOINTS[0]}px) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
`
const Title = styled.h1`
  color: var(--accent);
  font-size: 30px;
  font-weight: bold;
  letter-spacing: 6px;

  @media (max-width: ${BREAKPOINTS[0]}px) {
    font-size: 26px;
  }
`
const StatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 15px;

  @media (max-width: ${BREAKPOINTS[0]}px) {
    margin: 0px;
    margin-top: 20px;
  }
`
const StatLabel = styled.span`
  font-size: 12px;
  font-family: Open Sans;

  @media (max-width: ${BREAKPOINTS[0]}px) {
    font-size: 10px;
  }
`
const StatNumber = styled.span`
  font-size: 22px;
  font-weight: bold;
  letter-spacing: 2.5px;
  font-family: Orbitron;

  @media (max-width: ${BREAKPOINTS[0]}px) {
    font-size: 18px;
  }
`
const StatList = styled.div`
  display: flex;
  color: var(--accent);

  @media (max-width: ${BREAKPOINTS[0]}px) {
    width: 100%;
    justify-content: space-between;
  }
`

export const Header = (props: DataItem) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
    return () => {}
  }, [true])

  return ready ? (
    <Wrapper id="page-header">
      <Title>COVID-19</Title>
      <StatList>
        <StatWrapper>
          <StatLabel>Infected:</StatLabel>
          <StatNumber>{numeral(props.cases).format('0,0')}</StatNumber>
        </StatWrapper>
        <StatWrapper>
          <StatLabel>Deaths:</StatLabel>
          <StatNumber style={{ color: 'var(--danger)' }}>
            {numeral(props.deaths).format('0,0')}
          </StatNumber>
        </StatWrapper>
        <StatWrapper>
          <StatLabel>Recoveries:</StatLabel>
          <StatNumber style={{ color: 'var(--success)' }}>
            {numeral(props.recovered).format('0,0')}
          </StatNumber>
        </StatWrapper>
      </StatList>
    </Wrapper>
  ) : null
}