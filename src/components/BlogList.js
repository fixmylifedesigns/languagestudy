import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ChevronDownIcon, Trash2Icon, EditIcon } from "lucide-react";
import EditPostForm from "./EditPostForm";
import phrases from "../data/englishPhrases.json";

const BlogList = ({ onPostUpdated }) => {
  const [posts, setPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  const token = process.env.REACT_APP_GITHUB_TOKEN;
  const repo = process.env.REACT_APP_GITHUB_REPO;
  const filename = "blogs";

  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${repo}/contents/${filename}`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      const content = JSON.parse(atob(response.data.content));
      setPosts(
        content.posts.sort((a, b) => new Date(b.date) - new Date(a.date))
      );
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, [repo, filename, token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await axios.get(
        `https://api.github.com/repos/${repo}/contents/${filename}`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      const content = JSON.parse(atob(response.data.content));
      const updatedPosts = {
        posts: content.posts.filter((post) => post.id !== postId),
      };

      await axios.put(
        `https://api.github.com/repos/${repo}/contents/${filename}`,
        {
          message: `Delete post ${postId}`,
          content: btoa(JSON.stringify(updatedPosts, null, 2)),
          sha: response.data.sha,
        },
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const toggleExpand = (id) => {
    setExpandedPost(expandedPost === id ? null : id);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getPhraseById = (id) => {
    return phrases.phrases.find((phrase) => phrase.id === id);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-white">Blog Posts</h2>
      {posts.length === 0 ? (
        <p className="text-gray-400">No posts found.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className="bg-gray-700 rounded-lg overflow-hidden"
            >
              {editingPost === post.id ? (
                <EditPostForm
                  post={post}
                  onCancel={() => setEditingPost(null)}
                  onSave={() => {
                    setEditingPost(null);
                    fetchPosts();
                    if (onPostUpdated) onPostUpdated();
                  }}
                />
              ) : (
                <>
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer"
                    onClick={() => toggleExpand(post.id)}
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {formatDate(post.date)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPost(post.id);
                        }}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <EditIcon size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePost(post.id);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2Icon size={18} />
                      </button>
                      <ChevronDownIcon
                        className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
                          expandedPost === post.id ? "transform rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                  {expandedPost === post.id && (
                    <div className="p-4 bg-gray-600">
                      {post.photo && (
                        <img
                          src={`https://raw.githubusercontent.com/${repo}/main/${post.photo}`}
                          alt={post.title}
                          className="w-full h-auto mb-4 rounded-lg"
                        />
                      )}
                      {post.practicePhrase && (
                        <div className="mb-4 bg-gray-700 p-4 rounded-lg">
                          <h4 className="text-lg font-semibold text-white mb-2">
                            Practice Phrase
                          </h4>
                          <p className="text-gray-300">
                            {getPhraseById(post.practicePhrase).phrase}
                          </p>
                          <p className="text-gray-400 mt-1">
                            Translation:{" "}
                            {getPhraseById(post.practicePhrase).translation}
                          </p>
                        </div>
                      )}
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-white mb-2">
                          Text to Speech
                        </h4>
                        <p className="text-gray-300 whitespace-pre-wrap">
                          {post.textToSpeech}
                        </p>
                      </div>
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-white mb-2">
                          Notes
                        </h4>
                        <p className="text-gray-300 whitespace-pre-wrap">
                          {post.notes}
                        </p>
                      </div>
                      {post.audio && (
                        <div className="mt-4">
                          <h4 className="text-lg font-semibold text-white mb-2">
                            Audio Recording
                          </h4>
                          <audio controls className="w-full">
                            <source
                              src={`https://raw.githubusercontent.com/${repo}/main/${post.audio}`}
                              type="audio/mp3"
                            />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogList;
