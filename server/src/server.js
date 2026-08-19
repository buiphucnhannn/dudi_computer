import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Kết nối database
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 [Server] ZComputer Backend đang chạy tại: http://localhost:${PORT}`);
  console.log(`📡 [API Health] http://localhost:${PORT}/api/v1/health`);
});
