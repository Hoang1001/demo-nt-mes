import CaptureGalleryModal from './CaptureGalleryModal'
import type { CaptureSlide } from './CaptureGalleryModal'

const SLIDES: CaptureSlide[] = [
  {
    file: 'Tech_1.png',
    code: 'EBOM-PUB-35',
    name: 'Import eBOM from PDM',
    short: 'eBOM / PDM',
    chips: [
      { code: 'Product', label: 'Sản phẩm', example: 'A-PCB-CTRL-01' },
      { code: 'BOM / Material I-O', label: 'Cấu trúc vật tư', example: '45 node' },
      { code: 'Operation Tree', label: 'Cây công đoạn', example: 'Lắp ráp (A) · 3 bước' },
      { code: 'Routing / Process', label: 'Luồng công nghệ', example: 'Rửa board → Phủ conformal → Sấy phủ' },
    ],
  },
  {
    file: 'Tech_2.png',
    code: 'MO-20260804-002',
    name: 'Production Technology Tree',
    short: 'Technology Tree',
    chips: [
      { code: 'Product', label: 'Sản phẩm', example: 'Packaged finished good' },
      { code: 'BOM / Material I-O', label: 'Cấu trúc vật tư', example: 'Technology Tree' },
      { code: 'Operation Tree', label: 'Cây công đoạn', example: 'OP-01 … OP-07' },
      { code: 'Routing / Process', label: 'Luồng công nghệ', example: 'Blank loading → Inspect & package' },
    ],
  },
]

export default function TechProcessModelModal({ onClose }: { onClose: () => void }) {
  return (
    <CaptureGalleryModal
      onClose={onClose}
      eyebrow="NT-MES · BOM & Technology"
      title={['TECHNOLOGY /', 'PROCESS MODEL']}
      accent="#a78bfa"
      subtitlePrefix="Mô hình công nghệ trên NT-MES"
      slides={SLIDES}
      statsRight="Product · BOM · Operation Tree · Routing"
      hint="← → hoặc bấm hình để xem màn hình khác"
    />
  )
}
