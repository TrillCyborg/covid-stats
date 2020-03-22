import React, { useEffect, useRef } from 'react'

interface MapFeatureProps {
  id: string
  d: string
  fill: string
  stroke: string
  animationDone: boolean
  currentState: string
  onClick?: (e: React.MouseEvent<SVGPathElement, MouseEvent>) => void
}

export const MapFeature = (props: MapFeatureProps) => {
  const ref = useRef<SVGPathElement>()

  // useEffect(() => {
  //   const onMouseEnter = () => console.log('IN', props.id)
  //   const onMouseLeave = () => console.log('OUT', props.id)
  //   if (ref.current) {
  //     ref.current.addEventListener('mouseenter', onMouseEnter)
  //     ref.current.addEventListener('mouseleave', onMouseLeave)
  //     return () => {
  //       ref.current.removeEventListener('mouseenter', onMouseEnter)
  //       ref.current.removeEventListener('mouseleave', onMouseLeave)
  //     }
  //   }
  //   return () => {}
  // }, [ref.current])

  return (
    <path
      id={props.id}
      ref={ref}
      className={`map-path ${props.animationDone ? 'animation-done' : ''} ${
        props.currentState === props.id ? 'active' : ''
      }`}
      d={props.d}
      fill={props.fill}
      stroke={props.stroke}
      strokeWidth={0.5}
      onClick={props.animationDone ? props.onClick : undefined}
    />
  )
}
