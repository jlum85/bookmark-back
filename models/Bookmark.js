const mongoose = require("mongoose");

const Bookmark = mongoose.model("Bookmark", {
  title: String,
  description: String,
  url: String,
  image: String,
  tag: [], // liste des tags
  done: {
    type: Boolean,
    default: false,
  },
  metaData: Object, // author , site

  importance: Number,
  rating: Number,
  // date de création
  created: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Bookmark;
