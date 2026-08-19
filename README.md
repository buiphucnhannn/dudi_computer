# 🖥️ ZCOMPUTER.VN CLONE (Fullstack JavaScript)

Dự án clone website thương mại điện tử chuyên máy tính & linh kiện [zcomputer.vn](https://zcomputer.vn/), sử dụng kiến trúc tách biệt **Backend (Express.js REST API)** và **Frontend (Next.js App Router + Redux Toolkit)** hoàn toàn bằng **JavaScript**.

---

## 📁 Cấu trúc thư mục dự án

```text
ZCOMPUTER_Clone/
├── client/                     # FRONTEND (Next.js 15, Tailwind CSS, Redux Toolkit, Lucide Icons)
│   ├── src/
│   │   ├── app/                # App Router (pages: /, /layout.js, /globals.css, ...)
│   │   ├── components/         # Reusable UI components
│   │   │   ├── layout/         # Header, Navbar, Footer...
│   │   │   └── product/        # ProductCard...
│   │   ├── lib/                # Axios API Client (api.js), Utils (utils.js)
│   │   └── redux/              # Redux Toolkit Global State Management
│   │       ├── slices/
│   │       │   ├── cartSlice.js   # Quản lý giỏ hàng (thêm, sửa, xóa, tổng tiền + localStorage)
│   │       │   └── authSlice.js   # Quản lý xác thực người dùng (login, logout, token)
│   │       ├── store.js        # Cấu hình configureStore
│   │       └── provider.js     # Redux Provider wrapper cho Next.js App Router
│   ├── .env.local              # Biến môi trường Next.js (NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1)
│   └── package.json
│
├── server/                     # BACKEND (Express.js, Mongoose, JWT, RESTful API)
│   ├── src/
│   │   ├── config/             # Kết nối Database MongoDB (db.js)
│   │   ├── controllers/        # Xử lý logic (authController, productController, orderController...)
│   │   ├── middlewares/        # Xác thực JWT (authMiddleware), Bắt lỗi (errorHandler)
│   │   ├── models/             # Schema Mongoose (User, Product, Category, Order)
│   │   ├── routes/             # Endpoints API (/auth, /products, /categories, /orders)
│   │   ├── utils/              # ApiResponse, ApiError helpers
│   │   ├── app.js              # Express app setup (CORS, Morgan logger, JSON parser)
│   │   └── server.js           # Khởi chạy server cổng 5000
│   ├── .env                    # Biến môi trường Backend (PORT, MONGODB_URI, JWT_SECRET...)
│   └── package.json
│
├── package.json                # Root package.json điều khiển cả FE & BE
└── README.md
```

---

## 🚀 Hướng dẫn khởi chạy

### 1. Chạy cả Frontend và Backend cùng một lúc (Khuyên dùng)
Tại thư mục gốc `ZCOMPUTER_Clone`, chạy lệnh:
```bash
npm run dev
```
* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
* **API Health Check:** [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

---

## 💡 Hướng dẫn sử dụng Redux Toolkit trong Component:

```javascript
import { useSelector, useDispatch } from "react-redux";
import { addToCart, selectCartItems, selectTotalItems } from "@/redux/slices/cartSlice";

export default function MyComponent() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectTotalItems);

  const handleAdd = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return <div>Số sản phẩm trong giỏ: {totalItems}</div>;
}
```
