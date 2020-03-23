import React, { useState, useEffect, useMemo } from 'react'
import anime from 'animejs'
import { scaleSqrt, scaleLinear, scaleQuantize } from '@vx/scale'
import { Group } from '@vx/group'
import { AlbersUsa } from '@vx/geo'
import { useWindowSize } from 'react-use'
import * as topojson from 'topojson-client'
import { Topology } from 'topojson-specification'
import { MapFeature } from './MapFeature'
import topology from '../data/us.json'
import { Data } from '../lib/utils'
import { nomalizeState } from '../lib/utils'
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

interface UnitedStatesProps {
  width: number
  height: number
  data: Data
  currentState: string
  setCurrentState: (state: string) => void
}

export const UnitedStates = (props: UnitedStatesProps) => {
  const { width, height } = props
  const dimentions = useWindowSize()
  const [ready, setReady] = useState(false)
  const [animationDone, setAnimationDone] = useState(false)
  const { background, danger, clear } = currentPallet

  const color = useMemo(
    () =>
      scaleSqrt({
        domain: [0, props.data.mostInfected],
        range: colorRange,
      }),
    [props.data.mostInfected]
  )

  useEffect(() => {
    setReady(true)
    return () => {}
  }, [true])

  return ready ? (
    <svg id="map" width={width} height={height}>
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
                    const data = props.data.states[el.id]
                    return data ? color(data.timeline[data.timeline.length - 1].confirmed) : background
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
                  id={nomalizeState(feature.properties.name)}
                  d={mercator.path(feature)}
                  fill={background}
                  stroke={background}
                  animationDone={animationDone}
                  currentState={props.currentState}
                  onClick={event => {
                    // alert(`clicked: ${feature.properties.name} (${feature.id})`);
                    props.setCurrentState(nomalizeState(feature.properties.name))
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
