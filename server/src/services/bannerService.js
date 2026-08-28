import { bannerRepository } from "../repositories/bannerRepository.js";
import { ApiError } from "../utils/apiError.js";
import { sessionManager } from "../utils/sessionManager.js";

const DEFAULT_BANNERS = [
  // 1. Hero Carousel (Slider đầu trang chủ)
  {
    title: "Banner Hero 1 - Siêu phẩm PC Gaming ZComputer",
    imageUrl: "https://zcomputer.vn/uploads/image-1784730915598-869631355.webp",
    link: "/product",
    position: "hero_slider",
    order: 1,
    isActive: true,
    description: "Slide giới thiệu PC Gaming thế hệ mới",
  },
  {
    title: "Banner Hero 2 - Laptop Gaming & Đồ họa",
    imageUrl: "https://zcomputer.vn/uploads/image-1784727646608-314735893.webp",
    link: "/product",
    position: "hero_slider",
    order: 2,
    isActive: true,
    description: "Slide laptop gaming hiệu năng cao",
  },
  {
    title: "Banner Hero 3 - Trả góp 0% linh hoạt",
    imageUrl: "https://zcomputer.vn/uploads/image-1784723786956-517954066.webp",
    link: "/installment-guide",
    position: "hero_slider",
    order: 3,
    isActive: true,
    description: "Slide hướng dẫn mua sắm trả góp",
  },
  {
    title: "Banner Hero 4 - Linh kiện máy tính chính hãng",
    imageUrl: "https://zcomputer.vn/uploads/image-1785249221437-528368707.webp",
    link: "/product",
    position: "hero_slider",
    order: 4,
    isActive: true,
    description: "Slide linh kiện PC",
  },
  {
    title: "Banner Hero 5 - Ưu đãi giảm sốc trong tháng",
    imageUrl: "https://zcomputer.vn/uploads/image-1784731172192-558618536.webp",
    link: "/product",
    position: "hero_slider",
    order: 5,
    isActive: true,
    description: "Slide khuyến mãi",
  },
  {
    title: "Banner Hero 6 - Dịch vụ bảo hành siêu tốc",
    imageUrl: "https://zcomputer.vn/uploads/image-1784727158263-712835383.webp",
    link: "/warranty-policy",
    position: "hero_slider",
    order: 6,
    isActive: true,
    description: "Slide chính sách bảo hành",
  },

  // 2. Promo Grid (3 Khung ảnh khuyến mãi dưới Slider)
  {
    title: "Khuyến mãi Back To School",
    imageUrl: "https://zcomputer.vn/uploads/image-1783241558898-515012004.webp",
    link: "/back-to-school",
    position: "promo_grid",
    order: 1,
    isActive: true,
    description: "Ô 1: Khuyến mãi mùa tựu trường",
  },
  {
    title: "Thu cũ đổi mới - Lên đời cực dễ",
    imageUrl: "https://zcomputer.vn/uploads/image-1783241574331-418008867.webp",
    link: "/trade-in",
    position: "promo_grid",
    order: 2,
    isActive: true,
    description: "Ô 2: Chương trình trợ giá thu cũ đổi mới",
  },
  {
    title: "Giới thiệu bạn bè - Nhận quà liền tay",
    imageUrl: "https://zcomputer.vn/uploads/image-1783241586922-863037014.webp",
    link: "/referral",
    position: "promo_grid",
    order: 3,
    isActive: true,
    description: "Ô 3: Chương trình giới thiệu người quen",
  },

  // 3. Popup Khuyến mãi khi vào Web
  {
    title: "Popup Chào mừng - Back To School 2026",
    imageUrl: "/back-to-school-popup.webp",
    link: "/back-to-school",
    position: "popup",
    order: 1,
    isActive: true,
    description: "Popup thông báo khuyến mãi mở khi vào trang",
  },
];

