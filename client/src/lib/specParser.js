/**
 * Helper to intelligently parse and extract specifications from any product
 * Handles PC sets, Laptops, Monitors, and standalone components.
 */
export const parseProductSpecs = (product) => {
  if (!product) return {};

  const name = String(product.name || product.title || "");
  const cat = String(product.categoryName || product.category || "").toLowerCase();

  // 1. Check if product already has explicit specifications array
  const explicitSpecs = {};
  if (Array.isArray(product.specifications)) {
    product.specifications.forEach((s) => {
      const k = String(s.name || s.label || "").trim().toLowerCase();
      const v = s.value || s.detail || "";
      if (k && v) explicitSpecs[k] = v;
    });
  }

  // 2. Parse parts from name by splitting on "/", ",", "+"
  const parts = name.split(/[\/,+]/).map((p) => p.trim()).filter(Boolean);

  const findPart = (regex) => {
    for (const part of parts) {
      if (regex.test(part)) return part;
    }
    const match = name.match(regex);
    return match ? match[0] : null;
  };

  // CPU
  let cpu =
    explicitSpecs["cpu"] ||
    explicitSpecs["bộ xử lý"] ||
    explicitSpecs["bộ vi xử lý"] ||
    explicitSpecs["processor"] ||
    findPart(/\b(i[3579][ -]?\w+|Core\s+i[3579]\s*\w+|Ryzen\s*[3579]\s*\w+|R[3579]\s*\w+|Xeon\s*\w+|Ultra\s*\d\s*\w+|M[1234]\s*(Pro|Max)?)\b/i);

  // RAM
  let ram =
    explicitSpecs["ram"] ||
    explicitSpecs["bộ nhớ"] ||
    explicitSpecs["memory"] ||
    findPart(/\b(RAM\s*)?(\d+\s*GB|\d+\s*G)(\s*DDR\d)?(\s*\d+\s*MHz)?\b/i) ||
    findPart(/\b(2X\d+\s*GB|\d+X\d+\s*GB)\b/i);

  // SSD / Storage
  let ssd =
    explicitSpecs["ổ cứng"] ||
    explicitSpecs["ssd"] ||
    explicitSpecs["storage"] ||
    explicitSpecs["hdd"] ||
    findPart(/\b(SSD\s*\d+\s*(GB|TB)|HDD\s*\d+\s*(GB|TB)|\d+\s*(GB|TB)\s*(SSD|HDD|NVME|M\.2|BIWIN|GEN\s*\d))\b/i) ||
    findPart(/\b\d+\s*(TB|GB)\s*SSD\b/i);

  // VGA / GPU
  let vga =
    explicitSpecs["vga"] ||
    explicitSpecs["gpu"] ||
    explicitSpecs["card màn hình"] ||
    explicitSpecs["graphics"] ||
    findPart(/\b(VGA\s*)?(RTX\s*\d+\w*(\s*\d+\s*GB)?|GTX\s*\d+\w*(\s*\d+\s*GB)?|RX\s*\d+\w*(\s*\d+\s*GB)?|Radeon\s*\w+|Intel\s*Iris\s*\w*|UHD\s*Graphics\s*\w*)\b/i);

  // Mainboard
  let mainboard =
    explicitSpecs["mainboard"] ||
    explicitSpecs["bo mạch chủ"] ||
    explicitSpecs["main"] ||
    findPart(/\b(B\d{3}M?\w*|H\d{3}M?\w*|Z\d{3}M?\w*|X\d{3}M?\w*|A\d{3}M?\w*)(\s+(TUF|MAG|WIFI|PRO|PLUS|MSI|ASUS|GIGABYTE))*\b/i);

  // Nguồn (PSU)
  let psu =
    explicitSpecs["nguồn"] ||
    explicitSpecs["psu"] ||
    explicitSpecs["power supply"] ||
    findPart(/\b(NGUỒN\s*)?(\d{3,4}\s*W)(\s+[\w\s-]+)?\b/i);

  // Tản nhiệt (Cooler)
  let cooler =
    explicitSpecs["tản nhiệt"] ||
    explicitSpecs["tản"] ||
    explicitSpecs["cooler"] ||
    explicitSpecs["cooling"] ||
    findPart(/\b(AIO\s*\d+\w*|TẢN\s*KHÍ\w*|TẢN\s*NHIỆT\w*|TẢN\s*NƯỚC\w*|RAD\s*\d+\w*|COOLER\w*)\b/i);

  // Vỏ Case
  let caseBox =
    explicitSpecs["vỏ case"] ||
    explicitSpecs["case"] ||
    explicitSpecs["thùng máy"] ||
    findPart(/\b(CASE\s+[^/]+)\b/i);

  // Màn hình (Display)
  let display =
    explicitSpecs["màn hình"] ||
    explicitSpecs["lcd"] ||
    explicitSpecs["display"] ||
    findPart(/\b(LCD\s*[^/]+|\d+\s*INCH\s*[^/]+|\d+['"]+\s*[^/]+|IPS\s*\d+\s*HZ\w*)\b/i);

  // Fallbacks based on category if specific standalone component
  if (cat.includes("cpu") && !cpu) cpu = name;
  if (cat.includes("ram") && !ram) ram = name;
  if ((cat.includes("ổ cứng") || cat.includes("ssd")) && !ssd) ssd = name;
  if ((cat.includes("vga") || cat.includes("card")) && !vga) vga = name;
  if (cat.includes("mainboard") && !mainboard) mainboard = name;
  if (cat.includes("nguồn") && !psu) psu = name;
  if (cat.includes("tản") && !cooler) cooler = name;
  if (cat.includes("case") && !caseBox) caseBox = name;
  if (cat.includes("màn hình") && !display) display = name;

  // Cleanup strings
  const clean = (val) => {
    if (!val) return null;
    let s = String(val).trim();
    s = s.replace(/^[,\/\-:]+|[,\/\-:]+$/g, "").trim();
    return s || null;
  };

  const isLaptop = cat.includes("laptop") || name.toLowerCase().includes("laptop");
  const isPC = cat.includes("pc") || name.toLowerCase().includes("bộ máy tính") || name.toLowerCase().includes("pc");
  const isMonitor = cat.includes("màn hình") || name.toLowerCase().includes("màn hình");

  return {
    category: product.categoryName || product.category || "PC & Laptop",
    brand: product.brand || (isLaptop ? "Lenovo / Dell / ASUS" : isMonitor ? "Màn hình chính hãng" : "ZComputer"),
    cpu: clean(cpu) || (isPC ? "Intel Core i5 / AMD Ryzen" : isLaptop ? "Intel Core / AMD Ryzen" : "Theo cấu hình chuẩn"),
    ram: clean(ram) || (isPC ? "16GB DDR4 / DDR5" : isLaptop ? "16GB LPDDR5 / DDR4" : "Theo cấu hình chuẩn"),
    ssd: clean(ssd) || (isPC ? "SSD 512GB NVMe" : isLaptop ? "SSD 512GB NVMe tốc độ cao" : "Theo cấu hình chuẩn"),
    vga: clean(vga) || (isPC ? "NVIDIA GeForce RTX Series" : isLaptop ? "Intel Iris Xe / RTX Series" : "Theo cấu hình chuẩn"),
    mainboard: clean(mainboard) || (isLaptop ? "Bo mạch tích hợp OEM" : isPC ? "Bo mạch chủ Intel / AMD Chipset" : "Theo cấu hình chuẩn"),
    psu: clean(psu) || (isLaptop ? "Adapter sạc chính hãng kèm theo" : isPC ? "Nguồn công suất thực 550W - 750W" : "Nguồn tiêu chuẩn"),
    cooler: clean(cooler) || (isLaptop ? "Tản nhiệt buồng hơi / 2 quạt làm mát" : isPC ? "Tản nhiệt khí RGB / Tản AIO" : "Hệ thống làm mát tối ưu"),
    caseBox: clean(caseBox) || (isLaptop ? "Khung vỏ cao cấp nguyên khối" : isPC ? "Case Gaming kính cường lực LED RGB" : "Thiết kế chuẩn hãng"),
    display: clean(display) || (isLaptop ? "14 - 15.6 inch FHD / 2K sắc nét" : isMonitor ? clean(name) : "Hỗ trợ xuất đa màn hình 4K"),
    warranty: product.warranty || "Bảo hành 3 - 12 Tháng",
    status: product.status === "out_of_stock" ? "Hết hàng" : "Còn hàng",
  };
};
