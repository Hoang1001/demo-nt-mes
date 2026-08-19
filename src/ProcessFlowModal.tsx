import { useEffect, useState } from 'react'
import ShopFloorStructureModal from './ShopFloorStructureModal'
import TechProcessModelModal from './TechProcessModelModal'
import ProductionOrderModal from './ProductionOrderModal'
import PlanOnWorkstationModal from './PlanOnWorkstationModal'
import ProductionExecutionModal from './ProductionExecutionModal'
import QualityTraceabilityModal from './QualityTraceabilityModal'
import ProductionPerformanceModal from './ProductionPerformanceModal'

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

const NODES: FlowNode[] = [
  {
    id: 'shop', title: 'SHOP-FLOOR STRUCTURE',
    items: ['Plant', 'Division / Area', 'Line / Cell / Work Center', 'Workstation / Equipment'],
    x: 16, y: shopTech.top, w: SW, h: H4, color: '#2dd4bf', shape: 'card',
    desc: 'Cấu trúc nhà máy theo cấp: Plant → Division / Area → Production Line / Cell / Work Center → Workstation / Equipment. Đây là khung nguồn lực vật lý trên shop-floor.',
  },
  {
    id: 'tech', title: 'TECHNOLOGY / PROCESS MODEL',
    items: ['Product', 'BOM / Material Input-Output', 'Operation Tree', 'Routing / Process Sequence', 'Time Norms / Requirements'],
    x: 16, y: shopTech.bot, w: SW, h: H5, color: '#a78bfa', shape: 'card',
    desc: 'Mô hình công nghệ của sản phẩm: BOM và luồng vật tư vào–ra, cây công đoạn, routing, định mức thời gian và yêu cầu kỹ thuật.',
  },
  {
    id: 'bind', title: 'PROCESS ↔ RESOURCE BINDING',
    items: ['Technology Scope', 'Division / Production Line', 'Eligible Workstations'],
    x: 326, y: (VH - H3) / 2, w: MW, h: H3, color: '#818cf8', shape: 'card',
    desc: 'Gắn quy trình công nghệ với nguồn lực đủ điều kiện: phạm vi technology, division / production line và các workstation được phép thực hiện.',
  },
  {
    id: 'order', title: 'MANUFACTURING ORDER',
    items: ['Product', 'Technology', 'Quantity', 'Planned Dates'],
    x: 606, y: (VH - H4) / 2, w: 216, h: H4, color: '#0ea5e9', shape: 'card',
    desc: 'Lệnh sản xuất mang theo sản phẩm, technology áp dụng, số lượng và mốc thời gian kế hoạch — đầu vào cho bước lập lịch.',
  },
  {
    id: 'plan', title: 'SCHEDULING APPROACH',
    items: [],
    x: 858, y: (VH - 100) / 2, w: 132, h: 100, color: '#fbbf24', shape: 'diamond',
    desc: 'Chọn cách lập lịch: gán lệnh cho dây chuyền (production line) hoặc chi tiết xuống workstation, nhân sự và operational tasks.',
  },
  {
    id: 'line', title: 'SCHEDULE ON PRODUCTION LINE',
    items: ['Manufacturing Order', '→ Production Line', '→ Start / End Time'],
    x: 1024, y: lineWs.top, w: SW, h: H3, color: '#38bdf8', shape: 'card',
    desc: 'Lập lịch mức dây chuyền: gán Manufacturing Order cho Production Line kèm Start / End Time.',
  },
  {
    id: 'ws', title: 'SCHEDULE ON WORKSTATION',
    items: ['Operations', '→ Workstations', '→ Employees', '→ Operational Tasks'],
    x: 1024, y: lineWs.bot, w: SW, h: H4, color: '#6366f1', shape: 'card',
    desc: 'Lập lịch mức trạm: bung operations xuống workstation, gán nhân sự và tạo operational tasks.',
  },
  {
    id: 'exec', title: 'PRODUCTION EXECUTION',
    items: ['Production Tracking', 'Start / Stop', 'Good / Scrap', 'Material Consumption'],
    x: 1336, y: (VH - H4) / 2, w: 220, h: H4, color: '#fb923c', shape: 'card',
    desc: 'Thực thi sản xuất: tracking tiến độ, start/stop, ghi nhận hàng tốt / phế phẩm và tiêu hao vật tư.',
  },
  {
    id: 'quality', title: 'QUALITY / TRACEABILITY',
    items: ['Inspection', 'LOT / Batch', 'Genealogy', 'Nonconformance'],
    x: 1596, y: qualityResult.top, w: SW, h: H4, color: '#4ade80', shape: 'card',
    desc: 'Chất lượng và truy xuất: kiểm tra, LOT / batch, genealogy đầu vào–đầu ra và xử lý nonconformance.',
  },
  {
    id: 'result', title: 'PRODUCTION PERFORMANCE',
    items: ['Quantity', 'Time / Downtime', 'WIP', 'KPI / OEE'],
    x: 1596, y: qualityResult.bot, w: SW, h: H4, color: '#f472b6', shape: 'card',
    desc: 'Hiệu suất sản xuất: sản lượng, thời gian, downtime, WIP và các KPI / OEE phục vụ đánh giá hiệu quả vận hành.',
  },
]

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

