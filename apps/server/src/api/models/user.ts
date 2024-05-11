import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { toJSON } from "./plugins/toJson";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      private: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: (value: string) => {
        if (!validator.isEmail(value))
          throw new Error("Please insert correct email");
      },
    },
    // phone: {
    //   type: String,
    //   unique: true,
    //   required: true,
    // },
    location: {
      type: String,
    },
    plan: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
    settings: {
      defaultRestaurant: mongoose.Types.ObjectId,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    statics: {
      isEmailTaken: async function (email: string) {
        const user = await this.findOne({ email });
        return !!user;
      },
      isUserNameTaken: async function (username: string) {
        const user = await this.findOne({ username });
        return !!user;
      },
      isPhoneTaken: async function (phone: string) {
        const user = await this.findOne({ phone });
        return !!user;
      },
    },
    methods: {
      isPasswordMatch: async function (password: string) {
        const user = this;
        return bcrypt.compareSync(password, user.password);
      },
    },
  }
);

userSchema.plugin(toJSON);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
// userSchema.statics.isEmailTaken = async function (email: string) {
//   const user = this.findOne({ email });
//   return !!user;
// };

export const User = mongoose.model("User", userSchema);
