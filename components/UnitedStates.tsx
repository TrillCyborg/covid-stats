import React, { useState, useEffect, useMemo } from 'react';
import anime from 'animejs'
import { useWindowSize } from 'react-use'
import { scaleLinear, scaleSqrt, scaleQuantize } from '@vx/scale';
import { AlbersUsa } from '@vx/geo';
import * as topojson from 'topojson-client'
import { Topology } from 'topojson-specification'
import { MapFeature } from './MapFeature'
import topology from '../data/us.json'
import { Data } from '../lib/data'
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

  const color = useMemo(() => scaleSqrt({
    domain: [0, props.data.mostInfected],
    range: colorRange
  }), [props.data.mostInfected]);

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
              const tl = anime.timeline({
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
                delay: function(el, i) { return i * 15 },
              }, 0)
              .add({
                stroke: background,
                fill: (el, i) => {
                  const data = props.data.states[el.id]
                  return data ? color(data.dates[data.dates.length - 1].confirmed) : background
                },
                delay: function(el, i) { return i * 10 },
              }, 600)
              .add({
                targets: '#page-header',
                opacity: 1,
                duration: 800,
              }, 1800)
              .add({
                targets: '#page-footer',
                opacity: 0.4,
                duration: 800,
              }, 1800)
              // .add({
              //   targets: '#page-header',
              //   opacity: 1,
              //   duration: 0,
              // }, 0)
              // .add({
              //   targets: '#page-footer',
              //   opacity: 0.4,
              //   duration: 0,
              // }, 0)
              if (dimentions.width >= BREAKPOINTS[0]) {
                tl
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
                  // .add({
                  //   targets: '#map',
                  //   translateX: "-20%",
                  //   duration: 0,
                  // }, 0).add({
                  //   targets: '#info-modal',
                  //   translateX: 'calc(-100% - 30px)',
                  //   duration: 0,
                  // }, 0)
              } else {
                tl
                  .add({
                    targets: '#info-modal',
                    opacity: 1,
                    duration: 800,
                  }, 1800)
                  // }, 0).add({
                  //   targets: '#info-modal',
                  //   opacity: 1,
                  //   duration: 0,
                  // }, 0)
              }
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
                  stroke={background}
                  animationDone={animationDone}
                  currentState={props.currentState}
                  onClick={event => {
                    // alert(`clicked: ${feature.properties.name} (${feature.id})`);
                    props.setCurrentState(feature.properties.name.toLowerCase().replace(' ', '-'))
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