import styled from '@emotion/styled'

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

  opacity: 0;

  a {
    color: var(--accent);
  }
`

export const Footer = () => (
  <Wrapper id="page-footer">
    <div>
      Made with ❤️
      <br />
      by <a href="https://twitter.com/trillcyborg" target="_blank">@trillcyborg</a>, for the sake of us all.
    </div>
    <div style={{ textAlign: 'right' }}>
      <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank">Data Source</a>
      <br />
      Last update: 03/21/2020
    </div>
  </Wrapper>
)
