import React, { useState } from "react";
import BlogList from "../components/BlogList";
import BlogPostCreator from "../components/BlogPostCreator";
import TextToSpeech from "../components/TextToSpeech";
import { X } from "lucide-react";

const BlogPage = () => {
  const [transcript, setTranscript] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showPostForm, setShowPostForm] = useState(false);

  const handlePostUpdated = () => {
    setRefreshKey((oldKey) => oldKey + 1);
    setShowPostForm(false);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Language Learning Blog</h1>

        <button
          onClick={() => setShowPostForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold mb-8 hover:bg-blue-700 transition duration-300"
        >
          Create New Post
        </button>

        <BlogList key={refreshKey} onPostUpdated={handlePostUpdated} />

        {/* Post Creation Modal */}
        {showPostForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Create New Post</h2>
                <button
                  onClick={() => setShowPostForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              <TextToSpeech
                setTranscript={setTranscript}
                setAudioBlob={setAudioBlob}
              />
              <BlogPostCreator
                initialTextToSpeech={transcript}
                audioBlob={audioBlob}
                onPostAdded={handlePostUpdated}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
