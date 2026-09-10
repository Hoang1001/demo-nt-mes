export type Lang = 'vi' | 'en'

export type Translations = typeof vi

const vi = {
  common: {
    back: '← Quay lại',
    prevSlide: 'Màn hình trước',
    nextSlide: 'Màn hình tiếp',
    galleryHint: '← → hoặc bấm hình để xem màn hình khác',
    galleryHintAlt: '← → hoặc bấm hình để xem mô hình khác',
  },
  slide: {
    eyebrow: 'Hệ thống Quản lý Sản xuất Tích hợp',
    tagline:
      'Dòng sông vật lý của nhà máy — mọi hệ thống phần mềm đều được xây dựng xung quanh để quan sát, điều tiết và phản ánh nó',
    hoverHint: 'di chuột module hoặc danh sách bên trái để xem mô tả →',
    openMes: 'Nhấn để mở NT-MES',
  },
  stages: [
    ['Nhà', 'cung cấp'],
    ['Kho', 'NVL'],
    ['SX', 'Cđ. 1'],
    ['WIP', 'Cđ. 2'],
    ['SX', 'Cđ. 3'],
    ['KCS'],
    ['Kho', 'Thành phẩm'],
    ['Khách', 'hàng'],
  ] as string[][],
  cats: {
    plan: 'Kế hoạch',
    exec: 'Thực thi SX',
    execFull: 'Thực thi Sản xuất',
    mhs: 'Vận chuyển nội bộ',
    wms: 'Kho & Tồn kho',
    qms: 'Chất lượng',
    logistics: 'Logistics',
    trace: 'Truy xuất',
    fico: 'Tài chính & Kiểm soát',
  },
  modules: {
    mrp: 'Tính toán nhu cầu nguyên liệu từ kế hoạch sản xuất và BOM, tạo lệnh mua hàng và lệnh sản xuất. Đây là bước điều tiết dòng chảy trước khi vật liệu thực sự di chuyển.',
    aps: 'Lập lịch chi tiết dựa trên năng lực máy và tình trạng nguyên liệu thực tế, điều chỉnh thứ tự và thời điểm dòng vật liệu đi qua từng công đoạn để tối ưu throughput.',
    pdm: 'Định nghĩa BOM và Routing – bản đồ chỉ ra dòng vật liệu phải đi qua những công đoạn biến đổi nào, theo thứ tự nào, để từ nguyên liệu thô trở thành sản phẩm hoàn chỉnh.',
    mes: 'Quan sát dòng vật liệu bên trong nhà máy theo thời gian thực: vật liệu nào đang ở máy nào, WIP đang ở công đoạn nào, mức tiêu hao thực tế so với định mức.',
    mhs: 'Điều phối thiết bị vận chuyển nội bộ – băng tải, AGV, xe nâng, sorter – để dịch chuyển vật liệu giữa các điểm dọc dòng chảy. Nhận lệnh từ MES và phản hồi trạng thái theo thời gian thực.',
    wms: 'Quản lý các điểm dừng của dòng chảy: vị trí lưu trữ, giao dịch nhận – xuất – chuyển kho, kitting và picking. Đồng thời ghi nhận số lượng và giá trị tồn kho tại mọi điểm trên dòng.',
    qms: 'Đặt trạm kiểm soát tại các điểm trọng yếu trên dòng chảy – nhận hàng, trong công đoạn sản xuất, thành phẩm. Kết quả kiểm tra quyết định vật liệu có được phép tiếp tục hay bị giữ lại.',
    tms: 'Quản lý dòng vật liệu ngoài nhà máy – từ nhà cung cấp vào (inbound) và từ kho thành phẩm đến khách hàng (outbound). Tối ưu tuyến đường và phương tiện để đúng lúc, đúng địa điểm.',
    trace:
      'Gắn nhãn định danh (số lô, serial, RFID, barcode) vào từng đơn vị vật liệu để ghi lại toàn bộ hành trình dọc dòng chảy. Khi có sự cố, truy ngược được chính xác điểm nào bị lỗi.',
    fico: 'Chuyển hóa mỗi chuyển động vật liệu thành giá trị tài chính: tính giá thành theo tiêu hao thực tế (actual costing) hoặc định mức (standard costing). Mọi giao dịch vật liệu đều sinh bút toán kế toán tương ứng.',
  },
  chipTitles: {
    wms_in: 'WMS – Kho Nguyên liệu',
    wms_out: 'WMS – Kho Thành phẩm',
    tms_in: 'TMS – Inbound',
    tms_out: 'TMS – Outbound',
  },
  roles: {
    pdm: 'Định nghĩa vật liệu cần đi qua những công đoạn biến đổi nào',
    mrpAps: 'Dự báo và điều tiết dòng chảy',
    tms: 'Vận chuyển vật liệu ngoài nhà máy (inbound / outbound)',
    wms: 'Quản lý các điểm lưu trữ dọc dòng chảy',
    mhs: 'Vận chuyển vật liệu giữa các điểm trong nhà máy',
    mes: 'Quản lý nơi dòng vật liệu được biến đổi',
    qms: 'Cho dòng chảy tiếp tục hoặc giữ lại',
    fico: 'Ghi nhận giá trị tài chính của từng chuyển động vật liệu',
    trace: 'Quan sát toàn bộ hành trình của dòng chảy',
  },
  mes: {
    subtitle:
      'Nền tảng quản lý và điều hành sản xuất, hỗ trợ xuyên suốt từ chuẩn bị sản phẩm–quy trình đến phân tích hiệu suất.',
    deselect: 'nhấn lần nữa để bỏ chọn',
    openSetup: 'Nhấn để mở Setup Sequence →',
    hubDesc:
      'Chuỗi Technology + Shop-floor Structure → Resource Binding → Manufacturing Order → Planning → Execution → Quality / Performance',
    hoverHint: 'di chuột module, hoặc nhấn NT-MES để xem chuỗi điều hành →',
    items: {
      1: {
        label: 'Lập lịch chi tiết',
        desc: 'Quản lý lệnh và công việc sản xuất; lập lịch bằng bảng, lịch và Gantt; điều chỉnh thời gian, gán trạm–nhân sự, cảnh báo xung đột; phát hành lịch công đoạn và liên kết kế hoạch với MRP.',
      },
      2: {
        label: 'Phân bổ nguồn lực',
        desc: 'Quản lý nhà máy, dây chuyền, trạm, máy và tài sản; theo dõi khả dụng thiết bị, tình trạng vật tư; hỗ trợ gán nhân sự và đánh giá kỹ năng phù hợp với công đoạn.',
      },
      3: {
        label: 'Điều phối sản xuất',
        desc: 'Phát hành và theo dõi lệnh; cung cấp hàng đợi theo trạm; hỗ trợ thực hiện và hoàn tất công việc; ghi nhận tiến độ, sản lượng, phế phẩm, thời gian, tiêu hao và các tình trạng bị chặn.',
      },
      4: {
        label: 'Quản lý bảo trì',
        desc: 'Quản lý tài sản và liên kết máy–trạm; theo dõi trạng thái khả dụng; tổ chức bảo trì sự cố và bảo trì kế hoạch; ghi nhận công việc, vật tư, nhân công và chi phí; theo dõi đồng hồ, SLA và độ tin cậy thiết bị.',
      },
      5: {
        label: 'Phân tích hiệu suất',
        desc: 'Theo dõi tiến độ và sản lượng; phân tích OEE, tổn thất, phế phẩm và xu hướng; giám sát Andon; theo dõi KPI bảo trì, độ tin cậy, SLA và chi phí; cung cấp dashboard, báo cáo và xuất dữ liệu.',
      },
      6: {
        label: 'Tài liệu & Quy trình',
        desc: 'Quản lý BOM, cây công đoạn, định mức và thông số kỹ thuật; đồng thời cung cấp tài liệu, hướng dẫn và thông tin công nghệ theo đúng ngữ cảnh lệnh, công việc và trạm vận hành.',
      },
      7: {
        label: 'Thu thập dữ liệu',
        desc: 'Thu nhận từ terminal và thiết bị các dữ liệu sản lượng, phế phẩm, thời gian, nhân công, vật tư, sản phẩm và lô; đồng thời ghi nhận kết quả QC, đồng hồ, tín hiệu và trạng thái thiết bị.',
      },
      8: {
        label: 'Quản lý nhân lực',
        desc: 'Hỗ trợ gán nhân sự cho lịch và công việc; ghi nhận thời gian lao động; quản lý kỹ năng, chứng nhận và đối chiếu năng lực nhân sự với yêu cầu của từng công đoạn.',
      },
      9: {
        label: 'Quản lý chất lượng',
        desc: 'Quản lý biểu mẫu, phiên bản, tiêu chí và phiếu kiểm tra; đánh giá PASS/FAIL; gửi duyệt, phê duyệt, từ chối hoặc yêu cầu sửa; lưu bằng chứng, tệp đính kèm và lịch sử xử lý.',
      },
      10: {
        label: 'Theo dõi & Truy xuất',
        desc: 'Quản lý lô, số sê-ri, container và quan hệ đầu vào–đầu ra; tìm kiếm, truy xuất xuôi/ngược; xem lịch sử sự kiện, khoanh vùng ảnh hưởng, hỗ trợ thu hồi và lập báo cáo truy xuất.',
      },
    },
  },
  process: {
    subtitle:
      'Technology + Shop-floor Structure → Resource Binding → Manufacturing Order → Scheduling → Execution → Quality / Performance',
    hoverHint: 'di chuột khối để xem mô tả · nhấn khối có ↗ để xem màn hình NT-MES →',
    nodes: {
      shop: {
        desc: 'Cấu trúc nhà máy theo cấp: Plant → Division / Area → Production Line / Cell / Work Center → Workstation / Equipment. Đây là khung nguồn lực vật lý trên shop-floor.',
        hint: 'Nhấn để xem cấu hình nhà máy trên NT-MES →',
      },
      tech: {
        desc: 'Mô hình công nghệ của sản phẩm: BOM và luồng vật tư vào–ra, cây công đoạn, routing, định mức thời gian và yêu cầu kỹ thuật.',
        hint: 'Nhấn để xem mô hình công nghệ trên NT-MES →',
      },
      bind: {
        desc: 'Gắn quy trình công nghệ với nguồn lực đủ điều kiện: phạm vi technology, division / production line và các workstation được phép thực hiện.',
        hint: '',
      },
      order: {
        desc: 'Lệnh sản xuất mang theo sản phẩm, technology áp dụng, số lượng và mốc thời gian kế hoạch — đầu vào cho bước lập lịch.',
        hint: 'Nhấn để xem lệnh sản xuất trên NT-MES →',
      },
      plan: {
        desc: 'Chọn cách lập lịch: gán lệnh cho dây chuyền (production line) hoặc chi tiết xuống workstation, nhân sự và operational tasks.',
        hint: '',
      },
      line: {
        desc: 'Lập lịch mức dây chuyền: gán Manufacturing Order cho Production Line kèm Start / End Time.',
        hint: '',
      },
      ws: {
        desc: 'Lập lịch mức trạm: bung operations xuống workstation, gán nhân sự và tạo operational tasks.',
        hint: 'Nhấn để xem lập lịch mức trạm trên NT-MES →',
      },
      exec: {
        desc: 'Thực thi sản xuất: tracking tiến độ, start/stop, ghi nhận hàng tốt / phế phẩm và tiêu hao vật tư.',
        hint: 'Nhấn để xem thực thi sản xuất trên NT-MES →',
      },
      quality: {
        desc: 'Chất lượng và truy xuất: kiểm tra, LOT / batch, genealogy đầu vào–đầu ra và xử lý nonconformance.',
        hint: 'Nhấn để xem chất lượng và truy xuất trên NT-MES →',
      },
      result: {
        desc: 'Hiệu suất sản xuất: sản lượng, thời gian, downtime, WIP và các KPI / OEE phục vụ đánh giá hiệu quả vận hành.',
        hint: 'Nhấn để xem hiệu suất sản xuất trên NT-MES →',
      },
    },
  },
  gallery: {
    shopSubtitle: 'Cấu hình nhà máy trên NT-MES',
    techSubtitle: 'Mô hình công nghệ trên NT-MES',
    orderSubtitle: 'Lệnh sản xuất trên NT-MES',
    wsSubtitle: 'Lập lịch mức trạm trên NT-MES',
    execSubtitle: 'Thực thi sản xuất trên NT-MES',
    qualitySubtitle: 'Chất lượng và truy xuất trên NT-MES',
    resultSubtitle: 'Hiệu suất sản xuất trên NT-MES',
  },
  chips: {
    Plant: 'Nhà máy',
    'Division / Area': 'Xưởng / khu vực',
    'Line / Cell / Work Center': 'Dây chuyền',
    'Workstation / Equipment': 'Trạm / thiết bị',
    Product: 'Sản phẩm',
    'BOM / Material I-O': 'Cấu trúc vật tư',
    'Operation Tree': 'Cây công đoạn',
    'Routing / Process': 'Luồng công nghệ',
    Technology: 'Công nghệ',
    Quantity: 'Số lượng',
    'Planned Dates': 'Mốc kế hoạch',
    Operations: 'Công đoạn',
    Workstations: 'Trạm',
    Employees: 'Nhân sự',
    'Operational Tasks': 'Tác vụ',
    'Production Tracking': 'Theo dõi lệnh',
    'Start / Stop': 'Bắt đầu / kết thúc',
    'Good / Scrap': 'Hàng tốt / phế',
    'Material Consumption': 'Tiêu hao vật tư',
    Inspection: 'Kiểm tra',
    'LOT / Batch': 'Lô / batch',
    Genealogy: 'Phả hệ',
    Nonconformance: 'Sự không phù hợp',
    'Time / Downtime': 'Thời gian / dừng máy',
    WIP: 'Bán thành phẩm',
    'KPI / OEE': 'KPI / OEE',
  } as Record<string, string>,
  // Identity map — source examples in slides are Vietnamese
  examples: {} as Record<string, string>,
}

