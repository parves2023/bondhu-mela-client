import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import ChatModal from "./ChatModal"; // Assuming you create a ChatModal component

const AllPeople = () => {
  const { user } = useContext(AuthContext); // Get logged-in user info from AuthContext
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatWith, setChatWith] = useState(null); // Track user to chat with

  // Fetch all users except the current user
  useEffect(() => {
    if (user) {
      // Make the API call to fetch users excluding the logged-in user
      fetch(`http://localhost:5000/users?email=${user.email}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.users) {
            setPeople(data.users);
          } else {
            console.error("Error fetching users:", data.error);
          }
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Function to handle the message button click
  const handleMessageClick = (person) => {
    setChatWith(person); // Set the user to start chatting with
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>All People</h2>
      <div className="grid grid-cols-3 gap-4">
        {people.map((person) => (
          <div key={person.email} className="border p-4 rounded-lg shadow-lg">
            <img
              src={person.photo || "https://via.placeholder.com/150"}
              alt={person.name}
              className="w-32 h-32 mx-auto rounded-full"
            />
            <h3 className="text-center mt-2">{person.name}</h3>
            <p className="text-center">{person.email}</p>

            {/* Message Button */}
            <button
              onClick={() => handleMessageClick(person)}
              className="w-full bg-blue-500 text-white py-2 mt-4 rounded"
            >
              Message
            </button>
          </div>
        ))}
      </div>

      {/* Chat Modal */}
      {chatWith && (
        <ChatModal
          chatWith={chatWith}
          closeChat={() => setChatWith(null)} // Close the chat modal
        />
      )}
    </div>
  );
};

export default AllPeople;
