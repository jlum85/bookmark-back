const mongoose = require("mongoose");

const Bookmark = mongoose.model("Bookmark", {
  title: String,
  description: String,
  url: String,
  tag: [], // liste des tags
  done: {
    type: Boolean,
    default: false
  },
  metaData: Object, // author , site

  importance: Number,
  rating: Number,
  // date de création
  created: {
    type: Date,
    default: Date.now()
  }
});
const obj = {
  title: "A Redux Reducer is like a Coffee Maker",
  description: "",
  url: "https://codeburst.io/redux-reducers-are-coffee-makers-8a78dd8bb7a0",
  tag: ["redux", "React"],
  meta: {},
  importance: 1,
  rating: 5
};

module.exports = Bookmark;
