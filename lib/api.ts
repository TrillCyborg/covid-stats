import { find } from 'lodash'
import moment from 'moment-timezone'
import { nomalizeLocation, DataItem, DateItem, Data } from '../lib/utils'
import { START_DATE, STATES } from '../consts'

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

const getGlobalData = async () => {
  const globalData = await fetch(`${serverEndpoint}/all`).then(res => res.json())
  return {
    id: 'global',
    name: 'Global',
    ...globalData
  }
}

const getWorldData = async () => {
  let mostInfected = 0
  const worldData = await fetch(`${serverEndpoint}/countries`).then(res => res.json())
  const data = {}
  worldData.forEach(country => {
    let name = country.country
    let id = nomalizeLocation(name)
    switch (name.toLowerCase()) {
      case 'usa':
        name = 'United States'
        break;
      case 'uk':
        name = 'United Kingdom'
        break;
      case 'uae':
        name = 'United Arab Emirates'
        break;
      case 'drc':
        name = 'Democratic Republic of the Congo'
        break;
      case 'car':
        name = 'Central African Republic'
        break;
      case 's. korea':
        name = 'South Korea'
        id = nomalizeLocation(name)
        break;
      case 'n. korea':
        name = 'North Korea'
        id = nomalizeLocation(name)
        break;
      case 'north macedonia':
        name = 'Macedonia'
        id = nomalizeLocation(name)
        break;
      default:
        break;
    }
    data[id] = {
      ...country,
      name,
    } as Partial<DataItem>

    if (country.cases > mostInfected) {
      mostInfected = country.cases
    }
  })

  return {
    mostInfected,
    items: data
  } as Partial<Data>
}

const getUSData = async () => {
  const usaData = await fetch(`${serverEndpoint}/countries/USA`).then(res => res.json())
  return {
    ...usaData,
    name: 'United States',
  } as Partial<DataItem>
}

const getWorldChartData = async () => {
  const worldHistorical = await fetch(`${serverEndpoint}/v2/historical`).then(res => res.json())
  const filteredDates = filterRelevantDates(Object.keys(worldHistorical[0].timeline.cases))
  const countries = {}
  const global = {
    id: 'global',
    name: 'Global',
    timeline: []
  } as Partial<DataItem>
  worldHistorical.forEach(country => {
    let name = country.country
    let id = nomalizeLocation(name)
    switch (name.toLowerCase()) {
      case 's. korea':
        name = 'South Korea'
        id = nomalizeLocation(name)
        break;
      case 'n. korea':
        name = 'North Korea'
        id = nomalizeLocation(name)
        break;
      case 'north macedonia':
        name = 'Macedonia'
        id = nomalizeLocation(name)
        break;
      default:
        break;
    }

    countries[id] = {
      timeline: filteredDates.map((d, i) => {
        const date = moment(d)
          .tz('Etc/GMT')
          .format('M/D/YY')
        if (!global.timeline[i]) {
          global.timeline[i] = {
            date: d,
            confirmed: parseInt(country.timeline.cases[date], 10),
            deaths: parseInt(country.timeline.deaths[date], 10),
            // recoveries: parseInt(country.timeline.recovered[date], 10),
          } as DateItem
        } else {
          global.timeline[i].confirmed = global.timeline[i].confirmed + parseInt(country.timeline.cases[date], 10)
          global.timeline[i].deaths = global.timeline[i].deaths + parseInt(country.timeline.deaths[date], 10)
          // global.timeline[i].recoveries = global.timeline[i].recoveries + parseInt(country.timeline.recovered[date], 10)
        }
        return {
          date: d,
          confirmed: parseInt(country.timeline.cases[date], 10),
          deaths: parseInt(country.timeline.deaths[date], 10),
          // recoveries: parseInt(country.timeline.recovered[date], 10),
        }
      })
    }
  })

  return {
    global,
    items: countries
  } as Partial<Data>
}

const getUSChartData = async () => {
  const usaHistorical = await fetch(`${serverEndpoint}/v2/historical/usa`).then(res => res.json())
  const filteredDates = filterRelevantDates(Object.keys(usaHistorical.timeline.cases))
  return {
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
  } as Partial<DataItem>
}

const getStatesData = async () => {
  let mostInfected = 0
  const states = {} as { [key: string]: DataItem }
  const statesData = await fetch(`${serverEndpoint}/states`).then(res => res.json())
  const allHistorical = await fetch(`${serverEndpoint}/historical`).then(res => res.json())
  const statesHistorical = allHistorical.filter(
    ({ country, province }) => country === 'usa' && STATES.indexOf(nomalizeLocation(province)) !== -1
  )
  const filteredDates = filterRelevantDates(Object.keys(statesHistorical[0].timeline.cases))
  statesData
    .filter(({ state }) => STATES.indexOf(nomalizeLocation(state)) !== -1)
    .forEach(state => {
      const id = nomalizeLocation(state.state)
      const history = find(statesHistorical, ({ province }) => nomalizeLocation(province) === id)

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
    items: {
      usa: {
        mostInfected,
        states,
      } as Partial<DataItem>
    }
  } as Partial<Data>
}

export const fetcher = async (
  url: string,
  opts?: { body: string; method: string; noAuth?: boolean }
) => {
  switch (url) {
    case '/global-data':
      return getGlobalData()
    case '/world-data':
      return getWorldData()
    case '/world-chart-data':
      return getWorldChartData()
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