import { useEffect, useState } from 'react'
import ProcessFlowModal from './ProcessFlowModal'
import FitViewport from './FitViewport'
import { LanguageToggle, useI18n } from './i18n'
import type { Translations } from './i18n/translations'

const MESA_META = [
  { id: 1 as const, side: 'L', color: '#f43f5e' },
  { id: 2 as const, side: 'L', color: '#f97316' },
  { id: 3 as const, side: 'L', color: '#3b82f6' },
  { id: 4 as const, side: 'L', color: '#eab308' },
  { id: 5 as const, side: 'L', color: '#10b981' },
  { id: 6 as const, side: 'R', color: '#f43f5e' },
  { id: 7 as const, side: 'R', color: '#10b981' },
  { id: 8 as const, side: 'R', color: '#f97316' },
  { id: 9 as const, side: 'R', color: '#eab308' },
  { id: 10 as const, side: 'R', color: '#3b82f6' },
]

function buildMesa(t: Translations) {
  return MESA_META.map(m => ({
    ...m,
    label: t.mes.items[m.id].label,
    desc: t.mes.items[m.id].desc,
  }))
}

// SVG layout constants — widened to 1280 for 1080p projector, inner diagram shifted +110
const VW = 1280, VH = 416
const HX = 640, HY = 208, HR = 66
const CARD_W = 205, CARD_H = 56
const LEFT_X = 222
const RIGHT_X = 853
const LEFT_CONN = LEFT_X + CARD_W      // 427
const RIGHT_CONN = RIGHT_X             // 853
// Side-flow arrows: same length on ERP (left) and Shop Floor (right)
const FLOW_ARROW_LEN = 40
const FLOW_LABEL_GAP = 6
const FLOW_CARD_GAP = 2
const LEFT_ARROW_END = LEFT_X - FLOW_CARD_GAP
const LEFT_ARROW_START = LEFT_ARROW_END - FLOW_ARROW_LEN
const LEFT_LABEL_X = LEFT_ARROW_START - FLOW_LABEL_GAP
const RIGHT_CARD_EDGE = RIGHT_X + CARD_W
const RIGHT_ARROW_END = RIGHT_CARD_EDGE + FLOW_CARD_GAP
const RIGHT_ARROW_START = RIGHT_ARROW_END + FLOW_ARROW_LEN
const RIGHT_LABEL_X = RIGHT_ARROW_START + FLOW_LABEL_GAP
// 5 cards × 56 + 4 gaps × 14 = 336; pad=(416-336)/2=40; cy[0]=40+28=68
const Y_CENTERS = [68, 138, 208, 278, 348]

// Hub rim: HX=640, HY=208, HR=66, LEFT_CONN=427 → dx=-213 (same offset as before)
const LEFT_RIM = [
  { x: 586.3, y: 170.8 },
  { x: 578.1, y: 187.5 },
  { x: 574.0, y: 208.0 },
  { x: 578.1, y: 228.5 },
  { x: 586.3, y: 245.2 },
]
const RIGHT_RIM = [
  { x: 693.7, y: 170.8 },
  { x: 701.9, y: 187.5 },
  { x: 706.0, y: 208.0 },
  { x: 701.9, y: 228.5 },
  { x: 693.7, y: 245.2 },
]

// ERP / Shop Floor flow labels aligned to card rows
const ERP_FLOWS = [
  { label: 'Manufacturing Orders', y: Y_CENTERS[0] },
  { label: 'Resource Status',   y: Y_CENTERS[1] },
  { label: 'Tracking',          y: Y_CENTERS[3] },
  { label: 'Produced Qty',      y: Y_CENTERS[4] },
]
const SF_FLOWS = [
  { label: 'Resource Allocation',  y: Y_CENTERS[0] },
  { label: 'Resource Status',  y: Y_CENTERS[1] },
  { label: 'Process Status',   y: Y_CENTERS[3] },
  { label: 'Events',           y: Y_CENTERS[4] },
]

type MesaItem = ReturnType<typeof buildMesa>[0]

