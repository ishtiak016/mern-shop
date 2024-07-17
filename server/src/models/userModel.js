const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { defaultImagePtah } = require("../secrect");
const UserSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "user Name is mising"],
      trim: true,
      minlength: [3, " manimum length is 3"],
      maxlength: [31, " maximum length is 31"],
    },
    email: {
      type: String,
      require: [true, "user email is mising"],
      trim: true,
      unique: true,
      lowecase: true,
      // validate: {
      // validator: function (value) {
      //     return validator.isEmail(value);
      // },
      // message: props => `${props.value} is not a valid email address!`
      // }
    },
    password: {
      type: String,
      require: [true, "user password is mising"],
      minlength: [6, " manimum length is 6"],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
      type: Buffer,
      contentType: String,
      require:  [true, "user image is mising"]
    },
    address: {
      type: String,
      require: [true, "user address is mising"],
    },
    phone: {
      type: String,
      require: [true, "user phone is mising"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const user = model("User", UserSchema);
module.exports = user;
