import React, { useState, useEffect } from "react";
import axios from "axios";
import PracticePhraseSelector from "../components/PracticePhraseSelector";

const BlogPostCreator = ({ onPostAdded, initialTextToSpeech, audioBlob }) => {
  const [title, setTitle] = useState("");
  const [textToSpeech, setTextToSpeech] = useState(initialTextToSpeech || "");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState(null);
  const [audio, setAudio] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedPhrase, setSelectedPhrase] = useState(null);

  const token = process.env.REACT_APP_GITHUB_TOKEN;
  const repo = process.env.REACT_APP_GITHUB_REPO;
  const filename = "blogs";

  useEffect(() => {
    if (audioBlob) {
      setAudio(audioBlob);
    }
  }, [audioBlob]);

  useEffect(() => {
    if (initialTextToSpeech) {
      setTextToSpeech((prevContent) => prevContent + initialTextToSpeech);
    }
  }, [initialTextToSpeech]);

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const uploadFile = async (file, fileType) => {
    if (!file) return null;

    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const content = e.target.result.split(",")[1];
          const filename = `${fileType}/${Date.now()}-${
            file.name || "audio.mp3"
          }`;
          await axios.put(
            `https://api.github.com/repos/${repo}/contents/${filename}`,
            {
              message: `Upload ${filename}`,
              content: content,
            },
            {
              headers: {
                Authorization: `token ${token}`,
                Accept: "application/vnd.github.v3+json",
              },
            }
          );
          resolve(filename);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let photoUrl = null;
      let audioUrl = null;

      if (photo) {
        photoUrl = await uploadFile(photo, "images");
      }

      if (audio) {
        audioUrl = await uploadFile(audio, "audio");
      }

      let existingFile;
      try {
        const getResponse = await axios.get(
          `https://api.github.com/repos/${repo}/contents/${filename}`,
          {
            headers: {
              Authorization: `token ${token}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        existingFile = getResponse.data;
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          throw error;
        }
      }

      let updatedPosts;
      if (existingFile) {
        const existingContent = JSON.parse(atob(existingFile.content));
        updatedPosts = {
          posts: [
            ...existingContent.posts,
            {
              id:
                existingContent.posts.length > 0
                  ? Math.max(...existingContent.posts.map((p) => p.id)) + 1
                  : 1,
              date: new Date().toISOString(),
              title,
              textToSpeech,
              notes,
              photo: photoUrl,
              audio: audioUrl,
              practicePhrase: selectedPhrase ? selectedPhrase.id : null,
            },
          ],
        };
      } else {
        updatedPosts = {
          posts: [
            {
              id: 1,
              date: new Date().toISOString(),
              title,
              textToSpeech,
              notes,
              photo: photoUrl,
              audio: audioUrl,
              practicePhrase: selectedPhrase ? selectedPhrase.id : null,
            },
          ],
        };
      }

      await axios.put(
        `https://api.github.com/repos/${repo}/contents/${filename}`,
        {
          message: existingFile ? `Update ${filename}` : `Create ${filename}`,
          content: btoa(JSON.stringify(updatedPosts, null, 2)),
          sha: existingFile ? existingFile.sha : undefined,
        },
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      setTitle("");
      setTextToSpeech("");
      setNotes("");
      setPhoto(null);
      setAudio(null);
      setSelectedPhrase(null);
      setMessage("Post added successfully!");
      if (onPostAdded) onPostAdded();
    } catch (error) {
      console.error("Error updating file:", error);
      setMessage("Error adding post. Please try again.");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-white">Add New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <PracticePhraseSelector onPhraseSelected={setSelectedPhrase} />
        <div>
          <label
            htmlFor="textToSpeech"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            Text to Speech
          </label>
          <textarea
            id="textToSpeech"
            value={textToSpeech}
            onChange={(e) => setTextToSpeech(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white h-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="notes"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white h-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="photo"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            Photo
          </label>
          <input
            type="file"
            id="photo"
            onChange={handlePhotoChange}
            accept="image/*"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="audio"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            Audio
          </label>
          {audio ? (
            <span className="text-gray-300">Audio file ready for upload</span>
          ) : (
            <span className="text-gray-300">No audio file selected</span>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
        >
          Add Post
        </button>
      </form>
      {message && <p className="mt-4 text-green-400">{message}</p>}
    </div>
  );
};

export default BlogPostCreator;