const NODE_MAP = Object.fromEntries(NODES.map(n => [n.id, n])) as Record<string, FlowNode>

function port(n: FlowNode, side: 'left' | 'right') {
  return {
    x: side === 'left' ? n.x : n.x + n.w,
    y: n.y + n.h / 2,
  }
}

function stepPath(from: FlowNode, to: FlowNode) {
  const a = port(from, 'right')
  const b = port(to, 'left')
  const midX = (a.x + b.x) / 2
  return `M ${a.x} ${a.y} L ${midX} ${a.y} L ${midX} ${b.y} L ${b.x} ${b.y}`
}

function diamondPoints(n: FlowNode) {
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

const DETAIL_HINTS: Record<string, string> = {
  shop: 'Nhấn để xem cấu hình nhà máy trên NT-MES →',
  tech: 'Nhấn để xem mô hình công nghệ trên NT-MES →',
  order: 'Nhấn để xem lệnh sản xuất trên NT-MES →',
  ws: 'Nhấn để xem lập lịch mức trạm trên NT-MES →',
  exec: 'Nhấn để xem thực thi sản xuất trên NT-MES →',
  quality: 'Nhấn để xem chất lượng và truy xuất trên NT-MES →',
  result: 'Nhấn để xem hiệu suất sản xuất trên NT-MES →',
}

export default function ProcessFlowModal({ onClose }: { onClose: () => void }) {
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

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 210,
      background: '#0c1c2e',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      padding: '32px 60px 24px',
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
            Technology + Shop-floor Structure → Resource Binding → Manufacturing Order → Scheduling → Execution → Quality / Performance
          </div>
        </div>
        <button onClick={onClose} className="back-btn">← Quay lại</button>
      </div>

      <div style={{ height: '1px', background: '#1a3048', flexShrink: 0, marginBottom: '8px' }} />

      <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: '100%', flex: 1, minHeight: 0, display: 'block' }}>
        <defs>
          <marker id="pf-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#38bdf8" />
          </marker>
        </defs>

        {EDGES.map(e => {
          const from = NODE_MAP[e.from]
          const to = NODE_MAP[e.to]
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
              {DETAIL_HINTS[hover.id] && (
                <span style={{
                  marginLeft: 'auto', color: '#7aadde', fontSize: 11,
                  fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.4px',
                }}>
                  {DETAIL_HINTS[hover.id]}
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
            di chuột khối để xem mô tả · nhấn khối có ↗ để xem màn hình NT-MES →
          </div>
        )}
      </div>

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
