require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const bookmarkRoutes = require("./routes/bookmark");
const scrapeRoutes = require("./routes/scrape");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(bookmarkRoutes);
app.use(scrapeRoutes);

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/bookmark", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", function (req, res) {
  return res.send("hello Bookmark  / ");
});

app.all("*", (req, res) => {
  res.status(404).send("Page introuvable");
});

const port = process.env.PORT || 3006;
app.listen(port, () => {
  const date = new Date().toLocaleString("fr-FR", { hour12: false });
  console.log(`Server started : ${date} on port ${port}`);
});
