import CaptureGalleryModal from './CaptureGalleryModal'
import type { CaptureSlide } from './CaptureGalleryModal'

const SLIDES: CaptureSlide[] = [
  {
    file: 'Trace_1.png',
    code: 'PCBCTRL-RM-HSGT',
    name: 'Trace search · Material Genealogy',
    short: 'Trace search',
    chips: [
      { code: 'Inspection', label: 'Kiểm tra', example: 'Trace search · Both ways' },
      { code: 'LOT / Batch', label: 'Lô / batch', example: 'PCBCTRL-RM-HSGT' },
      { code: 'Genealogy', label: 'Phả hệ', example: '22 nodes · 26 edges' },
      { code: 'Nonconformance', label: 'Sự không phù hợp', example: 'Assemble · Issue · Receive' },
    ],
  },
  {
    file: 'Trace_2.png',
    code: 'PCBCTRL-FG-001',
    name: 'Batches & records',
    short: 'Batches',
    chips: [
      { code: 'Inspection', label: 'Kiểm tra', example: 'Batches & records' },
      { code: 'LOT / Batch', label: 'Lô / batch', example: 'PCBCTRL-FG-001 · Tracked' },
      { code: 'Genealogy', label: 'Phả hệ', example: 'Material Genealogy' },
      { code: 'Nonconformance', label: 'Sự không phù hợp', example: 'Recall & reports' },
    ],
  },
]

export default function QualityTraceabilityModal({ onClose }: { onClose: () => void }) {
  return (
    <CaptureGalleryModal
      onClose={onClose}
      eyebrow="NT-MES · Quality & Traceability"
      title={['QUALITY /', 'TRACEABILITY']}
      accent="#4ade80"
      subtitlePrefix="Chất lượng và truy xuất trên NT-MES"
      slides={SLIDES}
      statsRight="Inspection · LOT / Batch · Genealogy · NCR"
      hint="← → hoặc bấm hình để xem màn hình khác"
    />
  )
}
