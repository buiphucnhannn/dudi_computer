import { MessageCircle } from "lucide-react";

const ReferralCTA = () => {
  return (
    <section className="relative overflow-hidden border-y border-slate-200 bg-slate-100 py-24">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDxIlT7Mv0CCm6KltLkkGfH5WLtHo0F9qX35643rucbGN3clYdyNob2PDJlzXIxC-_C-R1_CIBZIBOksmrID9kkJv7h3UXJlXQ1lgMZeSSyZVQq8cfK4U91TOf8L7_tLlkEvC-nEp8xjRK3DuT473RicS3yavtRNgBIjWDYkgvMnceCEs_loyQQujM8M6jwCzWSTdB8zA_pbQqCPzwIbIpQmVE6e2UrJNQiL6GKB9iah_FWdsMNq8jMXQ')",
        }}
      />

      <div className="absolute inset-0 bg-slate-100/80 backdrop-blur-sm" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 text-center">
        <h2 className="text-4xl font-extrabold uppercase md:text-5xl">
          Bắt Đầu <span className="text-red-700">Kiếm Tiền</span> Ngay Hôm Nay
        </h2>

        <p className="max-w-2xl text-base leading-6 text-slate-500 md:text-lg">
          Kết nối với đội ngũ hỗ trợ của DUDI SOFTWARE qua Zalo để đăng ký đối tác
          và bắt đầu gửi thông tin khách hàng. Cơ hội gia tăng thu nhập không
          giới hạn đang chờ bạn!
        </p>

        <button className="flex items-center justify-center gap-3 rounded-sm bg-red-700 px-12 py-5 text-lg font-bold uppercase tracking-wider text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-red-800">
          <MessageCircle className="h-7 w-7" />
          Liên Hệ Zalo Ngay
        </button>
      </div>
    </section>
  );
};

export default ReferralCTA;
