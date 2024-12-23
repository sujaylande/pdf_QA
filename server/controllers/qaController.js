const OpenAI = require("openai");
const Document = require("../models/Document");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const askQuestion = async (req, res) => {
  try {
    const { documentId, question } = req.body;

    // console.log(question);

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const context = document.textContent;

const prompt = `
You are an AI assistant. Your task is to answer questions strictly based on the information provided in the given PDF document. If the answer cannot be found within the document, respond by saying, "The PDF does not contain information about this question."

Document Content:
${context}

Question: ${question}

Please respond in the following JSON format:
{
  "answer": "<Your Answer>",
  "context": "<Most Relevant Context or 'Not Found'>"
}
`;


    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        { role: "system", content: "You are an AI assistant." },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    // console.log(completion.choices[0].message.content);

    const result = JSON.parse(completion.choices[0].message.content.trim());

    const { answer, context: relevantContext } = result;

    document.queryHistory.push({
      question,
      answer,
      context: relevantContext,
    });
    await document.save();

    res.status(200).json({ answer, relevantContext });
  } catch (error) {
    console.error("Error processing the question:", error.message);
    res.status(500).json({ message: "Error processing the question", error: error.message });
  }
};

module.exports = { askQuestion };

