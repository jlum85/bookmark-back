const express = require("express");
const router = express.Router();
const middlewares = require("./middlewares");
const request = require("request");
const cheerio = require("cheerio");
const Bookmark = require("../models/Bookmark");

// POST  /scrape
router.post("/scrape", middlewares.authenticate, async (req, res) => {
  console.log(">> Method : " + req.method + " , Route : " + req.route.path);
  console.log(">> Url : " + req.originalUrl);

  const url = req.body.url;
  if (!url) {
    res.status(400).json({ message: "Missing parameter url" });
    return "Error";
  }

  res.setHeader("Content-Type", "application/json");

  //make a new request to the URL provided in the HTTP POST request
  request(url, async function (error, response, responseHtml) {
    var resObj = {};

    //if there was an error
    if (error) {
      res.end(JSON.stringify({ error: "There was an error of some kind" }));
      return;
    }

    //create the cheerio object
    (resObj = {}),
      //set a reference to the document that came back
      ($ = cheerio.load(responseHtml)),
      //create a reference to the meta elements
      ($title = $("head title").text()),
      ($desc = $('meta[name="description"]').attr("content")),
      ($kwd = $('meta[name="keywords"]').attr("content")),
      ($ogTitle = $('meta[property="og:title"]').attr("content")),
      ($ogImage = $('meta[property="og:image"]').attr("content")),
      ($ogDesc = $('meta[property="og:description"]').attr("content")),
      ($ogKeywords = $('meta[property="og:keywords"]').attr("content")),
      ($images = $("img"));

    if ($title) {
      resObj.title = $title;
    }

    if ($desc) {
      resObj.description = $desc;
    }

    if ($kwd) {
      resObj.keywords = $kwd;
    }

    if ($ogImage && $ogImage.length) {
      resObj.ogImage = $ogImage;
    }

    if ($ogTitle && $ogTitle.length) {
      resObj.ogTitle = $ogTitle;
    }

    if ($ogKeywords && $ogKeywords.length) {
      resObj.ogKeywords = $ogKeywords;
    }

    // if ($images && $images.length) {
    //   resObj.images = [];
    //   for (var i = 0; i < $images.length; i++) {
    //     resObj.images.push($($images[i]).attr("src"));
    //   }
    // }

    // res.end(JSON.stringify(resObj));
    console.log(JSON.stringify(resObj));

    try {
      const newBookmark = new Bookmark({
        title: resObj.title || resObj.ogTitle,
        url,
        image: resObj.ogImage,
        description: resObj.description,
      });

      if (resObj.keywords) {
        newBookmark.tag = [];
        newBookmark.tag.push(resObj.keywords);
      }

      await newBookmark.save();
      res.json(newBookmark);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  });
});

module.exports = router;
