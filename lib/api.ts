import { find } from 'lodash'
import moment from 'moment-timezone'
import { nomalizeState, denormalizeState, DataItem, Data } from '../lib/utils'
import { START_DATE, STATES, STATE_MAP } from '../consts'

// const serverEndpoint = 'https://api.covidstats.app'
const serverEndpoint = 'https://corona.lmao.ninja'

const filterRelevantDates = (dates: string[]) =>
  dates
    .map(date =>
      moment(date, 'M/D/YY')
        .tz('Etc/GMT')
        .valueOf()
    )
    .filter(
      d =>
        d >
        moment(START_DATE, 'M/D/YY')
          .tz('Etc/GMT')
          .valueOf()
    )

const getUSData = async () => {
  const usaData = await fetch(`${serverEndpoint}/countries/USA`).then(res => res.json())
  return {
    usa: {
      ...usaData,
      name: 'United States',
    } as Partial<DataItem>,
  } as Partial<Data>
}

const getUSChartData = async () => {
  const usaHistorical = await fetch(`${serverEndpoint}/v2/historical/usa`).then(res => res.json())
  const filteredDates = filterRelevantDates(Object.keys(usaHistorical.timeline.cases))
  return {
    usa: {
      timeline: filteredDates.map(d => {
        const date = moment(d)
          .tz('Etc/GMT')
          .format('M/D/YY')
        return {
          date: d,
          confirmed: parseInt(usaHistorical.timeline.cases[date], 10),
          deaths: parseInt(usaHistorical.timeline.deaths[date], 10),
          // recoveries: parseInt(usaHistorical.timeline.recovered[date], 10),
        }
      }),
    } as Partial<DataItem>,
  } as Partial<Data>
}

const getStatesData = async () => {
  let mostInfected = 0
  const states = {} as { [key: string]: DataItem }
  const statesData = await fetch(`${serverEndpoint}/states`).then(res => res.json())
  const allHistorical = await fetch(`${serverEndpoint}/historical`).then(res => res.json())
  const statesHistorical = allHistorical.filter(
    ({ country, province }) => country === 'usa' && STATES.indexOf(nomalizeState(province)) !== -1
  )
  const filteredDates = filterRelevantDates(Object.keys(statesHistorical[0].timeline.cases))
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
          const date = moment(d)
            .tz('Etc/GMT')
            .format('M/D/YY')
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
    states,
  } as Partial<Data>
}

export const fetcher = async (
  url: string,
  opts?: { body: string; method: string; noAuth?: boolean }
) => {
  switch (url) {
    case '/us-data':
      return getUSData()
    case '/us-chart-data':
      return getUSChartData()
    case '/state-data':
      return getStatesData()
    default:
      return {}
  }
}