import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { LuImageUp } from "react-icons/lu";

const ImageUpload = ({ onImageUpload,preview, setPreview }) => {
 
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const imgbbAPIKey = import.meta.env.VITE_IMGBB_API;

  
  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setIsUploading(true);
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const imgURL = data.data.url; // URL of the uploaded image
        setPreview(imgURL); // Set preview to ImgBB URL
        onImageUpload(imgURL); // Pass ImgBB URL to parent component
        setError(""); // Clear any existing errors
      } else {
        throw new Error(data.error.message || "Upload failed");
      }
    } catch (uploadError) {
      console.error("ImgBB Upload Error:", uploadError);
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      uploadToImgBB(file); // Upload the file to ImgBB
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  return (
    <div className="max-w-md mx-auto">
  <div
    {...getRootProps()}
    className="border-dashed border-4 border-gray-300 p-6 rounded-lg flex flex-col sm:flex-row items-center justify-center cursor-pointer hover:bg-gray-50 transition duration-300"
  >
    <input {...getInputProps()} />
    
    {/* Icon and text in one row for mobile and sm screens */}
    <div className="flex sm:flex-col items-center space-x-4 sm:space-x-0 sm:space-y-2">
      {/* Icon */}
      <LuImageUp className="text-green-500 text-4xl sm:text-6xl" />
      
      {/* Text */}
      <p className="text-lg sm:text-2xl font-medium text-gray-600">
        {isUploading ? "Uploading..." : "Click or drag & drop your image here"}
      </p>
    </div>

    {/* Image Preview */}
    {preview && (
      <img
        src={preview}
        alt="Preview"
        className="w-20 h-20 object-cover rounded-full sm:w-32 sm:h-32 mt-4 sm:mt-0"
      />
    )}
  </div>

  {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
</div>

  );
};

export default ImageUpload;
