import { useEffect, useState } from 'react'
import ShopFloorStructureModal from './ShopFloorStructureModal'
import TechProcessModelModal from './TechProcessModelModal'
import ProductionOrderModal from './ProductionOrderModal'
import PlanOnWorkstationModal from './PlanOnWorkstationModal'
import ProductionExecutionModal from './ProductionExecutionModal'
import QualityTraceabilityModal from './QualityTraceabilityModal'
import ProductionPerformanceModal from './ProductionPerformanceModal'
import FitViewport from './FitViewport'
import { LanguageToggle, useI18n } from './i18n'
import type { Translations } from './i18n/translations'

const VW = 1876
const VH = 348

type FlowNode = {
  id: string
  title: string
  items: string[]
  x: number
  y: number
  w: number
  h: number
  color: string
  shape: 'card' | 'diamond'
  desc: string
}

const TITLE_SIZE = 13.5
const ITEM_SIZE = 13
const ITEM_LH = 17
const TITLE_Y = 24
const ITEM_Y0 = 44
const PAD_B = 14

function cardH(itemCount: number) {
  return ITEM_Y0 + Math.max(itemCount - 1, 0) * ITEM_LH + PAD_B
}

const SW = 268
const MW = 236
const H3 = cardH(3)
const H4 = cardH(4)
const H5 = cardH(5)
const MID = VH / 2
const PAIR_GAP = 40

function stackY(hTop: number, hBot: number) {
  const dist = (hTop + hBot) / 4 + PAIR_GAP / 2
  return {
    top: Math.round(MID - dist - hTop / 2),
    bot: Math.round(MID + dist - hBot / 2),
  }
}

const shopTech = stackY(H4, H5)
const lineWs = stackY(H3, H4)
const qualityResult = stackY(H4, H4)

const NODES_META: Omit<FlowNode, 'desc'>[] = [
  {
    id: 'shop', title: 'SHOP-FLOOR STRUCTURE',
    items: ['Plant', 'Division / Area', 'Line / Cell / Work Center', 'Workstation / Equipment'],
    x: 16, y: shopTech.top, w: SW, h: H4, color: '#2dd4bf', shape: 'card',
  },
  {
    id: 'tech', title: 'TECHNOLOGY / PROCESS MODEL',
    items: ['Product', 'BOM / Material Input-Output', 'Operation Tree', 'Routing / Process Sequence', 'Time Norms / Requirements'],
    x: 16, y: shopTech.bot, w: SW, h: H5, color: '#a78bfa', shape: 'card',
  },
  {
    id: 'bind', title: 'PROCESS ↔ RESOURCE BINDING',
    items: ['Technology Scope', 'Division / Production Line', 'Eligible Workstations'],
    x: 326, y: (VH - H3) / 2, w: MW, h: H3, color: '#818cf8', shape: 'card',
  },
  {
    id: 'order', title: 'MANUFACTURING ORDER',
    items: ['Product', 'Technology', 'Quantity', 'Planned Dates'],
    x: 606, y: (VH - H4) / 2, w: 216, h: H4, color: '#0ea5e9', shape: 'card',
  },
  {
    id: 'plan', title: 'SCHEDULING APPROACH',
    items: [],
    x: 858, y: (VH - 100) / 2, w: 132, h: 100, color: '#fbbf24', shape: 'diamond',
  },
  {
    id: 'line', title: 'SCHEDULE ON PRODUCTION LINE',
    items: ['Manufacturing Order', '→ Production Line', '→ Start / End Time'],
    x: 1024, y: lineWs.top, w: SW, h: H3, color: '#38bdf8', shape: 'card',
  },
  {
    id: 'ws', title: 'SCHEDULE ON WORKSTATION',
    items: ['Operations', '→ Workstations', '→ Employees', '→ Operational Tasks'],
    x: 1024, y: lineWs.bot, w: SW, h: H4, color: '#6366f1', shape: 'card',
  },
  {
    id: 'exec', title: 'PRODUCTION EXECUTION',
    items: ['Production Tracking', 'Start / Stop', 'Good / Scrap', 'Material Consumption'],
    x: 1336, y: (VH - H4) / 2, w: 220, h: H4, color: '#fb923c', shape: 'card',
  },
  {
    id: 'quality', title: 'QUALITY / TRACEABILITY',
    items: ['Inspection', 'LOT / Batch', 'Genealogy', 'Nonconformance'],
    x: 1596, y: qualityResult.top, w: SW, h: H4, color: '#4ade80', shape: 'card',
  },
  {
    id: 'result', title: 'PRODUCTION PERFORMANCE',
    items: ['Quantity', 'Time / Downtime', 'WIP', 'KPI / OEE'],
    x: 1596, y: qualityResult.bot, w: SW, h: H4, color: '#f472b6', shape: 'card',
  },
]

function buildNodes(t: Translations): FlowNode[] {
  return NODES_META.map(n => ({
    ...n,
    desc: t.process.nodes[n.id as keyof typeof t.process.nodes].desc,
  }))
}

