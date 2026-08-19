import { useState } from 'react'
import type { CSSProperties } from 'react'

// ─── MODULE DATA ──────────────────────────────────────────────────────────────
const MODULES = [
  {
    n: 1, label: 'MRP / MRP II', cat: 'Kế hoạch', color: '#818cf8',
    desc: 'Tính toán nhu cầu nguyên liệu từ kế hoạch sản xuất và BOM, tạo lệnh mua hàng và lệnh sản xuất. Đây là bước điều tiết dòng chảy trước khi vật liệu thực sự di chuyển.',
  },
  {
    n: 2, label: 'APS', cat: 'Kế hoạch', color: '#6366f1',
    desc: 'Lập lịch chi tiết dựa trên năng lực máy và tình trạng nguyên liệu thực tế, điều chỉnh thứ tự và thời điểm dòng vật liệu đi qua từng công đoạn để tối ưu throughput.',
  },
  {
    n: 3, label: 'PDM', cat: 'Kế hoạch', color: '#a78bfa',
    desc: 'Định nghĩa BOM và Routing – bản đồ chỉ ra dòng vật liệu phải đi qua những công đoạn biến đổi nào, theo thứ tự nào, để từ nguyên liệu thô trở thành sản phẩm hoàn chỉnh.',
  },
  {
    n: 4, label: 'MES', cat: 'Thực thi SX', color: '#fb923c',
    desc: 'Quan sát dòng vật liệu bên trong nhà máy theo thời gian thực: vật liệu nào đang ở máy nào, WIP đang ở công đoạn nào, mức tiêu hao thực tế so với định mức.',
  },
  {
    n: 5, label: 'MHS', cat: 'Vận chuyển nội bộ', color: '#f97316',
    desc: 'Điều phối thiết bị vận chuyển nội bộ – băng tải, AGV, xe nâng, sorter – để dịch chuyển vật liệu giữa các điểm dọc dòng chảy. Nhận lệnh từ MES và phản hồi trạng thái theo thời gian thực.',
  },
  {
    n: 6, label: 'WMS & Inventory', cat: 'Kho & Tồn kho', color: '#2dd4bf',
    desc: 'Quản lý các điểm dừng của dòng chảy: vị trí lưu trữ, giao dịch nhận – xuất – chuyển kho, kitting và picking. Đồng thời ghi nhận số lượng và giá trị tồn kho tại mọi điểm trên dòng.',
  },
  {
    n: 7, label: 'QMS', cat: 'Chất lượng', color: '#4ade80',
    desc: 'Đặt trạm kiểm soát tại các điểm trọng yếu trên dòng chảy – nhận hàng, trong công đoạn sản xuất, thành phẩm. Kết quả kiểm tra quyết định vật liệu có được phép tiếp tục hay bị giữ lại.',
  },
  {
    n: 8, label: 'TMS', cat: 'Logistics', color: '#38bdf8',
    desc: 'Quản lý dòng vật liệu ngoài nhà máy – từ nhà cung cấp vào (inbound) và từ kho thành phẩm đến khách hàng (outbound). Tối ưu tuyến đường và phương tiện để đúng lúc, đúng địa điểm.',
  },
  {
    n: 9, label: 'Traceability', cat: 'Truy xuất', color: '#f472b6',
    desc: 'Gắn nhãn định danh (số lô, serial, RFID, barcode) vào từng đơn vị vật liệu để ghi lại toàn bộ hành trình dọc dòng chảy. Khi có sự cố, truy ngược được chính xác điểm nào bị lỗi.',
  },
  {
    n: 10, label: 'FI/CO', cat: 'Tài chính & Kiểm soát', color: '#fbbf24',
    desc: 'Chuyển hóa mỗi chuyển động vật liệu thành giá trị tài chính: tính giá thành theo tiêu hao thực tế (actual costing) hoặc định mức (standard costing). Mọi giao dịch vật liệu đều sinh bút toán kế toán tương ứng.',
  },
]

// ─── FLOW DIAGRAM DATA ────────────────────────────────────────────────────────
// 8 stations, 7 equal intervals of 96px: 36…708
const STAGES = [
  { x: 36,  labels: ['Nhà', 'cung cấp'], ext: true },
  { x: 132, labels: ['Kho', 'NVL'] },
  { x: 228, labels: ['SX', 'Cđ. 1'] },
  { x: 324, labels: ['WIP', 'Cđ. 2'] },
  { x: 420, labels: ['SX', 'Cđ. 3'] },
  { x: 516, labels: ['KCS'] },
  { x: 612, labels: ['Kho', 'Thành phẩm'] },
  { x: 708, labels: ['Khách', 'hàng'], ext: true },
]

