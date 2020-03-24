import numeral from 'numeral'

export const ChartLabel = (props: { children: Array<string | JSX.Element>; amount?: number }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <h3 style={{ color: 'var(--accent)', textAlign: 'left', marginBottom: 12, marginTop: 18 }}>
      {props.children}
      {props.amount ? ':' : ''}
    </h3>
    {props.amount ? (
      <h3 style={{ color: 'var(--accent)', textAlign: 'left', marginBottom: 12, marginTop: 18 }}>
        {numeral(props.amount).format('0,0')}
      </h3>
    ) : null}
  </div>
)