const EDGES: { from: string; to: string }[] = [
  { from: 'shop', to: 'bind' },
  { from: 'tech', to: 'bind' },
  { from: 'bind', to: 'order' },
  { from: 'order', to: 'plan' },
  { from: 'plan', to: 'line' },
  { from: 'plan', to: 'ws' },
  { from: 'line', to: 'exec' },
  { from: 'ws', to: 'exec' },
  { from: 'exec', to: 'quality' },
  { from: 'exec', to: 'result' },
]

const NODE_MAP_STATIC = Object.fromEntries(NODES_META.map(n => [n.id, n])) as Record<string, Omit<FlowNode, 'desc'>>

function port(n: { x: number; y: number; w: number; h: number }, side: 'left' | 'right') {
  return {
    x: side === 'left' ? n.x : n.x + n.w,
    y: n.y + n.h / 2,
  }
}

function stepPath(from: { x: number; y: number; w: number; h: number }, to: { x: number; y: number; w: number; h: number }) {
  const a = port(from, 'right')
  const b = port(to, 'left')
  const midX = (a.x + b.x) / 2
  return `M ${a.x} ${a.y} L ${midX} ${a.y} L ${midX} ${b.y} L ${b.x} ${b.y}`
}

function diamondPoints(n: { x: number; y: number; w: number; h: number }) {
  const cx = n.x + n.w / 2
  const cy = n.y + n.h / 2
  return `${cx},${n.y} ${n.x + n.w},${cy} ${cx},${n.y + n.h} ${n.x},${cy}`
}

const DETAIL_PAGES: Record<string, true> = {
  shop: true,
  tech: true,
  order: true,
  ws: true,
  exec: true,
  quality: true,
  result: true,
}

