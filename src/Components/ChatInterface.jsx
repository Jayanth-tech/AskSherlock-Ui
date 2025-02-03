import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { X } from 'lucide-react';

const ChatInterface = ({ userName, userEmail, photo, onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isIntroLoading, setIsIntroLoading] = useState(true); // New state for intro loading
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, messageId: null, type: null });
  const [feedbackText, setFeedbackText] = useState("");
  const [introMessage, setIntroMessage] = useState("");
  const [username, setUsername] = useState(userName || "Guest User");

  useEffect(() => {
    const fetchUserData = async () => {
      setIsIntroLoading(true); // Start loading
      try {
        const response = await fetch('https://asksherlock.azurewebsites.net/get_user', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors',
          credentials: 'omit',
          body: JSON.stringify({ username: userName })
        });

        const data = await response.json();
        setUsername(userName || "Guest User");
        setIntroMessage(data.intro_message || "Welcome to Ask Sherlock!");
        setMessages([
          {
            id: Date.now(),
            content: data.intro_message || "Welcome to Ask Sherlock!",
            sender: "bot",
            feedback: null,
          },
        ]);
      } catch (error) {
        console.log("Error fetching user data");
        setUsername(userName || "Guest User");
        setIntroMessage("Welcome to Ask Sherlock!");
        setMessages([
          {
            id: Date.now(),
            content: "Welcome to Ask Sherlock (Guest)",
            sender: "bot",
            feedback: null,
          },
        ]);
      } finally {
        setIsIntroLoading(false); // End loading
      }
    };

    fetchUserData();
  }, [userName]);



  
  const handleSubmit = async (e, inputMessage) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
  
    // Get current timestamp in required format
    const getCurrentTimestamp = () => {
      const date = new Date();
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(',', '');
    };
  
    // Store last conversation in session storage
    const storeLastConversation = (userMsg, aiMsg) => {
      const lastConversation = {
        user: userMsg,
        ai: aiMsg,
        timestamp: getCurrentTimestamp()
      };
      sessionStorage.setItem('lastConversation', JSON.stringify(lastConversation));
    };
  
    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      sender: "user",
      feedback: null,
      timestamp: getCurrentTimestamp()
    };
  
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
  
    try {
      // Get only the last user message and bot response for history
      const lastUserMessage = messages
        .filter(msg => msg.sender === "user")
        .slice(-1)[0]?.content || "";
      
      const lastBotMessage = messages
        .filter(msg => msg.sender === "bot")
        .slice(-1)[0]?.content || "";
  
      const response = await fetch('https://asksherlock.azurewebsites.net/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history: {
            user: lastUserMessage,
            ai: lastBotMessage
          },
          query: inputMessage,
          created: getCurrentTimestamp(),
          username: userName ,
          emailId: userEmail 
        }),
      });
  
      const data = await response.json();
  
      const botMessage = {
        id: Date.now() + 1,
        content: data.ai || data.response || "I couldn't process that request.",
        sender: "bot",
        feedback: null,
        timestamp: getCurrentTimestamp()
      };
  
      setMessages((prev) => [...prev, botMessage]);
  
      // Store the last conversation after successful response
      storeLastConversation(inputMessage, botMessage.content);
  
    } catch (error) {
      console.error("Error submitting chat input:", error);
      
      const errorMessage = {
        id: Date.now() + 1,
        content: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        feedback: null,
        timestamp: getCurrentTimestamp()
      };
  
      setMessages((prev) => [...prev, errorMessage]);
      
      // Store the error conversation
      storeLastConversation(inputMessage, errorMessage.content);
  
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleFeedbackSubmit = async () => {
    const feedbackPayload = {
      user: username,
      ai: messages.find((msg) => msg.id === feedbackModal.messageId)?.content || "",
      feedback: {
        type: feedbackModal.type,
        comment: feedbackText,
      },
      emailId: userEmail,
    };

    try {
      await fetch('https://asksherlock.azurewebsites.net/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackPayload),
      });
      console.log("Feedback submitted successfully.");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setFeedbackModal({ isOpen: false, messageId: null, type: null });
      setFeedbackText("");
    }
  };


  return (
    <div className="h-screen flex relative bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chatHistory={[]}
      />

      <div className="flex-1 flex flex-col">
        <ChatHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          userName={userName}
          userEmail={userEmail}
          photo={photo}
          onLogout={onLogout}
        />

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-gradient-to-r from-gray-100 to-gray-200 p-2">
          {isIntroLoading ? (
            <div className="flex w-full max-w-4xl mx-auto px-4">
              <div className="flex items-start gap-4 w-full justify-start">
                <div className="flex items-start gap-4 max-w-[85%] md:max-w-[75%] min-w-0 flex-row">
                  <div className="flex-shrink-0">
                    <Skeleton circle width={32} height={32}   baseColor="#d1d5db" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <Skeleton height={50} width={600}   baseColor="#d1d5db"  />
                    <Skeleton count={5}   baseColor="#d1d5db" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                onFeedback={(messageId, type) =>
                  setFeedbackModal({ isOpen: true, messageId, type })
                }
                isLastMessage={index === messages.length - 1}
              />
            ))
          )}

          {isLoading && (
            <ChatMessage
              message={{
                id: 'loading',
                content: "Thinking...",
                sender: "bot",
              }}
            />
          )}
        </div>

        <div className="border-t bg-gradient-to-r from-gray-300 to-gray-300 p-2">
          <div className="max-w-4xl mx-auto">
            <ChatInput handleSubmit={handleSubmit} />
          </div>
        </div>
      </div>

      {feedbackModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {feedbackModal.type === 'up' ? 'Positive' : 'Negative'} Feedback
              </h3>
              <button
                onClick={() => setFeedbackModal({ isOpen: false, messageId: null, type: null })}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Please provide additional feedback (optional)"
              className="w-full p-3 border rounded-lg mb-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setFeedbackModal({ isOpen: false, messageId: null, type: null })}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;

