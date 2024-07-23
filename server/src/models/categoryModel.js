const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "user Name is mising"],
      trim: true,
      minlength: [3, " manimum length is 3"],
      maxlength: [31, " maximum length is 31"],
    },

    slug: {
      type: String,
      require: [true, "skug Name is mising"],
      trim: true,
      minlength: [3, " manimum length is 3"],
      maxlength: [31, " maximum length is 31"],
    },
  },
  { timestamps: true }
);

const Category = model("Category", categorySchema);
module.exports = Category;
