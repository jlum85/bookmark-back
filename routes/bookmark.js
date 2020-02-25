const express = require("express");
const router = express.Router();

const Bookmark = require("../models/Bookmark");

// POST  /create
router.post("/bookmark/create", async (req, res) => {
  console.log(">> Method : " + req.method + " , Route : " + req.route.path);
  console.log(">> Url : " + req.originalUrl);
  try {
    const { title, description, url, tag, meta, importance, rating } = req.body;

    if (!title || !url) {
      res.status(400).json({ message: "Missing parameter" });
      return "Error";
    }

    const newBookmark = new Bookmark({
      title,
      url
    });
    if (description) {
      newBookmark.description = description;
    }
    if (tag && tag.length > 0) {
      newBookmark.tag = [...tag];
    }
    if (meta) {
      newBookmark.meta = { ...meta };
    }
    if (importance && Number.isInteger(importance)) {
      newBookmark.importance = importance;
    }
    if (rating && Number.isInteger(rating)) {
      newBookmark.rating = rating;
    }

    await newBookmark.save();
    res.json(newBookmark);
    //res.json({ message: "Created" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// POST   /update
router.post("/bookmark/update", async (req, res) => {
  console.log(">> Method : " + req.method + " , Route : " + req.route.path);
  console.log(">> Url : " + req.originalUrl);
  try {
    //

    res.json({ message: "Updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST   /delete
router.post("/bookmark/delete", async (req, res) => {
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
router.get("/bookmark", async (req, res) => {
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
