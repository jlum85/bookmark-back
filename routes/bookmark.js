const express = require("express");
const router = express.Router();
const middlewares = require("./middlewares");

const Bookmark = require("../models/Bookmark");

const updateBookMark = async (bookmark, req) => {
  if (!bookmark || !req.body) {
    return "";
  }
  const { title, description, url, tag, meta, importance, rating } = req.body;

  if (title) {
    bookmark.title = title;
  }
  if (description) {
    bookmark.description = description;
  }
  if (url) {
    bookmark.url = url;
  }
  if (tag && tag.length > 0) {
    bookmark.tag = [...tag];
  }
  if (meta) {
    bookmark.meta = { ...meta };
  }
  if (importance && Number.isInteger(importance)) {
    bookmark.importance = importance;
  }
  if (rating && Number.isInteger(rating)) {
    bookmark.rating = rating;
  }

  await bookmark.save();
};

// POST  /create
router.post("/bookmark/create", middlewares.authenticate, async (req, res) => {
  console.log(">> Method : " + req.method + " , Route : " + req.route.path);
  console.log(">> Url : " + req.originalUrl);
  try {
    const { title, url } = req.body;

    if (!title || !url) {
      res.status(400).json({ message: "Missing parameter" });
      return "Error";
    }

    const newBookmark = new Bookmark({
      title,
      url,
    });
    await updateBookMark(newBookmark, req);

    res.json(newBookmark);
    //res.json({ message: "Created" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// POST   /update
router.post("/bookmark/update", middlewares.authenticate, async (req, res) => {
  console.log(">> Method : " + req.method + " , Route : " + req.route.path);
  console.log(">> Url : " + req.originalUrl);

  try {
    let { id } = req.fields;

    if (!id) {
      res.status(400).json({ message: "Missing parameter" });
      return "Error";
    }
    let bookmarkUpdate = await Bookmark.findById(id);
    if (bookmarkUpdate) {
      await updateBookMark(bookmarkUpdate, req);

      res.json(bookmarkUpdate);
    } else {
      res.json({ message: "bookmarkDelete not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

// POST   /delete
router.post("/bookmark/delete", middlewares.authenticate, async (req, res) => {
  console.log(">> Method : " + req.method + " , Route : " + req.route.path);
  console.log(">> Url : " + req.originalUrl);

  try {
    let { id } = req.fields;
    if (!id) {
      res.status(400).json({ message: "Missing parameter" });
      return "Error";
    }
    let bookmarkDelete = await Bookmark.findById(id);
    if (bookmarkDelete) {
      await bookmarkDelete.remove();
      res.json({ message: "bookmark deleted" });
    } else {
      res.json({ message: "bookmarkDelete not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

// GET   Read
router.get("/bookmark", middlewares.authenticate, async (req, res) => {
  console.log(">> Method : " + req.method + " , Route : " + req.route.path);
  console.log(">> Url : " + req.originalUrl);
  try {
    const bookmarks = await Bookmark.find();
    res.json(bookmarks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
