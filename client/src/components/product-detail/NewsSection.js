const news = [
  {
    title:
      'Cách Kiểm Tra Laptop Cũ Từ A-Z: Mua Máy "Ngon" Không Sợ Bị Lừa',
    category: "Tin tức công nghệ",
    image: "/post-3.webp",
    href: "/news",
  },
  {
    title:
      "Cách Kiểm Tra Win Bản Quyền Hay Win Lậu Chính Xác 100%",
    category: "Thủ thuật máy tính",
    image: "/post-2.webp",
    href: "/news",
  },
  {
    title:
      "Mua Laptop Cũ Ở Đâu Uy Tín? 5 Lý Do Khách Hàng Tuyệt Đối Tin Tưởng DUDI SOFTWARE",
    category: "Về chúng tôi",
    image: "/post-1.webp",
    href: "/news",
  },
];

const NewsSection = () => {
  return (
    <section className="flex w-full flex-col gap-4">

      {/* Title */}
      <h2 className="flex items-center gap-2 text-lg font-extrabold leading-tight text-slate-900">
        <span className="h-6 w-1 shrink-0 rounded-sm bg-cyan-600" />
        <span>BÀI VIẾT - TIN TỨC</span>
      </h2>

      {/* News list */}
      <div className="flex flex-col gap-3">
        {news.map((item) => (
          <a
            href={item.href}
            key={item.title}
            className="
              group
              overflow-hidden
              rounded-xl
              border
              border-slate-200
              bg-white
              shadow-sm
              transition-all
              duration-300
              hover:border-red-600
              hover:shadow-md
            "
          >
            {/* Image */}
            <div className="h-28 w-full overflow-hidden bg-slate-100">
              <img
                src={item.image}
                alt={item.title}
                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-500
                  group-hover:scale-105
                "
              />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1.5 p-3">
              <h4
                className="
                  line-clamp-2
                  text-sm
                  font-semibold
                  leading-snug
                  text-slate-900
                  transition-colors
                  group-hover:text-red-600
                "
              >
                {item.title}
              </h4>

              <span
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-wide
                  text-slate-500
                "
              >
                {item.category}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;