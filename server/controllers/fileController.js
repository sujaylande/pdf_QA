const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth"); 
const Document = require("../models/Document");

const extractText = async (filePath, fileType) => {
  const dataBuffer = fs.readFileSync(filePath);

  if (fileType === "pdf") {
    const parsedData = await pdfParse(dataBuffer);
    return parsedData.text;
  } else if (fileType === "txt") {
    return dataBuffer.toString("utf-8");
  } else if (fileType === "docx") {
    const result = await mammoth.extractRawText({ buffer: dataBuffer });
    return result.value; 
  } else {
    throw new Error("Unsupported file type");
  }
};

const uploadFile = async (req, res) => {
  try {
    const { path: filePath, originalname } = req.file;


    const decodedName = Buffer.from(originalname, 'binary').toString('utf-8');

    // console.log(decodedName);
    const fileExtension = path.extname(decodedName).toLowerCase().substring(1); // Get the extension without the dot

    const supportedFileTypes = ["pdf", "txt", "docx"];
    if (!supportedFileTypes.includes(fileExtension)) {
      return res.status(400).json({ message: "Unsupported file format" });
    }
    
    const textContent = await extractText(filePath, fileExtension);
    
    const document = new Document({ title: decodedName, textContent });
    await document.save();

    res.status(200).json({
      message: "File uploaded successfully",
      document: document,
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading file", error: error.message });
  }
};


const getHistory = async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await Document.findById(documentId, "queryHistory");
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json({ history: document.queryHistory });
  } catch (error) {
    console.error("Error fetching history:", error.message);
    res.status(500).json({ message: "Error fetching history", error: error.message });
  }
};

const getFile = async (req, res) => {
  try {
    const documents = await Document.find({}, "_id title");
    res.status(200).json({ documents });
  } catch (error) {
    console.error("Error fetching documents:", error.message);
    res.status(500).json({ message: "Error fetching documents" });
  }
}

module.exports = { uploadFile, getHistory, getFile };
