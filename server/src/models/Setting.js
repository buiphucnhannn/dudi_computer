import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "system_config",
      unique: true,
      index: true,
    },
    // Thông tin cửa hàng & Website
    storeInfo: {
      storeName: {
        type: String,
        default: "DUDI SOFTWARE - PC & Laptop Gaming",
      },
      hotline: {
        type: String,
        default: "(+84) 909 163 821",
      },
      technicalHotline: {
        type: String,
        default: "1900 6868",
      },
      supportEmail: {
        type: String,
        default: "support@dudisoftware.vn",
      },
      address: {
        type: String,
        default: "Cơ sở 1: 123 Cách Mạng Tháng 8, P.10, Q.3, TP.HCM",
      },
      showroom2: {
        type: String,
        default: "Cơ sở 2: 456 Nguyễn Thị Minh Khai, P.5, Q.1, TP.HCM",
      },
      openingHours: {
        type: String,
        default: "08:00 - 21:30 (Cả Thứ 7, Chủ Nhật và Ngày Lễ)",
      },
      slogan: {
        type: String,
        default: "Hiệu năng bứt phá - Đồng hành cùng game thủ & Creator",
      },
    },
    // Cấu hình thanh toán & Ngân hàng
    paymentConfig: {
      enableCOD: {
        type: Boolean,
        default: true,
      },
      enableBanking: {
        type: Boolean,
        default: true,
      },
      bankName: {
        type: String,
        default: "MB Bank (Ngân hàng Quân Đội)",
      },
      accountNumber: {
        type: String,
        default: "0909163821",
      },
      accountHolder: {
        type: String,
        default: "DUDI SOFTWARE CO LTD",
      },
      bankBranch: {
        type: String,
        default: "Chi nhánh TP.HCM",
      },
      qrTransferSyntax: {
        type: String,
        default: "THANHTOAN [MADON]",
      },
    },
    // Cấu hình vận chuyển & giao hàng
    shippingConfig: {
      defaultShippingFee: {
        type: Number,
        default: 0,
      },
      freeShippingThreshold: {
        type: Number,
        default: 500000,
      },
      estimatedDeliveryDays: {
        type: String,
        default: "1 - 3 ngày làm việc (Nội thành: Giao siêu tốc 2h)",
      },
      allowExpressDelivery: {
        type: Boolean,
        default: true,
      },
    },
    // Cấu hình thông báo & Cảnh báo kho
    notificationConfig: {
      emailOnNewOrder: {
        type: Boolean,
        default: true,
      },
      alertLowStock: {
        type: Boolean,
        default: true,
      },
      lowStockThreshold: {
        type: Number,
        default: 3,
      },
      enableSoundAlert: {
        type: Boolean,
        default: true,
      },
      adminAlertEmail: {
        type: String,
        default: "admin@dudisoftware.vn",
      },
    },
    // Cấu hình bảo trì & Hệ thống
    systemConfig: {
      maintenanceMode: {
        type: Boolean,
        default: false,
      },
      maintenanceNotice: {
        type: String,
        default: "Hệ thống đang bảo trì định kỳ để nâng cấp dịch vụ. Vui lòng quay lại sau ít phút!",
      },
      maxUploadSizeMB: {
        type: Number,
        default: 10,
      },
      autoBackupDaily: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Setting = mongoose.model("Setting", settingSchema);
