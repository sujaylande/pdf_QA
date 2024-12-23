# pdf-QA

**pdf-QA** is a web application designed to allow users to upload PDF files and perform intelligent question-answering on the document content using advanced AI capabilities.

## Table of Contents
- [Features](#features)
- [Setup Instructions](#setup-instructions)
  - [.env Configuration](#env-configuration)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Technologies Used](#technologies-used)

---

## Features
- Upload and parse PDF files.
- Ask questions about the content of the uploaded PDF.
- Leverages AI for precise and context-aware answers.
- Full-stack implementation with separate client and server modules.

---

## Setup Instructions

### .env Configuration
To run the project, create a `.env` file in the `server` directory with the following variables:

```
MONGO_URI=<Your MongoDB connection string>
PORT=<Port number for the backend server>
OPENAI_API_KEY=<Your OpenAI API key>
```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend application:
   ```bash
   npm start
   ```

---

## Technologies Used
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **AI Services:** OpenAI API

---

Happy coding!

