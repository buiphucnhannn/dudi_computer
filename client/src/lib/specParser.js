/**
 * Intelligent Category & Specification Parser for ZCOMPUTER
 * Detects product types and extracts accurate, category-specific specs from name or explicit fields.
 */

// Category types enum
export const PRODUCT_TYPES = {
  LAPTOP: "laptop",
  PC: "pc",
  MONITOR: "monitor",
  MAINBOARD: "mainboard",
  PSU: "psu",
  VGA: "vga",
  RAM: "ram",
  SSD: "ssd",
  CPU: "cpu",
  COOLER: "cooler",
  CASE: "case",
  GEAR: "gear",
  GENERAL: "general",
};

/**
 * Get human-friendly label for a product type
 */
export const getProductTypeLabel = (type) => {
  switch (type) {
    case PRODUCT_TYPES.PC:
      return "Bộ máy tính PC";
    case PRODUCT_TYPES.LAPTOP:
      return "Laptop";
    case PRODUCT_TYPES.MONITOR:
      return "Màn hình máy tính";
    case PRODUCT_TYPES.MAINBOARD:
      return "Bo mạch chủ (Mainboard)";
    case PRODUCT_TYPES.PSU:
      return "Nguồn máy tính (PSU)";
    case PRODUCT_TYPES.VGA:
      return "Card màn hình (VGA)";
    case PRODUCT_TYPES.CPU:
      return "Bộ vi xử lý (CPU)";
    case PRODUCT_TYPES.RAM:
      return "Bộ nhớ trong (RAM)";
    case PRODUCT_TYPES.SSD:
      return "Ổ cứng (SSD / HDD)";
    case PRODUCT_TYPES.CASE:
      return "Vỏ máy tính (Case)";
    case PRODUCT_TYPES.COOLER:
      return "Tản nhiệt (Cooling)";
    case PRODUCT_TYPES.GEAR:
      return "Phụ kiện / Gaming Gear";
    default:
      return "Sản phẩm công nghệ";
  }
};

/**
 * Identify product category type from categoryName, categorySlug, or product title
 */
export const detectProductType = (product) => {
  if (!product) return PRODUCT_TYPES.GENERAL;

  const name = String(product.name || product.title || "").toLowerCase();
  const cat = String(product.categoryName || product.category || product.categorySlug || "").toLowerCase();

  // 1. Monitor / Màn hình
  if (
    cat.includes("màn hình") ||
    cat.includes("man-hinh") ||
    cat.includes("monitor") ||
    name.startsWith("màn hình") ||
    name.includes("ultragear") ||
    name.includes("odyssey g") ||
    name.includes("vg279") ||
    name.includes("xg32") ||
    name.includes("24 inch") ||
    name.includes("27 inch") ||
    name.includes("32 inch")
  ) {
    // Make sure it's not a laptop having LCD in title
    if (!name.includes("laptop") && !cat.includes("laptop")) {
      return PRODUCT_TYPES.MONITOR;
    }
  }

  // 2. Mainboard / Bo mạch chủ
  if (
    cat.includes("mainboard") ||
    cat.includes("bo mạch") ||
    cat.includes("bo-mach") ||
    name.startsWith("mainboard") ||
    name.startsWith("bo mạch chủ") ||
    name.startsWith("main ")
  ) {
    return PRODUCT_TYPES.MAINBOARD;
  }

  // 3. Power Supply (PSU / Nguồn)
  if (
    cat.includes("psu") ||
    cat.includes("nguồn") ||
    cat.includes("nguon") ||
    name.startsWith("nguồn") ||
    name.startsWith("psu") ||
    name.includes("80 plus") ||
    name.includes("a850g") ||
    name.includes("rm750") ||
    name.includes("rm850") ||
    name.includes("swat 700w")
  ) {
    if (!name.includes("laptop") && !name.includes("bộ máy tính") && !cat.includes("pc")) {
      return PRODUCT_TYPES.PSU;
    }
  }

  // 4. VGA / Card màn hình
  if (
    cat.includes("vga") ||
    cat.includes("card-man-hinh") ||
    cat.includes("card màn hình") ||
    name.startsWith("vga ") ||
    name.startsWith("card màn hình")
  ) {
    if (!name.includes("laptop") && !name.includes("bộ máy tính") && !cat.includes("pc")) {
      return PRODUCT_TYPES.VGA;
    }
  }

  // 5. RAM
  if (
    cat.includes("ram") ||
    cat.includes("bộ nhớ") ||
    cat.includes("bo-nho") ||
    name.startsWith("ram ") ||
    name.startsWith("kit ram")
  ) {
    if (!name.includes("laptop") && !name.includes("bộ máy tính") && !cat.includes("pc")) {
      return PRODUCT_TYPES.RAM;
    }
  }

  // 6. SSD / Ổ cứng
  if (
    cat.includes("ổ cứng") ||
    cat.includes("o-cung") ||
    cat.includes("ssd") ||
    cat.includes("hdd") ||
    name.startsWith("ssd ") ||
    name.startsWith("ổ cứng") ||
    name.startsWith("hdd ")
  ) {
    if (!name.includes("laptop") && !name.includes("bộ máy tính") && !cat.includes("pc")) {
      return PRODUCT_TYPES.SSD;
    }
  }

  // 7. CPU / Bộ vi xử lý
  if (
    cat.includes("cpu") ||
    cat.includes("vi xử lý") ||
    cat.includes("vi-xu-ly") ||
    name.startsWith("cpu ") ||
    name.startsWith("bộ vi xử lý") ||
    name.startsWith("vi xử lý")
  ) {
    if (!name.includes("laptop") && !name.includes("bộ máy tính") && !cat.includes("pc")) {
      return PRODUCT_TYPES.CPU;
    }
  }

  // 8. Tản nhiệt / Cooling
  if (
    cat.includes("tản nhiệt") ||
    cat.includes("tan-nhiet") ||
    cat.includes("cooling") ||
    name.startsWith("tản nhiệt") ||
    name.startsWith("tản nước") ||
    name.startsWith("tản khí") ||
    name.startsWith("aio ")
  ) {
    if (!name.includes("bộ máy tính") && !name.includes("laptop")) {
      return PRODUCT_TYPES.COOLER;
    }
  }

  // 9. Case / Vỏ máy tính
  if (
    cat.includes("case") ||
    cat.includes("vỏ") ||
    cat.includes("vo-may-tinh") ||
    name.startsWith("vỏ case") ||
    name.startsWith("case ")
  ) {
    if (!name.includes("bộ máy tính") && !name.includes("laptop")) {
      return PRODUCT_TYPES.CASE;
    }
  }

  // 10. Bàn phím / Chuột / Gear
  if (
    cat.includes("bàn phím") ||
    cat.includes("ban-phim") ||
    cat.includes("chuột") ||
    cat.includes("chuot") ||
    cat.includes("gear") ||
    name.startsWith("bàn phím") ||
    name.startsWith("chuột") ||
    name.startsWith("tai nghe")
  ) {
    return PRODUCT_TYPES.GEAR;
  }

  // 11. Laptop / Macbook
  if (
    cat.includes("laptop") ||
    cat.includes("macbook") ||
    name.includes("laptop") ||
    name.includes("macbook") ||
    name.includes("zenbook") ||
    name.includes("vivobook") ||
    name.includes("thinkpad") ||
    name.includes("legion") ||
    name.includes("alienware") ||
    name.includes("predator")
  ) {
    return PRODUCT_TYPES.LAPTOP;
  }

  // 12. PC / Bộ máy tính
  if (
    cat.includes("pc") ||
    cat.includes("máy tính") ||
    name.includes("bộ máy tính") ||
    name.includes("pc ") ||
    name.includes("gaming")
  ) {
    return PRODUCT_TYPES.PC;
  }

  return PRODUCT_TYPES.GENERAL;
};

