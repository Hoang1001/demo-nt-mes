import CaptureGalleryModal from './CaptureGalleryModal'
import type { CaptureSlide } from './CaptureGalleryModal'

const SLIDES: CaptureSlide[] = [
  {
    file: 'Planning_1.png',
    code: 'MO-PCB-CTRL-002',
    name: 'MO Schedule · Gantt',
    short: 'Gantt',
    chips: [
      { code: 'Operations', label: 'Công đoạn', example: 'By manufacturing order' },
      { code: 'Workstations', label: 'Trạm', example: 'Gantt timeline' },
      { code: 'Employees', label: 'Nhân sự', example: 'Shift · Aug 2026' },
      { code: 'Operational Tasks', label: 'Tác vụ', example: '12 MO trên trục thời gian' },
    ],
  },
  {
    file: 'Planning_2.png',
    code: 'MO-PCB-CTRL-002',
    name: 'MO Schedule · Month',
    short: 'Month',
    chips: [
      { code: 'Operations', label: 'Công đoạn', example: 'MO-20260804-001' },
      { code: 'Workstations', label: 'Trạm', example: 'Month calendar' },
      { code: 'Employees', label: 'Nhân sự', example: 'August 2026' },
      { code: 'Operational Tasks', label: 'Tác vụ', example: '12 MO trên lịch tháng' },
    ],
  },
  {
    file: 'Planning_3.png',
    code: 'MO-20260804-001',
    name: 'MO Schedule · Work order table',
    short: 'Workstation table',
    chips: [
      { code: 'Operations', label: 'Công đoạn', example: 'Blank loading → Inspect & package' },
      { code: 'Workstations', label: 'Trạm', example: 'WS-01 … WS-07' },
      { code: 'Employees', label: 'Nhân sự', example: 'Day shift' },
      { code: 'Operational Tasks', label: 'Tác vụ', example: 'WO 11 · Plan start / end' },
    ],
  },
]

export default function PlanOnWorkstationModal({ onClose }: { onClose: () => void }) {
  return (
    <CaptureGalleryModal
      onClose={onClose}
      eyebrow="NT-MES · MO Schedule"
      title={['SCHEDULE ON', 'WORKSTATION']}
      accent="#6366f1"
      subtitlePrefix="Lập lịch mức trạm trên NT-MES"
      slides={SLIDES}
      statsRight="Operations · Workstations · Employees · Tasks"
      hint="← → hoặc bấm hình để xem màn hình khác"
    />
  )
}
