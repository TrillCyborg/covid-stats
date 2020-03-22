import moment from 'moment'

const confirmedCSV = require('../data/time-series/confirmed.csv')
const deathsCSV = require('../data/time-series/deaths.csv')
const recoveriesCSV = require('../data/time-series/recoveries.csv')
const dailyCSV = require('../data/reports/03-21-2020.csv')

const START_DATE = '02/24/2020'
const FIELDS = [
  'state',
  'country',
  'latitude',
  'longitude',
]
const DAILY_FIELDS = [
  'state',
  'country',
  'updatedAt',
  'confirmed',
  'deaths',
  'recovered',
  'latitude',
  'longitude',
]
const STATES = [
  'washington',
  'new-york',
  'california',
  'massachusetts',
  'georgia',
  'colorado',
  'florida',
  'new-jersey',
  'oregon',
  'texas',
  'illinois',
  'pennsylvania',
  'iowa',
  'maryland',
  'north-carolina',
  'south-carolina',
  'tennessee',
  'virginia',
  'arizona',
  'indiana',
  'kentucky',
  'nevada',
  'new-hampshire',
  'minnesota',
  'nebraska',
  'ohio',
  'rhode-island',
  'wisconsin',
  'connecticut',
  'hawaii',
  'oklahoma',
  'utah',
  'kansas',
  'louisiana',
  'missouri',
  'vermont',
  'alaska',
  'arkansas',
  'delaware',
  'idaho',
  'maine',
  'michigan',
  'mississippi',
  'montana',
  'new-mexico',
  'north-dakota',
  'south-dakota',
  'west-virginia',
  'wyoming',
  'alabama',
  // 'district-of columbia',
  // 'diamond-princess',
  // 'grand-princess',
  // 'puerto-rico',
  // 'guam',
  // 'virgin-islands',
]

type Item = {
  state: string
  country: string
  latitude: number
  longitude: number
  dates: number[]
}
export type DateItem = { date: number, confirmed: number, deaths: number, recoveries: number }
export type DataItem = Item & { dates: DateItem[] }
export type Data = {
  states: {
    state: string
    country: string
    latitude: string
    longitude: string
    totalCases: number
    totalDeaths: number
    totalRecoveries: number
    mostInfected: number
    dates: DataItem
  },
  dates: DateItem[],
  totalCases: number
  totalDeaths: number
  totalRecoveries: number
  mostInfected: number
}

const dates = confirmedCSV.default.split('\n')[0].split(',').slice(FIELDS.length)
const dailyRows = dailyCSV.default.split('\n').slice(1)

const filterDates = (items: DateItem[]) => items.filter(item => item.date > moment(START_DATE, 'MM/DD/YYYY').valueOf())

const parseData = (data: string) => {
  const rows = data.split('\n').slice(1)
  const items = {}
  rows.forEach((row) => {
    const item = {} as Item
    const cells = row.split(',')
    FIELDS.forEach((field, i) => {
      item[field] = cells[i]
    })

    if (item.country === 'US') {
      item.dates = cells.slice(FIELDS.length).map(x => parseInt(x))
      items[item.state.toLowerCase().replace(' ', '-')] = item
    }
  })
  return items
}

const getData = () => {
  const data = {
    states: {},
    dates: [],
    totalCases: 0,
    totalDeaths: 0,
    totalRecoveries: 0,
    mostInfected: 0,
  }
  const confirmed = parseData(confirmedCSV.default)
  const deaths = parseData(deathsCSV.default)
  const recoveries = parseData(recoveriesCSV.default)

  dailyRows.reduce((obj, r) => {
    const row = r.split(',')
    const rowObj = {} as any
  
    DAILY_FIELDS.forEach((field, i) => {
      rowObj[field] = row[i]
    })
  
    if (rowObj.country === 'US') {
      obj[row[0].toLowerCase().replace(' ', '-')] = rowObj
      const confirmed = parseInt(rowObj.confirmed)
      const deaths = parseInt(rowObj.deaths)
      const recoveries = parseInt(rowObj.recovered)
      data.totalCases += confirmed
      data.totalDeaths += deaths
      data.totalRecoveries += recoveries
      if (confirmed > data.mostInfected) {
        data.mostInfected = confirmed
      }
    }
  
    return obj
  }, {})
  
  STATES.map((state) => {
    const item = confirmed[state]
    item.dates = filterDates(dates.map((d: number, i: number) => {
      const date = moment(d, 'MM/DD/YYYY').valueOf()
      const stateConfirmed = confirmed[state].dates[i]
      const stateDeaths = deaths[state].dates[i]
      const stateRecoveries = recoveries[state].dates[i]
      if (!data.dates[i]) {
        data.dates[i] = {
          date,
          confirmed: 0,
          deaths: 0,
          recoveries: 0,
        }
      }

      data.dates[i].confirmed += stateConfirmed
      data.dates[i].deaths += stateDeaths
      data.dates[i].recoveries += stateRecoveries

      if (i === dates.length - 1) {
        item.totalCases = stateConfirmed
        item.totalDeaths = stateDeaths
        item.totalRecoveries = stateRecoveries
      }

      return {
        date: date,
        confirmed: stateConfirmed,
        deaths: stateDeaths,
        recoveries: stateRecoveries,
      }
    }))

    data.states[state] = item
  })

  data.dates = filterDates(data.dates)

  return data as Data
}

export const covidData = getData()