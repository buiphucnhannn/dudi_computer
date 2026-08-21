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

    return await contactRepository.create({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: (email || "").trim(),
      message: message.trim(),
      ipAddress: data.ipAddress || "",
    });
  },

  getContacts: async (params = {}) => {
    return await contactRepository.find({}, params);
  },
};
