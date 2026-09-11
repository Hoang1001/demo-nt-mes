import { useCallback, useEffect, useState } from 'react'

async function lockLandscape() {
  try {
    const orientation = screen.orientation as ScreenOrientation & {
      lock?: (orientation: string) => Promise<void>
    }
    if (orientation?.lock) await orientation.lock('landscape')
  } catch {
    /* iOS / unsupported — FitViewport CSS rotate handles this */
  }
}

async function unlockOrientation() {
  try {
    screen.orientation?.unlock?.()
  } catch {
    /* ignore */
  }
}

async function requestFs(el: Element = document.documentElement) {
  const anyEl = el as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void> | void
    msRequestFullscreen?: () => Promise<void> | void
  }
  if (anyEl.requestFullscreen) await anyEl.requestFullscreen()
  else if (anyEl.webkitRequestFullscreen) await anyEl.webkitRequestFullscreen()
  else if (anyEl.msRequestFullscreen) await anyEl.msRequestFullscreen()
}

async function exitFs() {
  const doc = document as Document & {
    webkitExitFullscreen?: () => Promise<void> | void
    msExitFullscreen?: () => Promise<void> | void
  }
  if (document.fullscreenElement || (doc as any).webkitFullscreenElement) {
    if (doc.exitFullscreen) await doc.exitFullscreen()
    else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen()
    else if (doc.msExitFullscreen) await doc.msExitFullscreen()
  }
}

function isFullscreenActive() {
  const doc = document as Document & { webkitFullscreenElement?: Element | null }
  return !!(document.fullscreenElement || doc.webkitFullscreenElement)
}

export function usePresentationFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [needsGesture, setNeedsGesture] = useState(true)

  const enter = useCallback(async () => {
    try {
      if (!isFullscreenActive()) await requestFs()
      await lockLandscape()
      setNeedsGesture(false)
      setIsFullscreen(true)
      return true
    } catch {
      setNeedsGesture(true)
      return false
    }
  }, [])

  const exit = useCallback(async () => {
    try {
      await unlockOrientation()
      await exitFs()
    } catch {
      /* ignore */
    }
  }, [])

  const toggle = useCallback(async () => {
    if (isFullscreenActive()) await exit()
    else await enter()
  }, [enter, exit])

  const dismissPrompt = useCallback(() => {
    setNeedsGesture(false)
  }, [])

  useEffect(() => {
    setIsFullscreen(isFullscreenActive())
    if (isFullscreenActive()) setNeedsGesture(false)

    const onChange = () => {
      const active = isFullscreenActive()
      setIsFullscreen(active)
      if (active) setNeedsGesture(false)
    }
    document.addEventListener('fullscreenchange', onChange)
    document.addEventListener('webkitfullscreenchange', onChange as EventListener)

    // Browsers usually block this without a gesture; try anyway.
    void enter()

    return () => {
      document.removeEventListener('fullscreenchange', onChange)
      document.removeEventListener('webkitfullscreenchange', onChange as EventListener)
    }
  }, [enter])

  return { isFullscreen, needsGesture, enter, exit, toggle, dismissPrompt }
}
