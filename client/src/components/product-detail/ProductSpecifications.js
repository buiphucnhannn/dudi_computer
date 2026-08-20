import { parseProductSpecs } from "@/lib/specParser";

const buildSpecifications = (product) => {
  const specs = parseProductSpecs(product);
  const w = product?.warranty || "Bảo hành 3 - 12 Tháng";

  return [
    {
      name: "CPU / Bộ vi xử lý",
      detail: specs.cpu,
      warranty: w,
    },
    {
      name: "RAM / Bộ nhớ trong",
      detail: specs.ram,
      warranty: w,
    },
    {
      name: "Ổ cứng lưu trữ",
      detail: specs.ssd,
      warranty: w,
    },
    {
      name: "Card đồ họa (VGA)",
      detail: specs.vga,
      warranty: w,
    },
    {
      name: "Bo mạch chủ (Mainboard)",
      detail: specs.mainboard,
      warranty: w,
    },
    {
      name: "Nguồn máy tính (PSU)",
      detail: specs.psu,
      warranty: w,
    },
    {
      name: "Tản nhiệt (Cooling)",
      detail: specs.cooler,
      warranty: w,
    },
    {
      name: "Vỏ Case / Khung vỏ",
      detail: specs.caseBox,
      warranty: w,
    },
    {
      name: "Màn hình / Hiển thị",
      detail: specs.display,
      warranty: w,
    },
    {
      name: "Thương hiệu",
      detail: specs.brand,
      warranty: "-",
    },
    {
      name: "Tình trạng",
      detail: specs.status,
      warranty: "-",
    },
  ];
};

const ProductSpecifications = ({ product }) => {
  const specifications = buildSpecifications(product);

  return (
    <div
      id="specifications"
      className="lg:col-span-2 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-200"
    >
      <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
        <span className="w-2 h-8 bg-red-600 rounded-sm" />
        Đặc điểm nổi bật
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="py-4 px-4 font-semibold text-slate-900 uppercase w-1/4">
                Tên Gọi
              </th>

              <th className="py-4 px-4 font-semibold text-slate-900 uppercase w-1/2">
                Tên Chi Tiết
              </th>

              <th className="py-4 px-4 font-semibold text-slate-900 uppercase w-1/4 text-right">
                Bảo Hành
              </th>
            </tr>
          </thead>

          <tbody className="text-base text-slate-500">
            {specifications.map((item) => (
              <tr
                key={item.name}
                className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <td className="py-5 px-4 font-mono font-bold text-slate-900">
                  {item.name}
                </td>

                <td className="py-5 px-4">{item.detail}</td>

                <td className="py-5 px-4 text-right font-mono">{item.warranty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductSpecifications;
