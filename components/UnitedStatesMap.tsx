import React, { useState, useEffect, useMemo } from 'react'
import anime from 'animejs'
import { scaleSqrt, scaleLinear, scaleQuantize } from '@vx/scale'
import { Group } from '@vx/group'
import { AlbersUsa } from '@vx/geo'
import { useWindowSize } from 'react-use'
import * as topojson from 'topojson-client'
import { Topology } from 'topojson-specification'
import { MapFeature } from './MapFeature'
import topology from '../data/geo/us.json'
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
  topology.objects.states as any
) as any

interface UnitedStatesMapProps {
  width: number
  height: number
  data: Partial<Data>
  currentState: string
  setCurrentState: (state: string) => void
}

export const UnitedStatesMap = (props: UnitedStatesMapProps) => {
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
          props.data.items &&
          props.data.items.usa &&
          props.data.items.usa.mostInfected
            ? props.data.items.usa.mostInfected
            : 0,
        ],
        range: colorRange,
      }),
    [props.data]
  )

  useEffect(() => {
    if (props.data && props.data.statesDataLoaded && !ready) setReady(true)
    return () => {}
  }, [props.data])

  return ready ? (
    <svg id="map" width={width} height={height} style={{ animation: 'var(--fade-in)' }}>
      {/* <rect x={0} y={0} width={width} height={height} fill={background} rx={0} /> */}
      <AlbersUsa
        data={map.features}
        scale={dimentions.width <= BREAKPOINTS[0] ? width * 1.2 : width}
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
                    return i * 15
                  },
                }, 0)
                .add({
                  stroke: background,
                  fill: (el, i) => {
                    const data = props.data.items.usa.states[el.id]
                    return data ? color(data.cases) : background
                  },
                  delay: function(el, i) {
                    return i * 10
                  },
                }, 600)
              return () => {}
            }
            return () => {}
          }, [ready])

          return (
            <Group top={0} left={dimentions.width <= BREAKPOINTS[0] ? width * 0.02 : 0}>
              {mercator.features.map(({ feature }: any, i) => (
                <MapFeature
                  key={`map-feature-${i}`}
                  id={nomalizeLocation(feature.properties.name)}
                  d={mercator.path(feature)}
                  fill={background}
                  stroke={background}
                  animationDone={animationDone}
                  currentLocation={props.currentState}
                  onClick={event => {
                    logStateClick(feature.properties.name)
                    props.setCurrentState(nomalizeLocation(feature.properties.name))
                  }}
                />
              ))}
            </Group>
          )
        }}
      </AlbersUsa>
    </svg>
  ) : null
}
