const STATUS_LABEL = {
  in_stock: "Còn hàng",
  out_of_stock: "Hết hàng",
  pre_order: "Đặt trước",
};

const buildSpecifications = (product) => {
  if (product?.specifications?.length) {
    return product.specifications.map((item) => ({
      name: item.name,
      detail: item.value || item.detail || "-",
      warranty: item.warranty || product.warranty || "-",
    }));
  }

  return [
    {
      name: "Tên sản phẩm",
      detail: product?.name || "-",
      warranty: product?.warranty || "-",
    },
    {
      name: "Thương hiệu",
      detail: product?.brand || "ZCOMPUTER",
      warranty: product?.warranty || "-",
    },
    {
      name: "Danh mục",
      detail: product?.categoryName || "-",
      warranty: "-",
    },
    {
      name: "Tình trạng",
      detail: STATUS_LABEL[product?.status] || "Còn hàng",
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
