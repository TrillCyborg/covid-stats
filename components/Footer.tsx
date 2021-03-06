import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { OutboundLink } from '../lib/analytics'
import { BREAKPOINTS } from '../consts'

const Wrapper = styled.p`
  width: calc(70% - 30px);
  position: absolute;
  bottom: 0;
  color: var(--accent);
  margin: 0;
  font-size: 12px;
  padding: 30px;
  z-index: 1;
  animation: var(--fade-in);

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
        Made with ❤️ by{' '}
        <OutboundLink eventLabel="twitter" to="https://twitter.com/trillcyborg" target="_blank">
          @trillcyborg
        </OutboundLink>
        <br />
        Stay home.
      </div>
      <div style={{ textAlign: 'right' }}>
        <OutboundLink eventLabel="source" to="https://github.com/NovelCOVID/API" target="_blank">
          Data Source
        </OutboundLink>
      </div>
    </Wrapper>
  ) : null
}
