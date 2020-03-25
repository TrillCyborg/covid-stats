import { capitalize } from 'lodash'

export const nomalizeLocation = (state: string) => state.toLowerCase().replace(/\s/g, '-')
export const denormalizeLocation = (state: string) => capitalize(state.replace(/-/g, ' '))

export type DataItem = {
  name: string
  cases: number
  todayCases?: number
  deaths: number
  todayDeaths?: number
  recovered?: number
  todayRecovered?: number
  active?: number
  critical?: number
  casesPerOneMillion?: number
  mostInfected?: number
  timeline: DateItem[]
  states?: {
    [key: string]: DataItem
  }
}

export type DateItem = { date: number; confirmed: number; deaths: number; recoveries: number }

export type Data = {
  worldDataLoaded?: boolean
  usDataLoaded?: boolean
  usChartDataLoaded?: boolean
  statesDataLoaded?: boolean
  mostInfected: number
  global: DataItem
  items: {
    [key: string]: DataItem
  }
}