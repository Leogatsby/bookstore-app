import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodbDatabase.js";
import authSelfEmailJwtRoutes from "./routes/auth/authSelfEmailJwtRoutes.js";
import authClerkRoutes from "./routes/auth/authClerkRoutes.js";

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

app.use("/api/auth/selfEmailJwt", authSelfEmailJwtRoutes);
app.use("/api/auth/clerk", authClerkRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "✅ BookStore API 서버가 실행 중입니다!",
    database: "MongoDB (클라우드)",
    status: "연결됨"
  });
});

const startServer = async () => {
  const PORT = process.env.PORT || 5000;

  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(
        `🚀 BookStore API 서버가 포트 ${PORT} 에서 성공적으로 작동합니다.`
      );
    });
  } catch (err) {
    console.error(
      "❌ 서버 시작 실패! 데이터베이스 연결 또는 포트 충돌 확인:",
      err.message
    );
    // Render에서 재시작을 유도하도록 프로세스를 명시적으로 종료합니다.
    process.exit(1);
  }
};
startServer();
