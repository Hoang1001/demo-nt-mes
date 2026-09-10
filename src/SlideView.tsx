import { useEffect, useState } from 'react'
import MESModal from './MESModal'
import { LanguageToggle, useI18n } from './i18n'
import type { Translations } from './i18n/translations'

// ─── STATIC LAYOUT (language-independent) ────────────────────────────────────
const STAGE_META = [
  { x: 36, ext: true },
  { x: 132, ext: false },
  { x: 228, ext: false },
  { x: 324, ext: false },
  { x: 420, ext: false },
  { x: 516, ext: false },
  { x: 612, ext: false },
  { x: 708, ext: true },
]

const CHIPS_ABOVE = [
  { id: 'plm', label: 'PDM', cx: 185, color: '#a78bfa', anchors: [132, 228, 324, 420] },
  { id: 'mrp', label: 'MRP / MRP II', cx: 298, color: '#818cf8', anchors: [132, 228, 324] },
  { id: 'aps', label: 'APS', cx: 404, color: '#6366f1', anchors: [228, 324, 420] },
  { id: 'trace', label: 'Traceability', cx: 510, color: '#f472b6', anchors: [132, 228, 324, 420, 516, 612] },
  { id: 'fico', label: 'FI/CO', cx: 638, color: '#fbbf24', anchors: [132, 324, 612] },
]

const CHIPS_BELOW = [
  { id: 'tms_in', label: 'TMS', cx: 80, color: '#38bdf8', anchors: [36, 132] },
  { id: 'wms_in', label: 'WMS', cx: 155, color: '#2dd4bf', anchors: [132] },
  { id: 'qms', label: 'QMS', cx: 228, color: '#4ade80', anchors: [132, 516] },
  { id: 'mes', label: 'MES', cx: 350, color: '#fb923c', anchors: [228, 324, 420] },
  { id: 'mhs', label: 'MHS', cx: 420, color: '#f97316', anchors: [132, 228, 324, 420, 612] },
  { id: 'wms_out', label: 'WMS', cx: 580, color: '#2dd4bf', anchors: [612] },
  { id: 'tms_out', label: 'TMS', cx: 680, color: '#38bdf8', anchors: [612, 708] },
]

type Chip = { id: string; label: string; cx: number; color: string; anchors: number[] }

const CHIP_FONT = '700 10.5px Inter, sans-serif'
const CHIP_PAD_X = 10

function estimateLabelWidth(label: string): number {
  let w = 0
  for (const ch of label) {
    if (ch === ' ') w += 3.1
    else if (ch === '/') w += 4.2
    else if ('Iijl1'.includes(ch)) w += 3.4
    else if ('ft'.includes(ch)) w += 4.2
    else if (ch === 'r') w += 4.4
    else if ('MW'.includes(ch)) w += 10.2
    else if (/[A-Z]/.test(ch)) w += 7.4
    else w += 6.2
  }
  return w
}

function measureLabelWidth(label: string): number {
  if (typeof document === 'undefined') return estimateLabelWidth(label)
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx) return estimateLabelWidth(label)
  ctx.font = CHIP_FONT
  return ctx.measureText(label).width
}

