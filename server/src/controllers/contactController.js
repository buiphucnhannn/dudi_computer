import { contactService } from "../services/contactService.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createContact = async (req, res, next) => {
  try {
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const contact = await contactService.createContact({
      ...req.body,
      ipAddress,
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        contact,
        "Gửi tin nhắn liên hệ thành công! Đội ngũ ZCOMPUTER sẽ liên hệ bạn sớm nhất."
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const data = await contactService.getContacts(req.query);
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Lấy danh sách liên hệ thành công"));
  } catch (error) {
    next(error);
  }
};
