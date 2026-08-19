import CaptureGalleryModal from './CaptureGalleryModal'
import type { CaptureSlide } from './CaptureGalleryModal'

const SLIDES: CaptureSlide[] = [
  {
    file: 'ShopFloor.png',
    code: 'PCB-HYBRID',
    name: 'PCB Hybrid Manufacturing Factory',
    short: 'Hybrid',
    chips: [
      { code: 'Plant', label: 'Nhà máy', example: 'PCB-HYBRID' },
      { code: 'Division / Area', label: 'Xưởng / khu vực', example: 'HYB-DIV-SMT' },
      { code: 'Line / Cell / Work Center', label: 'Dây chuyền', example: 'HYB-LINE-A' },
      { code: 'Workstation / Equipment', label: 'Trạm / thiết bị', example: 'HYB-PRINTER-A' },
    ],
  },
  {
    file: 'ShopFloor_1.png',
    code: 'PCB-JOBSHOP',
    name: 'PCB Job Shop Factory',
    short: 'Job Shop',
    chips: [
      { code: 'Plant', label: 'Nhà máy', example: 'PCB-JOBSHOP' },
      { code: 'Division / Area', label: 'Xưởng / khu vực', example: 'JOB-DIV-DRILL' },
      { code: 'Line / Cell / Work Center', label: 'Dây chuyền', example: 'JOB-WC-DRILL' },
      { code: 'Workstation / Equipment', label: 'Trạm / thiết bị', example: 'JOB-CNC-DRILL-01' },
    ],
  },
  {
    file: 'ShopFloor_2.png',
    code: 'PCB-BATCH',
    name: 'PCB Batch Processing Factory',
    short: 'Batch',
    chips: [
      { code: 'Plant', label: 'Nhà máy', example: 'PCB-BATCH' },
      { code: 'Division / Area', label: 'Xưởng / khu vực', example: 'BAT-DIV-PLATE' },
      { code: 'Line / Cell / Work Center', label: 'Dây chuyền', example: 'BAT-BG-CUPLATE' },
      { code: 'Workstation / Equipment', label: 'Trạm / thiết bị', example: 'BAT-PLATER-01' },
    ],
  },
  {
    file: 'ShopFloor_3.png',
    code: 'PCB-FLOWSHOP',
    name: 'PCB Flow Shop SMT Factory',
    short: 'Flow Shop',
    chips: [
      { code: 'Plant', label: 'Nhà máy', example: 'PCB-FLOWSHOP' },
      { code: 'Division / Area', label: 'Xưởng / khu vực', example: 'FLO-DIV-SMT' },
      { code: 'Line / Cell / Work Center', label: 'Dây chuyền', example: 'FLO-LINE-B' },
      { code: 'Workstation / Equipment', label: 'Trạm / thiết bị', example: 'FLO-PRINTER-B' },
    ],
  },
  {
    file: 'ShopFloor_4.png',
    code: 'PCB-CELLULAR',
    name: 'PCB Cellular Assembly Factory',
    short: 'Cellular',
    chips: [
      { code: 'Plant', label: 'Nhà máy', example: 'PCB-CELLULAR' },
      { code: 'Division / Area', label: 'Xưởng / khu vực', example: 'CEL-DIV-ASM' },
      { code: 'Line / Cell / Work Center', label: 'Dây chuyền', example: 'CEL-IND' },
      { code: 'Workstation / Equipment', label: 'Trạm / thiết bị', example: 'CEL-PLACE-IND-01' },
    ],
  },
  {
    file: 'ShopFloor_5.png',
    code: 'PCB-PROJECT',
    name: 'PCB Project-Based NPI Factory',
    short: 'Project / NPI',
    chips: [
      { code: 'Plant', label: 'Nhà máy', example: 'PCB-PROJECT' },
      { code: 'Division / Area', label: 'Xưởng / khu vực', example: 'NPI-DIV-NPI' },
      { code: 'Line / Cell / Work Center', label: 'Dây chuyền', example: 'NPI-AREA-SHARED' },
      { code: 'Workstation / Equipment', label: 'Trạm / thiết bị', example: 'NPI-XRAY-01' },
    ],
  },
  {
    file: 'ShopFloor_6.png',
    code: 'PCB-CONTINUOUS',
    name: 'PCB Continuous Reel-to-Reel Factory',
    short: 'Continuous',
    chips: [
      { code: 'Plant', label: 'Nhà máy', example: 'PCB-CONTINUOUS' },
      { code: 'Division / Area', label: 'Xưởng / khu vực', example: 'RTR-DIV-RTR' },
      { code: 'Line / Cell / Work Center', label: 'Dây chuyền', example: 'RTR-TRAIN-A' },
      { code: 'Workstation / Equipment', label: 'Trạm / thiết bị', example: 'RTR-UNWIND-A' },
    ],
  },
  {
    file: 'ShopFloor_7.png',
    code: 'Demo-05',
    name: 'AGV / AMR — Operations Map',
    short: 'AGV / AMR',
    chips: [
      { code: 'Plant', label: 'Nhà máy', example: 'PCB fabrication & assembly' },
      { code: 'Division / Area', label: 'Xưởng / khu vực', example: 'Operations Map' },
      { code: 'Line / Cell / Work Center', label: 'Dây chuyền', example: 'AMR-LANE' },
      { code: 'Workstation / Equipment', label: 'Trạm / thiết bị', example: 'SMT · CNC · Packaging' },
    ],
  },
]

export default function ShopFloorStructureModal({ onClose }: { onClose: () => void }) {
  return (
    <CaptureGalleryModal
      onClose={onClose}
      eyebrow="NT-MES · Factory Structure"
      title={['SHOP-FLOOR', 'STRUCTURE']}
      accent="#2dd4bf"
      subtitlePrefix="Cấu hình nhà máy trên NT-MES"
      slides={SLIDES}
      statsRight="12 Factory · 22 Division · 49 Line · 180 Workstation"
      hint="← → hoặc bấm hình để xem mô hình khác"
    />
  )
}
