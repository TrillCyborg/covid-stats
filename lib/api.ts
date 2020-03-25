import { find } from 'lodash'
import moment from 'moment-timezone'
import { nomalizeState, denormalizeState, DataItem, Data } from '../lib/utils'
import { START_DATE, STATES, STATE_MAP } from '../consts'

// const serverEndpoint = 'https://api.covidstats.app'
const serverEndpoint = 'https://corona.lmao.ninja'
const covidTrackingEndpoint = 'https://covidtracking.com/api/'

const getDataFromServer: () => Promise<Data> = async () => {
  let mostInfected = 0
  const states = {} as { [key: string]: DataItem }
  const usaData = await fetch(`${serverEndpoint}/countries/USA`).then(res => res.json())
  const statesData = await fetch(`${serverEndpoint}/states`).then(res => res.json())
  const allHistorical = await fetch(`${serverEndpoint}/historical`).then(res => res.json())
  const usaHistorical = await fetch(`${serverEndpoint}/v2/historical/usa`).then(res => res.json())
  const statesHistorical = allHistorical.filter(
    ({ country, province }) => country === 'usa' && STATES.indexOf(nomalizeState(province)) !== -1
  )
  const allDates = Object.keys(usaHistorical.timeline.cases).map(date =>
    moment(date, 'M/D/YY')
      .tz('Etc/GMT')
      .valueOf()
  )
  const filteredDates = allDates.filter(
    d =>
      d >
      moment(START_DATE, 'M/D/YY')
        .tz('Etc/GMT')
        .valueOf()
  )
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
    usa: {
      ...usaData,
      name: 'United States',
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
    } as DataItem,
    states,
  } as Data
}

// const getDataFromCovidTracking: () => Promise<Data> = async () => {
//   let mostInfected = 0
//   const states = {} as { [key: string]: DataItem }
//   const usaData = await fetch(`${covidTrackingEndpoint}/us`).then(res => res.json())
//   const usaHistorical = await fetch(`${covidTrackingEndpoint}/us/daily`).then(res => res.json())
//   const statesData = await fetch(`${covidTrackingEndpoint}/states`).then(res => res.json())
//   const statesHistorical = await fetch(`${covidTrackingEndpoint}/states/daily`).then(res =>
//     res.json()
//   )
//   const historical = statesHistorical.reduce((obj, item) => {
//     if (!obj[item.state]) {
//       obj[item.state] = []
//     }
//     obj[item.state].push(item)
//     return obj
//   }, {})
//   const allDates = usaHistorical.map(({ date }) =>
//     moment(date, 'YYYYMMDD')
//       .tz('Etc/GMT')
//       .valueOf()
//   )
//   const filteredDates = allDates.filter(
//     d =>
//       d >
//       moment(START_DATE, 'M/D/YY')
//         .tz('Etc/GMT')
//         .valueOf()
//   )
//   statesData.forEach(state => {
//     const id = STATE_MAP[state.state]
//     const history = historical[state.state]

//     if (id) {
//       if (state.positive > mostInfected) {
//         mostInfected = state.positive
//       }

//       states[id] = {
//         ...state,
//         name: denormalizeState(id),
//         cases: usaData.positive,
//         // todayCases?: number
//         deaths: usaData.death,
//         // todayDeaths?: number
//         // recovered: number
//         // todayRecovered?: number
//         // active: number
//         // critical?: number
//         // casesPerOneMillion?: number
//         timeline: filteredDates
//           .reverse()
//           .map((d, i) => {
//             const date = history[i]
//             if (date) {
//               return {
//                 date: d,
//                 confirmed: parseInt(date.positive, 10),
//                 deaths: parseInt(date.death, 10),
//                 // recoveries: parseInt(date.recovered, 10),
//               }
//             }
//             return null
//           })
//           .filter(d => !!d),
//       } as DataItem
//     }
//   })
//   return {
//     mostInfected,
//     usa: {
//       ...usaData[0],
//       name: 'United States',
//       cases: usaData[0].positive,
//       // todayCases?: number
//       deaths: usaData[0].death,
//       // todayDeaths?: number
//       // recovered: number
//       // todayRecovered?: number
//       // active: number
//       // critical?: number
//       // casesPerOneMillion?: number
//       timeline: filteredDates.reverse().map((d, i) => ({
//         date: d,
//         confirmed: parseInt(usaHistorical[i].positive, 10),
//         deaths: parseInt(usaHistorical[i].death, 10),
//         // recoveries: parseInt(usaHistorical[i].recovered, 10),
//       })),
//     } as DataItem,
//     states,
//   } as Data
// }

export const fetcher = async (url: string) => {
  if (url === '/data') {
    return getData()
  } else {
    return fetch(`${serverEndpoint}${url}`).then(res => res.json())
  }
}

export const getData = getDataFromServer
