import { ArrowUpRight, Award, ChevronLeft, ChevronRight, Crown, LoaderCircle, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { reviewData, slidesMeta } from '../data/reviewData'
import { downloadReviewPpt } from '../utils/downloadPpt'

type NavigationProps = {
  current: number
  onSelect: (index: number) => void
  isFullscreen: boolean
  onPresent: () => void
}

export function TopNavigation({ current, onSelect, isFullscreen, onPresent }: NavigationProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeMenu)
    return () => window.removeEventListener('keydown', closeMenu)
  }, [])

  const downloadPpt = async () => {
    if (isExporting) return
    setIsExporting(true)
    try {
      await downloadReviewPpt()
    } catch (error) {
      console.error('PPT export failed', error)
      window.alert('The PPT could not be generated. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const selectSlide = (index: number) => {
    onSelect(index)
    setMenuOpen(false)
  }

  const present = () => {
    setMenuOpen(false)
    onPresent()
  }

  return (
    <>
      <header className="top-navigation font-inter px-6 py-5 sm:px-10 lg:px-16 lg:py-7" aria-label="Presentation navigation">
        <div className="brand-lockup">
          <span className="brand-mark"><img src="/assets/the-atom-logo.png" alt="" /></span>
          <span className="brand-name font-podium text-2xl font-bold uppercase tracking-wider sm:text-3xl">{reviewData.company}</span>
          <span className="brand-divider" />
          <span className="brand-role">{reviewData.person.role}</span>
        </div>

        <nav className="slide-indicators hidden md:flex" aria-label="Slides">
          {slidesMeta.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => onSelect(index)}
              className={index === current ? 'active' : ''}
              aria-current={index === current ? 'step' : undefined}
              aria-label={`Go to slide ${index + 1}: ${label}`}
            >
              {String(index + 1).padStart(2, '0')}
            </button>
          ))}
        </nav>

        <div className="review-lockup hidden md:flex">
          <button type="button" className="download-button" onClick={() => void downloadPpt()} disabled={isExporting} aria-label="Download editable PowerPoint presentation" aria-busy={isExporting}>
            {isExporting ? <LoaderCircle className="spin" aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
            <span>{isExporting ? 'Building PPT' : 'Download PPT'}</span>
          </button>
          <button type="button" className="present-button" onClick={present} aria-label={isFullscreen ? 'Exit presentation mode' : 'Enter presentation mode'}>
            <Crown aria-hidden="true" />
            <span>{isFullscreen ? 'Exit' : 'Present'}</span>
          </button>
        </div>

        <button
          type="button"
          className="menu-button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open slide menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-slide-menu"
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div
        id="mobile-slide-menu"
        className={`mobile-menu ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-menu-header px-6 py-5 sm:px-10">
          <div className="brand-lockup">
            <span className="brand-mark"><img src="/assets/the-atom-logo.png" alt="" /></span>
            <span className="brand-name font-podium text-2xl font-bold uppercase tracking-wider sm:text-3xl">{reviewData.company}</span>
          </div>
          <button type="button" className="mobile-menu-close" onClick={() => setMenuOpen(false)} aria-label="Close slide menu">
            <X aria-hidden="true" />
          </button>
        </div>

        <nav className="mobile-menu-links" aria-label="Review slides">
          {slidesMeta.map((label, index) => (
            <button
              key={label}
              type="button"
              className={index === current ? 'active' : ''}
              onClick={() => selectSlide(index)}
              tabIndex={menuOpen ? 0 : -1}
              style={{
                transitionDelay: menuOpen ? `${index * 45 + 80}ms` : '0ms',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              }}
              aria-current={index === current ? 'step' : undefined}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong className="font-podium">{label}</strong>
              {index === current && <Award aria-hidden="true" />}
            </button>
          ))}
        </nav>

        <div
          className="mobile-menu-actions"
          style={{
            transitionDelay: menuOpen ? `${slidesMeta.length * 45 + 100}ms` : '0ms',
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <button
            type="button"
            className="mobile-download-button"
            onClick={() => {
              setMenuOpen(false)
              void downloadPpt()
            }}
            disabled={isExporting}
            aria-busy={isExporting}
          >
            <span>{isExporting ? 'Building PPT' : 'Download PPT'}</span>
            {isExporting ? <LoaderCircle className="spin" aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
          </button>
          <button type="button" className="mobile-present-button" onClick={present}>
            <Crown aria-hidden="true" />
            <span>{isFullscreen ? 'Exit presentation' : 'Present'}</span>
          </button>
        </div>
      </div>
    </>
  )
}

type ControlsProps = {
  current: number
  total: number
  visible: boolean
  onPrevious: () => void
  onNext: () => void
}

export function PresentationControls({ current, total, visible, onPrevious, onNext }: ControlsProps) {
  return (
    <div className={`presentation-controls liquid-glass ${visible ? 'is-visible' : ''}`} aria-label="Presentation controls">
      <button type="button" onClick={onPrevious} disabled={current === 0} aria-label="Previous slide">
        <ChevronLeft aria-hidden="true" />
      </button>
      <span className="slide-count" aria-live="polite">
        <strong>{String(current + 1).padStart(2, '0')}</strong>
        <i />
        <span>{String(total).padStart(2, '0')}</span>
      </span>
      <button type="button" onClick={onNext} disabled={current === total - 1} aria-label="Next slide">
        <ChevronRight aria-hidden="true" />
      </button>
    </div>
  )
}

export function CursorGlow() {
  const glow = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        glow.current?.style.setProperty('transform', `translate3d(${event.clientX - 260}px, ${event.clientY - 260}px, 0)`)
      })
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
    }
  }, [])

  return <div ref={glow} className="cursor-glow" aria-hidden="true" />
}
