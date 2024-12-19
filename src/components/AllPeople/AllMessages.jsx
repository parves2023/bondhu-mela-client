import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import ImageUpload from "../ImgUpload";

const AllMessages = () => {
  const { user } = useContext(AuthContext); // Access logged-in user's info
  const [preview, setPreview] = useState(""); // Store image preview URL
  const [conversations, setConversations] = useState([]); // Unique user list
  const [selectedUser, setSelectedUser] = useState(null); // Currently selected user for chat
  const [messages, setMessages] = useState([]); // Messages with selected user
  const [newMessage, setNewMessage] = useState(""); // Input for new message
  const [loading, setLoading] = useState(true);

  // Fetch unique conversations for the logged-in user
  useEffect(() => {
    if (user) {
      fetch(`https://bondhu-mela.vercel.app/messages?user=${user.email}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.users) {
            setConversations(data.users.map((email) => ({ email }))); // Populate conversation list
          } else {
            console.error(
              "Error fetching conversations or unexpected response format",
              data
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching conversations:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Fetch messages with a specific user
  const fetchMessagesWithUser = (email) => {
    setLoading(true);
    fetch(
      `https://bondhu-mela.vercel.app/messages?user=${user.email}&chatWith=${email}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.messages) {
          setMessages(data.messages);
          setSelectedUser(email);
        } else {
          console.error(
            "Error fetching messages or unexpected response format",
            data
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      })
      .finally(() => setLoading(false));
  };

  // Handle sending a new message
  const sendMessage = () => {
    if (newMessage.trim() || preview) {
      const message = {
        sender: user.email,
        receiver: selectedUser, // Changed 'recipient' to 'receiver'
        text: newMessage,
        imageUrl: preview, // Include image if uploaded
        timestamp: new Date().toISOString(),
      };

      fetch(`https://bondhu-mela.vercel.app/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setMessages((prevMessages) => [...prevMessages, message]);
            setNewMessage(""); // Clear input after sending
            setPreview(""); // Clear image preview after sending
          } else {
            console.error("Error sending message:", data);
          }
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }
  };

  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Conversations</h2>
      {selectedUser ? (
        <div>
          <button
            onClick={() => {
              setSelectedUser(null);
              setMessages([]); // Clear messages when returning to the conversation list
            }}
            className="mb-4 text-blue-500 underline"
          >
            Back to Conversations
          </button>
          <h3 className="text-lg font-semibold mb-4">
            Chat with {selectedUser}
          </h3>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <p>No messages with this user.</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg shadow-md ${
                    msg.sender === user.email
                      ? "bg-blue-500 text-white text-right"
                      : "bg-gray-200 text-black text-left"
                  }`}
                >
                  <p className="font-semibold">
                    {msg.sender === user.email ? "You" : msg.sender}
                  </p>
                  <p>{msg.text}</p>
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="Message Image"
                      className="w-32 h-32 object-cover mt-2"
                    />
                  )}
                  <p className="text-sm text-white mt-2">
                    {new Date(msg.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Message input, image upload, and send button */}
          <div className="mt-6 flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 space-y-4 sm:space-y-0">
            {/* Message Input */}
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="p-3 w-full border rounded-lg flex-1 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Image Upload Component */}
            <div className="">
              <ImageUpload
                onImageUpload={(url) => setPreview(url)} // Set image preview URL when uploaded
                preview={preview} // Pass preview to ImageUpload component
                setPreview={setPreview} // Update the preview state
              />
            </div>

            {/* Send Button */}
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white p-3 rounded-lg w-full sm:w-auto text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div>
          {conversations.length === 0 ? (
            <p>No conversations to display.</p>
          ) : (
            <div className="space-y-4">
              {conversations.map((conversation, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg shadow-md bg-gray-100 cursor-pointer hover:bg-gray-200"
                  onClick={() => fetchMessagesWithUser(conversation.email)}
                >
                  <p className="font-semibold">{conversation.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllMessages;
