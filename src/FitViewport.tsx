import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type Props = {
  width: number
  height: number
  children: ReactNode
  background?: string
  /** Cap how large the stage can grow on big screens */
  maxScale?: number
  /** Cap how small the stage can shrink (below this, letterbox more) */
  minScale?: number
  style?: CSSProperties
  stageStyle?: CSSProperties
}

/**
 * Centers a fixed design-size stage and scales it to fit the viewport.
 * On phones/tablets held upright, the stage is rotated so it always
 * presents as a landscape desktop layout.
 */
export default function FitViewport({
  width,
  height,
  children,
  background = '#0c1c2e',
  maxScale = 1.4,
  minScale = 0.35,
  style,
  stageStyle,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [forceLandscape, setForceLandscape] = useState(false)
  const [hostSize, setHostSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const update = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      if (w <= 0 || h <= 0) return

      setHostSize({ w, h })

      // Portrait phone/tablet: treat available space as landscape after 90° rotate
      const portrait = h > w
      setForceLandscape(portrait)
      const availW = portrait ? h : w
      const availH = portrait ? w : h

      const next = Math.min(availW / width, availH / height, maxScale)
      setScale(Math.max(next, minScale))
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(host)
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [width, height, maxScale, minScale])

  return (
    <div
      ref={hostRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background,
        ...style,
      }}
    >
      <div
        style={
          forceLandscape
            ? {
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: hostSize.h,
                height: hostSize.w,
                transform: 'translate(-50%, -50%) rotate(90deg)',
                transformOrigin: 'center center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background,
              }
            : {
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }
        }
      >
        <div
          style={{
            width,
            height,
            flexShrink: 0,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            ...stageStyle,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