export default function ProcessFlowModal({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  const NODES = buildNodes(t)
  const NODE_MAP = Object.fromEntries(NODES.map(n => [n.id, n])) as Record<string, FlowNode>
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const hover = hoverId ? NODE_MAP[hoverId] : null
  const linked = new Set<string>()
  if (hoverId) {
    linked.add(hoverId)
    for (const e of EDGES) {
      if (e.from === hoverId) linked.add(e.to)
      if (e.to === hoverId) linked.add(e.from)
    }
  }

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape' && !openId) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, openId])

  const openDetail = (id: string) => {
    if (DETAIL_PAGES[id]) setOpenId(id)
  }

  const detailHint = (id: string) => {
    const hint = t.process.nodes[id as keyof typeof t.process.nodes]?.hint
    return hint || undefined
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 210,
      background: '#0c1c2e',
      overflow: 'hidden',
    }}>
      <FitViewport width={1920} height={900} background="#0c1c2e">
        <div style={{
          width: '100%', height: '100%',
          fontFamily: 'Inter, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 40px 20px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}>
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
            NT-MES Platform
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '44px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-2px', lineHeight: 1 }}>
              SETUP
            </span>
            <span style={{ fontSize: '44px', fontWeight: 800, color: '#0ea5e9', letterSpacing: '-2px', lineHeight: 1 }}>
              SEQUENCE
            </span>
          </div>
          <div style={{ fontSize: '16px', color: '#7aadde', marginTop: '6px', lineHeight: 1.5 }}>
            {t.process.subtitle}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <LanguageToggle compact />
          <button onClick={onClose} className="back-btn">{t.common.back}</button>
        </div>
      </div>

      <div style={{ height: '1px', background: '#1a3048', flexShrink: 0, marginBottom: '8px' }} />

      <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: '100%', flex: 1, minHeight: 0, display: 'block' }}>
        <defs>
          <marker id="pf-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#38bdf8" />
          </marker>
        </defs>

        {EDGES.map(e => {
          const from = NODE_MAP_STATIC[e.from]
          const to = NODE_MAP_STATIC[e.to]
          const hot = hoverId !== null && (e.from === hoverId || e.to === hoverId)
          const dim = hoverId !== null && !hot
          return (
            <path key={`${e.from}-${e.to}`} d={stepPath(from, to)}
              fill="none"
              stroke={hot ? (from.id === hoverId ? from.color : to.color) : '#38bdf8'}
              strokeWidth={hot ? 1.8 : 1.2}
              strokeOpacity={dim ? 0.18 : hot ? 0.9 : 0.45}
              markerEnd="url(#pf-arrow)" />
          )
        })}

        {NODES.map(n => {
          const active = hoverId === n.id
          const dimmed = hoverId !== null && !linked.has(n.id)
          if (n.shape === 'diamond') {
            const cx = n.x + n.w / 2
            const cy = n.y + n.h / 2
            return (
              <g key={n.id}
                onMouseEnter={() => setHoverId(n.id)}
                onMouseLeave={() => setHoverId(null)}
                onClick={() => openDetail(n.id)}
                style={{ cursor: DETAIL_PAGES[n.id] ? 'pointer' : 'default' }}>
                {active && (
                  <polygon points={diamondPoints({ ...n, x: n.x - 4, y: n.y - 4, w: n.w + 8, h: n.h + 8 })}
                    fill={n.color} fillOpacity={0.12} />
                )}
                <polygon points={diamondPoints(n)}
                  fill="#0e1a28" stroke={n.color}
                  strokeWidth={active ? 1.8 : 1.2}
                  strokeOpacity={dimmed ? 0.28 : 0.9} />
                <text x={cx} y={cy - 8} textAnchor="middle"
                  fill={active ? n.color : dimmed ? '#64748b' : '#f1f5f9'}
                  fontSize={13} fontWeight={700} fontFamily="Inter, sans-serif">SCHEDULING</text>
                <text x={cx} y={cy + 10} textAnchor="middle"
                  fill={active ? n.color : dimmed ? '#64748b' : '#fbbf24'}
                  fontSize={13} fontWeight={700} fontFamily="Inter, sans-serif">APPROACH</text>
              </g>
            )
          }

          return (
            <g key={n.id}
              onMouseEnter={() => setHoverId(n.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => openDetail(n.id)}
              style={{ cursor: DETAIL_PAGES[n.id] ? 'pointer' : 'default' }}>
              {active && (
                <rect x={n.x - 4} y={n.y - 4} width={n.w + 8} height={n.h + 8}
                  rx={10} fill={n.color} fillOpacity={0.12} />
              )}
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={8}
                fill="#0e1a28" stroke={n.color}
                strokeWidth={active ? 1.6 : 0.9}
                strokeOpacity={dimmed ? 0.28 : 0.85} />
              <rect x={n.x + 1.5} y={n.y + 6} width={3.5} height={n.h - 12} rx={2}
                fill={n.color} fillOpacity={dimmed ? 0.28 : 0.9} />
              <text x={n.x + 14} y={n.y + TITLE_Y}
                fill={dimmed ? '#64748b' : n.color}
                fontSize={TITLE_SIZE} fontWeight={700} fontFamily="Inter, sans-serif">
                {n.title}
              </text>
              {DETAIL_PAGES[n.id] && (
                <text x={n.x + n.w - 10} y={n.y + TITLE_Y}
                  textAnchor="end"
                  fill={dimmed ? '#475569' : n.color}
                  fontSize={12} fontWeight={700} fontFamily="Inter, sans-serif">
                  ↗
                </text>
              )}
              {n.items.map((item, i) => (
                <text key={item} x={n.x + 14} y={n.y + ITEM_Y0 + i * ITEM_LH}
                  fill={dimmed ? '#475569' : '#cbd5e1'}
                  fontSize={ITEM_SIZE} fontFamily="Inter, sans-serif">
                  {item}
                </text>
              ))}
            </g>
          )
        })}
      </svg>

      <div style={{
        flexShrink: 0,
        height: '76px',
        borderTop: `1px solid ${hover ? hover.color + '44' : '#1a3048'}`,
        background: hover ? '#0e1a28ee' : '#0e1a28',
        padding: '12px 20px',
        transition: 'background 0.2s, border-color 0.2s',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        {hover ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
              <span style={{
                width: 9, height: 9, borderRadius: '50%',
                background: hover.color, boxShadow: `0 0 6px ${hover.color}`, flexShrink: 0,
              }} />
              <span style={{ color: hover.color, fontSize: 15, fontWeight: 700 }}>
                {hover.title}
              </span>
              {detailHint(hover.id) && (
                <span style={{
                  marginLeft: 'auto', color: '#7aadde', fontSize: 11,
                  fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.4px',
                }}>
                  {detailHint(hover.id)}
                </span>
              )}
            </div>
            <div style={{
              color: '#cbd5e1', fontSize: 13, lineHeight: 1.5, paddingLeft: 19,
              overflow: 'hidden', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>
              {hover.desc}
            </div>
          </div>
        ) : (
          <div className="hint-text">
            {t.process.hoverHint}
          </div>
        )}
      </div>
        </div>
      </FitViewport>

      {openId === 'shop' && (
        <ShopFloorStructureModal onClose={() => setOpenId(null)} />
      )}
      {openId === 'tech' && (
        <TechProcessModelModal onClose={() => setOpenId(null)} />
      )}
      {openId === 'order' && (
        <ProductionOrderModal onClose={() => setOpenId(null)} />
      )}
      {openId === 'ws' && (
        <PlanOnWorkstationModal onClose={() => setOpenId(null)} />
      )}
      {openId === 'exec' && (
        <ProductionExecutionModal onClose={() => setOpenId(null)} />
      )}
      {openId === 'quality' && (
        <QualityTraceabilityModal onClose={() => setOpenId(null)} />
      )}
      {openId === 'result' && (
        <ProductionPerformanceModal onClose={() => setOpenId(null)} />
      )}
    </div>
  )
}
