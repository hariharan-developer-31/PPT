import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState, type CSSProperties, type TouchEvent } from 'react'
import { slidesMeta } from '../data/reviewData'
import { slides } from '../sections/slides'
import { CursorGlow, PresentationControls, TopNavigation } from './Chrome'

const transitionStyles = [
  { x: 0, y: 34, scale: 1, filter: 'blur(14px)' },
  { x: 30, y: 0, scale: 1, filter: 'blur(10px)' },
  { x: 0, y: 0, scale: 0.975, filter: 'blur(12px)' },
  { x: -30, y: 0, scale: 1, filter: 'blur(8px)' },
]

const slideAccents = ['#7dd3fc', '#60a5fa', '#7dd3fc', '#60a5fa', '#7dd3fc', '#60a5fa', '#7dd3fc', '#60a5fa']

function slideFromHash() {
  const requested = Number(window.location.hash.slice(1))
  return Number.isInteger(requested) && requested >= 1 && requested <= slides.length ? requested - 1 : 0
}

export function PresentationShell() {
  const initialSlide = slideFromHash()
  const [current, setCurrent] = useState(initialSlide)
  const [direction, setDirection] = useState(1)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const currentRef = useRef(initialSlide)
  const wheelLocked = useRef(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goTo = useCallback((next: number) => {
    const bounded = Math.max(0, Math.min(slides.length - 1, next))
    if (bounded === currentRef.current) return
    setDirection(bounded > currentRef.current ? 1 : -1)
    currentRef.current = bounded
    setCurrent(bounded)
  }, [])

  const previous = useCallback(() => goTo(currentRef.current - 1), [goTo])
  const next = useCallback(() => goTo(currentRef.current + 1), [goTo])

  const togglePresentation = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch {
      // Fullscreen may be blocked by browser policy; the deck remains fully usable.
    }
  }, [])

  const downloadPdf = useCallback(() => setIsPrinting(true), [])

  useEffect(() => {
    if (!isPrinting) return
    const clearPrintMode = () => setIsPrinting(false)
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => window.print()))
    window.addEventListener('afterprint', clearPrintMode)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('afterprint', clearPrintMode)
    }
  }, [isPrinting])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault()
        next()
      } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)) {
        event.preventDefault()
        previous()
      } else if (event.key === 'Home') {
        event.preventDefault()
        goTo(0)
      } else if (event.key === 'End') {
        event.preventDefault()
        goTo(slides.length - 1)
      } else if (event.key.toLowerCase() === 'p') {
        event.preventDefault()
        void togglePresentation()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goTo, next, previous, togglePresentation])

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 18 || wheelLocked.current) return
      const activeSlide = document.querySelector<HTMLElement>('.slide')
      if (activeSlide && activeSlide.scrollHeight > activeSlide.clientHeight + 2) {
        const atTop = activeSlide.scrollTop <= 1
        const atBottom = activeSlide.scrollTop + activeSlide.clientHeight >= activeSlide.scrollHeight - 1
        if ((event.deltaY > 0 && !atBottom) || (event.deltaY < 0 && !atTop)) return
      }
      event.preventDefault()
      wheelLocked.current = true
      if (event.deltaY > 0) next()
      else previous()
      window.setTimeout(() => { wheelLocked.current = false }, 720)
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [next, previous])

  useEffect(() => {
    const revealControls = () => {
      setControlsVisible(true)
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
      inactivityTimer.current = setTimeout(() => setControlsVisible(false), 2400)
    }
    revealControls()
    window.addEventListener('pointermove', revealControls, { passive: true })
    window.addEventListener('keydown', revealControls)
    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
      window.removeEventListener('pointermove', revealControls)
      window.removeEventListener('keydown', revealControls)
    }
  }, [])

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  const onTouchEnd = (event: TouchEvent) => {
    if (touchStart.current === null) return
    const distanceX = touchStart.current.x - event.changedTouches[0].clientX
    const distanceY = touchStart.current.y - event.changedTouches[0].clientY
    if (Math.abs(distanceX) > 60 && Math.abs(distanceX) > Math.abs(distanceY) * 1.2) {
      if (distanceX > 0) next()
      else previous()
    }
    touchStart.current = null
  }

  const CurrentSlide = slides[current]
  const entry = transitionStyles[current % transitionStyles.length]

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="presentation-shell"
        data-slide={current + 1}
        style={{ '--accent': slideAccents[current] } as CSSProperties}
        onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY } }}
        onTouchEnd={onTouchEnd}
      >
        <a className="skip-link" href="#presentation-slide">Skip to current slide</a>
        <div className="ambient-grid" aria-hidden="true" />
        <CursorGlow />
        <TopNavigation current={current} onSelect={goTo} isFullscreen={isFullscreen} onPresent={() => void togglePresentation()} onDownloadPdf={downloadPdf} />

        <main id="presentation-slide" tabIndex={-1}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              className="slide-stage"
              custom={direction}
              initial={{ opacity: 0, x: entry.x * direction, y: entry.y * direction, scale: entry.scale, filter: entry.filter }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -entry.x * direction, y: -entry.y * direction, scale: entry.scale, filter: entry.filter }}
              transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="transition-spark" aria-hidden="true" />
              <CurrentSlide />
            </motion.div>
          </AnimatePresence>
        </main>

        <PresentationControls
          current={current}
          total={slides.length}
          visible={controlsVisible}
          onPrevious={previous}
          onNext={next}
        />
        <div className="slide-progress" aria-hidden="true">
          <motion.div animate={{ scaleX: (current + 1) / slides.length }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} />
        </div>
        <div className="sr-only" aria-live="polite">
          Slide {current + 1} of {slides.length}: {slidesMeta[current]}
        </div>
        {isPrinting && (
          <div className="print-deck" aria-hidden="true">
            {slides.map((Slide, index) => (
              <div className="print-slide" key={index} style={{ '--accent': slideAccents[index] } as CSSProperties}>
                <Slide />
              </div>
            ))}
          </div>
        )}
      </div>
    </MotionConfig>
  )
}
