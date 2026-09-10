import CaptureGalleryModal, { localizeSlides } from './CaptureGalleryModal'
import type { CaptureSlide } from './CaptureGalleryModal'
import { useI18n } from './i18n'

const SLIDES: CaptureSlide[] = [
  {
    file: 'MO_1.png',
    code: 'EBOM-PUB-35',
    name: 'CTO Configuration from eBOM',
    short: 'CTO / eBOM',
    chips: [
      { code: 'Product', label: 'Sản phẩm', example: 'A-PCB-CTRL-01' },
      { code: 'Technology', label: 'Công nghệ', example: 'Publish eBOM → MO' },
      { code: 'Quantity', label: 'Số lượng', example: '45 node · 8 CN' },
      { code: 'Planned Dates', label: 'Mốc kế hoạch', example: 'Bước 2/6 · Configuration' },
    ],
  },
  {
    file: 'MO_2.png',
    code: 'MO-PCB-CTRL-002',
    name: 'Product Structure (mBOM)',
    short: 'Product Structure',
    chips: [
      { code: 'Product', label: 'Sản phẩm', example: 'A-PCB-CTRL-01' },
      { code: 'Technology', label: 'Công nghệ', example: 'mBOM · 7 assemblies' },
      { code: 'Quantity', label: 'Số lượng', example: 'MO quantity 50' },
      { code: 'Planned Dates', label: 'Mốc kế hoạch', example: 'Need 50 · Make / Purchasing' },
    ],
  },
  {
    file: 'MO_3.png',
    code: 'MO-PCB-CTRL-002',
    name: 'Manufacturing Orders',
    short: 'Manufacturing Orders',
    chips: [
      { code: 'Product', label: 'Sản phẩm', example: 'A-PCB-CTRL-01' },
      { code: 'Technology', label: 'Công nghệ', example: 'CFG-TECH-A-PCB-CTRL' },
      { code: 'Quantity', label: 'Số lượng', example: 'Plan 50' },
      { code: 'Planned Dates', label: 'Mốc kế hoạch', example: '08/25/2026 → 09/02/2026' },
    ],
  },
]

export default function ProductionOrderModal({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  return (
    <CaptureGalleryModal
      onClose={onClose}
      eyebrow="NT-MES · Manufacturing Orders"
      title={['MANUFACTURING', 'ORDER']}
      accent="#0ea5e9"
      subtitlePrefix={t.gallery.orderSubtitle}
      slides={localizeSlides(SLIDES, t)}
      statsRight="Product · Technology · Quantity · Planned Dates"
    />
  )
}