function buildContent(t: Translations) {
  const modules = [
    { n: 1, label: 'MRP / MRP II', cat: t.cats.plan, color: '#818cf8', desc: t.modules.mrp },
    { n: 2, label: 'APS', cat: t.cats.plan, color: '#6366f1', desc: t.modules.aps },
    { n: 3, label: 'PDM', cat: t.cats.plan, color: '#a78bfa', desc: t.modules.pdm },
    { n: 4, label: 'MES', cat: t.cats.exec, color: '#fb923c', desc: t.modules.mes },
    { n: 5, label: 'MHS', cat: t.cats.mhs, color: '#f97316', desc: t.modules.mhs },
    { n: 6, label: 'WMS', cat: t.cats.wms, color: '#2dd4bf', desc: t.modules.wms },
    { n: 7, label: 'QMS', cat: t.cats.qms, color: '#4ade80', desc: t.modules.qms },
    { n: 8, label: 'TMS', cat: t.cats.logistics, color: '#38bdf8', desc: t.modules.tms },
    { n: 9, label: 'Traceability', cat: t.cats.trace, color: '#f472b6', desc: t.modules.trace },
    { n: 10, label: 'FI/CO', cat: t.cats.fico, color: '#fbbf24', desc: t.modules.fico },
  ]

  const chipInfo: Record<string, { title: string; cat: string; color: string; desc: string }> = {
    plm: { title: 'PDM', cat: t.cats.plan, color: '#a78bfa', desc: modules[2].desc },
    mrp: { title: 'MRP / MRP II', cat: t.cats.plan, color: '#818cf8', desc: modules[0].desc },
    aps: { title: 'APS', cat: t.cats.plan, color: '#6366f1', desc: modules[1].desc },
    trace: { title: 'Traceability', cat: t.cats.trace, color: '#f472b6', desc: modules[8].desc },
    fico: { title: 'FI/CO', cat: t.cats.fico, color: '#fbbf24', desc: modules[9].desc },
    tms_in: { title: t.chipTitles.tms_in, cat: t.cats.logistics, color: '#38bdf8', desc: modules[7].desc },
    wms_in: { title: t.chipTitles.wms_in, cat: t.cats.wms, color: '#2dd4bf', desc: modules[5].desc },
    qms: { title: 'QMS', cat: t.cats.qms, color: '#4ade80', desc: modules[6].desc },
    mes: { title: 'MES', cat: t.cats.execFull, color: '#fb923c', desc: modules[3].desc },
    mhs: { title: 'MHS', cat: t.cats.mhs, color: '#f97316', desc: modules[4].desc },
    wms_out: { title: t.chipTitles.wms_out, cat: t.cats.wms, color: '#2dd4bf', desc: modules[5].desc },
    tms_out: { title: t.chipTitles.tms_out, cat: t.cats.logistics, color: '#38bdf8', desc: modules[7].desc },
  }

  const roles = [
    { sys: 'PDM', role: t.roles.pdm, color: '#a78bfa', chips: ['plm'], cat: t.cats.plan, desc: modules[2].desc },
    { sys: 'MRP / APS', role: t.roles.mrpAps, color: '#818cf8', chips: ['mrp', 'aps'], cat: t.cats.plan, desc: modules[0].desc },
    { sys: 'TMS', role: t.roles.tms, color: '#38bdf8', chips: ['tms_in', 'tms_out'], cat: t.cats.logistics, desc: modules[7].desc },
    { sys: 'WMS', role: t.roles.wms, color: '#2dd4bf', chips: ['wms_in', 'wms_out'], cat: t.cats.wms, desc: modules[5].desc },
    { sys: 'MHS', role: t.roles.mhs, color: '#f97316', chips: ['mhs'], cat: t.cats.mhs, desc: modules[4].desc },
    { sys: 'MES', role: t.roles.mes, color: '#fb923c', chips: ['mes'], cat: t.cats.execFull, desc: modules[3].desc, clickable: true },
    { sys: 'QMS', role: t.roles.qms, color: '#4ade80', chips: ['qms'], cat: t.cats.qms, desc: modules[6].desc },
    { sys: 'FI/CO', role: t.roles.fico, color: '#fbbf24', chips: ['fico'], cat: t.cats.fico, desc: modules[9].desc },
    { sys: 'Traceability', role: t.roles.trace, color: '#f472b6', chips: ['trace'], cat: t.cats.trace, desc: modules[8].desc },
  ]

  return { chipInfo, roles }
}