const en: Translations = {
  common: {
    back: '← Back',
    prevSlide: 'Previous screen',
    nextSlide: 'Next screen',
    galleryHint: '← → or click the image to switch screens',
    galleryHintAlt: '← → or click the image to switch models',
  },
  slide: {
    eyebrow: 'Integrated Manufacturing Management System',
    tagline:
      'The physical river of the plant — every software system is built around it to observe, regulate, and reflect it',
    hoverHint: 'hover a module or the list on the left to see details →',
    openMes: 'Click to open NT-MES',
  },
  stages: [
    ['Supplier'],
    ['RM', 'Warehouse'],
    ['Prod.', 'Op. 1'],
    ['WIP', 'Op. 2'],
    ['Prod.', 'Op. 3'],
    ['QC'],
    ['FG', 'Warehouse'],
    ['Customer'],
  ],
  cats: {
    plan: 'Planning',
    exec: 'Execution',
    execFull: 'Production Execution',
    mhs: 'Internal Handling',
    wms: 'Warehouse & Inventory',
    qms: 'Quality',
    logistics: 'Logistics',
    trace: 'Traceability',
    fico: 'Finance & Controlling',
  },
  modules: {
    mrp: 'Calculates material requirements from the production plan and BOM, creating purchase and production orders. This is the flow-control step before materials actually move.',
    aps: 'Builds detailed schedules from machine capacity and live material status, adjusting sequence and timing as material moves through each operation to maximize throughput.',
    pdm: 'Defines the BOM and Routing — the map of which transformation steps materials must pass through, and in what order, from raw materials to finished goods.',
    mes: 'Observes material flow inside the plant in real time: which material is on which machine, where WIP sits, and actual consumption versus standard.',
    mhs: 'Coordinates internal handling equipment — conveyors, AGVs, forklifts, sorters — to move material between points along the flow. Receives orders from MES and reports live status.',
    wms: 'Manages the stop points of the flow: storage locations, goods receipt / issue / transfer, kitting and picking. Also records inventory quantity and value at every point on the stream.',
    qms: 'Places control gates at critical points — inbound, in-process, finished goods. Inspection results decide whether material may continue or must be held.',
    tms: 'Manages material flow outside the plant — inbound from suppliers and outbound from FG warehouse to customers. Optimizes routes and vehicles for the right time and place.',
    trace:
      'Attaches identity labels (lot, serial, RFID, barcode) to each material unit to record the full journey along the flow. When issues arise, the exact failure point can be traced back.',
    fico: 'Turns every material movement into financial value: actual or standard costing. Every material transaction generates the corresponding accounting entry.',
  },
  chipTitles: {
    wms_in: 'WMS – Raw Material WH',
    wms_out: 'WMS – Finished Goods WH',
    tms_in: 'TMS – Inbound',
    tms_out: 'TMS – Outbound',
  },
  roles: {
    pdm: 'Defines which transformation steps materials must pass through',
    mrpAps: 'Forecasts and regulates the material flow',
    tms: 'Moves materials outside the plant (inbound / outbound)',
    wms: 'Manages storage points along the flow',
    mhs: 'Moves materials between points inside the plant',
    mes: 'Manages where material flow is transformed',
    qms: 'Lets the flow continue or holds it back',
    fico: 'Records the financial value of each material movement',
    trace: 'Observes the full journey of the material flow',
  },
  mes: {
    subtitle:
      'A manufacturing execution platform spanning product–process preparation through performance analysis.',
    deselect: 'click again to deselect',
    openSetup: 'Click to open Setup Sequence →',
    hubDesc:
      'Chain: Technology + Shop-floor Structure → Resource Binding → Manufacturing Order → Planning → Execution → Quality / Performance',
    hoverHint: 'hover a module, or click NT-MES to see the execution sequence →',
    items: {
      1: {
        label: 'Detailed Scheduling',
        desc: 'Manage production orders and jobs; schedule via table, calendar and Gantt; adjust timing, assign stations–staff, warn on conflicts; release operation schedules and link plans with MRP.',
      },
      2: {
        label: 'Resource Allocation',
        desc: 'Manage plants, lines, stations, machines and assets; track equipment availability and material status; support staff assignment and skill matching to operations.',
      },
      3: {
        label: 'Production Dispatch',
        desc: 'Release and track orders; provide station queues; support job execution and completion; record progress, output, scrap, time, consumption and blocked states.',
      },
      4: {
        label: 'Maintenance Mgmt',
        desc: 'Manage assets and machine–station links; track availability; organize reactive and planned maintenance; record work, materials, labor and cost; track meters, SLA and reliability.',
      },
      5: {
        label: 'Performance Analysis',
        desc: 'Track progress and output; analyze OEE, losses, scrap and trends; monitor Andon; track maintenance KPIs, reliability, SLA and cost; provide dashboards, reports and data export.',
      },
      6: {
        label: 'Docs & Process',
        desc: 'Manage BOM, operation trees, norms and specs; deliver documents, instructions and process info in the context of orders, jobs and operating stations.',
      },
      7: {
        label: 'Data Collection',
        desc: 'Capture from terminals and devices: output, scrap, time, labor, materials, products and lots; also record QC results, meters, signals and equipment status.',
      },
      8: {
        label: 'Labor Management',
        desc: 'Assign staff to schedules and jobs; record labor time; manage skills, certifications and match workforce capability to each operation’s requirements.',
      },
      9: {
        label: 'Quality Management',
        desc: 'Manage forms, versions, criteria and inspection sheets; PASS/FAIL evaluation; submit, approve, reject or request rework; store evidence, attachments and handling history.',
      },
      10: {
        label: 'Tracking & Trace',
        desc: 'Manage lots, serials, containers and input–output relations; search, forward/backward trace; view event history, impact scope, support recalls and traceability reports.',
      },
    },
  },
  process: {
    subtitle:
      'Technology + Shop-floor Structure → Resource Binding → Manufacturing Order → Scheduling → Execution → Quality / Performance',
    hoverHint: 'hover a block for details · click blocks with ↗ to open NT-MES screens →',
    nodes: {
      shop: {
        desc: 'Plant hierarchy: Plant → Division / Area → Production Line / Cell / Work Center → Workstation / Equipment. The physical resource frame on the shop floor.',
        hint: 'Click to view plant configuration on NT-MES →',
      },
      tech: {
        desc: 'Product technology model: BOM and material input–output, operation tree, routing, time norms and technical requirements.',
        hint: 'Click to view the technology model on NT-MES →',
      },
      bind: {
        desc: 'Bind process technology to eligible resources: technology scope, division / production line and allowed workstations.',
        hint: '',
      },
      order: {
        desc: 'A manufacturing order carries product, applied technology, quantity and planned dates — input to the scheduling step.',
        hint: 'Click to view manufacturing orders on NT-MES →',
      },
      plan: {
        desc: 'Choose scheduling approach: assign orders to a production line, or detail down to workstation, staff and operational tasks.',
        hint: '',
      },
      line: {
        desc: 'Line-level scheduling: assign Manufacturing Order to Production Line with Start / End Time.',
        hint: '',
      },
      ws: {
        desc: 'Workstation-level scheduling: explode operations to workstations, assign staff and create operational tasks.',
        hint: 'Click to view workstation scheduling on NT-MES →',
      },
      exec: {
        desc: 'Production execution: progress tracking, start/stop, good / scrap recording and material consumption.',
        hint: 'Click to view production execution on NT-MES →',
      },
      quality: {
        desc: 'Quality and traceability: inspection, LOT / batch, input–output genealogy and nonconformance handling.',
        hint: 'Click to view quality and traceability on NT-MES →',
      },
      result: {
        desc: 'Production performance: output, time, downtime, WIP and KPI / OEE for operational effectiveness.',
        hint: 'Click to view production performance on NT-MES →',
      },
    },
  },
  gallery: {
    shopSubtitle: 'Plant configuration on NT-MES',
    techSubtitle: 'Technology model on NT-MES',
    orderSubtitle: 'Manufacturing orders on NT-MES',
    wsSubtitle: 'Workstation scheduling on NT-MES',
    execSubtitle: 'Production execution on NT-MES',
    qualitySubtitle: 'Quality and traceability on NT-MES',
    resultSubtitle: 'Production performance on NT-MES',
  },
  chips: {
    Plant: 'Plant',
    'Division / Area': 'Division / Area',
    'Line / Cell / Work Center': 'Line / Cell / WC',
    'Workstation / Equipment': 'Workstation / Eq.',
    Product: 'Product',
    'BOM / Material I-O': 'BOM / Material I-O',
    'Operation Tree': 'Operation Tree',
    'Routing / Process': 'Routing / Process',
    Technology: 'Technology',
    Quantity: 'Quantity',
    'Planned Dates': 'Planned Dates',
    Operations: 'Operations',
    Workstations: 'Workstations',
    Employees: 'Employees',
    'Operational Tasks': 'Operational Tasks',
    'Production Tracking': 'Production Tracking',
    'Start / Stop': 'Start / Stop',
    'Good / Scrap': 'Good / Scrap',
    'Material Consumption': 'Material Consumption',
    Inspection: 'Inspection',
    'LOT / Batch': 'LOT / Batch',
    Genealogy: 'Genealogy',
    Nonconformance: 'Nonconformance',
    'Time / Downtime': 'Time / Downtime',
    WIP: 'WIP',
    'KPI / OEE': 'KPI / OEE',
  },
  examples: {
    'Lắp ráp (A) · 3 bước': 'Assembly (A) · 3 steps',
    'Rửa board → Phủ conformal → Sấy phủ': 'Wash board → Conformal coat → Cure',
    'Bước 2/6 · Configuration': 'Step 2/6 · Configuration',
    '12 MO trên trục thời gian': '12 MOs on the timeline',
    '12 MO trên lịch tháng': '12 MOs on the month calendar',
  },
}

export const dictionaries: Record<Lang, Translations> = { vi, en }
