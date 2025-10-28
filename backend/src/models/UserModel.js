const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

// 클러크 및 소셜 연동할거 염두해두고 코드 짜고 , 앱모바일 및 아니라 웹에서도 통용되는 공통의 로직을 작성하자

// const { JWT_SECRET, JWT_EXPIRES_IN = "1h" } = process.env;
// if (!JWT_SECRET) throw new Error("JWT_SECRET 환경변수가 필요합니다");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2
    },
    sex: {
      type: String,
      enum: ["male", "female"], // 🎯 여기서 제한
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "올바른 이메일 형식이 아닙니다."
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
      validate: {
        validator: (value) =>
          validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 0, // 필요에 따라 설정 조절 가능
            minNumbers: 1,
            minSymbols: 0
          }),
        message:
          "비밀번호는 최소 8자이며 문자와 숫자를 각 최소한 1개 포함해야 합니다."
      }
    },
    profileImage: {
      type: String,
      default: ""
    },
    refreshToken: { type: String, select: false }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_, ret) => {
        delete ret.password;
        return ret;
      }
    }
  }
);

// 1) 유저 저장 전 비밀번호 해싱
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // 비밀번호가 수정되지 않았다면 다음으로 넘어감 ,  이중 암호화 방지

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log("유저 저장전에 작동되는지 확인하는 콘솔");
  next();

  // 여기서 this는 위의 user 인스턴스를 가리킴
  // this.password  // → user.password
  // this.email     // → user.email
  // this.sex       // → user.sex
});

// userSchema.pre('findOneAndUpdate', async function (next) {
//   const update = this.getUpdate();

//   if (update.password) {
//     update.password = await bcrypt.hash(update.password, 10);
//     this.setUpdate(update);
//   }

//   next();
// });

// 2) 비밀번호 비교 (문서 메서드)
userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

// 3) 액세스 토큰 발급 (문서 메서드)
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// 4) 리프레시 토큰 발급 (문서 메서드)
//   - 보안상 httpOnly 쿠키로 내려주고, 서버에는 해시로 저장하거나 Redis에 저장 추천
// userSchema.methods.generateRefreshToken = function () {
//   const payload = { sub: this._id.toString(), type: "refresh" };
//   const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
//     expiresIn: "7d"
//   });
//   return token;
// };

// 5) (선택) 리프레시 토큰 저장 헬퍼
// userSchema.methods.rotateRefreshToken = async function () {
//   const token = this.generateRefreshToken();
//   // DB에 평문 저장 대신 해시 저장을 권장 (여기선 간단히 평문 예시)
//   this.refreshToken = token;
//   await this.save();
//   return token;
// };

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