// ─── FLOW DIAGRAM ─────────────────────────────────────────────────────────────
function FlowDiagram({ activeChips, onHover, onChipClick, stageLabels }: {
  activeChips: string[]
  onHover: (id: string | null) => void
  onChipClick?: (id: string) => void
  stageLabels: string[][]
}) {
  const TY = 148
  const VW = 744
  const VH = 316
  const CH = 26
  const LABEL_Y = 12
  const ABOVE_Y = 34
  const BELOW_Y = TY + 14 + (TY - 14 - ABOVE_Y - CH)
  const CONN_TOP = ABOVE_Y + CH
  const CONN_BOT = BELOW_Y
  const anyActive = activeChips.length > 0
  const [, setFontReady] = useState(false)

  useEffect(() => {
    let live = true
    const mark = () => { if (live) setFontReady(true) }
    if (document.fonts?.status === 'loaded') mark()
    else document.fonts?.ready.then(mark)
    return () => { live = false }
  }, [])

  const chipBox = (c: Chip, topY: number) => {
    const isActive = activeChips.includes(c.id)
    const w = CHIP_PAD_X + measureLabelWidth(c.label) + CHIP_PAD_X
    const x = c.cx - w / 2
    return (
      <g key={c.id} onMouseEnter={() => onHover(c.id)} onMouseLeave={() => onHover(null)} onClick={() => onChipClick?.(c.id)} style={{ cursor: 'pointer' }}>
        {isActive && <rect x={x - 4} y={topY - 4} width={w + 8} height={CH + 8} rx="8" fill={c.color} fillOpacity="0.18" />}
        <rect x={x} y={topY} width={w} height={CH} rx="5" fill="#101c2c"
          stroke={c.color} strokeWidth={isActive ? 1.8 : 1.2}
          strokeOpacity={isActive ? 1 : anyActive ? 0.35 : 0.85} />
        <rect x={x + 1} y={topY + 4} width="3.5" height={CH - 8} rx="2"
          fill={c.color} fillOpacity={isActive ? 1 : anyActive ? 0.35 : 0.95} />
        <text x={x + CHIP_PAD_X} y={topY + 17}
          fill={isActive ? '#f8fafc' : anyActive ? '#64748b' : '#e2e8f0'}
          fontSize="10.5" fontWeight="700" fontFamily="Inter, sans-serif">
          {c.label}
        </text>
      </g>
    )
  }

  const connLines = (c: Chip, above: boolean) => {
    const isActive = activeChips.includes(c.id)
    const y1 = above ? CONN_TOP : CONN_BOT
    const y2 = above ? TY - 14 : TY + 14
    const midY = (y1 + y2) / 2
    const path = (sx: number) => `M ${c.cx},${y1} L ${c.cx},${midY} L ${sx},${midY} L ${sx},${y2}`
    if (anyActive && !isActive) return []
    if (!isActive) {
      const sx = c.anchors[Math.floor(c.anchors.length / 2)]
      return [<path key={`conn-${c.id}-rep`} d={path(sx)} fill="none" stroke={c.color} strokeWidth={1} strokeOpacity={0.35} strokeDasharray="3,4" />]
    }
    return c.anchors.map(sx => (
      <path key={`conn-${c.id}-${sx}`} d={path(sx)} fill="none" stroke={c.color} strokeWidth={1.8} strokeOpacity={0.88} />
    ))
  }

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="tg-slide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0369a1" stopOpacity="0.4" />
          <stop offset="12%" stopColor="#0ea5e9" />
          <stop offset="88%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.4" />
        </linearGradient>
        <filter id="fg-slide" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {Array.from({ length: 20 }).map((_, i) => {
        const x = STAGE_META[0].x + (i + 1) * ((STAGE_META[STAGE_META.length - 1].x - STAGE_META[0].x) / 21)
        return <line key={i} x1={x} y1={TY - 7} x2={x} y2={TY + 7} stroke="#163550" strokeWidth="2.5" strokeLinecap="round" />
      })}

      {[-5, 5].map(dy => (
        <line key={dy} x1={STAGE_META[0].x} y1={TY + dy} x2={STAGE_META[STAGE_META.length - 1].x} y2={TY + dy} stroke="#0c4a6e" strokeWidth="1.2" />
      ))}

      <line x1={STAGE_META[0].x} y1={TY} x2={STAGE_META[STAGE_META.length - 1].x} y2={TY} stroke="#0284c7" strokeWidth="14" strokeOpacity="0.1" />
      <line x1={STAGE_META[0].x} y1={TY} x2={STAGE_META[STAGE_META.length - 1].x} y2={TY} stroke="url(#tg-slide)" strokeWidth="2.5" />
      <line x1={STAGE_META[0].x} y1={TY} x2={STAGE_META[STAGE_META.length - 1].x} y2={TY}
        stroke="#7dd3fc" strokeWidth="1.5" strokeOpacity="0.65"
        strokeDasharray="10,38"
        style={{ animation: 'flowMove 1.6s linear infinite' }} />

      {CHIPS_ABOVE.flatMap(c => connLines(c, true))}
      {CHIPS_BELOW.flatMap(c => connLines(c, false))}

      <text x={VW / 2} y={LABEL_Y}
        textAnchor="middle" fill="#7aadde" fontSize="9"
        fontFamily="JetBrains Mono, monospace" letterSpacing="4" fontWeight="500">
        ← MATERIAL FLOW →
      </text>

      {CHIPS_ABOVE.map(c => chipBox(c, ABOVE_Y))}
      {CHIPS_BELOW.map(c => chipBox(c, BELOW_Y))}

      {STAGE_META.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={TY} r={s.ext ? 9 : 13}
            fill={s.ext ? '#101c2c' : '#0e3a5c'}
            stroke={s.ext ? '#3d6a94' : '#0ea5e9'}
            strokeWidth={s.ext ? 1.2 : 2} />
          {!s.ext && <circle cx={s.x} cy={TY} r={3.5} fill="#38bdf8" filter="url(#fg-slide)" />}
          {(stageLabels[i] ?? []).map((ln, j) => (
            <text key={j} x={s.x} y={TY + 32 + j * 14}
              textAnchor="middle"
              fill={s.ext ? '#7aadde' : '#cbd5e1'}
              fontSize="10" fontWeight={500}
              fontFamily="Inter, sans-serif">
              {ln}
            </text>
          ))}
        </g>
      ))}
    </svg>
  )
}

