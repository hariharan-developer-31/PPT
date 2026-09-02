import { reviewData, slidesMeta } from '../data/reviewData'

const COLORS = {
  bg: '030712',
  panel: '0A1730',
  blue: '2563EB',
  cyan: '7DD3FC',
  white: 'F8FAFC',
  muted: '94A3B8',
  dim: '475569',
}

async function assetData(url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Unable to load presentation asset: ${url}`)
  const blob = await response.blob()
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

export async function downloadReviewPpt() {
  const [{ default: PptxGenJS }, logo] = await Promise.all([
    import('pptxgenjs'),
    assetData('/assets/the-atom-logo.png'),
  ])

  const pptx = new PptxGenJS()
  type Slide = ReturnType<typeof pptx.addSlide>
  const total = slidesMeta.length

  pptx.layout = 'LAYOUT_WIDE'
  pptx.author = reviewData.person.name
  pptx.company = reviewData.company
  pptx.subject = `${reviewData.person.year} Tech Lead Performance Review`
  pptx.title = `${reviewData.person.name} — ${reviewData.person.year} Performance Review`
  pptx.theme = { headFontFace: 'Aptos Display', bodyFontFace: 'Aptos' }

  const addBase = (slide: Slide, number: number, label: string) => {
    slide.background = { color: COLORS.bg }
    slide.addShape(pptx.ShapeType.line, { x: 0.45, y: 0.52, w: 12.43, h: 0, line: { color: '1E3A5F', transparency: 35, width: 1 } })
    slide.addImage({ data: logo, x: 0.48, y: 0.12, w: 0.38, h: 0.38 })
    slide.addText(reviewData.company.toUpperCase(), { x: 0.92, y: 0.21, w: 1.5, h: 0.15, fontSize: 7, bold: true, color: COLORS.white, charSpacing: 1.2, margin: 0 })
    slide.addText(`${String(number).padStart(2, '0')}  /  ${String(total).padStart(2, '0')}`, { x: 11.7, y: 0.21, w: 1.1, h: 0.16, fontSize: 7, bold: true, color: COLORS.cyan, align: 'right', margin: 0 })
    slide.addText(label.toUpperCase(), { x: 0.5, y: 7.12, w: 4.5, h: 0.13, fontSize: 6.5, bold: true, color: COLORS.dim, charSpacing: 1.4, margin: 0 })
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 7.46, w: 13.33 * (number / total), h: 0.04, line: { transparency: 100 }, fill: { color: COLORS.blue } })
  }

  const addHeading = (slide: Slide, number: number, label: string, heading: string, description?: string) => {
    addBase(slide, number, label)
    slide.addText(label.toUpperCase(), { x: 0.62, y: 0.82, w: 4.8, h: 0.22, fontSize: 8, bold: true, color: COLORS.cyan, charSpacing: 1.4, margin: 0 })
    slide.addText(heading, { x: 0.58, y: 1.15, w: 8.2, h: 1.05, fontFace: 'Georgia', fontSize: 31, color: COLORS.white, margin: 0, fit: 'shrink' })
    if (description) slide.addText(description, { x: 9.35, y: 1.25, w: 3.25, h: 0.7, fontSize: 9, color: COLORS.muted, margin: 0.02, valign: 'middle', fit: 'shrink' })
  }

  const addCard = (slide: Slide, x: number, y: number, w: number, h: number) => {
    slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.06, line: { color: COLORS.cyan, transparency: 65, width: 1 }, fill: { color: COLORS.panel, transparency: 6 } })
    slide.addShape(pptx.ShapeType.rect, { x, y, w: 0.035, h, line: { transparency: 100 }, fill: { color: COLORS.cyan } })
  }

  const addListSlide = (number: number, label: string, heading: string, items: readonly string[]) => {
    const slide = pptx.addSlide()
    addHeading(slide, number, label, heading)
    items.forEach((item, index) => {
      const col = index % 2
      const row = Math.floor(index / 2)
      const x = 0.62 + col * 6.1
      const y = 2.5 + row * 1.08
      addCard(slide, x, y, 5.72, 0.82)
      slide.addText(String(index + 1).padStart(2, '0'), { x: x + 0.23, y: y + 0.31, w: 0.35, h: 0.13, fontSize: 7, bold: true, color: COLORS.cyan, margin: 0 })
      slide.addText(item, { x: x + 0.75, y: y + 0.16, w: 4.65, h: 0.45, fontSize: 10, color: COLORS.white, margin: 0.02, valign: 'middle', fit: 'shrink' })
    })
  }

  // 01 — Performance Review
  {
    const slide = pptx.addSlide()
    slide.background = { color: COLORS.bg }
    slide.addShape(pptx.ShapeType.ellipse, { x: 3.8, y: 0.6, w: 5.7, h: 5.7, line: { color: COLORS.cyan, transparency: 78, width: 1 }, fill: { color: COLORS.blue, transparency: 86 } })
    slide.addImage({ data: logo, x: 6.23, y: 0.95, w: 0.85, h: 0.85 })
    slide.addText('Performance Review', { x: 1.2, y: 2.12, w: 10.93, h: 0.85, align: 'center', fontFace: 'Georgia', fontSize: 37, color: COLORS.white, margin: 0, fit: 'shrink' })
    slide.addText(reviewData.person.name, { x: 1.2, y: 3.02, w: 10.93, h: 0.95, align: 'center', fontFace: 'Georgia', italic: true, fontSize: 42, color: COLORS.cyan, margin: 0, fit: 'shrink' })
    slide.addText(reviewData.person.role.toUpperCase(), { x: 3.1, y: 4.3, w: 7.13, h: 0.3, align: 'center', fontSize: 10, bold: true, color: COLORS.white, margin: 0 })
    slide.addText('TECHNOLOGY  •  PRODUCT  •  INNOVATION  •  LEADERSHIP', { x: 2.45, y: 4.86, w: 8.43, h: 0.22, align: 'center', fontSize: 7, color: COLORS.muted, charSpacing: 0.8, margin: 0 })
  }

  // 02 — My Role (preserved roles and responsibilities)
  {
    const slide = pptx.addSlide()
    addHeading(slide, 2, 'My Role', 'My role goes beyond code.', 'Technical direction that helps the firm execute faster, smarter and better.')
    slide.addText('ROLES & RESPONSIBILITIES', { x: 0.65, y: 2.38, w: 4, h: 0.22, fontSize: 8, bold: true, color: COLORS.cyan, charSpacing: 1.4, margin: 0 })
    reviewData.roleResponsibilities.forEach((item, index) => {
      const y = 2.78 + index * 0.75
      addCard(slide, 0.62, y, 12.05, 0.56)
      slide.addText(String(index + 1).padStart(2, '0'), { x: 0.86, y: y + 0.2, w: 0.35, h: 0.12, fontSize: 7, bold: true, color: COLORS.cyan, margin: 0 })
      slide.addText(item, { x: 1.42, y: y + 0.11, w: 10.85, h: 0.3, fontSize: 10, color: COLORS.white, margin: 0.02, valign: 'middle', fit: 'shrink' })
    })
  }

  // 03 — Work Done
  {
    const slide = pptx.addSlide()
    addHeading(slide, 3, 'Work Done', 'Work I turned into real products.')
    reviewData.projects.forEach((project, index) => {
      const x = 0.62 + index * 4.12
      addCard(slide, x, 2.5, 3.82, 3.85)
      slide.addText(`${String(index + 1).padStart(2, '0')}  /  PROJECT`, { x: x + 0.22, y: 2.8, w: 1.3, h: 0.16, fontSize: 7, bold: true, color: COLORS.cyan, margin: 0 })
      slide.addText(project.name, { x: x + 0.22, y: 3.32, w: 3.35, h: 0.78, fontFace: 'Aptos Display', fontSize: 19, bold: true, color: COLORS.white, margin: 0, fit: 'shrink' })
      project.points.forEach((point, pointIndex) => {
        slide.addText(`✓  ${point}`, { x: x + 0.22, y: 4.43 + pointIndex * 0.48, w: 3.3, h: 0.31, fontSize: 9, color: pointIndex === 0 ? COLORS.white : COLORS.muted, margin: 0.02, fit: 'shrink' })
      })
    })
  }

  addListSlide(4, 'What My Work Brings to the Firm', 'Technology into business leverage.', reviewData.firmValue)
  addListSlide(5, 'Where I Can Be Better', 'Areas to strengthen, not shortcomings.', reviewData.improvementAreas)
  addListSlide(6, 'How I Plan to Improve', 'A more structured way of working.', reviewData.improvementPlan)
  addListSlide(7, 'Future Goals', 'Where I want to go next.', reviewData.futureGoals)

  // 08 — Closing
  {
    const slide = pptx.addSlide()
    slide.background = { color: COLORS.bg }
    slide.addShape(pptx.ShapeType.ellipse, { x: 3.45, y: 0.6, w: 6.4, h: 6.4, line: { color: COLORS.cyan, transparency: 80, width: 1 }, fill: { color: COLORS.blue, transparency: 89 } })
    slide.addText(`“${reviewData.closing}”`, { x: 1.45, y: 2.2, w: 10.43, h: 2.3, align: 'center', valign: 'middle', fontFace: 'Georgia', fontSize: 29, color: COLORS.white, margin: 0, fit: 'shrink' })
    slide.addText(`${reviewData.person.name.toUpperCase()}  •  ${reviewData.person.role.toUpperCase()}`, { x: 4.15, y: 5.25, w: 5.03, h: 0.22, align: 'center', fontSize: 8, bold: true, color: COLORS.muted, charSpacing: 1, margin: 0 })
  }

  await pptx.writeFile({ fileName: `${reviewData.person.name.replace(/\s+/g, '-')}-Tech-Lead-Review-${reviewData.person.year}.pptx` })
}
