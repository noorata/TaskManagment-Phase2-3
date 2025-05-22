import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  UserName: {
    type: String,
    required: [true, "اسم المستخدم مطلوب"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "كلمة المرور مطلوبة"],
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
    required: [true, "الدور مطلوب"],
  },
  universityId: {
    type: String,
    required: function () {
      return this.role === "student";
    },
  },
  token: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model("User", userSchema);
