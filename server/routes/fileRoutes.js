const express = require("express");
const { uploadFile, extractText, getHistory, getFile } = require("../controllers/fileController");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "server/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadFile);
router.get("/:documentId/history", getHistory);
router.get("/", getFile);


module.exports = router;
