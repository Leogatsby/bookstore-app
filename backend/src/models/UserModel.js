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
    }
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

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
