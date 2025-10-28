import express from "express";

// 나중에 클러크 예제할때 여기에 붙여서 사용하자

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
  } catch (error) {}
  res.send("register");
});

router.post("/login", async (req, res) => {
  res.send("login");
});

export default router;
