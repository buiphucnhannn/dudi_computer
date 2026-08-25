import { contactService } from "../services/contactService.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createContact = async (req, res, next) => {
  try {
    const contact = await contactService.createContact(req.body);

    const isFeedback = contact.type === "feedback";
    const msg = isFeedback
      ? "Cảm ơn bạn đã gửi góp ý & phản hồi cho DUDI SOFTWARE!"
      : "Gửi tin nhắn liên hệ thành công! Đội ngũ tư vấn sẽ liên hệ với bạn trong thời gian sớm nhất.";

    return res.status(201).json(new ApiResponse(201, contact, msg));
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const data = await contactService.getContacts(req.query);
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Lấy danh sách liên hệ & góp ý thành công"));
  } catch (error) {
    next(error);
  }
};

export const getContactStats = async (req, res, next) => {
  try {
    const stats = await contactService.getContactStats();
    return res
      .status(200)
      .json(new ApiResponse(200, stats, "Lấy thống kê liên hệ & góp ý thành công"));
  } catch (error) {
    next(error);
  }
};

export const updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await contactService.updateContactStatus(id, req.body);
    return res
      .status(200)
      .json(new ApiResponse(200, updated, "Cập nhật trạng thái liên hệ thành công"));
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await contactService.deleteContact(id);
    return res
      .status(200)
      .json(new ApiResponse(200, deleted, "Xóa liên hệ thành công"));
  } catch (error) {
    next(error);
  }
};
