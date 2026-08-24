import { contactRepository } from "../repositories/contactRepository.js";
import { ApiError } from "../utils/apiError.js";

export const contactService = {
  createContact: async (data) => {
    const { fullName, phone, email, message } = data;

    if (!fullName || !fullName.trim()) {
      throw new ApiError(400, "Vui lòng nhập họ và tên của bạn");
    }
    if (!phone || !phone.trim()) {
      throw new ApiError(400, "Vui lòng nhập số điện thoại liên hệ");
    }
    if (!message || !message.trim()) {
      throw new ApiError(400, "Vui lòng nhập nội dung tin nhắn hoặc nhu cầu tư vấn");
    }

    const createdContact = await contactRepository.create({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: (email || "").trim(),
      message: message.trim(),
      ipAddress: data.ipAddress || "",
    });

    // Tự động tạo thông báo Admin cho yêu cầu liên hệ / báo giá mới
    try {
      const { notificationService } = await import("./notificationService.js");
      await notificationService.createNotification({
        title: `Tin nhắn / Yêu cầu mới từ ${createdContact.fullName}`,
        message: `${createdContact.fullName} (${createdContact.phone}) đã gửi: "${createdContact.message.slice(0, 100)}${createdContact.message.length > 100 ? "..." : ""}"`,
        type: "contact",
        link: "/admin/settings",
        entityId: createdContact._id,
        entityType: "Contact",
        metadata: {
          fullName: createdContact.fullName,
          phone: createdContact.phone,
          email: createdContact.email,
        },
      });
    } catch (notifErr) {
      console.error("Lỗi khi tạo notification cho liên hệ mới:", notifErr);
    }

    return createdContact;
  },

  getContacts: async (params = {}) => {
    return await contactRepository.find({}, params);
  },
};
