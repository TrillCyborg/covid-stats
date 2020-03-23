import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { BREAKPOINTS } from '../consts'

const Wrapper = styled.p`
  width: calc(70% - 30px);
  position: absolute;
  bottom: 0;
  color: var(--accent);
  margin: 0;
  font-size: 12px;
  /* padding: 20px 30px; */
  padding: 30px;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  a {
    color: var(--accent);
  }

  @media (max-width: ${BREAKPOINTS[0]}px) {
    bottom: 20vh;
    width: 100%;
    font-size: 10px;
  }
`

export const Footer = () => {
  const [ready, setReady] = useState(false)
  
  useEffect(() => {
    setReady(true)
    return () => {}
  }, [true])

  return ready ? (
    <Wrapper id="page-footer">
      <div>
        Made with ❤️ by <a href="https://twitter.com/trillcyborg" target="_blank">@trillcyborg</a>.
        <br />
        Stay home.
      </div>
      <div style={{ textAlign: 'right' }}>
        <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank">Data Source</a>
        <br />
        Last update: 03/21/2020
      </div>
    </Wrapper>
  ) : null
}