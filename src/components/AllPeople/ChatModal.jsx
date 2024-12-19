import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../providers/AuthProvider";

const ChatModal = ({ chatWith, closeChat }) => {
  const { user } = useContext(AuthContext); // Access logged-in user from context
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // Store messages locally

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        sender: user.email, // Logged-in user's email
        receiver: chatWith.email, // Recipient's email
        text: message,
        timestamp: new Date().toISOString(),
      };

      // Send message to backend
      fetch("http://localhost:5000/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Add message to local state for real-time updates
            setMessages([...messages, newMessage]);
            setMessage(""); // Clear input field

            // Show success alert with auto-close
            Swal.fire({
              icon: "success",
              title: "Message sent!",
              showConfirmButton: false,
              timer: 1500, // Auto close after 1.5 seconds
            });
          } else {
            // Show error alert
            Swal.fire({
              icon: "error",
              title: "Failed to send message",
              text: data.error || "Something went wrong!",
            });
          }
        })
        .catch((error) => {
          console.error("Error sending message:", error);

          // Show error alert
          Swal.fire({
            icon: "error",
            title: "Failed to send message",
            text: "Network error or server issue!",
          });
        });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{chatWith?.name || "Chat"}</h3>
          <button onClick={closeChat} className="text-red-500">
            Close
          </button>
        </div>

        {/* Display messages */}
        <div className="mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.sender === user.email ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  msg.sender === user.email
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <strong>
                  {msg.sender === user.email ? "You" : chatWith.name}:
                </strong>{" "}
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input and send message */}
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border w-full p-2 rounded-l"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-2 rounded-r"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
