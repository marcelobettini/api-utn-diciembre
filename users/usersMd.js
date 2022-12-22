const mongoose = require("mongoose");

//Mongo DB schema
const userSchema = mongoose.Schema({
  fullName: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  profilePic: { type: String, default: "" },
  password: { type: String, required: true },
},
  {
    timestamps: true, //agrega los campos created At y updated At
  }
);
//TODO: wtf is doc and ret???
userSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    // delete ret.password;
  }
});

//Mongo DB model
const User = mongoose.model("User", userSchema);
module.exports = User;