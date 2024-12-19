import Swal from "sweetalert2";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../providers/AuthProvider";

const MyPosts = () => {
  const { user } = useContext(AuthContext); // Get the logged-in user
  const [posts, setPosts] = useState([]);
  const [dataFetching, setDataFetching] = useState(true);

  // Fetch only posts that match the logged-in user's email
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "https://bondhu-mela.vercel.app/posts",
          {
            params: { authorEmail: user.email }, // Send the user's email as a query parameter
          }
        );
        setPosts(response.data); // Set posts that match the user's email
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setDataFetching(false);
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [user]);

  // Handle post deletion
  const handleDelete = async (postId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this post? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `https://bondhu-mela.vercel.app/posts/${postId}`
          );
          console.log("Delete response:", response);

          // Remove the deleted post from the state
          setPosts(posts.filter((post) => post._id !== postId));
          Swal.fire("Deleted!", "Your post has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting post:", error.response || error);
          Swal.fire(
            "Error",
            "Failed to delete post. Please try again.",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="container mx-auto mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">My Posts</h2>

      {dataFetching ? (
        <div className="flex justify-center h-64 items-center">
          <p>Loading your posts...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Loop through the posts */}
          {posts.map((post) => (
            <div
              key={post._id}
              className="post-card bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md"
            >
              {/* Image Section - Only show if there is an image */}
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-48 object-cover rounded-lg mb-4" // Image styling
                />
              )}

              {/* Post Text Section */}
              <p className="text-gray-900 dark:text-gray-100 mt-4">
                {post.text}
              </p>

              {/* Post Footer Section */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Posted by {post.authorName} on{" "}
                {new Date(post.date).toLocaleString()}
              </p>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(post._id)}
                className="mt-4 text-red-500 hover:text-red-700"
              >
                Delete Post
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