// anchors = x-positions of station nodes this chip connects to
const CHIPS_ABOVE = [
  { id: 'plm',   label: 'PDM',    cx: 185, color: '#a78bfa', anchors: [132, 228, 324, 420] },
  { id: 'mrp',   label: 'MRP / MRP II', cx: 298, color: '#818cf8', anchors: [132, 228, 324] },
  { id: 'aps',   label: 'APS',          cx: 404, color: '#6366f1', anchors: [228, 324, 420] },
  { id: 'trace', label: 'Traceability', cx: 510, color: '#f472b6', anchors: [132, 228, 324, 420, 516, 612] },
  { id: 'fico',  label: 'FI/CO',        cx: 638, color: '#fbbf24', anchors: [132, 324, 612] },
]

const CHIPS_BELOW = [
  { id: 'tms_in',  label: 'TMS', cx: 80,  color: '#38bdf8', anchors: [36, 132] },
  { id: 'wms_in',  label: 'WMS', cx: 155, color: '#2dd4bf', anchors: [132] },
  { id: 'qms',     label: 'QMS', cx: 228, color: '#4ade80', anchors: [132, 516] },
  { id: 'mes',     label: 'MES', cx: 350, color: '#fb923c', anchors: [228, 324, 420] },
  { id: 'mhs',     label: 'MHS', cx: 420, color: '#f97316', anchors: [132, 228, 324, 420, 612] },
  { id: 'wms_out', label: 'WMS', cx: 580, color: '#2dd4bf', anchors: [612] },
  { id: 'tms_out', label: 'TMS', cx: 680, color: '#38bdf8', anchors: [612, 708] },
]

// Description lookup keyed by chip id
const CHIP_INFO: Record<string, { title: string; cat: string; color: string; desc: string }> = {
  plm:     { title: 'PDM',              cat: 'Kế hoạch',             color: '#a78bfa', desc: MODULES[2].desc },
  mrp:     { title: 'MRP / MRP II',           cat: 'Kế hoạch',             color: '#818cf8', desc: MODULES[0].desc },
  aps:     { title: 'APS',                    cat: 'Kế hoạch',             color: '#6366f1', desc: MODULES[1].desc },
  trace:   { title: 'Traceability',           cat: 'Truy xuất',            color: '#f472b6', desc: MODULES[8].desc },
  fico:    { title: 'FI/CO',                  cat: 'Tài chính & Kiểm soát',color: '#fbbf24', desc: MODULES[9].desc },
  tms_in:  { title: 'TMS – Inbound',          cat: 'Logistics',            color: '#38bdf8', desc: MODULES[7].desc },
  wms_in:  { title: 'WMS – Kho Nguyên liệu',  cat: 'Kho & Tồn kho',       color: '#2dd4bf', desc: MODULES[5].desc },
  qms:     { title: 'QMS',               cat: 'Chất lượng',           color: '#4ade80', desc: MODULES[6].desc },
  mes:     { title: 'MES',                    cat: 'Thực thi Sản xuất',    color: '#fb923c', desc: MODULES[3].desc },
  mhs:     { title: 'MHS',                    cat: 'Vận chuyển nội bộ',    color: '#f97316', desc: MODULES[4].desc },
  wms_out: { title: 'WMS – Kho Thành phẩm',   cat: 'Kho & Tồn kho',       color: '#2dd4bf', desc: MODULES[5].desc },
  tms_out: { title: 'TMS – Outbound',         cat: 'Logistics',            color: '#38bdf8', desc: MODULES[7].desc },
}

type Chip = { id: string; label: string; cx: number; color: string; anchors: number[] }

