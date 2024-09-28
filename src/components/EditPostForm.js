import React, { useState, useRef } from "react";
import axios from "axios";
import PracticePhraseSelector from "../components/PracticePhraseSelector";

const EditPostForm = ({ post, onCancel, onSave }) => {
  const [title, setTitle] = useState(post.title);
  const [textToSpeech, setTextToSpeech] = useState(post.textToSpeech);
  const [notes, setNotes] = useState(post.notes);
  const [photo, setPhoto] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedPhrase, setSelectedPhrase] = useState(
    post.practicePhrase ? { id: post.practicePhrase } : null
  );
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const token = process.env.REACT_APP_GITHUB_TOKEN;
  const repo = process.env.REACT_APP_GITHUB_REPO;
  const filename = "blogs";

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        setAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadFile = async (file, fileType) => {
    if (!file) return post[fileType]; // Keep the existing file if no new one is uploaded

    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const content = e.target.result.split(",")[1]; // Get base64 content
          const filename = `${fileType}/${Date.now()}-${file.name}`;
          const response = await axios.put(
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
      const photoUrl = await uploadFile(photo, "photo");
      const audioUrl = await uploadFile(audio, "audio");

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
        posts: content.posts.map((p) =>
          p.id === post.id
            ? {
                ...p,
                title,
                textToSpeech,
                notes,
                photo: photoUrl || p.photo,
                audio: audioUrl || p.audio,
                practicePhrase: selectedPhrase ? selectedPhrase.id : null,
                date: new Date().toISOString(),
              }
            : p
        ),
      };

      await axios.put(
        `https://api.github.com/repos/${repo}/contents/${filename}`,
        {
          message: `Update post ${post.id}`,
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

      onSave();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-600">
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-300"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <PracticePhraseSelector
        onPhraseSelected={setSelectedPhrase}
        initialPhrase={selectedPhrase}
      />
      <div className="mb-4">
        <label
          htmlFor="textToSpeech"
          className="block text-sm font-medium text-gray-300"
        >
          Text to Speech
        </label>
        <textarea
          id="textToSpeech"
          value={textToSpeech}
          onChange={(e) => setTextToSpeech(e.target.value)}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
          rows="4"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-300"
        >
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          required
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
          rows="4"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="photo"
          className="block text-sm font-medium text-gray-300"
        >
          New Photo (optional)
        </label>
        <input
          type="file"
          id="photo"
          onChange={handlePhotoChange}
          accept="image/*"
          className="mt-1 block w-full text-sm text-gray-300
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="audio"
          className="block text-sm font-medium text-gray-300"
        >
          New Audio (optional)
        </label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-4 py-2 rounded ${
              isRecording
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            } text-white focus:outline-none`}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
          {audio && <span className="text-gray-300">New audio recorded</span>}
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditPostForm;
