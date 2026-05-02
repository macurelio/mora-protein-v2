import { useState, useEffect, useCallback, useRef } from 'react'
import type { UseCarouselOptions, UseCarouselReturn } from '../types'

/**
 * Generic carousel state manager with auto-play and pause support.
 * @param count   Total number of slides/items.
 * @param options Configuration for auto-play behavior.
 */
export function useCarousel(
  count: number,
  { autoPlay = false, interval = 4000 }: UseCarouselOptions = {},
): UseCarouselReturn {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const startTimer = useCallback(() => {
    if (!autoPlay || count <= 1) return
    clearTimer()
    timerRef.current = setInterval(
      () => setCurrent((c) => (c + 1) % count),
      interval,
    )
  }, [autoPlay, count, interval, clearTimer])

  useEffect(() => {
    startTimer()
    return clearTimer
  }, [startTimer, clearTimer])

  const go = useCallback(
    (index: number) => setCurrent(((index % count) + count) % count),
    [count],
  )

  const prev = useCallback(
    () => setCurrent((c) => ((c - 1) + count) % count),
    [count],
  )

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % count),
    [count],
  )

  return { current, go, prev, next, pause: clearTimer, resume: startTimer }
}
