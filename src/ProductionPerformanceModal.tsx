import CaptureGalleryModal, { localizeSlides } from './CaptureGalleryModal'
import type { CaptureSlide } from './CaptureGalleryModal'
import { useI18n } from './i18n'

const SLIDES: CaptureSlide[] = [
  {
    file: 'OEE_1.png',
    code: 'HYB-LINE-A',
    name: 'OEE overview',
    short: 'OEE overview',
    chips: [
      { code: 'Quantity', label: 'Sản lượng', example: 'SMT Line A' },
      { code: 'Time / Downtime', label: 'Thời gian / dừng máy', example: 'Loss 02:19:17' },
      { code: 'WIP', label: 'Bán thành phẩm', example: '12/08 → 19/08' },
      { code: 'KPI / OEE', label: 'KPI / OEE', example: '75.8% · A 88.8 · P 88.0 · Q 97.0' },
    ],
  },
  {
    file: 'OEE_2.png',
    code: 'HYB-LINE-A',
    name: 'OEE trend · loss Pareto',
    short: 'Trend / Pareto',
    chips: [
      { code: 'Quantity', label: 'Sản lượng', example: 'OEE over time' },
      { code: 'Time / Downtime', label: 'Thời gian / dừng máy', example: 'Stencil clog · Feeder jam' },
      { code: 'WIP', label: 'Bán thành phẩm', example: 'Largest OEE loss impact' },
      { code: 'KPI / OEE', label: 'KPI / OEE', example: 'A · P · Q trend' },
    ],
  },
  {
    file: 'OEE_3.png',
    code: 'HYB-LINE-A',
    name: 'Andon',
    short: 'Andon',
    chips: [
      { code: 'Quantity', label: 'Sản lượng', example: 'Good count 128–154' },
      { code: 'Time / Downtime', label: 'Thời gian / dừng máy', example: 'Running 5 · Down 0' },
      { code: 'WIP', label: 'Bán thành phẩm', example: 'Printer → AOI' },
      { code: 'KPI / OEE', label: 'KPI / OEE', example: 'Printer-A 66.6% OEE' },
    ],
  },
  {
    file: 'OEE_4.png',
    code: 'HYB-LINE-A',
    name: 'OEE loss analysis',
    short: 'Losses',
    chips: [
      { code: 'Quantity', label: 'Sản lượng', example: 'PPT 38.3h' },
      { code: 'Time / Downtime', label: 'Thời gian / dừng máy', example: 'Unplanned 3.7h · Planned 1.7h' },
      { code: 'WIP', label: 'Bán thành phẩm', example: 'Six Big Losses' },
      { code: 'KPI / OEE', label: 'KPI / OEE', example: 'A / P / Q loss' },
    ],
  },
  {
    file: 'OEE_5.png',
    code: 'PCB-HYBRID',
    name: 'All production',
    short: 'All production',
    chips: [
      { code: 'Quantity', label: 'Sản lượng', example: 'Good 1,375 / Target 1,980' },
      { code: 'Time / Downtime', label: 'Thời gian / dừng máy', example: 'Down 07:29:24' },
      { code: 'WIP', label: 'Bán thành phẩm', example: '77 machines · 10 running' },
      { code: 'KPI / OEE', label: 'KPI / OEE', example: 'Efficiency 85.7%' },
    ],
  },
]

export default function ProductionPerformanceModal({ onClose }: { onClose: () => void }) {
  const { t, lang } = useI18n()
  const slides = localizeSlides(SLIDES, t).map(s => ({
    ...s,
    chips: s.chips.map(c =>
      c.code === 'Quantity'
        ? { ...c, label: lang === 'vi' ? 'Sản lượng' : 'Quantity' }
        : c
    ),
  }))
  return (
    <CaptureGalleryModal
      onClose={onClose}
      eyebrow="NT-MES · Production Performance"
      title={['PRODUCTION', 'PERFORMANCE']}
      accent="#f472b6"
      subtitlePrefix={t.gallery.resultSubtitle}
      slides={slides}
      statsRight="Quantity · Downtime · WIP · KPI / OEE"
    />
  )
}
