import React, { useState, useEffect, useMemo } from 'react'
import anime from 'animejs'
import { scaleSqrt, scaleLinear, scaleQuantize } from '@vx/scale'
import { Group } from '@vx/group'
import { Mercator } from '@vx/geo'
import { useWindowSize } from 'react-use'
import * as topojson from 'topojson-client'
import { Topology } from 'topojson-specification'
import { MapFeature } from './MapFeature'
import topology from '../data/geo/world-sm.json'
import { Data } from '../lib/utils'
import { logStateClick } from '../lib/analytics'
import { nomalizeLocation } from '../lib/utils'
import { BREAKPOINTS } from '../consts'

const palltes = [
  { background: '#030303', danger: '#af0404', clear: '#030303', accent: '#ffac41' },
  { background: '#060606', danger: '#af0404', clear: '#060606', accent: '#797979' },
]

const currentPallet = palltes[1]
const colorRange = [currentPallet.clear, currentPallet.danger]

const map = topojson.feature(
  (topology as unknown) as Topology,
  (topology as any).objects.countries as any
) as any

interface WorldMapProps {
  width: number
  height: number
  data: Partial<Data>
  currentCountry: string
  setCurrentCountry: (state: string) => void
}

export const WorldMap = (props: WorldMapProps) => {
  const { width, height } = props
  const dimentions = useWindowSize()
  const [ready, setReady] = useState(false)
  const [animationDone, setAnimationDone] = useState(false)
  const { background, danger, clear } = currentPallet

  const color = useMemo(
    () =>
      scaleSqrt({
        domain: [
          0,
          props.data &&
          props.data.mostInfected
            ? props.data.mostInfected
            : 0,
        ],
        range: colorRange,
      }),
    [props.data]
  )

  useEffect(() => {
    if (props.data && props.data.worldDataLoaded && !ready) setReady(true)
    return () => {}
  }, [props.data])

  return ready ? (
    <svg id="map" width={width} height={height} style={{ animation: 'var(--fade-in)' }}>
      {/* <rect x={0} y={0} width={width} height={height} fill={background} rx={0} /> */}
      <Mercator
        data={map.features}
        scale={dimentions.width <= BREAKPOINTS[0] ? width * 0.13 : width * 0.11}
        translate={[width / 2, height / 2]}
      >
        {mercator => {
          useEffect(() => {
            if (ready) {
              anime
                .timeline({
                  targets: '.map-path',
                  easing: 'easeInOutQuad',
                  complete: () => setAnimationDone(true),
                })
                .add({
                  stroke: danger,
                  durration: 0,
                })
                .add({
                  strokeDashoffset: [anime.setDashoffset, 0],
                  delay: function(el, i) {
                    return i * 10
                  },
                }, 0)
                .add({
                  stroke: background,
                  fill: (el, i) => {
                    const data = props.data.items[el.id]
                    return data ? color(data.cases) : background
                  },
                  delay: function(el, i) {
                    return i * 5
                  },
                }, 800)
              return () => {}
            }
            return () => {}
          }, [ready])

          return (
            <Group top={80} left={dimentions.width <= BREAKPOINTS[0] ? 0 : -25}>
              {mercator.features.map(({ feature }: any, i) => (
                <MapFeature
                  key={`map-feature-${i}`}
                  id={nomalizeLocation(feature.properties.name)}
                  d={mercator.path(feature)}
                  fill={background}
                  stroke={background}
                  animationDone={animationDone}
                  currentLocation={props.currentCountry}
                  onClick={event => {
                    logStateClick(feature.properties.name)
                    props.setCurrentCountry(nomalizeLocation(feature.properties.name))
                  }}
                />
              ))}
            </Group>
          )
        }}
      </Mercator>
    </svg>
  ) : null
}
