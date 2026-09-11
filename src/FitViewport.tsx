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
 * Keeps presentation layouts proportional when the window grows or shrinks.
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

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const update = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      if (w <= 0 || h <= 0) return
      const next = Math.min(w / width, h / height, maxScale)
      setScale(Math.max(next, minScale))
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(host)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
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
  )
}
