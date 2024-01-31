const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  chatHistory: [
    {
      withUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      messages: [
        {
          sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          message: { type: String, required: true },
          timestamp: { type: Date, default: Date.now },
        },
      ],
    },
  ],
  resetPasswordToken: String,
  resetPasswordExpires: String,
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

module.exports = User;