/**
 * Extract 4 smart spec pills for product cards (Home, Products list, search...)
 */
export const getProductCardBadges = (product) => {
  if (!product) return [];

  const type = detectProductType(product);
  const name = String(product.name || "");
  const specs = product.specs || {};

  // Clean helper
  const clean = (t) => (t ? String(t).trim().replace(/^[,\/\-:]+|[,\/\-:]+$/g, "").trim() : "");

  switch (type) {
    // ==========================================
    // 1. LAPTOP & MACBOOK
    // ==========================================
    case PRODUCT_TYPES.LAPTOP: {
      // CPU extraction (Fixed Zephyrus M15 vs Apple M1 bug!)
      let cpu = specs.cpu || "";
      if (!cpu) {
        if (name.match(/\b(Apple\s*)?M[1234](\s*(Pro|Max|Ultra))?\b/i) && !name.match(/\bM1[4-9]\b/i) && !name.match(/Zephyrus/i)) {
          const m = name.match(/\b(M[1234]\s*(Pro|Max|Ultra)?(\s*\d+CPU\s*\d+GPU)?)\b/i);
          cpu = m ? (m[0].toUpperCase().startsWith("M") ? `Apple ${m[0]}` : m[0]) : "Apple Silicon";
        } else if (name.match(/Ryzen\s*[3579]\s*\w+/i)) {
          const m = name.match(/Ryzen\s*[3579]\s*\w+/i);
          cpu = m ? m[0] : "AMD Ryzen";
        } else if (name.match(/Core\s*i[3579]\s*\w+/i) || name.match(/\bi[3579][-\s]\d+\w*/i)) {
          const m = name.match(/Core\s*i[3579]\s*\w+/i) || name.match(/\bi[3579][-\s]\d+\w*/i);
          cpu = m ? m[0].replace(/Core\s*/i, "") : "Intel Core";
        } else if (name.match(/Ultra\s*[579]\s*\w*/i)) {
          const m = name.match(/Ultra\s*[579]\s*\w*/i);
          cpu = m ? `Core ${m[0]}` : "Core Ultra";
        } else {
          cpu = "Intel / AMD CPU";
        }
      }

      // RAM & Storage from slashed parts: e.g. 16GB/512GB or 8GB/256GB or 16GB/SSD 512GB
      let ram = specs.ram || "";
      let storage = specs.storage || specs.ssd || "";

      // Check explicit slash pattern like 8GB/256GB or 16GB/512GB
      const slashCombo = name.match(/\b(\d+GB)\s*\/\s*(SSD\s*)?(\d+(?:GB|TB))\b/i);
      if (slashCombo) {
        if (!ram) ram = slashCombo[1].toUpperCase();
        if (!storage) storage = `SSD ${slashCombo[3].toUpperCase()}`;
      }

      // If still missing RAM
      if (!ram) {
        const m = name.match(/\b(\d+GB)\s*(RAM|DDR[45]|LPDDR[45])?\b/i);
        ram = m ? m[1].toUpperCase() : "16GB";
      }

      // If still missing Storage
      if (!storage) {
        const ssdExplicit = name.match(/(SSD\s*\d+(GB|TB)|\d+(GB|TB)\s*SSD|NVMe\s*\d+(GB|TB)|\b\d+TB\b)/i);
        if (ssdExplicit) {
          storage = ssdExplicit[0].toUpperCase().includes("SSD") ? ssdExplicit[0].toUpperCase() : `SSD ${ssdExplicit[0].toUpperCase()}`;
        } else {
          // Look for 256GB / 512GB / 128GB that is not equal to RAM
          const allGBs = [...name.matchAll(/\b(\d+(?:GB|TB))\b/gi)].map((x) => x[1].toUpperCase());
          const otherGB = allGBs.find((g) => g !== ram && (g.includes("256") || g.includes("512") || g.includes("1TB") || g.includes("128") || g.includes("1024")));
          storage = otherGB ? `SSD ${otherGB}` : "SSD 512GB";
        }
      }

      // VGA / Display
      let gpuOrDisplay = specs.gpu || specs.vga || "";
      if (!gpuOrDisplay) {
        const gpuMatch = name.match(/(RTX\s*\d{4}(\s*Ti|\s*Super|\s*\d+GB)?|GTX\s*\d{4}|RX\s*\d{4}M?(\s*\d+GB)?|Intel\s*Iris|Radeon|UHD)/i);
        if (gpuMatch) {
          gpuOrDisplay = gpuMatch[0];
        } else if (name.match(/Retina|OLED|4K|2\.8K|QHD|FHD|165Hz|144Hz|120Hz/i)) {
          const scrMatch = name.match(/(\d+(\.\d+)?['"inch]*\s*)?(OLED|Retina|4K|2\.8K|QHD|FHD)(\s*\d+Hz)?/i);
          gpuOrDisplay = scrMatch ? scrMatch[0] : (name.includes("Macbook") ? "Màn hình Retina" : "Card đồ họa");
        } else {
          gpuOrDisplay = name.includes("Macbook") ? "Màn hình Retina" : "Card đồ họa";
        }
      }

      return [
        { icon: "Cpu", label: clean(cpu), title: `CPU: ${cpu}` },
        { icon: "Layers", label: clean(ram), title: `RAM: ${ram}` },
        { icon: "HardDrive", label: clean(storage), title: `Ổ cứng: ${storage}` },
        { icon: "Monitor", label: clean(gpuOrDisplay), title: `Đồ họa / Màn hình: ${gpuOrDisplay}` },
      ];
    }

    // ==========================================
    // 2. PC & BỘ MÁY TÍNH
    // ==========================================
    case PRODUCT_TYPES.PC: {
      let cpu = specs.cpu || "";
      if (!cpu) {
        const m = name.match(/\b(i[3579][-\s]\d+\w*|Ryzen\s*[3579]\s*\w+|Core\s*Ultra\s*\d\w*)\b/i);
        cpu = m ? m[0] : (name.includes("i5") ? "Core i5" : name.includes("i7") ? "Core i7" : "Intel Core");
      }

      let ram = specs.ram || "";
      if (!ram) {
        const m = name.match(/\b(\d+GB)\s*(RAM|DDR[45])?\b/i);
        ram = m ? m[1].toUpperCase() : "16GB";
      }

      let storage = specs.storage || specs.ssd || "";
      if (!storage) {
        const m = name.match(/(SSD\s*\d+(GB|TB)|\d+(GB|TB)\s*SSD|NVMe\s*\d+(GB|TB))/i);
        storage = m ? (m[0].toUpperCase().includes("SSD") ? m[0].toUpperCase() : `SSD ${m[0].toUpperCase()}`) : "SSD 512GB";
      }

      let gpu = specs.gpu || specs.vga || "";
      if (!gpu) {
        const m = name.match(/(RTX\s*\d{4}(\s*Ti|\s*Super|\s*\d+GB)?|GTX\s*\d{4}(\s*Super)?|RX\s*\d{4}(\s*XT)?)/i);
        gpu = m ? m[0] : "Card đồ họa";
      }

      return [
        { icon: "Cpu", label: clean(cpu), title: `CPU: ${cpu}` },
        { icon: "Layers", label: clean(ram), title: `RAM: ${ram}` },
        { icon: "HardDrive", label: clean(storage), title: `Ổ cứng: ${storage}` },
        { icon: "CircuitBoard", label: clean(gpu), title: `VGA: ${gpu}` },
      ];
    }

    // ==========================================
    // 3. MÀN HÌNH MÁY TÍNH (MONITORS)
    // ==========================================
    case PRODUCT_TYPES.MONITOR: {
      // Size
      const sizeMatch = name.match(/\b(\d+(\.\d+)?\s*(inch|['"]))\b/i);
      const size = sizeMatch ? sizeMatch[1].replace(/['"]/g, " inch") : (name.includes("32") ? "32 inch" : name.includes("27") ? "27 inch" : "24 inch");

      // Resolution
      const resMatch = name.match(/\b(4K\s*UHD|2K\s*WQHD|2K\s*QHD|2K|WQHD|QHD|FHD|1080p)\b/i);
      const res = resMatch ? resMatch[0].toUpperCase() : "FHD 1080p";

      // Refresh Rate
      const hzMatch = name.match(/\b(\d{2,3}\s*Hz)\b/i);
      const hz = hzMatch ? hzMatch[0] : "165Hz";

      // Panel & Tech
      const panelMatch = name.match(/\b(Fast\s*IPS|Super\s*Clear\s*IPS|OLED|IPS|VA|TN|DisplayHDR\s*\d+|HDR\d+|Cong\s*\d+R?|1ms)\b/i);
      const panel = panelMatch ? panelMatch[0] : "Fast IPS 1ms";

      return [
        { icon: "Monitor", label: size, title: `Kích thước: ${size}` },
        { icon: "Maximize2", label: res, title: `Độ phân giải: ${res}` },
        { icon: "Zap", label: hz, title: `Tần số quét: ${hz}` },
        { icon: "Sparkles", label: panel, title: `Tấm nền & Công nghệ: ${panel}` },
      ];
    }

    // ==========================================
    // 4. NGUỒN MÁY TÍNH (PSU)
    // ==========================================
    case PRODUCT_TYPES.PSU: {
      // Wattage
      const wattMatch = name.match(/\b(\d{3,4}\s*W)\b/i);
      const watt = wattMatch ? wattMatch[1] : "750W";

      // 80 Plus Efficiency
      const effMatch = name.match(/\b(80\s*Plus\s*(Titanium|Platinum|Gold|Bronze|White|Silver)|80\s*Plus)\b/i);
      const eff = effMatch ? effMatch[0] : "80 Plus Gold";

      // Modular cable
      const modMatch = name.match(/\b(Full\s*Modular|Full\s*Modul|Semi\s*Modular|Non-Modular|PCIe\s*5\.0|ATX\s*3\.0)\b/i);
      const mod = modMatch ? modMatch[0] : (name.includes("MSI") || name.includes("Corsair") ? "Full Modular" : "Dây cáp bọc lưới");

      // Form & Features
      const featMatch = name.match(/\b(PCIe\s*5\.0|ATX\s*3\.0|PCIe5|V4|V2022|RGB|SFX)\b/i);
      const feat = featMatch ? featMatch[0] : "Chuẩn ATX 3.0";

      return [
        { icon: "Zap", label: watt, title: `Công suất: ${watt}` },
        { icon: "ShieldCheck", label: eff, title: `Chứng nhận hiệu suất: ${eff}` },
        { icon: "Layers", label: mod, title: `Thiết kế dây cáp: ${mod}` },
        { icon: "Cpu", label: feat, title: `Tính năng: ${feat}` },
      ];
    }

    // ==========================================
    // 5. MAINBOARD (BO MẠCH CHỦ)
    // ==========================================
    case PRODUCT_TYPES.MAINBOARD: {
      // Chipset
      const chipMatch = name.match(/\b(Z790\w*|B760\w*|B650\w*|H610\w*|X670\w*|B550\w*|A620\w*|Z690\w*)\b/i);
      const chipset = chipMatch ? chipMatch[0].toUpperCase() : "Chipset Pro";

      // Socket
      const sockMatch = name.match(/\b(LGA\s*1700|AM5|LGA\s*1200|AM4)\b/i);
      const socket = sockMatch ? sockMatch[0] : (chipset.includes("760") || chipset.includes("790") || chipset.includes("610") ? "LGA 1700" : "Socket AM5");

      // RAM slots & type
      const ramMatch = name.match(/\b(4\s*khe\s*RAM\s*DDR[45]|4\s*khe\s*RAM|DDR[45]|2\s*khe\s*RAM)\b/i);
      const ram = ramMatch ? ramMatch[0] : (name.includes("DDR5") ? "4 khe DDR5" : "4 khe DDR4");

      // Form Factor / WiFi
      const formMatch = name.match(/\b(mATX\s*WIFI|mATX|ATX\s*WIFI|ATX|Mini-ITX|WIFI\s*6E|WIFI)\b/i);
      const form = formMatch ? formMatch[0] : (name.includes("M-") || name.includes("B760M") ? "mATX / WiFi" : "ATX Gaming");

      return [
        { icon: "Cpu", label: chipset, title: `Chipset: ${chipset}` },
        { icon: "CircuitBoard", label: socket, title: `Socket CPU: ${socket}` },
        { icon: "Layers", label: ram, title: `Hỗ trợ RAM: ${ram}` },
        { icon: "Wifi", label: form, title: `Form & Kết nối: ${form}` },
      ];
    }

    // ==========================================
    // 6. VGA (CARD MÀN HÌNH)
    // ==========================================
    case PRODUCT_TYPES.VGA: {
      const gpuMatch = name.match(/(RTX\s*\d{4}(\s*Ti|\s*Super)?|GTX\s*\d{4}|RX\s*\d{4}(\s*XT)?)/i);
      const gpu = gpuMatch ? gpuMatch[0] : "GeForce RTX";

      const vramMatch = name.match(/\b(\d+GB)\s*(GDDR\d[X]?)?\b/i);
      const vram = vramMatch ? vramMatch[0] : "8GB GDDR6";

      const fanMatch = name.match(/\b(3\s*Fan|2\s*Fan|Triple\s*Fan|Dual\s*Fan|OC|Gaming|TUF|ROG)\b/i);
      const fan = fanMatch ? fanMatch[0] : "Tản nhiệt 3 Fan";

      const portMatch = name.match(/\b(PCIe\s*4\.0|HDMI\s*2\.1|DP\s*1\.4)\b/i);
      const port = portMatch ? portMatch[0] : "PCIe 4.0 x16";

      return [
        { icon: "CircuitBoard", label: gpu, title: `GPU: ${gpu}` },
        { icon: "Layers", label: vram, title: `VRAM: ${vram}` },
        { icon: "Zap", label: fan, title: `Tản nhiệt: ${fan}` },
        { icon: "Monitor", label: port, title: `Giao tiếp: ${port}` },
      ];
    }

    // ==========================================
    // 7. RAM (BỘ NHỚ TRONG)
    // ==========================================
    case PRODUCT_TYPES.RAM: {
      const capMatch = name.match(/\b(\d+GB(\s*\(\d+x\d+GB\))?|\d+GBx\d+)\b/i);
      const cap = capMatch ? capMatch[0] : "16GB (2x8GB)";

      const typeMatch = name.match(/\b(DDR[45])\b/i);
      const typeStr = typeMatch ? typeMatch[0] : "DDR5";

      const busMatch = name.match(/\b(\d{4}\s*MHz|\d{4}\s*MT\/s)\b/i);
      const bus = busMatch ? busMatch[0] : "5600MHz";

      const featMatch = name.match(/\b(RGB|Fury|Vengeance|Trident\s*Z|Tản\s*nhôm)\b/i);
      const feat = featMatch ? featMatch[0] : "LED RGB";

      return [
        { icon: "Layers", label: cap, title: `Dung lượng: ${cap}` },
        { icon: "CircuitBoard", label: typeStr, title: `Chuẩn RAM: ${typeStr}` },
        { icon: "Zap", label: bus, title: `Tốc độ Bus: ${bus}` },
        { icon: "Sparkles", label: feat, title: `Tính năng: ${feat}` },
      ];
    }

    // ==========================================
    // 8. Ổ CỨNG (SSD / HDD)
    // ==========================================
    case PRODUCT_TYPES.SSD: {
      const capMatch = name.match(/\b(\d+\s*(GB|TB))\b/i);
      const cap = capMatch ? capMatch[0] : "1TB";

      const intMatch = name.match(/\b(NVMe\s*PCIe\s*(Gen\s*\d|4\.0|3\.0)|NVMe|M\.2|SATA\s*III)\b/i);
      const iface = intMatch ? intMatch[0] : "M.2 NVMe PCIe 4.0";

      const spdMatch = name.match(/\b(\d{4}\s*MB\/s|Đọc\s*\d{4}\w*)\b/i);
      const spd = spdMatch ? spdMatch[0] : "Đọc 5000MB/s";

      const form = name.includes("2280") ? "Form M.2 2280" : "Chuẩn M.2";

      return [
        { icon: "HardDrive", label: cap, title: `Dung lượng: ${cap}` },
        { icon: "CircuitBoard", label: iface, title: `Giao tiếp: ${iface}` },
        { icon: "Zap", label: spd, title: `Tốc độ: ${spd}` },
        { icon: "Layers", label: form, title: `Kích thước: ${form}` },
      ];
    }

    // ==========================================
    // 9. CPU (BỘ VI XỬ LÝ)
    // ==========================================
    case PRODUCT_TYPES.CPU: {
      const coreMatch = name.match(/\b(Core\s*i[3579]\s*\w+|Ryzen\s*[3579]\s*\w+|Core\s*Ultra\s*\d\w*)\b/i);
      const model = coreMatch ? coreMatch[0] : "Intel Core";

      const sockMatch = name.match(/\b(LGA\s*1700|AM5|LGA\s*1851|AM4)\b/i);
      const socket = sockMatch ? sockMatch[0] : "LGA 1700";

      const coreThreadMatch = name.match(/\b(\d+\s*Nhân\s*\d+\s*Luồng|\d+C\/\d+T)\b/i);
      const cores = coreThreadMatch ? coreThreadMatch[0] : "Đa nhân siêu phân luồng";

      const clockMatch = name.match(/\b(Up\s*to\s*\d+(\.\d+)?\s*GHz|\d+(\.\d+)?\s*GHz)\b/i);
      const clock = clockMatch ? clockMatch[0] : "Xung nhịp Turbo cao";

      return [
        { icon: "Cpu", label: model, title: `Model: ${model}` },
        { icon: "CircuitBoard", label: socket, title: `Socket: ${socket}` },
        { icon: "Zap", label: cores, title: `Số nhân: ${cores}` },
        { icon: "Sparkles", label: clock, title: `Xung nhịp: ${clock}` },
      ];
    }

    // ==========================================
    // DEFAULT & STANDALONE ACCESSORIES
    // ==========================================
    default: {
      const brand = product.brand || "Chính hãng";
      const status = product.status === "out_of_stock" ? "Hết hàng" : "Còn hàng";
      const warranty = product.warranty || "Bảo hành 3 - 12 Tháng";
      const catName = product.categoryName || "Linh kiện";

      return [
        { icon: "ShieldCheck", label: brand, title: `Thương hiệu: ${brand}` },
        { icon: "Sparkles", label: catName, title: `Danh mục: ${catName}` },
        { icon: "Zap", label: status, title: `Tình trạng: ${status}` },
        { icon: "Clock", label: warranty, title: `Bảo hành: ${warranty}` },
      ];
    }
  }
};

/**
 * Build dynamic, category-specific specification rows for Product Detail Page Table
 */
export const parseProductSpecs = (product) => {
  if (!product) return {};

  const type = detectProductType(product);
  const name = String(product.name || "");
  const w = product.warranty || "Bảo hành 3 - 12 Tháng";

  // Build category specific specification rows
  switch (type) {
    case PRODUCT_TYPES.MONITOR: {
      const sizeMatch = name.match(/\b(\d+(\.\d+)?\s*(inch|['"]))\b/i);
      const size = sizeMatch ? sizeMatch[1].replace(/['"]/g, " inch") : (name.includes("32") ? "32 inch" : name.includes("27") ? "27 inch" : "24 inch");
      const resMatch = name.match(/\b(4K\s*UHD|2K\s*WQHD|2K\s*QHD|2K|WQHD|QHD|FHD|1080p)\b/i);
      const res = resMatch ? resMatch[0].toUpperCase() : "FHD (1920 x 1080)";
      const hzMatch = name.match(/\b(\d{2,3}\s*Hz)\b/i);
      const hz = hzMatch ? hzMatch[0] : "165Hz";
      const panelMatch = name.match(/\b(Fast\s*IPS|OLED|IPS|VA|TN|Super\s*Clear)\b/i);
      const panel = panelMatch ? panelMatch[0] : "Fast IPS";
      const isCurved = name.toLowerCase().includes("cong") || name.toLowerCase().includes("curved") || name.includes("1500R") || name.includes("1000R");

      return {
        type,
        isPCorLaptop: false,
        category: product.categoryName || "Màn hình máy tính",
        brand: product.brand || "Chính hãng",
        cpu: "-",
        ram: "-",
        ssd: "-",
        vga: "-",
        mainboard: "-",
        psu: "Nguồn Adapter kèm theo",
        cooler: "Tản nhiệt thụ động",
        caseBox: isCurved ? "Màn hình cong tràn viền" : "Thiết kế tràn viền siêu mỏng",
        display: `${size} ${res} ${hz} ${panel}`,
        warranty: w,
        status: product.status === "out_of_stock" ? "Hết hàng" : "Còn hàng",
        items: [
          { name: "Kích thước màn hình", detail: size, warranty: w },
          { name: "Độ phân giải", detail: res === "2K QHD" ? "2K QHD (2560 x 1440)" : res === "FHD" ? "Full HD (1920 x 1080)" : res, warranty: w },
          { name: "Tần số quét", detail: hz, warranty: w },
          { name: "Tấm nền hiển thị", detail: `${panel} (Góc nhìn siêu rộng 178°/178°)`, warranty: w },
          { name: "Kiểu dáng màn hình", detail: isCurved ? "Màn hình cong Gaming chuyên dụng" : "Màn hình phẳng tràn viền siêu mỏng", warranty: w },
          { name: "Thời gian đáp ứng (Response Time)", detail: "1ms (GTG / MPRT) khử bóng mờ", warranty: w },
          { name: "Công nghệ đồng bộ", detail: "AMD FreeSync Premium / NVIDIA G-Sync Compatible", warranty: w },
          { name: "Cổng xuất hình & Kết nối", detail: "DisplayPort 1.4, HDMI 2.0, Audio Out 3.5mm", warranty: w },
          { name: "Thương hiệu", detail: product.brand || "Chính hãng", warranty: "-" },
          { name: "Tình trạng", detail: "Nguyên seal mới 100% / Like New 99%", warranty: "-" },
        ],
        highlights: [
          { label: "KÍCH THƯỚC", value: size },
          { label: "ĐỘ PHÂN GIẢI", value: res },
          { label: "TẦN SỐ QUÉT", value: hz },
          { label: "TẤM NỀN", value: panel },
          { label: "TỐC ĐỘ PHẢN HỒI", value: "1ms" },
          { label: "CỔNG KẾT NỐI", value: "HDMI, DisplayPort" },
        ]
      };
    }

    case PRODUCT_TYPES.PSU: {
      const wattMatch = name.match(/\b(\d{3,4}\s*W)\b/i);
      const watt = wattMatch ? wattMatch[1] : "850W";
      const effMatch = name.match(/\b(80\s*Plus\s*(Titanium|Platinum|Gold|Bronze|White|Silver)|80\s*Plus)\b/i);
      const eff = effMatch ? effMatch[0] : "80 Plus Gold";
      const modMatch = name.match(/\b(Full\s*Modular|Full\s*Modul|Semi\s*Modular|Non-Modular)\b/i);
      const mod = modMatch ? modMatch[0] : "Full Modular (Dây rời 100%)";

      return {
        type,
        isPCorLaptop: false,
        category: product.categoryName || "PSU - Nguồn máy tính",
        brand: product.brand || "Chính hãng",
        cpu: "-",
        ram: "-",
        ssd: "-",
        vga: "-",
        mainboard: "-",
        psu: `${watt} ${eff} ${mod}`,
        cooler: "Quạt làm mát 135mm FDB Silent",
        caseBox: "Chuẩn kích thước ATX",
        display: "-",
        warranty: w,
        status: product.status === "out_of_stock" ? "Hết hàng" : "Còn hàng",
        items: [
          { name: "Công suất danh định", detail: `${watt} Công suất thực 100%`, warranty: w },
          { name: "Chứng nhận hiệu suất", detail: `${eff} (Hiệu suất chuyển đổi đạt trên 90%)`, warranty: w },
          { name: "Kiểu dây cáp (Modularity)", detail: mod, warranty: w },
          { name: "Chuẩn nguồn hỗ trợ", detail: name.includes("PCIe5") || name.includes("PCIE5") ? "ATX 3.0 & PCIe 5.0 (Cáp 12VHPWR 600W)" : "Chuẩn ATX 12V V2.52", warranty: w },
          { name: "Kích thước quạt làm mát", detail: "Quạt 135mm FDB Silent vận hành êm ái", warranty: w },
          { name: "Tính năng bảo vệ mạch", detail: "OVP, OPP, SCP, OCP, UVP, OTP an toàn tuyệt đối", warranty: w },
          { name: "Thương hiệu", detail: product.brand || "Chính hãng", warranty: "-" },
          { name: "Tình trạng", detail: "Chính hãng nguyên hộp", warranty: "-" },
        ],
        highlights: [
          { label: "CÔNG SUẤT", value: watt },
          { label: "HIỆU SUẤT", value: eff },
          { label: "LOẠI CÁP", value: mod },
          { label: "CHUẨN NGUỒN", value: "ATX 3.0 / PCIe 5.0" },
          { label: "QUẠT LÀM MÁT", value: "135mm FDB Silent" },
        ]
      };
    }

    case PRODUCT_TYPES.MAINBOARD: {
      const chipMatch = name.match(/\b(Z790\w*|B760\w*|B650\w*|H610\w*|X670\w*|B550\w*|A620\w*)\b/i);
      const chipset = chipMatch ? chipMatch[0].toUpperCase() : "Intel B760";
      const sockMatch = name.match(/\b(LGA\s*1700|AM5|LGA\s*1200|AM4)\b/i);
      const socket = sockMatch ? sockMatch[0] : (chipset.includes("760") || chipset.includes("790") ? "LGA 1700 (Hỗ trợ Intel Gen 12, 13, 14)" : "Socket AM5");
      const ramType = name.includes("DDR5") ? "DDR5 (Dual Channel, Up to 7200+ MHz OC)" : "DDR4 (Dual Channel, Up to 5333+ MHz OC)";

      return {
        type,
        isPCorLaptop: false,
        category: product.categoryName || "Mainboard - Bo mạch chủ",
        brand: product.brand || "Chính hãng",
        cpu: `Hỗ trợ Socket ${socket}`,
        ram: `4 khe ${ramType}`,
        ssd: "3x M.2 NVMe PCIe 4.0 + 4x SATA III",
        vga: "1x PCIe 5.0 x16 bọc thép",
        mainboard: `${chipset} (${socket})`,
        psu: "Đầu nối nguồn 24-pin + 8+4 pin CPU",
        cooler: "Tản nhiệt kim loại Heatsink VRM",
        caseBox: name.includes("B760M") || name.includes("mATX") ? "Micro-ATX" : "ATX",
        display: "Hỗ trợ cổng xuất hình HDMI / DisplayPort 4K",
        warranty: w,
        status: product.status === "out_of_stock" ? "Hết hàng" : "Còn hàng",
        items: [
          { name: "Chipset bo mạch chủ", detail: chipset, warranty: w },
          { name: "Socket CPU tương thích", detail: socket, warranty: w },
          { name: "Chuẩn & Khe cắm RAM", detail: `4 x Khe RAM ${ramType}, Hỗ trợ tối đa 128GB - 192GB`, warranty: w },
          { name: "Khe cắm mở rộng PCIe", detail: "1x PCIe 5.0 x16 bọc thép, 1x PCIe 4.0 x16", warranty: w },
          { name: "Cổng lưu trữ M.2 & SATA", detail: "3x Khe M.2 NVMe PCIe 4.0 x4 kèm tản nhiệt Shield, 4x SATA III 6Gb/s", warranty: w },
          { name: "Kết nối mạng & Không dây", detail: name.includes("WIFI") ? "Intel 2.5Gbps LAN + Wi-Fi 6E / Bluetooth 5.3" : "Realtek 2.5Gbps Gigabit LAN", warranty: w },
          { name: "Kích thước chuẩn (Form Factor)", detail: name.includes("B760M") || name.includes("mATX") ? "Micro-ATX (mATX) 24.4 cm x 24.4 cm" : "ATX Standard", warranty: w },
          { name: "Thương hiệu", detail: product.brand || "Chính hãng", warranty: "-" },
          { name: "Tình trạng", detail: "Hàng chính hãng fullbox nguyên seal", warranty: "-" },
        ],
        highlights: [
          { label: "CHIPSET", value: chipset },
          { label: "SOCKET", value: socket },
          { label: "HỖ TRỢ RAM", value: name.includes("DDR5") ? "4 Khe DDR5" : "4 Khe DDR4" },
          { label: "KHE M.2 NVME", value: "3x M.2 PCIe 4.0" },
          { label: "KẾT NỐI", value: name.includes("WIFI") ? "WiFi 6E + 2.5G LAN" : "2.5G Gigabit LAN" },
        ]
      };
    }

    // ==========================================
    // DEFAULT: PC & LAPTOP (FULL SPEC TABLE)
    // ==========================================
    default: {
      const isLaptop = type === PRODUCT_TYPES.LAPTOP;
      const badges = getProductCardBadges(product);
      const cpu = badges.find((b) => b.icon === "Cpu")?.label || (isLaptop ? "Intel Core / AMD Ryzen" : "Intel Core i5 / AMD Ryzen");
      const ram = badges.find((b) => b.icon === "Layers")?.label || "16GB RAM";
      const ssd = badges.find((b) => b.icon === "HardDrive")?.label || "SSD 512GB NVMe";
      const vga = badges.find((b) => b.icon === "Monitor" || b.icon === "CircuitBoard")?.label || "Card đồ họa";

      // Extract Mainboard from name if PC
      const mainMatch = name.match(/\b(B760M?\w*|B650M?\w*|H610M?\w*|Z790M?\w*|A520M?\w*|B550M?\w*)\b/i);
      const mainboard = mainMatch ? mainMatch[0].toUpperCase() : (isLaptop ? "Bo mạch tích hợp OEM chuẩn hãng" : "Bo mạch chủ Intel / AMD B760/B650");

      // Extract PSU
      const psuMatch = name.match(/\b(\d{3,4}\s*W)\b/i);
      const psu = psuMatch ? `Nguồn công suất thực ${psuMatch[0]}` : (isLaptop ? "Adapter sạc nhanh chính hãng theo máy" : "Nguồn công suất thực 550W - 750W 80 Plus");

      // Extract Cooler
      const coolerMatch = name.match(/\b(TẢN\s*KHÍ|TẢN\s*NƯỚC|AIO\s*\d+|TẢN\s*THÁP)\b/i);
      const cooler = coolerMatch ? coolerMatch[0] : (isLaptop ? "Hệ thống quạt làm mát kép Vapor Chamber" : "Tản nhiệt khí RGB / Tản nước AIO");

      // Extract Case / Display
      const caseMatch = name.match(/\b(CASE\s+[^/]+|CASE\s*BỂ\s*CÁ\w*)\b/i);
      const caseBox = caseMatch ? caseMatch[0] : (isLaptop ? "Khung nhôm nguyên khối cao cấp" : "Case Gaming kính cường lực LED RGB");

      return {
        type,
        isPCorLaptop: true,
        cpu,
        ram,
        ssd,
        vga,
        mainboard,
        psu,
        cooler,
        caseBox,
        display: isLaptop ? "15.6 inch FHD / 2K sắc nét 144Hz" : "Hỗ trợ xuất 4 màn hình 4K",
        items: [
          { name: "CPU / Bộ vi xử lý", detail: cpu, warranty: w },
          { name: "RAM / Bộ nhớ trong", detail: ram, warranty: w },
          { name: "Ổ cứng lưu trữ", detail: ssd, warranty: w },
          { name: "Card đồ họa (VGA)", detail: vga, warranty: w },
          { name: "Bo mạch chủ (Mainboard)", detail: mainboard, warranty: w },
          { name: "Nguồn máy tính (PSU)", detail: psu, warranty: w },
          { name: "Tản nhiệt (Cooling)", detail: cooler, warranty: w },
          { name: "Vỏ Case / Khung vỏ", detail: caseBox, warranty: w },
          { name: "Thương hiệu", detail: product.brand || (isLaptop ? "ASUS / Dell / Lenovo" : "DUDI SOFTWARE Build"), warranty: "-" },
          { name: "Tình trạng", detail: product.status === "out_of_stock" ? "Hết hàng" : "Còn hàng (Like New 99% / Mới 100%)", warranty: "-" },
        ],
        highlights: [
          { label: "CPU", value: cpu },
          { label: "RAM", value: ram },
          { label: "Ổ CỨNG", value: ssd },
          { label: "VGA", value: vga },
          { label: "MAINBOARD", value: mainboard },
          { label: "NGUỒN", value: psu },
          { label: "TẢN NHIỆT", value: cooler },
          { label: "VỎ CASE", value: caseBox },
        ]
      };
    }
  }
};
