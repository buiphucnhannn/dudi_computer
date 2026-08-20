import { CreditCard } from "lucide-react";

const paymentMethods = [
  {
    name: "VISA",
    className: "text-gray-900",
  },
  {
    name: "mastercard",
    className: "text-red-600",
  },
  {
    name: "JCB",
    className: "text-blue-600",
  },
  {
    name: (
      <>
        VNPAY<span className="text-blue-600">QR</span>
      </>
    ),
    className: "text-red-600",
  },
  {
    name: (
      <>
        Zalo<span className="text-blue-700">pay</span>
      </>
    ),
    className: "text-sky-600",
  },
  {
    name: "napas",
    className: "text-blue-700",
  },
];

const installmentMethods = [
  {
    name: "HD SAISON",
    className: "text-red-700",
  },
  {
    name: "MIRAE ASSET",
    className: "text-orange-600",
  },
  {
    name: "Kredivo",
    className: "text-sky-500",
  },
];

export default function PaymentSupport() {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
      {/* Thanh toán */}
      <div className="flex items-center gap-2 mb-3">
        <CreditCard className="w-4 h-4 text-red-600" />

        <h4 className="font-bold text-sm uppercase text-slate-900">
          Hỗ trợ thanh toán
        </h4>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {paymentMethods.map((method, index) => (
          <div
            key={index}
            className="h-9 bg-white border border-slate-200 rounded-lg px-2 flex items-center justify-center shadow-sm"
          >
            <span
              className={`text-[9px] sm:text-[10px] font-black ${method.className}`}
            >
              {method.name}
            </span>
          </div>
        ))}
      </div>

      {/* Trả góp */}
      <h4 className="font-bold text-sm mb-3 uppercase border-t border-slate-200 pt-4">
        Hỗ trợ trả góp
      </h4>

      <div className="grid grid-cols-3 gap-2">
        {installmentMethods.map((method, index) => (
          <div
            key={index}
            className="h-9 bg-white border border-slate-200 rounded-lg px-1.5 flex items-center justify-center shadow-sm"
          >
            <span
              className={`text-[8px] sm:text-[9px] font-bold text-center ${method.className}`}
            >
              {method.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}