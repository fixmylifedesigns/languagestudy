import React from "react";
import { ArrowRight, Mic, Calendar, Star, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold" id="app-logo">
          LinguaTrack
        </h1>
        <Link
          to="/blog"
          className="bg-white text-black px-4 py-2 rounded-full font-semibold"
          id="get-started-button"
        >
          Get started
        </Link>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16" id="hero-section">
          <h2 className="text-5xl font-bold mb-4">
            Track Your Language Journey
          </h2>
          <p className="text-xl mb-8">
            The best app for monitoring your language learning progress
          </p>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-white text-black px-6 py-3 rounded-full font-semibold flex items-center"
              id="app-store-button"
            >
              <span className="mr-2">App Store</span>
              <ArrowRight size={20} />
            </button>
            <button
              className="bg-white text-black px-6 py-3 rounded-full font-semibold flex items-center"
              id="google-play-button"
            >
              <span className="mr-2">Google Play</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          id="features-section"
        >
          {/* Daily Entry Feature */}
          <div className="bg-gray-800 p-6 rounded-lg" id="daily-entry-feature">
            <Calendar className="text-purple-400 mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2">Daily Entries</h3>
            <p>Track your progress with daily language learning entries.</p>
          </div>

          {/* Streak Points Feature */}
          <div
            className="bg-gray-800 p-6 rounded-lg"
            id="streak-points-feature"
          >
            <Star className="text-yellow-400 mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2">Streak Points</h3>
            <p>Earn points for every 7-day learning streak you maintain.</p>
          </div>

          {/* Audio Recording Feature */}
          <div
            className="bg-gray-800 p-6 rounded-lg"
            id="audio-recording-feature"
          >
            <Mic className="text-red-400 mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2">Audio Recording</h3>
            <p>Record your pronunciation and track your speaking progress.</p>
          </div>

          {/* Speech Recognition Feature */}
          <div
            className="bg-gray-800 p-6 rounded-lg"
            id="speech-recognition-feature"
          >
            <Volume2 className="text-green-400 mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2">Speech Recognition</h3>
            <p>
              Get feedback on your pronunciation with advanced speech
              recognition.
            </p>
          </div>
        </section>

        {/* App Preview Section */}
        <section className="mt-16 text-center" id="app-preview-section">
          <h3 className="text-3xl font-bold mb-8">See LinguaTrack in Action</h3>
          <div className="bg-gray-800 p-4 rounded-lg inline-block">
            {/* Placeholder for app screenshot or video */}
            <div className="w-64 h-128 bg-gray-700 rounded-lg flex items-center justify-center">
              <p>App Preview</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-center py-6 mt-16">
        <p>&copy; 2024 LinguaTrack. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
