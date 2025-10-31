import React, { useState, useEffect, useRef } from 'react'; // useRef for scrolling
import axios from 'axios';
import './index.css'; // Apni CSS file ko import karna mat bhoolna

function App() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const chatBoxRef = useRef(null); // Chat box ke scroll ke liye

  // Jab bhi messages update hon, chat box ko neeche scroll karo
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const getQueryAnswer = async (e) => {
    e.preventDefault(); // Default form submission ko roko

    if (!query.trim()) return; // Agar query khali hai to mat bhejo

    // User ka query messages mein add karo
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'user', text: query },
    ]);

    try {
      const res = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          "contents": [
            {
              "parts": [
                {
                  text: "You are a specialized and professional Travel Guide AI. Your sole purpose is to provide travel-related advice, information, suggestions, and tips (destinations, routes, visa, culture, hotels, etc.). If the user asks any question that is NOT directly related to travel, geography, or tourism (e.g., programming, math, science, history, general knowledge, etc.), you MUST politely apologize and state that your function is limited strictly to travel guidance. Do not answer non-travel questions."
                },
                {
                  "text": query,
                }
              ]
            }
          ]
        },
        {
          headers: {
            "x-goog-api-key": "AIzaSyBzCUac0kjucX8-b8LBC7Coxg0896tv1rs",
            "Content-Type": "application/json",
          },
        }
      );

      const answerText = res.data.candidates[0].content.parts[0].text;
      // Bot ka answer messages mein add karo
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'bot', text: answerText },
      ]);
      setQuery(''); // Message bhejne ke baad input field clear karo
    } catch (error) {
      console.error("Error fetching answer:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'bot', text: 'Oops! Kuch ghalat ho gaya. Dobara koshish karein.' },
      ]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box" ref={chatBoxRef}> {/* Ref ko yahan attach karo */}
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}-message`}>
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={getQueryAnswer} className="chat-input-container">
        <input
          type="text"
          name="query"
          id="query"
          placeholder="Enter your Query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="send-button">Answer</button>
      </form>
    </div>
  );
}

export default App;