import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const GoogleLoginButton = ({ signInGoogle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    signInGoogle()
      .then((result) => {
        // Destructure necessary information from the result
        const { user } = result;
        const { displayName, email, photoURL } = user;

        // Check if the user exists in the backend
        fetch("http://localhost:5000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: displayName,
            email: email,
            photo: photoURL,
            password: "", // Google login doesn't require a password, can be left empty
            createdAt: new Date().toISOString(),
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message === "User saved successfully!") {
              // Navigate after successful registration or login
              navigate(location?.state ? location.state : "/");
            } else if (data.message === "User already exists.") {
              // If user already exists, just navigate to the home page or dashboard
              navigate(location?.state ? location.state : "/");
            } else {
              // Handle unexpected error
              console.error("Error creating user:", data);
            }
          })
          .catch((error) => {
            console.error("Error registering user:", error);
          });
      })
      .catch((error) => {
        console.error("Error signing in with Google:", error.message);
      });
  };

  return (
    <div className="flex justify-center mt-10">
      <button
        onClick={handleGoogleLogin}
        className="flex items-center px-6 py-3 bg-green-400 text-white text-lg font-medium rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-transform transform hover:scale-105"
      >
        <img
          src="https://www.google.com/favicon.ico"
          alt="Google Icon"
          className="w-6 h-6 mr-3"
        />
        Sign in with Google
      </button>
    </div>
  );
};

export default GoogleLoginButton;