// ─── FLOW SVG COMPONENT ───────────────────────────────────────────────────────
function FlowDiagram({ activeChip, onHover }: {
  activeChip: string | null
  onHover: (id: string | null) => void
}) {
  const TY = 148
  const VW = 744
  const VH = 316

  const CH = 26
  const LABEL_Y = 11
  const ABOVE_Y = 34
  const BELOW_Y = TY + 14 + (TY - 14 - ABOVE_Y - CH)
  const CONN_TOP = ABOVE_Y + CH
  const CONN_BOT = BELOW_Y

  const anyActive = activeChip !== null

  const chipBox = (c: Chip, topY: number) => {
    const isActive = activeChip === c.id
    const w = c.label.length * 7.2 + 22
    const x = c.cx - w / 2
    return (
      <g key={c.id}
        onMouseEnter={() => onHover(c.id)}
        onMouseLeave={() => onHover(null)}
        style={{ cursor: 'pointer' }}>
        {isActive && (
          <rect x={x - 4} y={topY - 4} width={w + 8} height={CH + 8} rx="8"
            fill={c.color} fillOpacity="0.18" />
        )}
        <rect x={x} y={topY} width={w} height={CH} rx="5"
          fill="#071020"
          stroke={c.color}
          strokeWidth={isActive ? 1.8 : 1.2}
          strokeOpacity={isActive ? 1 : anyActive ? 0.25 : 0.8} />
        <rect x={x + 1} y={topY + 4} width="3.5" height={CH - 8} rx="2"
          fill={c.color} fillOpacity={isActive ? 1 : anyActive ? 0.25 : 0.95} />
        <text x={x + 10} y={topY + 17}
          fill={isActive ? '#f8fafc' : anyActive ? '#2d3d50' : '#e2e8f0'}
          fontSize="10.5" fontWeight="700" fontFamily="Inter, sans-serif">
          {c.label}
        </text>
      </g>
    )
  }

  const connLines = (c: Chip, above: boolean) => {
    const isActive = activeChip === c.id
    const y1 = above ? CONN_TOP : CONN_BOT      // start at chip edge
    const y2 = above ? TY - 14 : TY + 14        // end at station circle edge
    const midY = (y1 + y2) / 2                  // elbow y — halfway between chip and track

    // Orthogonal step path: chip → down/up to midY → horizontal to station → down/up to track
    const path = (sx: number) =>
      `M ${c.cx},${y1} L ${c.cx},${midY} L ${sx},${midY} L ${sx},${y2}`

    if (anyActive && !isActive) return []

    if (!isActive) {
      const sx = c.anchors[Math.floor(c.anchors.length / 2)]
      return [
        <path key={`conn-${c.id}-rep`} d={path(sx)}
          fill="none" stroke={c.color}
          strokeWidth={1} strokeOpacity={0.3} strokeDasharray="3,4" />
      ]
    }

    return c.anchors.map(sx => (
      <path key={`conn-${c.id}-${sx}`} d={path(sx)}
        fill="none" stroke={c.color}
        strokeWidth={1.8} strokeOpacity={0.88} />
    ))
  }

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="tg2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#0369a1" stopOpacity="0.4" />
          <stop offset="12%"  stopColor="#0ea5e9" />
          <stop offset="88%"  stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.4" />
        </linearGradient>
        <filter id="fg2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Sleepers */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = STAGES[0].x + (i + 1) * ((STAGES[STAGES.length - 1].x - STAGES[0].x) / 21)
        return <line key={i} x1={x} y1={TY - 7} x2={x} y2={TY + 7}
          stroke="#0c2a40" strokeWidth="2.5" strokeLinecap="round" />
      })}

      {/* Rail lines */}
      {[-5, 5].map(dy => (
        <line key={dy}
          x1={STAGES[0].x} y1={TY + dy}
          x2={STAGES[STAGES.length - 1].x} y2={TY + dy}
          stroke="#0c4a6e" strokeWidth="1.2" />
      ))}

      {/* Glow + main track */}
      <line x1={STAGES[0].x} y1={TY} x2={STAGES[STAGES.length - 1].x} y2={TY}
        stroke="#0284c7" strokeWidth="14" strokeOpacity="0.1" />
      <line x1={STAGES[0].x} y1={TY} x2={STAGES[STAGES.length - 1].x} y2={TY}
        stroke="url(#tg2)" strokeWidth="2.5" />
      <line x1={STAGES[0].x} y1={TY} x2={STAGES[STAGES.length - 1].x} y2={TY}
        stroke="#7dd3fc" strokeWidth="1.5" strokeOpacity="0.65"
        strokeDasharray="10,38"
        style={{ animation: 'flowMove 1.6s linear infinite' }} />

      {/* Connector lines — drawn before chips so they sit under */}
      {CHIPS_ABOVE.flatMap(c => connLines(c, true))}
      {CHIPS_BELOW.flatMap(c => connLines(c, false))}

      {/* MATERIAL FLOW label */}
      <text x={VW / 2} y={LABEL_Y}
        textAnchor="middle" fill="#1e5a8a" fontSize="9.5"
        fontFamily="JetBrains Mono, monospace" letterSpacing="5" fontWeight="500">
        ← MATERIAL FLOW →
      </text>

      {/* Chips */}
      {CHIPS_ABOVE.map(c => chipBox(c, ABOVE_Y))}
      {CHIPS_BELOW.map(c => chipBox(c, BELOW_Y))}

      {/* Stations */}
      {STAGES.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={TY} r={s.ext ? 9 : 13}
            fill={s.ext ? '#071020' : '#082f49'}
            stroke={s.ext ? '#1e3a5f' : '#0ea5e9'}
            strokeWidth={s.ext ? 1.2 : 2} />
          {!s.ext && <circle cx={s.x} cy={TY} r={3.5} fill="#38bdf8" filter="url(#fg2)" />}
          {s.labels.map((ln, j) => (
            <text key={j} x={s.x} y={TY + 32 + j * 14}
              textAnchor="middle"
              fill={s.ext ? '#7aadde' : '#94a3b8'}
              fontSize="10" fontWeight={s.ext ? 400 : 500}
              fontFamily="Inter, sans-serif">
              {ln}
            </text>
          ))}
        </g>
      ))}

    </svg>
  )
}

