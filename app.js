const express = require("express");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Config :
const dir = "./public/uploads";
const whitelist = ["image/png", "image/jpeg", "image/jpg"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (fs.existsSync(dir)) {
    } else {
      // Create the folder
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + "__" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (whitelist.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.post("/", upload.single("file"), (req, res) => {
  try {
    const file_url = process.env.BaseUrl + "/uploads/" + req.file.filename;
    res.status(200).json({ msg: "File Uploaded Successfully", file_url });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Only .png, .jpg and .jpeg format allowed!" });
  }
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
