import React, { useState, useRef } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

const ChatInput = ({ handleSubmit }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage((prev) => prev + transcript);
      adjustTextareaHeight();
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const stopVoiceInput = () => {
    window.speechRecognition?.stop();
    setIsListening(false);
  };

  const toggleMicrophone = () => {
    if (isListening) {
      stopVoiceInput();
    } else {
      handleVoiceInput();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height to content
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    adjustTextareaHeight();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputMessage.trim()) {
        handleSubmit(e, inputMessage);
        setInputMessage("");
        adjustTextareaHeight(); // Reset height
      }
    } else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      setInputMessage((prev) => prev + '\n');
      adjustTextareaHeight();
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (isListening) {
      stopVoiceInput();
    }
    if (inputMessage.trim()) {
      handleSubmit(e, inputMessage);
      setInputMessage("");
      adjustTextareaHeight(); // Reset height
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-300 to-gray-300 p-2 md:p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={onSubmit} className="relative">
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Message your AI assistant..."}
            className="w-full p-3 md:p-4 pr-24 border border-gray-300 text-black rounded-xl md:rounded-2xl focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 bg-gray-50 text-sm md:text-base resize-none overflow-hidden"
            rows="1"
            style={{ minHeight: '48px', maxHeight: '200px' }}
          />
          <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMicrophone}
              className={`p-1.5 md:p-2 transition-colors duration-200 ${
                isListening
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-600 hover:text-gray-700'
              }`}
              aria-label={isListening ? "Stop voice input" : "Start voice input"}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
              ) : (
                <Mic className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>
            <button
              type="submit"
              className="p-1.5 md:p-2 text-gray-600 hover:text-gray-700 transition-colors duration-200"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
