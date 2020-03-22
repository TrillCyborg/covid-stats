import numeral from 'numeral'

export const ChartLabel = (props: { children: string; amount?: number }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <h3 style={{ color: 'var(--accent)', textAlign: 'left', marginBottom: 10 }}>
      {props.children}
      {props.amount ? ':' : ''}
    </h3>
    {props.amount ? (
      <h3 style={{ color: 'var(--accent)', textAlign: 'left', marginBottom: 10 }}>
        {numeral(props.amount).format('0,0')}
      </h3>
    ) : null}
  </div>
)
