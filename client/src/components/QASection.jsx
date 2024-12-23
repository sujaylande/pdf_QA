import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const QASection = ({ documentId }) => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch chat history
  const fetchHistory = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/files/${documentId}/history`);
      setChatHistory(response.data.history || []);
    } catch (error) {
      console.error("Error fetching history:", error.message);
    }
  }, [documentId]);

  // Load chat history when documentId changes
  useEffect(() => {
    if (documentId) fetchHistory();
  }, [documentId, fetchHistory]);

  // Handle question submission
  const handleAskQuestion = async () => {
    if (!question) return alert("Please enter a question!");

    try {
      setIsGenerating(true);
      const response = await axios.post("http://localhost:8000/api/qa/ask", {
        documentId,
        question,
      });

      const { answer, relevantContext } = response.data;

      // Update chat history dynamically
      const newEntry = { question, answer, relevantContext };
      setChatHistory((prev) => [...prev, newEntry]);

      setQuestion(""); // Clear the input box

      // Scroll to the latest message
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error fetching answer:", error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Window */}
      <div className="flex-grow overflow-y-auto border rounded p-4 bg-gray-50">
        {chatHistory.map((entry, index) => (
          <div key={index} className="mb-4">
            <div>
              <strong>Q:</strong> {entry.question}
            </div>
            <div>
              <strong>A:</strong> {entry.answer}
            </div>
            {entry.relevantContext && ( // Use relevantContext instead of context
              <div className="mt-1 text-gray-500">
                <strong>Context:</strong> {entry.relevantContext}
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div className="mt-4 inputBox">
        <textarea
          className="w-full border p-2"
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{resize: 'none'}}
        />
        <button onClick={handleAskQuestion}
          className={`askBtn mt-2 px-6 py-3 rounded-lg text-white font-semibold flex items-center justify-center transition duration-300 ${isGenerating ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          disabled={isGenerating}>
          {isGenerating ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3V4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                ></path>
              </svg>
              Generating Response...
            </>
          ) : (
            'Ask'
          )}
        </button>
      </div>
    </div>
  );
};

export default QASection;
