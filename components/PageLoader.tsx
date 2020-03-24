import styled from '@emotion/styled'

const Wrapper = styled.div<{ open: boolean }>`
  width: 100%;
  min-height: 100%;
  padding-bottom: 10%;
  background-color: #060606;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  pointer-events: none;
  opacity: ${props => (props.open ? 1 : 0)};
  transition: 0.2s ease-in-out;
`

export const PageLoader = (props: { open: boolean }) => (
  <Wrapper open={props.open}>
    <img src="/images/icon.png" style={{ width: '50%', maxWidth: 300 }} />
  </Wrapper>
)