export default function MESModal({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  const MESA = buildMesa(t)
  const [sel, setSel] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [hubHot, setHubHot] = useState(false)
  const [processOpen, setProcessOpen] = useState(false)
  const selected = sel !== null ? MESA.find(f => f.id === sel) ?? null : null
  const preview = selected ?? (hovered !== null ? MESA.find(f => f.id === hovered) ?? null : null)

  const leftItems = MESA.filter(f => f.side === 'L')
  const rightItems = MESA.filter(f => f.side === 'R')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !processOpen) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, processOpen])

  const renderCard = (
    f: MesaItem, x: number, cy: number,
    rim: { x: number; y: number }, connX: number,
  ) => {
    const isSelected = sel === f.id
    const isHot = isSelected || hovered === f.id
    const dimmed = (sel !== null && !isSelected) || (sel === null && hovered !== null && hovered !== f.id)
    const y = cy - CARD_H / 2
    return (
      <g key={f.id}
        onClick={() => setSel(sel === f.id ? null : f.id)}
        onMouseEnter={() => setHovered(f.id)}
        onMouseLeave={() => setHovered(null)}
        style={{ cursor: 'pointer' }}>
        {/* Spoke */}
        <line x1={connX} y1={cy} x2={rim.x} y2={rim.y}
          stroke={f.color} strokeWidth={isHot ? 2 : 1}
          strokeOpacity={isSelected ? 0.9 : isHot ? 0.7 : dimmed ? 0.2 : 0.5} />
        {/* Rim dot */}
        <circle cx={rim.x} cy={rim.y} r={4.5}
          fill={f.color} fillOpacity={isHot ? 1 : dimmed ? 0.2 : 0.7} />
        {/* Glow halo on selected / hover */}
        {isHot && (
          <rect x={x - 4} y={y - 4} width={CARD_W + 8} height={CARD_H + 8}
            rx={10} fill={f.color} fillOpacity={isSelected ? 0.14 : 0.08} />
        )}
        {/* Card */}
        <rect x={x} y={y} width={CARD_W} height={CARD_H} rx={6}
          fill="#0e1a28"
          stroke={f.color}
          strokeWidth={isSelected ? 1.6 : isHot ? 1.3 : 0.8}
          strokeOpacity={isSelected ? 1 : dimmed ? 0.28 : 0.75} />
        {/* Accent bar */}
        <rect x={x + 1.5} y={y + 6} width={3.5} height={CARD_H - 12} rx={2}
          fill={f.color} fillOpacity={isHot ? 1 : dimmed ? 0.28 : 0.85} />
        {/* Label */}
        <text x={x + 14} y={cy} dominantBaseline="middle"
          fill={isSelected ? '#f1f5f9' : dimmed ? '#64748b' : '#e2e8f0'}
          fontSize={13.5} fontWeight={isHot ? 700 : 500}
          fontFamily="Inter, sans-serif">
          {f.label}
        </text>
      </g>
    )
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: '#0c1c2e',
      overflow: 'hidden',
    }}>
      <FitViewport width={1520} height={900} background="#0c1c2e">
        <div style={{
          width: '100%', height: '100%',
          fontFamily: 'Inter, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          padding: '32px 48px 24px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}>
        {/* ── Header ── */}
        <div style={{
          flexShrink: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: '20px',
        }}>
          <div>
            <div style={{
              fontSize: '10px', color: '#7aadde', letterSpacing: '4px',
              fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', marginBottom: '6px',
            }}>
              Manufacturing Execution System
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0' }}>
              <span style={{ fontSize: '44px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-2px', lineHeight: 1 }}>
                NT-
              </span>
              <span style={{ fontSize: '44px', fontWeight: 800, color: '#0ea5e9', letterSpacing: '-2px', lineHeight: 1 }}>
                MES
              </span>
            </div>
            <div style={{ fontSize: '16px', color: '#7aadde', marginTop: '6px', lineHeight: 1.5 }}>
              {t.mes.subtitle}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <LanguageToggle compact />
            <button onClick={onClose} className="back-btn">{t.common.back}</button>
          </div>
        </div>

        <div style={{ height: '1px', background: '#1a3048', flexShrink: 0, marginBottom: '8px' }} />

        {/* ── Diagram ── */}
        <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: '100%', flex: 1, minHeight: 0, display: 'block' }}>
          <defs>
            <radialGradient id="mes-hub-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
            </radialGradient>
            <filter id="mes-hub-core" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <marker id="arrow-flow" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
              <polygon points="0 0, 5 2.5, 0 5" fill="#2d5a9e" />
            </marker>
          </defs>

          {/* Hub glow */}
          <circle cx={HX} cy={HY} r={115} fill="url(#mes-hub-glow)" />

          {/* Decorative outer ring */}
          <circle cx={HX} cy={HY} r={85} fill="none"
            stroke="#0c4a6e" strokeWidth={1} strokeDasharray="4,9" />

          {/* Hub — click to open process model */}
          <g
            onClick={() => setProcessOpen(true)}
            onMouseEnter={() => setHubHot(true)}
            onMouseLeave={() => setHubHot(false)}
            style={{ cursor: 'pointer' }}
          >
            {hubHot && (
              <circle cx={HX} cy={HY} r={HR + 8} fill="#0ea5e9" fillOpacity={0.12} />
            )}
            <circle cx={HX} cy={HY} r={HR} fill="#0e3a5c"
              stroke="#0ea5e9" strokeWidth={hubHot ? 2.4 : 2} />
            <circle cx={HX} cy={HY} r={HR - 9} fill="none"
              stroke="#38bdf8" strokeWidth={1.2} strokeOpacity={hubHot ? 0.85 : 0.55}
              filter="url(#mes-hub-core)" />
            <text x={HX} y={HY - 8} textAnchor="middle"
              fill="#0ea5e9" fontSize={21} fontWeight={800}
              fontFamily="Inter, sans-serif">NT-MES</text>
            <text x={HX} y={HY + 13} textAnchor="middle"
              fill="#7aadde" fontSize={11}
              fontFamily="JetBrains Mono, monospace" letterSpacing={1}>NT PLATFORM</text>
          </g>

          {/* ── ERP bar ── */}
          <rect x={0} y={0} width={34} height={VH} fill="#0f2540" />
          <rect x={32} y={0} width={2.5} height={VH} fill="#2d5a9e" />
          <text x={17} y={VH / 2} textAnchor="middle"
            fill="#7aadde" fontSize={14} fontWeight={700}
            fontFamily="Inter, sans-serif" letterSpacing={3}
            transform={`rotate(-90, 17, ${VH / 2})`}>ERP</text>

          {/* ERP flow labels */}
          {ERP_FLOWS.map(f => (
            <g key={f.label}>
              <text x={LEFT_LABEL_X} y={f.y + 5} textAnchor="end"
                fill="#93c5fd" fontSize={12.5} fontWeight={600} fontFamily="Inter, sans-serif">
                {f.label}
              </text>
              <line x1={LEFT_ARROW_START} y1={f.y} x2={LEFT_ARROW_END} y2={f.y}
                stroke="#2d5a9e" strokeWidth={1.2} markerEnd="url(#arrow-flow)" />
            </g>
          ))}

          {/* ── Shop Floor bar ── */}
          <rect x={VW - 34} y={0} width={34} height={VH} fill="#0f2540" />
          <rect x={VW - 34} y={0} width={2.5} height={VH} fill="#2d5a9e" />
          <text x={VW - 17} y={VH / 2} textAnchor="middle"
            fill="#7aadde" fontSize={14} fontWeight={700}
            fontFamily="Inter, sans-serif" letterSpacing={3}
            transform={`rotate(90, ${VW - 17}, ${VH / 2})`}>SHOP FLOOR</text>

          {/* Shop Floor flow labels */}
          {SF_FLOWS.map(f => (
            <g key={f.label}>
              <line x1={RIGHT_ARROW_START} y1={f.y} x2={RIGHT_ARROW_END} y2={f.y}
                stroke="#2d5a9e" strokeWidth={1.2} markerEnd="url(#arrow-flow)" />
              <text x={RIGHT_LABEL_X} y={f.y + 5}
                fill="#93c5fd" fontSize={12.5} fontWeight={600} fontFamily="Inter, sans-serif">
                {f.label}
              </text>
            </g>
          ))}

          {/* Left cards */}
          {leftItems.map((f, i) =>
            renderCard(f, LEFT_X, Y_CENTERS[i], LEFT_RIM[i], LEFT_CONN)
          )}

          {/* Right cards */}
          {rightItems.map((f, i) =>
            renderCard(f, RIGHT_X, Y_CENTERS[i], RIGHT_RIM[i], RIGHT_CONN)
          )}
        </svg>

        {/* ── Description panel ── */}
        <div style={{
          flexShrink: 0,
          height: '76px',
          borderTop: `1px solid ${preview ? preview.color + '44' : '#1a3048'}`,
          background: preview ? '#0e1a28ee' : '#0e1a28',
          padding: '12px 20px',
          transition: 'background 0.2s, border-color 0.2s',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          {preview ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                <span style={{
                  width: 9, height: 9, borderRadius: '50%',
                  background: preview.color, boxShadow: `0 0 6px ${preview.color}`, flexShrink: 0,
                }} />
                <span style={{ color: preview.color, fontSize: 15, fontWeight: 700 }}>
                  {preview.label}
                </span>
                {selected && (
                  <span style={{
                    marginLeft: 'auto', color: '#7aadde', fontSize: 11,
                    fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.4px',
                  }}>
                    {t.mes.deselect}
                  </span>
                )}
              </div>
              <div style={{
                color: '#cbd5e1', fontSize: 13, lineHeight: 1.5, paddingLeft: 19,
                overflow: 'hidden', display: '-webkit-box',
                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              }}>
                {preview.desc}
              </div>
            </div>
          ) : hubHot ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                <span style={{
                  width: 9, height: 9, borderRadius: '50%',
                  background: '#0ea5e9', boxShadow: '0 0 6px #0ea5e9', flexShrink: 0,
                }} />
                <span style={{ color: '#0ea5e9', fontSize: 15, fontWeight: 700 }}>
                  NT-MES
                </span>
                <span style={{
                  marginLeft: 'auto', color: '#7aadde', fontSize: 11,
                  fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.4px',
                }}>
                  {t.mes.openSetup}
                </span>
              </div>
              <div style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.5, paddingLeft: 19 }}>
                {t.mes.hubDesc}
              </div>
            </div>
          ) : (
            <div className="hint-text">
              {t.mes.hoverHint}
            </div>
          )}
        </div>
        </div>
      </FitViewport>

      {processOpen && <ProcessFlowModal onClose={() => setProcessOpen(false)} />}
    </div>
  )
}
