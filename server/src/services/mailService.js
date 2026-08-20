import { Resend } from "resend";

class MailService {
  getResendClient() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new Resend(apiKey);
  }

  async sendPasswordResetOtp({ toEmail, userName, otp }) {
    const resend = this.getResendClient();
    const fromSender = process.env.EMAIL_FROM;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Khôi phục mật khẩu ZComputer</title>
</head>
<body style="margin: 0; padding: 20px 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
    <!-- Red Header Banner -->
    <div style="background-color: #dc2626; padding: 26px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">ZComputer</h1>
    </div>

    <!-- Body Content -->
    <div style="padding: 32px 28px 24px 28px; color: #1f2937; font-size: 14px; line-height: 1.6;">
      <p style="margin-top: 0; font-size: 15px; color: #111827;">Xin chào <strong>${userName || "Quý khách"}</strong>,</p>
      
      <p style="color: #4b5563; margin-bottom: 24px;">
        Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã xác nhận (OTP) dưới đây để tiếp tục quá trình:
      </p>

      <!-- OTP Box with dashed red border -->
      <div style="margin: 28px 0; padding: 18px 12px; border: 2px dashed #dc2626; border-radius: 12px; text-align: center; background-color: #fef2f2;">
        <span style="font-size: 32px; font-weight: 900; letter-spacing: 12px; color: #dc2626; font-family: 'Courier New', Courier, monospace; display: inline-block; padding-left: 12px;">${otp}</span>
      </div>

      <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
        Mã này có hiệu lực trong <strong style="color: #dc2626;">10 phút</strong>. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này để bảo vệ tài khoản.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding: 22px 24px; background-color: #f9fafb; border-top: 1px solid #f3f4f6; text-align: center; font-size: 12px; color: #6b7280; line-height: 1.6;">
      <p style="margin: 0 0 6px 0; font-weight: 500;">Cảm ơn bạn đã tin tưởng <strong>ZComputer</strong>.</p>
      <p style="margin: 0 0 10px 0;">
        Email: <a href="mailto:zcomputervn.cskh@gmail.com" style="color: #dc2626; text-decoration: none; font-weight: 600;">zcomputervn.cskh@gmail.com</a> | Hotline: <strong>0977 334 415</strong>
      </p>
      <p style="margin: 0; font-size: 11px; color: #9ca3af;">© 2026 ZComputer. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

    if (!resend) {
      throw new Error(
        "Chưa cấu hình RESEND_API_KEY trong file server/.env"
      );
    }

    try {
      const response = await resend.emails.send({
        from: fromSender,
        to: toEmail,
        subject: `[ZComputer] Mã xác nhận đặt lại mật khẩu: ${otp}`,
        html: htmlContent,
      });

      return { success: true, data: response };
    } catch (error) {
      console.error("Resend send email error:", error);
      throw new Error(error.message || "Lỗi khi gửi email xác nhận qua Resend");
    }
  }
}

export const mailService = new MailService();
