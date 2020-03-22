import styled from '@emotion/styled'
import numeral from 'numeral'

const Wrapper = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  padding: 30px;
  display: flex;
  width: calc(70% - 30px);
  justify-content: space-between;
  align-items: center;

  opacity: 0;
`
const Title = styled.h1`
  color: var(--accent);
  font-size: 30px;
  font-weight: bold;
  letter-spacing: 6px;
`
const StatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 15px;
`
const StatLabel = styled.span`
  font-size: 12px;
  font-family: Open Sans;
`
const StatNumber = styled.span`
  font-size: 22px;
  font-weight: bold;
  letter-spacing: 2.5px;
  font-family: Orbitron;
`
const StatList = styled.div`
  display: flex;
  color: var(--accent);
`

interface HeaderProps {
  totalCases: number
  totalDeaths: number
  totalRecoveries: number
}

export const Header = (props: HeaderProps) => (
  <Wrapper id="page-header">
    <Title>COVID-19</Title>
    <StatList>
      <StatWrapper>
        <StatLabel>Infected:</StatLabel>
        <StatNumber>{numeral(props.totalCases).format('0,0')}</StatNumber>
      </StatWrapper>
      <StatWrapper>
        <StatLabel>Deaths:</StatLabel>
        <StatNumber style={{ color: 'var(--danger)' }}>
          {numeral(props.totalDeaths).format('0,0')}
        </StatNumber>
      </StatWrapper>
      <StatWrapper>
        <StatLabel>Recoveries:</StatLabel>
        <StatNumber style={{ color: 'var(--success)' }}>
          {numeral(props.totalRecoveries).format('0,0')}
        </StatNumber>
      </StatWrapper>
    </StatList>
  </Wrapper>
)
