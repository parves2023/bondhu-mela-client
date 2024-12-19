import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Slider from "../../components/Slider";
import { AuthContext } from "../../providers/AuthProvider";
import DarkModeToggle from "react-dark-mode-toggle";
import { TbSunMoon } from "react-icons/tb";
import ImageUpload from "../../components/ImgUpload"; // Assuming ImageUpload is a separate component

const Home = () => {
  const { user } = useContext(AuthContext);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // New Post State
  const [newPostImage, setNewPostImage] = useState("");
  const [newPostText, setNewPostText] = useState("");
  const [postSubmitting, setPostSubmitting] = useState(false); // Corrected state name
  const [postStatus, setPostStatus] = useState(""); // Added to track post submission status

  // All Posts State
  const [posts, setPosts] = useState([]);
  const [dataFetching, setDataFetching] = useState(false);

  // Sync dark mode with localStorage and Tailwind
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Fetch all posts on component mount
  useEffect(() => {
    setDataFetching(true);
    axios
      .get("https://bondhu-mela.vercel.app/posts")
      .then((response) => {
        setPosts(response.data);
        setDataFetching(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setDataFetching(false);
      });
  }, []);

  // Handle post submission
  const handlePostSubmit = async () => {
    if (!newPostText && !newPostImage) {
      setPostStatus("Please provide either text or an image for your post.");
      return;
    }

    setPostSubmitting(true);
    setPostStatus(""); // Clear any previous status

    try {
      const postData = {
        text: newPostText || "", // If no text, send empty string
        image: newPostImage || "", // If no image, send empty string
        author: user.uid, // Firebase user ID
        authorName: user.displayName || "Anonymous", // Use displayName if available, else default to "Anonymous"
        date: new Date().toISOString(), // Add current date to the post
      };

      // Send the post data to the backend
      await axios.post("https://bondhu-mela.vercel.app/posts", postData);

      // Reset the form fields and show success message
      setNewPostText("");
      setNewPostImage("");
      setPostStatus("Post submitted successfully!");

      // Optionally, refetch posts to include the new one
      setDataFetching(true);
      const response = await axios.get("https://bondhu-mela.vercel.app/posts");
      setPosts(response.data);
      setDataFetching(false);
    } catch (error) {
      console.error("Error submitting post:", error);
      setPostStatus("Failed to submit post. Please try again later.");
    } finally {
      setPostSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative">
      {/* Dark Mode Toggle */}
      <div className="fixed hover:right-0 border rounded-2xl -right-28 py-6 px-6 bg-gray-300 dark:bg-gray-800 bottom-16 transform -translate-y-1/2 shadow-lg flex items-center space-x-4 z-50 transition-all duration-150">
        <TbSunMoon className="text-green-600 dark:text-gray-100 text-3xl" />
        <DarkModeToggle
          onChange={setIsDarkMode}
          checked={isDarkMode}
          size={80}
        />
      </div>

      {/* Slider */}
      <div className="pt-4">
        <Slider />
      </div>

      {/* Add New Post Section */}
      {user && (
        <div className="container mx-auto mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">
            Create a New Post
          </h2>
          <div className="space-y-4">
            {/* Image Upload */}
            <ImageUpload
              onImageUpload={(url) => setNewPostImage(url)} // Set image URL after upload
              preview={newPostImage} // Display the image preview
              setPreview={setNewPostImage} // Update the preview state
            />
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Write something..."
              className="w-full text-gray-900 p-4 border rounded-lg resize-none"
              rows="4"
            />
            <button
              onClick={handlePostSubmit}
              className="w-full bg-green-500 text-white p-2 rounded-lg"
              disabled={postSubmitting}
            >
              {postSubmitting ? "Submitting..." : "Post"}
            </button>
          </div>

          {/* Post Submission Status */}
          {postStatus && (
            <div
              className={`mt-4 text-center ${
                postStatus.includes("success")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              <p>{postStatus}</p>
            </div>
          )}
        </div>
      )}

      {/* All Posts Section */}
      <div className="container mx-auto mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">All Posts</h2>

        {dataFetching ? (
          <div className="flex justify-center h-64 items-center">
            <p>Loading posts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Loop through the posts */}
            {posts.map((post) => (
              <div
                key={post._id}
                className="post-card bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md"
              >
                {/* Post Footer Section */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Posted by <span className="font-bold">{post.authorName}</span>{" "}
                  on {new Date(post.date).toLocaleString()}
                </p>{" "}
                <br />
                {/* Image Section - Only show if there is an image */}
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-64 md:h-96 object-cover rounded-lg mb-4" // Image styling
                  />
                )}
                {/* Post Text Section */}
                <p className="text-gray-900 dark:text-gray-100 mt-4">
                  {post.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