// ─── SLIDE VIEW ───────────────────────────────────────────────────────────────
type PanelInfo = { title: string; cat: string; color: string; desc: string; hint?: string }

export default function SlideView() {
  const { t } = useI18n()
  const { chipInfo, roles } = buildContent(t)
  const [activeChips, setActiveChips] = useState<string[]>([])
  const [panelInfo, setPanelInfo] = useState<PanelInfo | null>(null)
  const [mesOpen, setMesOpen] = useState(false)

  useEffect(() => {
    setActiveChips([])
    setPanelInfo(null)
  }, [t])

  const hoverChip = (id: string | null) => {
    if (!id) {
      setActiveChips([])
      setPanelInfo(null)
      return
    }
    setActiveChips([id])
    const info = chipInfo[id]
    setPanelInfo(info ? {
      ...info,
      hint: id === 'mes' ? t.slide.openMes : undefined,
    } : null)
  }

  const hoverRole = (r: (typeof roles)[0] | null) => {
    if (!r) {
      setActiveChips([])
      setPanelInfo(null)
      return
    }
    setActiveChips(r.chips)
    setPanelInfo({
      title: r.sys,
      cat: r.cat,
      color: r.color,
      desc: r.desc,
      hint: r.clickable ? t.slide.openMes : undefined,
    })
  }

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#0c1c2e',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      padding: '32px 60px 24px',
      overflow: 'hidden',
    }}>
      {/* ── Header ── */}
      <div style={{
        flexShrink: 0, marginBottom: '20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px',
      }}>
        <div>
          <div style={{
            fontSize: '10px', color: '#7aadde', letterSpacing: '4px',
            fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', marginBottom: '6px',
          }}>
            {t.slide.eyebrow}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '44px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-2px', lineHeight: 1 }}>
              MATERIAL
            </span>
            <span style={{ fontSize: '44px', fontWeight: 800, color: '#0ea5e9', letterSpacing: '-2px', lineHeight: 1 }}>
              FLOW
            </span>
          </div>
          <div style={{ fontSize: '16px', color: '#7aadde', marginTop: '6px', lineHeight: 1.5 }}>
            {t.slide.tagline}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <LanguageToggle />
          <img
            src={`${import.meta.env.BASE_URL}NT_logo.png`}
            alt="Nhat Tinh"
            style={{ height: 82, width: 'auto', objectFit: 'contain' }}
          />
        </div>
      </div>

      <div style={{ height: '1px', background: '#1a3048', flexShrink: 0, marginBottom: '20px' }} />

      {/* ── Main content: roles + diagram ── */}
      <div style={{ display: 'flex', gap: '36px', flex: 1, minHeight: 0, alignItems: 'stretch' }}>

        {/* Roles grid */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '5px', width: '288px', flexShrink: 0 }}>
          {roles.map(r => {
            const isActive = r.chips.some(id => activeChips.includes(id)) && activeChips.every(id => r.chips.includes(id))
            return (
              <div
                key={r.sys}
                className={`role-row${isActive ? ' is-active' : ''}`}
                onMouseEnter={() => hoverRole(r)}
                onMouseLeave={() => hoverRole(null)}
                onClick={() => { if (r.clickable) setMesOpen(true) }}
              >
                <span style={{
                  flexShrink: 0, fontSize: '12px', fontWeight: 700,
                  color: r.color, fontFamily: 'JetBrains Mono, monospace',
                  width: '92px', paddingTop: 1,
                }}>{r.sys}</span>
                <span style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.4 }}>{r.role}</span>
              </div>
            )
          })}
        </div>

        {/* Diagram + description */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            flex: 1, minHeight: 0,
            border: `1px solid ${panelInfo ? panelInfo.color + '55' : '#1e3a5f'}`,
            borderRadius: '10px',
            background: '#111f30',
            overflow: 'hidden',
            transition: 'border-color 0.2s',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ flex: 1, minHeight: 0, padding: '16px 16px 8px', display: 'flex', alignItems: 'center' }}>
              <FlowDiagram
                activeChips={activeChips}
                onHover={hoverChip}
                onChipClick={id => { if (id === 'mes') setMesOpen(true) }}
                stageLabels={t.stages}
              />
            </div>

            {/* Hover description — fixed-height slot */}
            <div style={{
              flexShrink: 0,
              height: '76px',
              borderTop: `1px solid ${panelInfo ? panelInfo.color + '44' : '#1a3048'}`,
              background: panelInfo ? '#0c1c2eee' : '#0e1a28',
              padding: '12px 20px',
              transition: 'background 0.2s, border-color 0.2s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              {panelInfo ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                    <span style={{
                      width: 9, height: 9, borderRadius: '50%',
                      background: panelInfo.color, flexShrink: 0,
                      boxShadow: `0 0 6px ${panelInfo.color}`,
                    }} />
                    <span style={{ color: panelInfo.color, fontSize: 15, fontWeight: 700 }}>
                      {panelInfo.title}
                    </span>
                    <span style={{
                      color: '#7aadde', fontSize: 11,
                      fontFamily: 'JetBrains Mono, monospace',
                      letterSpacing: '0.5px', textTransform: 'uppercase',
                    }}>
                      {panelInfo.cat}
                    </span>
                    {panelInfo.hint && (
                      <span style={{
                        marginLeft: 'auto', color: '#7aadde', fontSize: 11,
                        fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.4px',
                      }}>
                        {panelInfo.hint} →
                      </span>
                    )}
                  </div>
                  <div style={{
                    color: '#cbd5e1', fontSize: 13, lineHeight: 1.5, paddingLeft: 19,
                    overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>
                    {panelInfo.desc}
                  </div>
                </div>
              ) : (
                <div className="hint-text">
                  {t.slide.hoverHint}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {mesOpen && <MESModal onClose={() => setMesOpen(false)} />}
    </div>
  )
}
