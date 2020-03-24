import { find } from 'lodash'
import moment from 'moment'
import { nomalizeState, DataItem, Data } from '../lib/utils'
import { START_DATE, STATES } from '../consts'

const apiEndpoint = 'https://corona.lmao.ninja'

export const getData = async () => {
  let mostInfected = 0
  const states = {} as { [key: string]: DataItem }
  const usaData = await fetch('https://corona.lmao.ninja/countries/USA').then(res => res.json())
  const statesData = await fetch('https://corona.lmao.ninja/states').then(res => res.json())
  const allHistorical = await fetch('https://corona.lmao.ninja/historical').then(res => res.json())
  const usaHistorical = await fetch('https://corona.lmao.ninja/historical/usa').then(res =>
    res.json()
  )
  const statesHistorical = allHistorical.filter(
    ({ country, province }) => country === 'usa' && STATES.indexOf(nomalizeState(province)) !== -1
  )
  const allDates = Object.keys(usaHistorical.timeline.cases).map(date =>
    moment(date, 'M/D/YY').valueOf()
  )
  const filteredDates = allDates.filter(d => d > moment(START_DATE, 'M/D/YY').valueOf())
  statesData
    .filter(({ state }) => STATES.indexOf(nomalizeState(state)) !== -1)
    .forEach(state => {
      const id = nomalizeState(state.state)
      const history = find(statesHistorical, ({ province }) => nomalizeState(province) === id)

      if (state.cases > mostInfected) {
        mostInfected = state.cases
      }

      states[id] = {
        ...state,
        name: state.state,
        timeline: filteredDates.map(d => {
          const date = moment(d).format('M/D/YY')
          return {
            date: d,
            confirmed: parseInt(history.timeline.cases[date], 10),
            deaths: parseInt(history.timeline.deaths[date], 10),
            recoveries: parseInt(history.timeline.recovered[date], 10),
          }
        }),
      } as DataItem
    })
  return {
    mostInfected,
    usa: {
      ...usaData,
      name: usaData.country,
      timeline: filteredDates.map(d => {
        const date = moment(d).format('M/D/YY')
        return {
          date: d,
          confirmed: parseInt(usaHistorical.timeline.cases[date], 10),
          deaths: parseInt(usaHistorical.timeline.deaths[date], 10),
          recoveries: parseInt(usaHistorical.timeline.recovered[date], 10),
        }
      }),
    } as DataItem,
    states,
  } as Data
}

export const fetcher = async (url: string) => {
  if (url === '/data') {
    return getData()
  } else {
    return fetch(`${apiEndpoint}${url}`).then(res => res.json())
  }
}
