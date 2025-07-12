'use client'
import React, {createContext,useContext, useState, useEffect } from 'react';
import { Upload, Lock, Unlock, Download, AlertCircle, CheckCircle, Eye, EyeOff, Github, Sun, Moon } from 'lucide-react';
import Footer from './components/Footer';
import Header from './components/Header';
import { useTheme } from './context/ThemeContext';
import BG from './components/BG';

export default function AudLockApp() {
  const [activeTab, setActiveTab] = useState('hide');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [key, setKey] = useState('');
  const [extractedMessage, setExtractedMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [useSampleAudio, setUseSampleAudio] = useState(false);
  const {darkMode,setDarkMode,themeClasses}=useTheme();
  const API_BASE = process.env.NEXT_PUBLIC_APIHOST;
  const MAX_FILE_SIZE = 4 * 1024 * 1024;
  const SAMPLE_AUDIO_URL = '/sample_aud.wav';
  const MAX_TEXT_LENGTH = 50;
  const MAX_PASSWORD_LENGTH = 50;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileSizeWarning = (fileSize) => {
    const sizeInMB = fileSize / (1024 * 1024);
    if (sizeInMB >= 3) {
      return {
        level: 'high',
        message: `Large file detected (${formatFileSize(fileSize)}). Processing may take longer.`,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/30'
      };
    } else if (sizeInMB >= 2) {
      return {
        level: 'medium',
        message: `Medium-sized file (${formatFileSize(fileSize)}). Processing time may be extended.`,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30'
      };
    }
    return null;
  };

  const validateFile = (file) => {
    if (!file.type.startsWith('audio/')) {
      return 'Please select an audio file';
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 4MB limit. Current size: ${formatFileSize(file.size)}`;
    }
    return null;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (useSampleAudio) return;
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (useSampleAudio) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const validationError = validateFile(droppedFile);
      
      if (validationError) {
        setError(validationError);
        setFile(null);
      } else {
        setFile(droppedFile);
        setError('');
      }
    }
  };

  const handleFileChange = (e) => {
    // console.log("fc")
    if (useSampleAudio) return;
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validationError = validateFile(selectedFile);
      e.target.value = '';
      if (validationError) {
        setError(validationError);
        setFile(null);
        // e.target.value = '';
      } else {
        setFile(selectedFile);
        setError('');
      }
    }
  };

  const handleMessageChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_TEXT_LENGTH) {
      setMessage(value);
      setError('');
    }
  };

  const handleKeyChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_PASSWORD_LENGTH) {
      setKey(value);
      setError('');
    }
  };

  const resetForm = () => {
    setFile(null);
    setMessage('');
    setKey('');
    setExtractedMessage('');
    setError('');
    setSuccess('');
    setUseSampleAudio(false);
  }

  const handleHideMessage = async () => {
    if (!useSampleAudio && !file) {
      setError('Please upload an audio file or select "Use Sample Audio"');
      return;
    }
    
    if (!message || !key) {
      setError('Please fill in all fields');
      return;
    }

    if (message.length > MAX_TEXT_LENGTH) {
      setError(`Message exceeds ${MAX_TEXT_LENGTH} character limit`);
      return;
    }

    if (key.length > MAX_PASSWORD_LENGTH) {
      setError(`Key exceeds ${MAX_PASSWORD_LENGTH} character limit`);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    const formData = new FormData();
    
    if (!useSampleAudio && file) {
      formData.append('file', file);
    }
    
    formData.append('msg', message);
    formData.append('key', key);
    formData.append('smp', useSampleAudio.toString());
    
    try {
      const response = await fetch(`${API_BASE}/hide`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to hide message');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'stego.wav';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setSuccess('Message hidden successfully! File downloaded.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMessage = async () => {
    if (!file) {
      setError('Please select a file to extract the message from');
      return;
    }

    if (!key) {
      setError('Please enter the decryption key');
      return;
    }

    if (key.length > MAX_PASSWORD_LENGTH) {
      setError(`Key exceeds ${MAX_PASSWORD_LENGTH} character limit`);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    const formData = new FormData();
    
    formData.append('file', file);
    formData.append('key', key);
    
    try {
      const response = await fetch(`${API_BASE}/show`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract message');
      }
      const data = await response.json();
      setExtractedMessage(data.message);
      setSuccess('Message extracted successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses.bg}`}>
     <Header/>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="text-center mb-12 relative">
          <h2 className={`text-4xl md:text-6xl font-bold tracking-widest mb-4 ${themeClasses.text}`} style={{fontFamily: 'Consolas, Monaco, "Cascadia Code", "Roboto Mono", Courier, monospace', letterSpacing: '0.15em'}}>
            AUDLOCK
          </h2>
          <p className={`text-lg md:text-xl ${themeClasses.textSecondary}`}>
            Your secrets, hidden in sound waves
          </p>   
          <BG/>
        </div>

        <div className="flex justify-center mb-12">
          <div className={`inline-flex p-1 rounded-2xl shadow-lg ${themeClasses.cardBg} ${themeClasses.border}`}>
            <button
              onClick={() => {
                setActiveTab('hide');
                resetForm();
              }}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'hide'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : `${themeClasses.textSecondary} hover:${themeClasses.text}`
              }`}
            >
              <Lock className="w-5 h-5 inline mr-2" />
              Hide Message
            </button>
            <button
              onClick={() => {
                setActiveTab('show');
                resetForm();
              }}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'show'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : `${themeClasses.textSecondary} hover:${themeClasses.text}`
              }`}
            >
              <Unlock className="w-5 h-5 inline mr-2" />
              Reveal Message
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className={`backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl ${themeClasses.cardBg} ${themeClasses.border}`}>
            {activeTab === 'hide' && (
              <div className="mb-6">
                <label className={`flex items-center cursor-pointer ${themeClasses.text}`}>
                  <input
                    type="checkbox"
                    checked={useSampleAudio}
                    onChange={(e) => setUseSampleAudio(e.target.checked)}
                    className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Use Sample Audio</span>
                  <span className={`ml-2 text-xs ${themeClasses.textMuted}`}>
                    ((No WAV? No worries. I packed a spare. You’re welcome.
)
                  </span>
                </label>
                {useSampleAudio && (
                  <div className={`mt-2 p-2 rounded-lg text-xs ${themeClasses.textMuted} ${darkMode ? 'bg-slate-800/50' : 'bg-gray-100'}`}>
                    Using sample audio file from server
                  </div>
                )}
              </div>
            )}

            <div className="mb-8">
              <label className={`block text-sm font-medium mb-3 ${themeClasses.text} ${useSampleAudio && activeTab === 'hide' ? 'opacity-50' : ''}`}>
                Audio File
                <span className={`ml-2 text-xs ${themeClasses.textMuted}`}>
                  (Max: 4MB)
                </span>
              </label>
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  useSampleAudio && activeTab === 'hide'
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'cursor-pointer hover:border-blue-400'
                } ${themeClasses.uploadBg} ${themeClasses.uploadBorder} ${themeClasses.uploadBgActive}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="audio/wav"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  disabled={useSampleAudio && activeTab === 'hide'}
                />
                <label htmlFor="file-upload" className={useSampleAudio && activeTab === 'hide' ? 'cursor-not-allowed' : 'cursor-pointer'}>
                  <div className="flex flex-col items-center">
                    <div className={`p-4 rounded-full mb-4 transition-all duration-300 ${
                      useSampleAudio && activeTab === 'hide'
                        ? (darkMode ? 'bg-slate-700/30' : 'bg-gray-200/50')
                        : file 
                          ? 'bg-green-500/20' 
                          : (darkMode ? 'bg-slate-700/50' : 'bg-gray-200')
                    }`}>
                      <Upload className={`w-8 h-8 ${
                        useSampleAudio && activeTab === 'hide'
                          ? `${themeClasses.textMuted} opacity-50`
                          : file 
                            ? 'text-green-500' 
                            : themeClasses.textMuted
                      }`} />
                    </div>
                    <p className={`text-lg font-medium mb-2 ${themeClasses.text} ${useSampleAudio && activeTab === 'hide' ? 'opacity-50' : ''}`}>
                      {useSampleAudio && activeTab === 'hide'
                        ? 'Sample audio will be used' 
                        : file 
                          ? file.name 
                          : 'Drop your audio file here'
                      }
                    </p>
                    <p className={`text-sm ${themeClasses.textMuted} ${useSampleAudio && activeTab === 'hide' ? 'opacity-50' : ''}`}>
                      {useSampleAudio && activeTab === 'hide'
                        ? 'Uncheck "Use Sample Audio" to upload your own file'
                        : 'Or click to browse • WAV supported • Max 4MB'
                      }
                    </p>
                    {file && !(useSampleAudio && activeTab === 'hide') && (
                      <p className={`text-xs mt-2 ${themeClasses.textMuted}`}>
                        Size: {formatFileSize(file.size)}
                      </p>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {file && !(useSampleAudio && activeTab === 'hide') && getFileSizeWarning(file.size) && (
              <div className={`mt-4 p-3 rounded-xl flex items-start ${getFileSizeWarning(file.size).bgColor} ${getFileSizeWarning(file.size).borderColor} border`}>
                <AlertCircle className={`w-4 h-4 mr-2 flex-shrink-0 mt-0.5 ${getFileSizeWarning(file.size).color}`} />
                <span className={`text-sm ${getFileSizeWarning(file.size).color}`}>
                  {getFileSizeWarning(file.size).message}
                </span>
              </div>
            )}

            {error && (error.includes('File size exceeds') || error.includes('Please select an audio file') || error.includes('Failed to load sample audio')) && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start text-red-400">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {activeTab === 'hide' && (
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-3 ${themeClasses.text}`}>
                  Secret Message
                  <span className={`ml-2 text-xs ${themeClasses.textMuted}`}>
                    ({message.length}/{MAX_TEXT_LENGTH})
                  </span>
                </label>
                <textarea
                  value={message}
                  onChange={handleMessageChange}
                  placeholder="Enter your secret message here..."
                  className={`w-full px-4 py-3 rounded-xl transition-all duration-300 ${themeClasses.inputBg} ${themeClasses.inputBorder} ${themeClasses.text} ${themeClasses.inputFocus} placeholder-gray-400 focus:outline-none focus:ring-2 border ${
                    message.length === MAX_TEXT_LENGTH ? 'border-yellow-500' : ''
                  }`}
                  rows="4"
                  maxLength={MAX_TEXT_LENGTH}
                />
                {message.length >= MAX_TEXT_LENGTH * 0.8 && (
                  <p className={`text-xs mt-1 ${message.length === MAX_TEXT_LENGTH ? 'text-yellow-500' : themeClasses.textMuted}`}>
                    {message.length === MAX_TEXT_LENGTH ? 'Character limit reached' : `${MAX_TEXT_LENGTH - message.length} characters remaining`}
                  </p>
                )}
              </div>
            )}

            <div className="mb-8">
              <label className={`block text-sm font-medium mb-3 ${themeClasses.text}`}>
                Encryption Key
                <span className={`ml-2 text-xs ${themeClasses.textMuted}`}>
                  ({key.length}/{MAX_PASSWORD_LENGTH})
                </span>
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={key}
                  onChange={handleKeyChange}
                  placeholder="Enter your encryption key..."
                  className={`w-full px-4 py-3 rounded-xl pr-12 transition-all duration-300 ${themeClasses.inputBg} ${themeClasses.inputBorder} ${themeClasses.text} ${themeClasses.inputFocus} placeholder-gray-400 focus:outline-none focus:ring-2 border ${
                    key.length === MAX_PASSWORD_LENGTH ? 'border-yellow-500' : ''
                  }`}
                  maxLength={MAX_PASSWORD_LENGTH}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${themeClasses.textMuted} hover:${themeClasses.text}`}
                >
                  {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {key.length >= MAX_PASSWORD_LENGTH * 0.8 && (
                <p className={`text-xs mt-1 ${key.length === MAX_PASSWORD_LENGTH ? 'text-yellow-500' : themeClasses.textMuted}`}>
                  {key.length === MAX_PASSWORD_LENGTH ? 'Character limit reached' : `${MAX_PASSWORD_LENGTH - key.length} characters remaining`}
                </p>
              )}
            </div>

            <button
              onClick={activeTab === 'hide' ? handleHideMessage : handleShowMessage}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {activeTab === 'hide' ? (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Hide Message & Download
                    </>
                  ) : (
                    <>
                      <Unlock className="w-5 h-5 mr-2" />
                      Reveal Message
                    </>
                  )}
                </div>
              )}
            </button>

            {error && !(error.includes('File size exceeds') || error.includes('Please select an audio file')) && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start text-red-400">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-start text-green-400">
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            {extractedMessage && (
              <div className={`mt-6 p-4 rounded-xl ${themeClasses.inputBg} ${themeClasses.border} border`}>
                <h3 className={`font-medium mb-3 ${themeClasses.text}`}>Extracted Message:</h3>
                <div className={`p-4 rounded-lg font-mono text-sm break-words ${darkMode ? 'bg-slate-800/50' : 'bg-gray-100'} ${themeClasses.text}`}>
                  {extractedMessage}
                </div>
              </div>

              
            )}
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}