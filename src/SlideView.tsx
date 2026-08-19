import { useEffect, useState } from 'react'
import MESModal from './MESModal'

// ─── SHARED DATA (mirrored from App.tsx) ─────────────────────────────────────
const MODULES = [
  { n: 1,  label: 'MRP / MRP II',    cat: 'Kế hoạch',              color: '#818cf8', desc: 'Tính toán nhu cầu nguyên liệu từ kế hoạch sản xuất và BOM, tạo lệnh mua hàng và lệnh sản xuất. Đây là bước điều tiết dòng chảy trước khi vật liệu thực sự di chuyển.' },
  { n: 2,  label: 'APS',             cat: 'Kế hoạch',              color: '#6366f1', desc: 'Lập lịch chi tiết dựa trên năng lực máy và tình trạng nguyên liệu thực tế, điều chỉnh thứ tự và thời điểm dòng vật liệu đi qua từng công đoạn để tối ưu throughput.' },
  { n: 3,  label: 'PDM',             cat: 'Kế hoạch',              color: '#a78bfa', desc: 'Định nghĩa BOM và Routing – bản đồ chỉ ra dòng vật liệu phải đi qua những công đoạn biến đổi nào, theo thứ tự nào, để từ nguyên liệu thô trở thành sản phẩm hoàn chỉnh.' },
  { n: 4,  label: 'MES',             cat: 'Thực thi SX',           color: '#fb923c', desc: 'Quan sát dòng vật liệu bên trong nhà máy theo thời gian thực: vật liệu nào đang ở máy nào, WIP đang ở công đoạn nào, mức tiêu hao thực tế so với định mức.' },
  { n: 5,  label: 'MHS',             cat: 'Vận chuyển nội bộ',     color: '#f97316', desc: 'Điều phối thiết bị vận chuyển nội bộ – băng tải, AGV, xe nâng, sorter – để dịch chuyển vật liệu giữa các điểm dọc dòng chảy. Nhận lệnh từ MES và phản hồi trạng thái theo thời gian thực.' },
  { n: 6,  label: 'WMS',             cat: 'Kho & Tồn kho',         color: '#2dd4bf', desc: 'Quản lý các điểm dừng của dòng chảy: vị trí lưu trữ, giao dịch nhận – xuất – chuyển kho, kitting và picking. Đồng thời ghi nhận số lượng và giá trị tồn kho tại mọi điểm trên dòng.' },
  { n: 7,  label: 'QMS',             cat: 'Chất lượng',            color: '#4ade80', desc: 'Đặt trạm kiểm soát tại các điểm trọng yếu trên dòng chảy – nhận hàng, trong công đoạn sản xuất, thành phẩm. Kết quả kiểm tra quyết định vật liệu có được phép tiếp tục hay bị giữ lại.' },
  { n: 8,  label: 'TMS',             cat: 'Logistics',             color: '#38bdf8', desc: 'Quản lý dòng vật liệu ngoài nhà máy – từ nhà cung cấp vào (inbound) và từ kho thành phẩm đến khách hàng (outbound). Tối ưu tuyến đường và phương tiện để đúng lúc, đúng địa điểm.' },
  { n: 9,  label: 'Traceability',    cat: 'Truy xuất',             color: '#f472b6', desc: 'Gắn nhãn định danh (số lô, serial, RFID, barcode) vào từng đơn vị vật liệu để ghi lại toàn bộ hành trình dọc dòng chảy. Khi có sự cố, truy ngược được chính xác điểm nào bị lỗi.' },
  { n: 10, label: 'FI/CO',           cat: 'Tài chính & Kiểm soát', color: '#fbbf24', desc: 'Chuyển hóa mỗi chuyển động vật liệu thành giá trị tài chính: tính giá thành theo tiêu hao thực tế (actual costing) hoặc định mức (standard costing). Mọi giao dịch vật liệu đều sinh bút toán kế toán tương ứng.' },
]

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

