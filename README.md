
# Clippy Fun AI Chrome Extension

Clippy Fun AI is a playful Chrome extension based on the classic Microsoft Office assistant. This fork adds **AI-powered generative comments** using OpenAI's GPT model to dynamically speak based on the website you're browsing.

---

## Features

- **LLM Integration** – Clippy now responds with context-aware AI-generated comments.
- Original Clippy animations and behaviors preserved.
- Automatic detection of active tabs and idle animations.
- Fetches and injects AI comments based on current site.

---

## 🚀 Getting Started

### 1. Clone this Repository

```bash
git clone https://github.com/CBhandawat/Clippy-Fun-AI
cd Clippy-Fun-AI
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup OpenAI API Key

Create a `.env` file in the project root:

```env
OPENAI_API_KEY="YOUR API KEY HERE"
```

### 4. Run the Backend Proxy

```bash
node src/server.js
```

This starts a simple local server at `http://localhost:3000` to securely proxy your OpenAI API requests.

---

## How the AI Works

* The extension reads the current website URL.

* It sends a request to `http://localhost:3000` with the domain.

* The server queries OpenAI's GPT API with a prompt like:

  > "Say something witty or helpful to a user visiting stackoverflow\.com."

* Clippy then speaks the generated message with animation.

---

## Original Author

This extension was originally created by **Ante Barić**.

MIT License © 2018 [Ante Barić](https://github.com/capJavert/clippy)

---

## Modifications & AI Additions

This AI integration by **\Chaitanya Bandawat** (2025), including:

* `.env` support via `dotenv`
* Node-based LLM proxy (`src/server.js`)
* GPT-powered dynamic comment generation
* Prompt engineering for web-awareness




