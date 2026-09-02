import { animate, motion, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Metric } from '../data/reviewData'
import { LiquidGlass } from './LiquidGlass'

function NumberCounter({ value }: { value: number }) {
  const count = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useMotionValueEvent(count, 'change', (latest) => setDisplay(Math.round(latest)))

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.4, ease: [0.16, 1, 0.3, 1] })
    return controls.stop
  }, [count, value])

  return <>{display}</>
}

export function MetricCard({ metric, index }: { metric: Metric; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + index * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <LiquidGlass className="metric-card glass-hover">
        <div className="metric-index">{String(index + 1).padStart(2, '0')}</div>
        <div className="metric-value">
          {metric.value === null ? metric.placeholder : <NumberCounter value={metric.value} />}
          {metric.suffix}
        </div>
        <div className="metric-label">{metric.label}</div>
      </LiquidGlass>
    </motion.div>
  )
}

type Project = {
  name: string
  problem: string
  solution: string
  technology: readonly string[]
  impact: string
  status: string
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: 26 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.12 + index * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <LiquidGlass className="project-card glass-hover group">
        <div className="flex items-start justify-between">
          <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
          <ArrowUpRight
            aria-hidden="true"
            className="project-arrow size-4 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
        <h3>{project.name}</h3>
        <div className="project-copy">
          <p><span>Problem</span>{project.problem}</p>
          <p><span>Solution</span>{project.solution}</p>
          <p><span>Impact</span>{project.impact}</p>
        </div>
        <div className="mt-auto">
          <div className="mb-4 flex flex-wrap gap-1.5">
            {project.technology.map((technology) => (
              <span className="tech-tag" key={technology}>{technology}</span>
            ))}
          </div>
          <div className="project-status">
            <span className="status-dot" />
            {project.status}
          </div>
        </div>
      </LiquidGlass>
    </motion.article>
  )
}
