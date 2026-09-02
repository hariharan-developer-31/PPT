import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Network } from 'lucide-react'
import { reviewData } from '../data/reviewData'

const ease = [0.16, 1, 0.3, 1] as const

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <motion.p className="slide-kicker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}>
      {children}
    </motion.p>
  )
}

function SlideHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2 className="slide-heading" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, duration: 0.62, ease }}>
      {children}
    </motion.h2>
  )
}

function SlideIntro({ number, label, children }: { number: string; label: string; children: React.ReactNode }) {
  return <div className="slide-intro"><Kicker><span>{number}</span>{label}</Kicker><SlideHeading>{children}</SlideHeading></div>
}

function ReviewHeader({ number, label, title, description }: { number: string; label: string; title: React.ReactNode; description?: string }) {
  return (
    <header className="review-header">
      <SlideIntro number={number} label={label}>{title}</SlideIntro>
      {description && <motion.p initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5, ease }}>{description}</motion.p>}
    </header>
  )
}

function ListSlide({ number, label, title, description, items }: { number: string; label: string; title: React.ReactNode; description?: string; items: readonly string[] }) {
  return (
    <section className="slide" aria-labelledby={`slide-${number}-title`}>
      <ReviewHeader number={number} label={label} title={<span id={`slide-${number}-title`}>{title}</span>} description={description} />
      <div className="statement-grid">
        {items.map((item, index) => (
          <motion.article className="statement-card liquid-glass" key={item} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + index * 0.06, duration: 0.45, ease }}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>{item}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export function HeroSlide() {
  return (
    <section className="slide slide-hero" aria-labelledby="hero-title">
      <div className="hero-visual" aria-hidden="true">
        <motion.img className="hero-art" src="/assets/hero-gateway.png" alt="" initial={{ opacity: 0, scale: 1.16, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.5, ease }} />
      </div>
      <div className="hero-content">
        <h1 id="hero-title" className="hero-title">
          <span><motion.span initial={{ opacity: 0, y: 52 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.82, ease }}>Performance Review</motion.span></span>
          <span className="italic"><motion.span initial={{ opacity: 0, y: 52 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.82, ease }}>{reviewData.person.name}</motion.span></span>
        </h1>
        <motion.div className="hero-meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.72, duration: 0.6 }}><span>{reviewData.person.role}</span></motion.div>
        <motion.p className="hero-disciplines" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.82, duration: 0.55, ease }}>Technology <b>•</b> Product <b>•</b> Innovation <b>•</b> Leadership</motion.p>
      </div>
      <motion.div className="begin-cue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05, duration: 0.7 }}><span>Scroll / press</span><ArrowRight aria-hidden="true" /><span>to begin</span></motion.div>
    </section>
  )
}

export function RoleSlide() {
  return (
    <section className="slide slide-role" aria-labelledby="role-title">
      <div className="slide-grid role-layout">
        <div>
          <SlideIntro number="02" label="My role"><span id="role-title">My role<br /><em>goes beyond code.</em></span></SlideIntro>
          <motion.p className="role-statement" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.55, ease }}>My responsibility is not only to build systems, but to create the technical direction that helps the firm execute <strong>faster, smarter and better.</strong></motion.p>
        </div>
        <motion.div className="role-responsibilities" initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.7, ease }}>
          <div className="role-responsibilities-heading"><span><Network aria-hidden="true" /></span><div><small>Current scope</small><strong>Roles &amp; Responsibilities</strong></div></div>
          <div className="role-responsibility-list">
            {reviewData.roleResponsibilities.map((responsibility, index) => (
              <motion.article className="role-responsibility" key={responsibility} initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 + index * 0.08, duration: 0.48, ease }}><span>{String(index + 1).padStart(2, '0')}</span><p>{responsibility}</p></motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function WorkDoneSlide() {
  return (
    <section className="slide" aria-labelledby="work-title">
      <ReviewHeader number="03" label="Work done" title={<span id="work-title">Work I turned<br /><em>into real products.</em></span>} description="Three digital initiatives taken from concept through design, development, integration, or implementation." />
      <div className="project-story-grid">
        {reviewData.projects.map((project, index) => (
          <motion.article className="project-story-card liquid-glass glass-hover" key={project.name} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.08, duration: 0.5, ease }}>
            <header><span>{String(index + 1).padStart(2, '0')}</span><small>Project</small></header>
            <h3>{project.name}</h3>
            <ul>{project.points.map((point) => <li key={point}><CheckCircle2 aria-hidden="true" /><span>{point}</span></li>)}</ul>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export function FirmValueSlide() {
  return <ListSlide number="04" label="Value to the firm" title={<>What my work<br /><em>brings to the firm.</em></>} items={reviewData.firmValue} />
}

export function BetterSlide() {
  return <ListSlide number="05" label="Where I can be better" title={<>Areas to strengthen,<br /><em>not shortcomings.</em></>} items={reviewData.improvementAreas} />
}

export function ImprovementPlanSlide() {
  return <ListSlide number="06" label="How I plan to improve" title={<>A more structured<br /><em>way of working.</em></>} items={reviewData.improvementPlan} />
}

export function FutureGoalsSlide() {
  return <ListSlide number="07" label="Future goals" title={<>Where I want<br /><em>to go next.</em></>} items={reviewData.futureGoals} />
}

export function ClosingSlide() {
  return (
    <section className="slide closing-review" aria-labelledby="closing-title">
      <motion.blockquote id="closing-title" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.75, ease }}>“{reviewData.closing}”</motion.blockquote>
      <motion.div className="closing-signoff" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65, duration: 0.5 }}><strong>{reviewData.person.name}</strong><span>{reviewData.person.role} · {reviewData.person.year} Performance Review</span></motion.div>
    </section>
  )
}

export const slides = [HeroSlide, RoleSlide, WorkDoneSlide, FirmValueSlide, BetterSlide, ImprovementPlanSlide, FutureGoalsSlide, ClosingSlide] as const
