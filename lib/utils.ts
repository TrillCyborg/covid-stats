export const nomalizeState = (state: string) => state.toLowerCase().replace(/\s/g, '-')

export type DataItem = {
  name: string
  cases: number
  todayCases?: number
  deaths: number
  todayDeaths?: number
  recovered: number
  todayRecovered?: number
  active: number
  critical?: number
  casesPerOneMillion?: number
  timeline: DateItem[]
}

export type DateItem = { date: number; confirmed: number; deaths: number; recoveries: number }

export type Data = {
  mostInfected: number
  usa: DataItem
  states: { [key: string]: DataItem }
}
