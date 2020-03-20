import React, { useState, useEffect } from 'react';
import anime from 'animejs'
import { useWindowSize } from 'react-use'
import * as topojson from 'topojson-client';
import { Topology } from 'topojson-specification'
import { scaleLinear, scaleSqrt, scaleQuantize } from '@vx/scale';
import { AlbersUsa } from '@vx/geo';
import topology from '../data/us.json';
import { MapFeature } from './MapFeature'
const covidCSV = require('../data/03-19-2020.csv');

const palltes = [
  { background: '#030303', danger: '#af0404', clear: '#030303', accent: '#ffac41' },
  { background: '#060606', danger: '#af0404', clear: '#060606', accent: '#797979' },
]

const currentPallet = palltes[1]
const colorRange = [currentPallet.clear, currentPallet.danger]

let mostInfected = 0
const dataFields = ['state', 'country', 'updatedAt', 'confirmed', 'deaths', 'recovered', 'latitude', 'longitude'];
const covidRows = covidCSV.default.split('\n').slice(1)
const covidData = covidRows.reduce((obj, r) => {
  const row = r.split(',')
  const rowObj = {} as any

  dataFields.forEach((field, i) => {
    rowObj[field] = row[i]
  })

  if (rowObj.country === 'US') {
    obj[row[0].toLowerCase().replace(' ', '-')] = rowObj
    const confirmed = parseInt(rowObj.confirmed)
    if (confirmed > mostInfected) {
      mostInfected = confirmed
    }
  }

  return obj
}, {})

const map = topojson.feature(topology as unknown as Topology, topology.objects.states as any) as any
const color = scaleSqrt({
  domain: [0, mostInfected],
  range: colorRange
});

interface UnitedStatesProps {
  width: number
  height: number
}

export const UnitedStates = (props: UnitedStatesProps) => {
  const { width, height } = props
  const dimentions = useWindowSize()
  const [ready, setReady] = useState(false)
  const [animationDone, setAnimationDone] = useState(false)
  const [active, setActive] = useState('')
  const { background, danger, clear } = currentPallet

  useEffect(() => {
    setReady(true)
    return () => {}
  }, [true])

  return ready ? (
    <svg id="map" width={width} height={height}>
      {/* <rect x={0} y={0} width={width} height={height} fill={background} rx={0} /> */}
      <AlbersUsa data={map.features} scale={width} translate={[width / 2, height / 2]}>
        {mercator => {
          useEffect(() => {
            if (ready) {
              anime.timeline({
                targets: '.map-path',
                easing: 'easeInOutQuad',
                complete: () => setAnimationDone(true),
              })
              .add({
                strokeDashoffset: [anime.setDashoffset, 0],
                delay: function(el, i) { return i * 15 },
              })
              .add({
                stroke: background,
                fill: (el, i) => {
                  const data = covidData[el.id]
                  return data ? color(data.confirmed) : background
                },
                delay: function(el, i) { return i * 10 },
              }, 600)
              .add({
                targets: '#page-title',
                opacity: 1,
                duration: 800,
              }, 1800)
              .add({
                targets: '#page-footer',
                opacity: 0.4,
                duration: 800,
              }, 1800)
              .add({
                targets: '#map',
                translateX: "-20%",
                duration: 800,
              }, 1800)
              .add({
                targets: '#info-modal',
                translateX: 'calc(-100% - 30px)',
                duration: 800,
              }, 1800)
              return () => {}
            }
            return () => {}
          }, [ready])

          return (
            <g>
              {mercator.features.map(({ feature }: any, i) => (
                <MapFeature
                  key={`map-feature-${i}`}
                  id={feature.properties.name.toLowerCase().replace(' ', '-')}
                  d={mercator.path(feature)}
                  fill={background}
                  stroke={danger}
                  // hidden={active !== feature.properties.name.toLowerCase().replace(' ', '-')}
                  animationDone={animationDone}
                  onClick={event => {
                    // alert(`clicked: ${feature.properties.name} (${feature.id})`);
                    setActive(feature.properties.name.toLowerCase().replace(' ', '-'))
                  }}
                />
              ))}
            </g>
          );
        }}
      </AlbersUsa>
    </svg>
  ) : null;
};