// ─── MODULE CARD ──────────────────────────────────────────────────────────────
function ModCard({ m }: { m: typeof MODULES[0] }) {
  return (
    <div style={{
      border: `1px solid ${m.color}30`,
      borderLeft: `3px solid ${m.color}`,
      borderRadius: '5px',
      padding: '7px 10px 7px 10px',
      background: '#fafbff',
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '5px' }}>
        <span style={{
          flexShrink: 0,
          width: 22, height: 22, borderRadius: '4px',
          background: m.color + '18',
          color: m.color, fontSize: 9, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'JetBrains Mono, monospace',
          marginTop: '1px',
        }}>
          {String(m.n).padStart(2, '0')}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '10.5pt', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
            {m.label}
          </div>
          <div style={{
            fontSize: '7pt', color: m.color, fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.5px', marginTop: '2px', textTransform: 'uppercase',
          }}>
            {m.cat}
          </div>
        </div>
      </div>
      <div style={{ fontSize: '8.5pt', color: '#475569', lineHeight: 1.6, paddingLeft: '30px' }}>
        {m.desc}
      </div>
    </div>
  )
}

// ─── DIVIDER LINE ─────────────────────────────────────────────────────────────
function Rule({ color = '#1e3a5f', opacity = 1 }: { color?: string; opacity?: number }) {
  return <div style={{ height: '1px', background: color, opacity, margin: '0' }} />
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const page: CSSProperties = {
    width: '210mm',
    height: '297mm',
    margin: '0 auto 20px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative',
    WebkitPrintColorAdjust: 'exact',
    // @ts-ignore
    printColorAdjust: 'exact',
  }

  const [activeChip, setActiveChip] = useState<string | null>(null)
  const chipInfo = activeChip ? CHIP_INFO[activeChip] : null

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .screen-wrap { background: white !important; padding: 0 !important; }
          .brochure-page { box-shadow: none !important; margin: 0 !important; }
          .brochure-page:not(:last-of-type) { page-break-after: always; }
          @page { size: A4 portrait; margin: 0; }
        }
        @keyframes flowMove {
          from { stroke-dashoffset: 50; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* Screen wrapper */}
      <div className="screen-wrap" style={{
        background: '#111827',
        minHeight: '100vh',
        padding: '36px 24px',
        fontFamily: 'Inter, sans-serif',
      }}>


        {/* ══════════════════════════════════════════════
            PAGE 1 — COVER (dark)
        ══════════════════════════════════════════════ */}
        <div
          className="brochure-page"
          style={{
            ...page,
            background: '#07101f',
            boxShadow: '0 8px 60px rgba(0,0,0,0.7)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top accent bar */}
          <div style={{
            height: '4px', flexShrink: 0,
            background: 'linear-gradient(90deg, #1d4ed8 0%, #0ea5e9 40%, #2dd4bf 70%, #0ea5e9 100%)',
          }} />

          <div style={{ flex: 1, padding: '12mm 14mm 10mm', display: 'flex', flexDirection: 'column', gap: '7mm' }}>

            {/* ── Header ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{
                  fontSize: '8pt', color: '#1e4976',
                  fontFamily: 'JetBrains Mono, monospace',
                  letterSpacing: '3px', marginBottom: '6px', textTransform: 'uppercase',
                }}>
                  Hệ thống Quản lý Sản xuất Tích hợp
                </div>
                <h1 style={{
                  margin: 0,
                  fontSize: '32pt', fontWeight: 800, lineHeight: 1,
                  color: '#f1f5f9', letterSpacing: '-1px',
                }}>
                  MATERIAL
                </h1>
                <h1 style={{
                  margin: 0,
                  fontSize: '32pt', fontWeight: 800, lineHeight: 1,
                  color: '#0ea5e9', letterSpacing: '-1px',
                }}>
                  FLOW
                </h1>
                <div style={{
                  fontSize: '11pt', color: '#64748b', marginTop: '6px',
                  fontWeight: 400, maxWidth: '120mm',
                }}>
                  Dòng sông vật lý của nhà máy — mọi hệ thống phần mềm đều được xây dựng xung quanh để quan sát, điều tiết và phản ánh nó
                </div>
              </div>
            </div>

            <Rule color="#1e3a5f" />

            {/* ── Concept box ── */}
            <div style={{
              background: '#0a1a30',
              border: '1px solid #1e3a5f',
              borderLeft: '3px solid #0ea5e9',
              borderRadius: '6px',
              padding: '10px 14px',
            }}>
              <div style={{ fontSize: '9pt', color: '#94a3b8', lineHeight: 1.75 }}>
                <span style={{ color: '#38bdf8', fontWeight: 600 }}>Material Flow</span> là{' '}
                <span style={{ color: '#e2e8f0' }}>dòng sông vật lý chính</span> của nhà máy —
                hành trình của vật chất từ nguyên liệu thô, qua các công đoạn biến đổi, đến thành phẩm trao tay khách hàng.
                Các hệ thống phần mềm <span style={{ color: '#e2e8f0' }}>không tự tạo ra dòng chảy</span>.
                Chúng được xây dựng{' '}
                <span style={{ color: '#38bdf8', fontWeight: 600 }}>dọc hai bên dòng sông</span> để
                quan sát, điều tiết, xử lý và báo cáo tình trạng dòng chảy.
                Mỗi hệ thống chỉ đảm nhận <span style={{ color: '#e2e8f0' }}>một đoạn hoặc một loại công việc</span> nhất định.
              </div>
            </div>

            {/* ── River roles grid ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '3px 8px',
            }}>
              {[
                { sys: 'MRP / APS',       role: 'Dự báo và điều tiết dòng chảy',                    color: '#818cf8' },
                { sys: 'WMS / TMS',       role: 'Tổ chức việc vật liệu di chuyển',                            color: '#2dd4bf' },
                { sys: 'MES',             role: 'Quản lý nơi dòng vật liệu được biến đổi',                    color: '#fb923c' },
                { sys: 'QMS',        role: 'Cho dòng chảy tiếp tục hoặc giữ lại',                        color: '#4ade80' },
                { sys: 'Traceability',    role: 'Quan sát toàn bộ hành trình của dòng chảy',                  color: '#f472b6' },
                { sys: 'WMS / FI/CO',       role: 'Ghi nhận lượng và giá trị của dòng vật chất',             color: '#fbbf24' },
                { sys: 'PDM',       role: 'Định nghĩa vật liệu cần đi qua những công đoạn biến đổi nào',    color: '#a78bfa' },
                { sys: 'MHS',             role: 'Vận chuyển vật liệu giữa các điểm dọc dòng chảy',            color: '#f97316' },
              ].map(r => (
                <div key={r.sys} style={{ display: 'flex', alignItems: 'baseline', gap: '6px', padding: '3px 0' }}>
                  <span style={{
                    flexShrink: 0, fontSize: '8pt', fontWeight: 700,
                    color: r.color, fontFamily: 'JetBrains Mono, monospace',
                    minWidth: '82px',
                  }}>{r.sys}</span>
                  <span style={{ fontSize: '8pt', color: '#94a3b8', lineHeight: 1.4 }}>{r.role}</span>
                </div>
              ))}
            </div>

            {/* ── Flow Diagram ── */}
            <div style={{
              border: `1px solid ${chipInfo ? chipInfo.color + '55' : '#1e3a5f'}`,
              borderRadius: '8px',
              background: '#071018',
              position: 'relative',
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}>
              <div style={{ padding: '6mm 4mm 3mm' }}>
                <FlowDiagram activeChip={activeChip} onHover={setActiveChip} />
              </div>

              {/* Description overlay — screen only */}
              <div className="no-print" style={{
                borderTop: `1px solid ${chipInfo ? chipInfo.color + '44' : 'transparent'}`,
                background: chipInfo ? '#040c18ee' : 'transparent',
                padding: chipInfo ? '8px 14px' : '4px 14px',
                minHeight: chipInfo ? 'auto' : 0,
                transition: 'background 0.2s, border-color 0.2s, padding 0.2s',
              }}>
                {chipInfo ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: chipInfo.color, flexShrink: 0,
                        boxShadow: `0 0 6px ${chipInfo.color}`,
                      }} />
                      <span style={{ color: chipInfo.color, fontSize: 12, fontWeight: 700 }}>
                        {chipInfo.title}
                      </span>
                      <span style={{
                        color: '#4e6a8a', fontSize: 10,
                        fontFamily: 'JetBrains Mono, monospace',
                        letterSpacing: '0.5px', textTransform: 'uppercase',
                      }}>
                        {chipInfo.cat}
                      </span>
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: 11, lineHeight: 1.65, paddingLeft: 16 }}>
                      {chipInfo.desc}
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#1e3a5f', fontSize: 9, textAlign: 'right',
                    fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.5px' }}>
                    hover module để xem mô tả →
                  </div>
                )}
              </div>
            </div>

            {/* ── Footer ── */}
            <div style={{ marginTop: 'auto' }}>
              <Rule color="#1e3a5f" />
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: '4mm',
              }}>
                <div />
                <div style={{ fontSize: '8pt', color: '#1e3a5f' }}>01 / 02</div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            PAGE 2 — MODULE DESCRIPTIONS (light)
        ══════════════════════════════════════════════ */}
        <div
          className="brochure-page"
          style={{
            ...page,
            background: '#ffffff',
            boxShadow: '0 8px 60px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top accent bar */}
          <div style={{
            height: '4px', flexShrink: 0,
            background: 'linear-gradient(90deg, #1d4ed8 0%, #0ea5e9 40%, #2dd4bf 70%, #0ea5e9 100%)',
          }} />

          <div style={{ flex: 1, padding: '10mm 14mm 8mm', display: 'flex', flexDirection: 'column' }}>

            {/* ── Section header ── */}
            <div style={{ marginBottom: '6mm' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ margin: 0, fontSize: '16pt', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                  Các Hệ thống Phần mềm Dọc theo Material Flow
                </h2>
                <div style={{
                  height: '2px', flex: 1,
                  background: 'linear-gradient(90deg, #0ea5e9, transparent)',
                }} />
              </div>
            </div>

            {/* ── Module grid 2×5 ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4mm',
              flex: 1,
            }}>
              {MODULES.map(m => <ModCard key={m.n} m={m} />)}
            </div>

            {/* ── Conclusion ── */}
            <div style={{
              marginTop: '5mm',
              background: '#f8faff',
              border: '1px solid #e2e8f0',
              borderLeft: '3px solid #f47272',
              borderRadius: '5px',
              padding: '8px 12px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '12pt', flexShrink: 0, color: '#f47272', lineHeight: 1.2, fontWeight: 800 }}>!</span>
              <div style={{ fontSize: '8.5pt', color: '#475569', lineHeight: 1.6 }}>
                <strong style={{ color: '#0f172a' }}>Nguyên tắc cốt lõi:</strong>{' '}
                Mọi hệ thống trên đều đọc và ghi dữ liệu qua các giao dịch Material Flow —{' '}
                Goods Receipt, Goods Issue, Transfer Posting, Production Confirmation…{' '}
                Dữ liệu <strong style={{ color: '#dc2626' }}>sai hoặc chậm</strong> tại bất kỳ điểm nào trên dòng chảy
                sẽ lan ra toàn bộ hệ thống, bất kể module đó được cấu hình tốt đến đâu.
              </div>
            </div>

            {/* ── Footer ── */}
            <div style={{ marginTop: '4mm' }}>
              <Rule color="#e2e8f0" />
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: '3mm',
              }}>
                <div style={{ fontSize: '7pt', color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '1px' }}>
                  ERP · MES · MHS · WMS · APS · MRP · TMS · PLM · QMS · TRACEABILITY · FI/CO
                </div>
                <div style={{ fontSize: '8pt', color: '#94a3b8' }}>02 / 02</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  )
}
