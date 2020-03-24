import ReactGA from 'react-ga'

export const initialize = () => ReactGA.initialize('UA-161595327-1')
export const logPageView = () => ReactGA.pageview(window.location.pathname + window.location.search)

export const logStateClick = (state: string) => ReactGA.event({
  category: 'Interactions',
  action: 'State Clicked',
  label: state,
});
export const logTotalTabClick = () => ReactGA.event({
  category: 'Interactions',
  action: 'Total Tab Clicked',
});
export const logDailyTabClick = () => ReactGA.event({
  category: 'Interactions',
  action: 'Daily Tab Clicked',
});
export const logExitStateClick = () => ReactGA.event({
  category: 'Interactions',
  action: 'Exit State Clicked',
});


export const OutboundLink = ReactGA.OutboundLink