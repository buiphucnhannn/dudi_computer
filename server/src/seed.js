import "dotenv/config";
import mongoose from "mongoose";
import dns from "dns";
import { Product } from "./models/Product.js";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}
import { Category } from "./models/Category.js";
import { News } from "./models/News.js";
import { Job } from "./models/Job.js";
import { User } from "./models/User.js";

export const CATEGORIES_DATA = [
  { name: "Laptop", slug: "laptop", pcPartType: "none", description: "Laptop chính hãng cao cấp, like new 99% và mới 100% nguyên seal" },
  { name: "Laptop Gaming", slug: "laptop-gaming", pcPartType: "none", description: "Laptop Gaming cấu hình khủng, màn hình 144Hz - 240Hz chiến game mượt mà" },
  { name: "Laptop Văn phòng", slug: "laptop-van-phong", pcPartType: "none", description: "Laptop văn phòng mỏng nhẹ, pin trâu, thiết kế sang trọng" },
  { name: "Laptop Dell", slug: "laptop-dell", pcPartType: "none", description: "Laptop Dell XPS, Latitude, Inspiron, Alienware bền bỉ cao cấp" },
  { name: "Laptop Lenovo", slug: "laptop-lenovo", pcPartType: "none", description: "Laptop Lenovo ThinkPad, Legion, Yoga, IdeaPad hiệu năng vượt trội" },
  { name: "Laptop Asus", slug: "laptop-asus", pcPartType: "none", description: "Laptop Asus ROG, TUF Gaming, Zenbook, Vivobook thời thượng" },
  { name: "Laptop Acer", slug: "laptop-acer", pcPartType: "none", description: "Laptop Acer Predator, Nitro, Swift, Aspire giá cực tốt" },
  { name: "Laptop MSI", slug: "laptop-msi", pcPartType: "none", description: "Laptop MSI Gaming Raider, Stealth, Katana, Modern đồ họa đỉnh cao" },
  { name: "Laptop HP", slug: "laptop-hp", pcPartType: "none", description: "Laptop HP Omen, Victus, Envy, Spectre, Pavilion bền bỉ" },
  { name: "Laptop Gigabyte", slug: "laptop-gigabyte", pcPartType: "none", description: "Laptop Gigabyte Aorus, G5 hiệu năng gaming chuyên nghiệp" },
  { name: "Laptop Razer", slug: "laptop-razer", pcPartType: "none", description: "Laptop Razer Blade đẳng cấp doanh nhân gaming cao cấp" },
  { name: "Laptop LG", slug: "laptop-lg", pcPartType: "none", description: "Laptop LG Gram siêu nhẹ chỉ từ 999g, pin cực trâu" },
  { name: "Laptop Surface", slug: "laptop-surface", pcPartType: "none", description: "Microsoft Surface Pro, Surface Laptop màn hình cảm ứng sắc nét" },
  { name: "Macbook", slug: "macbook", pcPartType: "none", description: "Apple MacBook Pro, MacBook Air chip M1, M2, M3 retina đẳng cấp" },
  { name: "PC", slug: "pc", pcPartType: "none", description: "Dàn máy tính PC văn phòng, đồ họa, gaming đồng bộ và lắp ráp chất lượng cao" },
  { name: "PC Gaming", slug: "pc-gaming", pcPartType: "none", description: "Bộ máy tính PC Gaming cấu hình cao, LED RGB, tản nước, chiến mượt mọi tựa game" },
  { name: "PC Đồ Họa", slug: "pc-do-hoa", pcPartType: "none", description: "Máy tính đồ họa Workstation chuyên render 3D, kiến trúc, dựng phim 4K" },
  { name: "Màn hình máy tính", slug: "man-hinh", pcPartType: "monitor", description: "Màn hình máy tính Gaming, Đồ họa 24 - 32 inch, 2K, 4K, 165Hz - 240Hz, IPS, OLED" },
  { name: "Mainboard - Bo mạch chủ", slug: "mainboard-bo-mach-chu", pcPartType: "mainboard", description: "Bo mạch chủ ASUS, MSI, Gigabyte chipset B760, Z790, B650 chính hãng" },
  { name: "CPU - Bộ vi xử lý", slug: "cpu-bo-vi-xu-ly", pcPartType: "cpu", description: "Bộ vi xử lý Intel Core i3/i5/i7/i9 Gen 12, 13, 14 và AMD Ryzen 5000/7000/9000 series" },
  { name: "RAM - Bộ nhớ trong", slug: "ram-bo-nho-trong", pcPartType: "ram", description: "RAM DDR4, DDR5 Kingston Fury, Corsair Vengeance, G.Skill Trident Z RGB" },
  { name: "VGA - Card màn hình", slug: "vga-card-man-hinh", pcPartType: "vga", description: "Card màn hình NVIDIA GeForce RTX 3060, RTX 4060, RTX 4070, RTX 4080, RTX 4090" },
  { name: "Ổ cứng HDD - SSD", slug: "o-cung-hdd-ssd", pcPartType: "ssd", description: "Ổ cứng SSD NVMe M.2 PCIe Gen 4, Gen 3 tốc độ cao Samsung, Kingston, Crucial" },
  { name: "PSU - Nguồn máy tính", slug: "psu-nguon-may-tinh", pcPartType: "psu", description: "Nguồn máy tính 450W - 1000W chuẩn 80 Plus Bronze, Gold, chuẩn ATX 3.0" },
  { name: "CASE - Vỏ máy tính", slug: "case-vo-may-tinh", pcPartType: "case", description: "Vỏ case máy tính bể cá vô cực, case kính cường lực kèm quạt ARGB rực rỡ" },
  { name: "Tản nhiệt Cooling", slug: "tan-nhiet-cooling", pcPartType: "cooler", description: "Tản nhiệt nước AIO 240/360 màn hình LCD, tản nhiệt khí tháp đôi siêu mát" },
  { name: "Bàn phím", slug: "ban-phim", pcPartType: "gear", description: "Bàn phím cơ Gaming, bàn phím không dây Akko, Keychron, Corsair, DareU" },
  { name: "Chuột", slug: "chuot", pcPartType: "gear", description: "Chuột gaming không dây, chuột công thái học Logitech, Razer siêu nhẹ" }
];

export const NEWS_DATA = [
  {
    "title": "Top 5 Laptop Gaming Dưới 20 Triệu Đáng Mua Nhất 2025: Hiệu Năng Vượt Trội",
    "slug": "top-5-laptop-gaming-duoi-20-trieu-dang-mua-nhat-2025",
    "category": "Tin công nghệ",
    "thumbnail": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
    "summary": "Đánh giá chi tiết top 5 dòng máy laptop gaming tầm trung dưới 20 triệu đồng sở hữu cấu hình mạnh mẽ, màn hình 144Hz - 165Hz và hệ thống tản nhiệt tối ưu nhất hiện nay.",
    "content": "\n      <h2>1. Tổng quan phân khúc Laptop Gaming dưới 20 triệu đồng năm 2025</h2>\n      <p>Năm 2025 đánh dấu bước chuyển mình mạnh mẽ của thị trường laptop gaming tầm trung. Nhờ sự tối ưu hóa dây chuyền sản xuất từ các ông lớn Intel, AMD và NVIDIA, người dùng với ngân sách dưới 20 triệu đồng giờ đây đã có thể dễ dàng sở hữu những cỗ máy trang bị vi xử lý đa nhân đa luồng thế hệ mới cùng card đồ họa rời hỗ trợ dò tia Ray Tracing và trí tuệ nhân tạo DLSS.</p>\n      <p>Tại ZComputer, các dòng máy lướt Like New 99% nguyên bản chuẩn zin tiếp tục là sự lựa chọn số 1 của đông đảo học sinh, sinh viên và game thủ muốn tối đa hóa sức mạnh trên từng đồng chi phí bỏ ra.</p>\n\n      <h2>2. Top 5 mẫu Laptop Gaming đáng mua nhất hiện nay</h2>\n      \n      <h3>1. ASUS TUF Gaming A15 / F15 Series</h3>\n      <p><strong>Cấu hình nổi bật:</strong> AMD Ryzen 7 7735HS / Intel Core i5 12500H, RAM 16GB DDR5, SSD 512GB NVMe, NVIDIA RTX 3050 / RTX 4050, Màn hình 15.6 inch FHD 144Hz 100% sRGB.</p>\n      <p>Dòng máy TUF Gaming của ASUS luôn ghi điểm nhờ độ bền đạt tiêu chuẩn quân sự Mỹ MIL-STD-810H, bàn phím gõ nảy có LED RGB 1 vùng rực rỡ và hệ thống quạt tản nhiệt Arc Flow 84 cánh vận hành êm ái. Mức giá tại ZComputer chỉ dao động từ 16.5 - 19.5 triệu đồng tùy phiên bản.</p>\n\n      <h3>2. Lenovo Legion 5 / Lenovo LOQ 15</h3>\n      <p><strong>Cấu hình nổi bật:</strong> Intel Core i5 13450HX / Ryzen 7 6800H, RAM 16GB DDR5, SSD 512GB PCIe 4.0, RTX 3060 6GB / RTX 4050 6GB (TGP lên tới 105W - 140W).</p>\n      <p>Lenovo tiếp tục khẳng định vị thế với bàn phím TrueStrike hành trình sâu, hỗ trợ 100% Anti-ghosting và hệ thống tản nhiệt Coldfront trứ danh. Máy kiểm soát nhiệt độ CPU/GPU cực tốt, giữ xung nhịp ổn định ngay cả khi chơi các tựa game nặng như Black Myth: Wukong hay Cyberpunk 2077.</p>\n\n      <h3>3. Acer Nitro 16 Phoenix / Nitro 5 Tiger</h3>\n      <p><strong>Cấu hình nổi bật:</strong> AMD Ryzen 5 7535HS / Intel Core i5 12500H, RAM 16GB DDR5, RTX 4050 6GB 140W, Màn hình 16 inch 16:10 165Hz 100% sRGB.</p>\n      <p>Nitro 16 Phoenix sở hữu thiết kế logo đa sắc hiện đại, khe thoát nhiệt hầm hố và phần mềm quản lý NitroSense chuyên sâu. Tấm nền màn hình chuẩn màu 100% sRGB giúp bạn vừa chiến game vừa làm đồ họa Photoshop, Premiere Pro xuất sắc.</p>\n\n      <h3>4. MSI Katana 15 / Cyborg 15</h3>\n      <p><strong>Cấu hình nổi bật:</strong> Intel Core i7 12650H / i5 13420H, RAM 16GB DDR5, RTX 4050 6GB, Màn hình 15.6 inch 144Hz IPS-Level.</p>\n      <p>MSI Katana mang phong cách kiếm sĩ Nhật Bản với vỏ ngoài đen nhám lịch lãm, bàn phím 4 vùng RGB nổi bật cụm phím WASD trong suốt. Trọng lượng máy chỉ khoảng 2.25kg giúp việc di chuyển đi học, đi làm vô cùng thuận tiện.</p>\n\n      <h3>5. Gigabyte G5 / Aorus 15</h3>\n      <p><strong>Cấu hình nổi bật:</strong> Intel Core i5 12450H / i5 13500H, RAM 16GB, RTX 4050 6GB, Màn hình FHD 144Hz.</p>\n      <p>Gigabyte G5 nổi tiếng là mẫu laptop gaming có p/p (hiệu năng trên giá thành) tốt nhất phân khúc phổ thông. Khung máy mỏng nhẹ nhưng sở hữu đầy đủ các cổng kết nối quan trọng ở cạnh sau máy giúp bàn làm việc luôn gọn gàng.</p>\n\n      <h2>3. Bảng so sánh hiệu năng chơi game thực tế (Độ phân giải Full HD)</h2>\n      <table style=\"width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #e2e8f0;\">\n        <thead>\n          <tr style=\"background-color: #f8fafc; text-align: left;\">\n            <th style=\"padding: 12px; border: 1px solid #e2e8f0;\">Tựa Game</th>\n            <th style=\"padding: 12px; border: 1px solid #e2e8f0;\">Thiết Lập (Settings)</th>\n            <th style=\"padding: 12px; border: 1px solid #e2e8f0;\">FPS Trung Bình (RTX 4050)</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">Liên Minh Huyền Thoại (LoL)</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">Very High (Cao nhất)</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #16a34a;\">220 - 260 FPS</td>\n          </tr>\n          <tr>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">CS:GO 2 / Valorant</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">High / Competitive</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #16a34a;\">180 - 240 FPS</td>\n          </tr>\n          <tr>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">PUBG PC</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">Ultra (Siêu cao)</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #16a34a;\">110 - 135 FPS</td>\n          </tr>\n          <tr>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">Black Myth: Wukong</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">Medium + DLSS 3 Frame Gen</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #16a34a;\">75 - 90 FPS</td>\n          </tr>\n          <tr>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">Cyberpunk 2077</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">High + DLSS Quality</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #16a34a;\">70 - 85 FPS</td>\n          </tr>\n        </tbody>\n      </table>\n\n      <h2>4. Lời khuyên vàng khi chọn mua laptop gaming cũ tại ZComputer</h2>\n      <ul>\n        <li><strong>Kiểm tra nhiệt độ khi Full Load:</strong> Chạy bài kiểm tra Furmark và Cinebench R23 trong 10-15 phút để đảm bảo nhiệt độ GPU dưới 80°C và CPU dưới 90°C.</li>\n        <li><strong>Kiểm tra tình trạng ổ cứng và pin:</strong> Dùng phần mềm CrystalDiskInfo xem % sức khỏe SSD và lệnh <code>powercfg /batteryreport</code> trong CMD để kiểm tra dung lượng pin thực tế.</li>\n        <li><strong>Chính sách hậu mãi:</strong> Tất cả laptop tại ZComputer đều được kỹ thuật viên kiểm định 24 bước, cam kết nguyên zin 100%, bảo hành 1 đổi 1 trong 30 ngày đầu và miễn phí vệ sinh, tra keo tản nhiệt MX-4 trọn đời.</li>\n      </ul>\n    ",
    "tags": [
      "Laptop Gaming",
      "Lenovo Legion",
      "Asus TUF",
      "Tư vấn mua máy"
    ],
    "views": 1450,
    "isPublished": true,
    "authorName": "ZCOMPUTER Editor"
  },
  {
    "title": "Hướng Dẫn Build PC Gaming i5 13400F + RTX 4060 Chiến Mọi Tựa Game AAA",
    "slug": "huong-dan-build-pc-gaming-i5-13400f-rtx-4060-chien-moi-tua-game",
    "category": "Thủ thuật",
    "thumbnail": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
    "summary": "Tối ưu ngân sách khoảng 18 - 22 triệu đồng với cấu hình Intel Core i5-13400F kết hợp cùng NVIDIA RTX 4060 giúp chiến mượt mà mọi tựa game chuẩn phân giải Full HD / 2K max settings.",
    "content": "\n      <h2>1. Tại sao combo i5 13400F + RTX 4060 lại là cấu hình quốc dân 2025?</h2>\n      <p>Trong tầm giá từ 18 đến 22 triệu đồng, việc lựa chọn linh kiện sao cho đồng bộ, không bị nghẽn cổ chai (bottleneck) và tận dụng tối đa sức mạnh phần cứng là bài toán được nhiều bạn quan tâm. Sự kết hợp giữa vi xử lý Intel Core i5-13400F và card đồ họa NVIDIA GeForce RTX 4060 8GB GDDR6 chính là lời giải hoàn hảo nhất.</p>\n      <p>Cấu hình này đáp ứng trọn vẹn cả 3 tiêu chí: Hiệu năng gaming đỉnh cao ở độ phân giải Full HD / 2K, khả năng làm việc đồ họa đa nhiệm mượt mà và mức tiêu thụ điện năng cực kỳ tiết kiệm.</p>\n\n      <h2>2. Chi tiết bảng linh kiện đề xuất tối ưu</h2>\n      <ul>\n        <li><strong>CPU - Bộ vi xử lý:</strong> Intel Core i5-13400F (10 nhân 16 luồng, xung nhịp Turbo Boost 4.6GHz, 20MB Smart Cache). Hiệu năng đa nhân mạnh hơn 25% so với thế hệ i5 12400F tiền nhiệm.</li>\n        <li><strong>Mainboard - Bo mạch chủ:</strong> ASUS TUF GAMING B760M-PLUS WIFI D4 hoặc MSI MAG B760M MORTAR. Dàn phase cấp nguồn 12+1 DrMOS dày dặn, hỗ trợ tản nhiệt VRM mát mẻ và tích hợp sẵn WiFi 6 + Bluetooth 5.2.</li>\n        <li><strong>RAM - Bộ nhớ trong:</strong> 16GB (2x8GB) hoặc 32GB (2x16GB) DDR4 3200MHz Kingston Fury Beast RGB chạy Dual Channel băng thông tối đa.</li>\n        <li><strong>VGA - Card màn hình:</strong> Gigabyte / ASUS / MSI GeForce RTX 4060 8GB GDDR6. Kiến trúc Ada Lovelace 4nm hiện đại, hỗ trợ công nghệ DLSS 3 Frame Generation nhân đôi khung hình.</li>\n        <li><strong>SSD - Ổ cứng lưu trữ:</strong> 500GB hoặc 1TB NVMe PCIe Gen 4.0 (Kingston NV2 / Samsung 980) với tốc độ đọc ghi lên tới 3500MB/s giúp load game và khởi động Windows trong tích tắc.</li>\n        <li><strong>Nguồn máy tính (PSU):</strong> 650W chuẩn 80 Plus Bronze (DeepCool PK650D / Xigmatek X-Power 650) cung cấp nguồn điện ổn định, dư dả công suất cho toàn bộ hệ thống.</li>\n        <li><strong>Tản nhiệt CPU:</strong> Tản nhiệt khí Thermalright Assassin X 120 Refined SE hoặc Tản nước AIO 240 ARGB giữ nhiệt độ CPU luôn dưới 68°C khi chơi game liên tục.</li>\n        <li><strong>Vỏ Case:</strong> Case bể cá vô cực MIK Focal Panoramic kèm bộ 3 Fan LED ARGB đồng bộ hiệu ứng ánh sáng.</li>\n      </ul>\n\n      <h2>3. Các bước tối ưu hóa sau khi lắp ráp</h2>\n      <h3>Bước 1: Bật tính năng XMP trong BIOS</h3>\n      <p>Khi mới lắp ráp, RAM sẽ chạy ở mức bus mặc định 2133MHz hoặc 2400MHz. Hãy truy cập BIOS bằng phím <code>DEL</code> hoặc <code>F2</code> lúc bật máy, tìm mục <strong>XMP (Extreme Memory Profile)</strong> và chuyển sang <em>Profile 1</em> để RAM hoạt động ở đúng tốc độ 3200MHz / 3600MHz.</p>\n\n      <h3>Bước 2: Bật tính năng Resizable BAR</h3>\n      <p>Tính năng Resizable BAR cho phép CPU truy cập trực tiếp vào toàn bộ bộ nhớ VRAM của card đồ họa, giúp tăng từ 5% - 12% FPS trong các tựa game như Forza Horizon 5, Assassin's Creed Valhalla.</p>\n\n      <h3>Bước 3: Cài đặt Driver card đồ họa Game Ready mới nhất</h3>\n      <p>Tải phần mềm NVIDIA GeForce Experience hoặc NVIDIA App để cập nhật bản Driver mới nhất, tối ưu hóa các tựa game mới ra mắt.</p>\n\n      <h2>4. Đánh giá tổng kết</h2>\n      <p>Với mức đầu tư hợp lý, bộ máy tính i5 13400F + RTX 4060 sẵn sàng đồng hành cùng bạn trong 3 - 5 năm tới mà không lo lỗi thời. Tại Showroom ZComputer, bộ máy được lắp ráp cẩn thận, đi dây thẩm mỹ và hỗ trợ bảo hành 36 tháng 1 đổi 1 tận tâm.</p>\n    ",
    "tags": [
      "Build PC",
      "RTX 4060",
      "Intel i5",
      "PC Gaming"
    ],
    "views": 980,
    "isPublished": true,
    "authorName": "Kỹ Thuật ZCOMPUTER"
  },
  {
    "title": "So Sánh RTX 4060 vs RTX 3060 12GB: Đâu Là Lựa Chọn Kinh Tế Tối Ưu?",
    "slug": "so-sanh-rtx-4060-vs-rtx-3060-12gb-nen-chon-card-nao",
    "category": "Đánh giá sản phẩm",
    "thumbnail": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
    "summary": "So sánh chi tiết sức mạnh kiến trúc Ada Lovelace mới nhất trên RTX 4060 với lượng VRAM 12GB dồi dào của RTX 3060 trong các tác vụ gaming đồ họa và render 3D.",
    "content": "\n      <h2>1. Đặt vấn đề: Cuộc đối đầu giữa thế hệ mới và lượng VRAM khủng</h2>\n      <p>Khi xây dựng dàn PC gaming tầm giá dưới 25 triệu đồng, rất nhiều bạn phân vân giữa việc chọn chiếc card đồ họa thế hệ mới <strong>NVIDIA GeForce RTX 4060 8GB</strong> hay chiếc card tiền nhiệm <strong>GeForce RTX 3060 12GB</strong> với lượng bộ nhớ VRAM dồi dào hơn. Hãy cùng ZComputer phân tích chi tiết từng khía cạnh kỹ thuật để tìm ra câu trả lời xác đáng nhất!</p>\n\n      <h2>2. Bảng so sánh thông số kỹ thuật chi tiết</h2>\n      <table style=\"width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #e2e8f0;\">\n        <thead>\n          <tr style=\"background-color: #f8fafc; text-align: left;\">\n            <th style=\"padding: 12px; border: 1px solid #e2e8f0;\">Thông Số</th>\n            <th style=\"padding: 12px; border: 1px solid #e2e8f0;\">NVIDIA GeForce RTX 3060</th>\n            <th style=\"padding: 12px; border: 1px solid #e2e8f0;\">NVIDIA GeForce RTX 4060</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">Kiến trúc GPU</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">Ampere (8nm Samsung)</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #dc2626;\">Ada Lovelace (4nm TSMC)</td>\n          </tr>\n          <tr>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">Số nhân CUDA</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">3584 nhân</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">3072 nhân</td>\n          </tr>\n          <tr>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">Dung lượng VRAM</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #16a34a;\">12GB GDDR6 (192-bit)</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">8GB GDDR6 (128-bit)</td>\n          </tr>\n          <tr>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">Bộ nhớ đệm L2 Cache</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">3 MB</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #dc2626;\">24 MB (Gấp 8 lần)</td>\n          </tr>\n          <tr>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">Công nghệ DLSS</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">DLSS 2 (Super Resolution)</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #dc2626;\">DLSS 3 (Frame Generation)</td>\n          </tr>\n          <tr>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">Công suất tiêu thụ (TDP)</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0;\">170 Watts</td>\n            <td style=\"padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #16a34a;\">115 Watts (Siêu mát)</td>\n          </tr>\n        </tbody>\n      </table>\n\n      <h2>3. So sánh hiệu năng thực tế theo từng nhu cầu sử dụng</h2>\n\n      <h3>1. Nhu cầu Chơi Game (Gaming)</h3>\n      <p>Trong hầu hết các tựa game Esport và game AAA hiện đại ở độ phân giải 1080p và 2K, <strong>RTX 4060 vượt trội hơn RTX 3060 khoảng 18% - 25% về FPS thuần (Rasterization)</strong>. Nhờ bộ nhớ đệm L2 Cache lên tới 24MB, RTX 4060 giảm đáng kể lượng truy xuất bộ nhớ ngoài, giúp khung hình mượt mà và ổn định hơn.</p>\n      <p>Đặc biệt với công nghệ <em>DLSS 3 Frame Generation</em>, AI trên RTX 4060 có khả năng tự động chèn thêm khung hình nhân tạo, giúp đẩy FPS trong Cyberpunk 2077 hay Black Myth: Wukong từ 45 FPS lên hơn 90 FPS – điều mà RTX 3060 hoàn toàn không thể làm được.</p>\n\n      <h3>2. Nhu cầu Đồ họa, Render 3D & Dựng phim</h3>\n      <p>Khi làm việc với các phần mềm đồ họa như Adobe Premiere Pro, After Effects, Photoshop hay dựng hình 3D trong Blender, nhân RT Core thế hệ 3 và Tensor Core thế hệ 4 trên RTX 4060 giúp tốc độ render diễn ra nhanh hơn rõ rệt.</p>\n      <p>Tuy nhiên, nếu bạn thường xuyên làm các dự án dựng phim 4K đa layer dung lượng lớn hoặc render cảnh 3D siêu phức tạp vượt quá 8GB bộ nhớ thì lượng VRAM 12GB trên RTX 3060 sẽ giúp tránh hiện tượng tràn bộ nhớ (Out of Memory).</p>\n\n      <h3>3. Nhu cầu Nghiên cứu AI / Machine Learning</h3>\n      <p>Đối với các lập trình viên làm việc với mô hình ngôn ngữ lớn (LLM) hoặc vẽ ảnh AI bằng Stable Diffusion, 12GB VRAM của RTX 3060 cho phép tải các mô hình (Checkpoints/LoRA) kích thước lớn mà không bị nghẽn.</p>\n\n      <h2>4. Kết luận: Bạn nên chọn chiếc card nào?</h2>\n      <p><strong>Nên chọn RTX 4060 nếu:</strong> Nhu cầu chính của bạn là chơi game giải trí, livestream, làm đồ họa vừa và nhỏ. Bạn muốn một chiếc card mát mẻ, tiết kiệm điện năng và sở hữu công nghệ AI Frame Gen mới nhất trong 3-5 năm tới.</p>\n      <p><strong>Nên chọn RTX 3060 12GB nếu:</strong> Bạn là dân thiết kế 3D chuyên sâu, dựng video 4K nặng hoặc làm việc với AI cần dung lượng VRAM lớn trong mức ngân sách tiết kiệm.</p>\n    ",
    "tags": [
      "So sánh VGA",
      "RTX 4060",
      "RTX 3060",
      "Card màn hình"
    ],
    "views": 1520,
    "isPublished": true,
    "authorName": "ZCOMPUTER Reviewer"
  },
  {
    "title": "Kinh Nghiệm Chọn Mua Laptop Cũ Like New Chuẩn Zin Không Lo Bị Luộc Đồ",
    "slug": "kinh-nghiem-chon-mua-laptop-cu-like-new-nguyen-zin-khong-lo-bi-luoc-do",
    "category": "Thủ thuật",
    "thumbnail": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    "summary": "Các bước kiểm tra ngoại hình, màn hình điểm chết, bàn phím, ổ cứng CrystalDiskInfo, dung lượng pin BatteryReport và bo mạch giúp bạn an tâm tuyệt đối khi mua laptop cũ.",
    "content": "\n      <h2>1. Tại sao laptop cũ Like New 99% lại được ưa chuộng?</h2>\n      <p>Mua laptop cũ đã qua sử dụng là giải pháp tài chính thông minh giúp bạn tiết kiệm từ 30% đến 50% chi phí so với việc mua một chiếc máy mới tinh cùng cấu hình. Bạn có thể dễ dàng sở hữu những dòng máy doanh nhân cao cấp như Dell XPS, ThinkPad X1 Carbon hay MacBook Pro với mức giá vô cùng dễ thở.</p>\n      <p>Tuy nhiên, thị trường máy tính cũ cũng tiềm ẩn nhiều rủi ro về máy dựng, máy đã qua sửa chữa mainboard hoặc bị thay thế linh kiện kém chất lượng. Dưới đây là bộ bí kíp 7 bước kiểm tra từ chuyên gia kỹ thuật ZComputer giúp bạn hoàn toàn an tâm.</p>\n\n      <h2>2. Quy trình 7 bước test laptop cũ chuẩn xác nhất</h2>\n\n      <h3>Bước 1: Kiểm tra ngoại hình, khung vỏ và bản lề</h3>\n      <p>Quan sát kỹ 4 góc cạnh của thân máy xem có dấu hiệu va đập, cấn móp nghiêm trọng không. Dùng tay mở và gập màn hình nhiều lần ở các góc độ từ 30° đến 150° để cảm nhận độ đầm, chắc của khớp bản lề, đảm bảo không có tiếng kêu cót két hay hiện tượng lỏng lẻo.</p>\n\n      <h3>Bước 2: Kiểm tra màn hình và rà soát điểm chết (Dead Pixels)</h3>\n      <p>Màn hình là một trong những linh kiện đắt đỏ nhất trên laptop. Hãy truy cập trang web test màn hình online (như <em>myscreenchecker.com</em>) và chuyển lần lượt qua các phông nền đơn sắc: Đỏ, Xanh lá, Xanh dương, Trắng, Đen.</p>\n      <ul>\n        <li>Trên nền Đen: Kiểm tra hiện tượng hở sáng quanh viền (Backlight Bleed).</li>\n        <li>Trên nền Trắng: Kiểm tra đốm ố, phản quang hoặc sọc màn hình.</li>\n        <li>Trên các nền màu: Rà soát xem có chấm đen li ti (điểm chết không phát sáng) hay chấm sáng bất thường nào không.</li>\n      </ul>\n\n      <h3>Bước 3: Kiểm tra toàn diện bàn phím và Touchpad</h3>\n      <p>Mở trang <em>keyboardtester.com</em> và gõ lần lượt toàn bộ phím trên bàn phím để chắc chắn không có phím nào bị liệt hoặc kẹt phím. Rê chuột trên bàn di cảm ứng Touchpad, thử thao tác cuộn 2 ngón tay, phóng to thu nhỏ và nhấn chuột trái / phải để kiểm tra độ nhạy.</p>\n\n      <h3>Bước 4: Kiểm tra tình trạng sức khỏe ổ cứng SSD (CrystalDiskInfo)</h3>\n      <p>Tải phần mềm miễn phí <strong>CrystalDiskInfo</strong>. Phần mềm sẽ hiển thị rõ ràng:</p>\n      <ul>\n        <li>Tình trạng sức khỏe ổ cứng (Nên đạt <strong>Good từ 90% - 100%</strong>).</li>\n        <li>Tổng số giờ hoạt động (Power On Hours) và số lần bật máy.</li>\n        <li>Tổng dung lượng đọc / ghi dữ liệu (Total Host Reads/Writes).</li>\n      </ul>\n\n      <h3>Bước 5: Kiểm tra độ chai pin bằng Battery Report của Windows</h3>\n      <p>Không cần cài thêm phần mềm, bạn chỉ cần mở <code>CMD (Command Prompt)</code> với quyền Administrator và gõ lệnh:</p>\n      <pre style=\"background: #1e293b; color: #f8fafc; padding: 12px; border-radius: 8px; font-family: monospace;\">powercfg /batteryreport</pre>\n      <p>Mở file <code>battery-report.html</code> vừa được tạo, so sánh 2 thông số: <strong>Design Capacity (Dung lượng pin thiết kế)</strong> và <strong>Full Charge Capacity (Dung lượng thực tế nạp được)</strong>. Độ chai pin dưới 15% là mức lý tưởng.</p>\n\n      <h3>Bước 6: Chạy thử nghiệm Full Load (Stress Test nhiệt độ)</h3>\n      <p>Sử dụng phần mềm <strong>FurMark</strong> (test card đồ họa) và <strong>Cinebench R23</strong> (test CPU) trong vòng 10 đến 15 phút. Nếu máy không bị sập nguồn, không bị màn hình xanh (BSOD) và quạt tản nhiệt quay êm thì hệ thống bo mạch chủ hoàn toàn ổn định.</p>\n\n      <h3>Bước 7: Kiểm tra camera, mic, loa và các cổng kết nối ngoại vi</h3>\n      <p>Cắm thử USB vào tất cả các cổng, cắm dây mạng LAN, cáp HDMI xuất hình ra màn phụ và mở một bài nhạc yêu thích để kiểm tra âm lượng loa có bị rè không.</p>\n\n      <h2>3. Cam kết kiểm định chất lượng tại ZComputer</h2>\n      <p>Khi mua sắm tại ZComputer, bạn không cần phải lo lắng về những rủi ro trên. 100% sản phẩm tại hệ thống đều trải qua quy trình kiểm định 24 bước gắt gao, đi kèm chính sách bảo hành vàng 3 - 12 tháng 1 đổi 1 và hỗ trợ dùng thử miễn phí 7 ngày đầu!</p>\n    ",
    "tags": [
      "Laptop Cũ",
      "Kinh nghiệm mua máy",
      "Thủ thuật laptop"
    ],
    "views": 2310,
    "isPublished": true,
    "authorName": "Chuyên Gia Kỹ Thuật"
  },
  {
    "title": "Đại Tiệc Tri Ân Khách Hàng - Giảm Giá Sốc Đến 50% Toàn Bộ Linh Kiện & Laptop",
    "slug": "dai-tiec-tri-an-khuyen-mai-thang-8-giam-gia-soc-den-50",
    "category": "Khuyến mãi",
    "thumbnail": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80",
    "summary": "Chương trình siêu sale lớn nhất quý 3 tại ZComputer với hàng loạt ưu đãi hấp dẫn: tặng voucher 500k, miễn phí vệ sinh laptop trọn đời và bảo hành 1 đổi 1 nhanh chóng.",
    "content": "\n      <h2>1. Lời tri ân gửi tới hàng ngàn khách hàng đã đồng hành cùng ZComputer</h2>\n      <p>Trải qua chặng đường phát triển và xây dựng uy tín trong cộng đồng công nghệ, ZComputer xin gửi lời cảm ơn chân thành và sâu sắc nhất tới quý khách hàng, các bạn học sinh, sinh viên và anh em game thủ đã luôn tin tưởng, lựa chọn chúng tôi là điểm đến tin cậy khi mua sắm PC, Laptop và linh kiện máy tính.</p>\n      <p>Để đáp lại tình cảm to lớn đó, ZComputer chính thức phát động chương trình siêu khuyến mãi <strong>\"ĐẠI TIỆC TRI ÂN KHÁCH HÀNG\"</strong> với hàng trăm deal giảm giá sập sàn cùng nhiều phần quà giá trị.</p>\n\n      <h2>2. Chi tiết các chương trình khuyến mãi đặc biệt</h2>\n\n      <h3>1. Giảm sốc đến 50% Gaming Gear khi mua kèm PC / Laptop</h3>\n      <ul>\n        <li>Chuột Gaming không dây siêu nhẹ Logitech G Pro X Superlight 2 giảm ngay 30%.</li>\n        <li>Bàn phím cơ Custom nhôm CNC Keychron Q1 Pro giảm giá cực sốc.</li>\n        <li>Tai nghe Gaming âm thanh vòm 7.1 chỉ từ 390.000đ.</li>\n      </ul>\n\n      <h3>2. Tặng Voucher 500.000đ trừ trực tiếp vào hóa đơn</h3>\n      <p>Áp dụng cho tất cả khách hàng đặt lịch hẹn trước qua Hotline hoặc mua hàng trực tiếp trên Website ZComputer cho các đơn hàng Laptop Gaming và PC đồ họa chuyên nghiệp.</p>\n\n      <h3>3. Dịch vụ chăm sóc máy tính miễn phí trọn đời (Gói Z-Care)</h3>\n      <p>Tất cả khách hàng mua máy tại ZComputer đều được tặng kèm thẻ thành viên <strong>Z-Care VIP</strong>:</p>\n      <ul>\n        <li>Miễn phí vệ sinh máy tính định kỳ trọn đời sản phẩm.</li>\n        <li>Miễn phí tra keo tản nhiệt cao cấp Arctic MX-4 / MX-6 giúp máy luôn mát mẻ.</li>\n        <li>Cài đặt lại hệ điều hành Windows bản quyền, phần mềm văn phòng, đồ họa hoàn toàn miễn phí.</li>\n        <li>Hỗ trợ nâng cấp linh kiện (RAM, SSD) với giá gốc không tính công thợ.</li>\n      </ul>\n\n      <h2>3. Thời gian và hình thức áp dụng</h2>\n      <p>Chương trình áp dụng từ ngày <strong>01 đến hết ngày 31 hàng tháng</strong> tại toàn bộ hệ thống Showroom ZComputer và hệ thống bán hàng Online giao hàng hỏa tốc toàn quốc. Hãy nhanh chân ghé ngay Showroom để không bỏ lỡ những ưu đãi hấp dẫn nhất!</p>\n    ",
    "tags": [
      "Khuyến mãi",
      "Siêu sale",
      "Ưu đãi ZComputer"
    ],
    "views": 3290,
    "isPublished": true,
    "authorName": "ZCOMPUTER Marketing"
  },
  {
    "title": "Đánh Giá Màn Hình Gaming Asus TUF VG279Q1A: 165Hz IPS Giá Cực Rẻ",
    "slug": "danh-gia-man-hinh-gaming-asus-tuf-vg279q1a-165hz-ips-gia-re",
    "category": "Đánh giá sản phẩm",
    "thumbnail": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    "summary": "Màn hình 27 inch Full HD tấm nền IPS 165Hz, phản hồi 1ms Extreme Low Motion Blur với mức giá chỉ hơn 4 triệu đồng xứng đáng là lựa chọn màn hình quốc dân.",
    "content": "\n      <h2>1. Giới thiệu tổng quan về ASUS TUF Gaming VG279Q1A</h2>\n      <p>Trong phân khúc màn hình gaming phổ thông tầm giá từ 4 đến 5 triệu đồng, <strong>ASUS TUF Gaming VG279Q1A</strong> luôn nằm trong danh sách bán chạy nhất tại ZComputer. Chiếc màn hình này hội tụ đầy đủ những yếu tố mà game thủ Esport mong muốn: Kích thước lớn 27 inch, tấm nền IPS sắc nét góc nhìn rộng, tần số quét 165Hz siêu mượt và thời gian phản hồi 1ms MPRT.</p>\n\n      <h2>2. Thiết kế đậm chất chiến binh TUF Gaming</h2>\n      <p>ASUS TUF VG279Q1A sở hữu ngôn ngữ thiết kế lấy cảm hứng từ máy bay chiến đấu tàng hình. Mặt sau màn hình được vát cạnh hình cánh chim cùng các khe thoát nhiệt thông minh. Viền màn hình 3 cạnh siêu mỏng (Ultra-slim bezel) mang lại trải nghiệm thị giác đắm chìm và cực kỳ lý tưởng khi ghép nối đa màn hình.</p>\n      <p>Chân đế chữ V kim loại nguyên khối vững chãi, chống rung lắc hiệu quả khi bạn thao tác chuột mạnh trong các pha combat gay cấn.</p>\n\n      <h2>3. Đánh giá chất lượng hiển thị và công nghệ chơi game</h2>\n\n      <h3>1. Tấm nền Fast IPS và Tần số quét 165Hz</h3>\n      <p>Nhờ sử dụng tấm nền IPS cao cấp, VG279Q1A đem lại góc nhìn rộng lên tới 178/178 độ mà không bị biến đổi màu sắc. Tần số quét được ép xung lên tới 165Hz (so với 144Hz tiêu chuẩn) giúp từng chuyển động của nhân vật trong game bắn súng CS2, Valorant hay Apex Legends trở nên mượt mà, triệt tiêu hoàn toàn hiện tượng xé hình (tearing).</p>\n\n      <h3>2. Công nghệ Extreme Low Motion Blur (ELMB) độc quyền</h3>\n      <p>Công nghệ ELMB của ASUS giúp giảm thiểu tối đa hiện tượng bóng mờ (ghosting) khi các vật thể di chuyển ở tốc độ cao, giữ cho hình ảnh luôn sắc nét từng chi tiết.</p>\n\n      <h3>3. Hỗ trợ AMD FreeSync Premium và Shadow Boost</h3>\n      <p>Công nghệ làm sáng vùng tối <strong>Shadow Boost</strong> tự động tăng cường độ sáng ở các góc khuất trong bản đồ game mà không làm cháy sáng các vùng sáng khác, giúp bạn phát hiện kẻ địch đang ẩn nấp dễ dàng hơn.</p>\n\n      <h2>4. Cổng kết nối đa dạng</h2>\n      <p>Màn hình trang bị 1 cổng DisplayPort 1.2, 2 cổng HDMI 1.4 và cổng âm thanh 3.5mm cho phép bạn kết nối cùng lúc với cả PC, laptop và máy chơi game Console (PS5, Xbox, Nintendo Switch).</p>\n\n      <h2>5. Tổng kết: Có nên mua ASUS TUF VG279Q1A?</h2>\n      <p>Với mức giá chỉ hơn 4 triệu đồng tại ZComputer cùng chế độ bảo hành 36 tháng chính hãng, ASUS TUF VG279Q1A xứng đáng là mẫu màn hình gaming quốc dân đáng đầu tư nhất hiện nay cho mọi góc máy chơi game và làm việc.</p>\n    ",
    "tags": [
      "Màn hình máy tính",
      "Asus TUF",
      "Màn hình Gaming",
      "165Hz"
    ],
    "views": 1120,
    "isPublished": true,
    "authorName": "ZCOMPUTER Reviewer"
  }
];

export const PRODUCTS_DATA = [
  {
    "name": "Màn hình Gaming ASUS ROG Swift OLED PG27AQDM | 27 inch 2K QHD, 240Hz, 0.03ms, 99% DCI-P3, HDR10",
    "slug": "man-hinh-gaming-asus-rog-swift-oled-pg27aqdm-27-inch-240hz",
    "brand": "ASUS",
    "categoryName": "Màn hình máy tính",
    "categorySlug": "man-hinh",
    "price": 24900000,
    "originalPrice": 28900000,
    "discountPercent": 14,
    "thumbnail": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80"
    ],
    "warranty": "Bảo hành 36 Tháng chính hãng ASUS",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": true,
    "views": 890,
    "ratings": {
      "average": 5,
      "count": 54
    }
  },
  {
    "name": "Màn hình Gaming Samsung Odyssey G5 G50D | 27 inch 2K QHD, 180Hz, Fast IPS 1ms, HDR10",
    "slug": "man-hinh-gaming-samsung-odyssey-g5-g50d-27-inch-2k-180hz",
    "brand": "SAMSUNG",
    "categoryName": "Màn hình máy tính",
    "categorySlug": "man-hinh",
    "price": 5690000,
    "originalPrice": 6490000,
    "discountPercent": 12,
    "thumbnail": "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80"
    ],
    "warranty": "Bảo hành 24 Tháng chính hãng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": true,
    "views": 640,
    "ratings": {
      "average": 5,
      "count": 41
    }
  },
  {
    "name": "CPU Intel Core i9-14900K (24 nhân 32 luồng, up to 6.0GHz, 36MB Cache, LGA 1700)",
    "slug": "cpu-intel-core-i9-14900k",
    "brand": "Intel",
    "categoryName": "CPU - Bộ vi xử lý",
    "categorySlug": "cpu-bo-vi-xu-ly",
    "price": 14500000,
    "originalPrice": 16200000,
    "discountPercent": 10,
    "thumbnail": "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&auto=format&fit=crop&q=80"
    ],
    "warranty": "Bảo hành 36 Tháng chính hãng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": false,
    "views": 510,
    "ratings": {
      "average": 5,
      "count": 27
    }
  },
  {
    "name": "CPU AMD Ryzen 7 7800X3D (8 nhân 16 luồng, 3D V-Cache 96MB, up to 5.0GHz, Socket AM5)",
    "slug": "cpu-amd-ryzen-7-7800x3d",
    "brand": "AMD",
    "categoryName": "CPU - Bộ vi xử lý",
    "categorySlug": "cpu-bo-vi-xu-ly",
    "price": 9900000,
    "originalPrice": 11000000,
    "discountPercent": 10,
    "thumbnail": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80"
    ],
    "warranty": "Bảo hành 36 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": true,
    "views": 780,
    "ratings": {
      "average": 5,
      "count": 62
    }
  },
  {
    "name": "Card màn hình ASUS ROG Strix GeForce RTX 4090 24GB GDDR6X OC Edition",
    "slug": "card-man-hinh-asus-rog-strix-geforce-rtx-4090-24gb-oc",
    "brand": "ASUS",
    "categoryName": "VGA - Card màn hình",
    "categorySlug": "vga-card-man-hinh",
    "price": 54900000,
    "originalPrice": 59900000,
    "discountPercent": 8,
    "thumbnail": "https://dlcdnwebimgs.asus.com/gain/9EFB3AE5-86A5-4299-8D75-9AC4FDF2FFC9/w800",
    "images": [
      "https://dlcdnwebimgs.asus.com/gain/9EFB3AE5-86A5-4299-8D75-9AC4FDF2FFC9/w800"
    ],
    "warranty": "Bảo hành 36 Tháng chính hãng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": false,
    "views": 1420,
    "ratings": {
      "average": 5,
      "count": 58
    }
  },
  {
    "name": "Card màn hình MSI GeForce RTX 4070 SUPER 12G VENTUS 2X OC GDDR6X",
    "slug": "card-man-hinh-msi-geforce-rtx-4070-super-12g-ventus",
    "brand": "MSI",
    "categoryName": "VGA - Card màn hình",
    "categorySlug": "vga-card-man-hinh",
    "price": 17500000,
    "originalPrice": 19500000,
    "discountPercent": 10,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786961030608-888964697.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786961030608-888964697.webp"
    ],
    "warranty": "Bảo hành 36 Tháng chính hãng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": true,
    "views": 890,
    "ratings": {
      "average": 5,
      "count": 42
    }
  },
  {
    "name": "RAM Desktop Kingston Fury Beast RGB 32GB (2x16GB) DDR5 6000MHz CL36",
    "slug": "ram-kingston-fury-beast-rgb-32gb-2x16gb-ddr5-6000mhz",
    "brand": "Kingston",
    "categoryName": "RAM - Bộ nhớ trong",
    "categorySlug": "ram-bo-nho-trong",
    "price": 3150000,
    "originalPrice": 3500000,
    "discountPercent": 10,
    "thumbnail": "https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&auto=format&fit=crop&q=80"
    ],
    "warranty": "Bảo hành 36 Tháng chính hãng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 420,
    "ratings": {
      "average": 5,
      "count": 30
    }
  },
  {
    "name": "Ổ cứng SSD Samsung 990 PRO 1TB PCIe Gen 4.0 x4 NVMe M.2 (Đọc 7450MB/s - Ghi 6900MB/s)",
    "slug": "ssd-samsung-990-pro-1tb-pcie-gen-4-nvme",
    "brand": "Samsung",
    "categoryName": "Ổ cứng HDD - SSD",
    "categorySlug": "o-cung-hdd-ssd",
    "price": 2890000,
    "originalPrice": 3290000,
    "discountPercent": 12,
    "thumbnail": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80"
    ],
    "warranty": "Bảo hành 60 Tháng (5 năm) chính hãng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": false,
    "views": 620,
    "ratings": {
      "average": 5,
      "count": 48
    }
  },
  {
    "name": "Chuột không dây Gaming Logitech G Pro X Superlight 2 Lightspeed (Siêu nhẹ 60g, Hero 2 32.000 DPI)",
    "slug": "chuot-gaming-logitech-g-pro-x-superlight-2-lightspeed",
    "brand": "Logitech",
    "categoryName": "Chuột",
    "categorySlug": "chuot",
    "price": 3390000,
    "originalPrice": 3890000,
    "discountPercent": 13,
    "thumbnail": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80"
    ],
    "warranty": "Bảo hành 24 Tháng chính hãng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": true,
    "views": 1100,
    "ratings": {
      "average": 5,
      "count": 86
    }
  },
  {
    "name": "Bàn phím cơ không dây Akko 5075B Plus Dragon Ball Super Goku (Gasket Mount, Hotswap, 3 Mode Kết Nối, LED RGB)",
    "slug": "ban-phim-co-akko-5075b-plus-dragon-ball-super-goku",
    "brand": "Akko",
    "categoryName": "Bàn phím",
    "categorySlug": "ban-phim",
    "price": 2290000,
    "originalPrice": 2690000,
    "discountPercent": 15,
    "thumbnail": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80"
    ],
    "warranty": "Bảo hành 12 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": false,
    "views": 690,
    "ratings": {
      "average": 5,
      "count": 45
    }
  },
  {
    "name": "LAPTOP LENOVO SLIM 7 PROX 14ARH7 RYZEN 9 6900HS/32GB/SSD 512GB/RTX 3050 4GB/LCD 14'' 3K 120HZ TOUCH",
    "slug": "laptop-lenovo-slim-7-prox-14arh7-ryzen-9-6900hs32gbssd-512gbrtx-3050-4gblcd-14-3k-120hz-touch",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 20900000,
    "originalPrice": 21900000,
    "discountPrice": 20900000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786964803138-701647732.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786964803138-701647732.webp",
      "https://zcomputer.vn/uploads/image-1786964799425-698147222.webp",
      "https://zcomputer.vn/uploads/image-1786964802394-619014728.webp",
      "https://zcomputer.vn/uploads/image-1786964800993-265576684.webp",
      "https://zcomputer.vn/uploads/image-1786964801605-921294195.webp",
      "https://zcomputer.vn/uploads/image-1786964800298-951088120.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": true,
    "views": 102,
    "ratings": {
      "average": 5,
      "count": 16
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M TUF WIFI/I5 14600K/RAM 32GB/SSD 1TB/VGA RTX 3060 12GB/750W/ AIO 360 LCD/CASE BỂ CÁ MIK KÈM 4 FAN",
    "slug": "bo-may-tinh-b760m-tuf-wifii5-14600kram-32gbssd-1tbvga-rtx-3060-12gb750w-aio-360-lcdcase-be-ca-mik-kem-4-fan",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 31500000,
    "originalPrice": 32500000,
    "discountPrice": 31500000,
    "discountPercent": 3,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786963920224-267366888.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786963920224-267366888.webp",
      "https://zcomputer.vn/uploads/image-1786963920885-128360068.webp",
      "https://zcomputer.vn/uploads/image-1786963919499-691555191.webp",
      "https://zcomputer.vn/uploads/image-1786963916935-40626751.webp",
      "https://zcomputer.vn/uploads/image-1786963917764-981949076.webp",
      "https://zcomputer.vn/uploads/image-1786963918559-734001244.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": false,
    "views": 45,
    "ratings": {
      "average": 5,
      "count": 14
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M MSI MAG/I5 14600K/16GB/SSD 1TB/VGA RTX 3070TI 8GB GIGABYTE/NGUỒN 750W XIGMATECK/CASE NZXT+ TẢN KHÍ",
    "slug": "bo-may-tinh-b760m-msi-magi5-14600k16gbssd-1tbvga-rtx-3070ti-8gb-gigabytenguon-750w-xigmateckcase-nzxt-tan-khi",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 23200000,
    "originalPrice": 24200000,
    "discountPrice": 23200000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786961033039-703478160.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786961033039-703478160.webp",
      "https://zcomputer.vn/uploads/image-1786961030608-888964697.webp",
      "https://zcomputer.vn/uploads/image-1786961033629-384514572.webp",
      "https://zcomputer.vn/uploads/image-1786961032218-146280653.webp",
      "https://zcomputer.vn/uploads/image-1786961029931-749607656.webp",
      "https://zcomputer.vn/uploads/image-1786961031477-789359712.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": false,
    "views": 64,
    "ratings": {
      "average": 5,
      "count": 16
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M-P MSI/ I5 12400F/ 16GB RAM/ 500GB SSD/VGA RX 6600 8GB/ NGUỒN 650W/ CASE LED GAMING KÈM TẢN KHÍ RGB",
    "slug": "bo-may-tinh-b760m-p-msi-i5-12400f-16gb-ram-500gb-ssdvga-rx-6600-8gb-nguon-650w-case-led-gaming-kem-tan-khi-rgb",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 14500000,
    "originalPrice": 15500000,
    "discountPrice": 14500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786960128692-909868080.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786960128692-909868080.webp",
      "https://zcomputer.vn/uploads/image-1786960125465-182658230.webp",
      "https://zcomputer.vn/uploads/image-1786960124545-937832123.webp",
      "https://zcomputer.vn/uploads/image-1786960127200-356029887.webp",
      "https://zcomputer.vn/uploads/image-1786960127892-322068755.webp",
      "https://zcomputer.vn/uploads/image-1786960126458-303852482.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": false,
    "views": 130,
    "ratings": {
      "average": 5,
      "count": 27
    }
  },
  {
    "name": "BỘ MÁY TÍNH H610M-K ASUS/I5 12400F/RAM 16GB/SSD 512GB/VGA RTX 2060SUPER 8GB GIGABYTE/NGUỒN 550W/CASE LED+ TẢN NHIỆT KHÍ",
    "slug": "bo-may-tinh-h610m-k-asusi5-12400fram-16gbssd-512gbvga-rtx-2060super-8gb-gigabytenguon-550wcase-led-tan-nhiet-khi",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 13900000,
    "originalPrice": 14900000,
    "discountPrice": 13900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786959115438-669054953.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786959115438-669054953.webp",
      "https://zcomputer.vn/uploads/image-1786959118056-288672991.webp",
      "https://zcomputer.vn/uploads/image-1786959116328-104531030.webp",
      "https://zcomputer.vn/uploads/image-1786959114637-32599321.webp",
      "https://zcomputer.vn/uploads/image-1786959118919-413900193.webp",
      "https://zcomputer.vn/uploads/image-1786959117241-387174407.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": true,
    "views": 113,
    "ratings": {
      "average": 5,
      "count": 26
    }
  },
  {
    "name": "BỘ MÁY TÍNH B660M TUF/ I5 13400F/ RAM 16GB/ SSD 500GB/ RTX 3060 12GB/ NGUỒN 750W/ CASE AC-01/ TẢN AIO 360",
    "slug": "bo-may-tinh-b660m-tuf-i5-13400f-ram-16gb-ssd-500gb-rtx-3060-12gb-nguon-750w-case-ac-01-tan-aio-360",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 18500000,
    "originalPrice": 19500000,
    "discountPrice": 18500000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786958194452-233412527.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786958194452-233412527.webp",
      "https://zcomputer.vn/uploads/image-1786958192834-617064687.webp",
      "https://zcomputer.vn/uploads/image-1786958193570-191761444.webp",
      "https://zcomputer.vn/uploads/image-1786958192058-124986638.webp",
      "https://zcomputer.vn/uploads/image-1786958191206-290805388.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": false,
    "views": 117,
    "ratings": {
      "average": 5,
      "count": 21
    }
  },
  {
    "name": "BỘ MÁY TÍNH Z790 MSI WIFI/ I7 14700KF/ 32GB D5 5600/SSD 1TB BIWIN GEN 4/VGA RTX 5060TI 16GB ASUS/NGUỒN 850W SUPERFLOWER/CASE LIANLI O11 VISION + TẢN NƯỚC RAD 360 - BH 4/2029",
    "slug": "bo-may-tinh-z790-msi-wifi-i7-14700kf-32gb-d5-5600ssd-1tb-biwin-gen-4vga-rtx-5060ti-16gb-asusnguon-850w-superflowercase-lianli-o11-vision-tan-nuoc-rad-360-bh-42029",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 42500000,
    "originalPrice": 43990000,
    "discountPrice": 42500000,
    "discountPercent": 3,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786957082511-671135740.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786957082511-671135740.webp",
      "https://zcomputer.vn/uploads/image-1786957080468-392100192.webp",
      "https://zcomputer.vn/uploads/image-1786957083564-528166298.webp",
      "https://zcomputer.vn/uploads/image-1786957081314-152117166.webp",
      "https://zcomputer.vn/uploads/image-1786957079234-404013717.webp",
      "https://zcomputer.vn/uploads/image-1786957084533-504548131.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": false,
    "views": 56,
    "ratings": {
      "average": 5,
      "count": 34
    }
  },
  {
    "name": "LAPTOP ASUS TUF FX507VI-LP077W I7 13620H/16GB/SSD 1TB/VGA RTX 4070 8GDDR6/LCD 15.6INCH 144HZ",
    "slug": "laptop-asus-tuf-fx507vi-lp077w-i7-13620h16gbssd-1tbvga-rtx-4070-8gddr6lcd-156inch-144hz",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 26500000,
    "originalPrice": 27500000,
    "discountPrice": 26500000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786791474830-314439154.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786791474830-314439154.webp",
      "https://zcomputer.vn/uploads/image-1786791481379-836450183.webp",
      "https://zcomputer.vn/uploads/image-1786791483848-200411153.webp",
      "https://zcomputer.vn/uploads/image-1786791487485-103569730.webp",
      "https://zcomputer.vn/uploads/image-1786791485714-587347931.webp",
      "https://zcomputer.vn/uploads/image-1786791477953-719406401.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": false,
    "views": 76,
    "ratings": {
      "average": 5,
      "count": 24
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M/I5 14400F/RAM 16GB/SSD 500GB/VGA RTX 5050 8GB/650W/TẢN KHÍ/CASE",
    "slug": "bo-may-tinh-b760mi5-14400fram-16gbssd-500gbvga-rtx-5050-8gb650wtan-khicase",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 18490000,
    "originalPrice": 19490000,
    "discountPrice": 18490000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786790632782-972205809.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786790632782-972205809.webp",
      "https://zcomputer.vn/uploads/image-1786790622235-207871256.webp",
      "https://zcomputer.vn/uploads/image-1786790627359-354303745.webp",
      "https://zcomputer.vn/uploads/image-1786790624724-330327112.webp",
      "https://zcomputer.vn/uploads/image-1786790630682-957489580.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": true,
    "views": 101,
    "ratings": {
      "average": 5,
      "count": 26
    }
  },
  {
    "name": "BỘ MÁY TÍNH B550M/RYZEN 5 5600X/RAM 16GB/SSD 512GB/VGA GTX 1660 SUPER 6G/550W/AIO 240/CASE BỂ CÁ KÈM 7 FAN LED",
    "slug": "bo-may-tinh-b550mryzen-5-5600xram-16gbssd-512gbvga-gtx-1660-super-6g550waio-240case-be-ca-kem-7-fan-led",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 12900000,
    "originalPrice": 13900000,
    "discountPrice": 12900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786789556741-468240197.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786789556741-468240197.webp",
      "https://zcomputer.vn/uploads/image-1786789558045-800362433.webp",
      "https://zcomputer.vn/uploads/image-1786789552141-341961628.webp",
      "https://zcomputer.vn/uploads/image-1786789550440-953434422.webp",
      "https://zcomputer.vn/uploads/image-1786789548885-893283963.webp",
      "https://zcomputer.vn/uploads/image-1786789555090-351913640.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": false,
    "views": 34,
    "ratings": {
      "average": 5,
      "count": 15
    }
  },
  {
    "name": "BỘ MÁY TÍNH B660M/I3 12100F/RAM 16GB/SSD 250GB/VGA RTX 2060 SUPER 8GB/650W/TẢN KHÍ/CASE GAMING KÈM 4 FAN LED",
    "slug": "bo-may-tinh-b660mi3-12100fram-16gbssd-250gbvga-rtx-2060-super-8gb650wtan-khicase-gaming-kem-4-fan-led",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 10900000,
    "originalPrice": 11900000,
    "discountPrice": 10900000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786789005073-680111391.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786789005073-680111391.webp",
      "https://zcomputer.vn/uploads/image-1786788992333-902883169.webp",
      "https://zcomputer.vn/uploads/image-1786788997218-91870349.webp",
      "https://zcomputer.vn/uploads/image-1786789000325-690752219.webp",
      "https://zcomputer.vn/uploads/image-1786789003330-957456985.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": false,
    "views": 47,
    "ratings": {
      "average": 5,
      "count": 20
    }
  },
  {
    "name": "LAPTOP ASUS VIVOBOOK PRO 15 K6502VJG I7 13620H/16GB/SSD 512GB/VGA RTX 3050 6GB/LCD 15.6INCH FHD OLED",
    "slug": "laptop-asus-vivobook-pro-15-k6502vjg-i7-13620h16gbssd-512gbvga-rtx-3050-6gblcd-156inch-fhd-oled",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 17500000,
    "originalPrice": 18500000,
    "discountPrice": 17500000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786788020929-687285255.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786788020929-687285255.webp",
      "https://zcomputer.vn/uploads/image-1786788022601-13408328.webp",
      "https://zcomputer.vn/uploads/image-1786788025536-962744633.webp",
      "https://zcomputer.vn/uploads/image-1786788026883-838149160.webp",
      "https://zcomputer.vn/uploads/image-1786788024277-47026346.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": false,
    "views": 62,
    "ratings": {
      "average": 5,
      "count": 22
    }
  },
  {
    "name": "LAPTOP SURFACE 3 RYZEN 5/RAM 16GB/SSD 256GB/ AMD RADEON VEGA 9/ LCD 15INCH CẢM ỨNG 2K",
    "slug": "laptop-surface-3-ryzen-5ram-16gbssd-256gb-amd-radeon-vega-9-lcd-15inch-cam-ung-2k",
    "brand": "SURFACE",
    "categoryName": "Laptop Surface",
    "categorySlug": "laptop-surface",
    "price": 8500000,
    "originalPrice": 9500000,
    "discountPrice": 8500000,
    "discountPercent": 11,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786786537387-293662226.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786786537387-293662226.webp",
      "https://zcomputer.vn/uploads/image-1786786548994-600192233.webp",
      "https://zcomputer.vn/uploads/image-1786786545317-749341202.webp",
      "https://zcomputer.vn/uploads/image-1786786542485-953919227.webp",
      "https://zcomputer.vn/uploads/image-1786786539821-912102985.webp",
      "https://zcomputer.vn/uploads/image-1786786551430-511259413.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": true,
    "views": 65,
    "ratings": {
      "average": 5,
      "count": 28
    }
  },
  {
    "name": "LAPTOP LENOVO YOGA 7 16AKP10 RYZEN AI 7 350W/16GB/SSD 512GB/RADEON 840M/LCD 16INCH WUXGA (1920 x 1200) TOUCH",
    "slug": "laptop-lenovo-yoga-7-16akp10-ryzen-ai-7-350w16gbssd-512gbradeon-840mlcd-16inch-wuxga-1920-x-1200-touch",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 16900000,
    "originalPrice": 17900000,
    "discountPrice": 16900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786786023668-82193348.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786786023668-82193348.webp",
      "https://zcomputer.vn/uploads/image-1786786043674-687378024.webp",
      "https://zcomputer.vn/uploads/image-1786786038400-682232214.webp",
      "https://zcomputer.vn/uploads/image-1786786040936-736947107.webp",
      "https://zcomputer.vn/uploads/image-1786786034882-336626532.webp",
      "https://zcomputer.vn/uploads/image-1786786032215-642466103.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": false,
    "views": 99,
    "ratings": {
      "average": 5,
      "count": 13
    }
  },
  {
    "name": "LAPTOP LENOVO YOGA 7 16AKP10 RYZEN AI 5 340W/16GB/SSD 512GB/RADEON 840M/LCD 16INCH WUXGA (1920 x 1200) TOUCH ",
    "slug": "laptop-lenovo-yoga-7-16akp10-ryzen-ai-5-340w16gbssd-512gbradeon-840mlcd-16inch-wuxga-1920-x-1200-touch",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 15900000,
    "originalPrice": 16900000,
    "discountPrice": 15900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786784959416-635410415.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786784959416-635410415.webp",
      "https://zcomputer.vn/uploads/image-1786784980194-727984539.webp",
      "https://zcomputer.vn/uploads/image-1786784971142-205157222.webp",
      "https://zcomputer.vn/uploads/image-1786784975140-544491607.webp",
      "https://zcomputer.vn/uploads/image-1786784967901-963421803.webp",
      "https://zcomputer.vn/uploads/image-1786784962835-725043108.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": false,
    "views": 72,
    "ratings": {
      "average": 5,
      "count": 32
    }
  },
  {
    "name": "MACBOOK PRO 16INCH - M1 PRO 10CPU-16GPU/ 32GB/SSD 512GB (BẠC) PIN 88%",
    "slug": "macbook-pro-16inch-m1-pro-10cpu-16gpu-32gbssd-512gb-bac-pin-88percent",
    "brand": "Apple",
    "categoryName": "Macbook",
    "categorySlug": "macbook",
    "price": 28900000,
    "originalPrice": 29900000,
    "discountPrice": 28900000,
    "discountPercent": 3,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786623741544-310136170.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786623741544-310136170.webp",
      "https://zcomputer.vn/uploads/image-1786623744579-425904019.webp",
      "https://zcomputer.vn/uploads/image-1786623750713-159669077.webp",
      "https://zcomputer.vn/uploads/image-1786623747048-677782619.webp",
      "https://zcomputer.vn/uploads/image-1786623748673-484279259.webp",
      "https://zcomputer.vn/uploads/image-1786623754164-589052770.webp",
      "https://zcomputer.vn/uploads/image-1786623752723-732490717.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": false,
    "views": 29,
    "ratings": {
      "average": 5,
      "count": 8
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD P15S GEN 2 I7 1165G7/16GB/SSD 512GB/VGA QUADRO T500 4G/LCD 15.6INCH (3840 x 2160) 4K",
    "slug": "laptop-lenovo-thinkpad-p15s-gen-2-i7-1165g716gbssd-512gbvga-quadro-t500-4glcd-156inch-3840-x-2160-4k",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 12900000,
    "originalPrice": 13900000,
    "discountPrice": 12900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786622026999-638019132.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786622026999-638019132.webp",
      "https://zcomputer.vn/uploads/image-1786622028936-512774287.webp",
      "https://zcomputer.vn/uploads/image-1786622038153-553368311.webp",
      "https://zcomputer.vn/uploads/image-1786622034218-804202857.webp",
      "https://zcomputer.vn/uploads/image-1786622031196-232692287.webp",
      "https://zcomputer.vn/uploads/image-1786622040638-836955326.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": true,
    "views": 114,
    "ratings": {
      "average": 5,
      "count": 36
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD P14S GEN 1 I7 10610U/16GB/SSD 512GB/VGA QUADRO P520 2G/ LCD 14INCH 4K UHD (3840X2160)",
    "slug": "laptop-lenovo-thinkpad-p14s-gen-1-i7-10610u16gbssd-512gbvga-quadro-p520-2g-lcd-14inch-4k-uhd-3840x2160",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 10500000,
    "originalPrice": 11500000,
    "discountPrice": 10500000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786619568240-114211806.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786619568240-114211806.webp",
      "https://zcomputer.vn/uploads/image-1786619573694-768667706.webp",
      "https://zcomputer.vn/uploads/image-1786619586494-20290411.webp",
      "https://zcomputer.vn/uploads/image-1786619589894-284755573.webp",
      "https://zcomputer.vn/uploads/image-1786619581984-879092105.webp",
      "https://zcomputer.vn/uploads/image-1786619578125-445013385.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": false,
    "views": 95,
    "ratings": {
      "average": 5,
      "count": 12
    }
  },
  {
    "name": "LAPTOP MSI STEALTH A16 AI+ A3XVGG RYZEN AI 9 365/32GB/SSD 1TB/VGA RTX 4070 8G/LCD 16INCH 2K 240HZ",
    "slug": "laptop-msi-stealth-a16-ai-a3xvgg-ryzen-ai-9-36532gbssd-1tbvga-rtx-4070-8glcd-16inch-2k-240hz",
    "brand": "MSI",
    "categoryName": "Laptop MSI",
    "categorySlug": "laptop-msi",
    "price": 34900000,
    "originalPrice": 35900000,
    "discountPrice": 34900000,
    "discountPercent": 3,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786617359618-85027520.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786617359618-85027520.webp",
      "https://zcomputer.vn/uploads/image-1786617383145-220535467.webp",
      "https://zcomputer.vn/uploads/image-1786617388110-39625597.webp",
      "https://zcomputer.vn/uploads/image-1786617376128-46340975.webp",
      "https://zcomputer.vn/uploads/image-1786617372069-616891356.webp",
      "https://zcomputer.vn/uploads/image-1786617366021-931168627.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": false,
    "views": 81,
    "ratings": {
      "average": 5,
      "count": 24
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M/I5 14400F/RAM 16GB/SSD 512GB/VGA RTX 3060 12GB/650W/AIO 240/CASE GAMING KÈM 4 FAN LED",
    "slug": "bo-may-tinh-b760mi5-14400fram-16gbssd-512gbvga-rtx-3060-12gb650waio-240case-gaming-kem-4-fan-led",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 18500000,
    "originalPrice": 19500000,
    "discountPrice": 18500000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786536578420-698625375.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786536578420-698625375.webp",
      "https://zcomputer.vn/uploads/image-1786536571980-221261877.webp",
      "https://zcomputer.vn/uploads/image-1786536576742-187609854.webp",
      "https://zcomputer.vn/uploads/image-1786536574415-273309272.webp",
      "https://zcomputer.vn/uploads/image-1786536569806-110044591.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": true,
    "isFlashSale": false,
    "views": 37,
    "ratings": {
      "average": 5,
      "count": 37
    }
  },
  {
    "name": "LAPTOP LENOVO LEGION 5 Y7000P 2025 I9 14900HX/16GB/SSD 1TB/VGA RTX 5070 8G/LCD 16INCH 2K 240HZ",
    "slug": "laptop-lenovo-legion-5-y7000p-2025-i9-14900hx16gbssd-1tbvga-rtx-5070-8glcd-16inch-2k-240hz",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 41900000,
    "originalPrice": 42900000,
    "discountPrice": 41900000,
    "discountPercent": 2,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786535634108-898516597.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786535634108-898516597.webp",
      "https://zcomputer.vn/uploads/image-1786535625161-235666193.webp",
      "https://zcomputer.vn/uploads/image-1786535618332-728394219.webp",
      "https://zcomputer.vn/uploads/image-1786535611067-86879883.webp",
      "https://zcomputer.vn/uploads/image-1786535628754-517527815.webp",
      "https://zcomputer.vn/uploads/image-1786535606830-844949245.webp",
      "https://zcomputer.vn/uploads/image-1786535614356-891167788.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 71,
    "ratings": {
      "average": 5,
      "count": 27
    }
  },
  {
    "name": "LAPTOP LENOVO LEGION R9000P ADR10 RYZEN 9 8945HX/16GB/SSD 1TB/VGA RTX 5060 8G/LCD 16INCH 2K5 240HZ",
    "slug": "laptop-lenovo-legion-r9000p-adr10-ryzen-9-8945hx16gbssd-1tbvga-rtx-5060-8glcd-16inch-2k5-240hz",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 38500000,
    "originalPrice": 39500000,
    "discountPrice": 38500000,
    "discountPercent": 3,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786452429309-624386886.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786452429309-624386886.webp",
      "https://zcomputer.vn/uploads/image-1786452434929-772511596.webp",
      "https://zcomputer.vn/uploads/image-1786452430678-342847110.webp",
      "https://zcomputer.vn/uploads/image-1786452433395-421890001.webp",
      "https://zcomputer.vn/uploads/image-1786452432135-620127653.webp",
      "https://zcomputer.vn/uploads/image-1786452436198-907137248.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 21,
    "ratings": {
      "average": 5,
      "count": 25
    }
  },
  {
    "name": "LAPTOP LENOVO LEGION Y540-17IRH I7 9750H/16GB/SSD 512GB/VGA GTX 1660TI 6GB/LCD 17.3INCH FHD 144HZ",
    "slug": "laptop-lenovo-legion-y540-17irh-i7-9750h16gbssd-512gbvga-gtx-1660ti-6gblcd-173inch-fhd-144hz",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 12500000,
    "originalPrice": 13500000,
    "discountPrice": 12500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786450001354-717701961.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786450001354-717701961.webp",
      "https://zcomputer.vn/uploads/image-1786450004331-640656168.webp",
      "https://zcomputer.vn/uploads/image-1786450005823-33342165.webp",
      "https://zcomputer.vn/uploads/image-1786450003037-57833294.webp",
      "https://zcomputer.vn/uploads/image-1786450008860-503116524.webp",
      "https://zcomputer.vn/uploads/image-1786450007435-34644422.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 42,
    "ratings": {
      "average": 5,
      "count": 17
    }
  },
  {
    "name": "LAPTOP DELL XPS 13 7390 I7 10710U/16GB/SSD 256GB/LCD 13.3INCH FHD",
    "slug": "laptop-dell-xps-13-7390-i7-10710u16gbssd-256gblcd-133inch-fhd",
    "brand": "DELL",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 9900000,
    "originalPrice": 10900000,
    "discountPrice": 9900000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786448413627-220024840.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786448413627-220024840.webp",
      "https://zcomputer.vn/uploads/image-1786448419593-314862590.webp",
      "https://zcomputer.vn/uploads/image-1786448415971-31771472.webp",
      "https://zcomputer.vn/uploads/image-1786448417220-968789716.webp",
      "https://zcomputer.vn/uploads/image-1786448418560-995187827.webp",
      "https://zcomputer.vn/uploads/image-1786448414894-533103888.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 24,
    "ratings": {
      "average": 5,
      "count": 12
    }
  },
  {
    "name": "LAPTOP HP PAVILION 15-eg1025 I7 1195G7/16GB/SSD 256GB/VGA MX 350 2G/LCD 15.6INCH FHD",
    "slug": "laptop-hp-pavilion-15-eg1025-i7-1195g716gbssd-256gbvga-mx-350-2glcd-156inch-fhd",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 8500000,
    "originalPrice": 9500000,
    "discountPrice": 8500000,
    "discountPercent": 11,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786446742747-120839447.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786446742747-120839447.webp",
      "https://zcomputer.vn/uploads/image-1786446747304-561637259.webp",
      "https://zcomputer.vn/uploads/image-1786446745527-956059597.webp",
      "https://zcomputer.vn/uploads/image-1786446744207-258057186.webp",
      "https://zcomputer.vn/uploads/image-1786446749121-835634586.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 46,
    "ratings": {
      "average": 5,
      "count": 27
    }
  },
  {
    "name": "LAPTOP HP OMEN 15-ek100 I5 10300H/16GB/SSD 512GB/VGA RTX 3060 6GB/LCD 15.6INCH 144HZ FHD",
    "slug": "laptop-hp-omen-15-ek100-i5-10300h16gbssd-512gbvga-rtx-3060-6gblcd-156inch-144hz-fhd-1786420592211",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 12900000,
    "originalPrice": 14000000,
    "discountPrice": 12900000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786420465959-183168773.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786420465959-183168773.webp",
      "https://zcomputer.vn/uploads/image-1786420461169-867421150.webp",
      "https://zcomputer.vn/uploads/image-1786420462189-803387380.webp",
      "https://zcomputer.vn/uploads/image-1786420463137-652672168.webp",
      "https://zcomputer.vn/uploads/image-1786420464092-33714622.webp",
      "https://zcomputer.vn/uploads/image-1786420464994-844880752.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 127,
    "ratings": {
      "average": 5,
      "count": 17
    }
  },
  {
    "name": "LAPTOP RAZER BLADE 15 (BASE) I7 10750H/16GB/SSD 512GB/VGA GTX 1660TI 6GB/LCD 15.6INCH FHD 120HZ",
    "slug": "laptop-razer-blade-15-base-i7-10750h16gbssd-512gbvga-gtx-1660ti-6gblcd-156inch-fhd-120hz",
    "brand": "Razer",
    "categoryName": "Laptop Razer",
    "categorySlug": "laptop-razer",
    "price": 13500000,
    "originalPrice": 14500000,
    "discountPrice": 13500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786375522662-200513713.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786375522662-200513713.webp",
      "https://zcomputer.vn/uploads/image-1786375518141-10910580.webp",
      "https://zcomputer.vn/uploads/image-1786375523951-876414770.webp",
      "https://zcomputer.vn/uploads/image-1786375521046-929525525.webp",
      "https://zcomputer.vn/uploads/image-1786375519697-569985978.webp",
      "https://zcomputer.vn/uploads/image-1786375525161-331044891.webp",
      "https://zcomputer.vn/uploads/image-1786375526352-343862167.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 99,
    "ratings": {
      "average": 5,
      "count": 14
    }
  },
  {
    "name": "LAPTOP HP OMEN 15-ek100 I5 10300H/16GB/SSD 512GB/VGA RTX 3060 6GB/LCD 15.6INCH 144HZ FHD ",
    "slug": "laptop-hp-omen-15-ek100-i5-10300h16gbssd-512gbvga-rtx-3060-6gblcd-156inch-144hz-fhd",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 12900000,
    "originalPrice": 13900000,
    "discountPrice": 12900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 70,
    "ratings": {
      "average": 5,
      "count": 25
    }
  },
  {
    "name": "MÁY TÍNH ĐỂ BÀN DELL VOSTRO 3910MT I7 12700/16GB/SSD 512GB/ INTEL UHD 770/WIFI+BT",
    "slug": "may-tinh-de-ban-dell-vostro-3910mt-i7-1270016gbssd-512gb-intel-uhd-770wifibt",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 10900000,
    "originalPrice": 11900000,
    "discountPrice": 10900000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786373597632-938065675.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786373597632-938065675.webp",
      "https://zcomputer.vn/uploads/image-1786373601231-360161008.webp",
      "https://zcomputer.vn/uploads/image-1786373599367-821357274.webp",
      "https://zcomputer.vn/uploads/image-1786373596317-632595727.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 73,
    "ratings": {
      "average": 5,
      "count": 21
    }
  },
  {
    "name": "BỘ MÁY TÍNH H610M/ I3 12100/ RAM 16GB/ SSD 256GB/ NGUỒN 450W/ CASE VĂN PHÒNG",
    "slug": "bo-may-tinh-h610m-i3-12100-ram-16gb-ssd-256gb-nguon-450w-case-van-phong",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 7900000,
    "originalPrice": 8900000,
    "discountPrice": 7900000,
    "discountPercent": 11,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786372757776-892663194.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786372757776-892663194.webp",
      "https://zcomputer.vn/uploads/image-1786372755893-233013925.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 20,
    "ratings": {
      "average": 5,
      "count": 15
    }
  },
  {
    "name": "BỘ MÁY TÍNH H510M/I5 10400F/RAM 8GB/SSD 256GB/VGA RTX 3060TI 8GB/650W/TẢN KHÍ/CASE XIGMATEK KÈM 4 FAN LED",
    "slug": "bo-may-tinh-h510mi5-10400fram-8gbssd-256gbvga-rtx-3060ti-8gb650wtan-khicase-xigmatek-kem-4-fan-led",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 12900000,
    "originalPrice": 13900000,
    "discountPrice": 12900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786371167974-896339455.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786371167974-896339455.webp",
      "https://zcomputer.vn/uploads/image-1786371165211-930776251.webp",
      "https://zcomputer.vn/uploads/image-1786371163792-972447981.webp",
      "https://zcomputer.vn/uploads/image-1786371166488-792749308.webp",
      "https://zcomputer.vn/uploads/image-1786371162395-872356846.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 88,
    "ratings": {
      "average": 5,
      "count": 23
    }
  },
  {
    "name": "BỘ MÁY TÍNH B660M/I5 13400/RAM 16GB/SSD 500GB/VGA 3070 8GB/750W/AIO 240/CASE GALAX KÈM 4 FAN LED",
    "slug": "bo-may-tinh-b660mi5-13400ram-16gbssd-500gbvga-3070-8gb750waio-240case-galax-kem-4-fan-led",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 17900000,
    "originalPrice": 18900000,
    "discountPrice": 17900000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786357704339-630696950.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786357704339-630696950.webp",
      "https://zcomputer.vn/uploads/image-1786357702839-905102763.webp",
      "https://zcomputer.vn/uploads/image-1786357700828-967839683.webp",
      "https://zcomputer.vn/uploads/image-1786357705481-88745697.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 93,
    "ratings": {
      "average": 5,
      "count": 11
    }
  },
  {
    "name": "LAPTOP LENOVO LEGION SLIM 5 RYZEN 7 7840HS/16GB/SSD 1TB/VGA RTX 4060 8G/LCD 14.5INCH 2K8 OLED 120HZ ",
    "slug": "laptop-lenovo-legion-slim-5-ryzen-7-7840hs16gbssd-1tbvga-rtx-4060-8glcd-145inch-2k8-oled-120hz",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 25900000,
    "originalPrice": 26900000,
    "discountPrice": 25900000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786355185116-980053159.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786355185116-980053159.webp",
      "https://zcomputer.vn/uploads/image-1786355186393-661283447.webp",
      "https://zcomputer.vn/uploads/image-1786355187707-94305209.webp",
      "https://zcomputer.vn/uploads/image-1786355188794-181524583.webp",
      "https://zcomputer.vn/uploads/image-1786355191305-429148082.webp",
      "https://zcomputer.vn/uploads/image-1786355190179-79941437.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 28,
    "ratings": {
      "average": 5,
      "count": 32
    }
  },
  {
    "name": "LAPTOP ASUS ROG STRIX G16 G615JPR-S5155W I7 14650HX/AI/32GB/SSD 1TB/VGA RTX 5060 8GB/LCD 16INCH 2K5 240HZ - BH 04/2028 (SIÊU LƯỚT)",
    "slug": "laptop-asus-rog-strix-g16-g615jpr-s5155w-i7-14650hxai32gbssd-1tbvga-rtx-5060-8gblcd-16inch-2k5-240hz-bh-042028-sieu-luot",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 39500000,
    "originalPrice": 41900000,
    "discountPrice": 39500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786354004844-677145857.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786354004844-677145857.webp",
      "https://zcomputer.vn/uploads/image-1786354010985-499810201.webp",
      "https://zcomputer.vn/uploads/image-1786354002633-62128085.webp",
      "https://zcomputer.vn/uploads/image-1786354009532-804197307.webp",
      "https://zcomputer.vn/uploads/image-1786354008112-318888683.webp",
      "https://zcomputer.vn/uploads/image-1786354006500-361324869.webp",
      "https://zcomputer.vn/uploads/image-1786354012338-126097203.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 106,
    "ratings": {
      "average": 5,
      "count": 31
    }
  },
  {
    "name": "LAPTOP ACER PREDATOR HELIOS 16 PH16-71-72BV I7 13700HX/16GB/SSD 512GB/VGA RTX 4070 8GB/LCD 16INCH WQXGA (2560X1600) 240HZ",
    "slug": "laptop-acer-predator-helios-16-ph16-71-72bv-i7-13700hx16gbssd-512gbvga-rtx-4070-8gblcd-16inch-wqxga-2560x1600-240hz",
    "brand": "Acer",
    "categoryName": "Laptop Acer",
    "categorySlug": "laptop-acer",
    "price": 28500000,
    "originalPrice": 29500000,
    "discountPrice": 28500000,
    "discountPercent": 3,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786027914659-161459996.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786027914659-161459996.webp",
      "https://zcomputer.vn/uploads/image-1786027947193-159931278.webp",
      "https://zcomputer.vn/uploads/image-1786027928151-150988918.webp",
      "https://zcomputer.vn/uploads/image-1786027935181-817719796.webp",
      "https://zcomputer.vn/uploads/image-1786027920566-615652870.webp",
      "https://zcomputer.vn/uploads/image-1786027941017-61574313.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 37,
    "ratings": {
      "average": 5,
      "count": 31
    }
  },
  {
    "name": "BỘ MÁY TÍNH B650M D5/R5 7500F/RAM 16GB/SSD 500GB/VGA RTX 2060S 6GB/550W/TẢN KHÍ/CASE MAGIC BỂ CÁ KÈM 3 FAN LED",
    "slug": "bo-may-tinh-b650m-d5r5-7500fram-16gbssd-500gbvga-rtx-2060s-6gb550wtan-khicase-magic-be-ca-kem-3-fan-led",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 16900000,
    "originalPrice": 17900000,
    "discountPrice": 16900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786026953654-693060130.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786026953654-693060130.webp",
      "https://zcomputer.vn/uploads/image-1786026954763-114365121.webp",
      "https://zcomputer.vn/uploads/image-1786026947493-366804627.webp",
      "https://zcomputer.vn/uploads/image-1786026949210-861910727.webp",
      "https://zcomputer.vn/uploads/image-1786026952452-194089307.webp",
      "https://zcomputer.vn/uploads/image-1786026950734-65581642.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 50,
    "ratings": {
      "average": 5,
      "count": 15
    }
  },
  {
    "name": "BỘ MÁY TÍNH B550M ASROCK/ RYZEN 7 5700X/ RAM 16GB/ SSD 500GB/ RX 6600LE 8GB/ NGUỒN 650W/ CASE AIGO C218/ TẢN KHÍ - BH 09/2028 (PCM)",
    "slug": "bo-may-tinh-b550m-asrock-ryzen-7-5700x-ram-16gb-ssd-500gb-rx-6600le-8gb-nguon-650w-case-aigo-c218-tan-khi-bh-092028-pcm",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 15500000,
    "originalPrice": 16500000,
    "discountPrice": 15500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786026158721-974271077.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786026158721-974271077.webp",
      "https://zcomputer.vn/uploads/image-1786026160090-710775168.webp",
      "https://zcomputer.vn/uploads/image-1786026161540-819025296.webp",
      "https://zcomputer.vn/uploads/image-1786026155834-287148599.webp",
      "https://zcomputer.vn/uploads/image-1786026157411-939778399.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 55,
    "ratings": {
      "average": 5,
      "count": 18
    }
  },
  {
    "name": "BỘ MÁY TÍNH B550M ASROCK/ R7 5700X3D/RAM 16GB/ SSD 512GB/ RX 5700XT 8GB/ NGUỒN 800W/ CASE LIANLI O11/ TẢN AIO 360",
    "slug": "bo-may-tinh-b550m-asrock-r7-5700x3dram-16gb-ssd-512gb-rx-5700xt-8gb-nguon-800w-case-lianli-o11-tan-aio-360",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 18000000,
    "originalPrice": 19000000,
    "discountPrice": 18000000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786026003579-953924180.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786026003579-953924180.webp",
      "https://zcomputer.vn/uploads/image-1786026007672-944170420.webp",
      "https://zcomputer.vn/uploads/image-1786026005747-160266523.webp",
      "https://zcomputer.vn/uploads/image-1786026010714-252151030.webp",
      "https://zcomputer.vn/uploads/image-1786026009167-224390932.webp",
      "https://zcomputer.vn/uploads/image-1786025366438-176909683.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 127,
    "ratings": {
      "average": 5,
      "count": 8
    }
  },
  {
    "name": "LAPTOP ASUS TUF F16 FX608JMR I7-14650HX/ RAM 16GB/ SSD 1TB/ RTX 5060 8GB/ 16INCH FHD 144HZ - BH 8/2027",
    "slug": "laptop-asus-tuf-f16-fx608jmr-i7-14650hx-ram-16gb-ssd-1tb-rtx-5060-8gb-16inch-fhd-144hz-bh-82027",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 32000000,
    "originalPrice": 33000000,
    "discountPrice": 32000000,
    "discountPercent": 3,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786023639114-691578815.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786023639114-691578815.webp",
      "https://zcomputer.vn/uploads/image-1786023642426-319431788.webp",
      "https://zcomputer.vn/uploads/image-1786023646503-406883556.webp",
      "https://zcomputer.vn/uploads/image-1786023643754-432051308.webp",
      "https://zcomputer.vn/uploads/image-1786023645221-33160750.webp",
      "https://zcomputer.vn/uploads/image-1786023640807-906770977.webp",
      "https://zcomputer.vn/uploads/image-1786023647664-201833406.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 123,
    "ratings": {
      "average": 5,
      "count": 27
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M/I5 12400F/RAM 16GB/SSD 512GB/VGA RX7600 8GB/650W/TẢN KHÍ/CASE XIGMATEK KÈM 4 FAN LED - BH 02/2029 THNS",
    "slug": "bo-may-tinh-b760mi5-12400fram-16gbssd-512gbvga-rx7600-8gb650wtan-khicase-xigmatek-kem-4-fan-led-bh-022029-thns",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 15900000,
    "originalPrice": 16900000,
    "discountPrice": 15900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786018414321-556000573.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786018414321-556000573.webp",
      "https://zcomputer.vn/uploads/image-1786018415270-95609008.webp",
      "https://zcomputer.vn/uploads/image-1786018410792-448921109.webp",
      "https://zcomputer.vn/uploads/image-1786018409504-841704824.webp",
      "https://zcomputer.vn/uploads/image-1786018411774-312427074.webp",
      "https://zcomputer.vn/uploads/image-1786018413050-753181666.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 134,
    "ratings": {
      "average": 5,
      "count": 8
    }
  },
  {
    "name": "BỘ MÁY TÍNH B550M/R7 5700X3D/RAM 16GB/SSD 512GB/VGA 1660 SUPER 6GB/550W/AIO 2FAN/CASE BỂ CÁ KÈM 5 FAN LED",
    "slug": "bo-may-tinh-b550mr7-5700x3dram-16gbssd-512gbvga-1660-super-6gb550waio-2fancase-be-ca-kem-5-fan-led",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 16500000,
    "originalPrice": 17500000,
    "discountPrice": 16500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785932855915-434827557.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785932855915-434827557.webp",
      "https://zcomputer.vn/uploads/image-1785932853801-434541555.webp",
      "https://zcomputer.vn/uploads/image-1785932846204-535021145.webp",
      "https://zcomputer.vn/uploads/image-1785932851743-121923548.webp",
      "https://zcomputer.vn/uploads/image-1785932848767-151883958.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 113,
    "ratings": {
      "average": 5,
      "count": 35
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M D5/I5 12400F/RAM 32GB/SSD 500GB/VGA RTX 3060 12G/800W/TẢN KHÍ/CASE",
    "slug": "bo-may-tinh-b760m-d5i5-12400fram-32gbssd-500gbvga-rtx-3060-12g800wtan-khicase",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 20500000,
    "originalPrice": 21500000,
    "discountPrice": 20500000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785931941398-943328923.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785931941398-943328923.webp",
      "https://zcomputer.vn/uploads/image-1785931942457-326536759.webp",
      "https://zcomputer.vn/uploads/image-1785931940250-561674297.webp",
      "https://zcomputer.vn/uploads/image-1785931937069-275601515.webp",
      "https://zcomputer.vn/uploads/image-1785931932611-847003793.webp",
      "https://zcomputer.vn/uploads/image-1785931934693-771381940.webp",
      "https://zcomputer.vn/uploads/image-1785931938583-615057989.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 46,
    "ratings": {
      "average": 5,
      "count": 17
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M/I5 12400F/RAM 16GB/SSD 1TB/VGA RTX 3050 6GB/650W/TẢN KHÍ/CASE MSI KÈM 4 FAN LED",
    "slug": "bo-may-tinh-b760mi5-12400fram-16gbssd-1tbvga-rtx-3050-6gb650wtan-khicase-msi-kem-4-fan-led",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 14500000,
    "originalPrice": 15500000,
    "discountPrice": 14500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785922945358-674214428.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785922945358-674214428.webp",
      "https://zcomputer.vn/uploads/image-1785922946733-104787822.webp",
      "https://zcomputer.vn/uploads/image-1785922940057-862852623.webp",
      "https://zcomputer.vn/uploads/image-1785922937712-947514466.webp",
      "https://zcomputer.vn/uploads/image-1785922941970-540093273.webp",
      "https://zcomputer.vn/uploads/image-1785922943659-855201510.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 105,
    "ratings": {
      "average": 5,
      "count": 8
    }
  },
  {
    "name": "BỘ MÁY TÍNH PV A520M-K ASUS/RYZEN 5 5500GT/16GB/SSD 500GB/NGUỒN 500W/CASE VĂN PHÒNG - BH 4/2029 PHONG VŨ",
    "slug": "bo-may-tinh-pv-a520m-k-asusryzen-5-5500gt16gbssd-500gbnguon-500wcase-van-phong-bh-42029-phong-vu",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 7900000,
    "originalPrice": 8900000,
    "discountPrice": 7900000,
    "discountPercent": 11,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785845689657-414020282.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785845689657-414020282.webp",
      "https://zcomputer.vn/uploads/image-1785845688271-646598642.webp",
      "https://zcomputer.vn/uploads/image-1785845684602-110373540.webp",
      "https://zcomputer.vn/uploads/image-1785845690979-72329927.webp",
      "https://zcomputer.vn/uploads/image-1785845686546-449997115.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 81,
    "ratings": {
      "average": 5,
      "count": 32
    }
  },
  {
    "name": "BỘ MÁY TÍNH B650M/I5 10600K/16GB/SSD 256GB/RTX 2060 6G/650W/TẢN KHÍ/CASE BẾ CÁ KÈM 3 FAN LED",
    "slug": "bo-may-tinh-b650mi5-10600k16gbssd-256gbrtx-2060-6g650wtan-khicase-be-ca-kem-3-fan-led",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 10900000,
    "originalPrice": 11900000,
    "discountPrice": 10900000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785844803053-719758872.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785844803053-719758872.webp",
      "https://zcomputer.vn/uploads/image-1785844804084-929943650.webp",
      "https://zcomputer.vn/uploads/image-1785844805913-332342122.webp",
      "https://zcomputer.vn/uploads/image-1785844807123-736658738.webp",
      "https://zcomputer.vn/uploads/image-1785844804912-976633282.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 73,
    "ratings": {
      "average": 5,
      "count": 17
    }
  },
  {
    "name": "BỘ MÁY TÍNH ASUS H610M-K/I5 13400F/ RAM 16GB/ SSD 512GB/ RTX 3050 6GB/ NGUỒN 550W/CASE LED + TẢN KHÍ BH 5/2028",
    "slug": "bo-may-tinh-asus-h610m-ki5-13400f-ram-16gb-ssd-512gb-rtx-3050-6gb-nguon-550wcase-led-tan-khi-bh-52028",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 14500000,
    "originalPrice": 15500000,
    "discountPrice": 14500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785843960525-522579082.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785843960525-522579082.webp",
      "https://zcomputer.vn/uploads/image-1785843788832-500890705.webp",
      "https://zcomputer.vn/uploads/image-1785843787144-744211038.webp",
      "https://zcomputer.vn/uploads/image-1785843790080-778614811.webp",
      "https://zcomputer.vn/uploads/image-1785843791213-917929236.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 83,
    "ratings": {
      "average": 5,
      "count": 34
    }
  },
  {
    "name": "LAPTOP DELL PRECISION 5540 I7 9850H/16GB/SSD 512GB/VGA QUADRO T1000 4GDDR6/LCD 15.6INCH FHD",
    "slug": "laptop-dell-precision-5540-i7-9850h16gbssd-512gbvga-quadro-t1000-4gddr6lcd-156inch-fhd",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 10500000,
    "originalPrice": 11500000,
    "discountPrice": 10500000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785842733067-194815960.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785842733067-194815960.webp",
      "https://zcomputer.vn/uploads/image-1785842735301-822328895.webp",
      "https://zcomputer.vn/uploads/image-1785842738683-793698610.webp",
      "https://zcomputer.vn/uploads/image-1785842740176-17400121.webp",
      "https://zcomputer.vn/uploads/image-1785842736917-617222766.webp",
      "https://zcomputer.vn/uploads/image-1785842741943-309272225.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 132,
    "ratings": {
      "average": 5,
      "count": 25
    }
  },
  {
    "name": "LAPTOP ASUS TUF A15 FA507XI 2023 RYZEN 9 7940HS/RAM 16GB/ SSD 512GB/ VGA 4070 8GDDR6/LCD 15.6INCH 144HZ ",
    "slug": "laptop-asus-tuf-a15-fa507xi-2023-ryzen-9-7940hsram-16gb-ssd-512gb-vga-4070-8gddr6lcd-156inch-144hz",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 26500000,
    "originalPrice": 27500000,
    "discountPrice": 26500000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785841681580-429056004.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785841681580-429056004.webp",
      "https://zcomputer.vn/uploads/image-1785841685608-436129605.webp",
      "https://zcomputer.vn/uploads/image-1785841691621-390171154.webp",
      "https://zcomputer.vn/uploads/image-1785841688255-520008686.webp",
      "https://zcomputer.vn/uploads/image-1785841683785-656014545.webp",
      "https://zcomputer.vn/uploads/image-1785841690142-552286635.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 17,
    "ratings": {
      "average": 5,
      "count": 35
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M WIFI/I5 14400F/RAM 16GB D5/SSD 1TB/VGA RTX 5060 8GB/650W/CASE MSI KÈM 4 FAN LED/TẢN KHÍ",
    "slug": "bo-may-tinh-b760m-wifii5-14400fram-16gb-d5ssd-1tbvga-rtx-5060-8gb650wcase-msi-kem-4-fan-ledtan-khi",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 22900000,
    "originalPrice": 23900000,
    "discountPrice": 22900000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785840534421-105705229.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785840534421-105705229.webp",
      "https://zcomputer.vn/uploads/image-1785840532921-462612422.webp",
      "https://zcomputer.vn/uploads/image-1785840523962-341862330.webp",
      "https://zcomputer.vn/uploads/image-1785840525742-268503226.webp",
      "https://zcomputer.vn/uploads/image-1785840527677-319003156.webp",
      "https://zcomputer.vn/uploads/image-1785840529810-824003201.webp",
      "https://zcomputer.vn/uploads/image-1785840531523-328211174.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 125,
    "ratings": {
      "average": 5,
      "count": 15
    }
  },
  {
    "name": "MACBOOK PRO 2019 TOUCH BAR 16\" - CORE I9 9980HK/RAM 64GB/SSD 512GB/RADEON 5500M 4G/GRAY Z0Y1",
    "slug": "macbook-pro-2019-touch-bar-16-core-i9-9980hkram-64gbssd-512gbradeon-5500m-4ggray-z0y1",
    "brand": "Apple",
    "categoryName": "Macbook",
    "categorySlug": "macbook",
    "price": 16900000,
    "originalPrice": 17900000,
    "discountPrice": 16900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785410547074-417626204.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785410547074-417626204.webp",
      "https://zcomputer.vn/uploads/image-1785410551876-234479095.webp",
      "https://zcomputer.vn/uploads/image-1785410553102-675275128.webp",
      "https://zcomputer.vn/uploads/image-1785410548735-812725880.webp",
      "https://zcomputer.vn/uploads/image-1785410550310-149706039.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 81,
    "ratings": {
      "average": 5,
      "count": 16
    }
  },
  {
    "name": "LAPTOP DELL PRECISION 7670 I7 12850HX/32GB/SSD 1TB/VGA RTX A1000 4GB/LCD 16INCH WUXGA (1920 x 1200)",
    "slug": "laptop-dell-precision-7670-i7-12850hx32gbssd-1tbvga-rtx-a1000-4gblcd-16inch-wuxga-1920-x-1200",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 23500000,
    "originalPrice": 24500000,
    "discountPrice": 23500000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785409334966-590748505.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785409334966-590748505.webp",
      "https://zcomputer.vn/uploads/image-1785409336294-329174518.webp",
      "https://zcomputer.vn/uploads/image-1785409340158-962831739.webp",
      "https://zcomputer.vn/uploads/image-1785409338158-436886363.webp",
      "https://zcomputer.vn/uploads/image-1785409337186-597674588.webp",
      "https://zcomputer.vn/uploads/image-1785409339059-537213541.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 121,
    "ratings": {
      "average": 5,
      "count": 23
    }
  },
  {
    "name": "BỘ MÁY TÍNH Z790/I7 12700F/RAM 16GB/SSD 1TB/VGA RTX 3060 12GB/750W/AIO 240/CASE XIGMATEK KÈM 3 FAN LED - BH 05/2028",
    "slug": "bo-may-tinh-z790i7-12700fram-16gbssd-1tbvga-rtx-3060-12gb750waio-240case-xigmatek-kem-3-fan-led-bh-052028",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 24500000,
    "originalPrice": 25500000,
    "discountPrice": 24500000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785408533600-725366914.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785408533600-725366914.webp",
      "https://zcomputer.vn/uploads/image-1785408534726-412221194.webp",
      "https://zcomputer.vn/uploads/image-1785408526843-458438590.webp",
      "https://zcomputer.vn/uploads/image-1785408532191-37458912.webp",
      "https://zcomputer.vn/uploads/image-1785408530265-843208592.webp",
      "https://zcomputer.vn/uploads/image-1785408528586-651244394.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 68,
    "ratings": {
      "average": 5,
      "count": 19
    }
  },
  {
    "name": "BỘ MÁY TÍNH B650M WIFI/RYZEN 7 7700/RAM 16GB/SSD 512GB/VGA RTX 5060 8GB/650W/AIO 360/CASE GAMING KÈM 4 FAN LED BLACK - BH 05/2028",
    "slug": "bo-may-tinh-b650m-wifiryzen-7-7700ram-16gbssd-512gbvga-rtx-5060-8gb650waio-360case-gaming-kem-4-fan-led-black-bh-052028",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 22900000,
    "originalPrice": 23900000,
    "discountPrice": 22900000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785407510965-248522222.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785407510965-248522222.webp",
      "https://zcomputer.vn/uploads/image-1785407512362-7105838.webp",
      "https://zcomputer.vn/uploads/image-1785407507757-496392597.webp",
      "https://zcomputer.vn/uploads/image-1785407505734-19619514.webp",
      "https://zcomputer.vn/uploads/image-1785407509427-32361679.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 21,
    "ratings": {
      "average": 5,
      "count": 16
    }
  },
  {
    "name": "BỘ MÁY TÍNH B650M-F/RYZEN 7 8700F/RAM 32GB/SSD 256GB/VGA RTX 2060 12GB/750W/AIO 240/CASE BỂ CÁ KÈM 3 FAN WHITE",
    "slug": "bo-may-tinh-b650m-fryzen-7-8700fram-32gbssd-256gbvga-rtx-2060-12gb750waio-240case-be-ca-kem-3-fan-white",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 21090000,
    "originalPrice": 22090000,
    "discountPrice": 21090000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785405907075-552373887.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785405907075-552373887.webp",
      "https://zcomputer.vn/uploads/image-1785405908124-800978295.webp",
      "https://zcomputer.vn/uploads/image-1785405903416-79845891.webp",
      "https://zcomputer.vn/uploads/image-1785405902225-870785941.webp",
      "https://zcomputer.vn/uploads/image-1785405905877-917875498.webp",
      "https://zcomputer.vn/uploads/image-1785405904709-818699795.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 122,
    "ratings": {
      "average": 5,
      "count": 26
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M/I5 14400F/RAM 16GB/SSD 1TB/VGA RTX 3050 6GB/550W/TẢN KHÍ/CASE XIGMATEK BỂ CÁ KÈM 7 FAN LED",
    "slug": "bo-may-tinh-b760mi5-14400fram-16gbssd-1tbvga-rtx-3050-6gb550wtan-khicase-xigmatek-be-ca-kem-7-fan-led",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 15000000,
    "originalPrice": 16000000,
    "discountPrice": 15000000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785404946771-285880229.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785404946771-285880229.webp",
      "https://zcomputer.vn/uploads/image-1785404940638-362463064.webp",
      "https://zcomputer.vn/uploads/image-1785404945304-851052650.webp",
      "https://zcomputer.vn/uploads/image-1785404943019-939486837.webp",
      "https://zcomputer.vn/uploads/image-1785404948315-844032587.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 69,
    "ratings": {
      "average": 5,
      "count": 34
    }
  },
  {
    "name": "BỘ MÁY TÍNH B360-F GAMING/ I5 9400/ 16GB RAM/ 128GB SSD+ HDD 1TB/ GTX 1660 6GB/ NGUỒN 550W/ CASE LED GAMING/ TẢN AIO 240",
    "slug": "bo-may-tinh-b360-f-gaming-i5-9400-16gb-ram-128gb-ssd-hdd-1tb-gtx-1660-6gb-nguon-550w-case-led-gaming-tan-aio-240",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 8500000,
    "originalPrice": 9500000,
    "discountPrice": 8500000,
    "discountPercent": 11,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785403697241-415379456.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785403697241-415379456.webp",
      "https://zcomputer.vn/uploads/image-1785403698263-328381524.webp",
      "https://zcomputer.vn/uploads/image-1785403694042-686029953.webp",
      "https://zcomputer.vn/uploads/image-1785403695042-398142360.webp",
      "https://zcomputer.vn/uploads/image-1785403696194-154726712.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 127,
    "ratings": {
      "average": 5,
      "count": 34
    }
  },
  {
    "name": "BỘ MÁY TÍNH H510M MSI/ I5 10400F/ RAM 16GB / SSD 512GB/ VGA RTX 2060/ NGUỒN 550W/ CASE BỂ CÁ KÈM TẢN KHÍ",
    "slug": "bo-may-tinh-h510m-msi-i5-10400f-ram-16gb-ssd-512gb-vga-rtx-2060-nguon-550w-case-be-ca-kem-tan-khi",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 10900000,
    "originalPrice": 11900000,
    "discountPrice": 10900000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785401663767-380173852.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785401663767-380173852.webp",
      "https://zcomputer.vn/uploads/image-1785401657984-420775162.webp",
      "https://zcomputer.vn/uploads/image-1785401660989-55471948.webp",
      "https://zcomputer.vn/uploads/image-1785401659464-946670226.webp",
      "https://zcomputer.vn/uploads/image-1785401662542-988371261.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 42,
    "ratings": {
      "average": 5,
      "count": 15
    }
  },
  {
    "name": "Laptop Acer Nitro Gaming AN515-45-R86D R7 5800H/16GB/SSD 512GB /VGA RTX 3060 6GB/LCD 15.6INCH FHD 144HZ",
    "slug": "laptop-acer-nitro-gaming-an515-45-r86d-r7-5800h16gbssd-512gb-vga-rtx-3060-6gblcd-156inch-fhd-144hz",
    "brand": "Acer",
    "categoryName": "Laptop Acer",
    "categorySlug": "laptop-acer",
    "price": 14900000,
    "originalPrice": 15900000,
    "discountPrice": 14900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785400629880-672438210.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785400629880-672438210.webp",
      "https://zcomputer.vn/uploads/image-1785400635171-716912362.webp",
      "https://zcomputer.vn/uploads/image-1785400632704-498126487.webp",
      "https://zcomputer.vn/uploads/image-1785400631287-178873016.webp",
      "https://zcomputer.vn/uploads/image-1785400634150-942544429.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 26,
    "ratings": {
      "average": 5,
      "count": 16
    }
  },
  {
    "name": "BỘ MÁY TÍNH B460M MORTAR/ I5 10400F/ RAM 16GB/ SSD 512GB/ GTX 1660S 6GB/ NGUỒN 650W/ CASE GM-01/ TẢN KHÍ",
    "slug": "bo-may-tinh-b460m-mortar-i5-10400f-ram-16gb-ssd-512gb-gtx-1660s-6gb-nguon-650w-case-gm-01-tan-khi",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 10000000,
    "originalPrice": 11000000,
    "discountPrice": 10000000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785251329911-839809867.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785251329911-839809867.webp",
      "https://zcomputer.vn/uploads/image-1785251331659-1276022.webp",
      "https://zcomputer.vn/uploads/image-1785251335004-331536843.webp",
      "https://zcomputer.vn/uploads/image-1785251333321-28407710.webp",
      "https://zcomputer.vn/uploads/image-1785251336464-335886056.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 108,
    "ratings": {
      "average": 5,
      "count": 13
    }
  },
  {
    "name": "LAPTOP ASUS ROG STRIX G18 G814JVR I9 13980HX/16GB/SSD 1TB/ VGA RTX 4080 12G/LCD 18INCH 2K5 240HZ",
    "slug": "laptop-asus-rog-strix-g18-g814jvr-i9-13980hx16gbssd-1tb-vga-rtx-4080-12glcd-18inch-2k5-240hz",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 36900000,
    "originalPrice": 37900000,
    "discountPrice": 36900000,
    "discountPercent": 3,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785248985226-553907204.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785248985226-553907204.webp",
      "https://zcomputer.vn/uploads/image-1785248988636-431514352.webp",
      "https://zcomputer.vn/uploads/image-1785248998945-535551174.webp",
      "https://zcomputer.vn/uploads/image-1785248991026-102536575.webp",
      "https://zcomputer.vn/uploads/image-1785248993760-455770549.webp",
      "https://zcomputer.vn/uploads/image-1785248996596-72085743.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 81,
    "ratings": {
      "average": 5,
      "count": 8
    }
  },
  {
    "name": "LAPTOP LENOVO LOQ 15IRX9 I7 13650HX/16GB/SSD 512GB/VGA RTX 4060 8GB/LCD 15.6INCH FHD 144HZ - BH 01/2027",
    "slug": "laptop-lenovo-loq-15irx9-i7-13650hx16gbssd-512gbvga-rtx-4060-8gblcd-156inch-fhd-144hz-bh-012027",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 23900000,
    "originalPrice": 24900000,
    "discountPrice": 23900000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785247994733-315009917.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785247994733-315009917.webp",
      "https://zcomputer.vn/uploads/image-1785248015241-175655465.webp",
      "https://zcomputer.vn/uploads/image-1785248010524-170337244.webp",
      "https://zcomputer.vn/uploads/image-1785248001516-572156920.webp",
      "https://zcomputer.vn/uploads/image-1785248007100-969634697.webp",
      "https://zcomputer.vn/uploads/image-1785248022754-872326669.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 130,
    "ratings": {
      "average": 5,
      "count": 28
    }
  },
  {
    "name": "LAPTOP SURFACE 3 I7 1065G7/16GB/SSD 256GB/LCD 13.5INCH 2K5 CẢM ỨNG",
    "slug": "laptop-surface-3-i7-1065g716gbssd-256gblcd-135inch-2k5-cam-ung",
    "brand": "SURFACE",
    "categoryName": "Laptop Surface",
    "categorySlug": "laptop-surface",
    "price": 8900000,
    "originalPrice": 9900000,
    "discountPrice": 8900000,
    "discountPercent": 10,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785246709275-482166884.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785246709275-482166884.webp",
      "https://zcomputer.vn/uploads/image-1785246715557-492923363.webp",
      "https://zcomputer.vn/uploads/image-1785246712480-733726461.webp",
      "https://zcomputer.vn/uploads/image-1785246714005-905299975.webp",
      "https://zcomputer.vn/uploads/image-1785246710749-990437359.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 131,
    "ratings": {
      "average": 5,
      "count": 36
    }
  },
  {
    "name": "LAPTOP LENOVO IDEAPAD SLIM 5 OLED 15ARP10 RYZEN 7 7735HS/32GB/SSD 512GB/AMD RADEON 680M/LCD 15.1INCH 2K5 165HZ OLED - BH 9/2027",
    "slug": "laptop-lenovo-ideapad-slim-5-oled-15arp10-ryzen-7-7735hs32gbssd-512gbamd-radeon-680mlcd-151inch-2k5-165hz-oled-bh-92027",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 18900000,
    "originalPrice": 19900000,
    "discountPrice": 18900000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785145587709-762070088.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785145587709-762070088.webp",
      "https://zcomputer.vn/uploads/image-1785145589615-500654229.webp",
      "https://zcomputer.vn/uploads/image-1785145595988-866121817.webp",
      "https://zcomputer.vn/uploads/image-1785145594295-985247236.webp",
      "https://zcomputer.vn/uploads/image-1785145592687-41788332.webp",
      "https://zcomputer.vn/uploads/image-1785145591265-949582836.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 58,
    "ratings": {
      "average": 5,
      "count": 9
    }
  },
  {
    "name": "LAPTOP LENOVO GEEKPRO LOQ 2023 RYZEN 7 7840H/16GB/SSD 512GB/VGA 4060 8GB/LCD 15.6INCH 2K 165HZ",
    "slug": "laptop-lenovo-geekpro-loq-2023-ryzen-7-7840h16gbssd-512gbvga-4060-8gblcd-156inch-2k-165hz",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 22900000,
    "originalPrice": 23900000,
    "discountPrice": 22900000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785144567163-810771731.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785144567163-810771731.webp",
      "https://zcomputer.vn/uploads/image-1785144573158-54133184.webp",
      "https://zcomputer.vn/uploads/image-1785144574512-792213317.webp",
      "https://zcomputer.vn/uploads/image-1785144570183-4948839.webp",
      "https://zcomputer.vn/uploads/image-1785144571697-570519191.webp",
      "https://zcomputer.vn/uploads/image-1785144568649-316997425.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 125,
    "ratings": {
      "average": 5,
      "count": 17
    }
  },
  {
    "name": "LAPTOP ACER NITRO PROPANEL ANV16-72 CORE 7 240H/16GB/SSD 1TB/VGA RTX 5050 8GB/LCD 16INCH WUXGA (1920 x 1200) 180HZ - BH 11/2026",
    "slug": "laptop-acer-nitro-propanel-anv16-72-core-7-240h16gbssd-1tbvga-rtx-5050-8gblcd-16inch-wuxga-1920-x-1200-180hz-bh-112026",
    "brand": "Acer",
    "categoryName": "Laptop Acer",
    "categorySlug": "laptop-acer",
    "price": 24900000,
    "originalPrice": 25900000,
    "discountPrice": 24900000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785143008318-613298373.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785143008318-613298373.webp",
      "https://zcomputer.vn/uploads/image-1785143010864-216510633.webp",
      "https://zcomputer.vn/uploads/image-1785143014539-498175094.webp",
      "https://zcomputer.vn/uploads/image-1785143012273-61747668.webp",
      "https://zcomputer.vn/uploads/image-1785143009543-156362852.webp",
      "https://zcomputer.vn/uploads/image-1785143013367-547575245.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 72,
    "ratings": {
      "average": 5,
      "count": 30
    }
  },
  {
    "name": "LAPTOP DELL LATITUDE 7440 I7 1365U/16GB/SSD 512GB/LCD 14INCH WUXGA (1920 x 1200) 60HZ",
    "slug": "laptop-dell-latitude-7440-i7-1365u16gbssd-512gblcd-14inch-wuxga-1920-x-1200-60hz-1785141494584",
    "brand": "DELL",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 13500000,
    "originalPrice": 14500000,
    "discountPrice": 13500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785141475783-255497282.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785141475783-255497282.webp",
      "https://zcomputer.vn/uploads/image-1785141482804-799547.webp",
      "https://zcomputer.vn/uploads/image-1785141481136-643354194.webp",
      "https://zcomputer.vn/uploads/image-1785141479739-690047535.webp",
      "https://zcomputer.vn/uploads/image-1785141478537-571611005.webp",
      "https://zcomputer.vn/uploads/image-1785141477264-993716758.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 100,
    "ratings": {
      "average": 5,
      "count": 28
    }
  },
  {
    "name": "LAPTOP DELL G15 5520 I7 12700H/16GB/SSD 512GB/RTX 3060 6GB/LCD 15.6INCH FHD 165HZ",
    "slug": "laptop-dell-g15-5520-i7-12700h16gbssd-512gbrtx-3060-6gblcd-156inch-fhd-165hz",
    "brand": "DELL",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 18500000,
    "originalPrice": 19500000,
    "discountPrice": 18500000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785074168058-226345543.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785074168058-226345543.webp",
      "https://zcomputer.vn/uploads/image-1785074173887-661813526.webp",
      "https://zcomputer.vn/uploads/image-1785074175616-666882699.webp",
      "https://zcomputer.vn/uploads/image-1785074172438-200971259.webp",
      "https://zcomputer.vn/uploads/image-1785074171082-954860939.webp",
      "https://zcomputer.vn/uploads/image-1785074176854-576505962.webp",
      "https://zcomputer.vn/uploads/image-1785074169680-533866354.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 20,
    "ratings": {
      "average": 5,
      "count": 26
    }
  },
  {
    "name": "LAPTOP ASUS ROG STRIX G713 RYZEN 9 5900HX/16GB/SSD 512GB/VGA RTX 3070 8G/LCD 17.3INCH FHD 300HZ",
    "slug": "laptop-asus-rog-strix-g713-ryzen-9-5900hx16gbssd-512gbvga-rtx-3070-8glcd-173inch-fhd-300hz",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 22500000,
    "originalPrice": 23500000,
    "discountPrice": 22500000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784988254015-676239629.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784988254015-676239629.webp",
      "https://zcomputer.vn/uploads/image-1784988260655-276739904.webp",
      "https://zcomputer.vn/uploads/image-1784988261950-643727147.webp",
      "https://zcomputer.vn/uploads/image-1784988259523-216133926.webp",
      "https://zcomputer.vn/uploads/image-1784988258153-493872000.webp",
      "https://zcomputer.vn/uploads/image-1784988257045-494249432.webp",
      "https://zcomputer.vn/uploads/image-1784988255715-396182536.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 21,
    "ratings": {
      "average": 5,
      "count": 28
    }
  },
  {
    "name": "LAPTOP MSI GS66 STEALTH 2021 I7 11800H/16GB/SSD 512GB/ VGA RTX 3060 6G/LCD 15.6INCH FHD 240HZ ",
    "slug": "laptop-msi-gs66-stealth-2021-i7-11800h16gbssd-512gb-vga-rtx-3060-6glcd-156inch-fhd-240hz",
    "brand": "MSI",
    "categoryName": "Laptop MSI",
    "categorySlug": "laptop-msi",
    "price": 16500000,
    "originalPrice": 17500000,
    "discountPrice": 16500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784984754388-983709966.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784984754388-983709966.webp",
      "https://zcomputer.vn/uploads/image-1784984760196-242182219.webp",
      "https://zcomputer.vn/uploads/image-1784984756721-837388849.webp",
      "https://zcomputer.vn/uploads/image-1784984757972-181897436.webp",
      "https://zcomputer.vn/uploads/image-1784984755622-615193447.webp",
      "https://zcomputer.vn/uploads/image-1784984758995-162477425.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 63,
    "ratings": {
      "average": 5,
      "count": 20
    }
  },
  {
    "name": "BỘ MÁY TÍNH B650M/R7 7800X3D/RAM 16GB/SSD 512GB/VGA RTX 5060 8G/750W/AIO 360/CASE MONTECH SKY KÈM 3 FAN LED",
    "slug": "bo-may-tinh-b650mr7-7800x3dram-16gbssd-512gbvga-rtx-5060-8g750waio-360case-montech-sky-kem-3-fan-led",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 26500000,
    "originalPrice": 27500000,
    "discountPrice": 26500000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784983632277-405135458.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784983632277-405135458.webp",
      "https://zcomputer.vn/uploads/image-1784983633373-962383913.webp",
      "https://zcomputer.vn/uploads/image-1784983629760-845367648.webp",
      "https://zcomputer.vn/uploads/image-1784983626985-49348312.webp",
      "https://zcomputer.vn/uploads/image-1784983628232-82212292.webp",
      "https://zcomputer.vn/uploads/image-1784983631257-179084849.webp",
      "https://zcomputer.vn/uploads/image-1784983625347-183774401.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 50,
    "ratings": {
      "average": 5,
      "count": 21
    }
  },
  {
    "name": "BỘ MÁY TÍNH B460M/I5 10400F/RAM 16GB/SSD 256GB/VGA 2060 6G/650W/TẢN KHÍ/CASE BỂ CÁ KÈM 5 FAN LED",
    "slug": "bo-may-tinh-b460mi5-10400fram-16gbssd-256gbvga-2060-6g650wtan-khicase-be-ca-kem-5-fan-led",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 10500000,
    "originalPrice": 11500000,
    "discountPrice": 10500000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784965426887-333237962.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784965426887-333237962.webp",
      "https://zcomputer.vn/uploads/image-1784965425619-165354599.webp",
      "https://zcomputer.vn/uploads/image-1784965424392-581904244.webp",
      "https://zcomputer.vn/uploads/image-1784965420723-452899822.webp",
      "https://zcomputer.vn/uploads/image-1784965419021-699189271.webp",
      "https://zcomputer.vn/uploads/image-1784965422830-641464371.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 53,
    "ratings": {
      "average": 5,
      "count": 15
    }
  },
  {
    "name": "BỘ MÁY TÍNH Z790 D5/I5 14600K/RAM 32GB/SSD 1TB/VGA RTX 3070 8GB/750W/AIO 2FAN/CASE CUBI II KÈM 4 FAN LED - BH 01/2028",
    "slug": "bo-may-tinh-z790-d5i5-14600kram-32gbssd-1tbvga-rtx-3070-8gb750waio-2fancase-cubi-ii-kem-4-fan-led-bh-012028",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 26990000,
    "originalPrice": 27990000,
    "discountPrice": 26990000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784964219395-3949110.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784964219395-3949110.webp",
      "https://zcomputer.vn/uploads/image-1784964220516-155942820.webp",
      "https://zcomputer.vn/uploads/image-1784964218144-635390693.webp",
      "https://zcomputer.vn/uploads/image-1784964212848-326914385.webp",
      "https://zcomputer.vn/uploads/image-1784964214513-777115255.webp",
      "https://zcomputer.vn/uploads/image-1784964216126-218008162.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 134,
    "ratings": {
      "average": 5,
      "count": 16
    }
  },
  {
    "name": "LAPTOP ASUS VIVOBOOK X1405VA I5 13420H/16GB/SSD 512GB/INTEL UHD/LCD 14INCH WUXGA IPS - BH 8/2027 ",
    "slug": "laptop-asus-vivobook-x1405va-i5-13420h16gbssd-512gbintel-uhdlcd-14inch-wuxga-ips-bh-82027",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 10500000,
    "originalPrice": 11900000,
    "discountPrice": 10500000,
    "discountPercent": 12,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784957358686-844000263.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784957358686-844000263.webp",
      "https://zcomputer.vn/uploads/image-1784957360148-570700267.webp",
      "https://zcomputer.vn/uploads/image-1784957364206-204394782.webp",
      "https://zcomputer.vn/uploads/image-1784957365404-948255208.webp",
      "https://zcomputer.vn/uploads/image-1784957362994-751210766.webp",
      "https://zcomputer.vn/uploads/image-1784957361625-18842921.webp",
      "https://zcomputer.vn/uploads/image-1784957366601-535773369.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 29,
    "ratings": {
      "average": 5,
      "count": 16
    }
  },
  {
    "name": "LAPTOP DELL PRECISION 7760 I7 11850H/16GB/SSD 512GB/VGA RTX A3000 6GDDR6/LCD 17.3INCH FHD",
    "slug": "laptop-dell-precision-7760-i7-11850h16gbssd-512gbvga-rtx-a3000-6gddr6lcd-173inch-fhd",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 20500000,
    "originalPrice": 21990000,
    "discountPrice": 20500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784956411891-554129791.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784956411891-554129791.webp",
      "https://zcomputer.vn/uploads/image-1784956416635-825772564.webp",
      "https://zcomputer.vn/uploads/image-1784956418088-820976329.webp",
      "https://zcomputer.vn/uploads/image-1784956414934-427786532.webp",
      "https://zcomputer.vn/uploads/image-1784956413204-209694593.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 35,
    "ratings": {
      "average": 5,
      "count": 32
    }
  },
  {
    "name": "LAPTOP DELL 15 DC1520 I5 1334U/16GB/SSD 512GB/LCD 15.6INCH FHD TOUCH",
    "slug": "laptop-dell-15-dc1520-i5-1334u16gbssd-512gblcd-156inch-fhd-touch",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 9900000,
    "originalPrice": 10900000,
    "discountPrice": 9900000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784798234676-899618249.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784798234676-899618249.webp",
      "https://zcomputer.vn/uploads/image-1784798236311-785348056.webp",
      "https://zcomputer.vn/uploads/image-1784798240474-654018440.webp",
      "https://zcomputer.vn/uploads/image-1784798239083-161912039.webp",
      "https://zcomputer.vn/uploads/image-1784798237754-687001795.webp",
      "https://zcomputer.vn/uploads/image-1784798241734-71740443.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 54,
    "ratings": {
      "average": 5,
      "count": 34
    }
  },
  {
    "name": "LAPTOP DELL XPS 15 9520 I9 12900HK/16GB/SSD 512GB/VGA RTX 3050TI/LCD 15.6INCH WUXGA (1920 x 1200)",
    "slug": "laptop-dell-xps-15-9520-i9-12900hk16gbssd-512gbvga-rtx-3050tilcd-156inch-wuxga-1920-x-1200",
    "brand": "DELL",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 21500000,
    "originalPrice": 22500000,
    "discountPrice": 21500000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784726589302-792497887.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784726589302-792497887.webp",
      "https://zcomputer.vn/uploads/image-1784726592426-479642318.webp",
      "https://zcomputer.vn/uploads/image-1784726591190-718748923.webp",
      "https://zcomputer.vn/uploads/image-1784726590329-426754687.webp",
      "https://zcomputer.vn/uploads/image-1784726593406-113660434.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 83,
    "ratings": {
      "average": 5,
      "count": 32
    }
  },
  {
    "name": "BỘ MÁY TÍNH H510M/I3 10100F/RAM 16GB/SSD 256GB/VGA GTX 1650 4GB/450W/CASE XIGMATEK KÈM 3 FAN LED",
    "slug": "bo-may-tinh-h510mi3-10100fram-16gbssd-256gbvga-gtx-1650-4gb450wcase-xigmatek-kem-3-fan-led",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 6700000,
    "originalPrice": 7900000,
    "discountPrice": 6700000,
    "discountPercent": 15,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784725539802-382888547.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784725539802-382888547.webp",
      "https://zcomputer.vn/uploads/image-1784725541432-671175175.webp",
      "https://zcomputer.vn/uploads/image-1784725535777-666732064.webp",
      "https://zcomputer.vn/uploads/image-1784725537635-534291287.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 41,
    "ratings": {
      "average": 5,
      "count": 8
    }
  },
  {
    "name": "BỘ MÁY TÍNH H610M/I5 12400/RAM 16GB/SSD 512GB/VGA RTX 3070 8GB/650W/TẢN KHÍ ĐÔI/CASE JETEK GAMING KÈM 3 FAN - BH 08/2027",
    "slug": "bo-may-tinh-h610mi5-12400ram-16gbssd-512gbvga-rtx-3070-8gb650wtan-khi-doicase-jetek-gaming-kem-3-fan-bh-082027",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 15500000,
    "originalPrice": 16500000,
    "discountPrice": 15500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784724751461-5841437.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784724751461-5841437.webp",
      "https://zcomputer.vn/uploads/image-1784724753093-996949066.webp",
      "https://zcomputer.vn/uploads/image-1784724749807-721517145.webp",
      "https://zcomputer.vn/uploads/image-1784724748028-643221251.webp",
      "https://zcomputer.vn/uploads/image-1784724746082-216681113.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 88,
    "ratings": {
      "average": 5,
      "count": 33
    }
  },
  {
    "name": "BỘ MÁY TÍNH H510M/I5 10400/RAM 16GB/SSD 500GB/VGA RX550 4GB/450W/CASE GAMING",
    "slug": "bo-may-tinh-h510mi5-10400ram-16gbssd-500gbvga-rx550-4gb450wcase-gaming",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 7500000,
    "originalPrice": 8500000,
    "discountPrice": 7500000,
    "discountPercent": 12,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784718056735-950038208.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784718056735-950038208.webp",
      "https://zcomputer.vn/uploads/image-1784718058316-342077569.webp",
      "https://zcomputer.vn/uploads/image-1784718048214-323341081.webp",
      "https://zcomputer.vn/uploads/image-1784718052869-282321648.webp",
      "https://zcomputer.vn/uploads/image-1784718054962-302574638.webp",
      "https://zcomputer.vn/uploads/image-1784718050435-446877026.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 104,
    "ratings": {
      "average": 5,
      "count": 26
    }
  },
  {
    "name": "BỘ MÁY TÍNH H610M/I5 12400/RAM 16GB/SSD 512GB/VGA RTX 4060 8GB/650W/TẢN KHÍ ĐÔI/CASE JETEK GAMING KÈM 3 FAN - BH 08/2027",
    "slug": "bo-may-tinh-h610mi5-12400ram-16gbssd-512gbvga-rtx-4060-8gb650wtan-khi-doicase-jetek-gaming-kem-3-fan-bh-082027",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 15500000,
    "originalPrice": 16990000,
    "discountPrice": 15500000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784717299938-197432736.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784717299938-197432736.webp",
      "https://zcomputer.vn/uploads/image-1784717298391-712621450.webp",
      "https://zcomputer.vn/uploads/image-1784717296802-265554028.webp",
      "https://zcomputer.vn/uploads/image-1784717294752-738339583.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 117,
    "ratings": {
      "average": 5,
      "count": 14
    }
  },
  {
    "name": "MÁY TÍNH AIO TIGER 24INCH/ i9-11900H/ RAM 16GB/ SSD 256GB/ WIFI+LAN",
    "slug": "may-tinh-aio-tiger-24inch-i9-11900h-ram-16gb-ssd-256gb-wifilan",
    "brand": "Khác",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 6500000,
    "originalPrice": 7500000,
    "discountPrice": 6500000,
    "discountPercent": 13,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784716177944-206761580.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784716177944-206761580.webp",
      "https://zcomputer.vn/uploads/image-1784716176142-100487987.webp",
      "https://zcomputer.vn/uploads/image-1784716173150-671624885.webp",
      "https://zcomputer.vn/uploads/image-1784716174750-17933001.webp",
      "https://zcomputer.vn/uploads/image-1784716171578-837104317.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 109,
    "ratings": {
      "average": 5,
      "count": 29
    }
  },
  {
    "name": " MÁY TÍNH AIO X-mi 24inch/ Xeon-W1370P/ RAM 16GB/ SSD 256GB/WIFI + LAN",
    "slug": "may-tinh-aio-x-mi-24inch-xeon-w1370p-ram-16gb-ssd-256gbwifi-lan",
    "brand": "X-mi",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 3900000,
    "originalPrice": 49900000,
    "discountPrice": 3900000,
    "discountPercent": 92,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784715901363-314777657.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784715901363-314777657.webp",
      "https://zcomputer.vn/uploads/image-1784715902924-984285570.webp",
      "https://zcomputer.vn/uploads/image-1784715899783-296445136.webp",
      "https://zcomputer.vn/uploads/image-1784715898206-282083419.webp",
      "https://zcomputer.vn/uploads/image-1784715894936-670548793.webp",
      "https://zcomputer.vn/uploads/image-1784715896792-228840760.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 74,
    "ratings": {
      "average": 5,
      "count": 14
    }
  },
  {
    "name": "BỘ MÁY TÍNH B560/I5 11400F/RAM 16GB/SSD 512GB/VGA 1660S 6G/750W/AIO 240/CASE GIGABYTE KÈM 3 FAN",
    "slug": "bo-may-tinh-b560i5-11400fram-16gbssd-512gbvga-1660s-6g750waio-240case-gigabyte-kem-3-fan",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 10900000,
    "originalPrice": 11900000,
    "discountPrice": 10900000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784710096182-537638301.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784710096182-537638301.webp",
      "https://zcomputer.vn/uploads/image-1784710097385-101592760.webp",
      "https://zcomputer.vn/uploads/image-1784710094846-600905733.webp",
      "https://zcomputer.vn/uploads/image-1784710089502-9948368.webp",
      "https://zcomputer.vn/uploads/image-1784710093133-227619336.webp",
      "https://zcomputer.vn/uploads/image-1784710091286-778657837.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 126,
    "ratings": {
      "average": 5,
      "count": 21
    }
  },
  {
    "name": "BỘ MÁY TÍNH B650M WIFI/AMD R7 7800X3D/RAM 32GB (16GB X 2)/SSD 500GB/VGA RTX 5060TI 8GB/750W/AIO 240/CASE MIK KÈM 3 FAN LED - SIÊU MỚI BH 07/2029.",
    "slug": "bo-may-tinh-b650m-wifiamd-r7-7800x3dram-32gb-16gb-x-2ssd-500gbvga-rtx-5060ti-8gb750waio-240case-mik-kem-3-fan-led-sieu-moi-bh-072029",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 33000000,
    "originalPrice": 39990000,
    "discountPrice": 33000000,
    "discountPercent": 17,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784556219374-994120434.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784556219374-994120434.webp",
      "https://zcomputer.vn/uploads/image-1784556220284-82485547.webp",
      "https://zcomputer.vn/uploads/image-1784556218392-890161578.webp",
      "https://zcomputer.vn/uploads/image-1784556216268-325746114.webp",
      "https://zcomputer.vn/uploads/image-1784556217481-744694628.webp",
      "https://zcomputer.vn/uploads/image-1784556215304-275032301.webp",
      "https://zcomputer.vn/uploads/image-1784556221252-194645195.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 58,
    "ratings": {
      "average": 5,
      "count": 33
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M/I5 12400F/RAM 16GB/SSD 512GB/VGA RTX 5060 8GB/650W/TẢN KHÍ/CASE MIK KÈM 3 FAN LED - BH 9/2028",
    "slug": "bo-may-tinh-b760mi5-12400fram-16gbssd-512gbvga-rtx-5060-8gb650wtan-khicase-mik-kem-3-fan-led-bh-92028",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 18900000,
    "originalPrice": 20490000,
    "discountPrice": 18900000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784554912819-716305436.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784554912819-716305436.webp",
      "https://zcomputer.vn/uploads/image-1784554914269-832664212.webp",
      "https://zcomputer.vn/uploads/image-1784554909547-298736498.webp",
      "https://zcomputer.vn/uploads/image-1784554906226-622201119.webp",
      "https://zcomputer.vn/uploads/image-1784554911355-47496419.webp",
      "https://zcomputer.vn/uploads/image-1784554908206-908436186.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 42,
    "ratings": {
      "average": 5,
      "count": 21
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760 WIFI/I5 13400F/RAM 16GB/SSD 500GB/VGA RTX 4060 8GB/650W/TẢN KHÍ/CASE NZXT H5 KÈM 3 FAN ",
    "slug": "bo-may-tinh-b760-wifii5-13400fram-16gbssd-500gbvga-rtx-4060-8gb650wtan-khicase-nzxt-h5-kem-3-fan",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 18300000,
    "originalPrice": 19990000,
    "discountPrice": 18300000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784552932666-665526224.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784552932666-665526224.webp",
      "https://zcomputer.vn/uploads/image-1784552931352-199871884.webp",
      "https://zcomputer.vn/uploads/image-1784552933691-380386248.webp",
      "https://zcomputer.vn/uploads/image-1784552929813-790880994.webp",
      "https://zcomputer.vn/uploads/image-1784552928444-157949203.webp",
      "https://zcomputer.vn/uploads/image-1784552926500-896157695.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 97,
    "ratings": {
      "average": 5,
      "count": 21
    }
  },
  {
    "name": "Laptop MSI Gaming GF75 Thin 10SC-013VN I7 10750H/16GB/SSD 512GB/VGA GTX 1650 4G/17.3 inch FHD 144Hz/Win 10",
    "slug": "laptop-msi-gaming-gf75-thin-10sc-013vn-i7-10750h16gbssd-512gbvga-gtx-1650-4g173-inch-fhd-144hzwin-10",
    "brand": "MSI",
    "categoryName": "Laptop MSI",
    "categorySlug": "laptop-msi",
    "price": 8900000,
    "originalPrice": 10290000,
    "discountPrice": 8900000,
    "discountPercent": 14,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784382631109-393861258.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784382631109-393861258.webp",
      "https://zcomputer.vn/uploads/image-1784382634980-529876060.webp",
      "https://zcomputer.vn/uploads/image-1784382632370-995552653.webp",
      "https://zcomputer.vn/uploads/image-1784382633912-202928501.webp",
      "https://zcomputer.vn/uploads/image-1784382635924-155010671.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 36,
    "ratings": {
      "average": 5,
      "count": 32
    }
  },
  {
    "name": "LAPTOP DELL INSPIRON 16 PLUS 7620 I7 12700H/16GB/SSD 1TB/VGA RTX 3060 6GB/LCD 16INCH 3K (3072x1920)",
    "slug": "laptop-dell-inspiron-16-plus-7620-i7-12700h16gbssd-1tbvga-rtx-3060-6gblcd-16inch-3k-3072x1920",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 17900000,
    "originalPrice": 19490000,
    "discountPrice": 17900000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784381668035-821262347.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784381668035-821262347.webp",
      "https://zcomputer.vn/uploads/image-1784381669556-308850656.webp",
      "https://zcomputer.vn/uploads/image-1784381671086-438385075.webp",
      "https://zcomputer.vn/uploads/image-1784381672337-598480316.webp",
      "https://zcomputer.vn/uploads/image-1784381675014-64532237.webp",
      "https://zcomputer.vn/uploads/image-1784381676693-682991495.webp",
      "https://zcomputer.vn/uploads/image-1784381677992-353331060.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 108,
    "ratings": {
      "average": 5,
      "count": 10
    }
  },
  {
    "name": "BỘ MÁY TÍNH B660M DS3H/ I5 12400F/ 16GB/ SSD 500GB/ RTX 3060TI 8GB/ NGUỒN 650W/ CASE GAMING/ TẢN KHÍ - BH 10/2027",
    "slug": "bo-may-tinh-b660m-ds3h-i5-12400f-16gb-ssd-500gb-rtx-3060ti-8gb-nguon-650w-case-gaming-tan-khi-bh-102027",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 15900000,
    "originalPrice": 17490000,
    "discountPrice": 15900000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784368730670-759222081.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784368730670-759222081.webp",
      "https://zcomputer.vn/uploads/image-1784368724813-156395097.webp",
      "https://zcomputer.vn/uploads/image-1784368726316-300020333.webp",
      "https://zcomputer.vn/uploads/image-1784368727849-337979140.webp",
      "https://zcomputer.vn/uploads/image-1784368729314-518750771.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 61,
    "ratings": {
      "average": 5,
      "count": 21
    }
  },
  {
    "name": "BỘ MÁY TÍNH H610M/I5 13400F/RAM 16GB/SSD 256GB/VGA RTX 3060TI 8GB/500W/TẢN KHÍ/CASE XIGMATEK KÈM 3 FAN LED",
    "slug": "bo-may-tinh-h610mi5-13400fram-16gbssd-256gbvga-rtx-3060ti-8gb500wtan-khicase-xigmatek-kem-3-fan-led",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 14500000,
    "originalPrice": 16490000,
    "discountPrice": 14500000,
    "discountPercent": 12,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784367605993-887933577.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784367605993-887933577.webp",
      "https://zcomputer.vn/uploads/image-1784367607619-282227664.webp",
      "https://zcomputer.vn/uploads/image-1784367611059-931269632.webp",
      "https://zcomputer.vn/uploads/image-1784367609219-410802920.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 15,
    "ratings": {
      "average": 5,
      "count": 15
    }
  },
  {
    "name": "LAPTOP GIGABYTE G5 MD I5 11400H/16GB/512GB PCIE/VGA 4GB RTX3050/15.6 FHD 144HZ/WIN11",
    "slug": "laptop-gigabyte-g5-md-i5-11400h16gb512gb-pcievga-4gb-rtx3050156-fhd-144hzwin11",
    "brand": "Gigabyte",
    "categoryName": "Laptop Gigabyte",
    "categorySlug": "laptop-gigabyte",
    "price": 11900000,
    "originalPrice": 13000000,
    "discountPrice": 11900000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784192947213-158193019.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784192947213-158193019.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 32,
    "ratings": {
      "average": 5,
      "count": 26
    }
  },
  {
    "name": "LAPTOP ASUS VIVOBOOK X14005V-KM095W I5 13500H/16GB DDR4/ SSD 512GB/14 ICNH OLED 2.8K 90HZ",
    "slug": "laptop-asus-vivobook-x14005v-km095w-i5-13500h16gb-ddr4-ssd-512gb14-icnh-oled-28k-90hz",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 10500000,
    "originalPrice": 11500000,
    "discountPrice": 10500000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784358595611-895654592.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784358595611-895654592.webp",
      "https://zcomputer.vn/uploads/image-1784358596978-583302347.webp",
      "https://zcomputer.vn/uploads/image-1784358601149-466148098.webp",
      "https://zcomputer.vn/uploads/image-1784358598240-293475610.webp",
      "https://zcomputer.vn/uploads/image-1784358599802-276881424.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 77,
    "ratings": {
      "average": 5,
      "count": 10
    }
  },
  {
    "name": "LAPTOP MSI KATANA GF66 12UCK-804VN I7 12650H/16GB/512GB/VGA 3050 4G/LCD 15.6INCH 144HZ",
    "slug": "laptop-msi-katana-gf66-12uck-804vn-i7-12650h16gb512gbvga-3050-4glcd-156inch-144hz",
    "brand": "MSI",
    "categoryName": "Laptop MSI",
    "categorySlug": "laptop-msi",
    "price": 15500000,
    "originalPrice": 18500000,
    "discountPrice": 15500000,
    "discountPercent": 16,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784365590100-311507416.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784365590100-311507416.webp",
      "https://zcomputer.vn/uploads/image-1784365591478-604737142.webp",
      "https://zcomputer.vn/uploads/image-1784365594707-971545353.webp",
      "https://zcomputer.vn/uploads/image-1784365592999-148408262.webp",
      "https://zcomputer.vn/uploads/image-1784365587880-187943885.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 80,
    "ratings": {
      "average": 5,
      "count": 22
    }
  },
  {
    "name": "LAPTOP DELL PRECISION 7550 I7 10750H/16GB/512GB/VGA QUADRO T2000 4GDDR6/LCD 15.6INCH FHD IPS",
    "slug": "laptop-dell-precision-7550-i7-10750h16gb512gbvga-quadro-t2000-4gddr6lcd-156inch-fhd-ips",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 13900000,
    "originalPrice": 15000000,
    "discountPrice": 13900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784474758176-279221333.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784474758176-279221333.webp",
      "https://zcomputer.vn/uploads/image-1784474756037-216677738.webp",
      "https://zcomputer.vn/uploads/image-1784474759581-931566483.webp",
      "https://zcomputer.vn/uploads/image-1784474760985-700006068.webp",
      "https://zcomputer.vn/uploads/image-1784474762290-407522172.webp",
      "https://zcomputer.vn/uploads/image-1784474763605-743378564.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 70,
    "ratings": {
      "average": 5,
      "count": 16
    }
  },
  {
    "name": "LAPTOP LENOVO LOQ 15IAX9E I5 12450HX/16GB/SSD 512GB/VGA 2050 4GB/LCD 15.6INCH 144HZ - BH 04/2027",
    "slug": "laptop-lenovo-loq-15iax9e-i5-12450hx16gbssd-512gbvga-2050-4gblcd-156inch-144hz-bh-042027",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 14900000,
    "originalPrice": 15900000,
    "discountPrice": 14900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784815877841-756804407.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784815877841-756804407.webp",
      "https://zcomputer.vn/uploads/image-1784815880599-450378088.webp",
      "https://zcomputer.vn/uploads/image-1784815882336-734376375.webp",
      "https://zcomputer.vn/uploads/image-1784815879204-157587807.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 90,
    "ratings": {
      "average": 5,
      "count": 33
    }
  },
  {
    "name": "\tLAPTOP ASUS TUF FX507C4-HN074W I5 12450H/8GB/SSD 512GB/VGA 3050 4GB/LCD 15.6INCH 144HZ ( BLACK)",
    "slug": "laptop-asus-tuf-fx507c4-hn074w-i5-12450h8gbssd-512gbvga-3050-4gblcd-156inch-144hz-black",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 13900000,
    "originalPrice": 14900000,
    "discountPrice": 13900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784303103590-46868889.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784303103590-46868889.webp",
      "https://zcomputer.vn/uploads/image-1784303107077-463663129.webp",
      "https://zcomputer.vn/uploads/image-1784303105253-831013801.webp",
      "https://zcomputer.vn/uploads/image-1784303108712-983004616.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 58,
    "ratings": {
      "average": 5,
      "count": 11
    }
  },
  {
    "name": "LAPTOP ASUS VIVOBOOK X1605VA-MB360W I5 1335U/16GB/SSD 512GB/INTEL UHD/LCD 16INCH WUXGA IPS",
    "slug": "laptop-asus-vivobook-x1605va-mb360w-i5-1335u16gbssd-512gbintel-uhdlcd-16inch-wuxga-ips",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 9900000,
    "originalPrice": 11000000,
    "discountPrice": 9900000,
    "discountPercent": 10,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784302026836-486068069.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784302026836-486068069.webp",
      "https://zcomputer.vn/uploads/image-1784302028410-382592699.webp",
      "https://zcomputer.vn/uploads/image-1784302029884-880536128.webp",
      "https://zcomputer.vn/uploads/image-1784302031459-998927115.webp",
      "https://zcomputer.vn/uploads/image-1784302032795-801099066.webp",
      "https://zcomputer.vn/uploads/image-1784302034057-248484337.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 103,
    "ratings": {
      "average": 5,
      "count": 15
    }
  },
  {
    "name": "LAPTOP DELL LATITUDE 5430 I7 1225U/16GB/SSD 512GB/LCD 14INCH FHD",
    "slug": "laptop-dell-latitude-5430-i7-1225u16gbssd-512gblcd-14inch-fhd",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 10500000,
    "originalPrice": 11500000,
    "discountPrice": 10500000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784474068652-898190479.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784474068652-898190479.webp",
      "https://zcomputer.vn/uploads/image-1784474069876-616167379.webp",
      "https://zcomputer.vn/uploads/image-1784474072015-33392405.webp",
      "https://zcomputer.vn/uploads/image-1784474073811-236776768.webp",
      "https://zcomputer.vn/uploads/image-1784474071108-389406309.webp",
      "https://zcomputer.vn/uploads/image-1784474072916-956706890.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 72,
    "ratings": {
      "average": 5,
      "count": 33
    }
  },
  {
    "name": "LAPTOP ASUS ROG STRIX G513IC-HN246W R7 4800H/16GB/512GB/ VGA RTX 3050Ti 4GB/LCD 15.6INCH 144HZ/Win 11",
    "slug": "laptop-asus-rog-strix-g513ic-hn246w-r7-4800h16gb512gb-vga-rtx-3050ti-4gblcd-156inch-144hzwin-11",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 14500000,
    "originalPrice": 16000000,
    "discountPrice": 14500000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784301053278-476929796.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784301053278-476929796.webp",
      "https://zcomputer.vn/uploads/image-1784301060370-383932055.webp",
      "https://zcomputer.vn/uploads/image-1784301056532-611590212.webp",
      "https://zcomputer.vn/uploads/image-1784301057808-150265401.webp",
      "https://zcomputer.vn/uploads/image-1784301055045-480831804.webp",
      "https://zcomputer.vn/uploads/image-1784301059009-429222952.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 112,
    "ratings": {
      "average": 5,
      "count": 31
    }
  },
  {
    "name": "LAPTOP ROG ZEPHYRUS G14 GA402RJ RYZEN 9 6900HS/16GB/SSD 512GB/VGA RX 6700S 8GB/LCD 14INCH QHD 120HZ WHITE",
    "slug": "laptop-rog-zephyrus-g14-ga402rj-ryzen-9-6900hs16gbssd-512gbvga-rx-6700s-8gblcd-14inch-qhd-120hz-white",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 21500000,
    "originalPrice": 23000000,
    "discountPrice": 21500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 24,
    "ratings": {
      "average": 5,
      "count": 15
    }
  },
  {
    "name": "\tLAPTOP LENOVO THINKPAD T14S GEN 3 I7 1260P/16GB/SSD 512GB/ LCD 14INCH IPS WUXGA (1920 x 1200)",
    "slug": "laptop-lenovo-thinkpad-t14s-gen-3-i7-1260p16gbssd-512gb-lcd-14inch-ips-wuxga-1920-x-1200-1784191669383",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 13500000,
    "originalPrice": 15000000,
    "discountPrice": 13500000,
    "discountPercent": 10,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 29,
    "ratings": {
      "average": 5,
      "count": 20
    }
  },
  {
    "name": "LAPTOP LENOVO LOQ 15ARP9 2024 R5 7235HS/12GB/SSD 512GB/VGA RTX 3050 6G/LCD 15.6INCH FHD 144HZ",
    "slug": "laptop-lenovo-loq-15arp9-2024-r5-7235hs12gbssd-512gbvga-rtx-3050-6glcd-156inch-fhd-144hz",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 15900000,
    "originalPrice": 17000000,
    "discountPrice": 15900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784814476067-510418034.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784814476067-510418034.webp",
      "https://zcomputer.vn/uploads/image-1784814479001-791254550.webp",
      "https://zcomputer.vn/uploads/image-1784814478062-994298654.webp",
      "https://zcomputer.vn/uploads/image-1784814477098-58734374.webp",
      "https://zcomputer.vn/uploads/image-1784814480203-197042640.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 18,
    "ratings": {
      "average": 5,
      "count": 11
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD P15S GEN 2 I7 1165G7/16GB/SSD 512GB/VGA QUADRO T500 4G/LCD 15.6INCH FHD",
    "slug": "laptop-lenovo-thinkpad-p15s-gen-2-i7-1165g716gbssd-512gbvga-quadro-t500-4glcd-156inch-fhd",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 11900000,
    "originalPrice": 13000000,
    "discountPrice": 11900000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 15,
    "ratings": {
      "average": 5,
      "count": 32
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD X1 TABLE GEN 1 I7 8650U/16GB/SSD 512GB/LCD 14INCH 2K (3000X2000) TOUCH",
    "slug": "laptop-lenovo-thinkpad-x1-table-gen-1-i7-8650u16gbssd-512gblcd-14inch-2k-3000x2000-touch",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 7500000,
    "originalPrice": 9000000,
    "discountPrice": 7500000,
    "discountPercent": 17,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 46,
    "ratings": {
      "average": 5,
      "count": 15
    }
  },
  {
    "name": "LAPTOP MSI GAMING THIN 15 B12UCX I5 12450H/16GB/SSD 512GB/VGA RTX 2050 4GB/LCD 15.6INCH FHD 144HZ",
    "slug": "laptop-msi-gaming-thin-15-b12ucx-i5-12450h16gbssd-512gbvga-rtx-2050-4gblcd-156inch-fhd-144hz",
    "brand": "MSI",
    "categoryName": "Laptop MSI",
    "categorySlug": "laptop-msi",
    "price": 12500000,
    "originalPrice": 13500000,
    "discountPrice": 12500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784364825864-216323564.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784364825864-216323564.webp",
      "https://zcomputer.vn/uploads/image-1784364829269-564885905.webp",
      "https://zcomputer.vn/uploads/image-1784364828177-209580603.webp",
      "https://zcomputer.vn/uploads/image-1784364826966-489100394.webp",
      "https://zcomputer.vn/uploads/image-1784364830454-27457463.webp",
      "https://zcomputer.vn/uploads/image-1784364831634-424618562.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 50,
    "ratings": {
      "average": 5,
      "count": 32
    }
  },
  {
    "name": "LAPTOP LEGION 5 PRO Y9000P I7 12700H/16GB/SSD 512GB/VGA RTX 3060 6GB/LCD 16INCH 2K5 165HZ",
    "slug": "laptop-legion-5-pro-y9000p-i7-12700h16gbssd-512gbvga-rtx-3060-6gblcd-16inch-2k5-165hz",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 22500000,
    "originalPrice": 23500000,
    "discountPrice": 22500000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784191233862-258052802.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784191233862-258052802.webp",
      "https://zcomputer.vn/uploads/image-1784191231802-82178566.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 89,
    "ratings": {
      "average": 5,
      "count": 22
    }
  },
  {
    "name": "LAPTOP LENOVO LOQ 2023 CORE I5 12450HX/12GB/SSD 512GB/VGA RTX 3050 6G/LCD 15.6INCH FHD 144HZ BHH 8/2026",
    "slug": "laptop-lenovo-loq-2023-core-i5-12450hx12gbssd-512gbvga-rtx-3050-6glcd-156inch-fhd-144hz-bhh-82026",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 15900000,
    "originalPrice": 17000000,
    "discountPrice": 15900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 103,
    "ratings": {
      "average": 5,
      "count": 27
    }
  },
  {
    "name": "LAPTOP DELL PRECISION 5550 I7 10850H/16GB/SSD 512GB/VGA QUADRO T1000 4GB/LCD 15.6INCH FHD",
    "slug": "laptop-dell-precision-5550-i7-10850h16gbssd-512gbvga-quadro-t1000-4gblcd-156inch-fhd",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 12500000,
    "originalPrice": 14000000,
    "discountPrice": 12500000,
    "discountPercent": 11,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784472109865-242730239.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784472109865-242730239.webp",
      "https://zcomputer.vn/uploads/image-1784472115261-761999069.webp",
      "https://zcomputer.vn/uploads/image-1784472112441-882242133.webp",
      "https://zcomputer.vn/uploads/image-1784472111143-840806143.webp",
      "https://zcomputer.vn/uploads/image-1784472113961-259508692.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 47,
    "ratings": {
      "average": 5,
      "count": 8
    }
  },
  {
    "name": "LAPTOP GIGABYTE AORUS 15 I7 10870H /16GB/SSD 512GB/VGA RTX 3080 8GDDR6/LCD 15.6INCH FHD 240HZ",
    "slug": "laptop-gigabyte-aorus-15-i7-10870h-16gbssd-512gbvga-rtx-3080-8gddr6lcd-156inch-fhd-240hz",
    "brand": "Gigabyte",
    "categoryName": "Laptop Gigabyte",
    "categorySlug": "laptop-gigabyte",
    "price": 18900000,
    "originalPrice": 20000000,
    "discountPrice": 18900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784292895170-121105326.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784292895170-121105326.webp",
      "https://zcomputer.vn/uploads/image-1784292902063-495388080.webp",
      "https://zcomputer.vn/uploads/image-1784292897998-41121845.webp",
      "https://zcomputer.vn/uploads/image-1784292899304-670889826.webp",
      "https://zcomputer.vn/uploads/image-1784292896499-37988620.webp",
      "https://zcomputer.vn/uploads/image-1784292900683-346751011.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 134,
    "ratings": {
      "average": 5,
      "count": 21
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD T14 GEN 3 RYZEN 5 PRO 6650U/32GB/SSD 512GB/LCD 14INCH WUXGA (1920 x 1200)",
    "slug": "laptop-lenovo-thinkpad-t14-gen-3-ryzen-5-pro-6650u32gbssd-512gblcd-14inch-wuxga-1920-x-1200",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 14900000,
    "originalPrice": 15900000,
    "discountPrice": 14900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784629292074-441800077.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784629292074-441800077.webp",
      "https://zcomputer.vn/uploads/image-1784629293473-616785814.webp",
      "https://zcomputer.vn/uploads/image-1784629297028-420830975.webp",
      "https://zcomputer.vn/uploads/image-1784629295969-196957955.webp",
      "https://zcomputer.vn/uploads/image-1784629294726-574732155.webp",
      "https://zcomputer.vn/uploads/image-1784629298035-205609599.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 42,
    "ratings": {
      "average": 5,
      "count": 25
    }
  },
  {
    "name": "LAPTOP LENOVO YOGA 7I 16IRL8 I7 1355U/16GB/SSD 512GB/LCD 16INCH WUXGA (1920 x 1200)",
    "slug": "laptop-lenovo-yoga-7i-16irl8-i7-1355u16gbssd-512gblcd-16inch-wuxga-1920-x-1200",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 14900000,
    "originalPrice": 15900000,
    "discountPrice": 14900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 53,
    "ratings": {
      "average": 5,
      "count": 13
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD P1 GEN 3 I7 10850H/16GB/SSD 512GB/VGA QUADRO T2000 4GB/LCD 15.6INCH FHD",
    "slug": "laptop-lenovo-thinkpad-p1-gen-3-i7-10850h16gbssd-512gbvga-quadro-t2000-4gblcd-156inch-fhd",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 13900000,
    "originalPrice": 14900000,
    "discountPrice": 13900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784624119203-597957252.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784624119203-597957252.webp",
      "https://zcomputer.vn/uploads/image-1784624123090-455594886.webp",
      "https://zcomputer.vn/uploads/image-1784624121161-302654336.webp",
      "https://zcomputer.vn/uploads/image-1784624120042-33512583.webp",
      "https://zcomputer.vn/uploads/image-1784624122250-879624159.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 86,
    "ratings": {
      "average": 5,
      "count": 25
    }
  },
  {
    "name": "LAPTOP HP ZBOOK POWER G7 I7 10850H /16GB/SSD 512GB/VGA QUADRO T1000 4G/LCD 15.6INCH FHD",
    "slug": "laptop-hp-zbook-power-g7-i7-10850h-16gbssd-512gbvga-quadro-t1000-4glcd-156inch-fhd",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 12500000,
    "originalPrice": 13500000,
    "discountPrice": 12500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 66,
    "ratings": {
      "average": 5,
      "count": 10
    }
  },
  {
    "name": "LAPTOP ASUS TUF FA507RC-HN051W RYZEN 7 6800H/16GB/512GB/ RTX 3050 4GB/LCD 15.6INCH 144HZ",
    "slug": "laptop-asus-tuf-fa507rc-hn051w-ryzen-7-6800h16gb512gb-rtx-3050-4gblcd-156inch-144hz",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 14900000,
    "originalPrice": 16000000,
    "discountPrice": 14900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786356201115-708593356.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786356201115-708593356.webp",
      "https://zcomputer.vn/uploads/image-1786356202558-165798634.webp",
      "https://zcomputer.vn/uploads/image-1786356207234-994986505.webp",
      "https://zcomputer.vn/uploads/image-1786356205586-926032425.webp",
      "https://zcomputer.vn/uploads/image-1786356204110-433262519.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 49,
    "ratings": {
      "average": 5,
      "count": 32
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD X1 CARBON GEN 9 I7 1185G7/16GB/SSD 256GB/LCD 14INCH WUXGA (1920 x 1200) TOUCH",
    "slug": "laptop-lenovo-thinkpad-x1-carbon-gen-9-i7-1185g716gbssd-256gblcd-14inch-wuxga-1920-x-1200-touch",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 12900000,
    "originalPrice": 13900000,
    "discountPrice": 12900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784621709704-221183655.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784621709704-221183655.webp",
      "https://zcomputer.vn/uploads/image-1784621761430-181065683.webp",
      "https://zcomputer.vn/uploads/image-1784621714381-835202210.webp",
      "https://zcomputer.vn/uploads/image-1784621712849-777997036.webp",
      "https://zcomputer.vn/uploads/image-1784621711378-504932513.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 31,
    "ratings": {
      "average": 5,
      "count": 17
    }
  },
  {
    "name": "LAPTOP SURFACE 4 I7 1185G7/RAM 16GB/SSD 512GB/LCD 15INCH CẢM ỨNG 2K5",
    "slug": "laptop-surface-4-i7-1185g7ram-16gbssd-512gblcd-15inch-cam-ung-2k5",
    "brand": "SURFACE",
    "categoryName": "Laptop Surface",
    "categorySlug": "laptop-surface",
    "price": 11900000,
    "originalPrice": 13000000,
    "discountPrice": 11900000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785585540411-129913577.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785585540411-129913577.webp",
      "https://zcomputer.vn/uploads/image-1785585544578-73233341.webp",
      "https://zcomputer.vn/uploads/image-1785585542611-870033215.webp",
      "https://zcomputer.vn/uploads/image-1785585541409-579221231.webp",
      "https://zcomputer.vn/uploads/image-1785585543618-724941453.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 55,
    "ratings": {
      "average": 5,
      "count": 31
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD X1 CARBON GEN 10 I7 1270P/16GB/SSD 256GB/LCD 14INCH WUXGA (1920 x 1200) TOUCH",
    "slug": "laptop-lenovo-thinkpad-x1-carbon-gen-10-i7-1270p16gbssd-256gblcd-14inch-wuxga-1920-x-1200-touch",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 17900000,
    "originalPrice": 18900000,
    "discountPrice": 17900000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784620287178-686249383.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784620287178-686249383.webp",
      "https://zcomputer.vn/uploads/image-1784620290469-331419148.webp",
      "https://zcomputer.vn/uploads/image-1784620291823-93508435.webp",
      "https://zcomputer.vn/uploads/image-1784620293109-39370275.webp",
      "https://zcomputer.vn/uploads/image-1784620288654-31515590.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 100,
    "ratings": {
      "average": 5,
      "count": 32
    }
  },
  {
    "name": "LAPTOP DELL 16 DC16251 CORE 7 150U/16GB/SSD 512GB/VGA NVIDIA MX570 2G/LCD 16INCH WUXGA (1920 x 1200) 60HZ",
    "slug": "laptop-dell-16-dc16251-core-7-150u16gbssd-512gbvga-nvidia-mx570-2glcd-16inch-wuxga-1920-x-1200-60hz",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 14900000,
    "originalPrice": 16000000,
    "discountPrice": 14900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 76,
    "ratings": {
      "average": 5,
      "count": 28
    }
  },
  {
    "name": "LAPTOP HP PROBOOK 440 G10 I7 1335U/16GB/SSD 512GB/LCD 14INCH FHD",
    "slug": "laptop-hp-probook-440-g10-i7-1335u16gbssd-512gblcd-14inch-fhd",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 12500000,
    "originalPrice": 13500000,
    "discountPrice": 12500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 48,
    "ratings": {
      "average": 5,
      "count": 28
    }
  },
  {
    "name": "LAPTOP HP PROBOOK 440 G9 I7 1255U/16GB/SSD 256GB/LCD 14INCH FHD",
    "slug": "laptop-hp-probook-440-g9-i7-1255u16gbssd-256gblcd-14inch-fhd",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 10500000,
    "originalPrice": 11500000,
    "discountPrice": 10500000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784189439215-27150255.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784189439215-27150255.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 41,
    "ratings": {
      "average": 5,
      "count": 28
    }
  },
  {
    "name": "LAPTOP HP ENVY X360 2-IN-1 14-es1023dx CORE 7 150U/16GB/SSD 512GB/LCD 14INCH FHD TOUCH",
    "slug": "laptop-hp-envy-x360-2-in-1-14-es1023dx-core-7-150u16gbssd-512gblcd-14inch-fhd-touch",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 14500000,
    "originalPrice": 16000000,
    "discountPrice": 14500000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784818497134-177673041.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784818497134-177673041.webp",
      "https://zcomputer.vn/uploads/image-1784818498368-971353084.webp",
      "https://zcomputer.vn/uploads/image-1784818499559-578861946.webp",
      "https://zcomputer.vn/uploads/image-1784818504056-74976334.webp",
      "https://zcomputer.vn/uploads/image-1784818501648-609054500.webp",
      "https://zcomputer.vn/uploads/image-1784818500635-514411853.webp",
      "https://zcomputer.vn/uploads/image-1784818502880-377297666.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 31,
    "ratings": {
      "average": 5,
      "count": 8
    }
  },
  {
    "name": "LAPTOP DELL XPS 15 7590 I9 9980HK/16GB/SSD 512GB/VGA GTX 1650 4GB/LCD 15.6INCH 4K UHD (3840 x 2160)",
    "slug": "laptop-dell-xps-15-7590-i9-9980hk16gbssd-512gbvga-gtx-1650-4gblcd-156inch-4k-uhd-3840-x-2160",
    "brand": "DELL",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 13500000,
    "originalPrice": 15000000,
    "discountPrice": 13500000,
    "discountPercent": 10,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784292638125-651199739.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784292638125-651199739.webp",
      "https://zcomputer.vn/uploads/image-1784209770081-128814062.webp",
      "https://zcomputer.vn/uploads/image-1784209768437-382144406.webp",
      "https://zcomputer.vn/uploads/image-1784209767552-305755433.webp",
      "https://zcomputer.vn/uploads/image-1784209765762-743779602.webp",
      "https://zcomputer.vn/uploads/image-1784209766589-140007520.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 134,
    "ratings": {
      "average": 5,
      "count": 26
    }
  },
  {
    "name": "LAPTOP HP 15-fd0083TU i7 1355U/16GB/SSD 512GB/LCD 15.6INCH FHD",
    "slug": "laptop-hp-15-fd0083tu-i7-1355u16gbssd-512gblcd-156inch-fhd",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 11500000,
    "originalPrice": 13000000,
    "discountPrice": 11500000,
    "discountPercent": 12,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784818097591-634321994.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784818097591-634321994.webp",
      "https://zcomputer.vn/uploads/image-1784818099387-419474740.webp",
      "https://zcomputer.vn/uploads/image-1784818103823-339115559.webp",
      "https://zcomputer.vn/uploads/image-1784818102392-370275860.webp",
      "https://zcomputer.vn/uploads/image-1784818100785-394132545.webp",
      "https://zcomputer.vn/uploads/image-1784818104979-902174156.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 58,
    "ratings": {
      "average": 5,
      "count": 33
    }
  },
  {
    "name": "LAPTOP LENOVO LEGION 5 2022 RYZEN 7 6800H/16GB/SSD 512GB/VGA RTX 3050TI 4GB/LCD 15.6INCH 2K 165HZ",
    "slug": "laptop-lenovo-legion-5-2022-ryzen-7-6800h16gbssd-512gbvga-rtx-3050ti-4gblcd-156inch-2k-165hz",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 18500000,
    "originalPrice": 19500000,
    "discountPrice": 18500000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784619126144-173437919.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784619126144-173437919.webp",
      "https://zcomputer.vn/uploads/image-1784619134284-580006983.webp",
      "https://zcomputer.vn/uploads/image-1784619132605-733327483.webp",
      "https://zcomputer.vn/uploads/image-1784619131133-352058248.webp",
      "https://zcomputer.vn/uploads/image-1784619127933-36082635.webp",
      "https://zcomputer.vn/uploads/image-1784619129533-352073397.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 105,
    "ratings": {
      "average": 5,
      "count": 25
    }
  },
  {
    "name": "LAPTOP ASUS VIVOBOOK PRO 15 N6506MJ ULTRA 7 155H/16GB/SSD 512GB/VGA RTX 3050 6GB/LCD 15.6INCH FHD OLED",
    "slug": "laptop-asus-vivobook-pro-15-n6506mj-ultra-7-155h16gbssd-512gbvga-rtx-3050-6gblcd-156inch-fhd-oled",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 17900000,
    "originalPrice": 18900000,
    "discountPrice": 17900000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784297770629-952459447.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784297770629-952459447.webp",
      "https://zcomputer.vn/uploads/image-1784297769029-122942771.webp",
      "https://zcomputer.vn/uploads/image-1784297765088-223634951.webp",
      "https://zcomputer.vn/uploads/image-1784297771933-31356851.webp",
      "https://zcomputer.vn/uploads/image-1784297767124-596704473.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 125,
    "ratings": {
      "average": 5,
      "count": 30
    }
  },
  {
    "name": "LAPTOP DELL INSPIRON 16 5620 I7 1255U/16GB/SSD 512GB/LCD 16INCH WUXGA (1920 x 1200) 60HZ",
    "slug": "laptop-dell-inspiron-16-5620-i7-1255u16gbssd-512gblcd-16inch-wuxga-1920-x-1200-60hz",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 11900000,
    "originalPrice": 13000000,
    "discountPrice": 11900000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 100,
    "ratings": {
      "average": 5,
      "count": 26
    }
  },
  {
    "name": "LAPTOP HP VICTUS 15-FB1013DX RYZEN 5 7535HS/16GB/SSD 512GB/VGA RTX 2050 4GB/LCD 15.6INCH FHD 144HZ",
    "slug": "laptop-hp-victus-15-fb1013dx-ryzen-5-7535hs16gbssd-512gbvga-rtx-2050-4gblcd-156inch-fhd-144hz",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 12500000,
    "originalPrice": 13500000,
    "discountPrice": 12500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 108,
    "ratings": {
      "average": 5,
      "count": 23
    }
  },
  {
    "name": "LAPTOP DELL INSPIRON 14 7420 I7 1255U/16GB/SSD 512GB/LCD 14INCH WUXGA (1920 x 1200) 60HZ",
    "slug": "laptop-dell-inspiron-14-7420-i7-1255u16gbssd-512gblcd-14inch-wuxga-1920-x-1200-60hz",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 11500000,
    "originalPrice": 13000000,
    "discountPrice": 11500000,
    "discountPercent": 12,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 42,
    "ratings": {
      "average": 5,
      "count": 10
    }
  },
  {
    "name": "LAPTOP HP ELITEBOOK 640 G9 I7 1265U/16GB/SSD 256GB/LCD 14INCH FHD",
    "slug": "laptop-hp-elitebook-640-g9-i7-1265u16gbssd-256gblcd-14inch-fhd",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 10900000,
    "originalPrice": 12000000,
    "discountPrice": 10900000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784188670368-982593356.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784188670368-982593356.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 92,
    "ratings": {
      "average": 5,
      "count": 21
    }
  },
  {
    "name": "LAPTOP LENOVO LEGION Y7000P 2022 I7 12700H/16GB/SSD 512GB/RTX 3050 4GB /LCD 15.6INCH 2K5 165HZ",
    "slug": "laptop-lenovo-legion-y7000p-2022-i7-12700h16gbssd-512gbrtx-3050-4gb-lcd-156inch-2k5-165hz",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 19390000,
    "originalPrice": 22000000,
    "discountPrice": 19390000,
    "discountPercent": 12,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784618402874-277687268.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784618402874-277687268.webp",
      "https://zcomputer.vn/uploads/image-1784618410938-726790636.webp",
      "https://zcomputer.vn/uploads/image-1784618406833-628947836.webp",
      "https://zcomputer.vn/uploads/image-1784618409345-400535911.webp",
      "https://zcomputer.vn/uploads/image-1784618408087-701225839.webp",
      "https://zcomputer.vn/uploads/image-1784618405564-412130758.webp",
      "https://zcomputer.vn/uploads/image-1784618404167-202369315.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 60,
    "ratings": {
      "average": 5,
      "count": 18
    }
  },
  {
    "name": "LAPTOP HP OMNIBOOK 7 16-AZ0001NR CORE 9 270H/16GB/SSD 1TB/LCD 16INCH WQXGA (2560x1600) 240HZ 500nit",
    "slug": "laptop-hp-omnibook-7-16-az0001nr-core-9-270h16gbssd-1tblcd-16inch-wqxga-2560x1600-240hz-500nit",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 19000000,
    "originalPrice": 22000000,
    "discountPrice": 19000000,
    "discountPercent": 14,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 42,
    "ratings": {
      "average": 5,
      "count": 31
    }
  },
  {
    "name": "LAPTOP DELL PRECISION 7560 I7 11850H/16GB/SSD 512GB/VGA RTX A3000 6GDDR6/LCD 15.6INCH FHD",
    "slug": "laptop-dell-precision-7560-i7-11850h16gbssd-512gbvga-rtx-a3000-6gddr6lcd-156inch-fhd",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 19900000,
    "originalPrice": 22000000,
    "discountPrice": 19900000,
    "discountPercent": 10,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784206621249-974142629.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784206621249-974142629.webp",
      "https://zcomputer.vn/uploads/image-1784205775388-798846443.webp",
      "https://zcomputer.vn/uploads/image-1784205774398-45167266.webp",
      "https://zcomputer.vn/uploads/image-1784205773037-690605437.webp",
      "https://zcomputer.vn/uploads/image-1784205771953-268315203.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 67,
    "ratings": {
      "average": 5,
      "count": 21
    }
  },
  {
    "name": "Mainboard Gigabyte B760M Gaming Plus Wifi DDR4 | LGA 1700, mATX, 4 khe RAM",
    "slug": "mainboard-gigabyte-b760m-gaming-plus-wifi-ddr4-or-lga-1700-matx-4-khe-ram",
    "brand": "Gigabyte",
    "categoryName": "Mainboard - Bo mạch chủ",
    "categorySlug": "mainboard-bo-mach-chu",
    "price": 2900000,
    "originalPrice": 2900000,
    "discountPrice": 2900000,
    "discountPercent": 0,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784172142364-148174215.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784172142364-148174215.webp",
      "https://zcomputer.vn/uploads/image-1784172143688-130979808.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 20,
    "ratings": {
      "average": 5,
      "count": 34
    }
  },
  {
    "name": "BỘ MÁY TÍNH B460M/I5 10400/RAM 16GB/SSD 240GB/VGA GTX 1650S 4G/650W/TẢN KHÍ/CASE GAMING KÈM 4 FAN LED",
    "slug": "bo-may-tinh-b460mi5-10400ram-16gbssd-240gbvga-gtx-1650s-4g650wtan-khicase-gaming-kem-4-fan-led",
    "brand": " ASROCK",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 8800000,
    "originalPrice": 9800000,
    "discountPrice": 8800000,
    "discountPercent": 10,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784106324026-564699541.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784106324026-564699541.webp",
      "https://zcomputer.vn/uploads/image-1784106321944-143901647.webp",
      "https://zcomputer.vn/uploads/image-1784106322977-727798310.webp",
      "https://zcomputer.vn/uploads/image-1784106324904-926612078.webp",
      "https://zcomputer.vn/uploads/image-1784106326049-626012895.webp",
      "https://zcomputer.vn/uploads/image-1784106327157-275652723.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 50,
    "ratings": {
      "average": 5,
      "count": 16
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M/I5 13500/RAM 16GB/SSD 500GB/VGA RTX 3060 12G/NGUỒN 650W/TẢN KHÍ/CASE XIGMATEK KÈM 3 FAN LED",
    "slug": "bo-may-tinh-b760mi5-13500ram-16gbssd-500gbvga-rtx-3060-12gnguon-650wtan-khicase-xigmatek-kem-3-fan-led",
    "brand": " ASROCK",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 19900000,
    "originalPrice": 20900000,
    "discountPrice": 19900000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784106224491-164654638.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784106224491-164654638.webp",
      "https://zcomputer.vn/uploads/image-1784106220568-366274752.webp",
      "https://zcomputer.vn/uploads/image-1784106221356-282628570.webp",
      "https://zcomputer.vn/uploads/image-1784106222151-797139534.webp",
      "https://zcomputer.vn/uploads/image-1784106222948-723961133.webp",
      "https://zcomputer.vn/uploads/image-1784106223705-680145267.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 103,
    "ratings": {
      "average": 5,
      "count": 36
    }
  },
  {
    "name": "BỘ MÁY TÍNH B450M-A MSI/RYZEN 5 4600G/16GB/SSD 512GB/NGUỒN 450W/CASE",
    "slug": "bo-may-tinh-b450m-a-msiryzen-5-4600g16gbssd-512gbnguon-450wcase",
    "brand": "MSI",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 6900000,
    "originalPrice": 7900000,
    "discountPrice": 6900000,
    "discountPercent": 13,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784106079929-466681533.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784106079929-466681533.webp",
      "https://zcomputer.vn/uploads/image-1784106075700-297247455.webp",
      "https://zcomputer.vn/uploads/image-1784106077054-536971812.webp",
      "https://zcomputer.vn/uploads/image-1784106078493-707615508.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 49,
    "ratings": {
      "average": 5,
      "count": 27
    }
  },
  {
    "name": "BỘ MÁY TÍNH H610M/I5 12400F/RAM 16GB/SSD 512GB/VGA RTX 2060 12G/550W/TẢN KHÍ/CASE MAGIC BỂ CÁ KÈM 3 FAN LED WHITE",
    "slug": "bo-may-tinh-h610mi5-12400fram-16gbssd-512gbvga-rtx-2060-12g550wtan-khicase-magic-be-ca-kem-3-fan-led-white",
    "brand": "ASUS",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 13900000,
    "originalPrice": 14900000,
    "discountPrice": 13900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784105957824-573611034.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784105957824-573611034.webp",
      "https://zcomputer.vn/uploads/image-1784105954546-755653144.webp",
      "https://zcomputer.vn/uploads/image-1784105955204-704228693.webp",
      "https://zcomputer.vn/uploads/image-1784105955883-765975672.webp",
      "https://zcomputer.vn/uploads/image-1784105956621-363190237.webp",
      "https://zcomputer.vn/uploads/image-1784105957170-558046461.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 70,
    "ratings": {
      "average": 5,
      "count": 28
    }
  },
  {
    "name": "BỘ MÁY TÍNH MSI B365M/I5 9400F/16GB/SSD 256GB/VGA 960 4GB/NGUỒN 550W/CASE LED GAMING+ TẢN KHÍ RGB",
    "slug": "bo-may-tinh-msi-b365mi5-9400f16gbssd-256gbvga-960-4gbnguon-550wcase-led-gaming-tan-khi-rgb",
    "brand": "MSI",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 6690000,
    "originalPrice": 7690000,
    "discountPrice": 6690000,
    "discountPercent": 13,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784105842168-363924666.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784105842168-363924666.webp",
      "https://zcomputer.vn/uploads/image-1784105840746-1826057.webp",
      "https://zcomputer.vn/uploads/image-1784105841532-468600567.webp",
      "https://zcomputer.vn/uploads/image-1784105842827-402108959.webp",
      "https://zcomputer.vn/uploads/image-1784105843453-507330368.webp",
      "https://zcomputer.vn/uploads/image-1784105843991-380297734.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 102,
    "ratings": {
      "average": 5,
      "count": 18
    }
  },
  {
    "name": "BỘ MÁY TÍNH H610M-HVS ASROCK/I5 12400F/16GB/SSD 512GB COLORFUL/VGA RTX 3060 12GB ASL/NGUỒN 650W/TẢN NHIỆT KHÍ/CASE LED KÈM 3 FAN",
    "slug": "bo-may-tinh-h610m-hvs-asrocki5-12400f16gbssd-512gb-colorfulvga-rtx-3060-12gb-aslnguon-650wtan-nhiet-khicase-led-kem-3-fan",
    "brand": "Asrock",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 16900000,
    "originalPrice": 17900000,
    "discountPrice": 16900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784105420090-911059966.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784105420090-911059966.webp",
      "https://zcomputer.vn/uploads/image-1784105418355-604642484.webp",
      "https://zcomputer.vn/uploads/image-1784105419329-60252409.webp",
      "https://zcomputer.vn/uploads/image-1784105421658-279162487.webp",
      "https://zcomputer.vn/uploads/image-1784105422359-664575918.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 87,
    "ratings": {
      "average": 5,
      "count": 33
    }
  },
  {
    "name": "BỘ MÁY TÍNH H610M/I5 12400F/RAM 16GB/SSD 512GB/VGA RTX 3050 6GB/750W/TẢN KHÍ/CASE XIGMATEK KÈM 3 FAN LED",
    "slug": "bo-may-tinh-h610mi5-12400fram-16gbssd-512gbvga-rtx-3050-6gb750wtan-khicase-xigmatek-kem-3-fan-led",
    "brand": "ASUS",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 13900000,
    "originalPrice": 14900000,
    "discountPrice": 13900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784105319457-293946368.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784105319457-293946368.webp",
      "https://zcomputer.vn/uploads/image-1784105318635-625840831.webp",
      "https://zcomputer.vn/uploads/image-1784105320175-844338390.webp",
      "https://zcomputer.vn/uploads/image-1784105320830-317401034.webp",
      "https://zcomputer.vn/uploads/image-1784105321439-152101217.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 65,
    "ratings": {
      "average": 5,
      "count": 25
    }
  },
  {
    "name": "MÁY BỘ MINI LENOVO THINKSTATION P340 TINY I9 10900T/16GB/SSD 256GB/VGA QUADRO P1000 4G/WIFI +BT",
    "slug": "may-bo-mini-lenovo-thinkstation-p340-tiny-i9-10900t16gbssd-256gbvga-quadro-p1000-4gwifi-bt",
    "brand": "Lenovo",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 12900000,
    "originalPrice": 13900000,
    "discountPrice": 12900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784105239633-679344536.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784105239633-679344536.webp",
      "https://zcomputer.vn/uploads/image-1784105233695-326591908.webp",
      "https://zcomputer.vn/uploads/image-1784105234977-575123424.webp",
      "https://zcomputer.vn/uploads/image-1784105236027-592790935.webp",
      "https://zcomputer.vn/uploads/image-1784105236840-316311086.webp",
      "https://zcomputer.vn/uploads/image-1784105237829-922738272.webp",
      "https://zcomputer.vn/uploads/image-1784105238736-231089150.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 46,
    "ratings": {
      "average": 5,
      "count": 29
    }
  },
  {
    "name": "BỘ MÁY TÍNH H610M/I5 12400F/RAM 16GB/SSD 256GB/VGA RTX 3050 6GB/650W/TẢN KHÍ/CASE MAGIC KÈM 4 FAN LED",
    "slug": "bo-may-tinh-h610mi5-12400fram-16gbssd-256gbvga-rtx-3050-6gb650wtan-khicase-magic-kem-4-fan-led",
    "brand": "ASUS",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 12990000,
    "originalPrice": 13990000,
    "discountPrice": 12990000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784105126187-509536153.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784105126187-509536153.webp",
      "https://zcomputer.vn/uploads/image-1784105121118-32457978.webp",
      "https://zcomputer.vn/uploads/image-1784105122864-674257577.webp",
      "https://zcomputer.vn/uploads/image-1784105123617-617580610.webp",
      "https://zcomputer.vn/uploads/image-1784105124535-645629778.webp",
      "https://zcomputer.vn/uploads/image-1784105125410-162626273.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 57,
    "ratings": {
      "average": 5,
      "count": 30
    }
  },
  {
    "name": "BỘ MÁY TÍNH H610M/I5 12400F/RAM 16GB (8GB x 2)/SSD 256GB/VGA RTX 3050 6GB/600W/CASE BỂ CÁ MAGIC KÈM 1 FAN LED",
    "slug": "bo-may-tinh-h610mi5-12400fram-16gb-8gb-x-2ssd-256gbvga-rtx-3050-6gb600wcase-be-ca-magic-kem-1-fan-led",
    "brand": "ASUS",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 13900000,
    "originalPrice": 14900000,
    "discountPrice": 13900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784104982756-676557688.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784104982756-676557688.webp",
      "https://zcomputer.vn/uploads/image-1784104984326-456780197.webp",
      "https://zcomputer.vn/uploads/image-1784104985469-436998787.webp",
      "https://zcomputer.vn/uploads/image-1784104987073-884670030.webp",
      "https://zcomputer.vn/uploads/image-1784104988597-642149580.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 29,
    "ratings": {
      "average": 5,
      "count": 32
    }
  },
  {
    "name": "BỘ MÁY TÍNH H510M ASROCK/ I5 11400F/ RAM 16GB 3200/ SSD 512GB/RTX 3050 6GB/ NGUỒN 550W/ CASE AIGO C218M/ TẢN KHÍ -BH T12/2028 PCM",
    "slug": "bo-may-tinh-h510m-asrock-i5-11400f-ram-16gb-3200-ssd-512gbrtx-3050-6gb-nguon-550w-case-aigo-c218m-tan-khi-bh-t122028-pcm",
    "brand": "Asrock",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 10500000,
    "originalPrice": 11500000,
    "discountPrice": 10500000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784104351788-245947531.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784104351788-245947531.webp",
      "https://zcomputer.vn/uploads/image-1784104348909-67533545.webp",
      "https://zcomputer.vn/uploads/image-1784104349927-624830943.webp",
      "https://zcomputer.vn/uploads/image-1784104350898-473241978.webp",
      "https://zcomputer.vn/uploads/image-1784104352639-253361077.webp",
      "https://zcomputer.vn/uploads/image-1784104353671-136440779.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 81,
    "ratings": {
      "average": 5,
      "count": 34
    }
  },
  {
    "name": "BỘ MÁY TÍNH B450M/ R5 4600G/ RAM 16GB/ SSD 256GB/ NGUỒN 550W/ CASE GAMING/ TẢN KHÍ",
    "slug": "bo-may-tinh-b450m-r5-4600g-ram-16gb-ssd-256gb-nguon-550w-case-gaming-tan-khi",
    "brand": "Asrock",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 5900000,
    "originalPrice": 6900000,
    "discountPrice": 5900000,
    "discountPercent": 14,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784104162432-996897365.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784104162432-996897365.webp",
      "https://zcomputer.vn/uploads/image-1784104158345-167326589.webp",
      "https://zcomputer.vn/uploads/image-1784104159177-714199135.webp",
      "https://zcomputer.vn/uploads/image-1784104160366-926933716.webp",
      "https://zcomputer.vn/uploads/image-1784104161567-658588714.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 82,
    "ratings": {
      "average": 5,
      "count": 27
    }
  },
  {
    "name": "BỘ MÁY TÍNH B460M/ I5 10400F/ RAM 16GB/ SSD 256GB/ GTX 1650 4GB / 650W/ TẢN KHÍ/ CASE BỂ CÁ KÈM 3 FAN LED WHITE",
    "slug": "bo-may-tinh-b460m-i5-10400f-ram-16gb-ssd-256gb-gtx-1650-4gb-650w-tan-khi-case-be-ca-kem-3-fan-led-white",
    "brand": "ASUS",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 8500000,
    "originalPrice": 9500000,
    "discountPrice": 8500000,
    "discountPercent": 11,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784103976771-262145607.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784103976771-262145607.webp",
      "https://zcomputer.vn/uploads/image-1784103975925-651278448.webp",
      "https://zcomputer.vn/uploads/image-1784103977396-980964438.webp",
      "https://zcomputer.vn/uploads/image-1784103978322-392696010.webp",
      "https://zcomputer.vn/uploads/image-1784103978937-312413731.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 35,
    "ratings": {
      "average": 5,
      "count": 33
    }
  },
  {
    "name": "BỘ MÁY TÍNH H610M/I5 12400F/RAM 16GB/SSD 512GB/VGA RTX 5060 8GB/650W/TẢN KHÍ/CASE MAGIC KÈM 4 FAN LED BLACK",
    "slug": "bo-may-tinh-h610mi5-12400fram-16gbssd-512gbvga-rtx-5060-8gb650wtan-khicase-magic-kem-4-fan-led-black",
    "brand": "COLORFUL BATTLE",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 18500000,
    "originalPrice": 19500000,
    "discountPrice": 18500000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784103615993-351656705.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784103615993-351656705.webp",
      "https://zcomputer.vn/uploads/image-1784103612390-639464516.webp",
      "https://zcomputer.vn/uploads/image-1784103613424-86662150.webp",
      "https://zcomputer.vn/uploads/image-1784103614387-862362039.webp",
      "https://zcomputer.vn/uploads/image-1784103615298-296209639.webp",
      "https://zcomputer.vn/uploads/image-1784103616800-424349797.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 120,
    "ratings": {
      "average": 5,
      "count": 24
    }
  },
  {
    "name": "LAPTOP DELL LATITUDE 5430 I5 1235U/8GB/SSD 256GB/LCD 14INCH FHD",
    "slug": "laptop-dell-latitude-5430-i5-1235u8gbssd-256gblcd-14inch-fhd",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 7900000,
    "originalPrice": 8900000,
    "discountPrice": 7900000,
    "discountPercent": 11,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784102211164-538739723.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784102211164-538739723.webp",
      "https://zcomputer.vn/uploads/image-1784102215515-584300399.webp",
      "https://zcomputer.vn/uploads/image-1784102209957-87378847.webp",
      "https://zcomputer.vn/uploads/image-1784102213481-339233573.webp",
      "https://zcomputer.vn/uploads/image-1784102212381-587131709.webp",
      "https://zcomputer.vn/uploads/image-1784102214470-125510516.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 121,
    "ratings": {
      "average": 5,
      "count": 19
    }
  },
  {
    "name": "LAPTOP DELL LATITUDE 5591 I7 8850H/8GB/SSD 256GB/VGA MX 130 2G/LCD 15.6INCH FHD",
    "slug": "laptop-dell-latitude-5591-i7-8850h8gbssd-256gbvga-mx-130-2glcd-156inch-fhd",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 6500000,
    "originalPrice": 7500000,
    "discountPrice": 6500000,
    "discountPercent": 13,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784102073160-856934915.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784102073160-856934915.webp",
      "https://zcomputer.vn/uploads/image-1784102068568-601444774.webp",
      "https://zcomputer.vn/uploads/image-1784102069996-609119404.webp",
      "https://zcomputer.vn/uploads/image-1784102071444-636136689.webp",
      "https://zcomputer.vn/uploads/image-1784102074308-200999812.webp",
      "https://zcomputer.vn/uploads/image-1784102075443-918830026.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 76,
    "ratings": {
      "average": 5,
      "count": 14
    }
  },
  {
    "name": "LAPTOP MSI GAMING PULSE C1VGKG-061VN ULTRA 9 185H/AI/32GB/ SSD 1TB/ VGA RTX 4070 8GB/ LCD 16ICNH 2K 240HZ 4/2027",
    "slug": "laptop-msi-gaming-pulse-c1vgkg-061vn-ultra-9-185hai32gb-ssd-1tb-vga-rtx-4070-8gb-lcd-16icnh-2k-240hz-42027",
    "brand": "MSI",
    "categoryName": "Laptop MSI",
    "categorySlug": "laptop-msi",
    "price": 36900000,
    "originalPrice": 37900000,
    "discountPrice": 36900000,
    "discountPercent": 3,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784101943726-333202686.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784101943726-333202686.webp",
      "https://zcomputer.vn/uploads/image-1784101938392-281506736.webp",
      "https://zcomputer.vn/uploads/image-1784101939644-607166629.webp",
      "https://zcomputer.vn/uploads/image-1784101941121-639534071.webp",
      "https://zcomputer.vn/uploads/image-1784101942406-304414037.webp",
      "https://zcomputer.vn/uploads/image-1784101945058-629878381.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 89,
    "ratings": {
      "average": 5,
      "count": 15
    }
  },
  {
    "name": "LAPTOP DELL LATITUDE 5420 I5 1135G7/8GB/SSD 256GB/LCD 14INCH FHD",
    "slug": "laptop-dell-latitude-5420-i5-1135g78gbssd-256gblcd-14inch-fhd",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 6500000,
    "originalPrice": 7500000,
    "discountPrice": 6500000,
    "discountPercent": 13,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784101616930-178488591.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784101616930-178488591.webp",
      "https://zcomputer.vn/uploads/image-1784101617768-654686366.webp",
      "https://zcomputer.vn/uploads/image-1784101618525-566124579.webp",
      "https://zcomputer.vn/uploads/image-1784101619331-835483143.webp",
      "https://zcomputer.vn/uploads/image-1784101620126-597022950.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 39,
    "ratings": {
      "average": 5,
      "count": 28
    }
  },
  {
    "name": "LAPTOP ACER ASPIRE 3 A315-58 I5 1135G7/20GB/512GB/INTEL GRAPHICS/LCD 15.6INCH FULL HD",
    "slug": "laptop-acer-aspire-3-a315-58-i5-1135g720gb512gbintel-graphicslcd-156inch-full-hd",
    "brand": "Acer",
    "categoryName": "Laptop Acer",
    "categorySlug": "laptop-acer",
    "price": 6900000,
    "originalPrice": 7900000,
    "discountPrice": 6900000,
    "discountPercent": 13,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784101492088-873826944.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784101492088-873826944.webp",
      "https://zcomputer.vn/uploads/image-1784101490178-498691010.webp",
      "https://zcomputer.vn/uploads/image-1784101490808-644085038.webp",
      "https://zcomputer.vn/uploads/image-1784101491479-938691731.webp",
      "https://zcomputer.vn/uploads/image-1784101492687-810572470.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 100,
    "ratings": {
      "average": 5,
      "count": 18
    }
  },
  {
    "name": "LAPTOP ACER ASPIRE 5 A515-57 52Y2 I5 1235U/20GB/SSD 512GB/INTEL UHD/LCD 15.6INCH FHD",
    "slug": "laptop-acer-aspire-5-a515-57-52y2-i5-1235u20gbssd-512gbintel-uhdlcd-156inch-fhd",
    "brand": "Acer",
    "categoryName": "Laptop Acer",
    "categorySlug": "laptop-acer",
    "price": 8300000,
    "originalPrice": 9300000,
    "discountPrice": 8300000,
    "discountPercent": 11,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784101319945-623070003.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784101319945-623070003.webp",
      "https://zcomputer.vn/uploads/image-1784101316319-996695791.webp",
      "https://zcomputer.vn/uploads/image-1784101317234-630057624.webp",
      "https://zcomputer.vn/uploads/image-1784101317952-180955915.webp",
      "https://zcomputer.vn/uploads/image-1784101318554-456701798.webp",
      "https://zcomputer.vn/uploads/image-1784101319312-749664747.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 103,
    "ratings": {
      "average": 5,
      "count": 13
    }
  },
  {
    "name": "LAPTOP DELL G5 5587 I7 8750H/16GB/SSD 256GB/VGA GTX 1060 6G/LCD 15.6INCH FHD",
    "slug": "laptop-dell-g5-5587-i7-8750h16gbssd-256gbvga-gtx-1060-6glcd-156inch-fhd",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 8900000,
    "originalPrice": 9900000,
    "discountPrice": 8900000,
    "discountPercent": 10,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784100920117-61537603.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784100920117-61537603.webp",
      "https://zcomputer.vn/uploads/image-1784100915587-7225737.webp",
      "https://zcomputer.vn/uploads/image-1784100916917-818570537.webp",
      "https://zcomputer.vn/uploads/image-1784100917899-962155277.webp",
      "https://zcomputer.vn/uploads/image-1784100919049-857963169.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 120,
    "ratings": {
      "average": 5,
      "count": 9
    }
  },
  {
    "name": "LAPTOP MSI MODERM 15 H AI C2HMG ULTRA 7 255H/16GB/SSD 512GB/LCD 15.6INCH FHD - BH 01/2027",
    "slug": "laptop-msi-moderm-15-h-ai-c2hmg-ultra-7-255h16gbssd-512gblcd-156inch-fhd-bh-012027",
    "brand": "MSI",
    "categoryName": "Laptop MSI",
    "categorySlug": "laptop-msi",
    "price": 14500000,
    "originalPrice": 15500000,
    "discountPrice": 14500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784100752252-996438728.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784100752252-996438728.webp",
      "https://zcomputer.vn/uploads/image-1784100748378-828777423.webp",
      "https://zcomputer.vn/uploads/image-1784100749500-411560390.webp",
      "https://zcomputer.vn/uploads/image-1784100750420-749138682.webp",
      "https://zcomputer.vn/uploads/image-1784100751262-337559239.webp",
      "https://zcomputer.vn/uploads/image-1784100753235-200393215.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 69,
    "ratings": {
      "average": 5,
      "count": 10
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD X1 CARBON GEN 11 I7 1365U/32GB/SSD 512GB/LCD 14INCH WUXGA TOUCH",
    "slug": "laptop-lenovo-thinkpad-x1-carbon-gen-11-i7-1365u32gbssd-512gblcd-14inch-wuxga-touch",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 21900000,
    "originalPrice": 22900000,
    "discountPrice": 21900000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784100626319-110124735.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784100626319-110124735.webp",
      "https://zcomputer.vn/uploads/image-1784100621647-404477855.webp",
      "https://zcomputer.vn/uploads/image-1784100622630-498903908.webp",
      "https://zcomputer.vn/uploads/image-1784100623739-674196971.webp",
      "https://zcomputer.vn/uploads/image-1784100625220-954942130.webp",
      "https://zcomputer.vn/uploads/image-1784100627354-582217229.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 18,
    "ratings": {
      "average": 5,
      "count": 26
    }
  },
  {
    "name": "LAPTOP ACER ASPIRE 5 A515-58GM-53PZ I5 13420H/16GB/SSD 512GB/VGA 2050 4GB/LCD 15.6ICNH FHD",
    "slug": "laptop-acer-aspire-5-a515-58gm-53pz-i5-13420h16gbssd-512gbvga-2050-4gblcd-156icnh-fhd",
    "brand": "Acer",
    "categoryName": "Laptop Acer",
    "categorySlug": "laptop-acer",
    "price": 11500000,
    "originalPrice": 12500000,
    "discountPrice": 11500000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784100398108-352603408.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784100398108-352603408.webp",
      "https://zcomputer.vn/uploads/image-1784100393591-60059613.webp",
      "https://zcomputer.vn/uploads/image-1784100394546-903806756.webp",
      "https://zcomputer.vn/uploads/image-1784100395347-21217313.webp",
      "https://zcomputer.vn/uploads/image-1784100396219-304038347.webp",
      "https://zcomputer.vn/uploads/image-1784100397188-398072155.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 129,
    "ratings": {
      "average": 5,
      "count": 12
    }
  },
  {
    "name": "LAPTOP ASUS ROGSTRIX G531RM RYZEN 9 6900HX/16GB/SSD 512GB/VGA RTX 3060 6GB/LCD 15.6INCH 2K 165HZ",
    "slug": "laptop-asus-rogstrix-g531rm-ryzen-9-6900hx16gbssd-512gbvga-rtx-3060-6gblcd-156inch-2k-165hz",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 19900000,
    "originalPrice": 20900000,
    "discountPrice": 19900000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784099246463-599213610.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784099246463-599213610.webp",
      "https://zcomputer.vn/uploads/image-1784099241174-943758476.webp",
      "https://zcomputer.vn/uploads/image-1784099242478-888774975.webp",
      "https://zcomputer.vn/uploads/image-1784099243623-745483917.webp",
      "https://zcomputer.vn/uploads/image-1784099244666-767673666.webp",
      "https://zcomputer.vn/uploads/image-1784099245512-583739641.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 52,
    "ratings": {
      "average": 5,
      "count": 11
    }
  },
  {
    "name": "LAPTOP ASUS TUF GAMING FA507NV-LP046W R7 7735HS/AI/16GB/512GB/VGA RTX 4060 8GB/15.6\" FHD 144HZ/Win11 - BH 08/2026",
    "slug": "laptop-asus-tuf-gaming-fa507nv-lp046w-r7-7735hsai16gb512gbvga-rtx-4060-8gb156-fhd-144hzwin11-bh-082026",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 20900000,
    "originalPrice": 22900000,
    "discountPrice": 20900000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784093447251-15189463.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784093447251-15189463.webp",
      "https://zcomputer.vn/uploads/image-1784093440002-166478675.webp",
      "https://zcomputer.vn/uploads/image-1784093441635-894170151.webp",
      "https://zcomputer.vn/uploads/image-1784093443132-846515990.webp",
      "https://zcomputer.vn/uploads/image-1784093444522-694431801.webp",
      "https://zcomputer.vn/uploads/image-1784093445803-343921969.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 90,
    "ratings": {
      "average": 5,
      "count": 15
    }
  },
  {
    "name": "MACBOOK PRO 16INCH - M1 PRO 10CPU-16GPU/ 16GB/SSD 512GB (BẠC) PIN 98%",
    "slug": "macbook-pro-16inch-m1-pro-10cpu-16gpu-16gbssd-512gb-bac-pin-98percent",
    "brand": "Apple",
    "categoryName": "Macbook",
    "categorySlug": "macbook",
    "price": 22900000,
    "originalPrice": 25000000,
    "discountPrice": 22900000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784092801086-621278800.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784092801086-621278800.webp",
      "https://zcomputer.vn/uploads/image-1784092800321-859519423.webp",
      "https://zcomputer.vn/uploads/image-1784092799678-76180822.webp",
      "https://zcomputer.vn/uploads/image-1784092801798-602027533.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 44,
    "ratings": {
      "average": 5,
      "count": 14
    }
  },
  {
    "name": "LAPTOP ACER SWIFT GO 14 AI ULTRA 7 155H/RAM 16GB/SSD 1TB/LCD 14INCH WUXGA TOUCH",
    "slug": "laptop-acer-swift-go-14-ai-ultra-7-155hram-16gbssd-1tblcd-14inch-wuxga-touch",
    "brand": "Acer",
    "categoryName": "Laptop Acer",
    "categorySlug": "laptop-acer",
    "price": 14500000,
    "originalPrice": 16000000,
    "discountPrice": 14500000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784092595996-592050198.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784092595996-592050198.webp",
      "https://zcomputer.vn/uploads/image-1784092595108-6221041.webp",
      "https://zcomputer.vn/uploads/image-1784092596750-55722272.webp",
      "https://zcomputer.vn/uploads/image-1784092597438-539111232.webp",
      "https://zcomputer.vn/uploads/image-1784092598026-215493748.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 60,
    "ratings": {
      "average": 5,
      "count": 16
    }
  },
  {
    "name": "LAPTOP SURFACE 3 I5 1035G7/RAM 8GB/SSD 256GB/LCD 13.5IN CẢM ỨNG 2K5 TOUCH",
    "slug": "laptop-surface-3-i5-1035g7ram-8gbssd-256gblcd-135in-cam-ung-2k5-touch",
    "brand": "SURFACE",
    "categoryName": "Laptop Surface",
    "categorySlug": "laptop-surface",
    "price": 6900000,
    "originalPrice": 8000000,
    "discountPrice": 6900000,
    "discountPercent": 14,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784092458940-102289806.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784092458940-102289806.webp",
      "https://zcomputer.vn/uploads/image-1784092458219-462553863.webp",
      "https://zcomputer.vn/uploads/image-1784092457360-855904095.webp",
      "https://zcomputer.vn/uploads/image-1784092459455-929268777.webp",
      "https://zcomputer.vn/uploads/image-1784092460040-273700887.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 69,
    "ratings": {
      "average": 5,
      "count": 35
    }
  },
  {
    "name": "LAPTOP ACER NITRO V ANV15-51 I7 13620H/16GB/512GB/VGA RTX 4050 6G/LCD 15.6INCH 144HZ",
    "slug": "laptop-acer-nitro-v-anv15-51-i7-13620h16gb512gbvga-rtx-4050-6glcd-156inch-144hz",
    "brand": "Acer",
    "categoryName": "Laptop Acer",
    "categorySlug": "laptop-acer",
    "price": 18500000,
    "originalPrice": 20000000,
    "discountPrice": 18500000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784092346606-700746743.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784092346606-700746743.webp",
      "https://zcomputer.vn/uploads/image-1784092342427-703012347.webp",
      "https://zcomputer.vn/uploads/image-1784092343516-976732609.webp",
      "https://zcomputer.vn/uploads/image-1784092344209-704500771.webp",
      "https://zcomputer.vn/uploads/image-1784092345269-490836774.webp",
      "https://zcomputer.vn/uploads/image-1784092346005-619369526.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 58,
    "ratings": {
      "average": 5,
      "count": 33
    }
  },
  {
    "name": "MACBOOK PRO 14INCH - M1 PRO 10CPU-16GPU/ 16GB/SSD 1TB (BẠC) PIN 89%",
    "slug": "macbook-pro-14inch-m1-pro-10cpu-16gpu-16gbssd-1tb-bac-pin-89percent",
    "brand": "Apple",
    "categoryName": "Macbook",
    "categorySlug": "macbook",
    "price": 19500000,
    "originalPrice": 22000000,
    "discountPrice": 19500000,
    "discountPercent": 11,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784091990938-52826149.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784091990938-52826149.webp",
      "https://zcomputer.vn/uploads/image-1784091991708-138316858.webp",
      "https://zcomputer.vn/uploads/image-1784091988125-399170939.webp",
      "https://zcomputer.vn/uploads/image-1784091989197-769256210.webp",
      "https://zcomputer.vn/uploads/image-1784091990108-651497013.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 40,
    "ratings": {
      "average": 5,
      "count": 9
    }
  },
  {
    "name": "LAPTOP HP ENVY X360 16-AD0023DX RYZEN 7 8840HS/16GB/SSD 512GB/LCD 16INCH WUXGA (1920 x 1200) 60HZ TOUCH",
    "slug": "laptop-hp-envy-x360-16-ad0023dx-ryzen-7-8840hs16gbssd-512gblcd-16inch-wuxga-1920-x-1200-60hz-touch",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 13900000,
    "originalPrice": 15000000,
    "discountPrice": 13900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784090743294-821638358.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784090743294-821638358.webp",
      "https://zcomputer.vn/uploads/image-1784090745643-156517753.webp",
      "https://zcomputer.vn/uploads/image-1784090746898-306405066.webp",
      "https://zcomputer.vn/uploads/image-1784090744419-46173631.webp",
      "https://zcomputer.vn/uploads/image-1784090748477-91569741.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 28,
    "ratings": {
      "average": 5,
      "count": 19
    }
  },
  {
    "name": "LAPTOP DELL PRECISION 7550 I7 10850H/16GB/SSD 512GB/VGA QUADRO T2000 4GDDR6/LCD 15.6INCH FHD IPS",
    "slug": "laptop-dell-precision-7550-i7-10850h16gbssd-512gbvga-quadro-t2000-4gddr6lcd-156inch-fhd-ips",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 13900000,
    "originalPrice": 15000000,
    "discountPrice": 13900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088860164-705696433.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088860164-705696433.webp",
      "https://zcomputer.vn/uploads/image-1784088859596-432166752.webp",
      "https://zcomputer.vn/uploads/image-1784088858937-740424645.webp",
      "https://zcomputer.vn/uploads/image-1784088860769-834265924.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 94,
    "ratings": {
      "average": 5,
      "count": 18
    }
  },
  {
    "name": "LAPTOP ASUS ROG STRIX Gaming G513I-HN008W R7 4800H/16GB/512GB/GeForce RTX 3060 6GB/LCD 15.6\" FHD 144HZ/Win 11",
    "slug": "laptop-asus-rog-strix-gaming-g513i-hn008w-r7-4800h16gb512gbgeforce-rtx-3060-6gblcd-156-fhd-144hzwin-11",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 15500000,
    "originalPrice": 16500000,
    "discountPrice": 15500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784086950701-641973390.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784086950701-641973390.webp",
      "https://zcomputer.vn/uploads/image-1784086956290-510947541.webp",
      "https://zcomputer.vn/uploads/image-1784086949449-193316827.webp",
      "https://zcomputer.vn/uploads/image-1784086952228-487493961.webp",
      "https://zcomputer.vn/uploads/image-1784086954062-383207497.webp",
      "https://zcomputer.vn/uploads/image-1784086955077-447639682.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 59,
    "ratings": {
      "average": 5,
      "count": 29
    }
  },
  {
    "name": "LAPTOP HP VICTUS 15-fa1139TX 8Y6W3PA I5 12450H/RAM 16GB/SSD 512GB/VGA RTX 2050 4GB/LCD 15.6INCH FHD 144HZ",
    "slug": "laptop-hp-victus-15-fa1139tx-8y6w3pa-i5-12450hram-16gbssd-512gbvga-rtx-2050-4gblcd-156inch-fhd-144hz",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 12500000,
    "originalPrice": 14000000,
    "discountPrice": 12500000,
    "discountPercent": 11,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784086570469-211323063.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784086570469-211323063.webp",
      "https://zcomputer.vn/uploads/image-1784086569936-506194928.webp",
      "https://zcomputer.vn/uploads/image-1784086568997-301971978.webp",
      "https://zcomputer.vn/uploads/image-1784086569471-451698282.webp",
      "https://zcomputer.vn/uploads/image-1784086568351-284329592.webp",
      "https://zcomputer.vn/uploads/image-1784086567603-456658704.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 83,
    "ratings": {
      "average": 5,
      "count": 14
    }
  },
  {
    "name": "LAPTOP HP VICTUS GAMING 16-s0097nr RYZEN 7 7840HS/16GB/SSD 1TB/VGA RTX 4060 8GDDR6/LCD 16.1INCH FHD 100% sRGB",
    "slug": "laptop-hp-victus-gaming-16-s0097nr-ryzen-7-7840hs16gbssd-1tbvga-rtx-4060-8gddr6lcd-161inch-fhd-100percent-srgb",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 20500000,
    "originalPrice": 22000000,
    "discountPrice": 20500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784086451492-467598678.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784086451492-467598678.webp",
      "https://zcomputer.vn/uploads/image-1784086453639-980703447.webp",
      "https://zcomputer.vn/uploads/image-1784086452896-662657217.webp",
      "https://zcomputer.vn/uploads/image-1784086450542-602611614.webp",
      "https://zcomputer.vn/uploads/image-1784086452089-985684435.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 43,
    "ratings": {
      "average": 5,
      "count": 29
    }
  },
  {
    "name": "LAPTOP DELL PRECISION 5560 I7 11850H/16GB/SSD 512GB/VGA RTX A2000 4GB/LCD 15.6INCH FHD+",
    "slug": "laptop-dell-precision-5560-i7-11850h16gbssd-512gbvga-rtx-a2000-4gblcd-156inch-fhd",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 17900000,
    "originalPrice": 19000000,
    "discountPrice": 17900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784472901941-318237696.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784472901941-318237696.webp",
      "https://zcomputer.vn/uploads/image-1784086319122-692847807.webp",
      "https://zcomputer.vn/uploads/image-1784472900716-238948909.webp",
      "https://zcomputer.vn/uploads/image-1784086319854-849104890.webp",
      "https://zcomputer.vn/uploads/image-1784086320589-579759778.webp",
      "https://zcomputer.vn/uploads/image-1784086321857-85159146.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 44,
    "ratings": {
      "average": 5,
      "count": 13
    }
  },
  {
    "name": "LAPTOP DELL ALIENWARE X14 R1 I7 12700H/32GB/SSD 512GB/VGA 3060 6GB/LCD 14INCH FHD+ 144HZ",
    "slug": "laptop-dell-alienware-x14-r1-i7-12700h32gbssd-512gbvga-3060-6gblcd-14inch-fhd-144hz",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 22900000,
    "originalPrice": 25000000,
    "discountPrice": 22900000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784086196865-685246310.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784086196865-685246310.webp",
      "https://zcomputer.vn/uploads/image-1784086200302-779743707.webp",
      "https://zcomputer.vn/uploads/image-1784086197958-677189085.webp",
      "https://zcomputer.vn/uploads/image-1784086198893-627586932.webp",
      "https://zcomputer.vn/uploads/image-1784086201522-361576972.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 123,
    "ratings": {
      "average": 5,
      "count": 20
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD X1 CARBON GEN 8 I7 10610U/16GB/SSD 512GB/LCD 14INCH FHD TOUCH",
    "slug": "laptop-lenovo-thinkpad-x1-carbon-gen-8-i7-10610u16gbssd-512gblcd-14inch-fhd-touch",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 9900000,
    "originalPrice": 12000000,
    "discountPrice": 9900000,
    "discountPercent": 18,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784813514243-243918214.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784813514243-243918214.webp",
      "https://zcomputer.vn/uploads/image-1784086100571-262213112.webp",
      "https://zcomputer.vn/uploads/image-1784086099893-774670091.webp",
      "https://zcomputer.vn/uploads/image-1784813515230-197917787.webp",
      "https://zcomputer.vn/uploads/image-1784086099203-85968962.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 126,
    "ratings": {
      "average": 5,
      "count": 36
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD P1 GEN 4 I7 11850H/16GB/SSD 512GB/VGA QUADRO T1200 4GB/LCD 16INCH (3840 x 2160) 4K TOUCH",
    "slug": "laptop-lenovo-thinkpad-p1-gen-4-i7-11850h16gbssd-512gbvga-quadro-t1200-4gblcd-16inch-3840-x-2160-4k-touch",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 16900000,
    "originalPrice": 18000000,
    "discountPrice": 16900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784623383522-654880043.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784623383522-654880043.webp",
      "https://zcomputer.vn/uploads/image-1784623385854-391948935.webp",
      "https://zcomputer.vn/uploads/image-1784623389160-42987045.webp",
      "https://zcomputer.vn/uploads/image-1784623387959-523844273.webp",
      "https://zcomputer.vn/uploads/image-1784623386906-734017451.webp",
      "https://zcomputer.vn/uploads/image-1784623384696-70072683.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 129,
    "ratings": {
      "average": 5,
      "count": 28
    }
  },
  {
    "name": "LAPTOP DELL PRECISION 7560 I7 11850H/16GB/SSD 512GB/VGA QUADRO T1200 4GDDR6/LCD 15.6INCH FHD",
    "slug": "laptop-dell-precision-7560-i7-11850h16gbssd-512gbvga-quadro-t1200-4gddr6lcd-156inch-fhd",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 15900000,
    "originalPrice": 16900000,
    "discountPrice": 15900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784085889572-448620661.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784085889572-448620661.webp",
      "https://zcomputer.vn/uploads/image-1784085890255-862973213.webp",
      "https://zcomputer.vn/uploads/image-1784085888781-104993965.webp",
      "https://zcomputer.vn/uploads/image-1784471417814-934594801.webp",
      "https://zcomputer.vn/uploads/image-1784085887902-247343320.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 23,
    "ratings": {
      "average": 5,
      "count": 20
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD T14 GEN 3 I7 1265U/16GB/SSD 512GB/LCD 14INCH WUXGA (1920 x 1200)",
    "slug": "laptop-lenovo-thinkpad-t14-gen-3-i7-1265u16gbssd-512gblcd-14inch-wuxga-1920-x-1200",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 13500000,
    "originalPrice": 14500000,
    "discountPrice": 13500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784813860676-690910095.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784813860676-690910095.webp",
      "https://zcomputer.vn/uploads/image-1784085756033-286755942.webp",
      "https://zcomputer.vn/uploads/image-1784085753574-534150070.webp",
      "https://zcomputer.vn/uploads/image-1784085754781-481014238.webp",
      "https://zcomputer.vn/uploads/image-1784085752253-333548589.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 112,
    "ratings": {
      "average": 5,
      "count": 14
    }
  },
  {
    "name": "LAPTOP MSI STEALTH 14 AI STUDIO A1VEG ULTRA 7 155H/16GB/SSD 1TB/VGA RTX 4050 6GB/LCD 14INCH 2K8 120HZ OLED",
    "slug": "laptop-msi-stealth-14-ai-studio-a1veg-ultra-7-155h16gbssd-1tbvga-rtx-4050-6gblcd-14inch-2k8-120hz-oled",
    "brand": "MSI",
    "categoryName": "Laptop MSI",
    "categorySlug": "laptop-msi",
    "price": 23500000,
    "originalPrice": 25000000,
    "discountPrice": 23500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784085503101-826545009.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784085503101-826545009.webp",
      "https://zcomputer.vn/uploads/image-1784085502488-884004108.webp",
      "https://zcomputer.vn/uploads/image-1784085500484-767368832.webp",
      "https://zcomputer.vn/uploads/image-1784085501138-641794414.webp",
      "https://zcomputer.vn/uploads/image-1784085501781-385430627.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 52,
    "ratings": {
      "average": 5,
      "count": 13
    }
  },
  {
    "name": "LAPTOP HP PROBOOK 450 G5 I5 7200U/8GB/SSD 256GB/LCD 15.6INCH FHD",
    "slug": "laptop-hp-probook-450-g5-i5-7200u8gbssd-256gblcd-156inch-fhd",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 3900000,
    "originalPrice": 5000000,
    "discountPrice": 3900000,
    "discountPercent": 22,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784085395293-63048986.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784085395293-63048986.webp",
      "https://zcomputer.vn/uploads/image-1784085393347-970078540.webp",
      "https://zcomputer.vn/uploads/image-1784085394009-761388058.webp",
      "https://zcomputer.vn/uploads/image-1784085394642-377028895.webp",
      "https://zcomputer.vn/uploads/image-1784085396052-255222724.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 77,
    "ratings": {
      "average": 5,
      "count": 35
    }
  },
  {
    "name": "LAPTOP LENOVO YOGA 9 14IRP8 I7 1360P/16GB/SSD 512GB/LCD 14INCH 2K8 (2880 x 1800) OLED TOUCH",
    "slug": "laptop-lenovo-yoga-9-14irp8-i7-1360p16gbssd-512gblcd-14inch-2k8-2880-x-1800-oled-touch",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 18900000,
    "originalPrice": 19900000,
    "discountPrice": 18900000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784085283692-231764357.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784085283692-231764357.webp",
      "https://zcomputer.vn/uploads/image-1784085285836-695323482.webp",
      "https://zcomputer.vn/uploads/image-1784085284921-631912398.webp",
      "https://zcomputer.vn/uploads/image-1784085281496-165546335.webp",
      "https://zcomputer.vn/uploads/image-1784085282585-294094158.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 50,
    "ratings": {
      "average": 5,
      "count": 8
    }
  },
  {
    "name": "LAPTOP HP ELITEBOOK 840 G11 ULTRA 7 165U/16GB/SSD 256GB/LCD 14INCH WUXGA (1920 x 1200)",
    "slug": "laptop-hp-elitebook-840-g11-ultra-7-165u16gbssd-256gblcd-14inch-wuxga-1920-x-1200",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 15900000,
    "originalPrice": 16900000,
    "discountPrice": 15900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784085160069-398923051.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784085160069-398923051.webp",
      "https://zcomputer.vn/uploads/image-1784085157234-934200695.webp",
      "https://zcomputer.vn/uploads/image-1784085158773-320562971.webp",
      "https://zcomputer.vn/uploads/image-1784085157967-678127927.webp",
      "https://zcomputer.vn/uploads/image-1784085159446-628230609.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 90,
    "ratings": {
      "average": 5,
      "count": 9
    }
  },
  {
    "name": "LAPTOP DELL XPS 13 PLUS 9320 I7 1260P/16GB/SSD 512GB/LCD 13.4INCH 4K UHD (3840 x 2400) OLED TOUCH",
    "slug": "laptop-dell-xps-13-plus-9320-i7-1260p16gbssd-512gblcd-134inch-4k-uhd-3840-x-2400-oled-touch",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 21500000,
    "originalPrice": 22500000,
    "discountPrice": 21500000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784084865728-14653574.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784084865728-14653574.webp",
      "https://zcomputer.vn/uploads/image-1784084861930-353560132.webp",
      "https://zcomputer.vn/uploads/image-1784084862945-569360745.webp",
      "https://zcomputer.vn/uploads/image-1784084863977-752336668.webp",
      "https://zcomputer.vn/uploads/image-1784084864861-504901716.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 54,
    "ratings": {
      "average": 5,
      "count": 35
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD E16 GEN 1 RYZEN 5 7530U/16GB/SSD 512GB/AMD RADEON/LCD 16INCH WUXGA (1920 x 1200)",
    "slug": "laptop-lenovo-thinkpad-e16-gen-1-ryzen-5-7530u16gbssd-512gbamd-radeonlcd-16inch-wuxga-1920-x-1200",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 11500000,
    "originalPrice": 12500000,
    "discountPrice": 11500000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784084747484-384763481.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784084747484-384763481.webp",
      "https://zcomputer.vn/uploads/image-1784084748236-142441805.webp",
      "https://zcomputer.vn/uploads/image-1784084746740-448056388.webp",
      "https://zcomputer.vn/uploads/image-1784084748877-298495077.webp",
      "https://zcomputer.vn/uploads/image-1784084749514-721546729.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 111,
    "ratings": {
      "average": 5,
      "count": 11
    }
  },
  {
    "name": "LAPTOP MSI STEALTH 16 AI STUDIO A1VGG ULTRA 9 185H/16GB/SSD 512GB/VGA RTX 4070 8GB/LCD 16INCH 2K5 240HZ",
    "slug": "laptop-msi-stealth-16-ai-studio-a1vgg-ultra-9-185h16gbssd-512gbvga-rtx-4070-8gblcd-16inch-2k5-240hz",
    "brand": "MSI",
    "categoryName": "Laptop MSI",
    "categorySlug": "laptop-msi",
    "price": 29500000,
    "originalPrice": 31000000,
    "discountPrice": 29500000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784084496830-664024392.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784084496830-664024392.webp",
      "https://zcomputer.vn/uploads/image-1784084495862-653801528.webp",
      "https://zcomputer.vn/uploads/image-1784084493320-528050724.webp",
      "https://zcomputer.vn/uploads/image-1784084494270-924639441.webp",
      "https://zcomputer.vn/uploads/image-1784084495081-375310336.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 80,
    "ratings": {
      "average": 5,
      "count": 37
    }
  },
  {
    "name": "BỘ MÁY TÍNH B660M/I5 12400/RAM 16GB/SSD 256GB/VGA GTX 1080 8GB/750W/AIO 360/CASE MAGIC KÈM 4 FAN LED WHITE",
    "slug": "bo-may-tinh-b660mi5-12400ram-16gbssd-256gbvga-gtx-1080-8gb750waio-360case-magic-kem-4-fan-led-white",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 13990000,
    "originalPrice": 14990000,
    "discountPrice": 13990000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783865975437-668161506.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783865975437-668161506.webp",
      "https://zcomputer.vn/uploads/image-1783865967345-942763011.webp",
      "https://zcomputer.vn/uploads/image-1783865969901-173393563.webp",
      "https://zcomputer.vn/uploads/image-1783865971233-589247744.webp",
      "https://zcomputer.vn/uploads/image-1783865972645-893793538.webp",
      "https://zcomputer.vn/uploads/image-1783865973846-384594501.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 130,
    "ratings": {
      "average": 5,
      "count": 24
    }
  },
  {
    "name": "BỘ MÁY TÍNH H610M/I3 12100F/RAM 16GB/SSD 256GB/VGA GTX 1650 4GB/500W/TẢN KHÍ/CASE MAGIC BỂ CÁ KÈM 5 FAN LED",
    "slug": "bo-may-tinh-h610mi3-12100fram-16gbssd-256gbvga-gtx-1650-4gb500wtan-khicase-magic-be-ca-kem-5-fan-led",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 8900000,
    "originalPrice": 9990000,
    "discountPrice": 8900000,
    "discountPercent": 11,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783864928176-616133167.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783864928176-616133167.webp",
      "https://zcomputer.vn/uploads/image-1783864925087-361753492.webp",
      "https://zcomputer.vn/uploads/image-1783864927453-697100890.webp",
      "https://zcomputer.vn/uploads/image-1783864926672-959514302.webp",
      "https://zcomputer.vn/uploads/image-1783864925872-131461380.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 105,
    "ratings": {
      "average": 5,
      "count": 33
    }
  },
  {
    "name": "LAPTOP HP ZBOOK FURY 16 G9 I7 12850HX/16GB/SSD 512GB/VGA RTX A1000 4GB/LCD 16INCH 4K UHD (3840 x 2160) OLED",
    "slug": "laptop-hp-zbook-fury-16-g9-i7-12850hx16gbssd-512gbvga-rtx-a1000-4gblcd-16inch-4k-uhd-3840-x-2160-oled",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 20500000,
    "originalPrice": 21500000,
    "discountPrice": 20500000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783938442324-63111379.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783938442324-63111379.webp",
      "https://zcomputer.vn/uploads/image-1783938430396-743765596.webp",
      "https://zcomputer.vn/uploads/image-1783938432802-221851033.webp",
      "https://zcomputer.vn/uploads/image-1783938437239-404675943.webp",
      "https://zcomputer.vn/uploads/image-1783938435119-898303903.webp",
      "https://zcomputer.vn/uploads/image-1783938439796-926709224.webp",
      "https://zcomputer.vn/uploads/image-1783938428049-967864569.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 60,
    "ratings": {
      "average": 5,
      "count": 17
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M WIFI/I7 12700/RAM 16GB/SSD 1TB/VGA RTX 3050 6GB/550W/TẢN AIO 240/CASE BỂ CÁ KÈM 3 FAN",
    "slug": "bo-may-tinh-b760m-wifii7-12700ram-16gbssd-1tbvga-rtx-3050-6gb550wtan-aio-240case-be-ca-kem-3-fan",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 18500000,
    "originalPrice": 19990000,
    "discountPrice": 18500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783769380375-483064855.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783769380375-483064855.webp",
      "https://zcomputer.vn/uploads/image-1783769373562-420330674.webp",
      "https://zcomputer.vn/uploads/image-1783769376131-258302076.webp",
      "https://zcomputer.vn/uploads/image-1783769378173-966940970.webp",
      "https://zcomputer.vn/uploads/image-1783769383369-92907682.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 123,
    "ratings": {
      "average": 5,
      "count": 20
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M WIFI/I7 12700K/RAM 16GB/SSD 1TB/VGA RTX 3070TI 8GB/ 800W/TẢN AIO/CASE BỂ CÁ KÈM 3 FAN LED RGB",
    "slug": "bo-may-tinh-b760m-wifii7-12700kram-16gbssd-1tbvga-rtx-3070ti-8gb-800wtan-aiocase-be-ca-kem-3-fan-led-rgb",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 22000000,
    "originalPrice": 23500000,
    "discountPrice": 22000000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783768439271-543730829.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783768439271-543730829.webp",
      "https://zcomputer.vn/uploads/image-1783768464889-999808893.webp",
      "https://zcomputer.vn/uploads/image-1783768455749-928722174.webp",
      "https://zcomputer.vn/uploads/image-1783768433021-632805164.webp",
      "https://zcomputer.vn/uploads/image-1783768448610-987565467.webp",
      "https://zcomputer.vn/uploads/image-1783768460055-887364318.webp",
      "https://zcomputer.vn/uploads/image-1783768443521-60456101.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 54,
    "ratings": {
      "average": 5,
      "count": 22
    }
  },
  {
    "name": "LAPTOP HP ENVY X360 15-ES2501DX I7 1260P/16GB/SSD 256GB/LCD 15.6INCH WUXGA (1920 x 1200) TOUCH",
    "slug": "laptop-hp-envy-x360-15-es2501dx-i7-1260p16gbssd-256gblcd-156inch-wuxga-1920-x-1200-touch",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 14500000,
    "originalPrice": 15500000,
    "discountPrice": 14500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783940477671-571756455.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783940477671-571756455.webp",
      "https://zcomputer.vn/uploads/image-1783940591627-588514615.webp",
      "https://zcomputer.vn/uploads/image-1783940481708-336979318.webp",
      "https://zcomputer.vn/uploads/image-1783940473862-233381711.webp",
      "https://zcomputer.vn/uploads/image-1783940479493-253930596.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 116,
    "ratings": {
      "average": 5,
      "count": 16
    }
  },
  {
    "name": "LAPTOP ASUS VIVOBOOK 14X OLED K3405VC I5 13500H/16GB/SSD 512GB/VGA RTX 3050 4GB/LCD 14INCH 2K8 (2880 x 1800) 90HZ - BH 2/2027 TGDD",
    "slug": "laptop-asus-vivobook-14x-oled-k3405vc-i5-13500h16gbssd-512gbvga-rtx-3050-4gblcd-14inch-2k8-2880-x-1800-90hz-bh-22027-tgdd",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 14900000,
    "originalPrice": 15900000,
    "discountPrice": 14900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784295424303-280401584.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784295424303-280401584.webp",
      "https://zcomputer.vn/uploads/image-1784295429023-724120687.webp",
      "https://zcomputer.vn/uploads/image-1784295429990-123370399.webp",
      "https://zcomputer.vn/uploads/image-1784295427934-671527471.webp",
      "https://zcomputer.vn/uploads/image-1784295426818-169100571.webp",
      "https://zcomputer.vn/uploads/image-1784295425390-249248130.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 125,
    "ratings": {
      "average": 5,
      "count": 25
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD E16 GEN 3 RYZEN 7 H 255/32GB/SSD 512GB/VGA RADEON 780M/LCD 16INCH (1920 x 1200)",
    "slug": "laptop-lenovo-thinkpad-e16-gen-3-ryzen-7-h-25532gbssd-512gbvga-radeon-780mlcd-16inch-1920-x-1200",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 22900000,
    "originalPrice": 23900000,
    "discountPrice": 22900000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783765069050-318473616.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783765069050-318473616.webp",
      "https://zcomputer.vn/uploads/image-1783765060827-783920662.webp",
      "https://zcomputer.vn/uploads/image-1783765066053-538939486.webp",
      "https://zcomputer.vn/uploads/image-1783765063784-410750226.webp",
      "https://zcomputer.vn/uploads/image-1783765067979-570504949.webp",
      "https://zcomputer.vn/uploads/image-1783765070197-474305210.webp",
      "https://zcomputer.vn/uploads/image-1783765071215-544715605.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 111,
    "ratings": {
      "average": 5,
      "count": 23
    }
  },
  {
    "name": "BỘ MÁY TÍNH H510M ASUS/ I5 10400F/ 16GB RAM/ 512GB SSD/ 1660S/ NGUỒN 550W/ TẢN KHÍ/ CASE BỂ CÁ MAGIC KÈM 3 FAN LED",
    "slug": "bo-may-tinh-h510m-asus-i5-10400f-16gb-ram-512gb-ssd-1660s-nguon-550w-tan-khi-case-be-ca-magic-kem-3-fan-led",
    "brand": "ASUS",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 10200000,
    "originalPrice": 11200000,
    "discountPrice": 10200000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783763821226-821850524.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783763821226-821850524.webp",
      "https://zcomputer.vn/uploads/image-1783763820363-519408850.webp",
      "https://zcomputer.vn/uploads/image-1783763817067-58535233.webp",
      "https://zcomputer.vn/uploads/image-1783763818192-789034744.webp",
      "https://zcomputer.vn/uploads/image-1783763819301-585815378.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 88,
    "ratings": {
      "average": 5,
      "count": 12
    }
  },
  {
    "name": "Màn hình Gaming Asus VG249QE5A | 24 inch, FHD, 146Hz, IPS",
    "slug": "man-hinh-gaming-asus-vg249qe5a-or-24-inch-fhd-146hz-ips",
    "brand": "ASUS",
    "categoryName": "Màn hình máy tính",
    "categorySlug": "man-hinh",
    "price": 2600000,
    "originalPrice": 2800000,
    "discountPrice": 2600000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783756009379-375179808.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783756009379-375179808.webp",
      "https://zcomputer.vn/uploads/image-1783756016449-201361015.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 65,
    "ratings": {
      "average": 5,
      "count": 26
    }
  },
  {
    "name": "Màn hình Gaming EDRA EGM24F144S | 24 inch, Full HD, IPS, 144Hz",
    "slug": "man-hinh-gaming-edra-egm24f144s-or-24-inch-full-hd-ips-144hz",
    "brand": "EDRA",
    "categoryName": "Màn hình máy tính",
    "categorySlug": "man-hinh",
    "price": 1800000,
    "originalPrice": 2000000,
    "discountPrice": 1800000,
    "discountPercent": 10,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783754316075-436103331.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783754316075-436103331.webp",
      "https://zcomputer.vn/uploads/image-1783754317624-979800648.webp",
      "https://zcomputer.vn/uploads/image-1783754318989-800563019.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 16,
    "ratings": {
      "average": 5,
      "count": 34
    }
  },
  {
    "name": "Màn hình Văn phòng Dell E2225HSM | 22 inch, FHD, 100Hz, VA",
    "slug": "man-hinh-van-phong-dell-e2225hsm-or-22-inch-fhd-100hz-va",
    "brand": "Dell",
    "categoryName": "Màn hình máy tính",
    "categorySlug": "man-hinh",
    "price": 2500000,
    "originalPrice": 2700000,
    "discountPrice": 2500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783754211705-99910828.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783754211705-99910828.webp",
      "https://zcomputer.vn/uploads/image-1783754202767-310332796.webp",
      "https://zcomputer.vn/uploads/image-1783754204025-571478015.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 16,
    "ratings": {
      "average": 5,
      "count": 26
    }
  },
  {
    "name": "Màn hình văn phòng Philips 22E2N1100L/71 | 22 inch, Full HD, VA, 120Hz Mã sản phẩm: L.22.PL.22E2N1100L",
    "slug": "man-hinh-van-phong-philips-22e2n1100l71-or-22-inch-full-hd-va-120hz-ma-product-l22pl22e2n1100l",
    "brand": "Philips",
    "categoryName": "Màn hình máy tính",
    "categorySlug": "man-hinh",
    "price": 1650000,
    "originalPrice": 1900000,
    "discountPrice": 1650000,
    "discountPercent": 13,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783754057656-748946808.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783754057656-748946808.webp",
      "https://zcomputer.vn/uploads/image-1783754059950-703439416.webp",
      "https://zcomputer.vn/uploads/image-1783754061400-839135631.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 67,
    "ratings": {
      "average": 5,
      "count": 26
    }
  },
  {
    "name": "Màn hình văn phòng Asus VP227HF | 22 inch, Full HD, VA, 100Hz, 1ms",
    "slug": "man-hinh-van-phong-asus-vp227hf-or-22-inch-full-hd-va-100hz-1ms",
    "brand": "ASUS",
    "categoryName": "Màn hình máy tính",
    "categorySlug": "man-hinh",
    "price": 1850000,
    "originalPrice": 2000000,
    "discountPrice": 1850000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783753882641-121162424.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783753882641-121162424.webp",
      "https://zcomputer.vn/uploads/image-1783753887241-560596725.webp",
      "https://zcomputer.vn/uploads/image-1783753874782-735363774.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 72,
    "ratings": {
      "average": 5,
      "count": 24
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M PRO RS/ I5 14400F/ 16GB RAM/ 512GB SSD/ VGA RTX 3060 12GB/ NGUỒN 650W SEGOTEP/ CASE/ TẢN 240 THERMALRIGHT - BH 08/2028",
    "slug": "bo-may-tinh-b760m-pro-rs-i5-14400f-16gb-ram-512gb-ssd-vga-rtx-3060-12gb-nguon-650w-segotep-case-tan-240-thermalright-bh-082028",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 19300000,
    "originalPrice": 20300000,
    "discountPrice": 19300000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783752191099-394316790.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783752191099-394316790.webp",
      "https://zcomputer.vn/uploads/image-1783752193133-718407333.webp",
      "https://zcomputer.vn/uploads/image-1783752187093-198408371.webp",
      "https://zcomputer.vn/uploads/image-1783752183580-479766594.webp",
      "https://zcomputer.vn/uploads/image-1783752185662-262779775.webp",
      "https://zcomputer.vn/uploads/image-1783752189014-672877177.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 129,
    "ratings": {
      "average": 5,
      "count": 36
    }
  },
  {
    "name": "BỘ MÁY TÍNH H610M/I3 13100F/RAM 16GB/SSD 512GB/VGA 1660S 6GB/550W/TẢN KHÍ/CASE XIGMATEK VIEW III KÈM 3 FAN LED",
    "slug": "bo-may-tinh-h610mi3-13100fram-16gbssd-512gbvga-1660s-6gb550wtan-khicase-xigmatek-view-iii-kem-3-fan-led",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 9200000,
    "originalPrice": 10590000,
    "discountPrice": 9200000,
    "discountPercent": 13,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783750730759-150670553.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783750730759-150670553.webp",
      "https://zcomputer.vn/uploads/image-1783750731509-746414837.webp",
      "https://zcomputer.vn/uploads/image-1783750728141-951610207.webp",
      "https://zcomputer.vn/uploads/image-1783750729689-882030696.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 56,
    "ratings": {
      "average": 5,
      "count": 32
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M/ I5 14600K/ RAM 32GB/ SSD 500GB/ VGA RTX 5060 8G/750W/AIO 360/CASE MIK BỂ CÁ KÈM 6 FAN LED",
    "slug": "bo-may-tinh-b760m-i5-14600k-ram-32gb-ssd-500gb-vga-rtx-5060-8g750waio-360case-mik-be-ca-kem-6-fan-led",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 24900000,
    "originalPrice": 25900000,
    "discountPrice": 24900000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783610870086-981546893.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783610870086-981546893.webp",
      "https://zcomputer.vn/uploads/image-1783610878963-967635639.webp",
      "https://zcomputer.vn/uploads/image-1783610908729-822019924.webp",
      "https://zcomputer.vn/uploads/image-1783610901618-619849706.webp",
      "https://zcomputer.vn/uploads/image-1783610886628-34528973.webp",
      "https://zcomputer.vn/uploads/image-1783610894380-647750181.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 126,
    "ratings": {
      "average": 5,
      "count": 20
    }
  },
  {
    "name": "BỘ MÁY TÍNH Z790M/ I5 14600K/ RAM 32GB/ SSD 1TB/ VGA RTX 4070TI SUPER 16GB/750W/ AIO 240/CASE CUBI II KÈM 4 FAN LED",
    "slug": "bo-may-tinh-z790m-i5-14600k-ram-32gb-ssd-1tb-vga-rtx-4070ti-super-16gb750w-aio-240case-cubi-ii-kem-4-fan-led",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 39500000,
    "originalPrice": 40900000,
    "discountPrice": 39500000,
    "discountPercent": 3,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783593118336-691186167.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783593118336-691186167.webp",
      "https://zcomputer.vn/uploads/image-1783593125721-710981390.webp",
      "https://zcomputer.vn/uploads/image-1783593146273-894909040.webp",
      "https://zcomputer.vn/uploads/image-1783593140222-702282959.webp",
      "https://zcomputer.vn/uploads/image-1783593152945-12481491.webp",
      "https://zcomputer.vn/uploads/image-1783593133508-465962463.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 20,
    "ratings": {
      "average": 5,
      "count": 30
    }
  },
  {
    "name": "LAPTOP HP VICTUS 16 - d0XXx I7 11800H/16GB/SSD 512GB/VGA RTX 3060 6GDDR6/LCD 16INCH FHD 144HZ",
    "slug": "laptop-hp-victus-16-d0xxx-i7-11800h16gbssd-512gbvga-rtx-3060-6gddr6lcd-16inch-fhd-144hz",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 15900000,
    "originalPrice": 16900000,
    "discountPrice": 15900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783590305149-476715783.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783590305149-476715783.webp",
      "https://zcomputer.vn/uploads/image-1783590312176-716687188.webp",
      "https://zcomputer.vn/uploads/image-1783590316640-566404625.webp",
      "https://zcomputer.vn/uploads/image-1783590320835-682070319.webp",
      "https://zcomputer.vn/uploads/image-1783590326909-493376523.webp",
      "https://zcomputer.vn/uploads/image-1783590331282-570129782.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 110,
    "ratings": {
      "average": 5,
      "count": 28
    }
  },
  {
    "name": "BỘ MÁY TÍNH B450M MSI/ R5 5600X/ 16GB RAM/ 256GB SSD/ VGA 1660S 6GB/ NGUỒN 600W/ CASE LED GAMING KÈM FAN",
    "slug": "bo-may-tinh-b450m-msi-r5-5600x-16gb-ram-256gb-ssd-vga-1660s-6gb-nguon-600w-case-led-gaming-kem-fan",
    "brand": "MSI",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 10500000,
    "originalPrice": 11500000,
    "discountPrice": 10500000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783431286984-885193202.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783431286984-885193202.webp",
      "https://zcomputer.vn/uploads/image-1783431276097-883091447.webp",
      "https://zcomputer.vn/uploads/image-1783431281489-780038258.webp",
      "https://zcomputer.vn/uploads/image-1783431292412-31375548.webp",
      "https://zcomputer.vn/uploads/image-1783431310360-513730284.webp",
      "https://zcomputer.vn/uploads/image-1783431299318-451543283.webp",
      "https://zcomputer.vn/uploads/image-1783431325516-179311975.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 49,
    "ratings": {
      "average": 5,
      "count": 32
    }
  },
  {
    "name": "LAPTOP ASUS TUF F15 FX507VU-LP186W I7 13620H/16GB/SSD 512GB/ VGA RTX 4050 6G/LCD 15.6INCH 144HZ WHITE",
    "slug": "laptop-asus-tuf-f15-fx507vu-lp186w-i7-13620h16gbssd-512gb-vga-rtx-4050-6glcd-156inch-144hz-white",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 19500000,
    "originalPrice": 20900000,
    "discountPrice": 19500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783344890838-868248222.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783344890838-868248222.webp",
      "https://zcomputer.vn/uploads/image-1783344920447-772730932.webp",
      "https://zcomputer.vn/uploads/image-1783344904139-757649847.webp",
      "https://zcomputer.vn/uploads/image-1783344909255-199222861.webp",
      "https://zcomputer.vn/uploads/image-1783344915645-93502151.webp",
      "https://zcomputer.vn/uploads/image-1783344897717-558350665.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 52,
    "ratings": {
      "average": 5,
      "count": 37
    }
  },
  {
    "name": "LAPTOP ASUS TUF FA506N-HN005W RYZEN 5 7535HS/16GB/SSD 512GB/ VGA 2050 4G/LCD 15.6INCH 144HZ",
    "slug": "laptop-asus-tuf-fa506n-hn005w-ryzen-5-7535hs16gbssd-512gb-vga-2050-4glcd-156inch-144hz",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 12900000,
    "originalPrice": 13900000,
    "discountPrice": 12900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784302689352-312519448.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784302689352-312519448.webp",
      "https://zcomputer.vn/uploads/image-1784302688331-791131137.webp",
      "https://zcomputer.vn/uploads/image-1784302693118-727977214.webp",
      "https://zcomputer.vn/uploads/image-1784302692218-306053099.webp",
      "https://zcomputer.vn/uploads/image-1784302690360-858024612.webp",
      "https://zcomputer.vn/uploads/image-1784302691327-892405863.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 21,
    "ratings": {
      "average": 5,
      "count": 16
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M MSI GAMING PLUS WF/ I5 14400F/ 32GB RAM/ 1TB SSD/ VGA RTX 4060 8GB/ NGUỒN 750W/ CASE MIK FORCALOS/ TẢN AIO 360 - BH 7/2027( RAM SSD 3 THÁNG) ",
    "slug": "bo-may-tinh-b760m-msi-gaming-plus-wf-i5-14400f-32gb-ram-1tb-ssd-vga-rtx-4060-8gb-nguon-750w-case-mik-forcalos-tan-aio-360-bh-72027-ram-ssd-3-thang",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 22500000,
    "originalPrice": 23990000,
    "discountPrice": 22500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783332230578-457383410.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783332230578-457383410.webp",
      "https://zcomputer.vn/uploads/image-1783332243784-155629844.webp",
      "https://zcomputer.vn/uploads/image-1783332267154-706372030.webp",
      "https://zcomputer.vn/uploads/image-1783332249879-516881370.webp",
      "https://zcomputer.vn/uploads/image-1783332255506-337997312.webp",
      "https://zcomputer.vn/uploads/image-1783332261324-946865574.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 46,
    "ratings": {
      "average": 5,
      "count": 15
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M-K ASUS/ I5 12400F/ 16GB RAM/ SSD 512GB/ RTX 3050 6GB/ NGUỒN 650W/ CASE LED GAMING KÈM TẢN KHÍ RGB - BH 01/2028",
    "slug": "bo-may-tinh-b760m-k-asus-i5-12400f-16gb-ram-ssd-512gb-rtx-3050-6gb-nguon-650w-case-led-gaming-kem-tan-khi-rgb-bh-012028",
    "brand": "ASUS",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 13500000,
    "originalPrice": 14990000,
    "discountPrice": 13500000,
    "discountPercent": 10,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783331457767-849787037.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783331457767-849787037.webp",
      "https://zcomputer.vn/uploads/image-1783331452847-155319802.webp",
      "https://zcomputer.vn/uploads/image-1783331471982-805203319.webp",
      "https://zcomputer.vn/uploads/image-1783331464026-659359972.webp",
      "https://zcomputer.vn/uploads/image-1783331468402-597704042.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 89,
    "ratings": {
      "average": 5,
      "count": 19
    }
  },
  {
    "name": "PC XEON X99 T8D/2696V3 DUAL/RAM 96GB/SSD 512GB/VGA 1050Ti 4G/750W/TẢN KHÍ/CASE JETEK GAMING KÈM FAN LED",
    "slug": "pc-xeon-x99-t8d2696v3-dualram-96gbssd-512gbvga-1050ti-4g750wtan-khicase-jetek-gaming-kem-fan-led",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 9390000,
    "originalPrice": 10590000,
    "discountPrice": 9390000,
    "discountPercent": 11,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783330424397-210877062.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783330424397-210877062.webp",
      "https://zcomputer.vn/uploads/image-1783330417709-924238921.webp",
      "https://zcomputer.vn/uploads/image-1783330433674-380610075.webp",
      "https://zcomputer.vn/uploads/image-1783330443143-661165117.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 67,
    "ratings": {
      "average": 5,
      "count": 24
    }
  },
  {
    "name": "LAPTOP ASUS ROG ZEPHYRUS M16 2021 I7 11800H/16GB/SSD 512GB/ RTX 3050TI 4GB/LCD 16INCH FHD+ 144HZ",
    "slug": "laptop-asus-rog-zephyrus-m16-2021-i7-11800h16gbssd-512gb-rtx-3050ti-4gblcd-16inch-fhd-144hz",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 17500000,
    "originalPrice": 18990000,
    "discountPrice": 17500000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784300355096-539455406.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784300355096-539455406.webp",
      "https://zcomputer.vn/uploads/image-1784300360785-305822034.webp",
      "https://zcomputer.vn/uploads/image-1784300356386-58789271.webp",
      "https://zcomputer.vn/uploads/image-1784300358746-310329228.webp",
      "https://zcomputer.vn/uploads/image-1784300357748-777686184.webp",
      "https://zcomputer.vn/uploads/image-1784300359855-989827285.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 15,
    "ratings": {
      "average": 5,
      "count": 20
    }
  },
  {
    "name": "LAPTOP HP VICTUS 15-FA1093DX I5 13420H/16GB/SSD 512GB/ VGA 3050 6G/LCD 15.6INCH FHD 144HZ",
    "slug": "laptop-hp-victus-15-fa1093dx-i5-13420h16gbssd-512gb-vga-3050-6glcd-156inch-fhd-144hz",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 15500000,
    "originalPrice": 16500000,
    "discountPrice": 15500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783329543939-258923968.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1783329543939-258923968.webp",
      "https://zcomputer.vn/uploads/image-1783329574841-54061799.webp",
      "https://zcomputer.vn/uploads/image-1783329550692-825531063.webp",
      "https://zcomputer.vn/uploads/image-1783329569038-616293416.webp",
      "https://zcomputer.vn/uploads/image-1783329531703-1661049.webp",
      "https://zcomputer.vn/uploads/image-1783329556193-674669414.webp",
      "https://zcomputer.vn/uploads/image-1783329537460-909522392.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 87,
    "ratings": {
      "average": 5,
      "count": 31
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M TUF PLUS WIFI II/ I5 13400F/ 16GB RAM BUSS 5200/ SSD 500GB/ VGA RTX 5060TI 16GB INNO 3D/ NGUỒN EVGA 750W GOLD/ CASE JONSBO C6 – BH 9/2028 THNS",
    "slug": "bo-may-tinh-b760m-tuf-plus-wifi-ii-i5-13400f-16gb-ram-buss-5200-ssd-500gb-vga-rtx-5060ti-16gb-inno-3d-nguon-evga-750w-gold-case-jonsbo-c6-bh-92028-thns",
    "brand": "TUF",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 27500000,
    "originalPrice": 28500000,
    "discountPrice": 27500000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1783230700060-368883556.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1783230700060-368883556.jpg",
      "https://zcomputer.vn/uploads/image-1783230703886-722051642.jpg",
      "https://zcomputer.vn/uploads/image-1783230703298-352559410.jpg",
      "https://zcomputer.vn/uploads/image-1783230700974-585718357.jpg",
      "https://zcomputer.vn/uploads/image-1783230702673-803098128.jpg",
      "https://zcomputer.vn/uploads/image-1783230701760-220861906.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 83,
    "ratings": {
      "average": 5,
      "count": 10
    }
  },
  {
    "name": "LAPTOP HP OMEN GAMING 16-wd0xxx I7 13620H/16GB/SSD 1TB/VGA RTX 4060 8G/ LCD 16INCH FHD 165HZ",
    "slug": "laptop-hp-omen-gaming-16-wd0xxx-i7-13620h16gbssd-1tbvga-rtx-4060-8g-lcd-16inch-fhd-165hz",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 22500000,
    "originalPrice": 23500000,
    "discountPrice": 22500000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1782307621517-284337001.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1782307621517-284337001.jpg",
      "https://zcomputer.vn/uploads/image-1782307621593-439674046.jpg",
      "https://zcomputer.vn/uploads/image-1782307621687-596525863.jpg",
      "https://zcomputer.vn/uploads/image-1782307621450-61036514.jpg",
      "https://zcomputer.vn/uploads/image-1782307621776-403184838.jpg",
      "https://zcomputer.vn/uploads/image-1782307621912-42170639.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 69,
    "ratings": {
      "average": 5,
      "count": 23
    }
  },
  {
    "name": "LAPTOP MSI STEALTH 14 AI STUDIO A1VEG ULTRA 7 155H/16GB/SSD 1TB/VGA RTX 4050 6B/LCD 14INCH 2K8 120HZ OLED ",
    "slug": "laptop-msi-stealth-14-ai-studio-a1veg-ultra-7-155h16gbssd-1tbvga-rtx-4050-6blcd-14inch-2k8-120hz-oled",
    "brand": "MSI",
    "categoryName": "Laptop MSI",
    "categorySlug": "laptop-msi",
    "price": 23500000,
    "originalPrice": 24000000,
    "discountPrice": 23500000,
    "discountPercent": 2,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1782307555947-829734186.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1782307555947-829734186.jpg",
      "https://zcomputer.vn/uploads/image-1782307555888-864184285.jpg",
      "https://zcomputer.vn/uploads/image-1782307556164-889856623.jpg",
      "https://zcomputer.vn/uploads/image-1782307556028-55063489.jpg",
      "https://zcomputer.vn/uploads/image-1782307556080-560154716.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 129,
    "ratings": {
      "average": 5,
      "count": 8
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M D5/I5 14600KF/RAM 16GB/SSD 500GB/VGA RTX 5060 8GB/750W/AIO 360/CASE ASUS AP201 WHITE",
    "slug": "bo-may-tinh-b760m-d5i5-14600kfram-16gbssd-500gbvga-rtx-5060-8gb750waio-360case-asus-ap201-white",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 24000000,
    "originalPrice": 25000000,
    "discountPrice": 24000000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1782307452636-862531861.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1782307452636-862531861.jpg",
      "https://zcomputer.vn/uploads/image-1782307452461-261711141.jpg",
      "https://zcomputer.vn/uploads/image-1782307452363-511715915.jpg",
      "https://zcomputer.vn/uploads/image-1782307452539-209678884.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 61,
    "ratings": {
      "average": 5,
      "count": 15
    }
  },
  {
    "name": "MÁY BỘ MINI LENOVO DEACENTRE MINI 01IRH8 I7 13700H/16GB/SSD 512GB/WIFI +BT 5.2 (TRẮNG)",
    "slug": "may-bo-mini-lenovo-deacentre-mini-01irh8-i7-13700h16gbssd-512gbwifi-bt-52-trang",
    "brand": "Lenovo",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 12500000,
    "originalPrice": 13500000,
    "discountPrice": 12500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784105545749-751860196.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784105545749-751860196.webp",
      "https://zcomputer.vn/uploads/image-1784105546825-66724384.webp",
      "https://zcomputer.vn/uploads/image-1784105548254-332767066.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 30,
    "ratings": {
      "average": 5,
      "count": 17
    }
  },
  {
    "name": "MÁY BỘ LENOVO THINKSTATION P340 SSF I9 10900/16GB/SSD 512GB/WIN 11",
    "slug": "may-bo-lenovo-thinkstation-p340-ssf-i9-1090016gbssd-512gbwin-11",
    "brand": "Lenovo",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 10500000,
    "originalPrice": 11500000,
    "discountPrice": 10500000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784105503783-855138417.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784105503783-855138417.webp",
      "https://zcomputer.vn/uploads/image-1784105504788-50830316.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 59,
    "ratings": {
      "average": 5,
      "count": 10
    }
  },
  {
    "name": "BỘ MÁY TÍNH H410M/I5 10400F/RAM 16GB/SSD 256GB/VGA RX 580 8G/650W/TẢN KHÍ/CASE MAGIC KÈM 4 FAN LED",
    "slug": "bo-may-tinh-h410mi5-10400fram-16gbssd-256gbvga-rx-580-8g650wtan-khicase-magic-kem-4-fan-led",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 8700000,
    "originalPrice": 9700000,
    "discountPrice": 8700000,
    "discountPercent": 10,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784105701650-732554954.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784105701650-732554954.webp",
      "https://zcomputer.vn/uploads/image-1784104807978-197219233.webp",
      "https://zcomputer.vn/uploads/image-1784104809882-404125290.webp",
      "https://zcomputer.vn/uploads/image-1784105700825-424389580.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 114,
    "ratings": {
      "average": 5,
      "count": 12
    }
  },
  {
    "name": "BỘ MÁY TÍNH B650M D5/RYZEN 5 7500F/RAM 16GB (8Gx2)/SSD 500GB/VGA RTX 5060 8GB/750W/TẢN KHÍ/CASE XIGMATEK BỂ CÁ KÈM 7 FAN LED",
    "slug": "bo-may-tinh-b650m-d5ryzen-5-7500fram-16gb-8gx2ssd-500gbvga-rtx-5060-8gb750wtan-khicase-xigmatek-be-ca-kem-7-fan-led",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 19500000,
    "originalPrice": 20500000,
    "discountPrice": 19500000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1782129683517-528448681.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1782129683517-528448681.jpg",
      "https://zcomputer.vn/uploads/image-1782129683621-351043569.jpg",
      "https://zcomputer.vn/uploads/image-1782129683724-84771609.jpg",
      "https://zcomputer.vn/uploads/image-1782129683843-553286881.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 58,
    "ratings": {
      "average": 5,
      "count": 34
    }
  },
  {
    "name": "BỘ MÁY TÍNH H610M KOLOE/ I3 12100F/ 16GB RAM/ 256GB SSD/ VGA 1060 3GB/ NGUỒN 550W/ CASE BỂ CÁ KÈM 7 FAN",
    "slug": "bo-may-tinh-h610m-koloe-i3-12100f-16gb-ram-256gb-ssd-vga-1060-3gb-nguon-550w-case-be-ca-kem-7-fan",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 8900000,
    "originalPrice": 9900000,
    "discountPrice": 8900000,
    "discountPercent": 10,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1782129199567-795979028.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1782129199567-795979028.jpg",
      "https://zcomputer.vn/uploads/image-1782129199670-798708207.jpg",
      "https://zcomputer.vn/uploads/image-1782129199790-473877251.jpg",
      "https://zcomputer.vn/uploads/image-1782129210644-374913683.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 64,
    "ratings": {
      "average": 5,
      "count": 30
    }
  },
  {
    "name": "LAPTOP DELL INSPIRON 16 7630 2-IN-1 I7 1360P/16GB/SSD 512GB/LCD 16INCH WUXGA (1920 x 1200) 60HZ TOUCH",
    "slug": "laptop-dell-inspiron-16-7630-2-in-1-i7-1360p16gbssd-512gblcd-16inch-wuxga-1920-x-1200-60hz-touch",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 14500000,
    "originalPrice": 15500000,
    "discountPrice": 14500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784085594249-111354223.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784085594249-111354223.webp",
      "https://zcomputer.vn/uploads/image-1784085592363-329294051.webp",
      "https://zcomputer.vn/uploads/image-1784085592952-794589608.webp",
      "https://zcomputer.vn/uploads/image-1784085591703-96267832.webp",
      "https://zcomputer.vn/uploads/image-1784085593704-308973238.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 105,
    "ratings": {
      "average": 5,
      "count": 23
    }
  },
  {
    "name": "BỘ MÁY TÍNH B560M MSI/ I5 10400F/ RAM 16GB/ SSD 250GB/ RTX 2060 6GB/ NGUỒN 650W/ CASE BỂ CÁ/ TẢN KHÍ",
    "slug": "bo-may-tinh-b560m-msi-i5-10400f-ram-16gb-ssd-250gb-rtx-2060-6gb-nguon-650w-case-be-ca-tan-khi",
    "brand": "MSI",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 10000000,
    "originalPrice": 11000000,
    "discountPrice": 10000000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1782128263604-258724003.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1782128263604-258724003.jpg",
      "https://zcomputer.vn/uploads/image-1782128263520-987652912.jpg",
      "https://zcomputer.vn/uploads/image-1782128263689-274749872.jpg",
      "https://zcomputer.vn/uploads/image-1782128263776-767773718.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 43,
    "ratings": {
      "average": 5,
      "count": 25
    }
  },
  {
    "name": "BỘ MÁY TÍNH H610M-K/I5 13400F/ RAM 16GB/ SSD 512GB/ RTX 3050 6GB/ NGUỒN 650W/ CASE BỂ CÁ/ TẢN KH",
    "slug": "bo-may-tinh-h610m-ki5-13400f-ram-16gb-ssd-512gb-rtx-3050-6gb-nguon-650w-case-be-ca-tan-kh",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 14500000,
    "originalPrice": 15500000,
    "discountPrice": 14500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1782128166046-449622064.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1782128166046-449622064.jpg",
      "https://zcomputer.vn/uploads/image-1782128166143-964801630.jpg",
      "https://zcomputer.vn/uploads/image-1782128166239-381763326.jpg",
      "https://zcomputer.vn/uploads/image-1782128166338-512979755.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 93,
    "ratings": {
      "average": 5,
      "count": 14
    }
  },
  {
    "name": "LAPTOP HP OMEN GAMING 16/I7 12700H/16GB/SSD 1TB/VGA RTX 3070TI 6G/ LCD 16INCH 2K 165HZ",
    "slug": "laptop-hp-omen-gaming-16i7-12700h16gbssd-1tbvga-rtx-3070ti-6g-lcd-16inch-2k-165hz",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 21900000,
    "originalPrice": 22900000,
    "discountPrice": 21900000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1782128067083-891856569.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1782128067083-891856569.jpg",
      "https://zcomputer.vn/uploads/image-1782128067313-181328784.jpg",
      "https://zcomputer.vn/uploads/image-1782128067011-404065503.jpg",
      "https://zcomputer.vn/uploads/image-1782128067174-357819181.jpg",
      "https://zcomputer.vn/uploads/image-1782128067232-386974795.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 51,
    "ratings": {
      "average": 5,
      "count": 27
    }
  },
  {
    "name": "LAPTOP DELL ALIENWARE M16 R1 I9 13900HX/RAM 16GB/SSD 1TB/VGA RTX 4090 16GDDR6/LCD 16.INCH 2K 240HZ",
    "slug": "laptop-dell-alienware-m16-r1-i9-13900hxram-16gbssd-1tbvga-rtx-4090-16gddr6lcd-16inch-2k-240hz",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 44900000,
    "originalPrice": 45900000,
    "discountPrice": 44900000,
    "discountPercent": 2,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1782127993508-319959503.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1782127993508-319959503.jpg",
      "https://zcomputer.vn/uploads/image-1782127993416-89153628.jpg",
      "https://zcomputer.vn/uploads/image-1782127993585-848936262.jpg",
      "https://zcomputer.vn/uploads/image-1782127993714-647888903.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 99,
    "ratings": {
      "average": 5,
      "count": 29
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD T14 GEN 3 I7 1270P/16GB/SSD 512GB/ LCD 14INCH IPS WUXGA (1920 x 1200)",
    "slug": "laptop-lenovo-thinkpad-t14-gen-3-i7-1270p16gbssd-512gb-lcd-14inch-ips-wuxga-1920-x-1200",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 13500000,
    "originalPrice": 14500000,
    "discountPrice": 13500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784622908963-292152540.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784622908963-292152540.webp",
      "https://zcomputer.vn/uploads/image-1784622911923-35812302.webp",
      "https://zcomputer.vn/uploads/image-1784622913686-713221650.webp",
      "https://zcomputer.vn/uploads/image-1784622915265-111731346.webp",
      "https://zcomputer.vn/uploads/image-1784622910350-988556232.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 92,
    "ratings": {
      "average": 5,
      "count": 33
    }
  },
  {
    "name": "LAPTOP DELL GAMING G16 7630 I9 13900HX/16GB/SSD 1TB/VGA RTX 4070 8GDDR6/LCD 16INCH 2K 240HZ",
    "slug": "laptop-dell-gaming-g16-7630-i9-13900hx16gbssd-1tbvga-rtx-4070-8gddr6lcd-16inch-2k-240hz",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 29500000,
    "originalPrice": 32900000,
    "discountPrice": 29500000,
    "discountPercent": 10,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784093354157-828633839.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784093354157-828633839.webp",
      "https://zcomputer.vn/uploads/image-1784093351990-48302953.webp",
      "https://zcomputer.vn/uploads/image-1784093352873-93322352.webp",
      "https://zcomputer.vn/uploads/image-1784093355216-580307009.webp",
      "https://zcomputer.vn/uploads/image-1784093356259-843029509.webp",
      "https://zcomputer.vn/uploads/image-1784093357152-322988640.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 91,
    "ratings": {
      "average": 5,
      "count": 34
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD X1 CARBON GEN 10 I7 1270P/32GB/SSD 256GB/LCD 14INCH (3840 x 2160) 4K 60HZ",
    "slug": "laptop-lenovo-thinkpad-x1-carbon-gen-10-i7-1270p32gbssd-256gblcd-14inch-3840-x-2160-4k-60hz",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 19500000,
    "originalPrice": 20500000,
    "discountPrice": 19500000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784092172484-459743736.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784092172484-459743736.webp",
      "https://zcomputer.vn/uploads/image-1784092171310-596659468.webp",
      "https://zcomputer.vn/uploads/image-1784092173628-379342705.webp",
      "https://zcomputer.vn/uploads/image-1784092174805-549577014.webp",
      "https://zcomputer.vn/uploads/image-1784092175860-240836873.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 20,
    "ratings": {
      "average": 5,
      "count": 12
    }
  },
  {
    "name": "LAPTOP ASUS VIVOBOOK K3605VC-RP431 I5 13420H/16GB/SSD 512GB/ VGA 3050 4G/LCD 16INCH 144HZ – BH 9/2027",
    "slug": "laptop-asus-vivobook-k3605vc-rp431-i5-13420h16gbssd-512gb-vga-3050-4glcd-16inch-144hz-bh-92027",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 13900000,
    "originalPrice": 14900000,
    "discountPrice": 13900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784092699768-292165300.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784092699768-292165300.webp",
      "https://zcomputer.vn/uploads/image-1784092694449-377845006.webp",
      "https://zcomputer.vn/uploads/image-1784092695442-493398238.webp",
      "https://zcomputer.vn/uploads/image-1784092696234-38362302.webp",
      "https://zcomputer.vn/uploads/image-1784092697009-872222246.webp",
      "https://zcomputer.vn/uploads/image-1784092697903-315269781.webp",
      "https://zcomputer.vn/uploads/image-1784092698886-350575675.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 37,
    "ratings": {
      "average": 5,
      "count": 31
    }
  },
  {
    "name": "LAPTOP LENOVO LOQ 2023 CORE I5 12450H/12GB/SSD 512GB/VGA RTX 3050 6G/LCD 15.6INCH FHD 144HZ BH 08/2026",
    "slug": "laptop-lenovo-loq-2023-core-i5-12450h12gbssd-512gbvga-rtx-3050-6glcd-156inch-fhd-144hz-bh-082026",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 15900000,
    "originalPrice": 16900000,
    "discountPrice": 15900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784100099006-826505230.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784100099006-826505230.webp",
      "https://zcomputer.vn/uploads/image-1784100095519-882513265.webp",
      "https://zcomputer.vn/uploads/image-1784100096306-950530225.webp",
      "https://zcomputer.vn/uploads/image-1784100097278-573989270.webp",
      "https://zcomputer.vn/uploads/image-1784100097999-622584254.webp",
      "https://zcomputer.vn/uploads/image-1784100099620-677618381.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 62,
    "ratings": {
      "average": 5,
      "count": 25
    }
  },
  {
    "name": "LAPTOP LENOVO IDEAPAD GAMING 3 15ACH6 Ryzen 5 5600H/16GB/SSD 256GB/ RTX 3050 4G/ 15.6″ FHD IPS 120HZ",
    "slug": "laptop-lenovo-ideapad-gaming-3-15ach6-ryzen-5-5600h16gbssd-256gb-rtx-3050-4g-156-fhd-ips-120hz",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 11500000,
    "originalPrice": 12500000,
    "discountPrice": 11500000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784100239635-536294625.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784100239635-536294625.webp",
      "https://zcomputer.vn/uploads/image-1784100238150-928620951.webp",
      "https://zcomputer.vn/uploads/image-1784100238853-898052902.webp",
      "https://zcomputer.vn/uploads/image-1784100240572-64243116.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 112,
    "ratings": {
      "average": 5,
      "count": 24
    }
  },
  {
    "name": "LAPTOP HP VICTUS 15-FBRXXX RYZEN 5 7535H/16GB/SSD 512GB/VGA RX 6550M 4GB/LCD 15.6INCH FHD 144HZ",
    "slug": "laptop-hp-victus-15-fbrxxx-ryzen-5-7535h16gbssd-512gbvga-rx-6550m-4gblcd-156inch-fhd-144hz",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 13900000,
    "originalPrice": 14900000,
    "discountPrice": 13900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784092127226-425907890.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784092127226-425907890.webp",
      "https://zcomputer.vn/uploads/image-1784092129709-36748978.webp",
      "https://zcomputer.vn/uploads/image-1784092128856-495425591.webp",
      "https://zcomputer.vn/uploads/image-1784092127997-535710404.webp",
      "https://zcomputer.vn/uploads/image-1784092130699-975664002.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 34,
    "ratings": {
      "average": 5,
      "count": 18
    }
  },
  {
    "name": "LAPTOP HP VICTUS 15 15-fa0033dx I5 12450H/16GB/SSD 512GB/VGA RTX 3050 4G/LCD 15.6INCH 144HZ",
    "slug": "laptop-hp-victus-15-15-fa0033dx-i5-12450h16gbssd-512gbvga-rtx-3050-4glcd-156inch-144hz",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 13500000,
    "originalPrice": 14500000,
    "discountPrice": 13500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784100008931-110975944.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784100008931-110975944.webp",
      "https://zcomputer.vn/uploads/image-1784100006672-421558515.webp",
      "https://zcomputer.vn/uploads/image-1784100007258-287940120.webp",
      "https://zcomputer.vn/uploads/image-1784100007854-866046001.webp",
      "https://zcomputer.vn/uploads/image-1784100008391-439729099.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 129,
    "ratings": {
      "average": 5,
      "count": 8
    }
  },
  {
    "name": "LAPTOP DELL LATITUDE 5430 I7 1265U/16GB/SSD 512GB/LCD 14INCH FHD CẢM ỨNG",
    "slug": "laptop-dell-latitude-5430-i7-1265u16gbssd-512gblcd-14inch-fhd-cam-ung",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 10900000,
    "originalPrice": 11900000,
    "discountPrice": 10900000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784099870583-891963938.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784099870583-891963938.webp",
      "https://zcomputer.vn/uploads/image-1784099868583-195354972.webp",
      "https://zcomputer.vn/uploads/image-1784099869020-692631098.webp",
      "https://zcomputer.vn/uploads/image-1784099869421-368998405.webp",
      "https://zcomputer.vn/uploads/image-1784099869811-307810225.webp",
      "https://zcomputer.vn/uploads/image-1784099870246-492488240.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 34,
    "ratings": {
      "average": 5,
      "count": 36
    }
  },
  {
    "name": "LAPTOP ASUS ZENBOOK 14 OLED Q425M ULTRAL 7 155H/16GB/512GB/INTEL ARC GRAPHICS/LCD 14INCH WUXGA TOUCH",
    "slug": "laptop-asus-zenbook-14-oled-q425m-ultral-7-155h16gb512gbintel-arc-graphicslcd-14inch-wuxga-touch",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 16500000,
    "originalPrice": 17500000,
    "discountPrice": 16500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784092646189-959897037.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784092646189-959897037.webp",
      "https://zcomputer.vn/uploads/image-1784092646879-958835249.webp",
      "https://zcomputer.vn/uploads/image-1784092647582-183295906.webp",
      "https://zcomputer.vn/uploads/image-1784092648143-520742045.webp",
      "https://zcomputer.vn/uploads/image-1784092648682-900105788.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 106,
    "ratings": {
      "average": 5,
      "count": 35
    }
  },
  {
    "name": "LAPTOP MSI MODERN 14 C13M I7 1355U/16GB/SSD 512GB/LCD 14INCH FHD",
    "slug": "laptop-msi-modern-14-c13m-i7-1355u16gbssd-512gblcd-14inch-fhd",
    "brand": "MSI",
    "categoryName": "Laptop MSI",
    "categorySlug": "laptop-msi",
    "price": 11900000,
    "originalPrice": 12900000,
    "discountPrice": 11900000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784093312416-224163952.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784093312416-224163952.webp",
      "https://zcomputer.vn/uploads/image-1784093309047-662897238.webp",
      "https://zcomputer.vn/uploads/image-1784093310341-844456924.webp",
      "https://zcomputer.vn/uploads/image-1784093311312-26409964.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 48,
    "ratings": {
      "average": 5,
      "count": 35
    }
  },
  {
    "name": "MACBOOK PRO 13.3INCH M1 2020 (16GB/SSD 512GB/GRAY) PIN 86%",
    "slug": "macbook-pro-133inch-m1-2020-16gbssd-512gbgray-pin-86percent",
    "brand": "Apple",
    "categoryName": "Macbook",
    "categorySlug": "macbook",
    "price": 16500000,
    "originalPrice": 17500000,
    "discountPrice": 16500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784099558465-829075923.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784099558465-829075923.webp",
      "https://zcomputer.vn/uploads/image-1784099556549-33695979.webp",
      "https://zcomputer.vn/uploads/image-1784099557265-904116333.webp",
      "https://zcomputer.vn/uploads/image-1784099557867-295355090.webp",
      "https://zcomputer.vn/uploads/image-1784099559297-964906093.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 70,
    "ratings": {
      "average": 5,
      "count": 16
    }
  },
  {
    "name": "MACBOOK PRO 13.3INCH M1 2020 (16GB/SSD 1TB/GRAY) PIN 86%",
    "slug": "macbook-pro-133inch-m1-2020-16gbssd-1tbgray-pin-86percent",
    "brand": "Apple",
    "categoryName": "Macbook",
    "categorySlug": "macbook",
    "price": 17500000,
    "originalPrice": 18500000,
    "discountPrice": 17500000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784091888885-865282301.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784091888885-865282301.webp",
      "https://zcomputer.vn/uploads/image-1784091885403-839657105.webp",
      "https://zcomputer.vn/uploads/image-1784091886307-39414155.webp",
      "https://zcomputer.vn/uploads/image-1784091887185-27653077.webp",
      "https://zcomputer.vn/uploads/image-1784091888029-570334123.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 97,
    "ratings": {
      "average": 5,
      "count": 25
    }
  },
  {
    "name": "LAPTOP DELL XPS 15 9500 I9 10885H/16GB/SSD 256GB/VGA GTX 1650TI 4G/LCD 15.6INCH 4K UHD (3840 x 2160) 60HZ WHITE",
    "slug": "laptop-dell-xps-15-9500-i9-10885h16gbssd-256gbvga-gtx-1650ti-4glcd-156inch-4k-uhd-3840-x-2160-60hz-white",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 14900000,
    "originalPrice": 15900000,
    "discountPrice": 14900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784471029648-836808877.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784471029648-836808877.webp",
      "https://zcomputer.vn/uploads/image-1784091356907-773859792.webp",
      "https://zcomputer.vn/uploads/image-1784091353275-659839971.webp",
      "https://zcomputer.vn/uploads/image-1784471031028-989962062.webp",
      "https://zcomputer.vn/uploads/image-1784091355791-500014632.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 81,
    "ratings": {
      "average": 5,
      "count": 10
    }
  },
  {
    "name": "LAPTOP LENOVO LEGION 5 2022 RYZEN 5 6600H/16GB/SSD 512GB/VGA RTX 3050 4GB/LCD 15.6INCH 2K 165HZ",
    "slug": "laptop-lenovo-legion-5-2022-ryzen-5-6600h16gbssd-512gbvga-rtx-3050-4gblcd-156inch-2k-165hz-1784621284563",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 17500000,
    "originalPrice": 18990000,
    "discountPrice": 17500000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784091418147-712300167.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784091418147-712300167.webp",
      "https://zcomputer.vn/uploads/image-1784091416186-567206920.webp",
      "https://zcomputer.vn/uploads/image-1784091408817-621043825.webp",
      "https://zcomputer.vn/uploads/image-1784091411290-256140834.webp",
      "https://zcomputer.vn/uploads/image-1784091413628-886982091.webp",
      "https://zcomputer.vn/uploads/image-1784091419540-296647315.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 70,
    "ratings": {
      "average": 5,
      "count": 19
    }
  },
  {
    "name": "LAPTOP DELL INSPIRON 14 7440 2-IN-1 CORE 5 120U/8GB/SSD 512GB/LCD 14INCH WUXGA (1920 x 1200) 60HZ TOUCH",
    "slug": "laptop-dell-inspiron-14-7440-2-in-1-core-5-120u8gbssd-512gblcd-14inch-wuxga-1920-x-1200-60hz-touch",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 11500000,
    "originalPrice": 12500000,
    "discountPrice": 11500000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784091079750-237272126.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784091079750-237272126.webp",
      "https://zcomputer.vn/uploads/image-1784091075318-705680624.webp",
      "https://zcomputer.vn/uploads/image-1784091076582-685802528.webp",
      "https://zcomputer.vn/uploads/image-1784091078183-135011689.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 66,
    "ratings": {
      "average": 5,
      "count": 10
    }
  },
  {
    "name": "LAPTOP DELL INSPIRON 16 7620 2-IN-1 I7 1260P/16GB/SSD 256GB/LCD 16INCH WUXGA (1920 x 1200) 60HZ TOUCH",
    "slug": "laptop-dell-inspiron-16-7620-2-in-1-i7-1260p16gbssd-256gblcd-16inch-wuxga-1920-x-1200-60hz-touch",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 12900000,
    "originalPrice": 13500000,
    "discountPrice": 12900000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784470208855-486825216.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784470208855-486825216.webp",
      "https://zcomputer.vn/uploads/image-1784091028990-521952960.webp",
      "https://zcomputer.vn/uploads/image-1784091027872-899908895.webp",
      "https://zcomputer.vn/uploads/image-1784470388125-990328981.webp",
      "https://zcomputer.vn/uploads/image-1784091030301-497979940.webp",
      "https://zcomputer.vn/uploads/image-1784470386537-182511380.webp",
      "https://zcomputer.vn/uploads/image-1784091033175-580488692.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 117,
    "ratings": {
      "average": 5,
      "count": 8
    }
  },
  {
    "name": "LAPTOP ASUS VIVOBOOK S 14 Flip TP3402VA I9 13900H/16GB/SSD 512GB/LCD 14INCH WUXGA (1920 x 1200) TOUCH",
    "slug": "laptop-asus-vivobook-s-14-flip-tp3402va-i9-13900h16gbssd-512gblcd-14inch-wuxga-1920-x-1200-touch",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 15900000,
    "originalPrice": 16900000,
    "discountPrice": 15900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784299121061-87923302.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784299121061-87923302.webp",
      "https://zcomputer.vn/uploads/image-1784299126730-696111836.webp",
      "https://zcomputer.vn/uploads/image-1784299125357-544875694.webp",
      "https://zcomputer.vn/uploads/image-1784299122559-549475022.webp",
      "https://zcomputer.vn/uploads/image-1784299124051-278206652.webp",
      "https://zcomputer.vn/uploads/image-1784299127975-791030106.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 128,
    "ratings": {
      "average": 5,
      "count": 31
    }
  },
  {
    "name": "LAPTOP GIGABYTE G5 MF I5 12450H/16GB/SSD 512GB/VGA RTX 4050 6GB/ LCD 15.6INCH 144HZ – BH 10/2026",
    "slug": "laptop-gigabyte-g5-mf-i5-12450h16gbssd-512gbvga-rtx-4050-6gb-lcd-156inch-144hz-bh-102026",
    "brand": "Gigabyte",
    "categoryName": "Laptop Gigabyte",
    "categorySlug": "laptop-gigabyte",
    "price": 15900000,
    "originalPrice": 16900000,
    "discountPrice": 15900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784090972220-721540646.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784090972220-721540646.webp",
      "https://zcomputer.vn/uploads/image-1784090970730-525891692.webp",
      "https://zcomputer.vn/uploads/image-1784090973517-198323784.webp",
      "https://zcomputer.vn/uploads/image-1784090974794-839557979.webp",
      "https://zcomputer.vn/uploads/image-1784090975987-909385847.webp",
      "https://zcomputer.vn/uploads/image-1784090977061-752031329.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 19,
    "ratings": {
      "average": 5,
      "count": 19
    }
  },
  {
    "name": "LAPTOP LENOVO LEGION 5 PRO Y9000P I7 12700H/16GB/SSD 512GB/VGA RTX 3060 6GB/LCD 16INCH 2K5 165HZ",
    "slug": "laptop-lenovo-legion-5-pro-y9000p-i7-12700h16gbssd-512gbvga-rtx-3060-6gblcd-16inch-2k5-165hz",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 22500000,
    "originalPrice": 23500000,
    "discountPrice": 22500000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784091764889-662490224.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784091764889-662490224.webp",
      "https://zcomputer.vn/uploads/image-1784091761482-532705570.webp",
      "https://zcomputer.vn/uploads/image-1784091763157-975847903.webp",
      "https://zcomputer.vn/uploads/image-1784091766330-876582052.webp",
      "https://zcomputer.vn/uploads/image-1784091767555-460697728.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 71,
    "ratings": {
      "average": 5,
      "count": 29
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD X1 CARBON GEN 9 I7 1185G7/16GB/SSD 512GB/LCD 14INCH (3840 x 2400) 4K",
    "slug": "laptop-lenovo-thinkpad-x1-carbon-gen-9-i7-1185g716gbssd-512gblcd-14inch-3840-x-2400-4k",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 14900000,
    "originalPrice": 15900000,
    "discountPrice": 14900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784620881863-188020635.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784620881863-188020635.webp",
      "https://zcomputer.vn/uploads/image-1784091704338-621668748.webp",
      "https://zcomputer.vn/uploads/image-1784091700105-834266230.webp",
      "https://zcomputer.vn/uploads/image-1784620884502-520413518.webp",
      "https://zcomputer.vn/uploads/image-1784620883235-401659757.webp",
      "https://zcomputer.vn/uploads/image-1784091706039-100761031.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 121,
    "ratings": {
      "average": 5,
      "count": 35
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD YOGA X1 GEN 6 I7 1185G7/32GB/SSD 512GB/LCD 14INCH WUXGA (1920 x 1200) TOUCH",
    "slug": "laptop-lenovo-thinkpad-yoga-x1-gen-6-i7-1185g732gbssd-512gblcd-14inch-wuxga-1920-x-1200-touch",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 13900000,
    "originalPrice": 14900000,
    "discountPrice": 13900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784091609695-852164962.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784091609695-852164962.webp",
      "https://zcomputer.vn/uploads/image-1784091606972-700897100.webp",
      "https://zcomputer.vn/uploads/image-1784091608414-682021157.webp",
      "https://zcomputer.vn/uploads/image-1784091607686-112428065.webp",
      "https://zcomputer.vn/uploads/image-1784091609012-410986380.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 66,
    "ratings": {
      "average": 5,
      "count": 27
    }
  },
  {
    "name": "LAPTOP DELL PRECISION 7750 I7 10850H/16GB/SSD 512GB/VGA QUADRO RTX 3000 6GDDR6/LCD 17.3INCH FHD IPS",
    "slug": "laptop-dell-precision-7750-i7-10850h16gbssd-512gbvga-quadro-rtx-3000-6gddr6lcd-173inch-fhd-ips",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 15500000,
    "originalPrice": 16500000,
    "discountPrice": 15500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784091467437-728740723.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784091467437-728740723.webp",
      "https://zcomputer.vn/uploads/image-1784091464276-435362733.webp",
      "https://zcomputer.vn/uploads/image-1784471822924-979429373.webp",
      "https://zcomputer.vn/uploads/image-1784471823762-59955424.webp",
      "https://zcomputer.vn/uploads/image-1784091460500-681833913.webp",
      "https://zcomputer.vn/uploads/image-1784091469929-152050205.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 129,
    "ratings": {
      "average": 5,
      "count": 14
    }
  },
  {
    "name": "LAPTOP HP ELITEBOOK 840 G9 I7 1265U/16GB/SSD 512GB/LCD 14INCH FHD",
    "slug": "laptop-hp-elitebook-840-g9-i7-1265u16gbssd-512gblcd-14inch-fhd",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 11500000,
    "originalPrice": 12500000,
    "discountPrice": 11500000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784090887240-585032597.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784090887240-585032597.webp",
      "https://zcomputer.vn/uploads/image-1784090888810-180091763.webp",
      "https://zcomputer.vn/uploads/image-1784090890604-179663176.webp",
      "https://zcomputer.vn/uploads/image-1785583379782-583416494.webp",
      "https://zcomputer.vn/uploads/image-1785583378221-919756828.webp",
      "https://zcomputer.vn/uploads/image-1784090892144-617550619.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 114,
    "ratings": {
      "average": 5,
      "count": 16
    }
  },
  {
    "name": "LAPTOP LENOVO YOGA 9 14ITL5 2-IN-1 I7 1185G7/16GB/SSD 512GB/LCD 14INCH FHD TOUCH",
    "slug": "laptop-lenovo-yoga-9-14itl5-2-in-1-i7-1185g716gbssd-512gblcd-14inch-fhd-touch",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 9900000,
    "originalPrice": 10900000,
    "discountPrice": 9900000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784090805037-17717497.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784090805037-17717497.webp",
      "https://zcomputer.vn/uploads/image-1784090801075-820824589.webp",
      "https://zcomputer.vn/uploads/image-1784090802129-470105140.webp",
      "https://zcomputer.vn/uploads/image-1784090803170-692119456.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 33,
    "ratings": {
      "average": 5,
      "count": 24
    }
  },
  {
    "name": "LAPTOP DELL LATITUDE 2-IN-1 7420 I7 1185G7/16GB/SSD 256GB/LCD 14INCH FHD TOUCH",
    "slug": "laptop-dell-latitude-2-in-1-7420-i7-1185g716gbssd-256gblcd-14inch-fhd-touch",
    "brand": "Dell",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 8500000,
    "originalPrice": 9500000,
    "discountPrice": 8500000,
    "discountPercent": 11,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784090649549-129995168.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784090649549-129995168.webp",
      "https://zcomputer.vn/uploads/image-1784090646624-257344135.webp",
      "https://zcomputer.vn/uploads/image-1784090651337-526775796.webp",
      "https://zcomputer.vn/uploads/image-1784090652930-694344938.webp",
      "https://zcomputer.vn/uploads/image-1784090655110-972494775.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 35,
    "ratings": {
      "average": 5,
      "count": 31
    }
  },
  {
    "name": "LAPTOP DELL INSPIRON 14 7435 2-IN-1 RYZEN 7 7730U/16GB/SSD 512GB/LCD 14INCH WUXGA (1920 x 1200) TOUCH",
    "slug": "laptop-dell-inspiron-14-7435-2-in-1-ryzen-7-7730u16gbssd-512gblcd-14inch-wuxga-1920-x-1200-touch",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 12500000,
    "originalPrice": 13500000,
    "discountPrice": 12500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784090586187-607681851.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784090586187-607681851.webp",
      "https://zcomputer.vn/uploads/image-1784090588705-645955472.webp",
      "https://zcomputer.vn/uploads/image-1784090590253-931890758.webp",
      "https://zcomputer.vn/uploads/image-1784090592466-20146263.webp",
      "https://zcomputer.vn/uploads/image-1784090594976-458345727.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 88,
    "ratings": {
      "average": 5,
      "count": 36
    }
  },
  {
    "name": "\tLAPTOP ACER NITRO 5 TIGER AN515-58 I5 12500H/ 16GB/SSD 512GB/ VGA RTX 3050 4G/ 15.6INCH FHD 165HZ",
    "slug": "laptop-acer-nitro-5-tiger-an515-58-i5-12500h-16gbssd-512gb-vga-rtx-3050-4g-156inch-fhd-165hz",
    "brand": "Acer",
    "categoryName": "Laptop Acer",
    "categorySlug": "laptop-acer",
    "price": 14500000,
    "originalPrice": 15500000,
    "discountPrice": 14500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784091815432-490273379.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784091815432-490273379.webp",
      "https://zcomputer.vn/uploads/image-1784091812121-81622575.webp",
      "https://zcomputer.vn/uploads/image-1784091813779-625662717.webp",
      "https://zcomputer.vn/uploads/image-1784091816620-275936514.webp",
      "https://zcomputer.vn/uploads/image-1784091818160-82951431.webp",
      "https://zcomputer.vn/uploads/image-1784091819441-992577327.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 102,
    "ratings": {
      "average": 5,
      "count": 11
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD X1 YOGA GEN 5 I7 10610U/16GB/SSD 256GB/LCD 14INCH 4K UHD (3840 x 2160) TOUCH 60HZ",
    "slug": "laptop-lenovo-thinkpad-x1-yoga-gen-5-i7-10610u16gbssd-256gblcd-14inch-4k-uhd-3840-x-2160-touch-60hz",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 10500000,
    "originalPrice": 11500000,
    "discountPrice": 10500000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088305718-480131646.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088305718-480131646.webp",
      "https://zcomputer.vn/uploads/image-1784088303492-931727487.webp",
      "https://zcomputer.vn/uploads/image-1784088304626-711902232.webp",
      "https://zcomputer.vn/uploads/image-1784088306725-535011949.webp",
      "https://zcomputer.vn/uploads/image-1784088307650-703490964.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 122,
    "ratings": {
      "average": 5,
      "count": 22
    }
  },
  {
    "name": "LAPTOP MSI GAMING ALPHA 15 B5EEK-036VN RYZEN 7 5800H/16GB/512GB/ VGA RX 6600M 8GB/LCD 15.6INCH 144HZ FHD IPS",
    "slug": "laptop-msi-gaming-alpha-15-b5eek-036vn-ryzen-7-5800h16gb512gb-vga-rx-6600m-8gblcd-156inch-144hz-fhd-ips",
    "brand": "MSI",
    "categoryName": "Laptop MSI",
    "categorySlug": "laptop-msi",
    "price": 12500000,
    "originalPrice": 13500000,
    "discountPrice": 12500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088233002-702772096.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088233002-702772096.webp",
      "https://zcomputer.vn/uploads/image-1784088233693-700558992.webp",
      "https://zcomputer.vn/uploads/image-1784088234337-409857299.webp",
      "https://zcomputer.vn/uploads/image-1784088234877-862533512.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 25,
    "ratings": {
      "average": 5,
      "count": 32
    }
  },
  {
    "name": "LAPTOP HP VICTUS 15-FB3116AX RYZEN 7 7745HS/16GB/SSD 512GB/VGA RTX 3050 6GB/LCD 15.6INCH 144HZ BH 9/2026 GEARVN",
    "slug": "laptop-hp-victus-15-fb3116ax-ryzen-7-7745hs16gbssd-512gbvga-rtx-3050-6gblcd-156inch-144hz-bh-92026-gearvn",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 16900000,
    "originalPrice": 17900000,
    "discountPrice": 16900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784817617251-125561311.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784817617251-125561311.webp",
      "https://zcomputer.vn/uploads/image-1784817622684-803838744.webp",
      "https://zcomputer.vn/uploads/image-1784817620022-46194493.webp",
      "https://zcomputer.vn/uploads/image-1784817618582-257994724.webp",
      "https://zcomputer.vn/uploads/image-1784817621404-852827058.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 131,
    "ratings": {
      "average": 5,
      "count": 36
    }
  },
  {
    "name": "LAPTOP ASUS VIVOBOOK PRO 15 N6506MJ ULTRA 9 185H/16GB/SSD 512GB/VGA RTX 3050 6GB/LCD 15.6INCH FHD OLED",
    "slug": "laptop-asus-vivobook-pro-15-n6506mj-ultra-9-185h16gbssd-512gbvga-rtx-3050-6gblcd-156inch-fhd-oled",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 18900000,
    "originalPrice": 19900000,
    "discountPrice": 18900000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785586367402-286044386.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785586367402-286044386.webp",
      "https://zcomputer.vn/uploads/image-1785586371714-476578855.webp",
      "https://zcomputer.vn/uploads/image-1785586368837-49816716.webp",
      "https://zcomputer.vn/uploads/image-1785586370311-788115332.webp",
      "https://zcomputer.vn/uploads/image-1785586373051-564689269.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 18,
    "ratings": {
      "average": 5,
      "count": 26
    }
  },
  {
    "name": "LAPTOP MSI PRESTIGE 14 EVO B13M-614CZ I7 13700H/32GB/SSD 512GB/LCD 14INCH WUXGA (1920 x 1200)",
    "slug": "laptop-msi-prestige-14-evo-b13m-614cz-i7-13700h32gbssd-512gblcd-14inch-wuxga-1920-x-1200",
    "brand": "MSI",
    "categoryName": "Laptop MSI",
    "categorySlug": "laptop-msi",
    "price": 14500000,
    "originalPrice": 15000000,
    "discountPrice": 14500000,
    "discountPercent": 3,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784363543359-900509149.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784363543359-900509149.webp",
      "https://zcomputer.vn/uploads/image-1784363545151-850526424.webp",
      "https://zcomputer.vn/uploads/image-1784363549339-974082733.webp",
      "https://zcomputer.vn/uploads/image-1784363546729-839913926.webp",
      "https://zcomputer.vn/uploads/image-1784363548124-651293989.webp",
      "https://zcomputer.vn/uploads/image-1784363550582-315481787.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 76,
    "ratings": {
      "average": 5,
      "count": 34
    }
  },
  {
    "name": "LAPTOP DELL LATITUDE 7440 I7 1365U/16GB/SSD 512GB/LCD 14INCH WUXGA (1920 x 1200) 60HZ",
    "slug": "laptop-dell-latitude-7440-i7-1365u16gbssd-512gblcd-14inch-wuxga-1920-x-1200-60hz",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 13500000,
    "originalPrice": 14500000,
    "discountPrice": 13500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784208902658-494715008.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784208902658-494715008.webp",
      "https://zcomputer.vn/uploads/image-1784208431352-412286206.webp",
      "https://zcomputer.vn/uploads/image-1784208430482-870991390.webp",
      "https://zcomputer.vn/uploads/image-1784208429647-860808805.webp",
      "https://zcomputer.vn/uploads/image-1784208428646-44565927.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 30,
    "ratings": {
      "average": 5,
      "count": 25
    }
  },
  {
    "name": "LAPTOP HP GAMING VICTUS 16 E0175AX R5 5600H/ 16GB/SSD 512GB/ RTX 3050TI 4G/ 16.1 inch FHD 144HZ/ Win 10",
    "slug": "laptop-hp-gaming-victus-16-e0175ax-r5-5600h-16gbssd-512gb-rtx-3050ti-4g-161-inch-fhd-144hz-win-10",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 12500000,
    "originalPrice": 13500000,
    "discountPrice": 12500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785584604401-457406679.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785584604401-457406679.webp",
      "https://zcomputer.vn/uploads/image-1785584612976-439024288.webp",
      "https://zcomputer.vn/uploads/image-1785584615541-300821648.webp",
      "https://zcomputer.vn/uploads/image-1785584608472-992109336.webp",
      "https://zcomputer.vn/uploads/image-1785584610346-222771619.webp",
      "https://zcomputer.vn/uploads/image-1785584606685-266815272.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 68,
    "ratings": {
      "average": 5,
      "count": 16
    }
  },
  {
    "name": "LAPTOP LENOVO LEGION SLIM 7 R9000X RYZEN 7 5800H/16GB/SSD 512GB/VGA RTX 3070 8GB/LCD 16INCH 2K 165HZ",
    "slug": "laptop-lenovo-legion-slim-7-r9000x-ryzen-7-5800h16gbssd-512gbvga-rtx-3070-8gblcd-16inch-2k-165hz",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 21900000,
    "originalPrice": 22900000,
    "discountPrice": 21900000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784622421866-999030299.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784622421866-999030299.webp",
      "https://zcomputer.vn/uploads/image-1784088535650-27504341.webp",
      "https://zcomputer.vn/uploads/image-1784088534846-806533348.webp",
      "https://zcomputer.vn/uploads/image-1784622423209-679934439.webp",
      "https://zcomputer.vn/uploads/image-1784088533912-389601111.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 26,
    "ratings": {
      "average": 5,
      "count": 9
    }
  },
  {
    "name": "LAPTOP ASUS VIVOBOOK OLED A1505VA-L1491W I7 13700H/16GB/SSD 512GB SSD/LCD 15.6INCH FHD OLED",
    "slug": "laptop-asus-vivobook-oled-a1505va-l1491w-i7-13700h16gbssd-512gb-ssdlcd-156inch-fhd-oled",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 14900000,
    "originalPrice": 15900000,
    "discountPrice": 14900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784360105555-445021491.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784360105555-445021491.webp",
      "https://zcomputer.vn/uploads/image-1784360103499-816535128.webp",
      "https://zcomputer.vn/uploads/image-1784360095679-399960011.webp",
      "https://zcomputer.vn/uploads/image-1784360101634-85927205.webp",
      "https://zcomputer.vn/uploads/image-1784360099759-956783566.webp",
      "https://zcomputer.vn/uploads/image-1784360097891-274783036.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 104,
    "ratings": {
      "average": 5,
      "count": 15
    }
  },
  {
    "name": "LAPTOP DELL GAMING G15 5530 I7 13650HX/16GB/SSD 512GB/VGA RTX 4060 6GB/LCD 15.6INCH 360HZ",
    "slug": "laptop-dell-gaming-g15-5530-i7-13650hx16gbssd-512gbvga-rtx-4060-6gblcd-156inch-360hz",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 23900000,
    "originalPrice": 24900000,
    "discountPrice": 23900000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1782102766089-911487914.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1782102766089-911487914.jpg",
      "https://zcomputer.vn/uploads/image-1782102766183-394463637.jpg",
      "https://zcomputer.vn/uploads/image-1782102766248-879661730.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 21,
    "ratings": {
      "average": 5,
      "count": 11
    }
  },
  {
    "name": "LAPTOP LENOVO LEGION 5 2024 16IRX9 I7 14650HX/16GB/SSD 512GB/VGA RTX 4060 8GB/LCD 16INCH 2K 165HZ",
    "slug": "laptop-lenovo-legion-5-2024-16irx9-i7-14650hx16gbssd-512gbvga-rtx-4060-8gblcd-16inch-2k-165hz",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 26500000,
    "originalPrice": 27500000,
    "discountPrice": 26500000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088656004-858635446.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088656004-858635446.webp",
      "https://zcomputer.vn/uploads/image-1784088658309-578726981.webp",
      "https://zcomputer.vn/uploads/image-1784088656771-712255442.webp",
      "https://zcomputer.vn/uploads/image-1784088657459-408907622.webp",
      "https://zcomputer.vn/uploads/image-1784088659274-752784749.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 90,
    "ratings": {
      "average": 5,
      "count": 12
    }
  },
  {
    "name": "LAPTOP LENOVO SLIM 7 PRO 14ARH7 RYZEN 7 7735HS/16GB/SSD 512GB/RTX 3050 6GB/LCD 14.5” 2K5 90HZ TOUCH",
    "slug": "laptop-lenovo-slim-7-pro-14arh7-ryzen-7-7735hs16gbssd-512gbrtx-3050-6gblcd-145-2k5-90hz-touch",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 16900000,
    "originalPrice": 17900000,
    "discountPrice": 16900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088603743-972605677.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088603743-972605677.webp",
      "https://zcomputer.vn/uploads/image-1784088600833-689391102.webp",
      "https://zcomputer.vn/uploads/image-1784088601403-117628061.webp",
      "https://zcomputer.vn/uploads/image-1784088602074-113278413.webp",
      "https://zcomputer.vn/uploads/image-1784088602974-897269691.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 46,
    "ratings": {
      "average": 5,
      "count": 21
    }
  },
  {
    "name": "LAPTOP ASUS ZENBOOK PRO 15 FLIP OLED UP6502ZD I7 12700H/16GB/SSD 512GB/INTEL ARC A370M 4G/LCD 15.6ICNH 2K8 120HZ OLED TOUCH",
    "slug": "laptop-asus-zenbook-pro-15-flip-oled-up6502zd-i7-12700h16gbssd-512gbintel-arc-a370m-4glcd-156icnh-2k8-120hz-oled-touch",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 15500000,
    "originalPrice": 16500000,
    "discountPrice": 15500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 134,
    "ratings": {
      "average": 5,
      "count": 9
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD T14 GEN 1 I7 10610U/16GB/SSD 512GB/LCD 14INCH FHD TOUCH",
    "slug": "laptop-lenovo-thinkpad-t14-gen-1-i7-10610u16gbssd-512gblcd-14inch-fhd-touch",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 8500000,
    "originalPrice": 9500000,
    "discountPrice": 8500000,
    "discountPercent": 11,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp",
      "https://zcomputer.vn/uploads/image-1784088695738-765035549.webp",
      "https://zcomputer.vn/uploads/image-1784088697417-434219077.webp",
      "https://zcomputer.vn/uploads/image-1784088698082-739269410.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 81,
    "ratings": {
      "average": 5,
      "count": 31
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD X1 CARBON GEN 9 I7 1185G7/32GB/SSD 512GB/LCD 14INCH (3840 x 2400) 4K",
    "slug": "laptop-lenovo-thinkpad-x1-carbon-gen-9-i7-1185g732gbssd-512gblcd-14inch-3840-x-2400-4k",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 16390000,
    "originalPrice": 17900000,
    "discountPrice": 16390000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1786165083867-50080112.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1786165083867-50080112.webp",
      "https://zcomputer.vn/uploads/image-1786165081095-439008485.webp",
      "https://zcomputer.vn/uploads/image-1786165076602-26249104.webp",
      "https://zcomputer.vn/uploads/image-1786165074899-719015013.webp",
      "https://zcomputer.vn/uploads/image-1786165079805-934053082.webp",
      "https://zcomputer.vn/uploads/image-1786165078102-100204237.webp",
      "https://zcomputer.vn/uploads/image-1786165082493-705534523.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 36,
    "ratings": {
      "average": 5,
      "count": 18
    }
  },
  {
    "name": "LAPTOP DELL XPS 13 9310 I7 1165G7/16GB/SSD 256GB/LCD 13.4INCH WUXGA (1920 x 1200) TOUCH",
    "slug": "laptop-dell-xps-13-9310-i7-1165g716gbssd-256gblcd-134inch-wuxga-1920-x-1200-touch",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 12900000,
    "originalPrice": 13900000,
    "discountPrice": 12900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1782102832051-42929099.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1782102832051-42929099.jpg",
      "https://zcomputer.vn/uploads/image-1782102832154-361809487.jpg",
      "https://zcomputer.vn/uploads/image-1782102831945-788817918.jpg",
      "https://zcomputer.vn/uploads/image-1782102832010-635489409.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 116,
    "ratings": {
      "average": 5,
      "count": 33
    }
  },
  {
    "name": "Laptop Acer Gaming Nitro 5 Eagle AN515-57-720A NH (i7 11800H/16GB RAM/512GB SSD/15.6″FHD 144Hz/RTX 3050TI 4GB/Win10/Đen)",
    "slug": "laptop-acer-gaming-nitro-5-eagle-an515-57-720a-nh-i7-11800h16gb-ram512gb-ssd156fhd-144hzrtx-3050ti-4gbwin10den",
    "brand": "Acer",
    "categoryName": "Laptop Acer",
    "categorySlug": "laptop-acer",
    "price": 13500000,
    "originalPrice": 14500000,
    "discountPrice": 13500000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784089194050-57984788.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784089194050-57984788.webp",
      "https://zcomputer.vn/uploads/image-1784089191506-189964622.webp",
      "https://zcomputer.vn/uploads/image-1784089192145-27034863.webp",
      "https://zcomputer.vn/uploads/image-1784089192747-984780139.webp",
      "https://zcomputer.vn/uploads/image-1784089193397-241062758.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 20,
    "ratings": {
      "average": 5,
      "count": 31
    }
  },
  {
    "name": "LAPTOP ASUS TUF F16 FX608JH-RV039W I5 13450HX/AI/16GB/SSD 512GB/VGA RTX 5050 8GB/LCD 16INCH WUXGA (1920 x 1200) 165HZ – BH 4/2028",
    "slug": "laptop-asus-tuf-f16-fx608jh-rv039w-i5-13450hxai16gbssd-512gbvga-rtx-5050-8gblcd-16inch-wuxga-1920-x-1200-165hz-bh-42028",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 23900000,
    "originalPrice": 24900000,
    "discountPrice": 23900000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 67,
    "ratings": {
      "average": 5,
      "count": 16
    }
  },
  {
    "name": "LAPTOP ASUS VIVOBOOK PRO 15 Q540VJ I9 13900H/16GB/SSD 512GB/VGA RTX 3050 6GB/LCD 15.6INCH 2K8 120HZ OLED",
    "slug": "laptop-asus-vivobook-pro-15-q540vj-i9-13900h16gbssd-512gbvga-rtx-3050-6gblcd-156inch-2k8-120hz-oled",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 18500000,
    "originalPrice": 19500000,
    "discountPrice": 18500000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784296059100-793438007.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784296059100-793438007.webp",
      "https://zcomputer.vn/uploads/image-1784296060626-752027589.webp",
      "https://zcomputer.vn/uploads/image-1784296065950-194872167.webp",
      "https://zcomputer.vn/uploads/image-1784296064721-12780828.webp",
      "https://zcomputer.vn/uploads/image-1784296063544-602212103.webp",
      "https://zcomputer.vn/uploads/image-1784296062145-271863524.webp",
      "https://zcomputer.vn/uploads/image-1784296057304-871295823.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 43,
    "ratings": {
      "average": 5,
      "count": 35
    }
  },
  {
    "name": "LAPTOP LENOVO LEGION 5 PRO 2022 I9 12900H/16GB/SSD 512GB/VGA RTX 3060 6G/LCD 16INCH 2K 165HZ",
    "slug": "laptop-lenovo-legion-5-pro-2022-i9-12900h16gbssd-512gbvga-rtx-3060-6glcd-16inch-2k-165hz",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 23500000,
    "originalPrice": 24500000,
    "discountPrice": 23500000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784815025574-397242558.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784815025574-397242558.webp",
      "https://zcomputer.vn/uploads/image-1784088463679-820653416.webp",
      "https://zcomputer.vn/uploads/image-1784088464975-998213226.webp",
      "https://zcomputer.vn/uploads/image-1784815027329-836425995.webp",
      "https://zcomputer.vn/uploads/image-1784088467136-866733792.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 110,
    "ratings": {
      "average": 5,
      "count": 18
    }
  },
  {
    "name": "LAPTOP GIGABYTE G5 MF5 RC555 I5 13500H/16GB/SSD 512GB/VGA RTX 4050 6GB/LCD 15.6INCH 144HZ – BH 2/2028 TGDĐ ( Siêu Lướt)",
    "slug": "laptop-gigabyte-g5-mf5-rc555-i5-13500h16gbssd-512gbvga-rtx-4050-6gblcd-156inch-144hz-bh-22028-tgdd-sieu-luot",
    "brand": "Gigabyte",
    "categoryName": "Laptop Gigabyte",
    "categorySlug": "laptop-gigabyte",
    "price": 18900000,
    "originalPrice": 19900000,
    "discountPrice": 18900000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784087840572-660923856.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784087840572-660923856.webp",
      "https://zcomputer.vn/uploads/image-1784087843144-504290649.webp",
      "https://zcomputer.vn/uploads/image-1784087841489-288242461.webp",
      "https://zcomputer.vn/uploads/image-1784087842429-116080334.webp",
      "https://zcomputer.vn/uploads/image-1784087843887-136359397.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 94,
    "ratings": {
      "average": 5,
      "count": 18
    }
  },
  {
    "name": "LAPTOP ACER NITRO 5 TIGER AN515 58 773Y i7 12700H/16GB/512GB/RTX3050 4GB/144Hz/Win11",
    "slug": "laptop-acer-nitro-5-tiger-an515-58-773y-i7-12700h16gb512gbrtx3050-4gb144hzwin11",
    "brand": "Acer",
    "categoryName": "Laptop Acer",
    "categorySlug": "laptop-acer",
    "price": 16500000,
    "originalPrice": 17500000,
    "discountPrice": 16500000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1785587184927-417552052.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1785587184927-417552052.webp",
      "https://zcomputer.vn/uploads/image-1785587187983-875259548.webp",
      "https://zcomputer.vn/uploads/image-1785587189359-763781377.webp",
      "https://zcomputer.vn/uploads/image-1785587190852-662533300.webp",
      "https://zcomputer.vn/uploads/image-1785587186492-231421467.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 20,
    "ratings": {
      "average": 5,
      "count": 12
    }
  },
  {
    "name": "LAPTOP LENOVO LEGION Y7000 IRX9 I7 13650HX/24GB/SSD 512GB/VGA RTX 4060 8GB/LCD 15.6INCH FHD 144HZ/GRAY",
    "slug": "laptop-lenovo-legion-y7000-irx9-i7-13650hx24gbssd-512gbvga-rtx-4060-8gblcd-156inch-fhd-144hzgray",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 25900000,
    "originalPrice": 26900000,
    "discountPrice": 25900000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088753015-614890170.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088753015-614890170.webp",
      "https://zcomputer.vn/uploads/image-1784088756724-351856709.webp",
      "https://zcomputer.vn/uploads/image-1784088753761-56256607.webp",
      "https://zcomputer.vn/uploads/image-1784088754559-133182326.webp",
      "https://zcomputer.vn/uploads/image-1784088755194-657883062.webp",
      "https://zcomputer.vn/uploads/image-1784088756000-51827275.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 102,
    "ratings": {
      "average": 5,
      "count": 13
    }
  },
  {
    "name": "LAPTOP ASUS ROG ZEPHYRUS G14( 2023) GA402XV RYZEN 9 7940HS/ 16GB/ 512GB/VGA RTX 4060 8GB/ LCD 14INCH 2K5 165HZ",
    "slug": "laptop-asus-rog-zephyrus-g14-2023-ga402xv-ryzen-9-7940hs-16gb-512gbvga-rtx-4060-8gb-lcd-14inch-2k5-165hz",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 28500000,
    "originalPrice": 29500000,
    "discountPrice": 28500000,
    "discountPercent": 3,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1782184076396-1676272.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1782184076396-1676272.jpg",
      "https://zcomputer.vn/uploads/image-1782184076346-180685619.jpg",
      "https://zcomputer.vn/uploads/image-1782184076491-218983959.jpg",
      "https://zcomputer.vn/uploads/image-1782184076444-684532464.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 115,
    "ratings": {
      "average": 5,
      "count": 14
    }
  },
  {
    "name": "LAPTOP ACER PREDATOR HELIOS NEO 16 13500HX/16GB/SSD 512GB/VGA RTX 4060 8GB/LCD 16INCH WUXGA 165HZ",
    "slug": "laptop-acer-predator-helios-neo-16-13500hx16gbssd-512gbvga-rtx-4060-8gblcd-16inch-wuxga-165hz",
    "brand": "Acer",
    "categoryName": "Laptop Acer",
    "categorySlug": "laptop-acer",
    "price": 22900000,
    "originalPrice": 23900000,
    "discountPrice": 22900000,
    "discountPercent": 4,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1782184542451-671846203.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1782184542451-671846203.jpg",
      "https://zcomputer.vn/uploads/image-1782184542484-911497550.jpg",
      "https://zcomputer.vn/uploads/image-1782184542377-900836550.jpg",
      "https://zcomputer.vn/uploads/image-1782184542534-534808015.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 129,
    "ratings": {
      "average": 5,
      "count": 18
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD T14 GEN 3 RYZEN 5 PRO 6850U/32GB/SSD 512GB/LCD 14INCH WUXGA (1920 x 1200)",
    "slug": "laptop-lenovo-thinkpad-t14-gen-3-ryzen-5-pro-6850u32gbssd-512gblcd-14inch-wuxga-1920-x-1200",
    "brand": "Lenovo",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 14900000,
    "originalPrice": 15000000,
    "discountPrice": 14900000,
    "discountPercent": 1,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 22,
    "ratings": {
      "average": 5,
      "count": 18
    }
  },
  {
    "name": "NGUỒN 850W MSI MPG A850G PCIE5 80 PLUS GOLD NEW (FULL MODULAR)",
    "slug": "nguon-850w-msi-mpg-a850g-pcie5-80-plus-gold-new-full-modular",
    "brand": "MSI",
    "categoryName": "PSU - Nguồn máy tính",
    "categorySlug": "psu-nguon-may-tinh",
    "price": 2350000,
    "originalPrice": 2350000,
    "discountPrice": 2350000,
    "discountPercent": 0,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1782026869711-182679586.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1782026869711-182679586.webp",
      "https://zcomputer.vn/uploads/image-1782026869676-139589496.webp",
      "https://zcomputer.vn/uploads/image-1782026869734-621485659.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 48,
    "ratings": {
      "average": 5,
      "count": 16
    }
  },
  {
    "name": "Nguồn Jetek SWAT 700W Bronze 80 Plus V2022",
    "slug": "nguon-jetek-swat-700w-bronze-80-plus-v2022",
    "brand": "Jeteck",
    "categoryName": "PSU - Nguồn máy tính",
    "categorySlug": "psu-nguon-may-tinh",
    "price": 1300000,
    "originalPrice": 1300000,
    "discountPrice": 1300000,
    "discountPercent": 0,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1782024986645-258744571.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1782024986645-258744571.jpg",
      "https://zcomputer.vn/uploads/image-1782024986770-592070575.jpg",
      "https://zcomputer.vn/uploads/image-1782024986864-173055884.jpg",
      "https://zcomputer.vn/uploads/image-1782024986937-793220215.jpg",
      "https://zcomputer.vn/uploads/image-1782024987045-968206294.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 15,
    "ratings": {
      "average": 5,
      "count": 15
    }
  },
  {
    "name": "Nguồn máy tính Jetek RM850 V4 850W 80 Plus Gold",
    "slug": "nguon-may-tinh-jetek-rm850-v4-850w-80-plus-gold",
    "brand": "Jeteck",
    "categoryName": "PSU - Nguồn máy tính",
    "categorySlug": "psu-nguon-may-tinh",
    "price": 1800000,
    "originalPrice": 1800000,
    "discountPrice": 1800000,
    "discountPercent": 0,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1782024892651-136726384.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1782024892651-136726384.jpg",
      "https://zcomputer.vn/uploads/image-1782024892586-650069674.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 124,
    "ratings": {
      "average": 5,
      "count": 33
    }
  },
  {
    "name": "Nguồn máy tính Corsair RM750 80 Plus Gold - Full Modul (CP-9020234-NA)",
    "slug": "nguon-may-tinh-corsair-rm750-80-plus-gold-full-modul-cp-9020234-na",
    "brand": "Corsair",
    "categoryName": "PSU - Nguồn máy tính",
    "categorySlug": "psu-nguon-may-tinh",
    "price": 2200000,
    "originalPrice": 2200000,
    "discountPrice": 2200000,
    "discountPercent": 0,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1782024739746-548483783.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1782024739746-548483783.jpg",
      "https://zcomputer.vn/uploads/image-1782024739419-252409050.jpg",
      "https://zcomputer.vn/uploads/image-1782024739517-184660427.jpg",
      "https://zcomputer.vn/uploads/image-1782024739593-474036823.jpg",
      "https://zcomputer.vn/uploads/image-1782024739673-504541259.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 69,
    "ratings": {
      "average": 5,
      "count": 22
    }
  },
  {
    "name": "MACBOOK AIR 13INCH M1 2020 8CPU 7GPU 8GB/256GB ( GOLD PIN 86%)",
    "slug": "macbook-air-13inch-m1-2020-8cpu-7gpu-8gb256gb-gold-pin-86percent",
    "brand": "Apple",
    "categoryName": "Macbook",
    "categorySlug": "macbook",
    "price": 10500000,
    "originalPrice": 10500000,
    "discountPrice": 10500000,
    "discountPercent": 0,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1782023387244-364089599.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1782023387244-364089599.jpg",
      "https://zcomputer.vn/uploads/image-1782023387293-807456041.jpg",
      "https://zcomputer.vn/uploads/image-1782023387323-770738404.jpg",
      "https://zcomputer.vn/uploads/image-1782023387359-593556238.jpg",
      "https://zcomputer.vn/uploads/image-1782023387397-315213324.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 119,
    "ratings": {
      "average": 5,
      "count": 16
    }
  },
  {
    "name": "LAPTOP SURFACE 6 ULTRA 7 165H/RAM 16GB/SSD 512GB/LCD 13.5INH CẢM ỨNG 2K5 TOUCH",
    "slug": "laptop-surface-6-ultra-7-165hram-16gbssd-512gblcd-135inh-cam-ung-2k5-touch",
    "brand": "SURFACE",
    "categoryName": "Laptop Surface",
    "categorySlug": "laptop-surface",
    "price": 18500000,
    "originalPrice": 20000000,
    "discountPrice": 18500000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784092086395-473348620.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784092086395-473348620.webp",
      "https://zcomputer.vn/uploads/image-1784092083743-262325589.webp",
      "https://zcomputer.vn/uploads/image-1784092084526-100400007.webp",
      "https://zcomputer.vn/uploads/image-1784092085192-799182576.webp",
      "https://zcomputer.vn/uploads/image-1784092085821-781656790.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 126,
    "ratings": {
      "average": 5,
      "count": 20
    }
  },
  {
    "name": "LAPTOP SURFACE BOOK 2 I7 8650U/RAM 16GB/SSD 256GB/VGA 1060 6GB/LCD 13.5ICNH 4K (3840X2160)",
    "slug": "laptop-surface-book-2-i7-8650uram-16gbssd-256gbvga-1060-6gblcd-135icnh-4k-3840x2160",
    "brand": "SURFACES",
    "categoryName": "Laptop Surface",
    "categorySlug": "laptop-surface",
    "price": 7500000,
    "originalPrice": 8500000,
    "discountPrice": 7500000,
    "discountPercent": 12,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1782022277192-989447910.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1782022277192-989447910.jpg",
      "https://zcomputer.vn/uploads/image-1782022277270-186444870.jpg",
      "https://zcomputer.vn/uploads/image-1782022277337-936846762.jpg",
      "https://zcomputer.vn/uploads/image-1782022277386-862535371.jpg",
      "https://zcomputer.vn/uploads/image-1782022277456-54340869.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 46,
    "ratings": {
      "average": 5,
      "count": 20
    }
  },
  {
    "name": "LAPTOP LG GRAM 15Z90S-H.AAB6U1 ULTRA 7 155H/16GB/SSD 1TB/INTEL ARC/LCD 15.6INCH FHD TOUCH",
    "slug": "laptop-lg-gram-15z90s-haab6u1-ultra-7-155h16gbssd-1tbintel-arclcd-156inch-fhd-touch",
    "brand": "LG",
    "categoryName": "Laptop LG",
    "categorySlug": "laptop-lg",
    "price": 16500000,
    "originalPrice": 16500000,
    "discountPrice": 16500000,
    "discountPercent": 0,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1781950947725-202566797.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1781950947725-202566797.jpg",
      "https://zcomputer.vn/uploads/image-1781950947441-180747513.jpg",
      "https://zcomputer.vn/uploads/image-1781950947515-226129384.jpg",
      "https://zcomputer.vn/uploads/image-1781950947578-152454637.jpg",
      "https://zcomputer.vn/uploads/image-1781950947647-375911295.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 36,
    "ratings": {
      "average": 5,
      "count": 34
    }
  },
  {
    "name": "LAPTOP DELL XPS 15 7590 I7 9750H/16GB/SSD 512GB/VGA GTX 1650 4GB/LCD 15.6INCH 4K UHD (3840 x 2160)",
    "slug": "laptop-dell-xps-15-7590-i7-9750h16gbssd-512gbvga-gtx-1650-4gblcd-156inch-4k-uhd-3840-x-2160",
    "brand": "DELL",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 12900000,
    "originalPrice": 13900000,
    "discountPrice": 12900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784209932101-402193351.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784209932101-402193351.webp",
      "https://zcomputer.vn/uploads/image-1784209932876-812174569.webp",
      "https://zcomputer.vn/uploads/image-1784209931200-644921775.webp",
      "https://zcomputer.vn/uploads/image-1784209930379-353846526.webp",
      "https://zcomputer.vn/uploads/image-1784209928781-289070279.webp",
      "https://zcomputer.vn/uploads/image-1784209929523-186647601.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 21,
    "ratings": {
      "average": 5,
      "count": 12
    }
  },
  {
    "name": "LAPTOP DELL INSPIRON 15 3525 RYZEN 5 5625U/16GB/SSD 256GB/LCD 15.6INCH FHD 60HZ",
    "slug": "laptop-dell-inspiron-15-3525-ryzen-5-5625u16gbssd-256gblcd-156inch-fhd-60hz",
    "brand": "DELL",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 8900000,
    "originalPrice": 10000000,
    "discountPrice": 8900000,
    "discountPercent": 11,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784087674882-88529136.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784087674882-88529136.webp",
      "https://zcomputer.vn/uploads/image-1784087676071-268147869.webp",
      "https://zcomputer.vn/uploads/image-1784087677183-875634200.webp",
      "https://zcomputer.vn/uploads/image-1784087678471-715138654.webp",
      "https://zcomputer.vn/uploads/image-1784087679639-212448996.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 56,
    "ratings": {
      "average": 5,
      "count": 20
    }
  },
  {
    "name": "LAPTOP DELL PRECISION 7680 I7 13850HX/16GB/SSD 1TB/VGA RTX A2000 Ada 8GB/LCD 16INCH WUXGA (1920 x 1200) – BH 02/2027",
    "slug": "laptop-dell-precision-7680-i7-13850hx16gbssd-1tbvga-rtx-a2000-ada-8gblcd-16inch-wuxga-1920-x-1200-bh-022027",
    "brand": "DELL",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 29500000,
    "originalPrice": 33000000,
    "discountPrice": 29500000,
    "discountPercent": 11,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1781950494999-598813992.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1781950494999-598813992.jpg",
      "https://zcomputer.vn/uploads/image-1781950494949-258504424.jpg",
      "https://zcomputer.vn/uploads/image-1781950495117-367080394.jpg",
      "https://zcomputer.vn/uploads/image-1781950495170-162143341.jpg",
      "https://zcomputer.vn/uploads/image-1781950495227-848192773.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 124,
    "ratings": {
      "average": 5,
      "count": 11
    }
  },
  {
    "name": "LAPTOP LENOVO THINKPAD E15 GEN 4 I7 1255U/16GB/SSD 512GB/LCD 15.6INCH HD",
    "slug": "laptop-lenovo-thinkpad-e15-gen-4-i7-1255u16gbssd-512gblcd-156inch-hd",
    "brand": "LENOVO",
    "categoryName": "Laptop Lenovo",
    "categorySlug": "laptop-lenovo",
    "price": 10900000,
    "originalPrice": 12900000,
    "discountPrice": 10900000,
    "discountPercent": 16,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1781949636552-882323379.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1781949636552-882323379.jpg",
      "https://zcomputer.vn/uploads/image-1781949636660-42065519.jpg",
      "https://zcomputer.vn/uploads/image-1781949636601-808463631.jpg",
      "https://zcomputer.vn/uploads/image-1781949636494-329568333.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 28,
    "ratings": {
      "average": 5,
      "count": 24
    }
  },
  {
    "name": "LAPTOP DELL INSPIRON 14 5430 I7 1360P/16GB/SSD 256GB/LCD 14INCH WUXGA (1920 x 1200) ",
    "slug": "laptop-dell-inspiron-14-5430-i7-1360p16gbssd-256gblcd-14inch-wuxga-1920-x-1200",
    "brand": "Dell",
    "categoryName": "Laptop Dell",
    "categorySlug": "laptop-dell",
    "price": 12900000,
    "originalPrice": 13900000,
    "discountPrice": 12900000,
    "discountPercent": 7,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1781949527523-467041347.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1781949527523-467041347.jpg",
      "https://zcomputer.vn/uploads/image-1781949527579-600234022.jpg",
      "https://zcomputer.vn/uploads/image-1781949527643-252128206.jpg",
      "https://zcomputer.vn/uploads/image-1781949527467-19935115.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 32,
    "ratings": {
      "average": 5,
      "count": 14
    }
  },
  {
    "name": "LAPTOP HP OMMIBOOK X FLIP 14 2 IN 1 RYZEN AI 7 350/24GB/SSD 1TB/ AMD RADEON 840M/LCD 14INCH WUXGA (1920 x 1200)",
    "slug": "laptop-hp-ommibook-x-flip-14-2-in-1-ryzen-ai-7-35024gbssd-1tb-amd-radeon-840mlcd-14inch-wuxga-1920-x-1200",
    "brand": "HP",
    "categoryName": "Laptop HP",
    "categorySlug": "laptop-hp",
    "price": 20500000,
    "originalPrice": 20500000,
    "discountPrice": 20500000,
    "discountPercent": 0,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1781949395566-521395753.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1781949395566-521395753.jpg",
      "https://zcomputer.vn/uploads/image-1781949395797-709082580.jpg",
      "https://zcomputer.vn/uploads/image-1781949395738-426327638.jpg",
      "https://zcomputer.vn/uploads/image-1781949395672-84330979.jpg",
      "https://zcomputer.vn/uploads/image-1781949395624-86195664.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 95,
    "ratings": {
      "average": 5,
      "count": 8
    }
  },
  {
    "name": "LAPTOP SURFACE 4 i7 1185G7/RAM 16GB/SSD 512GB/LCD 13.5IN CẢM ỨNG 2K5 (Blue)",
    "slug": "laptop-surface-4-i7-1185g7ram-16gbssd-512gblcd-135in-cam-ung-2k5-blue",
    "brand": "SURFACE",
    "categoryName": "Laptop Surface",
    "categorySlug": "laptop-surface",
    "price": 10500000,
    "originalPrice": 12000000,
    "discountPrice": 10500000,
    "discountPercent": 13,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1781949071461-771518055.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1781949071461-771518055.jpg",
      "https://zcomputer.vn/uploads/image-1781949071570-454003066.jpg",
      "https://zcomputer.vn/uploads/image-1781949071652-990014231.jpg",
      "https://zcomputer.vn/uploads/image-1781949071735-468080162.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 128,
    "ratings": {
      "average": 5,
      "count": 23
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M-E/ I5 13500/ RAM 16GB 3200/ SSD 512GB/ VGA 1660TI 6GB/ NGUỒN 650W/ CASE BỂ CÁ/ TẢN KHÍ – BH T3/2027",
    "slug": "bo-may-tinh-b760m-e-i5-13500-ram-16gb-3200-ssd-512gb-vga-1660ti-6gb-nguon-650w-case-be-ca-tan-khi-bh-t32027",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 15900000,
    "originalPrice": 15900000,
    "discountPrice": 15900000,
    "discountPercent": 0,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1781947340484-101526519.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1781947340484-101526519.jpg",
      "https://zcomputer.vn/uploads/image-1781947340556-635082742.jpg",
      "https://zcomputer.vn/uploads/image-1781947340612-803312119.jpg",
      "https://zcomputer.vn/uploads/image-1781947340680-170780214.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 57,
    "ratings": {
      "average": 5,
      "count": 25
    }
  },
  {
    "name": "BỘ MÁY TÍNH B650M/RYZEN 5 7600X/RAM 16GB/SSD 512GB/VGA RTX 3050 6G/750W/AIO 240/CASE BỂ CÁ KÈM 3 FAN LED – BH 07/2027",
    "slug": "bo-may-tinh-b650mryzen-5-7600xram-16gbssd-512gbvga-rtx-3050-6g750waio-240case-be-ca-kem-3-fan-led-bh-072027",
    "brand": "ASUS",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 16500000,
    "originalPrice": 18000000,
    "discountPrice": 16500000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1781947154165-380755295.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1781947154165-380755295.jpg",
      "https://zcomputer.vn/uploads/image-1781947154314-344146742.jpg",
      "https://zcomputer.vn/uploads/image-1781947154435-614233928.jpg",
      "https://zcomputer.vn/uploads/image-1781947154516-490565148.jpg",
      "https://zcomputer.vn/uploads/image-1781947154629-223806721.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 74,
    "ratings": {
      "average": 5,
      "count": 28
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M TUF PLUS WIFI D4/ I5 14600KF/ RAM 16GB/ SSD 1TB KIOXIA/ VGA RTX 3060 12GB/ NGUỒN CLMT 850W/ CASE+ TẢN THÁP ĐỔI – BH 2/2029",
    "slug": "bo-may-tinh-b760m-tuf-plus-wifi-d4-i5-14600kf-ram-16gb-ssd-1tb-kioxia-vga-rtx-3060-12gb-nguon-clmt-850w-case-tan-thap-doi-bh-22029",
    "brand": "TUF",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 25000000,
    "originalPrice": 25000000,
    "discountPrice": 25000000,
    "discountPercent": 0,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1781946769396-145890108.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1781946769396-145890108.jpg",
      "https://zcomputer.vn/uploads/image-1781946768692-458256671.jpg",
      "https://zcomputer.vn/uploads/image-1781946768786-402083066.jpg",
      "https://zcomputer.vn/uploads/image-1781946769308-679865568.jpg",
      "https://zcomputer.vn/uploads/image-1781946768608-163467686.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 55,
    "ratings": {
      "average": 5,
      "count": 17
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M TUF PLUS WIFI D4/ I5 14600KF/ RAM 16GB/ SSD 1TB/ VGA RTX 5070 12GB/ NGUỒN CLMT 850W/ CASE+ TẢN THÁP ĐÔI – BH 3/2029",
    "slug": "bo-may-tinh-b760m-tuf-plus-wifi-d4-i5-14600kf-ram-16gb-ssd-1tb-vga-rtx-5070-12gb-nguon-clmt-850w-case-tan-thap-doi-bh-32029",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 32000000,
    "originalPrice": 35000000,
    "discountPrice": 32000000,
    "discountPercent": 9,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1781946650701-812481442.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1781946650701-812481442.jpg",
      "https://zcomputer.vn/uploads/image-1781946650398-709844409.jpg",
      "https://zcomputer.vn/uploads/image-1781946650476-187402860.jpg",
      "https://zcomputer.vn/uploads/image-1781946650554-185262764.jpg",
      "https://zcomputer.vn/uploads/image-1781946650628-702841842.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 95,
    "ratings": {
      "average": 5,
      "count": 28
    }
  },
  {
    "name": "BỘ MÁY TÍNH B760M/I5 12400F/RAM 16GB/SSD 256GB/VGA RTX 2060 SUPER 8GB/550W/TẢN KHÍ/CASE BỂ CÁ KÈM 3 FAN LED WHITE",
    "slug": "bo-may-tinh-b760mi5-12400fram-16gbssd-256gbvga-rtx-2060-super-8gb550wtan-khicase-be-ca-kem-3-fan-led-white",
    "brand": "Custom",
    "categoryName": "PC Cũ",
    "categorySlug": "pc-cu",
    "price": 12900000,
    "originalPrice": 140000000,
    "discountPrice": 12900000,
    "discountPercent": 91,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1781946019503-423417348.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1781946019503-423417348.jpg",
      "https://zcomputer.vn/uploads/image-1781946019557-445324129.jpg",
      "https://zcomputer.vn/uploads/image-1781946019448-575720733.jpg",
      "https://zcomputer.vn/uploads/image-1781946019321-750826398.jpg",
      "https://zcomputer.vn/uploads/image-1781946019384-850340418.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 129,
    "ratings": {
      "average": 5,
      "count": 27
    }
  },
  {
    "name": "LAPTOP ASUS ROGSTRIX G713QY RYZEN 9 5900HX/16GB/SSD 512GB/ VGA AMD RX 6800M 12GB/LCD 17.3 QHD 165HZ",
    "slug": "laptop-asus-rogstrix-g713qy-ryzen-9-5900hx16gbssd-512gb-vga-amd-rx-6800m-12gblcd-173-qhd-165hz",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 20900000,
    "originalPrice": 22000000,
    "discountPrice": 20900000,
    "discountPercent": 5,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1781945347664-189279008.jpg",
    "images": [
      "https://zcomputer.vn/uploads/image-1781945347664-189279008.jpg",
      "https://zcomputer.vn/uploads/image-1781945347569-139504125.jpg",
      "https://zcomputer.vn/uploads/image-1781945347414-244708901.jpg",
      "https://zcomputer.vn/uploads/image-1781945347479-461196413.jpg"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 131,
    "ratings": {
      "average": 5,
      "count": 20
    }
  },
  {
    "name": "LAPTOP ASUS ROG ZEPHYRUS M15 (GU502LV-BI7N8) Core I7 10750H/16GB/512GB/VGA RTX 2060/LCD 15.6INCH 4K UHD",
    "slug": "laptop-asus-rog-zephyrus-m15-gu502lv-bi7n8-core-i7-10750h16gb512gbvga-rtx-2060lcd-156inch-4k-uhd",
    "brand": "ASUS",
    "categoryName": "Laptop Asus",
    "categorySlug": "laptop-asus",
    "price": 14900000,
    "originalPrice": 15900000,
    "discountPrice": 14900000,
    "discountPercent": 6,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784360785679-882702423.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784360785679-882702423.webp",
      "https://zcomputer.vn/uploads/image-1784360790419-157068871.webp",
      "https://zcomputer.vn/uploads/image-1784360787573-319557343.webp",
      "https://zcomputer.vn/uploads/image-1784360791575-574350022.webp",
      "https://zcomputer.vn/uploads/image-1784360788875-317976182.webp",
      "https://zcomputer.vn/uploads/image-1784360792993-987772182.webp"
    ],
    "warranty": "Bảo hành 3 - 12 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 60,
    "ratings": {
      "average": 5,
      "count": 29
    }
  },
  {
    "name": "Mainboard ASUS TUF GAMING B760M-PLUS WIFI D4 | LGA 1700, mATX, 4 khe RAM DDR4",
    "slug": "mainboard-asus-tuf-gaming-b760m-plus-wifi-d4",
    "brand": "ASUS",
    "categoryName": "Mainboard - Bo mạch chủ",
    "categorySlug": "mainboard-bo-mach-chu",
    "price": 3850000,
    "originalPrice": 4200000,
    "discountPrice": 3850000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784172142364-148174215.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784172142364-148174215.webp"
    ],
    "warranty": "Bảo hành 36 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 101,
    "ratings": {
      "average": 5,
      "count": 23
    }
  },
  {
    "name": "Mainboard MSI MAG B760M MORTAR WIFI DDR5 | LGA 1700, mATX, 4 khe RAM DDR5",
    "slug": "mainboard-msi-mag-b760m-mortar-wifi-ddr5",
    "brand": "MSI",
    "categoryName": "Mainboard - Bo mạch chủ",
    "categorySlug": "mainboard-bo-mach-chu",
    "price": 4150000,
    "originalPrice": 4500000,
    "discountPrice": 4150000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784172142364-148174215.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784172142364-148174215.webp"
    ],
    "warranty": "Bảo hành 36 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 108,
    "ratings": {
      "average": 5,
      "count": 13
    }
  },
  {
    "name": "Mainboard ASUS ROG STRIX Z790-A GAMING WIFI D4 | LGA 1700, ATX, 4 khe RAM",
    "slug": "mainboard-asus-rog-strix-z790-a-gaming-wifi-d4",
    "brand": "ASUS",
    "categoryName": "Mainboard - Bo mạch chủ",
    "categorySlug": "mainboard-bo-mach-chu",
    "price": 8200000,
    "originalPrice": 8900000,
    "discountPrice": 8200000,
    "discountPercent": 8,
    "stock": 20,
    "thumbnail": "https://zcomputer.vn/uploads/image-1784172143688-130979808.webp",
    "images": [
      "https://zcomputer.vn/uploads/image-1784172143688-130979808.webp"
    ],
    "warranty": "Bảo hành 36 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 70,
    "ratings": {
      "average": 5,
      "count": 33
    }
  },
  {
    "name": "Màn hình Gaming Asus TUF VG279Q1A | 27 inch, FHD, 165Hz, IPS, 1ms",
    "slug": "man-hinh-gaming-asus-tuf-vg279q1a-27-inch",
    "brand": "ASUS",
    "categoryName": "Màn hình máy tính",
    "categorySlug": "man-hinh",
    "price": 4290000,
    "originalPrice": 4890000,
    "discountPrice": 4290000,
    "discountPercent": 12,
    "stock": 20,
    "thumbnail": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80"
    ],
    "warranty": "Bảo hành 36 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 80,
    "ratings": {
      "average": 5,
      "count": 21
    }
  },
  {
    "name": "Màn hình Gaming Samsung Odyssey G5 G50D | 27 inch, 2K QHD, 180Hz, Fast IPS 1ms",
    "slug": "man-hinh-samsung-odyssey-g5-27-inch-2k",
    "brand": "SAMSUNG",
    "categoryName": "Màn hình máy tính",
    "categorySlug": "man-hinh",
    "price": 5690000,
    "originalPrice": 6490000,
    "discountPrice": 5690000,
    "discountPercent": 12,
    "stock": 20,
    "thumbnail": "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80"
    ],
    "warranty": "Bảo hành 24 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 90,
    "ratings": {
      "average": 5,
      "count": 29
    }
  },
  {
    "name": "Màn hình Gaming LG UltraGear 32GN600-B | 32 inch, 2K QHD, 165Hz, HDR10",
    "slug": "man-hinh-gaming-lg-ultragear-32gn600-b-32-inch",
    "brand": "LG",
    "categoryName": "Màn hình máy tính",
    "categorySlug": "man-hinh",
    "price": 5990000,
    "originalPrice": 6890000,
    "discountPrice": 5990000,
    "discountPercent": 13,
    "stock": 20,
    "thumbnail": "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=800&auto=format&fit=crop&q=80"
    ],
    "warranty": "Bảo hành 24 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": true,
    "views": 93,
    "ratings": {
      "average": 5,
      "count": 15
    }
  },
  {
    "name": "Màn hình Cong Asus ROG Strix XG32VC | 32 inch, 2K WQHD, 170Hz, 1ms, DisplayHDR 400",
    "slug": "man-hinh-asus-rog-strix-xg32vc-32-inch",
    "brand": "ASUS",
    "categoryName": "Màn hình máy tính",
    "categorySlug": "man-hinh",
    "price": 9990000,
    "originalPrice": 11500000,
    "discountPrice": 9990000,
    "discountPercent": 13,
    "stock": 20,
    "thumbnail": "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=800&auto=format&fit=crop&q=80"
    ],
    "warranty": "Bảo hành 36 Tháng",
    "status": "in_stock",
    "isHot": false,
    "isFlashSale": false,
    "views": 51,
    "ratings": {
      "average": 5,
      "count": 16
    }
  }
];

export const JOBS_DATA = [
  {
    title: "Kỹ Thuật Viên Lắp Ráp & Cài Đặt PC Gaming",
    slug: "ky-thuat-vien-lap-rap-cai-dat-pc-gaming",
    department: "Kỹ thuật",
    location: "Thủ Đức / Bình Thạnh, TP.HCM",
    salary: "8.000.000đ - 14.000.000đ + Thưởng",
    type: "Toàn thời gian",
    experience: "Dưới 1 năm / Được đào tạo",
    quantity: 3,
    description: "- Lắp ráp, đi dây (cable management) thẩm mỹ cho các dàn máy PC Gaming, Workstation.\n- Cài đặt hệ điều hành Windows, phần mềm, driver và tối ưu hóa hệ thống cho khách hàng.\n- Kiểm tra, test linh kiện (Main, CPU, RAM, VGA, Nguồn) và hỗ trợ xử lý bảo hành.",
    requirements: [
      "Đam mê phần cứng máy tính và linh kiện PC.",
      "Cẩn thận, tỉ mỉ, có trách nhiệm trong công việc.",
      "Ưu tiên ứng viên có kinh nghiệm lắp ráp PC, đi dây thẩm mỹ hoặc am hiểu BIOS/Windows.",
      "Chưa có nhiều kinh nghiệm sẽ được kỹ thuật viên trưởng kèm cặp đào tạo trực tiếp.",
    ],
    benefits: [
      "Lương cứng cạnh tranh + thưởng theo số lượng máy lắp + KPIs.",
      "Được tiếp xúc và trải nghiệm trực tiếp các linh kiện công nghệ cao cấp nhất (RTX 4090, i9 14900K,...).",
      "Thưởng lễ, Tết, lương tháng 13, xét duyệt tăng lương định kỳ 6 tháng/lần.",
      "Môi trường làm việc trẻ trung, hòa đồng, năng động.",
    ],
    isActive: true,
    order: 1,
  },
  {
    title: "Nhân Viên Tư Vấn Bán Hàng PC & Laptop (Showroom / Online)",
    slug: "nhan-vien-tu-van-ban-hang-pc-laptop",
    department: "Kinh doanh",
    location: "Chi nhánh Thủ Đức / Bình Thạnh",
    salary: "9.000.000đ - 18.000.000đ (Lương + Hoa hồng)",
    type: "Toàn thời gian",
    experience: "Không yêu cầu / Đam mê công nghệ",
    quantity: 2,
    description: "- Đón tiếp, lắng nghe nhu cầu và tư vấn cấu hình PC/Laptop phù hợp với ngân sách của khách hàng tại Showroom.\n- Trả lời tin nhắn tư vấn và chốt đơn trên Fanpage/Zalo/Website.\n- Chăm sóc khách hàng sau bán hàng và phối hợp bộ phận kỹ thuật bàn giao máy.",
    requirements: [
      "Giao tiếp tốt, nhanh nhẹn, thái độ nhiệt tình, thân thiện.",
      "Có hiểu biết cơ bản về cấu hình PC, Laptop Gaming, đồ họa văn phòng.",
      "Chăm chỉ, trung thực, có tinh thần cầu tiến.",
    ],
    benefits: [
      "Thu nhập hấp dẫn không giới hạn: Lương cứng + % Hoa hồng doanh số cao + Thưởng nóng.",
      "Được đào tạo kỹ năng bán hàng, kiến thức phần cứng chuyên sâu.",
      "Môi trường thân thiện, hỗ trợ nhau cùng phát triển.",
    ],
    isActive: true,
    order: 2,
  },
  {
    title: "Content Creator / Reviewer Công Nghệ & Media",
    slug: "content-creator-reviewer-cong-nghe",
    department: "Marketing",
    location: "TP. Thủ Đức, TP.HCM",
    salary: "10.000.000đ - 20.000.000đ",
    type: "Toàn thời gian",
    experience: "Từ 1 năm",
    quantity: 1,
    description: "- Lên ý tưởng kịch bản, quay dựng video ngắn (TikTok, YouTube Shorts, Reels) review PC Gaming, Laptop, góc setup công nghệ.\n- Viết bài viết đánh giá công nghệ, thủ thuật build PC trên Website và Fanpage.",
    requirements: [
      "Tự tin trước ống kính, giọng nói lưu loát, truyền cảm.",
      "Biết sử dụng cơ bản các phần mềm dựng video (CapCut, Premiere Pro,...).",
      "Bắt trend nhanh, đam mê thế giới công nghệ máy tính.",
    ],
    benefits: [
      "Lương cứng + Thưởng hiệu quả video (View/Engagement).",
      "Trực tiếp unbox và review các siêu phẩm PC, linh kiện mới nhất.",
      "Thoải mái sáng tạo ý tưởng không gò bó.",
    ],
    isActive: true,
    order: 3,
  },
];

export const performSeed = async (customProducts = PRODUCTS_DATA) => {
  try {
    console.log("[Seed] Bắt đầu làm sạch dữ liệu cũ trong MongoDB...");
    await Product.deleteMany({});
    await Category.deleteMany({});
    await News.deleteMany({});
    await Job.deleteMany({});
    console.log("[Seed] Đã dọn dẹp Category, News, Job và Product.");

    const createdCategories = await Category.insertMany(CATEGORIES_DATA);
    console.log(`[Seed] Đã tạo thành công ${createdCategories.length} danh mục.`);

    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name.toLowerCase().trim()] = cat._id;
      categoryMap[cat.slug.toLowerCase().trim()] = cat._id;
    });

    const defaultCategoryId = createdCategories[0]._id;

    const createdNews = await News.insertMany(NEWS_DATA);
    console.log(`[Seed] Đã tạo thành công ${createdNews.length} bài viết tin tức.`);

    const productsSource = Array.isArray(customProducts) && customProducts.length > 0 ? customProducts : PRODUCTS_DATA;
    console.log(`[Seed] Đang nạp ${productsSource.length} sản phẩm thực tế vào MongoDB...`);

    const productsToInsert = productsSource.map((p, index) => {
      const catName = p.categoryName || "Laptop Cũ";
      const catSlug = p.categorySlug || "laptop-cu";

      const matchedCatId =
        categoryMap[catName.toLowerCase().trim()] ||
        categoryMap[catSlug.toLowerCase().trim()] ||
        defaultCategoryId;

      const price = Number(p.price) || 0;
      const originalPrice = Number(p.originalPrice) || price;
      const discountPercent =
        Number(p.discountPercent) ||
        (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

      const images = Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.thumbnail || "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp"];
      const thumbnail = p.thumbnail || images[0] || "https://zcomputer.vn/uploads/image-1784088696463-533147643.webp";

      const name = p.name || `Sản phẩm ${index + 1}`;
      const isM1 = name.match(/\b(Apple\s*)?M[1234]\b/i) && !name.match(/\bM1[4-9]\b/i) && !name.match(/Zephyrus/i);
      const isMonitor = catName.toLowerCase().includes("màn hình") || name.toLowerCase().startsWith("màn hình");
      const isPSU = catName.toLowerCase().includes("psu") || catName.toLowerCase().includes("nguồn") || name.toLowerCase().startsWith("nguồn");
      const isMainboard = catName.toLowerCase().includes("mainboard") || name.toLowerCase().startsWith("mainboard");
      const isLaptop = catName.toLowerCase().includes("laptop") || catName.toLowerCase().includes("macbook") || name.toLowerCase().includes("laptop");

      let autoSpecs = Array.isArray(p.specifications) && p.specifications.length > 0 ? p.specifications : [];
      let autoDesc = p.description || "";

      if (autoSpecs.length === 0) {
        if (isMonitor) {
          const size = name.match(/\b(\d+(\.\d+)?\s*(inch|['"]))\b/i)?.[1]?.replace(/['"]/g, " inch") || "27 inch";
          const res = name.match(/\b(4K\s*UHD|2K\s*WQHD|2K\s*QHD|2K|WQHD|QHD|FHD|1080p)\b/i)?.[0]?.toUpperCase() || "Full HD (1920 x 1080)";
          const hz = name.match(/\b(\d{2,3}\s*Hz)\b/i)?.[0] || "165Hz";
          const panel = name.match(/\b(Fast\s*IPS|OLED|IPS|VA|TN)\b/i)?.[0] || "Fast IPS";
          autoSpecs = [
            { name: "Kích thước màn hình", value: size },
            { name: "Độ phân giải", value: res },
            { name: "Tần số quét", value: hz },
            { name: "Tấm nền", value: `${panel} 1ms` },
          ];
        } else if (isPSU) {
          const watt = name.match(/\b(\d{3,4}\s*W)\b/i)?.[1] || "750W";
          const eff = name.match(/\b(80\s*Plus\s*(Gold|Bronze|Platinum)|80\s*Plus)\b/i)?.[0] || "80 Plus Gold";
          autoSpecs = [
            { name: "Công suất", value: `${watt} Công suất thực` },
            { name: "Chứng nhận", value: eff },
            { name: "Thiết kế dây", value: name.includes("Modular") ? "Full Modular" : "Dây cáp bọc lưới" },
          ];
        } else if (isMainboard) {
          const chip = name.match(/\b(Z790|B760M?|B650M?|H610M?)\b/i)?.[0]?.toUpperCase() || "Intel B760";
          autoSpecs = [
            { name: "Chipset", value: chip },
            { name: "Socket", value: chip.includes("650") ? "AM5" : "LGA 1700" },
            { name: "Hỗ trợ RAM", value: name.includes("DDR5") ? "4 khe DDR5" : "4 khe DDR4" },
          ];
        } else if (isLaptop) {
          const cpu = isM1 ? "Apple M1 Chip" : (name.match(/Ryzen\s*[3579]\s*\w+/i)?.[0] || name.match(/Core\s*i[3579]\s*\w+/i)?.[0] || name.match(/\bi[3579][-\s]\d+\w*/i)?.[0] || "Intel Core");
          const ram = name.match(/\b(\d+GB)\s*(RAM|DDR[45])?\b/i)?.[1]?.toUpperCase() || "16GB";
          const ssd = name.match(/(SSD\s*\d+(GB|TB)|\d+(GB|TB)\s*SSD)/i)?.[0]?.toUpperCase() || (name.includes("256GB") ? "SSD 256GB" : "SSD 512GB");
          autoSpecs = [
            { name: "CPU", value: cpu },
            { name: "RAM", value: ram },
            { name: "Ổ cứng", value: ssd },
          ];
        } else {
          const cpu = name.match(/\b(i[3579][-\s]\d+\w*|Ryzen\s*[3579]\s*\w+)\b/i)?.[0] || "Intel Core i5";
          const ram = name.match(/\b(\d+GB)\s*(RAM|DDR[45])?\b/i)?.[1]?.toUpperCase() || "16GB";
          const ssd = name.match(/(SSD\s*\d+(GB|TB)|\d+(GB|TB)\s*SSD)/i)?.[0]?.toUpperCase() || "SSD 512GB";
          autoSpecs = [
            { name: "CPU", value: cpu },
            { name: "RAM", value: ram },
            { name: "Ổ cứng", value: ssd },
          ];
        }
      }

      // Tự động tạo shortName gọn gàng
      let shortName = name;
      if (shortName.includes("/")) {
        const parts = shortName.split("/");
        if (parts[0].length >= 15) shortName = parts[0].trim();
      }
      shortName = shortName
        .replace(/^BỘ MÁY TÍNH\s+/i, "PC Gaming ")
        .replace(/^LAPTOP\s+/i, "Laptop ")
        .replace(/^NGUỒN\s+/i, "Nguồn ")
        .replace(/^Màn hình Gaming\s+/i, "Màn hình ")
        .replace(/^Mainboard\s+/i, "Mainboard ")
        .trim();

      const cPrefix = catSlug.includes("laptop") ? "LT" : catSlug.includes("pc") ? "PC" : catSlug.includes("man-hinh") ? "MN" : catSlug.includes("psu") ? "PS" : catSlug.includes("mainboard") ? "MB" : "GK";
      const bPrefix = (p.brand || "ZC").replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase();
      const sku = `ZC-${cPrefix}-${bPrefix}-${String(index + 1).padStart(4, "0")}`;

      const structuredSpecs = {
        cpu: isLaptop || !isMonitor && !isPSU && !isMainboard ? (name.match(/\b(i[3579][-\s]\d+\w*|Ryzen\s*[3579]\s*\w+|Apple\s*M[1234])\b/i)?.[0] || "Intel Core") : "",
        ram: isLaptop || !isMonitor && !isPSU && !isMainboard ? (name.match(/\b(\d+GB)\s*(RAM|DDR[45])?\b/i)?.[1]?.toUpperCase() || "16GB") : "",
        storage: isLaptop || !isMonitor && !isPSU && !isMainboard ? (name.match(/(SSD\s*\d+(GB|TB)|\d+(GB|TB)\s*SSD)/i)?.[0]?.toUpperCase() || "SSD 512GB") : "",
        gpu: isLaptop || !isMonitor && !isPSU && !isMainboard ? (name.match(/(RTX\s*\d{4}(\s*Ti|\s*Super)?|GTX\s*\d{4}|RX\s*\d{4})/i)?.[0] || "Card đồ họa rời") : "",
        size: isMonitor ? (name.match(/\b(\d+(\.\d+)?\s*(inch|['"]))\b/i)?.[1]?.replace(/['"]/g, " inch") || "27 inch") : "",
        resolution: isMonitor ? (name.match(/\b(4K\s*UHD|2K\s*WQHD|2K\s*QHD|2K|WQHD|QHD|FHD|1080p)\b/i)?.[0]?.toUpperCase() || "Full HD") : "",
        refreshRate: isMonitor ? (name.match(/\b(\d{2,3}\s*Hz)\b/i)?.[0] || "165Hz") : "",
        panel: isMonitor ? (name.match(/\b(Fast\s*IPS|OLED|IPS|VA|TN)\b/i)?.[0] || "Fast IPS") : "",
        wattage: isPSU ? (name.match(/\b(\d{3,4}\s*W)\b/i)?.[1] || "750W") : "",
        efficiency: isPSU ? (name.match(/\b(80\s*Plus\s*(Gold|Bronze|Platinum)|80\s*Plus)\b/i)?.[0] || "80 Plus Gold") : "",
        chipset: isMainboard ? (name.match(/\b(Z790|B760M?|B650M?|H610M?)\b/i)?.[0]?.toUpperCase() || "Intel B760") : "",
        socket: isMainboard ? (name.match(/\b(LGA\s*1700|AM5|LGA\s*1200|AM4)\b/i)?.[0] || "LGA 1700") : "",
      };

      return {
        name,
        shortName,
        sku,
        slug: p.slug || `san-pham-${index + 1}`,
        brand: p.brand || "ZCOMPUTER",
        category: matchedCatId,
        categoryName: catName,
        categorySlug: catSlug,
        price,
        originalPrice,
        discountPrice: price,
        discountPercent,
        stock: typeof p.stock === "number" ? p.stock : 25,
        images,
        thumbnail,
        description: autoDesc,
        shortDescription: structuredSpecs.cpu ? `${structuredSpecs.cpu} | RAM ${structuredSpecs.ram} | ${structuredSpecs.storage}` : `${catName} chính hãng`,
        specs: structuredSpecs,
        specifications: autoSpecs,
        warranty: p.warranty || "Bảo hành 3 - 12 Tháng",
        status: p.status || "in_stock",
        condition: p.condition || (
          (p.name && /like new|cũ|99%|lướt|second hand/i.test(p.name)) ||
          (p.description && /like new|cũ|99%/i.test(p.description)) ||
          (catName && /cũ|like new/i.test(catName)) ||
          (index % 3 === 1)
            ? "Cũ (Like New)"
            : "Mới 100%"
        ),
        isHot: typeof p.isHot === "boolean" ? p.isHot : index < 20,
        isFlashSale: typeof p.isFlashSale === "boolean" ? p.isFlashSale : index % 3 === 0,
        views: typeof p.views === "number" ? p.views : Math.floor(Math.random() * 200) + 50,
        ratings: {
          average: p.ratings?.average || 5,
          count: p.ratings?.count || Math.floor(Math.random() * 30) + 10,
        },
        tags: [catSlug, (p.brand || "").toLowerCase()].filter(Boolean),
      };
    });

    await Job.deleteMany({});
    const createdJobs = await Job.insertMany(JOBS_DATA);
    console.log(`[Seed] Đã nạp thành công ${createdJobs.length} vị trí tuyển dụng vào MongoDB.`);

    const insertedProducts = await Product.insertMany(productsToInsert);
    console.log(`🎉 [Seed Thành Công] Đã nạp thành công ${insertedProducts.length} sản phẩm vào MongoDB!`);

    // Tạo / Cập nhật tài khoản Admin mặc định
    let adminUser = await User.findOne({ email: "admin@dudisoftware.com" });
    if (!adminUser) {
      await User.create({
        name: "Admin DUDI Software",
        email: "admin@dudisoftware.com",
        password: "123456",
        phone: "0909163821",
        role: "admin",
        status: "active",
      });
    } else {
      adminUser.role = "admin";
      adminUser.status = "active";
      adminUser.password = "123456";
      await adminUser.save();
    }

    return {
      categories: createdCategories.length,
      news: createdNews.length,
      jobs: createdJobs.length,
      products: insertedProducts.length,
    };
  } catch (error) {
    console.error("❌ [Seed Lỗi]:", error);
    throw error;
  }
};

export const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/zcomputer_clone";
  try {
    console.log(`[Seed] Đang kết nối tới MongoDB: ${uri}...`);
    await mongoose.connect(uri);
    console.log("[Seed] Kết nối MongoDB thành công.");

    await performSeed(PRODUCTS_DATA);

    await mongoose.disconnect();
    console.log("✅ [Seed] Toàn bộ dữ liệu hệ thống đã được nạp thành công vào MongoDB!");
    process.exit(0);
  } catch (error) {
    console.error("❌ [Seed Database Lỗi]:", error);
    process.exit(1);
  }
};

if (process.argv[1] && process.argv[1].endsWith("seed.js")) {
  seedDatabase();
}
