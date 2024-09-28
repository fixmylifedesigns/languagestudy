import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BlogPage from './pages/BlogPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/blog" element={<BlogPage />} />
      </Routes>
    </Router>
  );
};

export default App;


// import React, { useState } from "react";
// import BlogList from "./components/BlogList";
// import BlogPostCreator from "./components/BlogPostCreator";
// import TextToSpeech from "./components/TextToSpeech";

// const App = () => {
//   const [transcript, setTranscript] = useState("");
//   const [audioBlob, setAudioBlob] = useState(null);
//   const [refreshKey, setRefreshKey] = useState(0);

//   const handlePostUpdated = () => {
//     setRefreshKey((oldKey) => oldKey + 1);
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
//       <h1 className="text-3xl font-bold mb-4 text-white">
//         Blog Post Voice Assistant
//       </h1>
//       <TextToSpeech setTranscript={setTranscript} setAudioBlob={setAudioBlob} />
//       <BlogPostCreator
//         initialTextToSpeech={transcript}
//         audioBlob={audioBlob}
//         onPostAdded={handlePostUpdated}
//       />
//       <BlogList key={refreshKey} onPostUpdated={handlePostUpdated} />
//     </div>
//   );
// };

// export default App;
