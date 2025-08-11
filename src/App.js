import React, { useState, useEffect, useCallback } from 'react';

// Main App component
const App = () => {
  const [targetDate, setTargetDate] = useState(null);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [ageInSeconds, setAgeInSeconds] = useState(0);

  const [messageForm, setMessageForm] = useState({ name: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const [isFormSending, setIsFormSending] = useState(false);

  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminMessages, setAdminMessages] = useState([]);
  const [adminStatus, setAdminStatus] = useState('');
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);

  const birthday = { month: 8, day: 29 }; // August 29th (months are 0-indexed)
  const birthDate = new Date(1990, 8, 29); // Replace with your actual birth date for accurate age calculation

  // --- Countdown Logic ---
  const calculateCountdown = useCallback(() => {
    if (!targetDate) return;
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) {
      // Countdown finished, set it to the next year
      setTargetDate(new Date(targetDate.getFullYear() + 1, birthday.month, birthday.day));
      return;
    }

    const newCountdown = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
    setCountdown(newCountdown);

    // Calculate age in seconds
    const ageDiff = now - birthDate.getTime();
    setAgeInSeconds(Math.floor(ageDiff / 1000));
  }, [targetDate, birthday.month, birthday.day, birthDate]);

  useEffect(() => {
    // Set the initial target date
    const now = new Date();
    let currentYearBirthday = new Date(now.getFullYear(), birthday.month, birthday.day);

    // If birthday has passed this year, target next year
    if (now > currentYearBirthday) {
      currentYearBirthday = new Date(now.getFullYear() + 1, birthday.month, birthday.day);
    }
    setTargetDate(currentYearBirthday);

    const interval = setInterval(() => {
      calculateCountdown();
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [birthday.month, birthday.day, calculateCountdown]);

  // --- Form Submission Logic ---
  const handleFormChange = (e) => {
    setMessageForm({ ...messageForm, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsFormSending(true);
    setFormStatus('Sending message...');

    // This is the URL for your deployed Google Apps Script web app
    // You MUST replace this with your own URL after following the setup steps
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw1OKgYFvM-UgurQT0uap2iNAKHlWFFgezhXK5c-03Wlk4GabK8UHQMcXjJaNW-3pEYig/exec';
    
    // Simulate API call to Google Sheets
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script with simple form submission
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          name: messageForm.name || 'Anonymous',
          message: messageForm.message,
        }).toString(),
      });

      // Since we are using 'no-cors', we can't read the response.
      // We will assume success and handle errors based on the status code of the response
      // or a timeout. For this example, we will just show a success message.
      setFormStatus('Message sent successfully! Thank you.');
      setMessageForm({ name: '', message: '' });

    } catch (error) {
      console.error('Error submitting message:', error);
      setFormStatus('Failed to send message. Please try again.');
    } finally {
      setIsFormSending(false);
    }
  };

  // --- Admin Panel Logic ---
  const handleAdminAuth = async () => {
    if (adminPassword === 'your_secret_password') { // REPLACE 'your_secret_password' with a secure password
      setIsAuthenticated(true);
      setAdminStatus('Fetching messages...');
      setIsFetchingMessages(true);

      // This is the URL for your Google Apps Script web app with the 'read' parameter
      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw1OKgYFvM-UgurQT0uap2iNAKHlWFFgezhXK5c-03Wlk4GabK8UHQMcXjJaNW-3pEYig/exec?action=read';
      
      try {
        const response = await fetch(SCRIPT_URL);
        if (!response.ok) throw new Error('Failed to fetch messages.');

        const data = await response.json();
        // The data from the Google Sheet should be an array of objects
        setAdminMessages(data.data || []);
        setAdminStatus('Messages loaded successfully.');
      } catch (error) {
        console.error('Error fetching messages:', error);
        setAdminStatus('Failed to load messages. Please check your script and network connection.');
      } finally {
        setIsFetchingMessages(false);
      }
    } else {
      setAdminStatus('Incorrect password.');
    }
  };

  // Main UI
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-8">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
          My Birthday Countdown
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mt-2">August 29th is coming!</p>
      </div>

      {/* Countdown Clock */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
        {Object.entries(countdown).map(([unit, value]) => (
          <div key={unit} className="w-40 h-40 flex flex-col items-center justify-center bg-gray-800 rounded-2xl shadow-xl transform transition-transform hover:scale-105 duration-300">
            <span className="text-5xl font-bold text-pink-500">{value.toString().padStart(2, '0')}</span>
            <span className="text-sm text-gray-400 uppercase tracking-wider mt-2">{unit}</span>
          </div>
        ))}
      </div>

      {/* Age in Seconds */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-200">My Age in Seconds</h2>
        <p className="text-4xl md:text-6xl font-bold text-green-400 mt-2">{ageInSeconds.toLocaleString()}</p>
        <p className="text-sm text-gray-500 mt-1">This number is always growing!</p>
      </div>

      {/* Message Form */}
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-400">Leave a Birthday Wish</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Your Name (optional)</label>
            <input
              type="text"
              id="name"
              name="name"
              value={messageForm.name}
              onChange={handleFormChange}
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300">Your Message (advice or a greeting)</label>
            <textarea
              id="message"
              name="message"
              value={messageForm.message}
              onChange={handleFormChange}
              required
              rows="4"
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isFormSending}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-lg hover:from-purple-700 hover:to-pink-700 transform transition-transform hover:scale-105 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFormSending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
        {formStatus && (
          <p className="mt-4 text-center text-sm font-medium text-green-400">
            {formStatus}
          </p>
        )}
      </div>

      {/* Admin Panel Link & Content */}
      <div className="w-full max-w-2xl mt-12 pt-8 border-t border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-6 text-yellow-400">Admin Panel</h2>
        {!isAuthenticated ? (
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-4">
            <input
              type="password"
              placeholder="Enter password to view messages"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full md:w-auto flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
            />
            <button
              onClick={handleAdminAuth}
              className="w-full md:w-auto py-2 px-6 bg-yellow-500 text-gray-900 font-bold rounded-full shadow-lg hover:bg-yellow-600 transition-colors"
            >
              Access Messages
            </button>
          </div>
        ) : (
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-center">Submitted Messages</h3>
            {adminStatus && <p className="text-center text-sm text-gray-400 mb-4">{adminStatus}</p>}
            {isFetchingMessages ? (
              <p className="text-center text-yellow-500">Loading messages...</p>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {adminMessages.length > 0 ? (
                  adminMessages.map((msg, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded-xl shadow">
                      <p className="text-lg font-semibold text-white">
                        {msg.message}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        — {msg.name || 'Anonymous'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400">No messages found yet.</p>
                )}
              </div>
            )}
          </div>
        )}
        {adminStatus && !isAuthenticated && (
          <p className="mt-2 text-center text-sm font-medium text-red-400">
            {adminStatus}
          </p>
        )}
      </div>

    </div>
  );
};

export default App;
