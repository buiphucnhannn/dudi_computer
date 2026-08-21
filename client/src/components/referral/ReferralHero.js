import { ArrowRight, Megaphone, Wallet, Computer, Laptop } from "lucide-react";

const avatars = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDQTH9xSgmvSFnImI9heggmze55LtWXIavekaXqV5dlIrtI0z-XWFHLPvth9sllzfTIskLGo62RnKuvkVQ9XlHbrrsq7NiN1NFdKZ1MciN6HwOTukUaW_DfVNrgI-qBcYOhzXe119mF-0bnqHV58BnIMSFwo4sXFbLtCQ1PZZlVULJsNlc2VsL8g9x6UhTruTN24EuHvQGeLWtsKgl8TPiPVQoXjcHk7FBIic4zGoKilbgNwcFu7zfHkQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB9gsQnYTpzbAwiq_XEbmSRmZhk8jlH2CKiFq5Cckrlk6lR7Lk786lBH0Y5zc99kbuIQQMy0CulLWahvMx0U9wJC8rUlJf5h0dw14lbnJ1AJ3QjzYysR3RHRzwnJ8cuu4B3FAtFBgoMWkcg7VOvXhakKiJdUJj27-gRkTRVC_qlEUQcfFzSNqgtnuSDadZ9FOp6kAQ8UpyKrf_lXtwBMt_-nQyb3lkbc6JpduRn3DLOQeLha1hmclJt1A",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ5SRKscxHY1vsI--lqknp7fdZyQoDEwWf9SM0VKtaoTbpsLRClVRrvBPyZL4bsGXxRdaSA3148_Lv-ZLx72zKtF7rLdEjSQM6nlfx7nzBon3TZLsWK-JVFrLEiw0VrmmwgbfUUJ5fyr3ZAUHN2kOs1OdMLiiINvuJIWXF7zUEAchn-4mybLPSPacE3vMY3suYVo5LC0GeCUVHAPr9Lcl6PnOOTyy-1ASMdDx27y3L_HGNU1_z0JdqVA",
];

const ReferralHero = () => {
  return (
    <section className="relative overflow-hidden bg-white pb-16">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="h-full w-full bg-cover bg-center opacity-40 mix-blend-luminosity"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida/AP1WRLuimnoN-LS4KGVhS_qYtI-dulbsP-yYSxNkSRrJXUJMpe6ydnQzinPa3CcTwiaOSwK5bi4a0nBB1rE433jmZDM9-xTZK_sYVHLkR3-Z_tSoYtd6OD5gMwmbnWQsANGVJXK9CP-14umndKqUJWJWRYz786h56aO4yZhtjNL295x9TKdnqRz6f1FmqmqNBx-RragMZyUZ4mBXCG93PE3l1T3Bbj61FLP6fRqGFM-ObXWlEToHu3-Qq3wZJ9dw')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 pb-8 pt-12 md:px-8 md:pt-24 lg:pt-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex self-start items-center gap-2 rounded-full bg-red-600/10 px-4 py-2 text-red-700 ring-1 ring-red-600/30">
              <Megaphone className="h-[18px] w-[18px]" />

              <span className="text-xs font-bold uppercase tracking-widest">
                Chương Trình Đối Tác
              </span>
            </div>

            <h1 className="text-4xl font-extrabold uppercase leading-tight text-slate-900 md:text-5xl lg:text-6xl">
              Giới Thiệu Bạn Hiền
              <br />
              <span className="bg-gradient-to-r from-red-700 to-red-500 bg-clip-text text-transparent">
                Nhận Lì Xì Liền!
              </span>
            </h1>

            <p className="max-w-xl text-base leading-6 text-slate-500 md:text-lg">
              Trở thành đối tác của DUDI SOFTWARE ngay hôm nay. Giới thiệu bạn bè
              mua sắm PC, Laptop thành công và nhận ngay hoa hồng tiền mặt lên
              đến <span className="font-bold text-red-700">500.000 VNĐ</span>{" "}
              cho mỗi đơn hàng. Không giới hạn số lượng!
            </p>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              <button className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-sm bg-red-700 px-8 py-4 font-bold uppercase tracking-wider text-white transition hover:bg-red-800">
                <span className="relative z-10">Liên Hệ Tư Vấn Ngay</span>

                <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>

              <button className="rounded-sm border border-slate-300 px-8 py-4 font-bold uppercase tracking-wider text-slate-900 transition hover:border-red-700 hover:text-red-700">
                Xem Thể Lệ
              </button>
            </div>

            {/* Users */}
            <div className="mt-8 flex items-center gap-6 border-t border-slate-200 pt-8">
              <div className="flex -space-x-4">
                {avatars.map((avatar) => (
                  <div
                    key={avatar}
                    className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-slate-200"
                  >
                    <img
                      src={avatar}
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}

                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-xs font-bold">
                  +1K
                </div>
              </div>

              <p className="text-sm text-slate-500">
                <strong className="text-slate-900">1,000+</strong> người đã tham
                gia
              </p>
            </div>
          </div>

          {/* Earnings Card */}
          <div className="relative hidden min-h-[500px] lg:block">
            <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-8 shadow-2xl backdrop-blur-sm">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-600/20 blur-3xl" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Total Earnings
                    </p>

                    <p className="mt-1 text-4xl font-extrabold tracking-tight text-red-700">
                      12.500.000₫
                    </p>
                  </div>

                  <Wallet className="h-10 w-10 text-red-700 opacity-50" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-100/70 p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded bg-white">
                        <Computer className="h-6 w-6" />
                      </div>

                      <div>
                        <p className="font-semibold">PC Gaming Custom</p>

                        <p className="text-sm text-slate-500">
                          Giới thiệu: Trần Văn A
                        </p>
                      </div>
                    </div>

                    <p className="font-bold text-red-700">+200.000₫</p>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-100/70 p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded bg-white">
                        <Laptop className="h-6 w-6" />
                      </div>

                      <div>
                        <p className="font-semibold">Laptop Workstation</p>

                        <p className="text-sm text-slate-500">
                          Giới thiệu: Nguyễn Thị B
                        </p>
                      </div>
                    </div>

                    <p className="font-bold text-red-700">+500.000₫</p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 rounded-lg border border-red-700/30 bg-slate-100/80 p-6 text-center backdrop-blur-md">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-red-700">
                  Trạng thái thanh toán
                </p>

                <div className="flex items-center justify-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
                  </span>

                  <span className="font-semibold">
                    Đã chuyển khoản trong 24h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReferralHero;