const CHIPS_ABOVE = [
  { id: 'plm',   label: 'PDM',           cx: 185, color: '#a78bfa', anchors: [132, 228, 324, 420] },
  { id: 'mrp',   label: 'MRP / MRP II',  cx: 298, color: '#818cf8', anchors: [132, 228, 324] },
  { id: 'aps',   label: 'APS',           cx: 404, color: '#6366f1', anchors: [228, 324, 420] },
  { id: 'trace', label: 'Traceability',  cx: 510, color: '#f472b6', anchors: [132, 228, 324, 420, 516, 612] },
  { id: 'fico',  label: 'FI/CO',         cx: 638, color: '#fbbf24', anchors: [132, 324, 612] },
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

const CHIP_INFO: Record<string, { title: string; cat: string; color: string; desc: string }> = {
  plm:     { title: 'PDM',                    cat: 'Kế hoạch',              color: '#a78bfa', desc: MODULES[2].desc },
  mrp:     { title: 'MRP / MRP II',           cat: 'Kế hoạch',              color: '#818cf8', desc: MODULES[0].desc },
  aps:     { title: 'APS',                    cat: 'Kế hoạch',              color: '#6366f1', desc: MODULES[1].desc },
  trace:   { title: 'Traceability',           cat: 'Truy xuất',             color: '#f472b6', desc: MODULES[8].desc },
  fico:    { title: 'FI/CO',                  cat: 'Tài chính & Kiểm soát', color: '#fbbf24', desc: MODULES[9].desc },
  tms_in:  { title: 'TMS – Inbound',          cat: 'Logistics',             color: '#38bdf8', desc: MODULES[7].desc },
  wms_in:  { title: 'WMS – Kho Nguyên liệu',  cat: 'Kho & Tồn kho',        color: '#2dd4bf', desc: MODULES[5].desc },
  qms:     { title: 'QMS',                    cat: 'Chất lượng',            color: '#4ade80', desc: MODULES[6].desc },
  mes:     { title: 'MES',                    cat: 'Thực thi Sản xuất',     color: '#fb923c', desc: MODULES[3].desc },
  mhs:     { title: 'MHS',                    cat: 'Vận chuyển nội bộ',     color: '#f97316', desc: MODULES[4].desc },
  wms_out: { title: 'WMS – Kho Thành phẩm',   cat: 'Kho & Tồn kho',        color: '#2dd4bf', desc: MODULES[5].desc },
  tms_out: { title: 'TMS – Outbound',         cat: 'Logistics',             color: '#38bdf8', desc: MODULES[7].desc },
}

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

const ROLES = [
  { sys: 'PDM',          role: 'Định nghĩa vật liệu cần đi qua những công đoạn biến đổi nào', color: '#a78bfa', chips: ['plm'], cat: 'Kế hoạch', desc: MODULES[2].desc },
  { sys: 'MRP / APS',    role: 'Dự báo và điều tiết dòng chảy', color: '#818cf8', chips: ['mrp', 'aps'], cat: 'Kế hoạch', desc: MODULES[0].desc },
  { sys: 'TMS',          role: 'Vận chuyển vật liệu ngoài nhà máy (inbound / outbound)', color: '#38bdf8', chips: ['tms_in', 'tms_out'], cat: 'Logistics', desc: MODULES[7].desc },
  { sys: 'WMS',          role: 'Quản lý các điểm lưu trữ dọc dòng chảy', color: '#2dd4bf', chips: ['wms_in', 'wms_out'], cat: 'Kho & Tồn kho', desc: MODULES[5].desc },
  { sys: 'MHS',          role: 'Vận chuyển vật liệu giữa các điểm trong nhà máy', color: '#f97316', chips: ['mhs'], cat: 'Vận chuyển nội bộ', desc: MODULES[4].desc },
  { sys: 'MES',          role: 'Quản lý nơi dòng vật liệu được biến đổi', color: '#fb923c', chips: ['mes'], cat: 'Thực thi Sản xuất', desc: MODULES[3].desc, clickable: true },
  { sys: 'QMS',          role: 'Cho dòng chảy tiếp tục hoặc giữ lại', color: '#4ade80', chips: ['qms'], cat: 'Chất lượng', desc: MODULES[6].desc },
  { sys: 'FI/CO',        role: 'Ghi nhận giá trị tài chính của từng chuyển động vật liệu', color: '#fbbf24', chips: ['fico'], cat: 'Tài chính & Kiểm soát', desc: MODULES[9].desc },
  { sys: 'Traceability', role: 'Quan sát toàn bộ hành trình của dòng chảy', color: '#f472b6', chips: ['trace'], cat: 'Truy xuất', desc: MODULES[8].desc },
]

// ─── FLOW DIAGRAM ─────────────────────────────────────────────────────────────
function FlowDiagram({ activeChips, onHover, onChipClick }: {
  activeChips: string[]
  onHover: (id: string | null) => void
  onChipClick?: (id: string) => void
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
          <stop offset="0%"   stopColor="#0369a1" stopOpacity="0.4" />
          <stop offset="12%"  stopColor="#0ea5e9" />
          <stop offset="88%"  stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.4" />
        </linearGradient>
        <filter id="fg-slide" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {Array.from({ length: 20 }).map((_, i) => {
        const x = STAGES[0].x + (i + 1) * ((STAGES[STAGES.length - 1].x - STAGES[0].x) / 21)
        return <line key={i} x1={x} y1={TY - 7} x2={x} y2={TY + 7} stroke="#163550" strokeWidth="2.5" strokeLinecap="round" />
      })}

      {[-5, 5].map(dy => (
        <line key={dy} x1={STAGES[0].x} y1={TY + dy} x2={STAGES[STAGES.length - 1].x} y2={TY + dy} stroke="#0c4a6e" strokeWidth="1.2" />
      ))}

      <line x1={STAGES[0].x} y1={TY} x2={STAGES[STAGES.length - 1].x} y2={TY} stroke="#0284c7" strokeWidth="14" strokeOpacity="0.1" />
      <line x1={STAGES[0].x} y1={TY} x2={STAGES[STAGES.length - 1].x} y2={TY} stroke="url(#tg-slide)" strokeWidth="2.5" />
      <line x1={STAGES[0].x} y1={TY} x2={STAGES[STAGES.length - 1].x} y2={TY}
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

      {STAGES.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={TY} r={s.ext ? 9 : 13}
            fill={s.ext ? '#101c2c' : '#0e3a5c'}
            stroke={s.ext ? '#3d6a94' : '#0ea5e9'}
            strokeWidth={s.ext ? 1.2 : 2} />
          {!s.ext && <circle cx={s.x} cy={TY} r={3.5} fill="#38bdf8" filter="url(#fg-slide)" />}
          {s.labels.map((ln, j) => (
            <text key={j} x={s.x} y={TY + 32 + j * 14}
              textAnchor="middle"
              fill={s.ext ? '#7aadde' : '#cbd5e1'}
              fontSize="10" fontWeight={s.ext ? 500 : 500}
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
  const [activeChips, setActiveChips] = useState<string[]>([])
  const [panelInfo, setPanelInfo] = useState<PanelInfo | null>(null)
  const [mesOpen, setMesOpen] = useState(false)

  const hoverChip = (id: string | null) => {
    if (!id) {
      setActiveChips([])
      setPanelInfo(null)
      return
    }
    setActiveChips([id])
    const info = CHIP_INFO[id]
    setPanelInfo(info ? {
      ...info,
      hint: id === 'mes' ? 'Nhấn để mở NT-MES' : undefined,
    } : null)
  }

  const hoverRole = (r: typeof ROLES[0] | null) => {
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
      hint: r.clickable ? 'Nhấn để mở NT-MES' : undefined,
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
            Hệ thống Quản lý Sản xuất Tích hợp
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
            Dòng sông vật lý của nhà máy — mọi hệ thống phần mềm đều được xây dựng xung quanh để quan sát, điều tiết và phản ánh nó
          </div>
        </div>
        <img
          src={`${import.meta.env.BASE_URL}NT_logo.png`}
          alt="Nhat Tinh"
          style={{ height: 82, width: 'auto', flexShrink: 0, objectFit: 'contain' }}
        />
      </div>

      <div style={{ height: '1px', background: '#1a3048', flexShrink: 0, marginBottom: '20px' }} />

      {/* ── Main content: roles + diagram ── */}
      <div style={{ display: 'flex', gap: '36px', flex: 1, minHeight: 0, alignItems: 'stretch' }}>

        {/* Roles grid */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '5px', width: '288px', flexShrink: 0 }}>
          {ROLES.map(r => {
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
                  di chuột module hoặc danh sách bên trái để xem mô tả →
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
