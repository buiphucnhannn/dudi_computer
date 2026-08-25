import { contactRepository } from "../repositories/contactRepository.js";
import { ApiError } from "../utils/apiError.js";

export const contactService = {
  createContact: async (data) => {
    const fullName = (data.fullName || "").trim();
    const rawPhone = (data.phone || "").trim();
    const phone = rawPhone.replace(/[\s.-]/g, "").replace(/^\+84/, "0");
    const email = (data.email || "").trim().toLowerCase();
    const message = (data.message || data.content || "").trim();
    const type = data.type === "feedback" ? "feedback" : "contact";
    const subject = (data.subject || "").trim();

    // 1. Họ và tên
    if (!fullName) {
      throw new ApiError(400, "Vui lòng nhập họ và tên của bạn");
    }
    if (fullName.length < 2) {
      throw new ApiError(400, "Họ và tên quá ngắn. Vui lòng nhập tối thiểu 2 ký tự");
    }
    if (fullName.length > 100) {
      throw new ApiError(400, "Họ và tên không được vượt quá 100 ký tự");
    }

    // 2. Số điện thoại
    if (!phone) {
      throw new ApiError(400, "Vui lòng nhập số điện thoại liên hệ");
    }
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      throw new ApiError(
        400,
        "Số điện thoại không hợp lệ (cần đúng 10 số di động đầu 03, 05, 07, 08, 09)"
      );
    }

    // 3. Email (Không bắt buộc, nhưng nếu có thì phải chuẩn)
    if (email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        throw new ApiError(400, "Địa chỉ email không đúng định dạng hợp lệ");
      }
    }

    // 4. Nội dung tin nhắn / góp ý
    if (!message) {
      throw new ApiError(
        400,
        type === "feedback"
          ? "Vui lòng nhập nội dung bạn muốn góp ý"
          : "Vui lòng nhập nội dung tin nhắn hoặc nhu cầu tư vấn"
      );
    }
    if (message.length < 6) {
      throw new ApiError(400, "Nội dung quá ngắn. Vui lòng nhập tối thiểu 6 ký tự");
    }
    if (message.length > 3000) {
      throw new ApiError(400, "Nội dung không được vượt quá 3000 ký tự");
    }

    const createdContact = await contactRepository.create({
      fullName,
      phone,
      email,
      message,
      type,
      subject,
      status: "pending",
    });

    // Tự động tạo thông báo Admin cho liên hệ / góp ý mới
    try {
      const { notificationService } = await import("./notificationService.js");
      const isFeedback = type === "feedback";
      await notificationService.createNotification({
        title: isFeedback
          ? `Góp ý & Phản hồi mới từ ${createdContact.fullName}`
          : `Yêu cầu liên hệ / tư vấn từ ${createdContact.fullName}`,
        message: `${createdContact.fullName} (${createdContact.phone}) đã gửi: "${createdContact.message.slice(0, 100)}${createdContact.message.length > 100 ? "..." : ""}"`,
        type: isFeedback ? "feedback" : "contact",
        link: "/admin/contacts",
        entityId: createdContact._id,
        entityType: "Contact",
        metadata: {
          fullName: createdContact.fullName,
          phone: createdContact.phone,
          email: createdContact.email,
          type: createdContact.type,
        },
      });
    } catch (notifErr) {
      console.error("Lỗi khi tạo notification cho liên hệ mới:", notifErr);
    }

    return createdContact;
  },

  getContacts: async (params = {}) => {
    const { page, limit, type, status, search } = params;
    return await contactRepository.find(
      { type, status, search },
      { page, limit }
    );
  },

  getContactStats: async () => {
    return await contactRepository.getStats();
  },

  updateContactStatus: async (id, { status, note }) => {
    if (status && !["pending", "contacted", "resolved"].includes(status)) {
      throw new ApiError(400, "Trạng thái không hợp lệ");
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (note !== undefined) updateData.note = note.trim();

    const updated = await contactRepository.updateById(id, updateData);
    if (!updated) {
      throw new ApiError(404, "Không tìm thấy thông tin liên hệ / góp ý");
    }

    return updated;
  },

  deleteContact: async (id) => {
    const deleted = await contactRepository.deleteById(id);
    if (!deleted) {
      throw new ApiError(404, "Không tìm thấy thông tin liên hệ cần xóa");
    }
    return deleted;
  },
};
