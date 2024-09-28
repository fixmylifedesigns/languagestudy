import React, { useState } from "react";
import "./App.css";
import BlogPostCreator from "./components/BlogPostCreator";
import BlogList from "./components/BlogList";

const BlogApp = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostUpdated = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">My Blog</h1>
        <BlogPostCreator onPostAdded={handlePostUpdated} />
        <BlogList key={refreshKey} onPostUpdated={handlePostUpdated} />
      </div>
    </div>
  );
};

export default BlogApp;
