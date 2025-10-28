import mongoose from "mongoose";

// MongoDB 연결 설정
const connectDB = async () => {
  try {
    const MONGODB_URI =
      process.env.MONGODB_COMPASS_URI || process.env.MONGODB_ATLAS_URI;
    await mongoose.connect(MONGODB_URI);

    let connectionSource = "Unknown"; // 기본값 설정

    if (MONGODB_URI === process.env.MONGODB_ATLAS_URI) {
      connectionSource = "Atlas로 연결 성공됨";
    } else if (MONGODB_URI === process.env.MONGODB_COMPASS_URI) {
      connectionSource = "Compass로 연결 성공됨";
    }
    console.log(`✅ DB연결 주소: ${MONGODB_URI} (${connectionSource})`);
  } catch (error) {
    console.error("❌ MongoDB 연결 실패:", error.message);
    process.exit(1); // 서버 종료
  }
};

export default connectDB;
