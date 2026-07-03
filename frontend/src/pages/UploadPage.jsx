import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Upload, FileText, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import GoogleLogin from "../components/GoogleLogin";
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { apiFetch, clearSession } from "../lib/api";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    setUser(null);
    clearSession();
    navigate("/");
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Please select a valid PDF or Word document.");
        setFile(null);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    setError(null);
    setLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("document", file);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const res = await apiFetch("/api/generate-quiz/", {
        method: "POST",
        body: formData,
        auth: true,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error:", errorText);
        setError(res.status === 401 ? "Your session has expired. Please sign in again." : "Server error: " + errorText);
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data.id) {
        // Small delay to show completion
        setTimeout(() => {
          navigate(`/quiz/${data.id}`);
        }, 500);
      } else {
        setError("Invalid response from server.");
        setLoading(false);
      }
    } catch (err) {
      clearInterval(progressInterval);
      console.error("Fetch error:", err);
      setError("Failed to upload document. Please try again.");
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar user={user} handleLogout={handleLogout} />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your Quiz
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your document and let AI generate a comprehensive quiz with multiple-choice questions
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {!user ? (
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Sign in to upload a document
              </h2>
              <p className="text-gray-600 mb-6">
                Please sign in with Google to securely generate and save your quizzes.
              </p>
              <div className="flex justify-center">
                <GoogleLogin onLoginSuccess={handleLoginSuccess} />
              </div>
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                    <span className="text-red-800">{error}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                    <span className="text-red-800">{error}</span>
                  </div>
                </div>
              )}

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-50'
                    : file
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {!file ? (
                  <div>
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Drop your document here
                    </h3>
                    <p className="text-gray-600 mb-4">
                      or click to browse files
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      Choose File
                    </button>
                    <p className="text-sm text-gray-500 mt-4">
                      Supports PDF, DOC, DOCX files (max 10MB)
                    </p>
                  </div>
                ) : (
                  <div>
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      File Selected Successfully!
                    </h3>
                    <div className="bg-white rounded-lg p-4 mb-4 inline-block">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-blue-500" />
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)} • {file.type}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Choose different file
                    </button>
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="hidden"
              />

              {/* Progress Bar */}
              {loading && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Generating Quiz...</span>
                    <span className="text-sm text-gray-500">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    This may take a few moments depending on your document size
                  </p>
                </div>
              )}

              {/* Generate Button */}
              {file && !loading && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleUpload}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2 mx-auto"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Quiz</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Multiple Formats</h3>
            <p className="text-gray-600 text-sm">
              Support for PDF, DOC, and DOCX files
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-gray-600 text-sm">
              Advanced AI generates relevant questions
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
            <p className="text-gray-600 text-sm">
              Get your quiz ready in seconds
            </p>
          </div>
        </div>
      </div>

      {/* Footer (same as About page) */}
      <footer className="bg-gray-900 text-white py-12 mt-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Note2Test</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Making learning smarter, faster, and more interactive with AI-generated quizzes. 
                Join thousands of students who have transformed their study experience.
              </p>
              <div className="flex space-x-4">
                <FaFacebook className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <FaTwitter className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <FaLinkedin className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <FaEnvelope className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li
                  className="hover:text-white cursor-pointer transition-colors"
                  onClick={() => navigate('/')}
                >
                  Home
                </li>
                <li
                  className="hover:text-white cursor-pointer transition-colors"
                  onClick={() => navigate('/about')}
                >
                  About
                </li>
                <li
                  className="hover:text-white cursor-pointer transition-colors"
                  onClick={() => navigate('/upload')}
                >
                  Create Quiz
                </li>
                {user && (
                  <li
                    className="hover:text-white cursor-pointer transition-colors"
                    onClick={() => navigate('/profile')}
                  >
                    Profile
                  </li>
                )}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>ajaj4269@gmail.com</li>
                <li>+91 70795 53517</li>
                <li>133207, Mullana, Haryana, India</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Note2Test. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
