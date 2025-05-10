import React, { useEffect, useState } from "react"
import { useChat } from "./store"
import ReactMarkdown from "react-markdown"
import { motion, AnimatePresence } from "framer-motion"

const App = () => {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const { postMessage, messages } = useChat()

  const handleSend = async () => {
    if (!input.trim()) return
    const message = input
    setInput("")
    setLoading(true)
    await postMessage({ message })
    setLoading(false)
  }

 const handleSpeechInput = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Ваш браузер не поддерживает голосовой ввод");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "ru-RU";
  recognition.interimResults = false; 
  recognition.maxAlternatives = 2;

  recognition.onstart = () => {
    setListening(true);
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setInput(prev => `${prev} ${transcript}`);
  };

  recognition.onerror = (event) => {
    setListening(false);
  };

  recognition.onend = () => {
    setListening(false);
  };

  recognition.start();
};


  return (
    <div className="h-screen w-full bg-neutral-100 flex flex-col items-center justify-between p-6">
      <div className="max-w-4xl flex-1 overflow-y-auto space-y-4 p-2 break-words max-h-[85vh]">
        <AnimatePresence>
          {messages.map((message, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[80%] break-words whitespace-pre-wrap border rounded-3xl px-4 py-2 text-sm bg-neutral-300 text-black shadow">
                {message.from === "user" ? (
                  message.message
                ) : (
                  <ReactMarkdown>{message.message}</ReactMarkdown>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-2xl flex items-center gap-3 bg-white rounded-3xl p-3 shadow mt-4">
        <textarea
          style={{ resize: "none" }}
          className="flex-1 h-[50px] p-2 rounded-xl outline-none focus:ring-0 text-sm"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          placeholder="Введите сообщение или используйте микрофон..."
        />
        <button
          className="bg-neutral-600 w-[36px] h-[36px] flex items-center justify-center text-white rounded-full hover:bg-neutral-700 transition"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? <i className="pi pi-spin pi-spinner" /> : <i className="pi pi-arrow-up" />}
        </button>
        <button
          onClick={handleSpeechInput}
          className={`w-[36px] h-[36px] flex items-center justify-center rounded-full border transition
            ${listening ? "bg-red-500 border-red-700 animate-pulse" : "bg-white border-neutral-500"}`}
        >
          <i className={`pi pi-microphone ${listening ? "text-white" : "text-neutral-500"}`} />
        </button>
      </div>
    </div>
  )
}

export default App
