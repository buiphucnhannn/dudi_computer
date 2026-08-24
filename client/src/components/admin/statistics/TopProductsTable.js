"use client";

import { ArrowRight } from "lucide-react";

const products = [
  {
    name: "ASUS ROG Strix GeForce RTX™ 4090 OC",
    category: "VGA / Đen",
    code: "ROG-STRIX-4090",
    price: "₫52.990.000",
    progress: 85,
    sold: 142,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAX-qBsKDKwq1RUhddWglYHWG0t1D9X5tWtdmBaf9uka3zgUqTYivIZD9CvxJwpVYuPxeqwhkBD_RbaYizRpkJTKnTJcRRHvt8fdeG6rYqS-p_RvdGFx7cIIYE5dqr1uuusubdRDpngk_z5hm43eTT_Za74XJNIr1q8nU-Ga0inEtY80HjQwSSEi4F7YeWWY6J9y2xOhg07HIviVi_xRMVspxhNO7bfz8sSFWbDaM3NbCLYIMvjqCdF",
  },
  {
    name: "Intel Core i9-14900K",
    category: "CPU / LGA 1700",
    code: "BX8071514900K",
    price: "₫15.490.000",
    progress: 72,
    sold: 98,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDxAD-C4PFzhojyEidjbFEudUBwu_MSdnxetxXa1llv3OzdTN1Brdwrz6c4WSPXqsoxpng7AIOSZAuaYCozhRIis5Dge24yEL5FJi6XKTWZxC4EtBxRSAoTEKgBjlITlmGdJlBkIQOyrgouU1A6srKxwX5_l-fwMNAnEBEJrU8pxbqPmAvmC2ghTZ7_Sbu0RajFJYhUD1VQYTglPdArggLCInJBvaR65DWrOxlKtNclTkso0jyKUF47",
  },
  {
    name: "MSI MEG Z790 GODLIKE MAX",
    category: "Mainboard / E-ATX",
    code: "MEG-Z790-GL-M",
    price: "₫31.990.000",
    progress: 45,
    sold: 45,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAxGW6Bu4cyBT0iG3I2wS1NRvBeD2chTbMf2tIr2q9nspQmgIHyKL6SOusaot2IUXE_QJmGQiJzsjHJppDupI9UZcajAyKtLWAK1T9m3uM5P6Xamv4MmKQfwsBr1K7MZlcGhthjQhJHwHdIp8KmqSdnVQZx6FlcaCFeh3G8GfB2b45Q0ZE2jfX537GlKtA_K5M-0_ao4i4RFZQM7qxkaWPz8z2Fsw9CqF2GnfRE13YU_PyZVl7DLPq9",
  },
  {
    name: "Corsair Dominator Titanium 64GB DDR5",
    category: "RAM / 6000MHz",
    code: "CMP64GX5M2B6000C30",
    price: "₫9.290.000",
    progress: 60,
    sold: 76,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAklNfxjma_HSvDzweJHbSxVoh74qbz_f9zF8_1QoXWOEcRMUUndULvzWpz2pJyicozcIdqLsZl8ipw4IduZhmnSvCDttLq_Ifu0FJV5eO1_0VtsGR7FcfOMieiqNibr6egvv6E09iRrN253QNZ1N0M6sk0EHpdxK7XEhMPsVer59IxArDrTwp9EfNx-JCLauh40Uxs7FEtnqKAklff8ymzoWlaSQDpsB5arNPOkVjOEuXUsCE450VV",
  },
];

export default function TopProductsTable() {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
      {/* Header */}
      <div className="p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-slate-150">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Top Sản phẩm bán chạy
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Danh sách linh kiện và cấu hình có doanh số cao nhất
          </p>
        </div>

        <button className="text-red-600 hover:text-red-700 text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer">
          <span>Xem tất cả</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/90 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="py-3.5 px-6 font-bold">Sản Phẩm</th>
              <th className="py-3.5 px-4 font-bold w-36">Mã SP</th>
              <th className="py-3.5 px-4 font-bold w-36">Giá Bán</th>
              <th className="py-3.5 px-4 font-bold w-48">Tiến Độ (Mục tiêu)</th>
              <th className="py-3.5 px-6 font-bold text-right w-28">Đã Bán</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-150 text-sm">
            {products.map((product, index) => (
              <tr
                key={product.code}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer"
              >
                {/* Product */}
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 p-1">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate max-w-[280px]">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {product.category}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Code */}
                <td className="py-3.5 px-4 text-xs font-medium text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-[10.5px] font-bold text-slate-700">
                    {product.code}
                  </span>
                </td>

                {/* Price */}
                <td className="py-3.5 px-4 text-xs font-black text-slate-900">
                  {product.price}
                </td>

                {/* Progress */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          index === 0
                            ? "bg-slate-900"
                            : index === 1
                            ? "bg-red-600"
                            : "bg-blue-600"
                        }`}
                        style={{
                          width: `${product.progress}%`,
                        }}
                      />
                    </div>

                    <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap">
                      {product.progress}%
                    </span>
                  </div>
                </td>

                {/* Sold */}
                <td className="py-3.5 px-6 text-right">
                  <span className="text-base font-black text-slate-900">
                    {product.sold}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium ml-1">cái</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}