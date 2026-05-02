import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Generic carousel state manager.
 *
 * @param {number} count      Total number of slides/items.
 * @param {object} options
 * @param {boolean} [options.autoPlay=false]  Whether to advance automatically.
 * @param {number}  [options.interval=4000]   Auto-advance interval in ms.
 */
export function useCarousel(count, { autoPlay = false, interval = 4000 } = {}) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)

  const clearTimer = useCallback(() => clearInterval(timerRef.current), [])

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
    (index) => setCurrent(((index % count) + count) % count),
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

  return {
    current,
    go,
    prev,
    next,
    /** Pause auto-play (e.g., on mouse enter). */
    pause: clearTimer,
    /** Resume auto-play (e.g., on mouse leave). */
    resume: startTimer,
  }
}