export const bannerService = {
  // Tự động seed dữ liệu mặc định nếu collection rỗng
  seedInitialBannersIfEmpty: async () => {
    try {
      const count = await bannerRepository.count();
      if (count === 0) {
        await bannerRepository.insertMany(DEFAULT_BANNERS);
        console.log("--> Đã tự động khởi tạo dữ liệu Banner mặc định cho website.");
      }
    } catch (err) {
      console.error("Lỗi khi seed Banner:", err);
    }
  },

  getBanners: async (filters = {}) => {
    // Đảm bảo có dữ liệu trước khi trả về
    await bannerService.seedInitialBannersIfEmpty();
    return await bannerRepository.find(filters);
  },

  getBannersByPosition: async (position, onlyActive = true) => {
    await bannerService.seedInitialBannersIfEmpty();
    const allPositionBanners = await bannerRepository.find({ position });

    if (!onlyActive) {
      return allPositionBanners;
    }

    // Đối với Popup: Nếu TẠM ẨN thì KHÔNG HIỆN luôn
    if (position === "popup") {
      return allPositionBanners.filter((b) => b.isActive);
    }

    // Đối với Hero Slider, 3 Khung Khuyến Mãi và Banner Trang Sản Phẩm:
    // Nếu ô nào tạm ẩn -> trả về thông tin mặc định DUDI SOFTWARE
    return allPositionBanners.map((banner, idx) => {
      const bObj = banner.toObject ? banner.toObject() : banner;
      if (bObj.isActive) {
        return bObj;
      }

      return {
        ...bObj,
        title: "DUDI SOFTWARE - PC & Laptop Gaming Cao Cấp",
        imageUrl: "/images/dudi/dudi_showroom_hero.webp",
        link: "/tat-ca-san-pham",
        isDefaultFallback: true,
      };
    });
  },

  getBannerById: async (id) => {
    const banner = await bannerRepository.findById(id);
    if (!banner) {
      throw new ApiError(404, "Không tìm thấy banner yêu cầu");
    }
    return banner;
  },

  createBanner: async (data) => {
    const title = (data.title || "").trim();
    const imageUrl = (data.imageUrl || "").trim();
    const position = data.position || "hero_slider";

    if (!title) {
      throw new ApiError(400, "Vui lòng nhập tên hoặc tiêu đề cho banner");
    }
    if (!imageUrl) {
      throw new ApiError(400, "Vui lòng tải ảnh lên hoặc nhập đường dẫn ảnh hợp lệ");
    }

    const order = Number(data.order) || 1;
    const isActive = data.isActive !== undefined ? Boolean(data.isActive) : true;

    return await bannerRepository.create({
      title,
      imageUrl,
      publicId: data.publicId || "",
      link: (data.link || "/").trim(),
      position,
      order,
      isActive,
      description: (data.description || "").trim(),
    });
  },

  updateBanner: async (id, data) => {
    const existing = await bannerRepository.findById(id);
    if (!existing) {
      throw new ApiError(404, "Không tìm thấy banner để cập nhật");
    }

    const updateData = {};
    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl.trim();
    if (data.publicId !== undefined) updateData.publicId = data.publicId;
    if (data.link !== undefined) updateData.link = data.link.trim();
    if (data.position !== undefined) updateData.position = data.position;
    if (data.order !== undefined) updateData.order = Number(data.order);
    if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);
    if (data.description !== undefined) updateData.description = data.description.trim();

    const updated = await bannerRepository.updateById(id, updateData);
    if (updateData.isActive !== undefined) {
      sessionManager.broadcastResourceUpdate({
        action: updated.isActive ? "publish" : "hide",
        resourceType: "banner",
        id: updated._id,
        name: updated.title,
        message: updated.isActive ? "Banner quảng cáo đã được bật hiển thị." : "Banner quảng cáo đã được tạm ẩn.",
      });
    }
    return updated;
  },

  toggleBannerStatus: async (id) => {
    const existing = await bannerRepository.findById(id);
    if (!existing) {
      throw new ApiError(404, "Không tìm thấy banner để đổi trạng thái");
    }

    const updated = await bannerRepository.updateById(id, {
      isActive: !existing.isActive,
    });

    sessionManager.broadcastResourceUpdate({
      action: updated.isActive ? "publish" : "hide",
      resourceType: "banner",
      id: updated._id,
      name: updated.title,
      message: updated.isActive ? "Banner quảng cáo đã được bật hiển thị." : "Banner quảng cáo đã được tạm ẩn.",
    });

    return updated;
  },

  deleteBanner: async (id) => {
    throw new ApiError(
      400,
      "Banner không hỗ trợ xóa trực tiếp để bảo toàn cấu trúc giao diện hệ thống. Quản trị viên vui lòng chuyển sang trạng thái Tạm ẩn (Ẩn banner)."
    );
  },
};
