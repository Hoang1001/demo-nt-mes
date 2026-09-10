import CaptureGalleryModal, { localizeSlides } from './CaptureGalleryModal'
import type { CaptureSlide } from './CaptureGalleryModal'
import { useI18n } from './i18n'

const SLIDES: CaptureSlide[] = [
  {
    file: 'Tracking_1.png',
    code: 'MO-20260804-001',
    name: 'MO Progress Summary',
    short: 'Progress Summary',
    chips: [
      { code: 'Production Tracking', label: 'Theo dõi lệnh', example: '13 orders · 2 ready to finish' },
      { code: 'Start / Stop', label: 'Bắt đầu / kết thúc', example: 'In progress · Finish MO' },
      { code: 'Good / Scrap', label: 'Hàng tốt / phế', example: 'Qty complete 0/7 WO' },
      { code: 'Material Consumption', label: 'Tiêu hao vật tư', example: 'WOs qty OK 18/88' },
    ],
  },
  {
    file: 'Tracking_2.png',
    code: 'MO-20260804-001',
    name: 'Work order tracking',
    short: 'Work orders',
    chips: [
      { code: 'Production Tracking', label: 'Theo dõi lệnh', example: '7 WO · Packaged finished PCB' },
      { code: 'Start / Stop', label: 'Bắt đầu / kết thúc', example: 'In progress · Open' },
      { code: 'Good / Scrap', label: 'Hàng tốt / phế', example: 'Plan 100 · Done 3' },
      { code: 'Material Consumption', label: 'Tiêu hao vật tư', example: 'Output Plan / Done' },
    ],
  },
  {
    file: 'Tracking_3.png',
    code: 'MO-20260804-001',
    name: 'Shop Floor Alerts · Cards',
    short: 'Alerts · Cards',
    chips: [
      { code: 'Production Tracking', label: 'Theo dõi lệnh', example: 'Shop Floor Alerts' },
      { code: 'Start / Stop', label: 'Bắt đầu / kết thúc', example: 'Overdue · Not started' },
      { code: 'Good / Scrap', label: 'Hàng tốt / phế', example: 'Logged 3 / plan 100 pc' },
      { code: 'Material Consumption', label: 'Tiêu hao vật tư', example: 'No qty reported' },
    ],
  },
  {
    file: 'Tracking_4.png',
    code: 'MO-20260804-001',
    name: 'Shop Floor Alerts · Table',
    short: 'Alerts · Table',
    chips: [
      { code: 'Production Tracking', label: 'Theo dõi lệnh', example: '14 tasks · 7 overdue' },
      { code: 'Start / Stop', label: 'Bắt đầu / kết thúc', example: 'In progress · Pending' },
      { code: 'Good / Scrap', label: 'Hàng tốt / phế', example: 'Done 3 / Plan 100 pc' },
      { code: 'Material Consumption', label: 'Tiêu hao vật tư', example: 'No qty reported' },
    ],
  },
  {
    file: 'Tracking_5.png',
    code: 'MO-20260804-001',
    name: 'Station Recording',
    short: 'Station Recording',
    chips: [
      { code: 'Production Tracking', label: 'Theo dõi lệnh', example: 'WS-01 · Blank loading' },
      { code: 'Start / Stop', label: 'Bắt đầu / kết thúc', example: '19/08 14:10 → 15:10' },
      { code: 'Good / Scrap', label: 'Hàng tốt / phế', example: 'Good 0 · Waste 0 pc' },
      { code: 'Material Consumption', label: 'Tiêu hao vật tư', example: 'CU-RAW · 3 / 100 pc' },
    ],
  },
]

export default function ProductionExecutionModal({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  return (
    <CaptureGalleryModal
      onClose={onClose}
      eyebrow="NT-MES · Production Tracking"
      title={['PRODUCTION', 'EXECUTION']}
      accent="#fb923c"
      subtitlePrefix={t.gallery.execSubtitle}
      slides={localizeSlides(SLIDES, t)}
      statsRight="Tracking · Start/Stop · Good/Scrap · Consumption"
    />
  )
}
