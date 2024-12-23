const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fileRoutes = require("./routes/fileRoutes");
const qaRoutes = require("./routes/qaRoutes");
const cors = require("cors");
const Document = require("./models/Document")

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use("/api/files", fileRoutes);
app.use("/api/qa", qaRoutes);


const connectDB = require("./config/database");
connectDB();

const fs = require("fs");

const uploadsDir = "./server/uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
